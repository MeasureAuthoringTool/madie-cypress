import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../../Shared/Header"
import { LandingPage } from "../../../../../Shared/LandingPage"

let singleTestCaseFile = 'patients_42BF391F-38A3-4C0F-9ECE-DCD47E9609D9_QDM_56_1712926664.json'
const testCase1: TestCase = {
    title: 'Test Case 1',
    description: 'Description 1',
    group: 'Test Series 1'
}
const testCase2: TestCase = {
    title: 'Second TC - Title for Auto Test',
    description: 'SecondTC-DENOMFail',
    group: 'SecondTC-SBTestSeries'
}
const qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')
const timestamp = Date.now()
const measureName = 'ProportionPatient' + timestamp
const measureQDMManifestName = 'QDMManifestTest' + timestamp
const CqlLibraryName = 'ProportionPatient' + timestamp
const versionNumber = '1.0.000'
const newMeasureName = 'Updated' + measureName

describe('QDM Test Case sorting by Test Case number', () => {

    beforeEach('Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureQDMManifestName, CqlLibraryName)
    })

    it('QDM Test Case number and sorting behavior', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseNameDropdown).should('contain.text', 'Case #2: SecondTC-SBTestSeries - Second TC - Title for Auto Test')

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 710000)

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCase2.description + todaysDate + 'Edit1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
        Utilities.waitForElementVisible(TestCasesPage.tcColumnHeading, 5000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCase2.description + todaysDate + 'Edit')
        //second click sorts in descending order
        Utilities.waitForElementVisible(TestCasesPage.tcColumnHeading, 5000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCase2.description + todaysDate + 'Edit1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
        //thrid click removes sorting                                                 Case #StatusGroupTitleDescriptionLast Saved2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto TestSecondTC-DENOMFail01/28/2025Edit1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC01/28/2025Edit
        Utilities.waitForElementVisible(TestCasesPage.tcColumnHeading, 5000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCase2.description + todaysDate + 'Edit1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
        //sort by case number and then edit some test case that is not at the top -- once user navigates back to the test case list page default sorting should appear
        Utilities.waitForElementVisible(TestCasesPage.tcColumnHeading, 5000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCase2.description + todaysDate + 'Edit')

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMRace).scrollIntoView().click()
        cy.get('[data-value="Other Race"]').click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        Utilities.waitForElementToNotExist(TestCasesPage.tcSaveSuccessMsg, 20000)
        //Navigate back to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCase2.description + todaysDate + 'Edit1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
    })

    it('QDM Test Case number appears on cloned test case', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 710000)

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterClone).click()

        cy.get('[class="toast success"]').should('contain.text', 'Test case cloned successfully')
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('includes.text', 'Case #StatusGroupTitleDescriptionLast Saved3N/AQDMManifestTCGroupQDMManifestTC')
    })
})

describe('Import Test cases onto an existing QDM measure via file and ensure test case ID / numbering appears', () => {

    beforeEach('Login and Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.UILogout
        Utilities.deleteMeasure(measureQDMManifestName, CqlLibraryName)
    })

    it('QDM Test Case number appears on test case import', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.actionCenter('edit')

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 710000)

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get('[data-testid="file-drop-div"]').click()
        cy.get(TestCasesPage.filAttachDropBox).attachFile(singleTestCaseFile)

        //click on the 'Import' button on the modal window
        TestCasesPage.clickQDMImportTestCaseButton()

        // confirm there are 75 test cases total - most recent is #75
        TestCasesPage.grabValidateTestCaseNumber(75)

        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)

        TestCasesPage.grabValidateTestCaseNumber(1)
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase1.title, testCase1.group)
    })
})

describe('QDM Measure - Test case number on a Draft Measure', () => {

    beforeEach('Create Measure, Test case & Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateTestCaseAPI(testCase1.group, testCase1.title, testCase1.description)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Delete Measure and Logout', () => {

        Utilities.deleteVersionedMeasure(measureQDMManifestName, CqlLibraryName)
        OktaLogin.UILogout()
    })

    it('Test case number assigned to a Draft Measure for QDM Measure', () => {

        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)

        //Version the Measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')

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
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 710000)
        //Validate Test case ID for Draft Measure
        TestCasesPage.grabValidateTestCaseNumber(2)

    })
})

describe('QDM Test Case - Deleting all test cases resets test case counter', () => {

    let qdmMeasureName = measureName + timestamp
    let qdmCqlLibraryName = CqlLibraryName + timestamp

    beforeEach('Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Test case number resets when test case count equals 0', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        // navigate to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 710000)

        // verify there are 2 test cases shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 2)

        // delete test case #1
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).click()
        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete QDMManifestTC?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // verify test case #1 no longer shown, test case #2 is still shown
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', 'QDMManifestTC')
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase2.title, testCase2.group)

        // delete test case #2
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).click()
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

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
