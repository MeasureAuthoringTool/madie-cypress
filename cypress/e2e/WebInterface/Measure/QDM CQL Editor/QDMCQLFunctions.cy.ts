import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"

const date = Date.now()
let measureName = 'QDMCQLFunctions' + date
let CqlLibraryName = 'QDMCQLFunctions' + date
let measureCQL = 'library NonPatientBasedRatioMeasureWithMultipleGroupsandStratifications version \'0.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Active Bleeding": \'urn:oid:2.16.840.1.113762.1.4.1206.28\' \n' +
    'valueset "Acute Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1182.118\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer Type"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Qualifying Encounters"\n' +
    '\n' +
    'define "Qualifying Encounters":\n' +
    '  ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
    '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
    '    union ["Encounter, Performed": "Acute Inpatient"]\n' +
    '    union ["Encounter, Performed": "Active Bleeding"]\n' +
    '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
    '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
    '\n' +
    'define "Denominator":\n' +
    '  ["Encounter, Performed": "Acute Inpatient"] AcuteInpatient\n' +
    '    where AcuteInpatient.lengthOfStay > 10 days\n' +
    '\n' +
    'define "Numerator":\n' +
    '  ["Encounter, Performed": "Active Bleeding"] ActiveBleeding\n' +
    '    where ActiveBleeding.relevantPeriod overlaps day of "Measurement Period"\n' +
    '    \n' +
    'define "Denominator 2":\n' +
    '  ["Encounter, Performed": "Encounter Inpatient"] EncounterInpatient\n' +
    '    where EncounterInpatient.lengthOfStay > 15 days\n' +
    '\n' +
    'define "Numerator 2":\n' +
    '  ["Encounter, Performed": "Emergency Department Visit"] EmergencyDepartmentVisit\n' +
    '    where EmergencyDepartmentVisit.lengthOfStay > 15 days\n' +
    '\n' +
    'define function "Denominator Observation"(Encounter "Encounter, Performed" ):\n' +
    '  duration in hours of Encounter.relevantPeriod\n' +
    '\n' +
    'define function "Numerator Observation"(Encounter "Encounter, Performed" ):\n' +
    '  duration in hours of Encounter.relevantPeriod\n' +
    '\n' +
    'define fluent function "Test"(): \n' +
    'true'

//Skipping until feature flag "CQLBuilderFunctions" is removed
describe.skip('QDM CQL Functions', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Apply Function to the QDM CQL and verify under Saved Functions tab', () => {

        //Apply Function to the CQL
        cy.get(CQLEditorPage.functionsTab).click()
        cy.get(CQLEditorPage.functionNameTextbox).type('Denominator Exclusions')
        cy.get(CQLEditorPage.fluentFunctionCheckbox).click()
        cy.get(CQLEditorPage.argumentNameTextbox).type('TheEncounterEncounter')
        cy.get(CQLEditorPage.argumentTypeDropdown).click()
        cy.get(CQLEditorPage.argumentTypeString).click()
        cy.get(CQLEditorPage.addArgumentBtn).click()
        cy.get(CQLEditorPage.expressionEditorType).click()
        cy.get(CQLEditorPage.expressionEditorDefinitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        cy.get(CQLEditorPage.expressionEditorNameDenominatorOption).click()
        cy.get(CQLEditorPage.expressionEditorInsertBtn).click()
        cy.get(CQLEditorPage.applyFunctionBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Function Denominator Exclusions has been successfully added to the CQL.')
        cy.get(CQLEditorPage.saveCQLButton).click()

        //Navigate to Saved Functions tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.functionsTab).click()
        cy.get(CQLEditorPage.savedFunctionsTab).click().wait(1000)
        cy.get('[data-testid="functions-row-0"] > :nth-child(1)').should('contain.text', 'Denominator Exclusions')
        cy.get('[data-testid="functions-row-1"] > :nth-child(1)').should('contain.text', 'Denominator Observation')
        cy.get('[data-testid="functions-row-2"] > :nth-child(1)').should('contain.text', 'Numerator Observation')
        cy.get('[data-testid="functions-row-3"] > :nth-child(1)').should('contain.text', 'Test')
    })

    it('Verify error message when duplicate Function is applied to the QDM CQL', () => {

        //Apply Function to the CQL
        cy.get(CQLEditorPage.functionsTab).click()
        cy.get(CQLEditorPage.functionNameTextbox).type('Denominator Exclusions')
        cy.get(CQLEditorPage.fluentFunctionCheckbox).click()
        cy.get(CQLEditorPage.argumentNameTextbox).type('TheEncounterEncounter')
        cy.get(CQLEditorPage.argumentTypeDropdown).click()
        cy.get(CQLEditorPage.argumentTypeString).click()
        cy.get(CQLEditorPage.addArgumentBtn).click()
        cy.get(CQLEditorPage.expressionEditorType).click()
        cy.get(CQLEditorPage.expressionEditorDefinitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        cy.get(CQLEditorPage.expressionEditorNameDenominatorOption).click()
        cy.get(CQLEditorPage.expressionEditorInsertBtn).click()
        cy.get(CQLEditorPage.applyFunctionBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Function Denominator Exclusions has been successfully added to the CQL.')

        //Apply the same Function again
        cy.get(CQLEditorPage.functionNameTextbox).type('Denominator Exclusions')
        cy.get(CQLEditorPage.fluentFunctionCheckbox).click()
        cy.get(CQLEditorPage.argumentNameTextbox).type('TheEncounterEncounter')
        cy.get(CQLEditorPage.argumentTypeDropdown).click()
        cy.get(CQLEditorPage.argumentTypeString).click()
        cy.get(CQLEditorPage.addArgumentBtn).click()
        cy.get(CQLEditorPage.expressionEditorType).click()
        cy.get(CQLEditorPage.expressionEditorDefinitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        cy.get(CQLEditorPage.expressionEditorNameDenominatorOption).click()
        cy.get(CQLEditorPage.expressionEditorInsertBtn).click()
        cy.get(CQLEditorPage.applyFunctionBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Function Denominator Exclusions has already been defined in CQL.')
    })
})