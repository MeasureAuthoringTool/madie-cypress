import {LoginPage} from "../pom/MADiE/WI/LoginPage"

//MADiE Login Class
export class MADiELogin {

    public static readonly usernameInput = '#okta-signin-username'
    public static readonly passwordInput = '#okta-signin-password'
    //public static readonly termsConditionsCheckbox = '.custom-checkbox'
    public static readonly signInButton = '#okta-signin-submit'

    private static harpUser = Cypress.env('MADIE_DEV_USERNAME')
    private static password = Cypress.env('MADIE_DEV_PASSWORD')

    public static Login(): void {

        //navigate to Login page
        cy.visit('/', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })

        //Login with passed harp user and password
        cy.get(this.usernameInput, { timeout: 400000 }).should('be.visible')
        cy.get(this.usernameInput).type(this.harpUser)
        cy.get(this.passwordInput).type(this.password)
        cy.get(this.signInButton).click()
        //Verify the success message on home page
        cy.get(LoginPage.loginSuccessmsg).should('be.visible')
        cy.log('Login Successful')
    }
}