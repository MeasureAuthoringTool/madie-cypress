import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

const now = Date.now()
let measureName = 'MOActualValues' + now
let CqlLibraryName = 'TestLibrary' + now
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + now
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioEpisodeSingleIPNoMO_IPP_PASS
let measureCQL = 'library Library4969 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Annual Wellness Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1240\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "Preventive Care Services-Initial Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "End Stage Renal Disease": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.353\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  true\n' +
    ' \n' +
    ' define "ipp":\n' +
    '    true\n' +
    '    \n' +
    'define "mpopEx":\n' +
    '  ["Encounter"] E where E.status = \'finished\'\n' +
    ' \n' +
    'define function boolFunc():\n' +
    '  1\n' +
    '\n' +
    'define function boolFunc2():\n' +
    '  14\n' +
    '\n' +
    'define function daysObs(e Encounter):\n' +
    '  duration in days of e.period\n' +
    '\n' +
    'define function hoursObs(e Encounter):\n' +
    '  duration in hours of e.period'

//MAT-8424
describe('Non Boolean Measure Observation Actual values', () => {

    beforeEach('Create Measure, Test Case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJsonIppPass)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Actual values for Non Boolean CV Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

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
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'mpopEx')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'mpopEx')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'daysObs')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Click on RunTest Button
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).type('1')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click({ force: true })
        cy.get(TestCasesPage.cvMeasureObservationActualValue).should('have.value', '30')
    })

    it('Verify Actual values for Non Boolean Ratio Measure with MO', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

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

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'mpopEx')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'mpopEx')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'mpopEx')

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(TestCasesPage.SelectionOptionChoice).should('exist')
        cy.get(TestCasesPage.SelectionOptionChoice).should('be.visible')
        cy.get('[data-value="daysObs"]').click() //select daysObs
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(TestCasesPage.SelectionOptionChoice).should('exist')
        cy.get(TestCasesPage.SelectionOptionChoice).should('be.visible')
        cy.get('[data-value="daysObs"]').click() //select daysObs
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Click on RunTest Button
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click({ force: true })
        cy.get(TestCasesPage.denominatorMeasureObservationActualValue).should('have.value', '30')
        cy.get(TestCasesPage.numeratorMeasureObservationActualValue).should('have.value', '30')
    })
})

describe('Boolean Measure Observation Actual values', () => {

    beforeEach('Create Measure, Test Case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJsonIppPass)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Actual values for Boolean CV Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'boolFunc')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Click on RunTest Button
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).check().should('be.checked')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click({ force: true })
        cy.get(TestCasesPage.cvMeasureObservationActualValue).should('have.value', '1')
    })

    it('Verify Actual values for Boolean Ratio Measure with MO', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'ipp')

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(TestCasesPage.SelectionOptionChoice).should('exist')
        cy.get(TestCasesPage.SelectionOptionChoice).should('be.visible')
        cy.get('[data-value="boolFunc"]').click() //select boolFunc
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(TestCasesPage.SelectionOptionChoice).should('exist')
        cy.get(TestCasesPage.SelectionOptionChoice).should('be.visible')
        cy.get('[data-value="boolFunc2"]').click() //select boolFunc2
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Click on RunTest Button
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.successMsg).should('be.visible')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.denominatorMeasureObservationActualValue).should('have.value', '1')
        cy.get(TestCasesPage.numeratorMeasureObservationActualValue).should('have.value', '14')
    })
})
