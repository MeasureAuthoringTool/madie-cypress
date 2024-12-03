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
let versionNumber = '1.0.000'
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


describe('Test Case sorting by Test Case number', () => {

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

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // test for https://jira.cms.gov/browse/MAT-7893
        TestCasesPage.testCaseAction('edit')
        cy.get(TestCasesPage.testCasesBCText).should('contain.text', 'Case #1:')    

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
        cy.get('[class="popover-content"]').find('[class="btn-container"]').find('[aria-label="edit-test-case-Test Case 1"]').contains('edit').click()
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

describe('Import Test cases onto an existing Qi Core measure via file and ensure test case ID / numbering appears', () => {

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

        //export test case
        cy.get(EditMeasurePage.testCasesTab).click()
        //navigate to the edit page for the second test case
        //TestCasesPage.testCaseAction('edit')
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).scrollIntoView().click({ force: true })

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
        cy.get('tr td:first-child').each(el => {
            ascCases.push(el.text())
        })
        cy.wrap(ascCases).should('deep.equal', ['1','2','3','4'])
     
        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)

        const descCases = [] 
        cy.get('tr td:first-child').each(el => {
            descCases.push(el.text())
        })
        cy.wrap(descCases).should('deep.equal', ['4','3','2','1'])

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

    })
})

describe('Qi Core Measure - Test case number on a Draft Measure', () => {

    beforeEach('Create Measure, Test case & Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseSeries, testCaseTitle, testCaseDescription, testCaseJson)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
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
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(newMeasureName, versionNumber)
        cy.log('Version Created Successfully').wait(5000)

        //Draft the Versioned Measure
        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(newMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
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

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist').wait(500)
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(secondTestCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(secondTestCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(secondTestCaseSeries).type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        //Navigate to test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        //Validate Test case ID for Draft Measure
        TestCasesPage.grabValidateTestCaseNumber(2)

    })
})

describe('QICore Test Case - Deleting all test cases resets test case counter', () => {

    beforeEach('Create measure and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        //create measure and two test cases on it
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + '1Measure', CqlLibraryName + '1Measure', measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName + '1Measure', CqlLibraryName + '1Measure')
    })

    it('Test case number resets when test case count equals 0', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()

        // verify there are 2 test cases shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 2)

        // delete test case #1
        TestCasesPage.grabTestCaseId(1)
        TestCasesPage.testCaseAction("delete")
        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete ' + testCaseTitle + '?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // verify test case #1 no longer shown, test case #2 is still shown
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)
        TestCasesPage.grabValidateTestCaseTitleAndSeries(secondTestCaseTitle, secondTestCaseSeries)

        // delete test case #2
        TestCasesPage.grabTestCaseId(2)
        TestCasesPage.testCaseAction("delete")
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // verify no test cases associated with this measure
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 0)
        cy.get(EditMeasurePage.testCasesTab).should('contain.text', 'Test Cases (0)')

        // create new case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        // verify one test case shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 1)
        cy.get(EditMeasurePage.testCasesTab).should('contain.text', 'Test Cases (1)')

        // verify test case is test case #1
        TestCasesPage.grabValidateTestCaseNumber(1)

    })

})