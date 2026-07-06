/**
 * Extract failing Cypress spec files and human-readable failing test details.
 *
 * Usage:
 *   node scripts/extract-failure-details.js spec-output-file details-output-file [summary-json-file] [run-label]
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
const maybeSummaryJsonFile = process.argv[4]
const hasSummaryOutput = Boolean(
  maybeSummaryJsonFile &&
  maybeSummaryJsonFile.endsWith('.json')
)
const summaryJsonFile = hasSummaryOutput ? maybeSummaryJsonFile : null
const runLabel = (hasSummaryOutput ? process.argv[5] : process.argv[4]) || 'Cypress failures'
const rerunTargetingFile = process.env.RERUN_TARGETING_FILE || ''

if (!specOutputFile || !detailsOutputFile) {
  console.error('Usage: node scripts/extract-failure-details.js spec-output-file details-output-file [summary-json-file] [run-label]')
  process.exit(1)
}

const rootDir = path.resolve(__dirname, '..')
const mochawesomeDir = path.join(rootDir, 'cypress', 'results')
const runnerResultsDir = path.join(rootDir, 'runner-results')
const allowedOutputDirs = [rootDir]

const resolvedSpecOutputFile = resolveOutputPath(specOutputFile)
const resolvedDetailsOutputFile = resolveOutputPath(detailsOutputFile)
const resolvedSummaryJsonFile = summaryJsonFile ? resolveOutputPath(summaryJsonFile) : null

const failedSpecs = new Set()
const failures = []
const seenFailures = new Set()
const runMetrics = {
  executedSpecs: new Set(),
  testsRegistered: 0,
  testsPassing: 0,
  testsFailing: 0,
  testsPending: 0,
  testsSkipped: 0,
  screenshots: 0,
  durationMs: 0,
  usedMochawesome: false,
  usedRunnerResultsFallback: false
}
const rerunTargeting = readRerunTargeting(rerunTargetingFile)

function isInsideDir(filePath, dirPath) {
  const relativePath = path.relative(dirPath, filePath)
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
}

function resolveOutputPath(filePath) {
  const resolvedPath = path.resolve(filePath)

  if (!allowedOutputDirs.some(dirPath => isInsideDir(resolvedPath, dirPath))) {
    throw new Error(`Output path must be inside the workspace: ${filePath}`)
  }

  return resolvedPath
}

function resolveJsonPath(baseDir, fileName) {
  const resolvedPath = path.resolve(baseDir, fileName)

  if (!fileName.endsWith('.json') || path.basename(fileName) !== fileName || !isInsideDir(resolvedPath, baseDir)) {
    throw new Error(`Unexpected report file path: ${fileName}`)
  }

  return resolvedPath
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function writeOutputs() {
  ensureParentDir(resolvedSpecOutputFile)
  ensureParentDir(resolvedDetailsOutputFile)
  if (resolvedSummaryJsonFile) {
    ensureParentDir(resolvedSummaryJsonFile)
  }

  const specs = Array.from(failedSpecs)
  fs.writeFileSync(resolvedSpecOutputFile, specs.join('\n') + (specs.length ? '\n' : ''))

  if (!failures.length) {
    fs.writeFileSync(resolvedDetailsOutputFile, `${runLabel}\n\nNo failing tests found.\n`)
    writeSummaryOutputs(specs)
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

  fs.writeFileSync(resolvedDetailsOutputFile, lines.join('\n'))
  writeSummaryOutputs(specs)
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

function classifyFailure(error) {
  if (!error) {
    return 'Unknown'
  }

  if (error.includes('No users available') || error.includes('SessionLogin') || error.includes('Okta')) {
    return 'Authentication or session'
  }

  if (error.includes('cy.request() failed') || error.includes('status code') || error.includes('ECONNREFUSED') || error.includes('ETIMEDOUT')) {
    return 'API or network'
  }

  if (error.includes('Expected to find element') || error.includes('never found it')) {
    return 'Element not found'
  }

  if (error.includes('Timed out retrying')) {
    return 'Timeout'
  }

  if (error.includes('cy.click() failed because the page updated')) {
    return 'DOM update during click'
  }

  if (error.includes('Special character sequence')) {
    return 'Cypress typing error'
  }

  if (error.includes('AssertionError')) {
    return 'Assertion failure'
  }

  if (error.includes('CypressError')) {
    return 'Cypress command error'
  }

  return 'Unclassified'
}

function normalizeErrorSignature(error) {
  if (!error) {
    return 'No error message captured'
  }

  return error
    .replace(/after \d+ms/g, 'after <duration>ms')
    .replace(/#mui-\d+/g, '#mui-<id>')
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, '<uuid>')
    .replace(/\b\d{10,}\b/g, '<number>')
}

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item)
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})
}

function topCounts(counts, limit = 10) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }))
}

function buildSummary(specs) {
  const enrichedFailures = failures.map(failure => {
    const errorType = classifyFailure(failure.error)
    const errorSignature = normalizeErrorSignature(failure.error)
    return {
      file: failure.file,
      title: failure.title,
      errorType,
      errorSignature,
      error: failure.error
    }
  })

  const failureTypes = countBy(enrichedFailures, failure => failure.errorType)
  const errorSignatures = countBy(enrichedFailures, failure => failure.errorSignature)

  return {
    runLabel,
    generatedAt: new Date().toISOString(),
    failedSpecCount: specs.length,
    failedTestCount: enrichedFailures.length,
    execution: {
      executedSpecCount: runMetrics.executedSpecs.size,
      testsRegistered: runMetrics.testsRegistered,
      testsPassing: runMetrics.testsPassing,
      testsFailing: runMetrics.testsFailing,
      testsPending: runMetrics.testsPending,
      testsSkipped: runMetrics.testsSkipped,
      filteredOut: 0,
      screenshots: runMetrics.screenshots,
      durationMs: runMetrics.durationMs,
      source: runMetrics.usedMochawesome
        ? 'mochawesome'
        : runMetrics.usedRunnerResultsFallback
          ? 'runner-results fallback'
          : 'no report data'
    },
    targeting: rerunTargeting,
    failureTypes,
    topErrorSignatures: topCounts(errorSignatures),
    failures: enrichedFailures
  }
}

function emptyRerunTargeting() {
  return {
    sourceFailureCount: 0,
    targetableFailureCount: 0,
    targetedSpecCount: 0,
    targetedTestCount: 0,
    fallbackSpecCount: 0,
    targetedTestsBySpec: {},
    fallbackSpecs: []
  }
}

function readRerunTargeting(filePath) {
  if (!filePath) {
    return emptyRerunTargeting()
  }

  const resolvedPath = path.resolve(filePath)
  if (!fs.existsSync(resolvedPath)) {
    return emptyRerunTargeting()
  }

  try {
    const targeting = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
    const targetedTestsBySpec = targeting.targetedTestsBySpec && typeof targeting.targetedTestsBySpec === 'object'
      ? targeting.targetedTestsBySpec
      : {}
    const fallbackSpecs = Array.isArray(targeting.fallbackSpecs) ? targeting.fallbackSpecs : []
    const targetedSpecCount = Number(targeting.targetedSpecCount) || Object.keys(targetedTestsBySpec).length
    const targetedTestCount = Number(targeting.targetedTestCount) || Object.values(targetedTestsBySpec).reduce(
      (count, titles) => count + (Array.isArray(titles) ? titles.length : 0),
      0
    )

    return {
      sourceFailureCount: Number(targeting.sourceFailureCount) || 0,
      targetableFailureCount: Number(targeting.targetableFailureCount) || targetedTestCount,
      targetedSpecCount,
      targetedTestCount,
      fallbackSpecCount: Number(targeting.fallbackSpecCount) || fallbackSpecs.length,
      targetedTestsBySpec,
      fallbackSpecs
    }
  } catch (err) {
    console.warn(`WARNING: Could not parse rerun targeting file ${resolvedPath}: ${err.message}`)
    return emptyRerunTargeting()
  }
}

function writeSummaryOutputs(specs) {
  if (!resolvedSummaryJsonFile) {
    return
  }

  const summary = buildSummary(specs)
  fs.writeFileSync(resolvedSummaryJsonFile, JSON.stringify(summary, null, 2) + '\n')
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
      report = JSON.parse(fs.readFileSync(resolveJsonPath(mochawesomeDir, jsonFile), 'utf8'))
    } catch (err) {
      console.warn(`WARNING: Could not parse ${jsonFile}: ${err.message}`)
      continue
    }

    runMetrics.usedMochawesome = true
    runMetrics.testsRegistered += Number(report.stats && report.stats.tests) || 0
    runMetrics.testsPassing += Number(report.stats && report.stats.passes) || 0
    runMetrics.testsFailing += Number(report.stats && report.stats.failures) || 0
    runMetrics.testsPending += Number(report.stats && report.stats.pending) || 0
    runMetrics.testsSkipped += Number(report.stats && report.stats.skipped) || 0
    runMetrics.screenshots += Number(report.stats && report.stats.screenshots) || 0
    runMetrics.durationMs += Number(report.stats && report.stats.duration) || 0

    for (const result of report.results || []) {
      const specFile = result.fullFile || result.file
      const failuresBeforeResult = failures.length

      if (specFile) {
        runMetrics.executedSpecs.add(specFile)
      }

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
  runMetrics.usedRunnerResultsFallback = jsonFiles.length > 0

  for (const jsonFile of jsonFiles) {
    let report
    try {
      report = JSON.parse(fs.readFileSync(resolveJsonPath(runnerResultsDir, jsonFile), 'utf8'))
    } catch (err) {
      console.warn(`WARNING: Could not parse ${jsonFile}: ${err.message}`)
      continue
    }

    if (report.failures > 0 && report.file) {
      runMetrics.executedSpecs.add(report.file)
      addFailure(report.file, 'Failure details unavailable from runner-results JSON. See Mochawesome report or Cypress console output.', '')
    }
  }
}

const hadMochawesome = extractFromMochawesome()
if (!hadMochawesome) {
  extractFallbackFromRunnerResults()
}

writeOutputs()

console.log(`Extracted ${failedSpecs.size} failing spec(s) -> ${resolvedSpecOutputFile}`)
console.log(`Wrote failure details -> ${resolvedDetailsOutputFile}`)
