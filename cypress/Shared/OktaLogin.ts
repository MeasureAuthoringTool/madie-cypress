import { Environment } from "./Environment"
import { LandingPage } from "./LandingPage"
import { umlsLoginForm } from "./umlsLoginForm"
import { Utilities } from "./Utilities";
import { Header } from "./Header";

//MADiE OKTA Login Class
export class OktaLogin {

    //Commented locators are for the new Okta Login page
    public static readonly usernameInput = '#okta-signin-username' //'[id="input28"]'
    public static readonly passwordInput = '#okta-signin-password' //'[id="input36"]'
    public static readonly signInButton = '#okta-signin-submit' //'[class="button button-primary"]'

    public static readonly needHelpButton = 'a[data-se="needhelp"]'
    public static readonly forgotPassword = '[data-se="forgot-password"]'
    public static readonly helpLink = '[data-se="help-link"]'
    public static readonly termsAndConditionsButton = '[data-testid="terms-and-conditions-button"]'
    public static readonly tcClose = '[data-testid="terms-and-conditions-close-button"]'
    public static readonly resetViaEmail = '[data-se="email-button"]'
    public static readonly backFromReset = '[data-se="back-link"]'

    public static AltLogin() {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        cy.get(this.usernameInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.usernameInput, { timeout: 110000 }).should('be.visible')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.visible')
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
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        cy.get(this.usernameInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.usernameInput, { timeout: 110000 }).should('be.visible')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.enabled')
        cy.get(this.passwordInput, { timeout: 110000 }).should('be.visible')
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

    public static UILogout(): void {

        cy.wait(4500)
        cy.reload()
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 50000)
        cy.wait(3000)
        cy.url().then((url) => {
            if (url != 'https://impl-madie.hcqis.org/login') {
                Utilities.waitForElementVisible(Header.userProfileSelect, 500000)
                cy.get(Header.userProfileSelect).scrollIntoView()
                cy.get(Header.userProfileSelect).click()
                Utilities.waitForElementVisible(Header.userProfileSelectSignOutOption, 60000)
                cy.get(Header.userProfileSelectSignOutOption).click({ force: true })
                Utilities.waitForElementVisible(this.usernameInput, 500000)
                cy.log('Log out successful')
            }
        })
    }
}
