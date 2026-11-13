import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../../Shared/Utilities"
import { TestCaseAction, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../../Shared/Header"
import { TestData } from "../../../../../Shared/TestData"

const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')
let measureName = ''
let CqlLibraryName = ''
let setupAttempt = 0
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'export test case scenarios'
const testCaseSeries = 'SBTestSeries'
const measureCQLPFTests = MeasureCQL.CQL_Populations
const testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')

const createUniqueMeasureNames = () => {
    const uniqueSuffix = `${Date.now()}${++setupAttempt}`
    measureName = `ExportBundleType${uniqueSuffix}`
    CqlLibraryName = `ExportBundleTypeLib${uniqueSuffix}`
}

describe('QI-Core: Export Bundle options for Non Measure Owner: Transaction or Collection', () => {

    deleteDownloadsFolderBeforeEach()

    beforeEach('Create and share a measure with an alternate user', () => {
        createUniqueMeasureNames()
        const alternateUser = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

        return Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, alternateUser)
            .then(() => TestData.requestMeasureLock('DELETE'))
            .its('status')
            .should('eq', 200)
    })

    afterEach('Logout and Clean up Measures', () => {
        return TestData.requestMeasureLock('DELETE')
            .its('status')
            .should('eq', 200)
            .then(() => Utilities.deleteMeasure())
    })

    it('Export single QI-Core Test case by Non Measure Owner: Transaction', () => {

        OktaLogin.SessionAltLogin()

        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').click()
        MeasuresPage.searchForMeasureByName(measureName)

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

        OktaLogin.SessionAltLogin()

        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').click()
        MeasuresPage.searchForMeasureByName(measureName)

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
        createUniqueMeasureNames()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

        return TestData.saveMeasureCql(measureCQLPFTests)
            .then((response) => {
                TestData.expectSavedMeasureCql(response)
            })
            .then(() => OktaLogin.SessionLogin())
            .then(() => {
                MeasuresPage.actionCenter('edit')
                TestCasesPage.openTestCasesTab(TestCasesPage.testCaseListTable)
            })
    })

    afterEach('Logout and Clean up Measures', () => {
        return Utilities.deleteMeasure()
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

        TestCasesPage.assertJsonEditorText('"type": "collection"')
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

        TestCasesPage.assertJsonEditorText('"type": "collection"')
    })
})

describe('QI-Core: Multiple Test Case on Measure: Export / Import', () => {

    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, measure group, test case and login', () => {
        createUniqueMeasureNames()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseSeries + 'a', testCaseDescription + 'a', testCaseJson)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseSeries + 'b', testCaseDescription + 'b', testCaseJson, false, true)

        return TestData.saveMeasureCql(measureCQLPFTests)
            .then((response) => {
                TestData.expectSavedMeasureCql(response)
            })
            .then(() => OktaLogin.SessionLogin())
            .then(() => {
                MeasuresPage.actionCenter('edit')
                TestCasesPage.openTestCasesTab(TestCasesPage.testCaseListTable)
            })
    })

    afterEach('Logout and Clean up Measures', () => {
        return Utilities.deleteMeasure()
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

        TestCasesPage.assertJsonEditorText('"type": "collection"')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test case edit / detail page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        TestCasesPage.assertJsonEditorText('"type": "collection"')
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

        TestCasesPage.assertJsonEditorText('"type": "collection"')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test case edit / detail page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        TestCasesPage.assertJsonEditorText('"type": "collection"')
    })
})
