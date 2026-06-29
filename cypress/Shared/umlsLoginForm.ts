import { Environment } from "./Environment"
import { Header } from "./Header";
import { Utilities } from "./Utilities";

export class umlsLoginForm {
    //the form, itself, and related buttons and fields
    public static readonly umlsForm = '[data-testid="UMLS-connect-form"]'
    public static readonly apiTextInput = '[data-testid="UMLS-key-input"]'
    public static readonly connectToUMLSButton = '[data-testid="submit-UMLS-key"]'
    public static readonly umlsConnectSuccessMsg = '[data-testid="UMLS-login-success-text"]'
    public static readonly closeUMLSForm = '[data-testid="close-UMLS-dialog-button"]'
    public static readonly genericError = '[data-testid="UMLS-login-generic-error-text"]'
    public static readonly closeGenericError = '[data-testid="CloseIcon"]'

    public static UMLSLogin(): void {
        cy.log('umls not connected - logging in now')

        // open connection drawer
        Utilities.waitForElementVisible(Header.umlsLoginButton, 15000)
        cy.get(Header.umlsLoginButton).click()

        cy.get('[data-value="Connect to UMLS"]', { timeout: 15000 }).should('be.visible').click()

        //form to enter API key appears
        cy.get(this.umlsForm).should('be.visible')

        //enter API key into input text box
        cy.get(this.apiTextInput).should('be.enabled')
        cy.get(this.apiTextInput).type(Environment.credentials().umls_API_KEY)

        //click on 'Connect to UMLS' button
        Utilities.waitForElementEnabled(this.connectToUMLSButton, 6000)
        cy.get(this.connectToUMLSButton).click()

        //confirmation appears indicating that user is logged into UMLS
        cy.get(this.umlsConnectSuccessMsg).should('be.visible')
        cy.get(this.umlsConnectSuccessMsg, { timeout: 9500 }).should('contain.text', 'UMLS successfully authenticated')
    }
}