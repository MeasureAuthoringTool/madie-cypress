import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { MadieObject, PermissionActions, Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Header } from "../../../../../Shared/Header"
import { Toasts } from "../../../../../Shared/Toasts"
const { deleteDownloadsFolderBeforeAll, deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')
const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')
let harpUserALT = ''

const measureName = 'ImportValidations' + Date.now()
let CqlLibraryName = 'ImportValidationsLib' + Date.now()
let firstMeasureName = ''
let updatedCQLLibraryName = ''
const testCaseTitle = 'Passing Test Case'
const secondTestCaseTitle = 'Failing Test Case'
const testCaseDescription = 'DENOMPass'
const secondTestCaseDescription = 'DENOMFail'
const testCaseSeries = 'SBTestSeriesP'
const secondTestCaseSeries = 'SBTestSeriesF'
const validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
const validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
const measureCQLPFTests = MeasureCQL.CQL_Populations
const versionNumber = '1.0.000'

describe('Test Case Import: functionality tests', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        harpUserALT = OktaLogin.getUser(true)

        CqlLibraryName = 'ImportValidation1Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Measure is not owned by nor shared with user: import button is not available', () => {

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 45000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.importTestCasesBtn, 35000)
    })

    it('Measure is in DRAFT status: measure has been shared with user: import button is available, import can occur, import can be cancelled and modal will close, upon cancelling', () => {

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //edit second test case so that it will fail
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(Toasts.otherSuccessToast).should('have.text', Toasts.warningOffsetText)
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

        OktaLogin.UILogout()

        //Share Measure with ALT User
        OktaLogin.setupUserSession(false)

        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //navigating to the All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export test cases - select all
        cy.get('input[type="checkbox"]').first().check() 
        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.get(EditMeasurePage.testCasesTab).click()
        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        //Case #StatusGroupTitleDescriptionLast Saved2N/ASBTestSeriesFFailing Test CaseDENOMFail01/24/2025Edit1N/ASBTestSeriesPPassing Test CaseDENOMPass01/24/2025Edit
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASBTestSeriesFFailing Test Case' + secondTestCaseDescription + todaysDate)
            .should('contain.text', 'Edit1N/ASBTestSeriesPPassing Test Case' + testCaseDescription + todaysDate)

        //verify confirmation message
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 35000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', '(2) Test cases imported successfully')

        // export test cases - select all
        cy.get('input[type="checkbox"]').first().check() 
        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.get(EditMeasurePage.testCasesTab).click()
        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip')

        //cancel import
        cy.get(TestCasesPage.importTestCaseCancelBtnOnModal).click()

        //confirm modal window is no longer present
        //wait until select / drag and drop modal no longer appears
        Utilities.waitForElementToNotExist(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)
    })
})

describe('Test Case Import validations for versioned Measures', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        harpUserALT = OktaLogin.getUser(true)

        CqlLibraryName = 'ImportValidation2Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //navigate to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Version Measure
        MeasuresPage.actionCenter('version')

        //Version measure and verify that it was versioned
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        Utilities.waitForElementEnabled(MeasuresPage.measureVersionContinueBtn, 60000)
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get('.toast').should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')
    })

    it('Measure is in VERSIONED status: user is owner: import button is available', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(TestCasesPage.paginationLimitSelect, 16500)

        // confirm that the import button is present & enabled
        cy.get(TestCasesPage.importTestCasesBtn).should('be.enabled')
    })

    it('Measure is in VERSIONED status: measure has been shared with user: import button is available', () => {

        OktaLogin.UILogout()

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)
        //Login as ALT User
        OktaLogin.AltLogin()

        //navigating to the All Measures tab
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 45000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(TestCasesPage.paginationLimitSelect, 16500)

        // confirm that the import button is present & enabled
        cy.get(TestCasesPage.importTestCasesBtn).should('be.enabled')
    })
})

describe('Test Case Import: File structure Not Accurate validation tests', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'ImportValidation3Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Importing: not a .zip file', () => {

        //navigate to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/fixtures/CQLCsNoVersionVSACExists.txt', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.tcImportError, 35000)
        cy.get(TestCasesPage.tcImportError + ' > small').should('contain.text', 'The import file must be a zip file. No Test Cases can be imported.')
    })

    it('Importing: .zip\'s test case folder does not contain a json file', () => {

        //navigate to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/fixtures/eCQMTitle-v0.0.000-FHIR4-TestCases (4).zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases (4).zip')

        //verifies alert message at top of page informing user that no test case was imported
        cy.get(TestCasesPage.tcImportError + ' > small').should('contain.text', 'Unable to find any valid test case json. Please make sure the format is accurate')
    })

    it('Importing: .zip\'s test case folder contains multiple json files', () => {

        //navigate to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/fixtures/eCQMTitle-v0.0.000-FHIR4-TestCases (3).zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases (3).zip')

        //verifies alert message at tope of page informing user that no test case was imported
        cy.get(TestCasesPage.tcImportError + ' > small').should('contain.text', 'Unable to find any valid test case json. Please make sure the format is accurate')
    })

    it('Importing: .zip\'s test case folder contains malformed json file', () => {

        //navigate to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/fixtures/eCQMTitle-v0.0.000-FHIR4-TestCases (5).zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases (5).zip')

        cy.get(TestCasesPage.tcImportError).should('include.text', 'Zip file is in an incorrect format. If this is an export prior to June 20, 2024 please reexport your test case and try again.')
    })
})

