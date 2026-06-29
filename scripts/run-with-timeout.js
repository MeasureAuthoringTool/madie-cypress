#!/usr/bin/env node

const { spawn } = require('child_process')

const timeoutSeconds = Number(process.argv[2])
const command = process.argv[3]
const args = process.argv.slice(4)

if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0 || !command) {
  console.error('Usage: node scripts/run-with-timeout.js <seconds> <command> [args...]')
  process.exit(1)
}

const child = spawn(command, args, {
  stdio: 'inherit',
  env: process.env,
  detached: process.platform !== 'win32'
})

let timedOut = false

const timer = setTimeout(() => {
  timedOut = true
  console.error(`Command exceeded ${timeoutSeconds}s timeout: ${command} ${args.join(' ')}`)

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

  if (timedOut) {
    process.exit(124)
  }

  if (signal) {
    console.error(`Command exited from signal ${signal}: ${command}`)
    process.exit(128)
  }

  process.exit(code ?? 0)
})
