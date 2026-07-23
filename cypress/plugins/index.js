const fs = require('fs-extra')
const nativeFs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const { removeDirectory } = require('cypress-delete-downloads-folder')
const { lighthouse } = require('@cypress-audit/lighthouse')

const primaryUsers = ['harpUser', 'harpUser2', 'harpUser3']
const altUsers = ['altHarpUser', 'altHarpUser2', 'altHarpUser3']
const lockFilePath = path.join(__dirname, 'userLock.json')
const altLockFilePath = path.join(__dirname, 'altUserLock.json')
const lockAcquireTimeoutMs = Number(process.env.CYPRESS_USER_LOCK_TIMEOUT_MS || 30000)
const lockRetryIntervalMs = Number(process.env.CYPRESS_USER_LOCK_RETRY_MS || 100)

function getConfigurationByFile(file) {
    const pathToConfigFile = path.resolve('./cypress/', 'config', `${file}.json`)
    return fs.readJson(pathToConfigFile)
}

function unzipFile(zipFile, outputPath) {
    const zipPath = path.join(outputPath, zipFile)
    const readStream = fs.createReadStream(zipPath)

    readStream.pipe(unzipper.Extract({ path: outputPath }))
}

function readLock(filePath) {
    if (!nativeFs.existsSync(filePath)) {
        return {}
    }

    try {
        return JSON.parse(nativeFs.readFileSync(filePath, 'utf8'))
    } catch (err) {
        console.warn(`Unable to parse lock file ${filePath}; resetting it. ${err.message}`)
        return {}
    }
}

function writeLock(filePath, lock) {
    nativeFs.writeFileSync(filePath, JSON.stringify(lock))
}

function sleepMs(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function withFileLock(filePath, action) {
    const mutexDir = `${filePath}.mutex`
    const startedAt = Date.now()

    while (Date.now() - startedAt < lockAcquireTimeoutMs) {
        try {
            nativeFs.mkdirSync(mutexDir)
            try {
                return action()
            } finally {
                nativeFs.rmSync(mutexDir, { recursive: true, force: true })
            }
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err
            }
            sleepMs(lockRetryIntervalMs)
        }
    }

    throw new Error(`Timed out acquiring user lock for ${path.basename(filePath)} after ${lockAcquireTimeoutMs}ms`)
}

function claimFirstAvailableUser(filePath, users) {
    return withFileLock(filePath, () => {
        const lock = readLock(filePath)
        const user = users.find((candidate) => !lock[candidate])

        if (!user) {
            return null
        }

        lock[user] = true
        writeLock(filePath, lock)
        return user
    })
}

function releaseLockedUser(filePath, user) {
    if (!user) {
        return null
    }

    return withFileLock(filePath, () => {
        const lock = readLock(filePath)
        lock[user] = false
        writeLock(filePath, lock)
        return null
    })
}

module.exports = (on, config) => {
    const file = config.env.configFile

    on('task', {
        log(message) {
            console.log(message)
            return null
        },
        table(message) {
            console.table(message)
            return null
        },
        unzipFile(zipFileAndPath) {
            unzipFile(zipFileAndPath.zipFile, zipFileAndPath.path)
            return null
        },
        lighthouse: lighthouse((lighthouseReport) => {
            console.log('---- Writing lighthouse report to disk ----')
            fs.writeFile('./lighthouse-report/lighthouse.html', lighthouseReport.report, (error) => {
                error ? console.log(error) : console.log('Report created successfully')
            })
        }),
        removeDirectory,
        getAvailableUser() {
            return claimFirstAvailableUser(lockFilePath, primaryUsers)
        },
        releaseUser(user) {
            return releaseLockedUser(lockFilePath, user)
        },
        getAvailableAltUser() {
            return claimFirstAvailableUser(altLockFilePath, altUsers)
        },
        releaseAltUser(user) {
            return releaseLockedUser(altLockFilePath, user)
        }
    })

    return getConfigurationByFile(file)
}
