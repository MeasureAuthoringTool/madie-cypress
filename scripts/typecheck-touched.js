#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const root = process.cwd()
const targetPaths = process.argv.slice(2)

if (!targetPaths.length) {
    console.error('Usage: npm run typecheck:touched -- <file> [<file> ...]')
    process.exit(1)
}

const targets = new Set(
    targetPaths.map((targetPath) => {
        const absolutePath = path.resolve(root, targetPath)
        if (!fs.existsSync(absolutePath)) {
            console.error(`Touched typecheck target does not exist: ${targetPath}`)
            process.exit(1)
        }
        return absolutePath
    })
)

const configPath = ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json')
if (!configPath) {
    console.error('Unable to find tsconfig.json')
    process.exit(1)
}

const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
if (configFile.error) {
    console.error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
    process.exit(1)
}

const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath), {
    strictNullChecks: true
})
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options)
const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => !diagnostic.file || targets.has(path.resolve(diagnostic.file.fileName)))

if (!diagnostics.length) {
    console.log(`Touched strict-null typecheck passed for ${targets.size} file(s).`)
    process.exit(0)
}

console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n'
}))
process.exit(1)
