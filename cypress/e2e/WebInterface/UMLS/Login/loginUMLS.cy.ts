import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Header} from "../../../../Shared/Header"
import {Utilities} from "../../../../Shared/Utilities"
import {umlsLoginForm} from "../../../../Shared/umlsLoginForm"

//Need to skip this test for now until we are able to manipulate the DB and remove the API Key and TGT from
//Mongo DB with a DB connection or new API Call
describe.skip('Tests surrounding the abilty to log into UMLS', () => {

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('"Connect to UMLS" link / button works. ', () => {        

        //umls login link appears and is available to click, at the top of the page
        cy.get(Header.umlsLoginButton).should('exist')
        cy.get(Header.umlsLoginButton).should('be.visible')
        cy.get(Header.umlsLoginButton).should('be.enabled')
        cy.get(Header.umlsLoginButton).click()

        //form to enter API and to actually log into UMLS appears and is available to read and enter API key
        cy.get(umlsLoginForm.umlsForm).should('exist')
        cy.get(umlsLoginForm.umlsForm).should('be.visible')
        
        //close form
        cy.get(umlsLoginForm.closeUMLSForm).click()

    })

    it('API key is accepted, indicator at the top right that indicates that user is logged in appears, and toast message appears.', () => {

        //umls login link appears and is available to click, at the top of the page
        cy.get(Header.umlsLoginButton).should('exist')
        cy.get(Header.umlsLoginButton).should('be.visible')
        cy.get(Header.umlsLoginButton).should('be.enabled')
        cy.get(Header.umlsLoginButton).click()
        
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

    })

    it('Proper error is returning when an invalid API is used.', () => {
        //umls login link appears and is available to click, at the top of the page
        cy.get(Header.umlsLoginButton).should('exist')
        cy.get(Header.umlsLoginButton).should('be.visible')
        cy.get(Header.umlsLoginButton).should('be.enabled')
        cy.get(Header.umlsLoginButton).click()
        
        //form to enter API and to actually log into UMLS appears and is available to read and enter API key
        cy.get(umlsLoginForm.umlsForm).should('exist')
        cy.get(umlsLoginForm.umlsForm).should('be.visible')
        
        //enter API key into input text box
        cy.get(umlsLoginForm.apiTextInput).should('exist')
        cy.get(umlsLoginForm.apiTextInput).click()
        cy.get(umlsLoginForm.apiTextInput).should('be.visible')
        cy.get(umlsLoginForm.apiTextInput).should('be.enabled')
        //type invalid API value
        cy.get(umlsLoginForm.apiTextInput).type('fb766dc8-c0f8-4bc4-bb7f-0c924a208da9')

        //click on 'Connect to UMLS' button
        cy.get(umlsLoginForm.connectToUMLSButton).should('exist')
        Utilities.waitForElementVisible(umlsLoginForm.connectToUMLSButton, 3000)
        cy.get(umlsLoginForm.connectToUMLSButton).should('be.visible')
        Utilities.waitForElementEnabled(umlsLoginForm.connectToUMLSButton, 3000)
        cy.get(umlsLoginForm.connectToUMLSButton).should('be.enabled')
        cy.get(umlsLoginForm.connectToUMLSButton).click()

        //error message appears related to the attempt to log in, using the invalid API
        cy.get(umlsLoginForm.genericError).should('exist')
        cy.get(umlsLoginForm.genericError).should('be.visible')
        cy.get(umlsLoginForm.genericError).should('contain.text', 'Error: Request failed with status code 401')

        //close generic error message
        cy.get(umlsLoginForm.closeGenericError).click({ multiple: true })

    })

})