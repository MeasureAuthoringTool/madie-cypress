import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"
import {Global} from "../../../../Shared/Global"

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


describe('QDM CQL Functions', () => {

    beforeEach('Create Measure and Login', () => {

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

    it('Apply Function to the QDM CQL.  Verify under Saved Functions tab that all functions show in order of CQL document', () => {

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

        // Note: this enforces https://jira.cms.gov/browse/MAT-8005
        cy.get('[data-testid="functions-row-0"] > :nth-child(1)').should('contain.text', 'Denominator Observation')
        cy.get('[data-testid="functions-row-1"] > :nth-child(1)').should('contain.text', 'Numerator Observation')
        cy.get('[data-testid="functions-row-2"] > :nth-child(1)').should('contain.text', 'Test')
        cy.get('[data-testid="functions-row-3"] > :nth-child(1)').should('contain.text', 'Denominator Exclusions')
    })

    it('Verify error message when duplicate Function is applied to the QDM CQL', () => {

        //Apply Function to the CQL
        cy.get(CQLEditorPage.functionsTab).click()
        cy.get(CQLEditorPage.functionNameTextbox).type('Denominator Exclusions')
        cy.get(CQLEditorPage.fluentFunctionCheckbox).click()
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
        cy.get(CQLEditorPage.expressionEditorType).click()
        cy.get(CQLEditorPage.expressionEditorDefinitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        cy.get(CQLEditorPage.expressionEditorNameDenominatorOption).click()
        cy.get(CQLEditorPage.expressionEditorInsertBtn).click()
        cy.get(CQLEditorPage.applyFunctionBtn).click()
        cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Function Denominator Exclusions has already been defined in CQL.')
    })

    it('Edit Saved QDM CQL Functions', () => {

        //Click on Functions tab
        cy.get(CQLEditorPage.functionsTab).click()

        //Navigate to Saved Functions tab
        cy.get(CQLEditorPage.savedFunctionsTab).click()
        cy.get(CQLEditorPage.editSavedFunctions).click()

        //Edit Saved Function
        cy.get(CQLEditorPage.functionNameTextbox).clear().type('Numerator Exclusions')
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
        //cy.get(CQLEditorPage.toastMeasureMessage).should('contain.text', 'Function Numerator Exclusions has been successfully added to the CQL.')

    })

    it('Dirty check pops up when there are changes in CQL and Edit/Delete Function button is clicked', () => {

        //Make changes to CQL editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')

        //Click on Functions tab
        cy.get(CQLEditorPage.functionsTab).click()

        //Navigate to Saved Functions tab and click on Edit button
        cy.get(CQLEditorPage.savedFunctionsTab).click()
        cy.get(CQLEditorPage.editSavedFunctions).click()

        //Click on Discard changes
        cy.get(Global.discardChangesConfirmationModal).should('contain.text', 'Discard changes?')
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to discard your changes in the CQL and edit the Function in the CQL?')
        cy.get(Global.keepWorkingCancel).click()

        //Click on Delete button
        cy.get(CQLEditorPage.deleteSavedFunctions).click()
        cy.get(Global.discardChangesConfirmationModal).should('contain.text', 'Discard changes?')
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to discard your changes in the CQL and delete the Function from the CQL?')
        cy.get(Global.discardChangesContinue).click()
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to delete this Function?')
    })

    it('Delete Saved QDM CQL Functions', () => {

        //Click on Functions tab
        cy.get(CQLEditorPage.functionsTab).click()

        //Navigate to Saved Functions tab
        cy.get(CQLEditorPage.savedFunctionsTab).click()

        //Delete saved Function
        cy.get(CQLEditorPage.deleteSavedFunctions).click()
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to delete this Function?')
        cy.get(CQLEditorPage.deleteContinueButton).should('be.enabled').click()
        cy.get(CQLEditorPage.saveSuccessMsg, {timeout: 6500}).should('have.text', 'Function Denominator Observation has been successfully removed from the CQL.')
    })
})

//Skipping until feature flag "CQLBuilderFunctions" is removed
describe('QDM CQL Functions - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.AltLogin()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Non Measure owner unable to Edit/Delete saved QDM Functions', () => {

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('view')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Navigate to Saved Functions tab
        cy.get(CQLEditorPage.functionsTab).click()
        cy.get(CQLEditorPage.savedFunctionsTab).click()

        //Edit button should not be visible
        Utilities.waitForElementVisible('[data-testid="functions-row-0"]', 60000)
        cy.get(CQLEditorPage.editSavedFunctions).should('not.exist')

        //Delete button should not be visible
        cy.get(CQLEditorPage.deleteSavedFunctions).should('not.exist')
    })
})