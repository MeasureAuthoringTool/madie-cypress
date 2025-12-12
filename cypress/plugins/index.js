// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs-extra')
const path = require('path')
const lockFilePath = path.join(__dirname, 'userLock.json')
const altLockFilePath = path.join(__dirname, 'altUserLock.json')
const unzipper = require('unzipper')
const { removeDirectory } = require('cypress-delete-downloads-folder')
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse")

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('./cypress/', 'config', `${file}.json`)
  return fs.readJson(pathToConfigFile)
}
//unzip file
function unzipFile (zipFile, path) {

  const zipPath = path + '/' + zipFile
  const readStream = fs.createReadStream(zipPath)

  readStream.pipe(unzipper.Extract({path: `${path}`}))
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
      }
    })
    on('task', {
      unzipFile: zipFileAndPath => {
        unzipFile(zipFileAndPath.zipFile, zipFileAndPath.path)
        return null
      }
    })
    on("task", {
      lighthouse: lighthouse((lighthouseReport) => {
        console.log("---- Writing lighthouse report to disk ----")
        fs.writeFile("./lighthouse-report/lighthouse.html", lighthouseReport.report, (error) => {
          error ? console.log(error) : console.log("Report created successfully")
        })
      }),
    });
    on('task', {
      removeDirectory
    })
    on('task', {
        getAvailableUser() {
            let lock = {};
            if (fs.existsSync(lockFilePath)) {
                lock = JSON.parse(fs.readFileSync(lockFilePath))
            }

            if (!lock.harpUser) {
                lock.harpUser = true;
                fs.writeFileSync(lockFilePath, JSON.stringify(lock))
                return 'harpUser';
            } else if (!lock.harpUser2) {
                lock.harpUser2 = true;
                fs.writeFileSync(lockFilePath, JSON.stringify(lock))
                return 'harpUser2';
            } else if (!lock.harpUser3) {
                lock.harpUser3 = true;
                fs.writeFileSync(lockFilePath, JSON.stringify(lock))
                return 'harpUser3';
            } else {
                return null;
            }
        },

        releaseUser(user) {
            let lock = JSON.parse(fs.readFileSync(lockFilePath))
            lock[user] = false;
            fs.writeFileSync(lockFilePath, JSON.stringify(lock))
            return null;
        }
    })

    on('task', {
        getAvailableAltUser() {
            let lock = {};
            if (fs.existsSync(altLockFilePath)) {
                lock = JSON.parse(fs.readFileSync(altLockFilePath))
            }

            if (!lock.altHarpUser) {
                lock.altHarpUser = true;
                fs.writeFileSync(altLockFilePath, JSON.stringify(lock))
                return 'altHarpUser';
            } else if (!lock.altHarpUser2) {
                lock.altHarpUser2 = true;
                fs.writeFileSync(altLockFilePath, JSON.stringify(lock))
                return 'altHarpUser2';
            } else if (!lock.altHarpUser3) {
                lock.altHarpUser3 = true;
                fs.writeFileSync(altLockFilePath, JSON.stringify(lock))
                return 'altHarpUser3';
            } else {
                return null;
            }
        },

        releaseAltUser(user) {
            let lock = JSON.parse(fs.readFileSync(altLockFilePath))
            lock[user] = false;
            fs.writeFileSync(altLockFilePath, JSON.stringify(lock))
            return null;
        }
    })

    return getConfigurationByFile(file)
  }