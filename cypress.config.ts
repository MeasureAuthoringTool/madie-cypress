import { defineConfig } from 'cypress'

const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse")
const fs = require('fs-extra')

export default defineConfig({
  env: { parseSpecialCharSequences: false },
  chromeWebSecurity: false,
  pageLoadTimeout: 100000,
  defaultCommandTimeout: 50000,
  video: false,
  trashAssetsBeforeRuns: true,
  viewportWidth: 1300,
  viewportHeight: 800,
  watchForFileChanges: false,
  numTestsKeptInMemory: 1,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    timestamp: 'mmddyyyy_HHMMss',
    json: true,
    inline: true,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  screenshotsFolder: 'mochawesome-report/assets',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = Cypress.browser, launchOptions) => {
        prepareAudit(launchOptions);
      })
      on('task', {
        readXlsx() {
          return null
        }
      })

      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://dev-madie.hcqis.org',
  },
})
