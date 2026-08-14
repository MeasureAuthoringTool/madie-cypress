import { OktaLogin } from '../../../Shared/OktaLogin'
import { step } from '../../../utils/step'

const lastActivityStorageName = 'madie_last_activity'
const idleTimeoutOverrideStorageName = 'madie_idle_timeout_override'
const WARNING_TITLE = 'Session Expiration Warning'

describe('Session persistence', () => {
    afterEach(() => {
        cy.clearLocalStorage(idleTimeoutOverrideStorageName)
        cy.clearLocalStorage(lastActivityStorageName)
    })

    it('records initial authenticated activity in local storage', () => {
        step('Login and verify activity tracking starts')
        OktaLogin.Login()

        cy.window().then((window) => {
            const lastActivity = Number(window.localStorage.getItem(lastActivityStorageName))
            expect(lastActivity, 'initial activity timestamp').to.be.greaterThan(Date.now() - 10_000)
        })
    })

    it('shows the inactivity warning and resets activity when the user interacts with it', () => {
        step('Login and configure a short idle timeout')
        OktaLogin.Login()

        cy.window().then((window) => {
            window.localStorage.setItem(idleTimeoutOverrideStorageName, String(10_000))
            window.localStorage.setItem(lastActivityStorageName, String(Date.now()))
        })

        step('Verify the warning is visible before the configured idle timeout expires')
        cy.get('[role="dialog"]', { timeout: 10_000 })
            .should('be.visible')
            .and('contain.text', WARNING_TITLE)
            .and('contain.text', 'Interact with this screen to continue your session.')

        step('Interact with the warning to extend the session')
        cy.contains('[role="dialog"] [role="button"]', WARNING_TITLE).click()
        cy.contains(WARNING_TITLE).should('not.exist')

        cy.window().then((window) => {
            const lastActivity = Number(window.localStorage.getItem(lastActivityStorageName))
            expect(lastActivity).to.be.greaterThan(Date.now() - 5_000)
        })
    })

    it('unlocks resources before automatically signing the inactive user out', () => {
        cy.intercept('/api/measures/unlock').as('measureUnlock')
        cy.intercept('/api/cql-libraries/unlock').as('libraryUnlock')
        cy.intercept('POST', '**/v1/revoke').as('oktaTokenRevoke')

        step('Login and make the activity timestamp exceed the test timeout')
        OktaLogin.Login()
        cy.window().then((window) => {
            window.localStorage.setItem(idleTimeoutOverrideStorageName, String(1_000))
            window.localStorage.setItem(lastActivityStorageName, String(Date.now() - 2_000))
        })

        step('Verify the inactivity warning remains visible without user interaction')
        cy.get('[role="dialog"]', { timeout: 10_000 })
            .should('be.visible')
            .and('contain.text', WARNING_TITLE)

        step('Verify automatic logout releases measures and libraries')
        cy.wait('@measureUnlock', { timeout: 45_000 }).then((measureUnlock) => {
            expect(measureUnlock.response?.statusCode).to.eq(200)
        })
        cy.wait('@libraryUnlock', { timeout: 45_000 }).then((libraryUnlock) => {
            expect(libraryUnlock.response?.statusCode).to.eq(200)
        })
        cy.wait('@oktaTokenRevoke', { timeout: 45_000 }).then((tokenRevoke) => {
            expect(tokenRevoke.response?.statusCode).to.be.within(200, 299)
        })
    })
})
