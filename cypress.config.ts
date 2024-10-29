import { defineConfig } from 'cypress'

const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse")
//const { pa11y } = require("@cypress-audit/pa11y");
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
      on("task", {
        //lighthouse: lighthouse(Object, Object),
        lighthouse: lighthouse((lighthouseReport) => {
          console.log("---- Writing lighthouse report to disk ----");
          fs.writeFile("cypress/fixtures/lighthouse.html", lighthouseReport.report, (error: any) => {
            error ? console.log(error) : console.log("Report created successfully");
          });
          console.log(lighthouseReport)
          //pa11y: pa11y(console.log.bind(console))
        })
        //lighthouse: lighthouse()
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
