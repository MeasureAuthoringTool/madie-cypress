import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {Utilities} from "../../../Shared/Utilities";
import {Header} from "../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid


describe('Execute Test Case', () => {

    beforeEach('Create Measure, create test case and Login into the UI', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newMeasureName = measureName.concat(randValue.toString())
        let newCqlLibraryName = CqlLibraryName.concat(randValue.toString())
        //delete measure
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName, measureScoringArray[0])
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureScoringArray[0])
        //Create New Test Case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        //login into the UI
        OktaLogin.Login()


    })

    it('Execute Test Case without Measure Group and verify execution status', () => {

        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('exist')
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        TestCasesPage.clickCreateTestCaseButton()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
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

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'NA')
    })

    it('Execute Test Case without all Expected values and verify execution status', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Navigate to Test cases Page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Select the Expected Value
         //Select the Expected Value
         cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
         cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
         cy.get(TestCasesPage.testCaseIPPCheckBox).click()
 
         cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
         cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
         cy.get(TestCasesPage.testCaseDENOMCheckBox).click()
         
         cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
         cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
         cy.get(TestCasesPage.testCaseNUMERCheckBox).click()

        //Save updated test case
        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'fail')

    })

    it('Execute Test Case with all Expected values and verify execution status', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Navigate to Test cases Page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Select the Expected Value
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).click()
        
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()

        cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).click()

        //Save updated test case
        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'pass')

    })

})