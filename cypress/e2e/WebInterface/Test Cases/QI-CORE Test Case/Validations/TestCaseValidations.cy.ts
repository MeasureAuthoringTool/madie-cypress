import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"

const now = Date.now()
let measureName = 'TCValidations' + now
let CqlLibraryName = 'TCValidationsLib' + now
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + now
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
let updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'CMSTestSeries'

describe('Test Case Validations', () => {

    beforeEach('Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
    })

    it('Edit Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })

    it('Create Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')

        cy.get(TestCasesPage.createTestCaseTitleInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.createTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Edit Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.createTestCaseGroupInput).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Create Test Case: Group has more than 250 characters', () => {
    
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).type(twoFiftyTwoCharacters)
        cy.contains('Add').click()
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseGroupInlineError).contains('Test Case Group cannot be more ' +
            'than 250 characters.')
    })

    it('Edit Test Case: Group more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()
        cy.get(TestCasesPage.createTestCaseGroupInput).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.contains('Add').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })
})

describe('Attempting to create a test case without a title', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //save button to save the test case is not available
        cy.get(TestCasesPage.createTestCaseSaveButton).should('not.be.enabled')
    })

    it('Edit and update test case to have no title', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus()

        cy.get(TestCasesPage.testCaseTitle).clear()

        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')

        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()
        cy.get(TestCasesPage.createTestCaseGroupInput).type(updatedTestCaseSeries).type('{enter}')

        //save button to save the test case is not available
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.be.enabled')
    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        cy.get(TestCasesPage.testCaseTitle).type('newTestCaseTitle')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })

    it('Validate dirty check on the test case description, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })

    it('Validate dirty check on the test case series, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30000)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Series
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()
        cy.get(TestCasesPage.createTestCaseGroupInput).type(updatedTestCaseSeries)
        cy.contains('Add "' + updatedTestCaseSeries + '"').click()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })
})

describe('Duplicate Test Case Title and Group validations', () => {

    beforeEach('Create Measure, Test case and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Procedure')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Cleanup and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Create Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create second test case with same Test case and group name
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'An error occurred while creating the test case: The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
    })

    it('Edit Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create second test case
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
        cy.get(TestCasesPage.createTestCaseTitleInput).type('SecondTestCase'.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('SecondTestCaseGroup').type('{downArrow}{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        //Edit First Test case
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear().type('{selectall}{backspace}{selectall}{backspace}').type('SecondTestCase'.toString())
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).clear().type('SecondTestCaseGroup').type('{downArrow}{enter}')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.errorToastMsg).should('contain.text', 'The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
    })
})
