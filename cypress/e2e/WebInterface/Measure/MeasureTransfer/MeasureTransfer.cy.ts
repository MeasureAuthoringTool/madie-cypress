import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { Header } from "../../../../Shared/Header"
import { Toasts } from "../../../../Shared/Toasts"


const measureName = 'MeasureTransfer'
const cqlLibraryName = 'MeasureTransferLib'
const randomMeasureName = 'TransferedMeasure'

const versionNumber = '1.0.000'
let harpUserALT = ''
const measureCQL = MeasureCQL.SBTEST_CQL
const testCaseJson = TestCaseJson.TestCaseJson_Valid
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail'
const testCaseSeries = 'SBTestSeries'

describe('Measure Transfer - Measure set transfer & Non-owner checks', () => {
    /* 
        includes verifications for initiating transfer from MeasuresPage
        and
        tranferred measures are viewable on Owned Measures tab
    */

    beforeEach('Create Measure and Set Access Token', () => {

        harpUserALT = OktaLogin.getUser(true)
        let now = Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + now, cqlLibraryName + now, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    it('Verify all instances in the Measure set (Version and Draft) are Transferred to the new owner', () => {

        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Version the Measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(Toasts.generalToast).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')
        cy.reload()

        //Draft the Versioned Measure
        MeasuresPage.actionCenter('draft')
        cy.intercept('/api/measures/*/draft').as('drafted')
        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(randomMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()

        let currentUser = Cypress.env('selectedUser')
        cy.wait('@drafted').then(int => {
            // capture measureId of new draft
            cy.writeFile('cypress/fixtures/' + currentUser + '/measureId1', int.response.body.id)
        })
        cy.get(Toasts.generalToast).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //Share Measure with ALT User
        MeasuresPage.actionCenter('transfer', 1)
        //Verify message on the transfer pop up screen
        cy.get('[class="transfer-dialog-info-text"]').should('contain.text', 'You are about to Transfer ownership of the following measure(s). All versions and drafts will be transferred. So only the most recent measure name appears here.This action cannot be undone.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()
        OktaLogin.UILogout()

        //Login as ALT User
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        // ALT User now owns both measures in the measureSet
        cy.get(MeasuresPage.measureListTitles).should('contain', randomMeasureName)

        currentUser = Cypress.env('selectedUser')
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_expandArrow"]').click().wait(1000)
            cy.get(MeasuresPage.measureListTitles).should('contain', measureName)
        })

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName, false, true)
    })

    it('Verify Transfer button disabled for non Measure owner', () => {
        //Login as ALT User
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 60000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Select the Measure
        let currentUser = Cypress.env('selectedUser')
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 1200000)
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="transfer-action-tooltip"]').should('not.be.enabled')
        cy.get('[data-testid="transfer-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'You cannot transfer a measure you do not own, you have selected at least 1 measure that you do not own')

        //Logout and Delete Measure with Regular user
        OktaLogin.UILogout()
        const currentAltUser = Cypress.env('selectedAltUser')
        OktaLogin.setupUserSession(false)
        Utilities.deleteMeasure()
    })
})

describe('Delete Test Case with Transferred user', () => {
    /* 
        includes verification for initiating transfer from EditMeasurePage
        and
        transferred measures are editable by new owner
    */

    beforeEach('Create Measure and Set Access Token', () => {

        harpUserALT = OktaLogin.getUser(true)

        let now = Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + now, cqlLibraryName + now, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        MeasuresPage.actionCenter('edit')

        EditMeasurePage.actionCenter(EditMeasureActions.transfer)
        //Verify message on the transfer pop up screen
        cy.get('[class="transfer-dialog-info-text"]').should('contain.text', 'You are about to Transfer ownership of the following measure(s). All versions and drafts will be transferred. So only the most recent measure name appears here.This action cannot be undone.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()
        OktaLogin.UILogout()
    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()

    })

    it('Verify Test Case can be deleted by the new owner after transfer', () => {

        //Login as Alt User
        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete ' + testCaseTitle + '?')
        cy.get(CQLEditorPage.deleteContinueButton).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
    })
})
