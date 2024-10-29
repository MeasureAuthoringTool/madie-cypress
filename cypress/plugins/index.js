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
const browserify = require('@cypress/browserify-preprocessor')
const { stringify } = require('querystring')
module.exports = {
    e2e: {
        //baseUrl: "http://bstackdemo.com", // this is your app
        setupNodeEvents(on, config) {
          on("before:browser:launch", (browser = {}, launchOptions) => {
          prepareAudit(launchOptions);
      });
      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          console.log(lighthouseReport); // raw lighthouse reports
        })
        //lighthouse: lighthouse()
      })
    },
  },
};

module.exports = (on, config) => {
  const file = config.env.configFile
  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript')
  }
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
      lighthouse: lighthouse(Object, Object),
    // pa11y: pa11y(console.log.bind(console)),
    });
    on('task', {
      removeDirectory
    })
    on('file:preprocessor', browserify(options))
    return getConfigurationByFile(file)
  }