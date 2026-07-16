#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const scriptName = process.argv[2]
const outputFile = process.argv[3]

if (!scriptName || !outputFile) {
  console.error('Usage: node scripts/resolve-spec-list.js <npm-script-name> <output-file>')
  process.exit(1)
}

const rootDir = path.resolve(__dirname, '..')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const scriptCommand = packageJson.scripts && packageJson.scripts[scriptName]

function normalizeSpec(spec) {
  return spec.replace(/\\/g, '/').trim()
}

function readSpecListFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return []
  }

  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map(normalizeSpec)
    .filter(Boolean)
}

function writeSpecs(specs) {
  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true })
  fs.writeFileSync(path.resolve(outputFile), specs.join('\n') + (specs.length ? '\n' : ''))
  console.log(`Resolved ${specs.length} spec(s) for ${scriptName} -> ${path.resolve(outputFile)}`)
}

if (!scriptCommand) {
  console.warn(`WARNING: Unknown npm script ${scriptName}. Writing empty spec list.`)
  writeSpecs([])
  process.exit(0)
}

if (scriptName === 'test:specific:files:parallel' || scriptName === 'dev:specific:files:parallel') {
  writeSpecs(readSpecListFile(path.join(rootDir, 'test-files.txt')))
  process.exit(0)
}

const patterns = []
const dashDRegex = /-d\s+'([^']+)'/g
const specRegex = /--spec\s+'([^']+)'/g

for (const regex of [dashDRegex, specRegex]) {
  let match
  while ((match = regex.exec(scriptCommand)) !== null) {
    patterns.push(match[1])
  }
}

const resolvedSpecs = new Set()

for (const pattern of patterns) {
  for (const candidate of pattern.split(',').map(normalizeSpec).filter(Boolean)) {
    if (/[*?[\]{!}]/.test(candidate)) {
      const matches = glob.sync(candidate, {
        cwd: rootDir,
        nodir: true,
        posix: true
      })

      for (const match of matches) {
        resolvedSpecs.add(normalizeSpec(match))
      }
      continue
    }

    const absoluteCandidate = path.resolve(rootDir, candidate)
    if (fs.existsSync(absoluteCandidate) && fs.statSync(absoluteCandidate).isFile()) {
      resolvedSpecs.add(normalizeSpec(path.relative(rootDir, absoluteCandidate)))
      continue
    }

    console.warn(`WARNING: Could not resolve spec candidate for ${scriptName}: ${candidate}`)
  }
}

writeSpecs(Array.from(resolvedSpecs).sort())
