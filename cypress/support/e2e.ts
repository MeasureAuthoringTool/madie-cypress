// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

//import '@undefinedlabs/scope-agent/cypress/support'

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-axe'
import 'axe-core'
import cypress = require("cypress");
import "@cypress-audit/lighthouse/commands"
const addContext = require('mochawesome/addContext')
require('cy-verify-downloads').addCustomCommand()
export { }

require('cypress-commands')


Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
        addContext({ test }, {
            title: 'Screenshot',
            value: `assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`
        })
    }
})
