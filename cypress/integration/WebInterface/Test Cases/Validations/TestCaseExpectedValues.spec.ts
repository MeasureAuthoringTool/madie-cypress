import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue

describe('Validate Test Case Expected value updates on Measure Group change', () => {

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify if the scoring type is changed, Test Case Expected values are cleared for that group', () => {

        //Create Ratio Measure group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Add Expected values for Test Case
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

        //Save edited / updated to test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        //Navigate to Measure group page and update scoring type
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect,'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationMsg).contains('Are you sure you want to Save Changes?')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to test Cases page and verify Test Case Expected values are cleared
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')
    })

    it('Verify if the population basis is changed, Test Case Expected values are cleared for that group', () => {

        //Create Ratio Measure group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Add Expected values for Test Case
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        //Navigate to Measure group page and update scoring type
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'numEnc')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'numEnc')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'numEnc')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'numEnc')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'numEnc')

        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Population Basis is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure group.Are you sure you want to Save Changes?This action cannot be undone.')
        cy.get(MeasureGroupPage.updatePopulationBasisConfirmationBtn).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        //Navigate to test Cases page and verify Test Case Expected values are cleared
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.contain.value')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.contain.value')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.contain.value')
    })

    it('Verify if Measure group is deleted, that group no longer appears in the edit test case page', () => {

        //Create Ratio Measure group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Navigate to Edit Test Case page and assert Measure group
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Ratio | boolean')
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Delete Measure group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).wait(2000).click()
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click().wait(1000)
        cy.get('[data-testid="save-measure-group-validation-message"]').should('contain.text', 'You must set all required Populations.')

        //Navigate to Edit Test Case page and assert Measure group after deletion
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('not.exist')
        cy.get('[class="GroupPopulations___StyledSpan-sc-1752rtp-0 jriTet"]').should('contain.text', 'No data for current scoring. Please make sure at least one measure group has been created.')
    })

    it('Verify if group populations are added/deleted, test case expected values will be updated', () => {

        //Create Ratio Measure group
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully')

        //Add Expected values for Test Case
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('not.exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        //Navigate to Measure Group page and add Numerator Exclusion & delete Denominator Exclusion
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).click()
        cy.get('.MuiList-root > [data-value=""]').click()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully')

        //Navigate to Test cases page and verify Numerator Exclusion check box exists & Denominator Exclusion check box is deleted
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseDENEXExpected).should('not.exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXExpected).click()
        cy.get(TestCasesPage.testCaseNUMEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

    })

    it('Verify if Measure Observation is added/removed from Measure group, test case Expected values will be updated', () => {

        //Create Ratio Measure group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Add Measure observation to the Measure group and remove Denominator Exclusion value
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('exist')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).click()
        cy.get('.MuiList-root > [data-value=""]').click()
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).should('exist')
        cy.get(MeasureGroupPage.measureObservationSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureObservationSelect).wait(1000).eq(0).wait(1000).click() //select ToCode
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test case Expected values tab and verify Measure Observation Expected value exists
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('exist')

        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.confirmationMsg).should('be.visible')

        //Remove Measure Observation from Measure group
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()
        cy.get(MeasureGroupPage.removeDenominatorObservation).should('exist')
        cy.get(MeasureGroupPage.removeDenominatorObservation).click()
        cy.get(MeasureGroupPage.denominatorObservation).should('not.exist')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).should('not.exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test case Expected values tab and verify Measure Observation Expected value does not exist
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()

        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('not.exist')
    })

    it('Verify if Stratification is added to the Measure group, test case Expected values will be updated', () => {

        //Create CV Measure Group
        MeasureGroupPage.createMeasureGroupforContinuousVariableMeasure()

        //Verify Stratification Expected values before adding stratification
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.initialPopulationStratificationExpectedValue).should('not.exist')

        //Add Stratification to the Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'ipp')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Verify Stratification Expected values after adding stratification
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.initialPopulationStratificationExpectedValue).should('exist')
    })
})