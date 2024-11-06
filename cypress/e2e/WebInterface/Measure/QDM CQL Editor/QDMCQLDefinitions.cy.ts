import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { Global } from "../../../../Shared/Global";


let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let measureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue\n' +
    'define fluent function "test"():\n' +
    '\t true\n'

let measureCQL_withError = 'library QDMLibrary1724174199255 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    '\t \n' +
    'define "n":\n' +
    '\ttruetest'

describe('QDM CQL Definitions', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for QDM CQL Definitions Expression Editor Name Options', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression Editor Name dropdown should contain Definition Names
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'SDE Ethnicity')

        //Expression Editor Name dropdown should also contain Included Library name.Definition name
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'Common.ED Encounter')

    })

    it('Search for QDM CQL Definitions Expression Editor Fluent Function Options', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.fluentFunctionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression Editor Name dropdown should contain Fluent Functions
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).should('contain.text', 'test()')

    })

    it('Insert QDM CQL Definitions through Expression Editor and Apply to CQL editor', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()

        //Type=Parameters
        cy.get(CQLEditorPage.parametersOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Measurement Period').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Measurement Period')

        //Type=Definitions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Common.Inpatient Encounter').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Common."Inpatient Encounter"')

        //Type=Functions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.functionsOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Common.EmergencyDepartmentArrivalTime()').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Common."EmergencyDepartmentArrivalTime"()')

        //Type=Fluent Functions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.fluentFunctionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('test()').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', '"test"()')

        //Type=Timing
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.timingOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('after end').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'after end')

        //Type=Pre-Defined Functions
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.preDefinedFunctionsOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('AgeInDays()').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'AgeInDays()')

        CQLEditorPage.applyDefinition()

        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).type('{pageDown}')

        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'define "Test":')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'Common."Measurement Period"')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'Common."Inpatient Encounter"')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'Common."EmergencyDepartmentArrivalTime"()')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', '"test"()')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'after end')
        cy.get(EditMeasurePage.cqlEditorTextBox).eq(0).should('contain.text', 'AgeInDays()')

    })

    it('Verify Included QDM CQL Definitions under Saved Definitions tab', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        Utilities.waitForElementVisible('[data-testid="definitions-row-0"] > :nth-child(1)', 60000)
        cy.get('[data-testid="definitions-row-0"] > :nth-child(1)').should('contain.text', 'SDE Sex')
        cy.get('[data-testid="definitions-row-1"] > :nth-child(1)').should('contain.text', 'SDE Payer')
    })

    it('Edit Saved QDM CQL Definitions', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get('[data-testid="edit-button-0"]').click()

        //Return type populated for Saved Definitions
        cy.get('[data-testid="return-type"]').should('contain.text', 'Return TypePatientCharacteristicSex')

        //Edit Definition
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()
        Utilities.waitForElementVisible(CQLEditorPage.expressionEditorNameList, 60000)
        cy.get(CQLEditorPage.expressionEditorNameList).contains('Common.Inpatient Encounter').click()
        //Insert
        cy.get(CQLEditorPage.expressionInsertBtn).click()
        cy.get('[class="ace_content"]').eq(1).should('contain', 'Common."Inpatient Encounter"')
    })

    it('Dirty check pops up when there are changes in CQL and Edit CQL definition button is clicked', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Make changes to CQL editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.editCQLDefinitions).click()

        //Click on Discard changes
        Global.clickOnDiscardChanges()
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).should('be.visible')
    })

    it('Delete saved QDM CQL Definitions', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.deleteCQLDefinitions).click()
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogContinueBtn).click()
        Utilities.waitForElementVisible('[class="toast success"]', 60000)
        cy.get(CQLEditorPage.saveSuccessMsg).should('contain.text', 'Definition SDE Sex has been successfully removed from the CQL.')

        //Navigate to Saved Definitions again and assert if the Definition is removed from Saved Definitions
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        Utilities.waitForElementVisible(CQLEditorPage.deleteCQLDefinitions, 60000)
        cy.get('.right-panel > .panel-content').should('not.contain', 'Common."Inpatient Encounter')
    })
})

describe('QDM CQL Definitions - Expression Editor Name Option Validations', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL_withError)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')
        cy.get(CQLEditorPage.expandCQLBuilder).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('QDM CQL Definitions Expression editor Name options are not available when CQL has errors', () => {

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')
        cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
        cy.get(CQLEditorPage.definitionOption).click()
        cy.get(CQLEditorPage.expressionEditorNameDropdown).click()

        //Expression editor name dropdown should be empty when there are CQL errors
        cy.get('.MuiAutocomplete-noOptions').should('contain.text', 'No options')
    })
})

describe('QDM CQL Definitions - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.AltLogin()

    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify Non Measure owner unable to Edit/Delete saved Definitions', () => {

        //Navigate to All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('view')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.savedDefinitionsTab).click()

        //Edit button should not be visible
        cy.get(CQLEditorPage.editCQLDefinitions).should('not.exist')

        //Delete button should not be visible
        cy.get(CQLEditorPage.deleteCQLDefinitions).should('not.exist')

    })
})
