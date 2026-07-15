/**
 * Compare initial and rerun failure summaries to identify flaky and persistent failures.
 *
 * Usage:
 *   node scripts/summarize-failure-runs.js initial-summary.json rerun1-summary.json rerun2-summary.json trend-json-file trend-md-file
 */

const fs = require('fs')
const path = require('path')

const initialSummaryFile = process.argv[2]
const rerun1SummaryFile = process.argv[3]
const rerun2SummaryFile = process.argv[4]
const trendJsonFile = process.argv[5]
const trendMdFile = process.argv[6]

if (!initialSummaryFile || !rerun1SummaryFile || !rerun2SummaryFile || !trendJsonFile || !trendMdFile) {
  console.error('Usage: node scripts/summarize-failure-runs.js initial-summary.json rerun1-summary.json rerun2-summary.json trend-json-file trend-md-file')
  process.exit(1)
}

const rootDir = path.resolve(__dirname, '..')

const resolvedInitialSummaryFile = resolveWorkspacePath(initialSummaryFile)
const resolvedRerun1SummaryFile = resolveWorkspacePath(rerun1SummaryFile)
const resolvedRerun2SummaryFile = resolveWorkspacePath(rerun2SummaryFile)
const resolvedTrendJsonFile = resolveWorkspacePath(trendJsonFile)
const resolvedTrendMdFile = resolveWorkspacePath(trendMdFile)

function isInsideDir(filePath, dirPath) {
  const relativePath = path.relative(dirPath, filePath)
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
}

