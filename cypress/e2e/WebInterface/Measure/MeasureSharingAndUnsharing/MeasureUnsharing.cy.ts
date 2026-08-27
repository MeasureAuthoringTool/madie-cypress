import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = ''
let cqlLibraryName = ''
let harpUserALT = ''
const measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Un Sharing', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        const timestamp = Date.now()
        measureName = 'MeasureUnshare' + timestamp
        cqlLibraryName = 'MeasureUnshareLib' + timestamp

        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.UILogout()
        OktaLogin.setupUserSession(false)
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Verify Measure owner can unshare Measure from Measures page Action centre share button', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as Regular user
        OktaLogin.Login()

        //Un Share Measure
        MeasuresPage.actionCenter('share')
        cy.get(EditMeasurePage.unshareOption).click({ force: true })
        cy.get(EditMeasurePage.unshareCheckBox).click()
        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.acceptBtn).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Login as ALT user and verify Measure is not visible on Shared Measures page
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)
    })

    it('Verify Measure owner can unshare Measure from Edit Measure page Action centre share button', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as Regular user
        OktaLogin.Login()

        //Un Share Measure
        MeasuresPage.actionCenter('edit')

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)
        EditMeasurePage.actionCenter(EditMeasureActions.share)
        cy.get(EditMeasurePage.unshareOption).click({ force: true })
        cy.contains(EditMeasurePage.sharedUserTable, harpUserALT)
            .find(EditMeasurePage.unshareCheckBox)
            .should('be.checked')
            .click()
        cy.intercept('PUT', '**/api/measures/unshared').as('unshareMeasure')
        cy.get(EditMeasurePage.saveUserBtn).should('be.enabled').click()
        cy.get(EditMeasurePage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareMeasure').its('response.statusCode').should('eq', 200)

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Login as ALT user and verify Measure is not visible on Shared Measures page
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)
    })

    it('Verify Shared user can Unshare Measure from themself on Shared Measures tab', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as ALT user
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()

        //Unshare Measure
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        MeasuresPage.actionCenter('share')
        cy.get(EditMeasurePage.unshareOption).click({ force: true })

        //Assert text on the popup screen
        Utilities.waitForElementVisible(EditMeasurePage.acceptBtn, 60000)
        cy.get('.MuiDialogContent-root').should('contain.text', 'You are about to unshare')
        cy.get('.MuiDialogContent-root').should('contain.text', measureName)
        cy.get('.MuiDialogContent-root').find('li').should('have.length.gte', 1)

        //Click on Accept button and Un share Measure
        cy.get(EditMeasurePage.acceptBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Verify Measure is not visible under Shared Measures tab
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)
    })
})
