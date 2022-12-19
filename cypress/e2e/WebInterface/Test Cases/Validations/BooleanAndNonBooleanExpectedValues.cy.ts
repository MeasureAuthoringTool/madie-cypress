import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {Global} from "../../../../Shared/Global"

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

    it('Verify Expected values for non boolean population basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('contain.value', '3')

    })

    it('Verify Expected values for multiple measure groups with Boolean and Non boolean Population Basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

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
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Add Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).type('1')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')

        //Add Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check()

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        //Assert Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('contain.value', '3')

        //Assert Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.checked')

    })

    it('Verify Expected / Actual page dirty check with Non-Boolean Population Basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()
        
        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Global.clickOnDiscardChanges()
                
    })

    it('Validate and save Non Boolean Expected values', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('abc')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only positive numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('$%@')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only positive numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('13@a')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only positive numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).clear().type('1.9')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Decimals values cannot be entered in the population expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseIPPExpected).clear().type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).clear().type('2')
        cy.get(TestCasesPage.testCaseNUMERExpected).clear().type('3')

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('contain.value', '3')
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

    it('Verify Boolean Expected values are saved to the database upon clicking save button for multiple Measure groups', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

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
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Add Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).check()

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).check()

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).check()

        //Add Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check()

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        //Assert Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | boolean')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        //Assert Expected values for Population Basis Boolean (Cohort Measure Group)
        
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 2 - Cohort | boolean')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.checked')
    })

    it('Verify Expected / Actual page dirty check with Boolean Population Basis and with multiple groups', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

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
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Add Expected values for Population Basis Encounter (Proportion Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).check()

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).check()

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).check()

        //Add Expected values for Population Basis Boolean (Cohort Measure Group)
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Global.clickOnDiscardChanges()
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
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).check()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).check()

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        //Assert Expected values for Initial population
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.checked')
    })
})