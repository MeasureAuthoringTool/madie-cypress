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
import './failedTestFilter'
import 'cypress-real-events'
import './commands'
import cypress = require("cypress");
import "@cypress-audit/lighthouse/commands"
import { Environment } from '../Shared/Environment'
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


before(() => {
    return Environment.initialize().then(() => {
        return cy.task('getAvailableUser').then((user) => {
            expect(user, 'No users available').to.not.be.null;
            Cypress.expose('selectedUser', user)
        }).then(() => {
            return cy.task('getAvailableAltUser').then((altUser) => {
                expect(altUser, 'No altUsers available').to.not.be.null;
                Cypress.expose('selectedAltUser', altUser)
            })
        })
    })
})

after(() => {
    const user = Cypress.expose('selectedUser')
    const altUser = Cypress.expose('selectedAltUser')
    return cy.then(() => {
        return user ? cy.task('releaseUser', user) : undefined
    }).then(() => {
        return altUser ? cy.task('releaseAltUser', altUser) : undefined
    }).then(() => undefined)
})