function resolveWorkspacePath(filePath) {
  const resolvedPath = path.resolve(filePath)

  if (!isInsideDir(resolvedPath, rootDir)) {
    throw new Error(`Path must be inside the workspace: ${filePath}`)
  }

  return resolvedPath
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function readSummary(filePath, fallbackLabel) {
  if (!fs.existsSync(filePath)) {
    return emptySummary(fallbackLabel)
  }

  const content = fs.readFileSync(filePath, 'utf8').trim()
  if (!content) {
    return emptySummary(fallbackLabel)
  }

  const summary = JSON.parse(content)
  return {
    runLabel: summary.runLabel || fallbackLabel,
    failedSpecCount: summary.failedSpecCount || 0,
    failedTestCount: summary.failedTestCount || 0,
    execution: normalizeExecution(summary.execution),
    targeting: normalizeTargeting(summary.targeting),
    failureTypes: summary.failureTypes || {},
    topErrorSignatures: summary.topErrorSignatures || [],
    failures: Array.isArray(summary.failures) ? summary.failures : []
  }
}

function emptySummary(runLabel) {
  return {
    runLabel,
    failedSpecCount: 0,
    failedTestCount: 0,
    execution: normalizeExecution(null),
    targeting: normalizeTargeting(null),
    failureTypes: {},
    topErrorSignatures: [],
    failures: []
  }
}

function normalizeExecution(execution) {
  return {
    plannedSpecCount: Number(execution && execution.plannedSpecCount) || 0,
    executedSpecCount: Number(execution && execution.executedSpecCount) || 0,
    missingSpecCount: Number(execution && execution.missingSpecCount) || 0,
    missingSpecs: Array.isArray(execution && execution.missingSpecs) ? execution.missingSpecs : [],
    testsRegistered: Number(execution && execution.testsRegistered) || 0,
    testsPassing: Number(execution && execution.testsPassing) || 0,
    testsFailing: Number(execution && execution.testsFailing) || 0,
    testsPending: Number(execution && execution.testsPending) || 0,
    testsSkipped: Number(execution && execution.testsSkipped) || 0,
    filteredOut: Number(execution && execution.filteredOut) || 0,
    screenshots: Number(execution && execution.screenshots) || 0,
    durationMs: Number(execution && execution.durationMs) || 0,
    source: (execution && execution.source) || 'no report data'
  }
}

function normalizeTargeting(targeting) {
  const targetedTestsBySpec = targeting && targeting.targetedTestsBySpec && typeof targeting.targetedTestsBySpec === 'object'
    ? targeting.targetedTestsBySpec
    : {}
  const fallbackSpecs = targeting && Array.isArray(targeting.fallbackSpecs) ? targeting.fallbackSpecs : []
  const missingSpecs = targeting && Array.isArray(targeting.missingSpecs) ? targeting.missingSpecs : []
  const targetedSpecCount = Number(targeting && targeting.targetedSpecCount) || Object.keys(targetedTestsBySpec).length
  const targetedTestCount = Number(targeting && targeting.targetedTestCount) || Object.values(targetedTestsBySpec).reduce(
    (count, titles) => count + (Array.isArray(titles) ? titles.length : 0),
    0
  )
  return {
    sourceFailureCount: Number(targeting && targeting.sourceFailureCount) || 0,
    targetableFailureCount: Number(targeting && targeting.targetableFailureCount) || targetedTestCount,
    targetedSpecCount,
    targetedTestCount,
    missingSpecCount: Number(targeting && targeting.missingSpecCount) || missingSpecs.length,
    missingSpecs,
    fallbackSpecCount: Number(targeting && targeting.fallbackSpecCount) || fallbackSpecs.length,
    targetedTestsBySpec,
    fallbackSpecs
  }
}

function failureKey(failure) {
  return `${failure.file}\u0000${failure.title}`
}

function mapFailures(summary) {
  return new Map(summary.failures.map(failure => [failureKey(failure), failure]))
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

function buildTrend(initialSummary, rerun1Summary, rerun2Summary) {
  const initialFailures = mapFailures(initialSummary)
  const rerun1Failures = mapFailures(rerun1Summary)
  const rerun2Failures = mapFailures(rerun2Summary)
  const allKeys = new Set([...initialFailures.keys(), ...rerun1Failures.keys(), ...rerun2Failures.keys()])
  const classifiedFailures = []

  for (const key of allKeys) {
    const initial = initialFailures.get(key)
    const rerun1 = rerun1Failures.get(key)
    const rerun2 = rerun2Failures.get(key)
    const representative = rerun2 || rerun1 || initial

    classifiedFailures.push({
      file: representative.file,
      title: representative.title,
      errorType: representative.errorType || 'Unknown',
      errorSignature: representative.errorSignature || representative.error || 'No error message captured',
      status: classifyRunStatus(Boolean(initial), Boolean(rerun1), Boolean(rerun2)),
      failedInitial: Boolean(initial),
      failedRerun1: Boolean(rerun1),
      failedRerun2: Boolean(rerun2)
    })
  }

  const statusCounts = countBy(classifiedFailures, failure => failure.status)
  const persistentFailures = classifiedFailures.filter(failure => failure.status === 'Persistent failure')
  const flakyFailures = classifiedFailures.filter(failure => failure.status.startsWith('Flaky'))
  const newRerunFailures = classifiedFailures.filter(failure => failure.status === 'New rerun failure')
  const runPhases = buildRunPhases(initialSummary, rerun1Summary, rerun2Summary)

  return {
    generatedAt: new Date().toISOString(),
    outcome: classifyOverallOutcome(initialSummary, rerun1Summary, rerun2Summary),
    counts: {
      initialFailedSpecs: initialSummary.failedSpecCount,
      initialFailedTests: initialSummary.failedTestCount,
      rerun1FailedSpecs: rerun1Summary.failedSpecCount,
      rerun1FailedTests: rerun1Summary.failedTestCount,
      rerun2FailedSpecs: rerun2Summary.failedSpecCount,
      rerun2FailedTests: rerun2Summary.failedTestCount,
      flakyFailures: flakyFailures.length,
      persistentFailures: persistentFailures.length,
      newRerunFailures: newRerunFailures.length
    },
    runs: runPhases,
    statusCounts,
    topPersistentErrorTypes: topCounts(countBy(persistentFailures, failure => failure.errorType)),
    topFlakyErrorTypes: topCounts(countBy(flakyFailures, failure => failure.errorType)),
    classifiedFailures
  }
}

function buildRunPhases(initialSummary, rerun1Summary, rerun2Summary) {
  const initial = {
    name: 'Initial run',
    execution: initialSummary.execution,
    failedSpecCount: initialSummary.failedSpecCount,
    failedTestCount: initialSummary.failedTestCount
  }

  const rerun1 = buildRerunPhase('Rerun #1', rerun1Summary)
  const rerun2 = buildRerunPhase('Rerun #2', rerun2Summary)

  return { initial, rerun1, rerun2 }
}

function buildRerunPhase(name, summary) {
  const execution = { ...summary.execution }
  execution.filteredOut = Math.max(execution.testsRegistered - execution.testsPassing - execution.testsFailing, 0)

  return {
    name,
    execution,
    targeting: summary.targeting,
    failedSpecCount: summary.failedSpecCount,
    failedTestCount: summary.failedTestCount
  }
}

function classifyOverallOutcome(initialSummary, rerun1Summary, rerun2Summary) {
  if (initialSummary.failedSpecCount === 0) {
    return 'Passed on initial run'
  }

  if (rerun1Summary.failedSpecCount === 0) {
    return 'Passed after rerun #1'
  }

  if (rerun2Summary.failedSpecCount === 0) {
    return 'Passed after rerun #2'
  }

  return 'Failures remained after rerun #2'
}

function classifyRunStatus(failedInitial, failedRerun1, failedRerun2) {
  if (failedInitial && failedRerun1 && failedRerun2) {
    return 'Persistent failure'
  }

  if (failedInitial && !failedRerun1 && !failedRerun2) {
    return 'Flaky - passed after rerun #1'
  }

  if (failedInitial && failedRerun1 && !failedRerun2) {
    return 'Flaky - passed after rerun #2'
  }

  if (!failedInitial && (failedRerun1 || failedRerun2)) {
    return 'New rerun failure'
  }

  return 'Intermittent rerun failure'
}

function renderTrendMarkdown(trend) {
  const lines = [
    '# Failure Trend Summary',
    '',
    `Outcome: ${trend.outcome}`,
    '',
    '## Run Metrics',
    ...renderInitialRunSection(trend.runs.initial),
    '',
    ...renderRerunSection(trend.runs.rerun1),
    '',
    ...renderRerunSection(trend.runs.rerun2),
    '',
    '## Failure Counts',
    `- Initial failed specs: ${trend.counts.initialFailedSpecs}`,
    `- Initial failed tests/hooks: ${trend.counts.initialFailedTests}`,
    `- Rerun #1 failed specs: ${trend.counts.rerun1FailedSpecs}`,
    `- Rerun #1 failed tests/hooks: ${trend.counts.rerun1FailedTests}`,
    `- Rerun #2 failed specs: ${trend.counts.rerun2FailedSpecs}`,
    `- Rerun #2 failed tests/hooks: ${trend.counts.rerun2FailedTests}`,
    `- Flaky failures: ${trend.counts.flakyFailures}`,
    `- Persistent failures: ${trend.counts.persistentFailures}`,
    `- New rerun failures: ${trend.counts.newRerunFailures}`,
    '',
    '## Status Counts'
  ]

  const statusCounts = Object.entries(trend.statusCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  if (!statusCounts.length) {
    lines.push('- None')
  } else {
    for (const [status, count] of statusCounts) {
      lines.push(`- ${status}: ${count}`)
    }
  }

  lines.push('', '## Persistent Failures')
  appendFailures(lines, trend.classifiedFailures.filter(failure => failure.status === 'Persistent failure'))

  lines.push('', '## Flaky Failures')
  appendFailures(lines, trend.classifiedFailures.filter(failure => failure.status.startsWith('Flaky')))

  lines.push('', '## New Rerun Failures')
  appendFailures(lines, trend.classifiedFailures.filter(failure => failure.status === 'New rerun failure'))

  return `${lines.join('\n')}\n`
}

function renderInitialRunSection(run) {
  return [
    '### Initial run',
    `- Executed specs: ${run.execution.executedSpecCount}`,
    `- Tests registered: ${run.execution.testsRegistered}`,
    `- Tests passed: ${run.execution.testsPassing}`,
    `- Tests failed: ${run.execution.testsFailing}`,
    `- Tests skipped: ${run.execution.testsSkipped}`,
    `- Tests pending: ${run.execution.testsPending}`,
    `- Failure detail rows: ${run.failedTestCount}`,
    `- Failed specs remaining: ${run.failedSpecCount}`,
    `- Metrics source: ${run.execution.source}`
  ]
}

function renderRerunSection(run) {
  return [
    `### ${run.name}`,
    `- Source failures considered: ${run.targeting.sourceFailureCount}`,
    `- Targetable failures: ${run.targeting.targetableFailureCount}`,
    `- Targeted specs opened: ${run.targeting.targetedSpecCount}`,
    `- Targeted failed tests: ${run.targeting.targetedTestCount}`,
    `- Full-spec fallback count: ${run.targeting.fallbackSpecCount}`,
    `- Tests registered in opened specs: ${run.execution.testsRegistered}`,
    `- Tests executed and passed: ${run.execution.testsPassing}`,
    `- Tests executed and failed: ${run.execution.testsFailing}`,
    `- Tests filtered out of rerun: ${run.execution.filteredOut}`,
    `- Tests skipped: ${run.execution.testsSkipped}`,
    `- Tests pending: ${run.execution.testsPending}`,
    `- Failed specs remaining: ${run.failedSpecCount}`,
    `- Failure detail rows remaining: ${run.failedTestCount}`,
    `- Metrics source: ${run.execution.source}`
  ]
}

function appendFailures(lines, failures) {
  if (!failures.length) {
    lines.push('- None')
    return
  }

  for (const failure of failures) {
    lines.push(`- ${failure.file}`)
    lines.push(`  - ${failure.title}`)
    lines.push(`  - Status: ${failure.status}`)
    lines.push(`  - Type: ${failure.errorType}`)
  }
}

const initialSummary = readSummary(resolvedInitialSummaryFile, 'Initial run failures')
const rerun1Summary = readSummary(resolvedRerun1SummaryFile, 'Rerun #1 failures')
const rerun2Summary = readSummary(resolvedRerun2SummaryFile, 'Rerun #2 failures')
const trend = buildTrend(initialSummary, rerun1Summary, rerun2Summary)

ensureParentDir(resolvedTrendJsonFile)
ensureParentDir(resolvedTrendMdFile)

fs.writeFileSync(resolvedTrendJsonFile, JSON.stringify(trend, null, 2) + '\n')
fs.writeFileSync(resolvedTrendMdFile, renderTrendMarkdown(trend))

console.log(`Wrote failure trend JSON -> ${resolvedTrendJsonFile}`)
console.log(`Wrote failure trend Markdown -> ${resolvedTrendMdFile}`)
