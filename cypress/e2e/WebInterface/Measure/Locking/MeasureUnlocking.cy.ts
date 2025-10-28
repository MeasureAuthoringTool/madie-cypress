import {Environment} from "../../../../Shared/Environment"
import {MadieObject, Utilities} from "../../../../Shared/Utilities"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {Header} from "../../../../Shared/Header"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
const measureName = 'TestMeasure' + Date.now() + randValue
const cqlLibraryName = 'TestMeasure' + Date.now() + randValue
let harpUserALT = ''

//Skipping until Feature flag 'Locking' is removed
describe.skip('Measure Locking Validations', () => {

    before('Create Measure', () => {
        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        harpUserALT = OktaLogin.getUser(true, currentUser, currentAltUser)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    after('Delete Measure', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Measure Unlock fires when the user logs in & logs out', () => {

        cy.intercept('/api/measures/unlock').as('measureUnlock')
        cy.intercept('/api/cql-libraries/unlock').as('libraryUnlock')

        //Login 
        OktaLogin.Login()

        cy.wait('@measureUnlock', { timeout: 20000 }).then(mUnlock => {
            expect(mUnlock.response.statusCode).to.eql(200)
        })

        cy.wait('@libraryUnlock', { timeout: 20000 }).then(lUnlock => {
            expect(lUnlock.response.statusCode).to.eql(200)
        })

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        Utilities.verifyAllLocksDeleted(MadieObject.Measure)
        Utilities.verifyAllLocksDeleted(MadieObject.Library)

        //Logout 
        OktaLogin.UILogout()

        cy.wait('@measureUnlock', { timeout: 20000 }).then(mUnlock => {
            expect(mUnlock.response.statusCode).to.eql(200)
        })

        cy.wait('@libraryUnlock', { timeout: 20000 }).then(lUnlock => {
            expect(lUnlock.response.statusCode).to.eql(200)
        })

        Utilities.verifyAllLocksDeleted(MadieObject.Measure)
        Utilities.verifyAllLocksDeleted(MadieObject.Library)
    })

    it('Measure owner unable to version Draft Measure, when the Measure is locked by a different User', () => {

        const currentUser = Cypress.env('selectedUser')
        let filePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Lock Measure with ALT User
        cy.setAccessTokenCookieALT()
        Utilities.lockControl(MadieObject.Measure, true, true)

        //Login as Regular user
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"] > [class="px-1"] > [type="checkbox"]', 60000)
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"] > [class="px-1"] > [class=" cursor-pointer"]', 60000)
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[type="checkbox"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[type="checkbox"]').check()
        })
        Utilities.waitForElementDisabled('[data-testid="version-action-btn"]', 50000)
        cy.get('[data-testid="version-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Unable to version measure. Locked while being edited by ' + harpUserALT)

        //Delete Library Locks
        const currentAltUser = Cypress.env('selectedAltUser')
        OktaLogin.setupUserSession(true, currentUser, currentAltUser)
        Utilities.verifyAllLocksDeleted(MadieObject.Measure, true)
    })
})
