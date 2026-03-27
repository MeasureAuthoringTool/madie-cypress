import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = ''
let cqlLibraryName = ''
let harpUserALT = ''
let measureCQL = MeasureCQL.SBTEST_CQL

// depends on status of ff AdminMeasureShare
describe.skip('Admin Measure Unshare', () => {

    measureName = 'AdminMeasureUnshare' + Date.now()
    cqlLibraryName = 'AdminMeasureUnshareLib' + Date.now()

    beforeEach('Create Measure and Set Access Token', () => {

        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)
    })

    afterEach('Log out and Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Verify Admin can unshare measure access for a measure they do not own', () => {

        OktaLogin.AdminLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        // confirm admin user does not own the measure
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Unshare Measure
        MeasuresPage.actionCenter('share')
        cy.get(EditMeasurePage.unshareOption).click({ force: true })
        cy.get(EditMeasurePage.expandArrow).click()
        cy.get(EditMeasurePage.unshareCheckBox).click()
        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.acceptBtn).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully unshared.')

        //Login as ALT user and verify Measure is not visible on Shared Measures page
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)
    })
})
