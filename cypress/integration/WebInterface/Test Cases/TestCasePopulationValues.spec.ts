import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {Utilities} from "../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"

let measureName = 'TestMeasure' + (Date.now())
let CqlLibraryName = 'TestLibrary' + (Date.now())
let measureScoringArray = ['Select', 'Ratio', 'Cohort', 'Continuous Variable', 'Proportion']

let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseSeries = 'SBTestSeries'
let newMeasureName = ''
let newCqlLibraryName = ''
describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        //MeasureGroupPage.CreateProportionMeasureGroupAPI()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify the Test Case Populations when Measure group is not added', () =>{

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCasePopulationHeaderForNoMeasureGroup).should('contain.text', 'No populations for current scoring. Please make sure at least one measure group has been created.')
    })

    it('Validate Population Values check boxes are correct based on measure scoring value that is applied, when the measure is initially created (defalut measure group)', () => {

        cy.log((measureScoringArray[3].valueOf()).toString())

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforProportionMeasure()

        //Navigate to Test Cases page and verify Populations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')
        
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).click()
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check().should('be.checked')

    })

    it('Validate notification that a reset of population values, on test cases, will occur once the completed save / update of the scoring value is executed', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        for (let i = 1; i<=2; i++){
            //log, in cypress, the measure score value
            cy.log((measureScoringArray[i].valueOf()).toString())
            //select scoring unit on measure
            cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[i].valueOf()).toString())
            //based on the scoring unit value, select a value for all population fields
            Utilities.validationMeasureGroupSaveAll((measureScoringArray[i].valueOf()).toString())
            //save measure group
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            //validation message after attempting to save
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg)
                .then(($message) => {
                    if(i == 2){
                        expect($message.text()).to.equal('This change will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel')
                    }
                    else if (i == 1){
                        expect($message.text()).to.equal('Population details for this group saved successfully.')
                    }
                })
        }

    })

    it('Validate Population Values are reset on all test cases that exist under a measure group, after the score unit value is saved / updated', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
        //based on the scoring unit value, select a value for all population fields
        Utilities.validationMeasureGroupSaveAll((measureScoringArray[1].valueOf()).toString())
        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).check().should('be.checked')


        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).click()
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check().should('be.checked')
        

        cy.get(TestCasesPage.createTestCaseButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')
        //navigate back to the measure group tab / page and...
        //change score unit value and save / update measure with new value
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //log, in cypress, the measure score value
        cy.log((measureScoringArray[2].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[2].valueOf()).toString())
        //based on the scoring unit value, select a value for all population fields
        Utilities.validationMeasureGroupSaveAll((measureScoringArray[2].valueOf()).toString())
        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'This change ' +
            'will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel')
        cy.get(MeasureGroupPage.confirmScoreUnitValueUpdateBtn).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population ' +
            'details for this group updated successfully.')


        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.intercept('GET', '/api/measures/' + fileContents + '/test-cases').as('testCase')

            //navigate back to the test case tab
            cy.get(EditMeasurePage.testCasesTab).click()

            cy.url({ timeout: 100000 }).should('include', '/edit/test-cases')

            cy.wait('@testCase').then(({response}) => {
                expect(response.statusCode).to.eq(200)
            })

        })
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that check boxes that were checked are no longer checked
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('not.be.checked')

    })
    it('Test Case Population value options are limited to those that are defined from Measure Group -- required populations', () => {

        //creating propportion group on measure
        MeasureGroupPage.CreateProportionMeasureGroupAPI()

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'wOOpt')
        //Navigate to Test Cases page and verify Populations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'IPP')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMER')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENOM')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'NUMEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'DENEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'DENEXCEP')
    })
    //this will need to be retested once 4497/ 4498 is fixed
    it.skip('Test Case Population value options are limited to those that are defined from Measure Group -- adding optional definitions', () => {
        //creating propportion group on measure
        MeasureGroupPage.CreateProportionMeasureGroupAPI()

        OktaLogin.Login()
        
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //setup measure group so that only the required fields / populations are defined / has values
        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'wOOpt')
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that test case now has all pertinent details -- only the check boxes for the population fields that are required
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'IPP')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMER')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENOM')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'NUMEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'DENEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'DENEXCEP')
        //go back and update measure group to contain values for all of the population fields
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'all')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that test case now has all of the population check boxes available
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'IPP')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMER')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENOM')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENEXCEP')

    })
    //this will need to be retested once 4497/ 4498 is fixed
    it.skip('Test Case Population value options are limited to those that are defined from Measure Group -- removing optional definitions', () => {
        //creating propportion group on measure
        MeasureGroupPage.CreateProportionMeasureGroupAPI()

        OktaLogin.Login()
        
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //setup measure group so that only the required fields / populations are defined / has values
        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'all')
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that test case now has all pertinent details -- all check boxes for the population fields are checked
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'IPP')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMER')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENOM')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENEXCEP')
        //go back and update measure group to contain values for all of the population fields
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'wOOpt')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that test case now has only the required population values / check boxes
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'IPP')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'NUMER')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'DENOM')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'NUMEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'DENEX')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.contain.text', 'DENEXCEP')

    })

    it('Verify Test Case population dependencies for Proportion Measures', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //log, in cypress, the measure score value
        cy.log((measureScoringArray[4].valueOf()).toString())
        //select scoring unit on measure
        cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[4].valueOf()).toString())
        //based on the scoring unit value, select a value for all population fields
        Utilities.validationMeasureGroupSaveAll((measureScoringArray[4].valueOf()).toString())
        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that test case now has all pertinent details -- only the check boxes for the population fields that are required
        cy.get(TestCasesPage.testCasePopulationValuesHeader).should('contain.text', 'Group 1 (Proportion) Population Values')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValues).should('contain.text', 'PopulationExpectedActual')

        cy.log('Select DENOM and verify IPP is checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check().should('be.checked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.log('Uncheck IPP and verify DENOM is unchecked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('not.be.checked')

        //Select DENOM again
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check().should('be.checked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.log('Uncheck DENOM and verify IPP is not unchecked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.log('Select Numerator and verify if DENOM and IPP are checked')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.log('Uncheck DENOM and verify if Numerator is unchecked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('not.be.checked')

        //Check Numerator again
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.log('Uncheck Numerator and verify if Denom is not unchecked')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.checked')

        //Check Numerator again
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.log('Uncheck IPP and verify if DENOM and Numerator are unchecked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('not.be.checked')

        cy.log('Select Numerator Exclusion and verify IPP, Numerator and Denominator are selected')
        cy.get(TestCasesPage.testCaseNUMEXCheckBox).check().should('be.checked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.checked')
    })

})
