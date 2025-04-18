import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasureActions, EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MadieObject, PermissionActions, Utilities} from "../../../../Shared/Utilities"
import {Environment} from "../../../../Shared/Environment"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {LandingPage} from "../../../../Shared/LandingPage"

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

        OktaLogin.UILogout()
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
        cy.get(EditMeasurePage.unshareOption).click({force: true})
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
        cy.get(EditMeasurePage.unshareOption).click({force: true})
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
})

