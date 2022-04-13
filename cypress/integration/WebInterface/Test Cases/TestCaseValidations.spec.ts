import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
let testCaseXML = TestCaseJson.TestCase_XML
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'

describe('Test Case Validations', () => {

    before('Create Measure', () => {
        let userToken = 'default'
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring, userToken)

    })
    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    it('Create Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseButton).should('be.disabled')
    })

    it('Edit Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, {delay: 0})
        cy.get(TestCasesPage.cuTestCaseButton).should('be.disabled')
    })

    it('Create Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.wait(2000)

        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')

        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')

    })

    it('Edit Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.wait(2000)

        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, {delay: 0})
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.cuTestCaseButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })
})

describe('Test Case Json Validations', () => {
    
    before('Create Measure', () => {
        let userToken = 'default'

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring, userToken)

    })

    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    it('Enter Valid Test Case Json and Save', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Nothing to see here!')

        TestCasesPage.clickCreateTestCaseButton()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')
    })

    it('Enter Invalid Test Case Json and Verify Error Message', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(invalidTestCaseJson)

        TestCasesPage.clickCreateTestCaseButton()
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationErrorList).should('contain.text', 'Failed to parse request body as JSON resource. Error was: Incorrect resource type found, expected "Bundle" but found "Account"')

        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'An error occurred with the Test Case JSON while creating the test case')
    })

    it('Enter Patient XML and Verify Error Message ', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseXML)

        TestCasesPage.clickCreateTestCaseButton()
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationErrorList).should('contain.text', 'Failed to parse request body as JSON resource. Error was: Failed to parse JSON encoded FHIR content: Content does not appear to be FHIR JSON, first non-whitespace character was: \'<\' (must be \'{\')')

        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'An error occurred with the Test Case JSON while creating the test case')
    })

})