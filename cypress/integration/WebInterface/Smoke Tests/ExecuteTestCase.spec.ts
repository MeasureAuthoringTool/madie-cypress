import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let userToken = 'default'

describe('Execute Test Case', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoringArray[0], userToken)

    })
    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    it('Execute Test Case without Measure Group and verify execution status', () => {

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
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        TestCasesPage.clickCreateTestCaseButton()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'Unable to calculate test case.')

    })

    it('Execute Test Case without Expected values and verify execution status', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Navigate to Test cases Page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'NA')
    })

    it('Execute Test Case without all Expected values and verify execution status', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test cases Page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Select the Expected Value
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()

        //Save updated test case
        cy.get(TestCasesPage.cuTestCaseButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'fail')

    })

    it('Execute Test Case with all Expected values and verify execution status', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test cases Page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Select the Expected Value
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseDENOMCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).click()

        //Save updated test case
        cy.get(TestCasesPage.cuTestCaseButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'pass')

    })

})