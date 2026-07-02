#!/usr/bin/env node

const fs = require('fs')
const { spawnSync } = require('child_process')

const configFile = process.argv[2]
const runScript = process.argv[3]
const listFile = process.argv[4] || 'test-files.txt'
const threads = process.env.CYPRESS_PARALLEL_THREADS || '3'
const reporterConfig = process.env.CYPRESS_PARALLEL_REPORTER_CONFIG || 'cypress/parallel-reporter-config.json'

if (!configFile || !runScript) {
    console.error('Usage: node scripts/run-spec-list.js <configFile> <npm-run-script> [spec-list-file]')
    process.exit(1)
}

if (!fs.existsSync(listFile)) {
    console.error('Missing spec list file:', listFile)
    process.exit(1)
}

const specs = fs
    .readFileSync(listFile, 'utf8')
    .split(/\r?\n/)
    .map((spec) => spec.trim())
    .filter(Boolean)

if (!specs.length) {
    console.error('Spec list is empty after reading', listFile)
    process.exit(1)
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const args = ['cypress-parallel', '-s', runScript, '-t', threads, '--spec', ...specs, '-p', reporterConfig]

console.log(`Running ${specs.length} ${configFile} spec(s) with ${threads} worker(s).`)
console.log('cypress-parallel args:', args.join(' '))

const result = spawnSync(npx, args, {
    stdio: 'inherit',
    env: { ...process.env, NO_COLOR: '1' }
})

process.exit(result.status || 0)
