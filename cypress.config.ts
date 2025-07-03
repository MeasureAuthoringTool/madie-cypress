import { verifyDownloadTasks } from 'cy-verify-downloads'
import { defineConfig } from 'cypress'

const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse")
const fs = require('fs-extra')
const xlsx = require('xlsx')

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
    runMode: 0,
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

      on('task', verifyDownloadTasks)
      
      on('task', {
        readXlsx({file, sheet}) {
          const buf = fs.readFileSync(file);
          const workbook = xlsx.read(buf, {type:'buffer'})
          const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
          return rows
        }
      })

      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://dev-madie.hcqis.org',
  },
})
