#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const [allFile, serviceFile, uiFile] = process.argv.slice(2)

function readSpecs(file) {
    if (!fs.existsSync(file)) {
        throw new Error(`Spec list not found: ${file}`)
    }

    return new Set(
        fs
            .readFileSync(file, 'utf8')
            .split(/\r?\n/)
            .map((spec) => spec.replace(/\\/g, '/').trim())
            .filter(Boolean)
    )
}

function discover(pattern) {
    return new Set(glob.sync(pattern, { cwd: path.resolve(__dirname, '..'), nodir: true, posix: true }))
}

if ([allFile, serviceFile, uiFile].some(Boolean) && !(allFile && serviceFile && uiFile)) {
    console.error('Pass all three spec-list files or omit all arguments for repository discovery.')
    process.exit(1)
}

const allSpecs = allFile ? readSpecs(path.resolve(allFile)) : discover('cypress/e2e/**/*.cy.ts')
const serviceSpecs = serviceFile ? readSpecs(path.resolve(serviceFile)) : discover('cypress/e2e/Services/**/*.cy.ts')
const uiSpecs = uiFile ? readSpecs(path.resolve(uiFile)) : discover('cypress/e2e/WebInterface/**/*.cy.ts')
const overlap = Array.from(serviceSpecs).filter((spec) => uiSpecs.has(spec))
const combined = new Set([...serviceSpecs, ...uiSpecs])
const missing = Array.from(allSpecs).filter((spec) => !combined.has(spec))
const unexpected = Array.from(combined).filter((spec) => !allSpecs.has(spec))

if (!serviceSpecs.size) {
    console.error('The Service lane is empty.')
}
if (!uiSpecs.size) {
    console.error('The WebInterface lane is empty.')
}

if (!serviceSpecs.size || !uiSpecs.size || overlap.length || missing.length || unexpected.length) {
    overlap.forEach((spec) => console.error(`Overlapping spec: ${spec}`))
    missing.forEach((spec) => console.error(`Unassigned spec: ${spec}`))
    unexpected.forEach((spec) => console.error(`Unexpected spec: ${spec}`))
    process.exit(1)
}

console.log(
    `Validated full-suite partition: ${serviceSpecs.size} Service + ${uiSpecs.size} WebInterface = ${allSpecs.size} specs.`
)
