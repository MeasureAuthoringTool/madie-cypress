#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = process.cwd()
const strict = process.env.QUALITY_AUDIT_STRICT === 'true'
const failOnArgIndex = process.argv.indexOf('--fail-on')
const failOnValue = failOnArgIndex >= 0 ? process.argv[failOnArgIndex + 1] : process.env.QUALITY_AUDIT_FAIL_ON || ''
const failOn = new Set(
    failOnValue
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
)
const ignoredDirectories = new Set([
    '.git',
    'artifacts',
    'cypress/downloads',
    'cypress/results',
    'lighthouse-report',
    'mochawesome-report',
    'node_modules',
    'runner-results'
])

const checks = [
    {
        name: 'focused tests',
        pattern: /\b(describe|context|it)\.only\(/g,
        guidance: 'Committed focused tests can silently shrink the suite.'
    },
    {
        name: 'skipped tests',
        pattern: /\b(describe|context|it)\.skip\(/g,
        guidance: 'Skipped tests need an owner, ticket, or removal decision.'
    },
    {
        name: 'manual fixture path plumbing',
        pattern: /cypress\/fixtures\/['"`]?\s*\+|cypress\/fixtures\/[^'"`]*(measureId|cqlLibraryId)/g,
        guidance: 'Use TestData fixture helpers so user allocation and path conventions live in one place.'
    },
    {
        name: 'manual access token plumbing',
        pattern: /cy\.getCookie\(['"]accessToken['"]\)/g,
        guidance: 'Use TestData.withAccessToken or domain API helpers so auth handling is consistent.'
    },
    {
        name: 'fixed waits',
        pattern: /cy\.wait\(\s*\d+/g,
        guidance: 'Prefer route aliases, visible/enabled assertions, or purpose-built polling helpers.'
    },
    {
        name: 'forced interactions',
        pattern: /force:\s*true/g,
        guidance: 'Use only when validating intentionally hidden/native controls; otherwise fix readiness or selectors.'
    },
    {
        name: 'global uncaught exception suppression',
        pattern: /uncaught:exception/g,
        guidance: 'Suppressing app exceptions globally hides product regressions.'
    },
    {
        name: 'inline npm node scripts',
        pattern: /node -e/g,
        guidance: 'Move logic into versioned scripts so it can be reviewed and tested.'
    },
    {
        name: 'duplicated NO_COLOR prefixes',
        pattern: /NO_COLOR=1\s+NO_COLOR=1/g,
        guidance: 'Script sprawl creates drift; consolidate command builders.'
    },
    {
        name: 'obvious script typos',
        pattern: /windows::|wiindows/g,
        guidance: 'Broken scripts rot trust in the test harness.'
    }
]

function normalizePath(filePath) {
    return filePath.split(path.sep).join('/')
}

function shouldIgnore(relativePath) {
    const normalizedPath = normalizePath(relativePath)

    if (normalizedPath === 'scripts/quality-audit.js') {
        return true
    }

    return Array.from(ignoredDirectories).some((ignoredPath) => {
        return normalizedPath === ignoredPath || normalizedPath.startsWith(`${ignoredPath}/`)
    })
}

function walk(directory, files = []) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name)
        const relativePath = path.relative(root, fullPath)

        if (shouldIgnore(relativePath)) {
            continue
        }

        if (entry.isDirectory()) {
            walk(fullPath, files)
        } else if (/\.(js|json|ts)$/.test(entry.name)) {
            files.push(fullPath)
        }
    }

    return files
}

function lineCount(file) {
    return fs.readFileSync(file, 'utf8').split(/\r?\n/).length
}

function filesUnder(files, directory) {
    return files.filter((file) => normalizePath(path.relative(root, file)).startsWith(`${directory}/`))
}

function printLargestFiles(files, title) {
    console.log(`\n${title}`)

    for (const file of files
        .map((sourceFile) => ({ file: path.relative(root, sourceFile), lines: lineCount(sourceFile) }))
        .sort((a, b) => b.lines - a.lines)
        .slice(0, 8)) {
        console.log(`  ${file.lines.toString().padStart(5)}  ${file.file}`)
    }
}

const sourceFiles = walk(root)
const specFiles = filesUnder(sourceFiles, 'cypress/e2e').filter((file) => file.endsWith('.cy.ts'))
const sharedFiles = filesUnder(sourceFiles, 'cypress/Shared')
const supportFiles = filesUnder(sourceFiles, 'cypress/support')
const scriptFiles = filesUnder(sourceFiles, 'scripts')
const totalSpecLines = specFiles.reduce((total, file) => total + lineCount(file), 0)
const totalSharedLines = sharedFiles.reduce((total, file) => total + lineCount(file), 0)
const totalSupportLines = supportFiles.reduce((total, file) => total + lineCount(file), 0)
const totalScriptLines = scriptFiles.reduce((total, file) => total + lineCount(file), 0)
const findings = new Map(checks.map((check) => [check.name, { ...check, count: 0, files: new Map() }]))

for (const file of sourceFiles) {
    const relativePath = path.relative(root, file)
    const content = fs.readFileSync(file, 'utf8')

    for (const check of checks) {
        const matches = content.match(check.pattern)

        if (matches) {
            const finding = findings.get(check.name)
            finding.count += matches.length
            finding.files.set(relativePath, matches.length)
        }
    }
}

console.log('MADiE Cypress quality audit')
console.log('Source scan excludes generated reports, downloads, runner results, and node_modules.')
console.log(
    `Inventory: ${specFiles.length} specs / ${totalSpecLines} spec lines; ` +
        `${sharedFiles.length} shared files / ${totalSharedLines} shared lines; ` +
        `${supportFiles.length} support files / ${totalSupportLines} support lines; ` +
        `${scriptFiles.length} scripts / ${totalScriptLines} script lines.`
)

printLargestFiles(specFiles, 'Largest spec files')
printLargestFiles(sharedFiles, 'Largest shared test helpers')

let hasFindings = false

for (const finding of findings.values()) {
    if (!finding.count) {
        continue
    }

    hasFindings = true
    console.log(`\n${finding.name}: ${finding.count}`)
    console.log(`  ${finding.guidance}`)

    for (const [file, count] of Array.from(finding.files.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)) {
        console.log(`  ${count.toString().padStart(3)}  ${file}`)
    }
}

if (!hasFindings) {
    console.log('\nNo tracked quality smells found.')
}

const failedChecks = Array.from(findings.values()).filter((finding) => finding.count && failOn.has(finding.name))

if (failedChecks.length) {
    console.error(
        `\nFailing because configured quality checks found issues: ${failedChecks.map((check) => check.name).join(', ')}`
    )
    process.exit(1)
}

if (strict && hasFindings) {
    process.exit(1)
}
