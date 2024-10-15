import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Test Case 1'
let secondTestCaseTitle = 'Test Case 2'
let testCaseDescription = 'Description 1'
let secondTestCaseDescription = 'Description 2'
let testCaseSeries = 'Test Series 1'
let secondTestCaseSeries = 'Test Series 2'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
let measureCQLPFTests = MeasureCQL.CQL_Populations
let validFileToUpload = downloadsFolder.toString()
let testCaseJson2nd = TestCaseJson.TestCaseJson_Valid
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let newMeasureName = measureName + randValue
let measureCQL = MeasureCQL.CQL_Multiple_Populations
let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

//skipping tests until the TestCaseID feature flag is set permanently to true, in PROD
describe.skip('Test Case sorting by Test Case number', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, 0, false,
            '2012-01-02', '2013-01-01')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Qi Core Test Case number and sorting behavior', () => {

        //login
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd, testCaseJson2nd)

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/ATest Series 1Test Case 1' + testCaseDescription + todaysDate + 'Select')
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/ATest Series 1Test Case 1' + testCaseDescription + todaysDate + 'Select2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/ATest Series 1Test Case 1' + testCaseDescription + todaysDate + 'Select')
        //thrid click removes sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/ATest Series 1Test Case 1' + testCaseDescription + todaysDate + 'Select')
        //sort by case number and then edit some test case that is not at the top -- once user navigates back to the test case list page default sorting should appear
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/ATest Series 1Test Case 1' + testCaseDescription + todaysDate + 'Select2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementVisible(TestCasesPage.testCaseAction0Btn, 5000)
        cy.get(TestCasesPage.testCaseAction0Btn).find('[class="action-button"]').should('contain.text', 'Select').wait(2500).click()
        cy.get('[class="popover-content"]').find('[class="btn-container"]').find('[aria-label="edit-test-case-Second TC - Title for Auto Test"]').contains('edit').click()
        cy.get(TestCasesPage.detailsTab).scrollIntoView().wait(2500).click()
        cy.get(TestCasesPage.testCaseTitle).click()
        cy.get(TestCasesPage.testCaseTitle).type('{moveToEnd}')
        cy.get(TestCasesPage.testCaseTitle).type('12')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully with warnings in JSON')
        cy.get(TestCasesPage.testCaseTitle).click()
        cy.get(TestCasesPage.testCaseTitle).type('{moveToEnd}')
        cy.get(TestCasesPage.testCaseTitle).type('{backspace}{backspace}')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully with warnings in JSON')
        //Navigate back to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/ATest Series 1Test Case 1' + testCaseDescription + todaysDate + 'Select')

    })
})

//skipping tests until the TestCaseID feature flag is set permanently to true, in PROD
describe.skip('Import Test cases onto an existing Qi Core measure via file and ensure test case ID / numbering appears', () => {

    beforeEach('Create measure and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        //create first measure and two test cases on it
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'firstMeasure', CqlLibraryName + 'firstMeasure', measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI('firstMeasure' + testCaseTitle, 'firstMeasure' + testCaseSeries, 'firstMeasure' + testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI('firstMeasure' + secondTestCaseTitle, 'firstMeasure' + secondTestCaseSeries, 'firstMeasure' + secondTestCaseDescription, validTestCaseJsonBobby, false, true)

        //create second measure and two test cases on it
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + 'secondMeasure', CqlLibraryName + 'secondMeasure', measureCQLPFTests, 2)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean', 2)
        TestCasesPage.CreateTestCaseAPI('secondMeasure' + testCaseTitle, 'secondMeasure' + testCaseSeries, 'secondMeasure' + testCaseDescription, validTestCaseJsonLizzy, false, false, false, 2)
        TestCasesPage.CreateTestCaseAPI('secondMeasure' + secondTestCaseTitle, 'secondMeasure' + secondTestCaseSeries, 'secondMeasure' + secondTestCaseDescription, validTestCaseJsonBobby, false, true, false, 2)

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()


    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName + 'firstMeasure', CqlLibraryName + 'firstMeasure')
        Utilities.deleteMeasure(measureName + 'secondMeasure', CqlLibraryName + 'secondMeasure', false, false, 2)

    })


    it('Qi Core Test Case number appears on test case import', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //export test case
        cy.get(EditMeasurePage.testCasesTab).click()
        //navigate to the edit page for the second test case
        //TestCasesPage.testCaseAction('edit')
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).wait(2000).scrollIntoView().click({ force: true })

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

        cy.get(Header.mainMadiePageButton).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit', 2)

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction4N/AfirstMeasureTest Series 1firstMeasureTest Case 1firstMeasureDescription 1' + todaysDate + 'Select3N/AfirstMeasureTest Series 2firstMeasureTest Case 2firstMeasureDescription 2' + todaysDate + 'Select2N/AsecondMeasureTest Series 2secondMeasureTest Case 2secondMeasureDescription 2' + todaysDate + 'Select1N/AsecondMeasureTest Series 1secondMeasureTest Case 1secondMeasureDescription 1' + todaysDate + 'Select')

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction4N/AfirstMeasureTest Series 1firstMeasureTest Case 1firstMeasureDescription 1' + todaysDate + 'Select3N/AfirstMeasureTest Series 2firstMeasureTest Case 2firstMeasureDescription 2' + todaysDate + 'Select2N/AsecondMeasureTest Series 2secondMeasureTest Case 2secondMeasureDescription 2' + todaysDate + 'Select1N/AsecondMeasureTest Series 1secondMeasureTest Case 1secondMeasureDescription 1' + todaysDate + 'Select')
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/AsecondMeasureTest Series 1secondMeasureTest Case 1secondMeasureDescription 1' + todaysDate + 'Select2N/AsecondMeasureTest Series 2secondMeasureTest Case 2secondMeasureDescription 2' + todaysDate + 'Select3N/AfirstMeasureTest Series 2firstMeasureTest Case 2firstMeasureDescription 2' + todaysDate + 'Select4N/AfirstMeasureTest Series 1firstMeasureTest Case 1firstMeasureDescription 1' + todaysDate + 'Select')
        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction4N/AfirstMeasureTest Series 1firstMeasureTest Case 1firstMeasureDescription 1' + todaysDate + 'Select3N/AfirstMeasureTest Series 2firstMeasureTest Case 2firstMeasureDescription 2' + todaysDate + 'Select2N/AsecondMeasureTest Series 2secondMeasureTest Case 2secondMeasureDescription 2' + todaysDate + 'Select1N/AsecondMeasureTest Series 1secondMeasureTest Case 1secondMeasureDescription 1' + todaysDate + 'Select')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

    })
})