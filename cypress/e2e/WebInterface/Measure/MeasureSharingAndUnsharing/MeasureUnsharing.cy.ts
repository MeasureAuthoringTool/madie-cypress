import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { Environment } from "../../../../Shared/Environment"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let harpUserALT = Environment.credentials().harpUserALT
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Un Sharing', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify Measure owner can un share Measure from Measures page Action centre share button', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as Regular user
        OktaLogin.Login()

        //Un Share Measure
        MeasuresPage.actionCenter('share')
        cy.get(EditMeasurePage.unshareOption).click({ force: true })
        cy.get(EditMeasurePage.expandArrow).click()
        cy.get(EditMeasurePage.unshareCheckBox).click()
        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.acceptBtn).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Login as ALT user and verify Measure is not visible on My Measures page
        OktaLogin.AltLogin()
        cy.get(LandingPage.myMeasuresTab).click()
        cy.get(MeasuresPage.measureListTitles).should('not.contain', newMeasureName)

    })

    it('Verify Measure owner can un share Measure from Edit Measure page Action centre share button', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as Regular user
        OktaLogin.Login()

        //Un Share Measure
        MeasuresPage.actionCenter('edit')

        Utilities.waitForElementVisible(EditMeasurePage.cqlLibraryNameTextBox, 15500)
        EditMeasurePage.actionCenter(EditMeasureActions.share)
        cy.get(EditMeasurePage.unshareOption).click({ force: true })
        cy.get(EditMeasurePage.expandArrow).click()
        cy.get(EditMeasurePage.unshareCheckBox).eq(1).click()
        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.acceptBtn).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Login as ALT user and verify Measure is not visible on My Measures page
        OktaLogin.AltLogin()
        cy.get(LandingPage.myMeasuresTab).click()
        cy.get(MeasuresPage.measureListTitles).should('not.contain', newMeasureName)

    })

    it('Verify Shared user can Un share Measure from themself on Shared Measures tab', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as ALT user
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()

        //Unshare Measure
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get('[type="checkbox"]').first().click()
        cy.get('[data-testid="share-action-btn"]').click()
        cy.get('[data-testid="Unshare-option"]').click()

        //Assert text on the popup screen
        Utilities.waitForElementVisible('.MuiBox-root', 60000)
        cy.get('.MuiBox-root').should('contain.text', 'Are you sure?')
        cy.get('.MuiDialogContent-root').should('contain.text', 'You are about to unshare' + newMeasureName + ' with the following users:' + harpUserALT)

        //Click on Accept button and Un share Measure
        cy.get(EditMeasurePage.acceptBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Verify Measure is not visible under Shared Measures tab
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(MeasuresPage.measureListTitles).should('not.contain', newMeasureName)
    })
})

