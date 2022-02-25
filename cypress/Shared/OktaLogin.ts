import {Header} from "./Header"
import {Environment} from "./Environment"

//MADiE OKTA Login Class
export class OktaLogin {

    public static readonly usernameInput = '#okta-signin-username'
    public static readonly passwordInput = '#okta-signin-password'
    //public static readonly termsConditionsCheckbox = '.custom-checkbox'
    public static readonly signInButton = '#okta-signin-submit'

    public static Login(): void {

        //navigate to Login page
        cy.visit('/', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        //Login with passed harp user and password
        cy.wait(5000)
        cy.get(this.usernameInput, { timeout: 600000 }).should('be.visible')
        cy.get(this.usernameInput).type(Environment.credentials().harpUser)
        cy.get(this.passwordInput).type(Environment.credentials().password)
        cy.get(this.signInButton).click()
        cy.log('Login Successful')
    }

    public static Logout(): void {
        cy.get(Header.signOutButton).should('be.visible')
        cy.get(Header.signOutButton).click({force:true})
        cy.wait(5000)
        cy.get(this.usernameInput, { timeout: 600000 }).should('be.visible')
        cy.log('Logout Successful')

    }
}