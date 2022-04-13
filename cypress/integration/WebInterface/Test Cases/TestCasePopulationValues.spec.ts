import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {Utilities} from "../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {Header} from "../../../Shared/Header"
import {TestCaseJson} from "../../../Shared/TestCaseJson"

let measureName = 'TestMeasure' + (Date.now())
let CqlLibraryName = 'TestLibrary' + (Date.now())
let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']

let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseSeries = 'SBTestSeries'

describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newMeasureName = measureName + randValue
        let newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureScoringArray[3])
        OktaLogin.Login()

    })
    afterEach('Logout', () => {

        OktaLogin.Logout()

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

        //validate proper Population Value check boxes, based on value of score
        Utilities.validateTCPopValueCheckBoxes((measureScoringArray[3].valueOf()).toString())
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

        for (let i = 0; i<=1; i++){
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
                    if(i == 1){
                        expect($message.text()).to.equal('This change will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel')
                    }
                    else if (i == 0){
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
                cy.log((measureScoringArray[0].valueOf()).toString())
                //select scoring unit on measure
                cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[0].valueOf()).toString())
                //based on the scoring unit value, select a value for all population fields
                Utilities.validationMeasureGroupSaveAll((measureScoringArray[0].valueOf()).toString())
                //save measure group
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

                //validation message after attempting to save
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
                //create test case
                TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

                TestCasesPage.clickEditforCreatedTestCase()

                cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
                cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')
                cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')
                cy.get(TestCasesPage.testCaseNUMEXCheckBox).check().should('be.checked')
                cy.get(TestCasesPage.testCaseDENOMCheckBox).check().should('be.checked')
                cy.get(TestCasesPage.testCaseDENEXCheckBox).check().should('be.checked')
                cy.get(TestCasesPage.createTestCaseButton).click()
                cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')
                //navigate back to the measure group tab / page and...
                //change score unit value and save / update measure with new value
                cy.get(EditMeasurePage.measureGroupsTab).click()
                //log, in cypress, the measure score value
                cy.log((measureScoringArray[1].valueOf()).toString())
                //select scoring unit on measure
                cy.get(MeasureGroupPage.measureScoringSelect).select((measureScoringArray[1].valueOf()).toString())
                //based on the scoring unit value, select a value for all population fields
                Utilities.validationMeasureGroupSaveAll((measureScoringArray[1].valueOf()).toString())                
                //save measure group
                cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                //validation message after attempting to save
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'This change ' +
                    'will reset the population scoring value in test cases. Are you sure you wanted to continue with this? UpdateCancel')
        cy.pause()

                cy.get(MeasureGroupPage.confirmScoreUnitValueUpdateBtn).click()
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population ' +
                    'details for this group updated successfully.')
                //navigate back to the test case tab
                cy.get(EditMeasurePage.testCasesTab).click()
                TestCasesPage.clickEditforCreatedTestCase()

                //confirm that check boxes that were checked are no longer checked
                cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
                cy.get(TestCasesPage.testCaseIPPCheckBox).should('not.be.checked')

    })
})
