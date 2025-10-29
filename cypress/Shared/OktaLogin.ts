import { Environment } from "./Environment"
import { LandingPage } from "./LandingPage"
import { umlsLoginForm } from "./umlsLoginForm"
import { Utilities } from "./Utilities";
import { Header } from "./Header";

//MADiE OKTA Login Class
export class OktaLogin {

    //Commented locators are for the new Okta Login page
    public static readonly usernameInput = '[id="input28"]' //'#okta-signin-username'
    public static readonly passwordInput = '[id="input36"]' //'#okta-signin-password'
    public static readonly signInButton = '[class="button button-primary"]' //'#okta-signin-submit'

    public static readonly needHelpButton = 'a[data-se="needhelp"]'
    public static readonly forgotPassword = '[data-se="forgot-password"]'
    public static readonly helpLink = '[data-se="help"]'
    public static readonly termsAndConditionsButton = '[data-testid="terms-and-conditions-button"]'
    public static readonly tcClose = '[data-testid="terms-and-conditions-close-button"]'
    public static readonly resetViaEmail = '[data-se="email-button"]'
    public static readonly backFromReset = '[data-se="cancel"]'

    public static AltLogin() {
        const currentAltUser = Cypress.env('selectedAltUser')

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        if (currentAltUser === 'altHarpUser') {
            cy.setAccessTokenCookieALT()
            cy.get(this.usernameInput).type(Environment.credentials().altHarpUser)
            cy.get(this.passwordInput).type(Environment.credentials().passwordALT)
        } else if (currentAltUser === 'altHarpUser2') {
            cy.setAccessTokenCookieALT2()
            cy.get(this.usernameInput).type(Environment.credentials().altHarpUser2)
            cy.get(this.passwordInput).type(Environment.credentials().passwordALT2)
        }
        else if (currentAltUser === 'altHarpUser3') {
            cy.setAccessTokenCookieALT3()
            cy.get(this.usernameInput).type(Environment.credentials().altHarpUser3)
            cy.get(this.passwordInput).type(Environment.credentials().passwordALT3)
        }

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


    public static Login(): void {
            const user = Cypress.env('selectedUser')

            sessionStorage.clear()
            cy.clearAllCookies()
            cy.clearLocalStorage()

            cy.visit('/login', {onBeforeLoad: (win) => win.sessionStorage.clear()})

            if (user === 'harpUser') {
                cy.setAccessTokenCookie()
                cy.get(this.usernameInput).type(Environment.credentials().harpUser)
                cy.get(this.passwordInput).type(Environment.credentials().password)
            } else if (user === 'harpUser2') {
                cy.setAccessTokenCookie2()
                cy.get(this.usernameInput).type(Environment.credentials().harpUser2)
                cy.get(this.passwordInput).type(Environment.credentials().password2)
            }
            else if (user === 'harpUser3') {
                cy.setAccessTokenCookie3()
                cy.get(this.usernameInput).type(Environment.credentials().harpUser3)
                cy.get(this.passwordInput).type(Environment.credentials().password3)
            }

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

            // Store selected user for release
            Cypress.env('selectedUser', user)
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


    public static setupUserSession(altUser: boolean) {
        let user: string

        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        if (altUser) {
            switch (currentAltUser) {
                case 'altHarpUser':
                    cy.setAccessTokenCookieALT()
                    user = Environment.credentials().altHarpUser
                    break
                case 'altHarpUser2':
                    cy.setAccessTokenCookieALT2()
                    user = Environment.credentials().altHarpUser2
                    break
                case 'altHarpUser3':
                    cy.setAccessTokenCookieALT3()
                    user = Environment.credentials().altHarpUser3
                    break
                default:
                    throw new Error(`Unknown user type: ${currentAltUser}`)
            }
        } else {
            switch (currentUser) {
                case 'harpUser':
                    cy.setAccessTokenCookie()
                    user = Environment.credentials().harpUser
                    break
                case 'harpUser2':
                    cy.setAccessTokenCookie2()
                    user = Environment.credentials().harpUser2
                    break;
                case 'harpUser3':
                    cy.setAccessTokenCookie3()
                    user = Environment.credentials().harpUser3
                    break
                default:
                    throw new Error(`Unknown user type: ${currentUser}`)
            }
        }

        return user
    }

    public static getUser(altUser: boolean) {
        let user: string
        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')

        if (altUser) {
            switch (currentAltUser) {
                case 'altHarpUser':
                    user = Environment.credentials().altHarpUser
                    break
                case 'altHarpUser2':
                    user = Environment.credentials().altHarpUser2
                    break
                case 'altHarpUser3':
                    user = Environment.credentials().altHarpUser3
                    break
                default:
                    throw new Error(`Unknown user type: ${currentAltUser}`)
            }
        } else {
            switch (currentUser) {
                case 'harpUser':
                    user = Environment.credentials().harpUser
                    break
                case 'harpUser2':
                    user = Environment.credentials().harpUser2
                    break;
                case 'harpUser3':
                    user = Environment.credentials().harpUser3
                    break
                default:
                    throw new Error(`Unknown user type: ${currentUser}`)
            }
        }

        return user
    }
}
