import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let measureCQL = MeasureCQL.CQL_Multiple_Populations

describe('Non Boolean Population Basis Expected values', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Qualifying Encounters', 'Qualifying Encounters', 'Encounter')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    //Skipping until MAT-4909 is fixed
    it.skip('Verify Expected values for non boolean population basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).type('1')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).type('2')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).type('3')

        TestCasesPage.clickCreateTestCaseButton(true)

        //Navigate to Test case tab
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('contain.value', '3')

    })

    //Skipping until MAT-4909 is fixed
    it.skip('Verify Expected values for multiple measure groups with Boolean and Non boolean Population Basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force:true})

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Add Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).type('1')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).type('2')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).type('3')

        //Add Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).check()

        TestCasesPage.clickCreateTestCaseButton(true)

        //Navigate to Test case tab
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Assert Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('contain.value', '3')

        //Assert Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).should('be.checked')

    })
    it('Verify Expected / Actual page dirty check with Non-Boolean Population Basis', () => {
                //Click on Edit Measure
                MeasuresPage.clickEditforCreatedMeasure()

                //Navigate to Test Cases page and add Test Case details
                cy.get(EditMeasurePage.testCasesTab).click()
                cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
                cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
                cy.get(TestCasesPage.newTestCaseButton).click()
        
                //click on details tab
                cy.get(TestCasesPage.detailsTab).should('exist')
                cy.get(TestCasesPage.detailsTab).should('be.visible')
                cy.get(TestCasesPage.detailsTab).click()
        
                cy.get(TestCasesPage.testCaseTitle).should('exist')
                cy.get(TestCasesPage.testCaseTitle).should('be.visible')
                cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
                cy.get(TestCasesPage.testCaseTitle).focus().clear()
                cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
                cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
                cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
                cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
                cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        
                //Add json to the test case
                cy.get(TestCasesPage.aceEditor).type(testCaseJson)
        
                //click on Expected/Actual tab
                cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
                cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
                cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        
                cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
                cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
                cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
                cy.get(TestCasesPage.testCaseIPPCheckBox).type('1')
        
                cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
                cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
                cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
                cy.get(TestCasesPage.testCaseDENOMCheckBox).type('2')
        
                cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
                cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
                cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
                cy.get(TestCasesPage.testCaseNUMERCheckBox).type('3')

                //attempt to navigate away from the test case page
                cy.get(EditMeasurePage.measureGroupsTab).should('exist')
                cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
                cy.get(EditMeasurePage.measureGroupsTab).click()

                //verify that the discard modal appears
                cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('exist')
                cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('be.visible')
                cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('exist')
                cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.visible')
                cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.enabled')
                cy.get(MeasureGroupPage.continueDiscardChangesBtn).click()
                
    })

    //Skipping until MAT-4909 is fixed
    it.skip('Validate and save Non Boolean Expected values', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).type('abc')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).type('$%@')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).type('13@a')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseIPPCheckBox).clear().type('1')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).clear().type('2')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).clear().type('3')

        TestCasesPage.clickCreateTestCaseButton(true)

        //Navigate to Test case tab
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('contain.value', '3')
    })
})
describe('Boolean Population Basis Expected Values', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population', 'Boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    //Skipping until MAT-4909 is fixed
    it.skip('Verify Boolean Expected values are saved to the database upon clicking save button for multiple Measure groups', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force:true})

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Add Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).check()

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check()

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check()

        //Add Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).check()

        //Save Test case with Expected values
        TestCasesPage.clickCreateTestCaseButton(true)

        //Navigate to Test case tab
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Assert Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | Boolean')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        //Assert Expected values for Population Basis Boolean (Cohort Measure Group)
        
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 2 - Cohort | Boolean')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).should('be.checked')
    })
    it('Verify Expected / Actual page dirty check with Boolean Population Basis and with multiple groups', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force:true})

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Add Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).check()

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check()

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check()

        //Add Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).check()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('exist')
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('exist')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.enabled')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).click()        
    })
})

describe('Expected values for second initial population', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(5500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population', 'Boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that the Expected value for second initial population can be selected', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //fill in a description value
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).type('MeasureGroup Description value')

        //Add Second Initial Population
        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial Population')

        //save Measure group
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

        //click on details tab
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseJson)

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).check()

        //Save Test case with Expected values
        TestCasesPage.clickCreateTestCaseButton(true)

        //Navigate to Test case tab
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Assert Expected values for Initial population
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(0).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPCheckBox).eq(1).should('be.checked')
    })
})