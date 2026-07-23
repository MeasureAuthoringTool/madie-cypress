#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const summaryFile =
  process.argv[2] ||
  process.env.FAILED_TEST_SUMMARY ||
  (process.env.BUILD_NUMBER ? `failure-summary-${process.env.BUILD_NUMBER}.json` : '')
const configFile = process.argv[3] || process.env.CYPRESS_RERUN_CONFIG || 'test'
const rerunMetadataFile =
  process.argv[4] ||
  process.env.RERUN_METADATA_FILE ||
  process.env.RERUN_TARGETING_FILE ||
  ''
const browser = process.env.CYPRESS_RERUN_BROWSER || 'chrome'
const headed = process.env.CYPRESS_RERUN_HEADED !== 'false'

if (!summaryFile) {
  console.error('Missing failure summary file. Set FAILED_TEST_SUMMARY or pass it as the first argument.')
  process.exit(1)
}

if (!fs.existsSync(summaryFile)) {
  console.error(`Failure summary file not found: ${summaryFile}`)
  process.exit(1)
}

const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'))
const failures = Array.isArray(summary.failures) ? summary.failures : []
const missingSpecs = Array.isArray(summary.execution && summary.execution.missingSpecs)
  ? summary.execution.missingSpecs
  : []
const targetTitlesBySpec = new Map()
const fullSpecFallbacks = new Set()

function isTargetableFailure(failure) {
  if (!failure || !failure.file || !failure.title) {
    return false
  }

  return !failure.title.startsWith('Hook:') &&
    !failure.title.includes('Failure details unavailable')
}

for (const failure of failures) {
  if (isTargetableFailure(failure)) {
    const titles = targetTitlesBySpec.get(failure.file) || new Set()
    titles.add(failure.title)
    targetTitlesBySpec.set(failure.file, titles)
  } else if (failure && failure.file) {
    fullSpecFallbacks.add(failure.file)
  }
}

for (const spec of fullSpecFallbacks) {
  targetTitlesBySpec.delete(spec)
}

for (const spec of missingSpecs) {
  if (spec) {
    fullSpecFallbacks.add(spec)
    targetTitlesBySpec.delete(spec)
  }
}

const targetSpecs = Array.from(targetTitlesBySpec.keys())
const fallbackSpecs = Array.from(fullSpecFallbacks)
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true })
}

function writeRerunMetadata() {
  if (!rerunMetadataFile) {
    return
  }

  const targetedTestsBySpec = Object.fromEntries(
    Array.from(targetTitlesBySpec.entries()).map(([spec, titles]) => [spec, Array.from(titles)])
  )
  const targetedTestCount = Object.values(targetedTestsBySpec).reduce((count, titles) => count + titles.length, 0)
  const metadata = {
    generatedAt: new Date().toISOString(),
    summaryFile: path.resolve(summaryFile),
    configFile,
    sourceFailureCount: failures.length,
    targetableFailureCount: targetedTestCount,
    targetedSpecCount: targetSpecs.length,
    targetedTestCount,
    missingSpecCount: missingSpecs.length,
    missingSpecs,
    fallbackSpecCount: fallbackSpecs.length,
    targetedTestsBySpec,
    fallbackSpecs
  }

  ensureParentDir(rerunMetadataFile)
  fs.writeFileSync(path.resolve(rerunMetadataFile), JSON.stringify(metadata, null, 2) + '\n')
  console.log(`Wrote rerun metadata -> ${path.resolve(rerunMetadataFile)}`)
}

function runCypress(specs, extraEnv = {}) {
  if (!specs.length) {
    return 0
  }

  const envPairs = [`configFile=${configFile}`]
  for (const [key, value] of Object.entries(extraEnv)) {
    envPairs.push(`${key}=${value}`)
  }

  const args = [
    'cypress',
    'run',
    '--env',
    envPairs.join(','),
    '--browser',
    browser,
    '--spec',
    specs.join(',')
  ]

  if (headed) {
    args.push('--headed')
  }

  console.log(`Running ${specs.length} spec(s):`)
  for (const spec of specs) {
    console.log(`  - ${spec}`)
  }

  const result = spawnSync(npx, args, {
    stdio: 'inherit',
    env: { ...process.env, NO_COLOR: '1' }
  })

  return result.status || 0
}

let status = 0

writeRerunMetadata()

if (targetSpecs.length) {
  const failedTestsBySpec = Object.fromEntries(
    Array.from(targetTitlesBySpec.entries()).map(([spec, titles]) => [spec, Array.from(titles)])
  )
  const failedTestCount = Object.values(failedTestsBySpec).reduce((count, titles) => count + titles.length, 0)
  const encodedTests = Buffer.from(JSON.stringify(failedTestsBySpec), 'utf8').toString('base64')

  console.log(`Rerunning ${failedTestCount} failed test(s) across ${targetSpecs.length} spec file(s).`)
  const targetedStatus = runCypress(targetSpecs, { failedTestsBase64: encodedTests })
  status = status || targetedStatus
} else {
  console.log('No targetable failed test titles found.')
}

if (fallbackSpecs.length) {
  console.log(`Rerunning ${fallbackSpecs.length} full spec file(s) because they had hook or unavailable failure details.`)
  const fallbackStatus = runCypress(fallbackSpecs)
  status = status || fallbackStatus
}

if (!targetSpecs.length && !fallbackSpecs.length) {
  console.log('No failed tests or fallback specs found in failure summary.')
}

process.exit(status)
