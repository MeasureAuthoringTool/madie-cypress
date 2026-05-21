import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Header } from "../../../../Shared/Header"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

const timestamp = Date.now()
const measureName = 'QiCoreTestCaseId' + timestamp
const CqlLibraryName = 'QiCoreTestCaseIdLib' + timestamp
const testCase1: TestCase = {
    title: 'Test Case 1',
    description: 'Description 1',
    group: 'Test Series 1',
    json: TestCaseJson.TestCaseJson_Valid
}
const testCase2: TestCase = {
    title: 'Test Case 2',
    description: 'Description 2',
    group: 'Test Series 2',
    json: TestCaseJson.TestCaseJson_Valid
}
const validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
const measureCQLPFTests = MeasureCQL.CQL_Populations.replace('TestLibrary4664', measureName)

// functionality for test case Id's is equivalent across models - see QDMTestCaseID.cy.ts for other coverage scenarios
// scenario below is unique to QiCore since we do not allow test case import for QDM

describe('Import Test cases onto an existing Qi Core measure via file and ensure test case ID / numbering appears', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure and login', () => {

        //create first measure and two test cases on it
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'firstMeasure', CqlLibraryName + 'firstMeasure', measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI('firstMeasure' + testCase1.title, 'firstMeasure' + testCase1.group, 'firstMeasure' + testCase1.description, testCase1.json)
        TestCasesPage.CreateTestCaseAPI('firstMeasure' + testCase2.title, 'firstMeasure' + testCase2.group, 'firstMeasure' + testCase2.description, validTestCaseJsonBobby, false, true)

        //create second measure and two test cases on it
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'secondMeasure', CqlLibraryName + 'secondMeasure', measureCQLPFTests, 2)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean', 2)
        TestCasesPage.CreateTestCaseAPI('secondMeasure' + testCase1.title, 'secondMeasure' + testCase1.group, 'secondMeasure' + testCase1.description, testCase1.json, false, false, false, 2)
        TestCasesPage.CreateTestCaseAPI('secondMeasure' + testCase2.title, 'secondMeasure' + testCase2.group, 'secondMeasure' + testCase2.description, validTestCaseJsonBobby, false, true, false, 2)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure(measureName + 'firstMeasure', CqlLibraryName + 'firstMeasure')
        Utilities.deleteMeasure(measureName + 'secondMeasure', CqlLibraryName + 'secondMeasure', false, false, 2)
    })

    it('Qi Core Test Case number appears on test case import', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //export test cases
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)

        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 45500)
        cy.get(Header.mainMadiePageButton).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit', 2)

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
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

        // check that main contents of the 2 imported tc are there
        cy.get(TestCasesPage.testCaseListTable).contains(/firstMeasureTest Series 1firstMeasureTest Case 1firstMeasureDescription/).should('exist')
        cy.get(TestCasesPage.testCaseListTable).contains(/firstMeasureTest Series 2firstMeasureTest Case 2firstMeasureDescription 2/).should('exist')

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)

        /*
        Used these 2 articles to piece this together
        selector: https://www.geeksforgeeks.org/how-to-select-first-and-last-td-in-a-row-with-css/
        process: https://glebbahmutov.com/cypress-examples/recipes/get-text-list.html#collect-the-items-then-assert-the-list
        */
        const ascCases = new Array<string>
        cy.get('tr td:nth-child(2)').each(el => {
            ascCases.push(el.text())
        })
        cy.wrap(ascCases).should('deep.equal', ['1', '2', '3', '4'])

        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)

        const descCases = new Array<string>
        cy.get('tr td:nth-child(2)').each(el => {
            descCases.push(el.text())
        })
        cy.wrap(descCases).should('deep.equal', ['4', '3', '2', '1'])

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
    })
})
