const fs = require('fs-extra')
const path = require('path')
const unzipper = require('unzipper')
const { removeDirectory } = require('cypress-delete-downloads-folder')
const { lighthouse } = require('@cypress-audit/lighthouse')

const primaryUsers = ['harpUser', 'harpUser2', 'harpUser3']
const altUsers = ['altHarpUser', 'altHarpUser2', 'altHarpUser3']
const lockFilePath = path.join(__dirname, 'userLock.json')
const altLockFilePath = path.join(__dirname, 'altUserLock.json')

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
    if (!fs.existsSync(filePath)) {
        return {}
    }

    return JSON.parse(fs.readFileSync(filePath))
}

function writeLock(filePath, lock) {
    fs.writeFileSync(filePath, JSON.stringify(lock))
}

function claimFirstAvailableUser(filePath, users) {
    const lock = readLock(filePath)
    const user = users.find((candidate) => !lock[candidate])

    if (!user) {
        return null
    }

    lock[user] = true
    writeLock(filePath, lock)
    return user
}

function releaseLockedUser(filePath, user) {
    const lock = readLock(filePath)
    lock[user] = false
    writeLock(filePath, lock)
    return null
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
