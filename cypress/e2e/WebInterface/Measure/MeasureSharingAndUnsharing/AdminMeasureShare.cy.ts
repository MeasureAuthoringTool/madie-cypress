import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { Utilities } from '../../../../Shared/Utilities'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasureActions, EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'

const measureName = 'AdminMeasureShare' + Date.now()
const cqlLibraryName = 'AdminMeasureShareLib' + Date.now()
const measureCQL = MeasureCQL.SBTEST_CQL
let harpUserALT = ''

describe('Admin Measure Share', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: false })
        OktaLogin.UILogout()
    })

    afterEach('Log out and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Admin user can share measure access for a measure they do not own', () => {
        //Login as admin user
        OktaLogin.AdminLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        // confirm admin user does not own the measure
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)
        cy.get(MeasuresPage.allMeasuresTab).click()

        // select measure created by currentuser
        MeasuresPage.actionCenter('edit')

        // verify share is available in action center
        // initiate share - verify modal
        EditMeasurePage.actionCenter(EditMeasureActions.share)
        cy.get(EditMeasurePage.shareOption).click({ force: true })

        // share to altUser
        cy.contains('Export User List').should('be.visible')
        cy.get(EditMeasurePage.harpIdInputTextBox).type(harpUserALT)
        cy.get(EditMeasurePage.addBtn).click()

        cy.get(EditMeasurePage.sharedUserTable).should('contain.text', harpUserALT)

        cy.get(EditMeasurePage.saveUserBtn).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'The measure(s) were successfully shared')

        //login as altUser
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(MeasuresPage.sharedMeasures).click()

        //verify measure in shared tab
        MeasuresPage.validateMeasureName(measureName)
    })
})