describe('Test Case Import: New Test cases on measure validations: uniqueness tests related to family name and given name', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        firstMeasureName = measureName + 'a'
        updatedCQLLibraryName = 'ImportValidation4Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, updatedCQLLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()

        Utilities.deleteMeasure()
        Utilities.deleteMeasure(measureName + 'b', CqlLibraryName,null,null, 2)
    })

    it('Importing two new test cases with unique family name and given name: verify expected match that of original test case; verify family name is Test Case group; verify that given name is Test Case title; verify that test case is editable', () => {

        CqlLibraryName = 'TestLibrary6' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'b', CqlLibraryName, measureCQLPFTests, 2)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean', 2)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(true, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b1', testCaseSeries + 'b1', testCaseDescription + 'b1', validTestCaseJsonLizzy, true)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle + 'b2', secondTestCaseSeries + 'b2', secondTestCaseDescription + 'b2', validTestCaseJsonBobby, true, true)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc)
            .click()
            .type('Some description')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 35000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export test cases - select all
        cy.get('input[type="checkbox"]').first().check() 
        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', {
            action: 'drag-drop',
            force: true
        })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        // checks for details of tc1 and tc2, but does not care about order
        cy.get(TestCasesPage.testCaseListTable).contains(/SBTestSeriesFb2Failing Test Caseb2DENOMFailb2/).should('exist')
        cy.get(TestCasesPage.testCaseListTable).contains(/SBTestSeriesPb1Passing Test Caseb1DENOMPassb1/).should('exist')

        //verify confirmation message
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseSuccessInfo, 35000)

        cy.get(TestCasesPage.importTestCaseSuccessInfo).should('contain.text', 'Following test case(s) were imported successfully, but the measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been')
    })
})

describe('Test case uniqueness error validation', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, and create group', () => {

        firstMeasureName = measureName + 'a'
        updatedCQLLibraryName = 'ImportValidation5Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, updatedCQLLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()

        Utilities.deleteMeasure(firstMeasureName, updatedCQLLibraryName)
    })

    it('Export existing test case, then delete the existing test case, then create new test case with previous series and title and, then, attempt to import previously exported test case: verify uniqueness error', () => {


        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b1', testCaseSeries + 'b1', testCaseDescription + 'b1', validTestCaseJsonBobby, false, false, false)

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export test cases - select all
        cy.get('input[type="checkbox"]').first().check() 
        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        //delete test case
        cy.get('[data-testid="delete-action-icon"]').click()
        Utilities.waitForElementVisible(CQLEditorPage.deleteContinueButton, 35000)
        cy.get(CQLEditorPage.deleteContinueButton).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle + 'b1')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription + 'b1')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries + 'b1')
        cy.get('#test-case-series-option-0').click()

        TestCasesPage.clickCreateTestCaseButton()

        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1InvalidSBTestSeriesPb1Passing Test Caseb1' + testCaseDescription + 'b1' + todaysDate)

        //verifies alert message at top of page informing user that no test case was imported
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseAlertMessage, 35000)
        cy.contains('(0) test case(s) were imported. The following ( 1) test case(s) could not be imported. Please ensure that your formatting is correct and try again.').should('be.visible')
        cy.get(TestCasesPage.importTestCaseSuccessInfo).find('[data-testid="failed-test-cases"]').find('span').should('contain.text', 'Reason: The Test Case Group and Title are already used in another test case on this measure. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
    })
})

describe('Test Case Import: New Test cases on measure validations: PC does not match between measures', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        firstMeasureName = measureName + 'a'
        updatedCQLLibraryName = 'ImportValidation6Lib' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(firstMeasureName, updatedCQLLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()

        Utilities.deleteMeasure(firstMeasureName, updatedCQLLibraryName)
    })

    it('Importing two new test cases with the pc not matching on the measure in which the test cases is being imported into', () => {

        CqlLibraryName = 'TestLibrary6' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'b', CqlLibraryName, measureCQLPFTests, 2)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(2, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b1', testCaseSeries + 'b1', testCaseDescription + 'b1', validTestCaseJsonLizzy, true, false)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle + 'b2', secondTestCaseSeries + 'b2', secondTestCaseDescription + 'b2', validTestCaseJsonBobby, true, true)
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit', 2)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export test cases - select all
        cy.get('input[type="checkbox"]').first().check() 
        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred 
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        // checks for details of tc1 and tc2, but does not care about order
        cy.get(TestCasesPage.testCaseListTable).contains(/SBTestSeriesFb2Failing Test Caseb2DENOMFailb2/).should('exist')
        cy.get(TestCasesPage.testCaseListTable).contains(/SBTestSeriesPb1Passing Test Caseb1DENOMPassb1/).should('exist')

        //verifies alert message at tope of page informing user that no test case was imported
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseAlertMessage, 35000)
        cy.get(TestCasesPage.importTestCaseAlertMessage).find(TestCasesPage.importTestCaseSuccessInfo).should('contain.text', 'Following test case(s) were imported successfully, but the measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been')
    })
})

