import { MadieObject, Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { Header } from "../../../../Shared/Header"

let randValue = (Math.floor((Math.random() * 1000) + 1))
const measureName = 'UnlockingMeasure' + Date.now() + randValue
const cqlLibraryName = 'UmlockingMeasureLib' + Date.now() + randValue
let harpUserALT = ''

describe('Measure Locking Validations', () => {

    before('Create Measure', () => {

        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    after('Delete Measure', () => {

        Utilities.deleteMeasure()
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
        // most of OktaLogin.UILogout():
        Utilities.waitForElementVisible(Header.userProfileSelect, 10000)
        cy.get(Header.userProfileSelect).scrollIntoView()
        cy.get(Header.userProfileSelect).click()
        Utilities.waitForElementVisible(Header.userProfileSelectSignOutOption, 60000)
        cy.get(Header.userProfileSelectSignOutOption).click({ force: true })

        Utilities.waitForElementVisible(OktaLogin.usernameInput, 500000)
        cy.log('Log out successful')

        Utilities.verifyAllLocksDeleted(MadieObject.Measure)
        Utilities.verifyAllLocksDeleted(MadieObject.Library)
    })

    it('Measure owner unable to version Draft Measure, when the Measure is locked by a different User', () => {

        const currentUser = Cypress.env('selectedUser')
        let filePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Lock Measure with ALT User
        const currentAltUser = Cypress.env('selectedAltUser')
        OktaLogin.setupUserSession(true)
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
        cy.get('[data-testid="version-action-tooltip"]').trigger('mouseover').wait(750)
        cy.contains('Unable to version measure. Locked while being edited by ').should('be.visible')
        //Delete Library Locks
        OktaLogin.setupUserSession(true)
        Utilities.verifyAllLocksDeleted(MadieObject.Measure, true)
    })
})
