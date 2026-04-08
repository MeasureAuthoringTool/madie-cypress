/**
 * Extract failing spec file paths from mochawesome JSON reports.
 *
 * Usage:  node scripts/extract-failures.js <output-file>
 *
 * Reads every cypress/results/*.json mochawesome report, checks stats.failures,
 * and writes the deduplicated list of spec file paths (one per line) to <output-file>.
 *
 * Designed for non-parallel (single-thread) Cypress runs where runner-results/
 * JSON files are NOT produced (those only come from cypress-parallel).
 */

const fs = require('fs')
const path = require('path')

const outputFile = process.argv[2]
if (!outputFile) {
  console.error('Usage: node scripts/extract-failures.js <output-file>')
  process.exit(1)
}

const resultsDir = path.resolve(__dirname, '..', 'cypress', 'results')

if (!fs.existsSync(resultsDir)) {
  console.log('No cypress/results directory found – writing empty failures file.')
  fs.writeFileSync(outputFile, '')
  process.exit(0)
}

const jsonFiles = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json'))

if (jsonFiles.length === 0) {
  console.log('No mochawesome JSON files found – writing empty failures file.')
  fs.writeFileSync(outputFile, '')
  process.exit(0)
}

const failedSpecs = new Set()

for (const file of jsonFiles) {
  try {
    const content = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'))
    const failures = content.stats && content.stats.failures ? content.stats.failures : 0

    if (failures > 0) {
      // Extract the spec file path from the first result entry
      const specFile =
        (content.results && content.results[0] && (content.results[0].fullFile || content.results[0].file)) || null

      if (specFile) {
        failedSpecs.add(specFile)
      } else {
        console.warn(`WARNING: ${file} has ${failures} failure(s) but no spec file path found.`)
      }
    }
  } catch (err) {
    console.warn(`WARNING: Could not parse ${file}: ${err.message}`)
  }
}

const output = Array.from(failedSpecs).join('\n')
fs.writeFileSync(outputFile, output + (output ? '\n' : ''))

console.log(`Extracted ${failedSpecs.size} failing spec(s) → ${outputFile}`)
if (failedSpecs.size > 0) {
  for (const spec of failedSpecs) {
    console.log(`  • ${spec}`)
  }
}


