import {Environment} from "../../../../Shared/Environment"
import {MadieObject, Utilities} from "../../../../Shared/Utilities"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {Header} from "../../../../Shared/Header"

//Skipping until Feature flag 'Locking' is removed
describe.skip('Measure Unlock fires when the user logs in & logs out', () => {

    it('aaaaaaa', () => {

        cy.intercept('/api/measures/unlock').as('measureUnlock')
        cy.intercept('/api/cql-libraries/unlock').as('libraryUnlock')

        //Login 
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        cy.get(OktaLogin.usernameInput, { timeout: 110000 }).should('be.enabled')
        cy.get(OktaLogin.usernameInput).type(Environment.credentials().harpUser)
        cy.get(OktaLogin.passwordInput, { timeout: 110000 }).should('be.enabled')
        cy.get(OktaLogin.passwordInput).type(Environment.credentials().password)
        cy.get(OktaLogin.signInButton, { timeout: 110000 }).should('be.enabled')
        cy.get(OktaLogin.signInButton).click()

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
        cy.get(Header.userProfileSelect).click()
        Utilities.waitForElementVisible(Header.userProfileSelectSignOutOption, 15000)
        cy.get(Header.userProfileSelectSignOutOption).click({ force: true })
        Utilities.waitForElementVisible(OktaLogin.usernameInput, 45000)

        cy.wait('@measureUnlock', { timeout: 20000 }).then(mUnlock => {
            expect(mUnlock.response.statusCode).to.eql(200)
        })

        cy.wait('@libraryUnlock', { timeout: 20000 }).then(lUnlock => {
            expect(lUnlock.response.statusCode).to.eql(200)
        })

        Utilities.verifyAllLocksDeleted(MadieObject.Measure)
        Utilities.verifyAllLocksDeleted(MadieObject.Library)
    })
})
