#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const trendFile = process.argv[2]
const format = process.argv[3] || 'slack'

if (!trendFile) {
  console.error('Usage: node scripts/render-trend-summary.js trend-json-file [slack|console]')
  process.exit(1)
}

const resolvedTrendFile = path.resolve(trendFile)

if (!fs.existsSync(resolvedTrendFile)) {
  process.exit(0)
}

const content = fs.readFileSync(resolvedTrendFile, 'utf8').trim()
if (!content) {
  process.exit(0)
}

const trend = JSON.parse(content)
const initialRun = trend.runs && trend.runs.initial ? trend.runs.initial : {}
const rerun1Run = trend.runs && trend.runs.rerun1 ? trend.runs.rerun1 : {}
const rerun2Run = trend.runs && trend.runs.rerun2 ? trend.runs.rerun2 : {}
const initialExecution = initialRun.execution || {}
const rerun1Execution = rerun1Run.execution || {}
const rerun2Execution = rerun2Run.execution || {}
const rerun1Targeting = rerun1Run.targeting || {}
const rerun2Targeting = rerun2Run.targeting || {}

function value(number) {
  return Number(number) || 0
}

const slackSummary = [
  'Normalized summary:',
  `• Initial run: ${value(initialExecution.executedSpecCount)} executed / ${value(initialExecution.plannedSpecCount)} planned specs, ${value(initialExecution.missingSpecCount)} missing specs, ${value(initialExecution.testsRegistered)} registered, ${value(initialExecution.testsPassing)} passed, ${value(initialExecution.testsFailing)} failed, ${value(initialExecution.testsSkipped)} skipped`,
  `• Rerun #1: ${value(rerun1Targeting.targetedSpecCount)} targeted specs, ${value(rerun1Targeting.targetedTestCount)} targeted failed tests, ${value(rerun1Targeting.missingSpecCount)} missing-spec retries, ${value(rerun1Execution.testsRegistered)} registered in opened specs, ${value(rerun1Execution.filteredOut)} filtered out, ${value(rerun1Run.failedSpecCount)} failed specs remaining`,
  `• Rerun #2: ${value(rerun2Targeting.targetedSpecCount)} targeted specs, ${value(rerun2Targeting.targetedTestCount)} targeted failed tests, ${value(rerun2Targeting.missingSpecCount)} missing-spec retries, ${value(rerun2Execution.testsRegistered)} registered in opened specs, ${value(rerun2Execution.filteredOut)} filtered out, ${value(rerun2Run.failedSpecCount)} failed specs remaining`
].join('\n')

const consoleSummary = [
  '=== Normalized Failure Summary ===',
  `Outcome: ${trend.outcome || 'Unknown'}`,
  '',
  'Initial run:',
  `  specs planned: ${value(initialExecution.plannedSpecCount)}`,
  `  specs executed: ${value(initialExecution.executedSpecCount)}`,
  `  specs missing: ${value(initialExecution.missingSpecCount)}`,
  `  tests registered: ${value(initialExecution.testsRegistered)}`,
  `  passed: ${value(initialExecution.testsPassing)}`,
  `  failed: ${value(initialExecution.testsFailing)}`,
  `  skipped: ${value(initialExecution.testsSkipped)}`,
  '',
  'Rerun #1:',
  `  targeted specs: ${value(rerun1Targeting.targetedSpecCount)}`,
  `  targeted failed tests: ${value(rerun1Targeting.targetedTestCount)}`,
  `  missing-spec retries: ${value(rerun1Targeting.missingSpecCount)}`,
  `  tests registered in opened specs: ${value(rerun1Execution.testsRegistered)}`,
  `  filtered out: ${value(rerun1Execution.filteredOut)}`,
  `  remaining failed specs: ${value(rerun1Run.failedSpecCount)}`,
  '',
  'Rerun #2:',
  `  targeted specs: ${value(rerun2Targeting.targetedSpecCount)}`,
  `  targeted failed tests: ${value(rerun2Targeting.targetedTestCount)}`,
  `  missing-spec retries: ${value(rerun2Targeting.missingSpecCount)}`,
  `  tests registered in opened specs: ${value(rerun2Execution.testsRegistered)}`,
  `  filtered out: ${value(rerun2Execution.filteredOut)}`,
  `  remaining failed specs: ${value(rerun2Run.failedSpecCount)}`
].join('\n')

if (format === 'console') {
  process.stdout.write(`${consoleSummary}\n`)
  process.exit(0)
}

process.stdout.write(`${slackSummary}\n`)
