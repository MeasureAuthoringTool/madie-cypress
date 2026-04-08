/**
 * Re-run failing IMPL specs.
 *
 * Reads spec file paths from test-files.txt and runs them with
 * `cypress run --env configFile=impl` using execSync (shell mode).
 *
 * This intentionally uses execSync instead of spawnSync so that
 * Cypress is invoked through the shell, matching how the initial
 * npm-script runs work. spawnSync bypasses the shell and causes
 * Cypress 15's reporterOptions object to be serialized as
 * "[object Object]", crashing the browser-side Mocha reporter.
 */

const fs = require('fs')
const { execSync } = require('child_process')

const list = 'test-files.txt'

if (!fs.existsSync(list)) {
  console.error('Missing spec list file:', list)
  process.exit(1)
}

const specs = fs.readFileSync(list, 'utf8')
  .split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean)

if (!specs.length) {
  console.error('Spec list is empty after reading', list)
  process.exit(1)
}

const specArg = specs.join(',')
console.log(`Rerunning ${specs.length} spec(s) for IMPL:\n${specs.map(s => '  • ' + s).join('\n')}`)

// Use single quotes around the spec arg to handle spaces in paths.
// NO_COLOR=1 is set as a prefix env var in the shell command.
const cmd = `NO_COLOR=1 cypress run --env configFile=impl --spec '${specArg}' --browser chrome`
console.log(`\nCommand: ${cmd}\n`)

try {
  execSync(cmd, { stdio: 'inherit' })
} catch (e) {
  // Cypress exits non-zero when tests fail — that's expected
  process.exit(e.status || 1)
}

