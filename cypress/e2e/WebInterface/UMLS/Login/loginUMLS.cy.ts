import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { umlsLoginForm } from "../../../../Shared/umlsLoginForm"

describe('Tests surrounding the abilty to log into UMLS', () => {

    beforeEach('Login', () => {
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

        //log out of UMLS and verify "Are you sure?" modal
        Utilities.waitForElementVisible(Header.umlsLogOutOption, 5000)
        cy.get(Header.umlsLogOutOption).click({ force: true })

        //confirm the "Are you Sure" dialog and cancel log out
        Utilities.waitForElementVisible('[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-aa4ov7 react-draggable"]', 5000)
        cy.get(Header.umlsLogOutConfirmDialogMsg).should('contain.text', 'Are you sure you want to log out of UMLS?You are about to Sign Out from UMLS. You will need to enter your UMLS API key to log back in.')
        cy.get(Header.umlsLogOutConfirmCancel).click()
        cy.get(Header.umlsConnectButtonCurrentStatus).should('contain.text', 'UMLS Active')

        //log out of UMLS
        cy.get(Header.umlsLoginButton).click()
        Utilities.waitForElementVisible(Header.umlsLogOutOption, 5000)
        cy.get(Header.umlsLogOutOption).click()
        cy.get(Header.umlsLogOutConfirmContinue).click()
        cy.get(Header.umlsConnectButtonCurrentStatus).should('contain.text', 'Connect to UMLS')

        //bring up form to enter UMLS API key
        cy.get(Header.umlsConnectButtonCurrentStatus).click()
        cy.get('[data-value="Connect to UMLS"]').find(Header.umlsConnectButtonCurrentStatus).click()

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

        //log out of UMLS and verify "Are you sure?" modal
        Utilities.waitForElementVisible(Header.umlsLogOutOption, 5000)
        cy.get(Header.umlsLogOutOption).click({ force: true })

        //log out of UMLS
        cy.get(Header.umlsLogOutConfirmContinue).click()
        cy.get(Header.umlsConnectButtonCurrentStatus).should('contain.text', 'Connect to UMLS')

        //bring up form to enter UMLS API key
        cy.get(Header.umlsConnectButtonCurrentStatus).click()
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

    })
})