import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

let randValue = (Math.floor((Math.random() * 1000) + 1))
const now = Date.now()
let measureName = 'RunExecuteTCButtonValidations' + now + randValue
let CqlLibraryName = 'TestLibrary' + now + randValue
const testCase: TestCase = {
    title: 'test case title',
    description: 'DENOMFail' + now,
    group: 'SBTestSeries'
}
const failingTestCase: TestCase = {
    title: 'Test Case with errors',
    description: 'TCwE',
    group: 'ICFTCwESeries'
}
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
const warningTestCaseJson = TestCaseJson.TestCaseJson_with_warnings
const errorTestCaseJSON_no_ResourceID = TestCaseJson.TestCaseJson_missingResourceIDs
const measureCQL = MeasureCQL.CQL_Multiple_Populations
const measureCQLPFTests = MeasureCQL.CQL_Populations
const timezoneErrorMessage = 'Test case updated successfully with errors in JSONMADiE enforces a UTC (offset 0) timestamp format with mandatory millisecond precision. All timestamps with non-zero offsets have been overwritten to UTC, and missing milliseconds have been defaulted to \'000\'.'
const timezoneWarningMessage = 'Test case updated successfully with warnings in JSONMADiE enforces a UTC (offset 0) timestamp format with mandatory millisecond precision. All timestamps with non-zero offsets have been overwritten to UTC, and missing milliseconds have been defaulted to \'000\'.'

describe('Run / Execute Test Case button validations', () => {

    beforeEach('Login and Create Measure', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Run Test Case button is disabled  -- CQL Errors', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorTextBox).type('{home}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('adjfajsdsdjf{}')

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, validTestCaseJson)

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()

        //click on details tab
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.runTestButton).should('be.disabled')
    })

    it('Run / Execute Test Case button is disabled  -- Missing group / population selections', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, validTestCaseJson)

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.runTestButton, 37700)
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    it('Run / Execute Test Case button is disabled -- Invalid TC Json', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        cy.log('Test Case created successfully')

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        TestCasesPage.enterErroneousJson(invalidTestCaseJson)

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 12500)
        cy.get('[data-testid="error-toast"]', { timeout: 6500 }).should('have.text', 'Test case updated successfully with errors in JSONMADiE enforces a UTC (offset 0) timestamp format with mandatory millisecond precision. All timestamps with non-zero offsets have been overwritten to UTC, and missing milliseconds have been defaulted to \'000\'.')
        cy.log('JSON added to test case successfully')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on details tab
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify execution status on Test Case list page
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
    })

    it('Run / Execute Test Case button is disabled -- missing TC Json', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        cy.log('Test Case created successfully')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        //Verify Execute Test cast case button on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
    })

    it('Test case Json validated upon clicking Run Test button before Test Case is saved', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).wait(3000).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        TestCasesPage.enterErroneousJson(invalidTestCaseJson)

        //Run Test case before save
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'HAPI-1814: Incorrect resource type found, expected "Bundle" but found "Account"')

        //Save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get('[data-testid="error-toast"]', { timeout: 6500 }).should('have.text', timezoneErrorMessage)

        //Add valid json to the test case and run
        cy.get('#ace-editor-wrapper > .ace_scroller > .ace_content').eq(0).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get('#ace-editor-wrapper > .ace_scroller > .ace_content').eq(0).type(validTestCaseJson, { parseSpecialCharSequences: false })
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Nothing to see here!')
    })
})

describe('Run / Execute Test case for multiple Population Criteria', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, validTestCaseJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', null)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 50000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Run and Execute Test case for multiple Population Criteria and validate Population Criteria discernment, on Highlighting page and Test Case list page', () => {
        let measureGroupPath = 'cypress/fixtures/measureGroupId'

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title + '2')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description + ' 2')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group + '2')
        cy.contains(testCase.group + '2').click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 20000)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        Utilities.waitForElementVisible(TestCasesPage.successMsg, 60000)
        cy.get(TestCasesPage.importTestCaseSuccessMsg, { timeout: 6500 }).should('have.text', timezoneWarningMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

        //Click on Run Test button and verify the text on Highlighting tab
        cy.get(TestCasesPage.runTestButton).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\nResultsFALSE (false) ')
            cy.get('[data-ref-id="253"]').should('have.color', '#A63B12')
        })

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcDEFINITIONSHighlightingDetails, 35000)
        cy.get('[data-ref-id="257"]').should('have.color', '#A63B12')
        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //Check Test Execution for second Population criteria
        cy.contains('Population Criteria 2').click().wait(3000)
        cy.reload()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')
    })
})

