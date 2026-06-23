import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { Toasts } from '../../../../Shared/Toasts'

const measureName = 'CVPatientWithStratification' + Date.now()
const CqlLibraryName = 'CVPatientWithStratification' + Date.now()
const testCaseTitle = 'PASS'
const testCaseDescription = 'PASS'
const testCaseSeries = 'SBTestSeries'
const testCaseJson = TestCaseJson.CVPatientWithStratification_PASS
const measureCQL =
    "library CVPatientWithStratification version '0.0.000'\n\n" +
    "using QICore version '4.1.1'\n\n" +
    "include FHIRHelpers version '4.4.000' called FHIRHelpers\n" +
    "include CQMCommon version '4.1.000' called Global\n\n" +
    'codesystem "SNOMED": \'http://snomed.info/sct\'\n\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n\n' +
    'code "Unscheduled (qualifier value)": \'103390000\' from "SNOMED" display \'Unscheduled (qualifier value)\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define "Initial Population 1":\n' +
    '   exists ( "Inpatient Encounters" )\n\n' +
    'define "Measure Population":\n' +
    '    exists ("Inpatient Encounters During Day of Measurement Period")\n\n' +
    'define "Measure Population Exclusions":\n' +
    '    exists ("Inpatient Encounters During Day of Measurement Period LOS GT 120 Days")\n\n' +
    'define function "Measure Observation"(): \n' +
    '  Count({\n' +
    '    ( "Measure Popluation Visits Excluding Measure Popluation Exclusions") Enc\n' +
    '          where Enc.priority ~ "Unscheduled (qualifier value)"\n' +
    '          })\n\n' +
    'define "Measure Popluation Visits Excluding Measure Popluation Exclusions":\n' +
    '  "Inpatient Encounters" \n' +
    '      except "Inpatient Encounters During Day of Measurement Period LOS GT 120 Days"\n\n' +
    'define "Inpatient Encounters":\n' +
    '  [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    "      where InptEncounter.status = 'finished'\n\n" +
    'define "Inpatient Encounters During Day of Measurement Period":\n' +
    '  "Inpatient Encounters" IE\n' +
    '    where IE.period ends during day of "Measurement Period"\n\n' +
    'define "Inpatient Encounters During Day of Measurement Period LOS GT 120 Days":\n' +
    '  "Inpatient Encounters During Day of Measurement Period" IE \n' +
    '    where Global."LengthInDays"(IE.period) > 120\n\n' +
    'define "Stratification 1":\n' +
    '  true\n\n' +
    'define "Stratification 2":\n' +
    '  true'

describe('Measure Creation and Testing: CV Patient Measure With Stratification', () => {
    before('Create Measure, Test Case and Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {
            measureCql: measureCQL,
            mpStartDate: '2012-01-01',
            mpEndDate: '2012-12-31',
        })

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Login()
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End CV Patient Measure with Stratification, Pass Result', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Continuous Variable')
        cy.get(MeasureGroupPage.initialPopulationSelect).focus()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population 1')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Measure Population')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'Measure Observation')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Add Stratification fields
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Stratification 1')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Stratification 2')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).check().should('be.checked')
        cy.get(TestCasesPage.measureObservationRow).type('1')

        cy.get(TestCasesPage.initialPopulationStratificationExpectedValue).check().should('be.checked')
        cy.get(TestCasesPage.measurePopulationStratificationExpectedValue).check().should('be.checked')
        cy.get(TestCasesPage.initialPopulationStrata2ExpectedValue).check().should('be.checked')
        cy.get(TestCasesPage.measurePopulationStrata2ExpectedValue).check().should('be.checked')

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(Toasts.otherSuccessToast).should(
            'contain.text',
            'Test case updated successfully! Test case validation has started running, please continue working in MADiE.',
        )

        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30000)
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
