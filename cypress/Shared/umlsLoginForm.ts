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

    //retrieve API kiey
    public static retrieveAndEnterAPIKey(): void {

        cy.get(this.apiTextInput).type(Environment.credentials().umls_API_KEY)

    }

    public static UMLSLogin(): void {
        //umls login link appears and is available to click, at the top of the page
        cy.get(Header.umlsLoginButton).should('exist')
        cy.get(Header.umlsLoginButton).should('be.visible')
        cy.get(Header.umlsLoginButton).should('be.enabled')
        cy.get(Header.umlsLoginButton).click()

        cy.get('[data-value="Connect to UMLS"]').find(Header.umlsConnectButtonCurrentStatus).click()

        //form to enter API and to actually log into UMLS appears and is available to read and enter API key
        cy.get(umlsLoginForm.umlsForm).should('exist')
        cy.get(umlsLoginForm.umlsForm).should('be.visible')

        //enter API key into input text box
        cy.get(umlsLoginForm.apiTextInput).should('exist')
        cy.get(umlsLoginForm.apiTextInput).click()
        cy.get(umlsLoginForm.apiTextInput).should('be.visible')
        cy.get(umlsLoginForm.apiTextInput).should('be.enabled')
        umlsLoginForm.retrieveAndEnterAPIKey()

        //click on 'Connect to UMLS' button
        cy.get(umlsLoginForm.connectToUMLSButton).should('exist')
        Utilities.waitForElementVisible(umlsLoginForm.connectToUMLSButton, 3000)
        cy.get(umlsLoginForm.connectToUMLSButton).should('be.visible')
        Utilities.waitForElementEnabled(umlsLoginForm.connectToUMLSButton, 3000)
        cy.get(umlsLoginForm.connectToUMLSButton).should('be.enabled')
        cy.get(umlsLoginForm.connectToUMLSButton).click()

        //confirmation appears indicating that user is, now, logged into UMLS
        cy.get(umlsLoginForm.umlsConnectSuccessMsg).should('exist')
        cy.get(umlsLoginForm.umlsConnectSuccessMsg).should('be.visible')
        cy.get(umlsLoginForm.umlsConnectSuccessMsg).should('contain.text', 'UMLS successfully authenticated')

    }
}