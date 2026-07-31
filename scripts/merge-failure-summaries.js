#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const [outputSummary, outputFailures, outputDetails, runLabel, ...inputFiles] = process.argv.slice(2)

if (!outputSummary || !outputFailures || !outputDetails || !runLabel) {
    console.error(
        'Usage: node scripts/merge-failure-summaries.js <summary> <failures> <details> <label> [input summaries...]'
    )
    process.exit(1)
}

const summaries = inputFiles
    .filter((file) => fs.existsSync(file))
    .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
const failures = summaries.flatMap((summary) => (Array.isArray(summary.failures) ? summary.failures : []))
const failedSpecs = Array.from(new Set(failures.map((failure) => failure.file).filter(Boolean))).sort()
const missingSpecs = Array.from(new Set(summaries.flatMap((summary) => summary.execution?.missingSpecs || []))).sort()

function sum(field) {
    return summaries.reduce((total, summary) => total + (Number(summary.execution?.[field]) || 0), 0)
}

function countBy(field) {
    return failures.reduce((counts, failure) => {
        const key = failure[field] || 'Unclassified'
        counts[key] = (counts[key] || 0) + 1
        return counts
    }, {})
}

const failureTypes = countBy('errorType')
const errorSignatures = countBy('errorSignature')
const topErrorSignatures = Object.entries(errorSignatures)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }))
const targetingMissingSpecs = Array.from(
    new Set(summaries.flatMap((summary) => summary.targeting?.missingSpecs || []))
).sort()
const targetedTestsBySpec = Object.assign(
    {},
    ...summaries.map((summary) => summary.targeting?.targetedTestsBySpec || {})
)
const fallbackSpecs = Array.from(new Set(summaries.flatMap((summary) => summary.targeting?.fallbackSpecs || []))).sort()

const merged = {
    runLabel,
    generatedAt: new Date().toISOString(),
    failedSpecCount: failedSpecs.length,
    failedTestCount: failures.length,
    execution: {
        plannedSpecCount: sum('plannedSpecCount'),
        executedSpecCount: sum('executedSpecCount'),
        missingSpecCount: missingSpecs.length,
        missingSpecs,
        testsRegistered: sum('testsRegistered'),
        testsPassing: sum('testsPassing'),
        testsFailing: sum('testsFailing'),
        testsPending: sum('testsPending'),
        testsSkipped: sum('testsSkipped'),
        filteredOut: sum('filteredOut'),
        screenshots: sum('screenshots'),
        durationMs: sum('durationMs'),
        source: 'merged Service and WebInterface lane summaries'
    },
    targeting: {
        sourceFailureCount: summaries.reduce(
            (total, summary) => total + (Number(summary.targeting?.sourceFailureCount) || 0),
            0
        ),
        targetableFailureCount: summaries.reduce(
            (total, summary) => total + (Number(summary.targeting?.targetableFailureCount) || 0),
            0
        ),
        targetedSpecCount: Object.keys(targetedTestsBySpec).length,
        targetedTestCount: Object.values(targetedTestsBySpec).reduce(
            (total, titles) => total + (Array.isArray(titles) ? titles.length : 0),
            0
        ),
        missingSpecCount: targetingMissingSpecs.length,
        missingSpecs: targetingMissingSpecs,
        fallbackSpecCount: fallbackSpecs.length,
        targetedTestsBySpec,
        fallbackSpecs
    },
    failureTypes,
    topErrorSignatures,
    failures
}

for (const output of [outputSummary, outputFailures, outputDetails]) {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true })
}

fs.writeFileSync(outputSummary, JSON.stringify(merged, null, 2) + '\n')
fs.writeFileSync(outputFailures, failedSpecs.join('\n') + (failedSpecs.length ? '\n' : ''))

const detailLines = [`${runLabel}`, '']
if (!failures.length) {
    detailLines.push('No failures.')
} else {
    for (const failure of failures) {
        detailLines.push(`- ${failure.file || 'Unknown spec'}`)
        detailLines.push(`  ${failure.title || 'Unknown test'}`)
        if (failure.error) {
            detailLines.push(`  ${String(failure.error).replace(/\n/g, '\n  ')}`)
        }
        detailLines.push('')
    }
}
fs.writeFileSync(outputDetails, detailLines.join('\n') + '\n')

console.log(`Merged ${summaries.length} lane summaries into ${outputSummary}`)