describe('Run / Execute Test case and verify passing percentage and coverage', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Run / Execute single passing Test Case', () => {

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        //cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/1)')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })

    it('Run / Execute one passing and one failing Test Cases', () => {

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('PassingTestCase')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('TestDesc')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('SBTestSeries')
        cy.contains('SBTestSeries').click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries('PassingTestCase', 'SBTestSeries')

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

        //create a test case that will fail:

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('Failing Test Case')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('FTC')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('ICFTCSeries')
        cy.contains('ICFTCSeries').click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries('Failing Test Case', 'ICFTCSeries')

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Fail')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '50%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/2)')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })

    it('Run / Execute single failing Test Cases', () => {

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //create a test case that will fail:

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('Failing Test Case')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('FTC')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('ICFTCSeries')
        cy.contains('ICFTCSeries').click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries('Failing Test Case', 'ICFTCSeries')

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '0%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(0/1)')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '0%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })
})

describe('Verify that "Run Test" works with warnings but does not with errors', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Can "Run Test Case" and "Execute Test Case"  when a test case has only a warning', () => {

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        TestCasesPage.enterErroneousJson(errorTestCaseJSON_no_ResourceID)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).wait(1000).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneErrorMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on actual / expected sub-tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //check the check box for the expected IP
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click().should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click({ force: true })
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type('{selectAll}{backspace}')
        cy.get(TestCasesPage.aceEditor).type(warningTestCaseJson, { parseSpecialCharSequences: false })
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).wait(1000).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //refresh test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //open edit page for test case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details tab for the test case
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //confirm warning message
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Warning: The Coding provided (http://clinfhir.com/fhir/NamingSystem/identifier#IMP) was not found in the value set \'V3 Value SetActEncounterCode\' (http://terminology.hl7.org/ValueSet/v3-ActEncounterCode|2014-03-26), and a code should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable).  (error message = Unknown code \'http://clinfhir.com/fhir/NamingSystem/identifier#IMP\' for in-memory expansion of ValueSet \'http://terminology.hl7.org/ValueSet/v3-ActEncounterCode\')Warning: No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
        //attempt to click on 'Run Test Case' to run the test case via the edit page
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Warning: The Coding provided (http://clinfhir.com/fhir/NamingSystem/identifier#IMP) was not found in the value set \'V3 Value SetActEncounterCode\' (http://terminology.hl7.org/ValueSet/v3-ActEncounterCode|2014-03-26), and a code should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable).  (error message = Unknown code \'http://clinfhir.com/fhir/NamingSystem/identifier#IMP\' for in-memory expansion of ValueSet \'http://terminology.hl7.org/ValueSet/v3-ActEncounterCode\')Warning: No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
    })

    it('Cannot "Run Test Case" or "Execute Test Case" when a test case has multiple errors and a warning', () => {

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Close the Toast message
        cy.get(TestCasesPage.clearIconBtn).click()

        //create a test case that will fail:

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(failingTestCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(failingTestCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(failingTestCase.group)
        cy.contains(failingTestCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(failingTestCase.title, failingTestCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        TestCasesPage.enterErroneousJson(errorTestCaseJSON_no_ResourceID)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get('.toast'/*'[data-testid="error-toast"]'*/, { timeout: 6500 }).should('have.text', timezoneErrorMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on actual / expected sub-tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //check the check box for the expected IP
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click().should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click({ force: true })
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 7500)

        //Click on Execute Test Case button on Edit Test Case page
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 30000)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        //refresh test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //open edit page for test case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details tab for the test case
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //confirm error message
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Error: All resources must have an IdError:' +
            ' Bundle entry missing fullUrlError: Relative Reference appears inside Bundle whose entry is missing a fullUrlError: Relative ' +
            'Reference appears inside Bundle whose entry is missing a fullUrlWarning: No code provided, and a code should be provided ' +
            'from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)Error: ' +
            'Except for transactions and batches, each entry in a Bundle must have a fullUrl which is the identity of the resource in ' +
            'the entry')

        //the 'Run Test Case' button, to run the test case, is unavailable
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('not.be.enabled')

    })
})

