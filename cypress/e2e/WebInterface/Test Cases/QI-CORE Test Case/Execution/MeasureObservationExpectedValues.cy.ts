import { CreateMeasurePage } from '../../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { Utilities } from '../../../../../Shared/Utilities'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../../Shared/CQLEditorPage'

const now = Date.now()
const measureName = 'MOExpectedValues' + now
const CqlLibraryName = 'TestLibrary' + now
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + now
const testCaseSeries = 'SBTestSeries'
const testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Measure Observation Expected values', () => {
    beforeEach('Create Measure, Test Case and login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Validate and save Measure observation for CV measure', () => {
        //Create Continuous variable measure group
        MeasureGroupPage.createMeasureGroupforContinuousVariableMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseMSRPOPLExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseMSRPOPLExpected)
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).should('be.checked')

        //Validate measure observation expected values
        TestCasesPage.typeExpectedActualValue(TestCasesPage.measureObservationRow, '@#', { clearFirst: true })
        cy.get(TestCasesPage.measureObservationExpectedValueError).should(
            'contain.text',
            'Only positive numeric values can be entered in the expected values',
        )
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.measureObservationRow, 'ab12', { clearFirst: true })
        cy.get(TestCasesPage.measureObservationExpectedValueError).should(
            'contain.text',
            'Only positive numeric values can be entered in the expected values',
        )
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.measureObservationRow, '-15', { clearFirst: true })
        cy.get(TestCasesPage.measureObservationExpectedValueError).should(
            'contain.text',
            'Only positive numeric values can be entered in the expected values',
        )
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        //Save measure observation expected values
        TestCasesPage.typeExpectedActualValue(TestCasesPage.measureObservationRow, '1.3', { clearFirst: true })
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        // cy.get(Toasts.otherSuccessToast).should('have.text', Toasts.warningOffsetText)
        cy.get(TestCasesPage.executionContextWarning).should(
            'have.text',
            'Test case updated successfully! Timezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.',
        )

        //Assert saved observation values
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseMSRPOPLExpected })
        cy.get(TestCasesPage.measureObservationRow).should('contain.value', '1.3')
    })

    it('Validate and save Measure observation for Ratio measure', () => {
        //Create Ratio measure group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get('[data-value="booleanFunction"]').click() //select booleanFunction
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get('[data-value="booleanFunction"]').click() //select booleanFunction
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group updated successfully.',
        )

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseDENOMExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseDENOMExpected)
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseNUMERExpected)
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        //Validate measure observation expected values
        TestCasesPage.typeExpectedActualValue(TestCasesPage.denominatorObservationExpectedRow, '@#')
        cy.get(TestCasesPage.denominatorObservationExpectedValueError).should(
            'contain.text',
            'Only positive numeric values can be entered in the expected values',
        )
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.numeratorObservationRow, 'ab12')
        cy.get(TestCasesPage.numeratorObservationExpectedValueError).should(
            'contain.text',
            'Only positive numeric values can be entered in the expected values',
        )
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.numeratorObservationRow, '-15')
        cy.get(TestCasesPage.numeratorObservationExpectedValueError).should(
            'contain.text',
            'Only positive numeric values can be entered in the expected values',
        )
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        //Save measure observation expected values
        TestCasesPage.typeExpectedActualValue(TestCasesPage.denominatorObservationExpectedRow, '1.3', { clearFirst: true })
        TestCasesPage.typeExpectedActualValue(TestCasesPage.numeratorObservationRow, '5', { clearFirst: true })
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 10000)

        //Assert saved observation values
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseDENOMExpected })
        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('contain.value', '1.3')
        cy.get(TestCasesPage.numeratorObservationRow).should('contain.value', '5')
    })

    it('Verify Expected / Actual page dirty check for Measure Observations', () => {
        //Create Continuous variable measure group
        MeasureGroupPage.createMeasureGroupforContinuousVariableMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseMSRPOPLExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseMSRPOPLExpected)
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).should('be.checked')

        //Enter value in to Measure observation Expected values
        TestCasesPage.typeExpectedActualValue(TestCasesPage.measureObservationRow, '1.3')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
    })
})

describe('Measure observation expected result', () => {
    beforeEach('Create Measure, Test Case and login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Verify Measure Observation expected result for CV measure', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForFluentFunction.txt')
            .should('exist')
            .then((fileContents) => {
                cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents, { delay: 50 })
            })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorExpandCollapseBtn).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'isFinishedEncounter')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.',
        )

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseMSRPOPLExpected })

        //Enter values in to Measure population(MP) & Measure population exclusion(MPE) fields and verify MP-MPE = number of observation rows
        TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseMSRPOPLExpected, '5')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseMSRPOPLEXExpected, '1')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Observation 1')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Observation 2')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Observation 3')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Observation 4')
    })

    it('Verify Measure Observation expected result for Ratio measure', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForFluentFunction.txt')
            .should('exist')
            .then((fileContents) => {
                cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
            })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorExpandCollapseBtn).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Qualifying Encounters')

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(TestCasesPage.SelectionOptionChoice).should('exist')
        cy.get(TestCasesPage.SelectionOptionChoice).should('be.visible')
        cy.get(TestCasesPage.SelectionOptionChoice).eq(0).click() //select isFinishedEncounter
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(TestCasesPage.SelectionOptionChoice).should('exist')
        cy.get(TestCasesPage.SelectionOptionChoice).should('be.visible')
        cy.get(TestCasesPage.SelectionOptionChoice).eq(0).click() //select isFinishedEncounter
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.',
        )

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseDENOMExpected })

        //Enter values in to Denominator & Denominator exclusion(DE) fields and verify Denominator-DE = number of Denominator observation rows
        TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseDENOMExpected, '4')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseDENEXExpected, '1')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Denominator Observation 1')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Denominator Observation 2')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Denominator Observation 3')

        //Enter values in to Numerator & Numerator exclusion(NE) fields and verify Denominator-NE = number of Numerator observation rows
        TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseNUMERExpected, '4')
        TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseNUMEXExpected, '1')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Numerator Observation 1')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Numerator Observation 2')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Numerator Observation 3')
    })
})
