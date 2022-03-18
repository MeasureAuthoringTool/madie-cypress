import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {Header} from "../../../Shared/Header"

let measureName = 'TestMeasure' + (Date.now())
let CqlLibraryName = 'TestLibrary' + (Date.now())
let measureScoring = 'Ratio'
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid

let testCaseSeries = 'SBTestSeries'

describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {
/*     before('Create Measure', () => {



        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring)

    }) */
/*     beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    }) */

    it('Validate Population Values check boxes are correct based on measure scoring value that is applied when the measure is initially created (defalut measure group)', () => {

        for (let i in measureScoringArray){
            cy.wait(7000)
            OktaLogin.Login()
            //Create New Measure
            let randValue = (Math.floor((Math.random() * 1000) + 1))
            let newMeasureName = measureName + randValue
            let newCqlLibraryName = CqlLibraryName + randValue
            CreateMeasurePage.CreateQICoreMeasure(newMeasureName, newCqlLibraryName, (measureScoringArray[i].valueOf()).toString())
            cy.log((measureScoringArray[i].valueOf()).toString())
            //Click on Edit Measure
            MeasuresPage.clickEditforCreatedMeasure()
            //Navigate to Test Cases page
            cy.get(EditMeasurePage.testCasesTab).click()
            //Click button to create new test case
            cy.get(TestCasesPage.newTestCaseButton).click()
            switch ((measureScoringArray[i].valueOf()).toString()){
                case "Ratio": {
                    //validate what available check boxes should and shouldn't be present / visible
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMER')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENOM')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPLEX')
                    cy.get(Header.mainMadiePageButton).click()
                    cy.wait(7000)
                    OktaLogin.Logout()
                    break
                }
                case 'Proportion': {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMER')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENOM')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPLEX')
                    cy.get(Header.mainMadiePageButton).click()
                    cy.wait(7000)
                    OktaLogin.Logout()
                    break
                }
                case 'Continuous Variable': {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','MSRPOPLEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMER')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENOM')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'DENEXCEP')
                    cy.get(Header.mainMadiePageButton).click()
                    cy.wait(7000)
                    OktaLogin.Logout()
                    break
                }
                case 'Cohort': {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMER')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENOM')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPLEX')
                    cy.get(Header.mainMadiePageButton).click()
                    cy.wait(7000)
                    OktaLogin.Logout()
                    break

                }
                
            }

        }
        //cy.get(Header.mainMadiePageButton).click()

/*         for (let i in measureScoringArray){
            switch (measureScoringArray[i].toString()){
                case "Ratio": {
                    measureScoring = "Ratio"
                    break
                }
                case "Proportion": {
                    measureScoring = "Proportion"
                    break
                }
                case "Continuous Variable": {
                    measureScoring = "Continuous Variable"
                    break
                }
                case "Cohort": {
                    measureScoring = "Cohort"
                    break
                }

            }
            //create measure
            CreateMeasurePage.CreateQICoreMeasure((measureName.concat(i)).toString(), (CqlLibraryName.concat(i)).toString(), measureScoring.toString())
            //Click on Edit Measure
            MeasuresPage.clickEditforCreatedMeasure()
            //Navigate to Test Cases page
            cy.get(EditMeasurePage.testCasesTab).click()
            //Click button to create new test case
            cy.get(TestCasesPage.newTestCaseButton).click()
            //Navigate to Test Cases page and add Test Case details
            cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
            cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
            cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries)
            cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()
            //Add json to the test case
            cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
            //validate correct check boxes are avaialable based on measure score value; and confirm that checked check boxes are persisted
            switch(measureScoring.toString()) {
                case "Ratio": {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCaseIPPCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMER')
                    cy.get(TestCasesPage.testCaseNUMERCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMEX')
                    cy.get(TestCasesPage.testCaseNUMEXCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENOM')
                    cy.get(TestCasesPage.testCaseDENOMCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENEX')
                    cy.get(TestCasesPage.testCaseDENEXCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPLEX')
                    TestCasesPage.clickCreateTestCaseButton()
                    cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')
                    cy.wait(5000)
                    cy.get(Header.mainMadiePageButton).click()
                    MeasuresPage.clickEditforCreatedMeasure()
                    cy.get(EditMeasurePage.testCasesTab).click()
                    TestCasesPage.clickEditforCreatedTestCase()
                    cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseDENEXCheckBox).should('be.checked')
                    break
                }
                case 'Proportion': {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCaseIPPCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMER')
                    cy.get(TestCasesPage.testCaseNUMERCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','NUMEX')
                    cy.get(TestCasesPage.testCaseNUMEXCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENOM')
                    cy.get(TestCasesPage.testCaseDENOMCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENEX')
                    cy.get(TestCasesPage.testCaseDENEXCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','DENEXCEP')
                    cy.get(TestCasesPage.testCaseDENEXCEPCheckBox).check()                        
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPLEX')
                    TestCasesPage.clickCreateTestCaseButton()
                    cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')
                    cy.wait(5000)
                    cy.get(Header.mainMadiePageButton).click()
                    MeasuresPage.clickEditforCreatedMeasure()
                    cy.get(EditMeasurePage.testCasesTab).click()
                    TestCasesPage.clickEditforCreatedTestCase()
                    cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseDENEXCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseDENEXCEPCheckBox).should('be.checked')
                    break
                }
                case 'Continuous Variable': {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCaseIPPCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','MSRPOPL')
                    cy.get(TestCasesPage.testCaseMSRPOPLCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','MSRPOPLEX')
                    cy.get(TestCasesPage.testCaseMSRPOPLEXCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMER')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENOM')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'DENEXCEP')
                    TestCasesPage.clickCreateTestCaseButton()
                    cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')
                    cy.wait(5000)
                    cy.get(Header.mainMadiePageButton).click()
                    MeasuresPage.clickEditforCreatedMeasure()
                    cy.get(EditMeasurePage.testCasesTab).click()
                    TestCasesPage.clickEditforCreatedTestCase()
                    cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseMSRPOPLCheckBox).should('be.checked')
                    cy.get(TestCasesPage.testCaseMSRPOPLEXCheckBox).should('be.checked')
                    break
                }
                case 'Cohort': {
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .contains('td','IPP')
                    cy.get(TestCasesPage.testCaseIPPCheckBox).check()
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMER')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','NUMEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENOM')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value','DENEX')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'DENEXCEP')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPL')
                    cy.get(TestCasesPage.testCasePopulationValuesTable)
                        .should('not.have.value', 'MSRPOPLEX')
                    TestCasesPage.clickCreateTestCaseButton()
                    cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')
                    cy.wait(5000)
                    cy.get(Header.mainMadiePageButton).click()
                    MeasuresPage.clickEditforCreatedMeasure()
                    cy.get(EditMeasurePage.testCasesTab).click()
                    TestCasesPage.clickEditforCreatedTestCase()
                    cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')
                    break

                }
            }
            cy.get(Header.mainMadiePageButton).click()
            cy.wait(7000)
            OktaLogin.Logout()
            cy.wait(7000)
            OktaLogin.Login()
            cy.wait(7000)
            measureScoring = null
        } */
    })
})