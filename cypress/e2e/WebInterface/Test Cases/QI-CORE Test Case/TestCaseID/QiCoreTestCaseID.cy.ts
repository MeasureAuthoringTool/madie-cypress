import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { Header } from "../../../../../Shared/Header"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

const timestamp = Date.now()
let measureName = 'QiCoreTestCaseId' + timestamp
let CqlLibraryName = 'QiCoreTestCaseIdLib' + timestamp
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
let validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
let versionNumber = '1.0.000'
let measureCQLPFTests = MeasureCQL.CQL_Populations.replace('TestLibrary4664', measureName)
let measureCQL = MeasureCQL.CQL_Multiple_Populations.replace('TestLibrary4664', measureName)
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')


describe('Test Case sorting by Test Case number', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, 0, false,
            '2012-01-02', '2013-01-01')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Qi Core Test Case number and sorting behavior', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.testCaseNameDropdown).should('contain.text', 'Case #1: Test Series 1 - Test Case 1')

        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group, testCase2.json)

        const descList = 'Case #StatusGroupTitleDescriptionLast Saved2N/A' + testCase2.group + testCase2.title + testCase2.description + todaysDate + 'Edit1N/A' + testCase1.group + testCase1.title + testCase1.description + todaysDate + 'Edit'
        const ascList = 'Case #StatusGroupTitleDescriptionLast Saved1N/A' + testCase1.group + testCase1.title + testCase1.description + todaysDate + 'Edit2N/A' + testCase2.group + testCase2.title + testCase2.description + todaysDate + 'Edit'

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', descList)

        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', ascList)

        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', descList)

        //thrid click removes sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', descList)

        //sort by case number and then edit some test case that is not at the top -- once user navigates back to the test case list page default sorting should appear
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', ascList)
        //   Utilities.waitForElementVisible(TestCasesPage.testCaseAction0Btn, 5000)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()
        cy.get(TestCasesPage.testCaseTitle).click()
        cy.get(TestCasesPage.testCaseTitle).type('{moveToEnd}')
        cy.get(TestCasesPage.testCaseTitle).type('12')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully with warnings in JSON')
        cy.get(TestCasesPage.testCaseTitle).click()
        cy.get(TestCasesPage.testCaseTitle).type('{moveToEnd}')
        cy.get(TestCasesPage.testCaseTitle).type('{backspace}{backspace}')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully with warnings in JSON')
        //Navigate back to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', descList)
    })
})

describe('Import Test cases onto an existing Qi Core measure via file and ensure test case ID / numbering appears', () => {

    beforeEach('Create measure and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

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

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

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
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

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
        const ascCases = []
        cy.get('tr td:nth-child(2)').each(el => {
            ascCases.push(el.text())
        })
        cy.wrap(ascCases).should('deep.equal', ['1', '2', '3', '4'])

        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)

        const descCases = []
        cy.get('tr td:nth-child(2)').each(el => {
            descCases.push(el.text())
        })
        cy.wrap(descCases).should('deep.equal', ['4', '3', '2', '1'])

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
    })
})

describe('Qi Core Measure - Test case number on a Draft Measure', () => {

    beforeEach('Create Measure, Test case & Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Qualifying Encounters', 'Qualifying Encounters', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
        OktaLogin.Login()
    })

    afterEach('Delete Measure and Logout', () => {

        OktaLogin.UILogout
        Utilities.deleteVersionedMeasure(measureName, CqlLibraryName)
    })

    it('Test case number assigned to a Draft Measure for Qi Core Measure', () => {

        //Version the Measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type(versionNumber)
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')

        //Draft the Versioned Measure
        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(measureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        cy.reload()

        cy.get('[data-testid="row-item"]').eq(0).contains('Edit').click()
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase2.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase2.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase2.group).type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        //Navigate to test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        //Validate Test case ID for Draft Measure
        TestCasesPage.grabValidateTestCaseNumber(2)
    })
})

describe('QICore Test Case - Deleting all test cases resets test case counter', () => {

    beforeEach('Create measure and login', () => {

        CqlLibraryName = 'TestLibrary6' + Date.now()

        //create measure and two test cases on it
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')

        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, validTestCaseJsonBobby, false, true)

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Test case number resets when test case count equals 0', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()

        // verify there are 2 test cases shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 2)

        // delete test case #1
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete ' + testCase1.title + '?')
        cy.get(CQLEditorPage.deleteContinueButton).click()

        // verify test case #1 no longer shown, test case #2 is still shown
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase1.title)
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase2.title, testCase2.group)

        // delete test case #2
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).click()
        cy.get(CQLEditorPage.deleteContinueButton).click()

        // verify no test cases associated with this measure
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 0)
        cy.get(EditMeasurePage.testCasesTab).should('contain.text', 'Test Cases (0)')

        // create new case
        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group)

        // verify one test case shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 1)
        cy.get(EditMeasurePage.testCasesTab).should('contain.text', 'Test Cases (1)')

        // verify test case is test case #1
        TestCasesPage.grabValidateTestCaseNumber(1)
    })
})