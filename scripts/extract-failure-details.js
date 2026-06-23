/**
 * Extract failing Cypress spec files and human-readable failing test details.
 *
 * Usage:
 *   node scripts/extract-failure-details.js <spec-output-file> <details-output-file> [run-label]
 *
 * The spec output keeps the existing pipeline contract: one failed spec path
 * per line, suitable for rerunning whole files. The details output is for
 * people: it groups failures by spec and includes the failing test or hook
 * title plus the first captured error line.
 */

const fs = require('fs')
const path = require('path')

const specOutputFile = process.argv[2]
const detailsOutputFile = process.argv[3]
const runLabel = process.argv[4] || 'Cypress failures'

if (!specOutputFile || !detailsOutputFile) {
  console.error('Usage: node scripts/extract-failure-details.js <spec-output-file> <details-output-file> [run-label]')
  process.exit(1)
}

const rootDir = path.resolve(__dirname, '..')
const mochawesomeDir = path.join(rootDir, 'cypress', 'results')
const runnerResultsDir = path.join(rootDir, 'runner-results')

const failedSpecs = new Set()
const failures = []
const seenFailures = new Set()

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true })
}

function writeOutputs() {
  ensureParentDir(specOutputFile)
  ensureParentDir(detailsOutputFile)

  const specs = Array.from(failedSpecs)
  fs.writeFileSync(specOutputFile, specs.join('\n') + (specs.length ? '\n' : ''))

  if (!failures.length) {
    fs.writeFileSync(detailsOutputFile, `${runLabel}\n\nNo failing tests found.\n`)
    return
  }

  const lines = [runLabel, '']
  let currentFile = null

  for (const failure of failures) {
    if (failure.file !== currentFile) {
      currentFile = failure.file
      lines.push(failure.file)
    }

    lines.push(`  - ${failure.title}`)
    if (failure.error) {
      lines.push(`    ${failure.error}`)
    }
    lines.push('')
  }

  fs.writeFileSync(detailsOutputFile, lines.join('\n'))
}

function firstErrorLine(err) {
  if (!err) {
    return ''
  }

  const message = err.message || err.estack || err.stack || String(err)
  return String(message).split(/\r?\n/).map(line => line.trim()).find(Boolean) || ''
}

function addFailure(file, title, err) {
  if (!file) {
    return
  }

  const failureTitle = title || 'Unknown failing test or hook'
  const error = firstErrorLine(err)
  const key = `${file}\u0000${failureTitle}\u0000${error}`

  failedSpecs.add(file)

  if (seenFailures.has(key)) {
    return
  }

  seenFailures.add(key)
  failures.push({ file, title: failureTitle, error })
}

function isFailed(item) {
  return Boolean(item && (item.fail === true || item.state === 'failed'))
}

function hookTitle(hook) {
  const title = hook.fullTitle || hook.title || 'Unknown hook'
  return title.startsWith('Hook:') ? title : `Hook: ${title}`
}

function walkSuite(suite, specFile) {
  for (const hook of suite.beforeHooks || []) {
    if (isFailed(hook)) {
      addFailure(specFile, hookTitle(hook), hook.err)
    }
  }

  for (const test of suite.tests || []) {
    if (isFailed(test)) {
      addFailure(specFile, test.fullTitle || test.title, test.err)
    }
  }

  for (const childSuite of suite.suites || []) {
    walkSuite(childSuite, specFile)
  }

  for (const hook of suite.afterHooks || []) {
    if (isFailed(hook)) {
      addFailure(specFile, hookTitle(hook), hook.err)
    }
  }
}

function extractFromMochawesome() {
  if (!fs.existsSync(mochawesomeDir)) {
    return false
  }

  const jsonFiles = fs.readdirSync(mochawesomeDir).filter(file => file.endsWith('.json'))
  if (!jsonFiles.length) {
    return false
  }

  for (const jsonFile of jsonFiles) {
    let report
    try {
      report = JSON.parse(fs.readFileSync(path.join(mochawesomeDir, jsonFile), 'utf8'))
    } catch (err) {
      console.warn(`WARNING: Could not parse ${jsonFile}: ${err.message}`)
      continue
    }

    for (const result of report.results || []) {
      const specFile = result.fullFile || result.file
      const failuresBeforeResult = failures.length

      for (const hook of result.beforeHooks || []) {
        if (isFailed(hook)) {
          addFailure(specFile, hookTitle(hook), hook.err)
        }
      }

      for (const test of result.tests || []) {
        if (isFailed(test)) {
          addFailure(specFile, test.fullTitle || test.title, test.err)
        }
      }

      for (const suite of result.suites || []) {
        walkSuite(suite, specFile)
      }

      for (const hook of result.afterHooks || []) {
        if (isFailed(hook)) {
          addFailure(specFile, hookTitle(hook), hook.err)
        }
      }

      if (specFile && report.stats && report.stats.failures > 0) {
        failedSpecs.add(specFile)

        if (failures.length === failuresBeforeResult) {
          addFailure(
            specFile,
            'Failure details unavailable from Mochawesome test nodes. See Mochawesome report or Cypress console output.',
            ''
          )
        }
      }
    }
  }

  return true
}

function extractFallbackFromRunnerResults() {
  if (!fs.existsSync(runnerResultsDir)) {
    return
  }

  const jsonFiles = fs.readdirSync(runnerResultsDir).filter(file => file.endsWith('.json'))

  for (const jsonFile of jsonFiles) {
    let report
    try {
      report = JSON.parse(fs.readFileSync(path.join(runnerResultsDir, jsonFile), 'utf8'))
    } catch (err) {
      console.warn(`WARNING: Could not parse ${jsonFile}: ${err.message}`)
      continue
    }

    if (report.failures > 0 && report.file) {
      addFailure(report.file, 'Failure details unavailable from runner-results JSON. See Mochawesome report or Cypress console output.', '')
    }
  }
}

const hadMochawesome = extractFromMochawesome()
if (!hadMochawesome) {
  extractFallbackFromRunnerResults()
}

writeOutputs()

console.log(`Extracted ${failedSpecs.size} failing spec(s) -> ${specOutputFile}`)
console.log(`Wrote failure details -> ${detailsOutputFile}`)