describe('Verify "Run Test Cases" results based on missing/empty group populations are treated as zeroes', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Can "Run Test Cases" on test case list page after when created after pristine groups', () => {

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 42700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 50000)
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')
        cy.get(TestCasesPage.aceEditor).wait(1000).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on actual / expected sub-tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //check the check box for the expected IP
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click().should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })

    it('Can "Run Test Cases" on test case list page after a group has its population basis or scoring value changed' +
        ' (displays pass / fail) and results are the same for individual run on edit page', () => {

            //Add second Measure Group with return type as Boolean
            cy.get(EditMeasurePage.measureGroupsTab).click()

            Utilities.setMeasureGroupType()

            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('boolean')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

            cy.get(MeasureGroupPage.reportingTab).click()
            Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

            //Close the Toast message
            cy.get(TestCasesPage.clearIconBtn).click()

            //Navigate to Test Cases page and add Test Case details
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.newTestCaseButton).click()

            cy.get(TestCasesPage.createTestCaseDialog).should('exist')
            cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

            cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
            Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
            Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
            cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
            cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
            cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
            cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
            cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
            cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
            cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
            cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
            cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
            cy.contains(testCase.group).click()

            TestCasesPage.clickCreateTestCaseButton()

            //Verify created test case Title and Series exists on Test Cases Page
            TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

            TestCasesPage.clickEditforCreatedTestCase()

            //Add json to the test case
            Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
            Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
            cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()

            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            cy.get('.toast', { timeout: 6500 }).should('have.text', timezoneWarningMessage)
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            //click on actual / expected sub-tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //check the check box for the expected IP
            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).click().should('be.checked')

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

            //Click on Execute Test Case button on Edit Test Case page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.executeTestCaseButton).should('exist')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.executeTestCaseButton).focus()
            cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            //refresh test case list page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            //open edit page for test case
            TestCasesPage.clickEditforCreatedTestCase()

            //navigate to the details tab for the test case
            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

            //confirm warning message
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')

            //change population basis
            //navigate to measure group / Population Criteria page / tab
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //set new value for population basis
            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Encounter')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')

            cy.get(MeasureGroupPage.reportingTab).click()
            Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Population Basis is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure group.')
            cy.get(MeasureGroupPage.updatePopulationBasisConfirmationBtn).click()

            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            //click on actual / expected sub-tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //enter values for the expected population
            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).invoke('click').type('0')

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

            //Click on Execute Test Case button on Edit Test Case page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.executeTestCaseButton).should('exist')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.executeTestCaseButton).focus()
            cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            //change scoring
            //navigate to measure group / Population Criteria page / tab
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //set new value for population basis
            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')
            Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Qualifying Encounters')
            Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Qualifying Encounters')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            //click on actual / expected sub-tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //enter values for the expected populations
            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).invoke('click').type('0')

            cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseDENOMExpected).invoke('click').type('0')

            cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
            cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseNUMERExpected).invoke('click').type('0')

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

            //Click on Execute Test Case button on Edit Test Case page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.executeTestCaseButton).should('exist')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.executeTestCaseButton).focus()
            cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            //click on actual / expected sub-tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //attempt to click on 'Run Test Case' to run the test case via the edit page
            cy.get(TestCasesPage.runTestButton).should('exist')
            cy.get(TestCasesPage.runTestButton).should('be.visible')
            cy.get(TestCasesPage.runTestButton).should('be.enabled')
            cy.get(TestCasesPage.runTestButton).click()

            //navigate to the details tab for the test case
            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

            //confirm no message
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
    })
})

describe('Verify multiple IPs on the highlighting tab', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Multiple IPs appear on the highlighting test case tab', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCase.title)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCase.description)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCase.group)
        cy.contains(testCase.group).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="group-coverage-nav-' + fileContents + '"]', 50000)
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP 1').wait(3000).click()
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP 2').wait(3000).click()
        })
    })
})
