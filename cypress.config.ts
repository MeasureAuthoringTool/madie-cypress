import { verifyDownloadTasks } from 'cy-verify-downloads'
import { defineConfig } from 'cypress'

const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse")
const fs = require('fs-extra')
const xlsx = require('xlsx')
const xml2js = require('xml2js')
const http = require('http')
const https = require('https')

export default defineConfig({
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
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
        },
          readFileSafe(filePath: string) {
              try {
                  if (fs.existsSync(filePath)) {
                      const content = fs.readFileSync(filePath, 'utf8')
                      return content || null
                  }
                  return null
              } catch {
                  return null
              }
          },
          parseXML(xmlContent: string) {
              return new Promise((resolve, reject) => {
                  const parser = new xml2js.Parser()
                  parser.parseString(xmlContent, (err: any, result: any) => {
                      if (err) reject(err)
                      else resolve(result)
                  })
              })
          },
          checkUrl(url: string) {
              const lib = url.startsWith('https') ? https : http
              return new Promise((resolve) => {
                  const req = lib.get(url, { timeout: 30000 }, (res: any) => {
                      // Consume response data to free up memory
                      res.resume()
                      resolve({ reachable: true, statusCode: res.statusCode })
                  })
                  req.on('error', (err: any) => {
                      resolve({ reachable: false, error: err.message || String(err) })
                  })
                  req.on('timeout', () => {
                      req.destroy()
                      resolve({ reachable: false, error: 'ETIMEDOUT' })
                  })
              })
          }
      })

      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://dev-madie.hcqis.org',
  },
})
