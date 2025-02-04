import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"
import {Global} from "../../../../Shared/Global"

const date = Date.now()
let measureName = 'QiCoreCQLFunctions' + date
let CqlLibraryName = 'QiCoreCQLFunctions' + date
let measureCQL = 'library CVEpisodeWithStratification version \'0.0.000\'\n' +
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
    'define "Denominator":\n' +
    '"Initial Population"\n' +
    '\n' +
    'define "Initial Population":\n' +
    ' "Qualifying Encounters"\n' +
    ' \n' +
    'define "Qualifying Encounters":\n' +
    '(\n' +
    '[Encounter: "Office Visit"]\n' +
    'union [Encounter: "Annual Wellness Visit"]\n' +
    'union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]\n' +
    'union [Encounter: "Home Healthcare Services"]\n' +
    ') ValidEncounter\n' +
    'where \n' +
    'ValidEncounter.period during "Measurement Period" \n' +
    'and \n' +
    'ValidEncounter.isFinishedEncounter()\n' +
    '\n' +
    'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
    '(Enc E where E.status = \'finished\') is not null\n' +
    '\n' +
    'define function MeasureObservation(e Encounter):\n' +
    '  2\n' +
    '\n' +
    'define "Stratification 1":\n' +
    ' "Qualifying Encounters" Enc\n' +
    ' where Enc.type in "Annual Wellness Visit"\n' +
    ' \n' +
    'define "Stratification 2":\n' +
    '  "Qualifying Encounters" Enc\n' +
    ' where Enc.type in "Preventive Care Services - Established Office Visit, 18 and Up"'


describe('Qi Core CQL Functions', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
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

    it('Apply Function to the Qi Core CQL. Verify under Saved Functions tab that all functions show in order of CQL document', () => {

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
      
        cy.get('[data-testid="functions-row-0"] > :nth-child(1)').should('contain.text', 'isFinishedEncounter')
        cy.get('[data-testid="functions-row-1"] > :nth-child(1)').should('contain.text', 'MeasureObservation')
        cy.get('[data-testid="functions-row-2"] > :nth-child(1)').should('contain.text', 'Denominator Exclusions')
    })

    it('Verify error message when duplicate Function is applied to the Qi Core CQL', () => {

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

    it('Edit Saved Qi-Core CQL Functions', () => {

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
        /*
        Note: should be
        Global.clickOnKeepWorking()
        but this modal title wants Discard changes? instead of Discard Changes?
        */

        //Click on Delete button
        cy.get(CQLEditorPage.deleteSavedFunctions).click()
        cy.get(Global.discardChangesConfirmationModal).should('contain.text', 'Discard changes?')
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to discard your changes in the CQL and delete the Function from the CQL?')
        cy.get(Global.discardChangesContinue).click()
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to delete this Function?')
    })

    it('Delete Saved Qi Core CQL Functions', () => {

        //Click on Functions tab
        cy.get(CQLEditorPage.functionsTab).click()

        //Navigate to Saved Functions tab
        cy.get(CQLEditorPage.savedFunctionsTab).click()

        //Delete saved Function
        cy.get(CQLEditorPage.deleteSavedFunctions).click()
        cy.get(CQLEditorPage.modalConfirmationText).should('contain.text', 'Are you sure you want to delete this Function?')
        cy.get(CQLEditorPage.deleteContinueButton).should('be.enabled').click()
        cy.get(CQLEditorPage.saveSuccessMsg, {timeout: 6500}).should('have.text', 'Function isFinishedEncounter has been successfully removed from the CQL.')
    })
})

describe('Qi-Core CQL Functions - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.AltLogin()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Non Measure owner unable to Edit/Delete saved Qi Core Functions', () => {

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