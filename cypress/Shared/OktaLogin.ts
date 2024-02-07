import { Environment } from "./Environment"
import { LandingPage } from "./LandingPage"
import { umlsLoginForm } from "./umlsLoginForm"

//MADiE OKTA Login Class
export class OktaLogin {

    public static readonly usernameInput = '#okta-signin-username'
    public static readonly passwordInput = '#okta-signin-password'
    public static readonly signInButton = '#okta-signin-submit'

    public static AltLogin() {

        sessionStorage.clear()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)

        cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        cy.get(this.usernameInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.usernameInput, { timeout: 110000 }).should('be.visible')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.visible')
        cy.wait(3000)
        cy.get(this.usernameInput).type(Environment.credentials().harpUserALT)
        cy.get(this.passwordInput).type(Environment.credentials().passwordALT)
        cy.get(this.signInButton, { timeout: 110000 }).should('be.enabled')
        cy.get(this.signInButton, { timeout: 110000 }).should('be.visible')

        //setup for grabbing the measure create call
        cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls')

        cy.get(this.signInButton).click()

        cy.wait('@umls', { timeout: 110000 }).then(({ response }) => {

            if (response.statusCode === 200) {
                //do nothing
            }
            else {
                umlsLoginForm.UMLSLogin()
            }

        })
        cy.get(LandingPage.newMeasureButton).should('be.visible')
        cy.log('Login Successful')
    }


    public static Login() {

        sessionStorage.clear()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        cy.get(this.usernameInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.usernameInput, { timeout: 110000 }).should('be.visible')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.visible')
        cy.wait(3000)
        cy.get(this.usernameInput).type(Environment.credentials().harpUser)
        cy.get(this.passwordInput).type(Environment.credentials().password)
        cy.get(this.signInButton, { timeout: 110000 }).should('be.enabled')
        cy.get(this.signInButton, { timeout: 110000 }).should('be.visible')

        //setup for grabbing the measure create call
        cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls')

        cy.get(this.signInButton).click()

        cy.wait('@umls', { timeout: 110000 }).then(({ response }) => {

            if (response.statusCode === 200) {
                //do nothing
            }
            else {
                umlsLoginForm.UMLSLogin()
            }

        })
        cy.get(LandingPage.newMeasureButton).should('be.visible')
        cy.log('Login Successful')
    }


    public static Logout(): void {


        //commenting out all the logout until logout issue MAT-4520 is resolved

        // cy.get(Header.userProfileSelect).should('exist')
        // cy.get(Header.userProfileSelect, { timeout: 1000000 }).should('be.visible')
        // cy.get(Header.userProfileSelect).should('be.visible')
        // cy.get(Header.userProfileSelect).invoke('click')
        //cy.get(Header.userProfileSelect).click()
        //
        // cy.get(Header.userProfileSelectSignOutOption).should('exist')
        // cy.get(Header.userProfileSelectSignOutOption, { timeout: 1000000 }).should('be.visible')
        // cy.get(Header.userProfileSelectSignOutOption).should('be.visible')
        // cy.get(Header.userProfileSelectSignOutOption).focus()
        // cy.get(Header.userProfileSelectSignOutOption).invoke('click')
        // cy.intercept('POST', '/api/log/logout').as('logout')
        // cy.get(Header.userProfileSelectSignOutOption).click({ force: true })
        // cy.wait('@logout', {timeout: 60000}).then(({response}) => {
        //     expect(response.statusCode).to.eq(405)
        // })
        // cy.window().then((win) => {
        //     win.sessionStorage.clear()
        // })
        // cy.log('Logout Successful')
    }

}
