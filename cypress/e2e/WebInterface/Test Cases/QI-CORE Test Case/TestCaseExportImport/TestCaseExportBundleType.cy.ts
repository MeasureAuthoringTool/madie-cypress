import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCaseAction, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../../Shared/Header"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

const timestamp = Date.now()
const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')
const measureName = 'ExportBundleType' + timestamp
const CqlLibraryName = 'ExportBundleTypeLib' + timestamp
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'export test case scenarios'
const testCaseSeries = 'SBTestSeries'
const measureCQLPFTests = MeasureCQL.CQL_Populations
const testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')

/*
    After MAT-9275 and MAT-9276, we will always force our bundle types to be "collection" while
    within Madie.
*/

describe('QI-Core: Export Bundle options for Non Measure Owner: Transaction or Collection', () => {

    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Export single QI-Core Test case by Non Measure Owner: Transaction', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        TestCasesPage.actionCenter(TestCaseAction.exportTransaction)

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')
    })

    it('Export single QI-Core Test case by Non Measure Owner: Collection', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        TestCasesPage.actionCenter(TestCaseAction.exportCollection)
    })
})

describe('QI-Core: Single Test Case on Measure: Export / Import', () => {

    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Export single QI-Core Test case Transaction bundle and Import to the same Measure', () => {

        //export transaction
        TestCasesPage.checkTestCase(1)
        TestCasesPage.actionCenter(TestCaseAction.exportTransaction)

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

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

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/ASBTestSeriesTitle for Auto Test' + testCaseDescription + todaysDate)

        //navigate to test case edit / detail page
        TestCasesPage.clickEditforCreatedTestCase()

        /* 
            note: With https://jira.cms.gov/browse/MAT-9275 this seems like 
            it should be collection, but that story is scoped to only QiiCore 6+
        */
        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "transaction"')
    })

    it('Export single QI-Core Test case Collection bundle and Import to the same Measure', () => {

        //export transaction
        TestCasesPage.checkTestCase(1)
        TestCasesPage.actionCenter(TestCaseAction.exportCollection)

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

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

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/ASBTestSeriesTitle for Auto Test' + testCaseDescription + todaysDate)

        //navigate to test case edit / detail page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "collection"')
    })
})

describe('QI-Core: Multiple Test Case on Measure: Export / Import', () => {

    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseSeries + 'a', testCaseDescription + 'a', testCaseJson)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseSeries + 'b', testCaseDescription + 'b', testCaseJson, false, true)
   
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Export multiple QI-Core Test cases Transaction bundle and Import to the same Measure', () => {

        //export both text cases
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        TestCasesPage.actionCenter(TestCaseAction.exportTransaction)

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
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

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/A' + testCaseSeries + 'b' + 'Title for Auto Testb' + testCaseDescription + 'b' + todaysDate)
        .should('contain.text', '1N/A' + testCaseSeries + 'a' + 'Title for Auto Testa' + testCaseDescription + 'a' + todaysDate)

        //navigate to test case edit / detail page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "transaction"')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test case edit / detail page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "transaction"')
    })

    it('Export multiple QI-Core Test cases Collection bundle and Import to the same Measure', () => {

        //export both text cases
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        TestCasesPage.actionCenter(TestCaseAction.exportCollection)

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()
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

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASBTestSeriesbTitle for Auto Testb' + testCaseDescription + 'b' + todaysDate)
            .should('contain.text', '1N/ASBTestSeriesaTitle for Auto Testa' + testCaseDescription + 'a' + todaysDate)

        //navigate to test case edit / detail page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "collection"')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test case edit / detail page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        cy.get(TestCasesPage.aceEditor).should('include.text', '"type": "collection"')
    })
})
