import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"

let measureName = 'CVPatientWithStratification' + Date.now()
let CqlLibraryName = 'CVPatientWithStratification' + Date.now()
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.CVPatientWithStratification_PASS
let measureCQL = 'library CVPatientWithStratification version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.2.000\' called FHIRHelpers\n' +
    'include GlobalCommonFunctionsQICore4 version \'7.1.000\' called Global\n' +
    '\n' +
    'codesystem "SNOMED": \'http://snomed.info/sct\'\n' +
    '\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n' +
    '\n' +
    'code "Unscheduled (qualifier value)": \'103390000\' from "SNOMED" display \'Unscheduled (qualifier value)\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population 1":\n' +
    '   exists ( "Inpatient Encounters" )\n' +
    '       \n' +
    'define "Measure Population":\n' +
    '    exists ("Inpatient Encounters During Day of Measurement Period")\n' +
    '\n' +
    'define "Measure Population Exclusions":\n' +
    '    exists ("Inpatient Encounters During Day of Measurement Period LOS GT 120 Days")\n' +
    '\n' +
    'define function "Measure Observation"(): \n' +
    '  Count({\n' +
    '    ( "Measure Popluation Visits Excluding Measure Popluation Exclusions") Enc\n' +
    '          where Enc.priority ~ "Unscheduled (qualifier value)"          \n' +
    '          })\n' +
    '\n' +
    'define "Measure Popluation Visits Excluding Measure Popluation Exclusions":\n' +
    '  "Inpatient Encounters" \n' +
    '      except "Inpatient Encounters During Day of Measurement Period LOS GT 120 Days"\n' +
    '\n' +
    'define "Inpatient Encounters":\n' +
    '  [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    '      where InptEncounter.status = \'finished\' \n' +
    '\t\t\n' +
    'define "Inpatient Encounters During Day of Measurement Period":\n' +
    '  "Inpatient Encounters" IE\n' +
    '    where IE.period ends during day of "Measurement Period"\n' +
    '\t\n' +
    'define "Inpatient Encounters During Day of Measurement Period LOS GT 120 Days":\n' +
    '  "Inpatient Encounters During Day of Measurement Period" IE \n' +
    '    where Global."LengthInDays"(IE.period) > 120\n' +
    '\n' +
    'define "Stratification 1":\n' +
    '  true\n' +
    ' \n' +
    'define "Stratification 2":\n' +
    '  true'

describe('Measure Creation and Testing: CV Patient Measure With Stratification', () => {

    before('Create Measure, Test Case and Login', () => {

        OktaLogin.Login()
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-01', '2012-12-31')

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Login()

    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End CV Patient Measure with Stratification, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Continuous Variable')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population 1')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Measure Population')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'Measure Observation')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        //Add Stratification fields
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Stratification 1')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'initialPopulation')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Stratification 2')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'measurePopulation')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

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

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'pass')

    })
})
