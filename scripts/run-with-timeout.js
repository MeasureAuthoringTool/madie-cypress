#!/usr/bin/env node

const { spawn } = require('child_process')

const timeoutSeconds = Number(process.argv[2])
const command = process.argv[3]
const args = process.argv.slice(4)
const heartbeatSeconds = Number(process.env.CYPRESS_WORKER_HEARTBEAT_SECONDS || 300)

if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0 || !command) {
  console.error('Usage: node scripts/run-with-timeout.js <seconds> <command> [args...]')
  process.exit(1)
}

function quoteArg(arg) {
  if (process.platform === 'win32') {
    return `"${String(arg).replace(/"/g, '\\"')}"`
  }

  return `'${String(arg).replace(/'/g, `'\\''`)}'`
}

function formatElapsed(seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [hrs, mins, secs]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
}

const shellCommand = [command, ...args].map(quoteArg).join(' ')

console.error(`Starting command with timeout ${timeoutSeconds}s: ${shellCommand}`)

const child = spawn(shellCommand, {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
  detached: process.platform !== 'win32',
  shell: true
})

const startedAt = Date.now()
let lastOutputAt = startedAt

child.stdout.on('data', (chunk) => {
  lastOutputAt = Date.now()
  process.stdout.write(chunk)
})

child.stderr.on('data', (chunk) => {
  lastOutputAt = Date.now()
  process.stderr.write(chunk)
})

child.on('error', (err) => {
  console.error(`Failed to start command: ${err.message}`)
})

let timedOut = false
const heartbeatTimer = Number.isFinite(heartbeatSeconds) && heartbeatSeconds > 0
  ? setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000)
      const silentSeconds = Math.floor((Date.now() - lastOutputAt) / 1000)
      console.error(
        `Command heartbeat after ${formatElapsed(elapsedSeconds)}; last output ${formatElapsed(silentSeconds)} ago`
      )
    }, heartbeatSeconds * 1000)
  : null

heartbeatTimer?.unref()

const timer = setTimeout(() => {
  timedOut = true
  console.error(`Command exceeded ${timeoutSeconds}s timeout: ${shellCommand}`)

  try {
    if (process.platform === 'win32') {
      child.kill('SIGTERM')
    } else {
      process.kill(-child.pid, 'SIGTERM')
    }
  } catch (err) {
    console.error(`Failed to terminate timed-out process: ${err.message}`)
  }

  setTimeout(() => {
    try {
      if (process.platform === 'win32') {
        child.kill('SIGKILL')
      } else {
        process.kill(-child.pid, 'SIGKILL')
      }
    } catch (_err) {
      // Process already exited.
    }
  }, 10000).unref()
}, timeoutSeconds * 1000)

child.on('exit', (code, signal) => {
  clearTimeout(timer)
  heartbeatTimer && clearInterval(heartbeatTimer)

  if (timedOut) {
    process.exit(124)
  }

  if (signal) {
    console.error(`Command exited from signal ${signal}: ${shellCommand}`)
    process.exit(128)
  }

  process.exit(code ?? 0)
})
