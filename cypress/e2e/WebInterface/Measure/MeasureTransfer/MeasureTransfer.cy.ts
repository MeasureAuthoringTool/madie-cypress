import { Environment } from "../../../../Shared/Environment"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let updatedCqlLibraryName = cqlLibraryName + 'someUpdate'
let updatedMeasureName = measureName + 'someUpdate'
let randValue = (Math.floor((Math.random() * 1000) + 1))
let randomMeasureName = 'TransferTestMeasure' + randValue + 5
let versionNumber = '1.0.000'
let harpUserALT = Environment.credentials().harpUserALT
let measureCQL = MeasureCQL.SBTEST_CQL
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Measure Transfer', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify transferred Measure is viewable under My Measures tab', () => {

        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()
        cy.get(MeasuresPage.measureListTitles).should('contain', newMeasureName)
    })

    it('Verify Measure can be edited by the transferred user', () => {

        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()

        //Edit Measure details
        cy.get(LandingPage.sharedMeasures).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureNameTextBox).clear().type(updatedMeasureName)
        cy.get(EditMeasurePage.cqlLibraryNameTextBox).clear().type(updatedCqlLibraryName)
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        //Edit Measure CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        Utilities.typeFileContents('cypress/fixtures/CQLForTestCaseExecution.txt', EditMeasurePage.cqlEditorTextBox)

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        MeasureGroupPage.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.reportingTab).click()

        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)

        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        //Create New Test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })
})

//Skipping until feature flag TransferMeasure is removed
describe.skip('Measure Transfer - Action Centre buttons', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue + 5
    let newCqlLibraryName = cqlLibraryName + randValue + 5

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()
    })

    it('Verify Measure owner can transfer Measure from Action centre transfer button on My Measures page', () => {

        //Login as Regular user and transfer Measure to ALT user
        OktaLogin.Login()

        MeasuresPage.actionCenter('transfer')
        //Verify message on the transfer pop up screen
        cy.get('[class="transfer-dialog-info-text"]').should('contain.text', 'You are about to Transfer the following measure(s). All versions and drafts will be transferred, so only the most recent measure name appears here.')
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()

        //Logout and Delete Measure with ALT user
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName, false, false)

    })

    it('Verify Measure owner can transfer Measure from Action centre transfer button on Edit Measure page', () => {

        //Login as Regular user and transfer Measure to ALT user
        OktaLogin.Login()
        //Navigate to Edit Measure page
        MeasuresPage.actionCenter('edit')
        EditMeasurePage.actionCenter(EditMeasureActions.transfer)
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get(MeasuresPage.transferContinueButton).click()

        //Logout and Delete Measure with ALT user
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName, false, false)

    })

    it('Verify Transfer button disabled for non Measure owner', () => {

        //Login as ALT User
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 60000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Select the Measure
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 1200000)
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="transfer-action-tooltip"]').should('not.be.enabled')
        cy.get('[data-testid="transfer-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'You cannot transfer a measure you do not own, you have selected at least 1 measure that you do not own')

        //Logout and Delete Measure with Regular user
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

})

describe('Measure Transfer - Multiple instances', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.reportingTab).click()

        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)

        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationDescQiCore, 5000)

        cy.get(MeasureGroupPage.improvementNotationDescQiCore).type('some imporvement notation description')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        cy.get(Header.measures).click()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })

    it('Verify all instances in the Measure set (Version and Draft) are Transferred to the user', () => {


        //Version the Measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')
        cy.reload()

        //Draft the Versioned Measure
        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(randomMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get('.toast').should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        OktaLogin.UILogout()
        //Share Measure with ALT User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookie()
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)


        //Login as ALT User
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()
        cy.get('[class="table-body measures-list"]').should('contain', randomMeasureName)
    })
})

describe('Delete Test Case with Transferred user', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify Test Case can be deleted by the Transferred user', () => {

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //Login as Alt User
        OktaLogin.AltLogin()
        cy.get(LandingPage.sharedMeasures).click()
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete ' + testCaseTitle + '?')
        cy.get(CQLEditorPage.deleteContinueButton).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
    })
})
