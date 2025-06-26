import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"




let randValue = null
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let measureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n\n' +
    '//Test Comments\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n\n' +
    'define "ipp":\n' +
    '\ttrue\n\n' +
    'define "d":\n' +
    '\t true\n\n' +
    'define "n":\n' +
    '\ttrue\n\n' +
    'define fluent function "test"():\n' +
    '\t true'

let measureCQL_withError = 'library QDMLibrary1724174199255 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n\n' +
    'define "ipp":\n' +
    '\ttrue\n\n' +
    'define "d":\n' +
    '\ttrue\n\n' +
    'define "n":\n' +
    '\ttruetest'

const cqlMissingDefinitionName = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n\n' +
    '//Test Comments\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n\n' +
    'define :\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n\n' +
    'define "ipp":\n' +
    '\ttrue\n\n' +
    'define "d":\n' +
    '\t true\n\n' +
    'define "n":\n' +
    '\ttrue\n\n' +
    'define fluent function "test"():\n' +
    '\t true'

const cqlDefinitionNameAsKeyword = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Common\n\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n\n' +
    '//Test Comments\n' +
    'define duration:\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n\n' +
    'define :\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n\n' +
    'define "ipp":\n' +
    '\ttrue\n\n' +
    'define "d":\n' +
    '\t true\n\n' +
    'define "n":\n' +
    '\ttrue\n\n' +
    'define fluent function "test"():\n' +
    '\t true'

describe('QDM CQL Definitions', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()
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
        cy.get('[data-testid="definitions-row-0"] > :nth-child(1)').should('contain.text', 'SDE Ethnicity')
        cy.get('[data-testid="definitions-row-0"] > :nth-child(2)').should('contain.text', 'PatientCharacteristicEthnicity')

        cy.get('[data-testid="definitions-row-1"] > :nth-child(1)').should('contain.text', 'SDE Payer')
        cy.get('[data-testid="definitions-row-2"] > :nth-child(1)').should('contain.text', 'SDE Race')
        cy.get('[data-testid="definitions-row-2"] > :nth-child(2)').should('contain.text', 'PatientCharacteristicRace')

        cy.get('[data-testid="definitions-row-3"] > :nth-child(1)').should('contain.text', 'SDE Sex')
        cy.get('[data-testid="definitions-row-4"] > :nth-child(1)').should('contain.text', 'ipp')
        cy.get('[data-testid="definitions-row-4"] > :nth-child(2)').should('contain.text', 'Boolean')
    })

    it('Edit Saved QDM CQL Definitions', () => {

        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get('[data-testid="edit-button-3"]').click()

        //Return type populated for Saved Definitions
        cy.get('[data-testid="return-type"]').should('contain.text', 'Return TypePatientCharacteristicSex')

        //Edit Definition name
        cy.get(CQLEditorPage.definitionNameTextBox).type(' updated')

        cy.get(CQLEditorPage.saveDefinitionBtn).click()

        cy.get('.ace_content').should('contain', 'SDE Sex updated')
    })

    it('Dirty check pops up when there are changes in CQL and Edit CQL definition button is clicked', () => {

        cy.get(CQLEditorPage.definitionsTab).click()

        //Make changes to CQL editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.editCQLDefinitions).click()

        //Click on Discard changes
        Utilities.clickOnDiscardChanges()
        cy.get(CQLEditorPage.expressionEditorTypeDropdown).should('be.visible')
    })

    it('Delete saved QDM CQL Definitions', () => {

        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get(CQLEditorPage.deleteCQLDefinitions).click()
        cy.get(CQLEditorPage.deleteContinueButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 60000)
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Navigate to Saved Definitions again and assert if the Definition is removed from Saved Definitions
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        Utilities.waitForElementVisible(CQLEditorPage.deleteCQLDefinitions, 60000)

        // confirm entry for SDE Ethnicity has been removed
        cy.get(CQLEditorPage.savedDefinitionsTable).should('not.contain', 'SDE Ethnicity')
    })

    it('QDM CQL Definition Comments were displayed under Saved Definitions tab', () => {

        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get('[data-testid="definition-comments-content"]').should('contain.text', 'Test Comments')
    })

    it('View and Edit QDM CQL Definition Comments from Saved Definitions tab', () => {

        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).click()

        //Verify Comment
        cy.get('[data-testid="definition-comments-content"]').should('contain.text', 'Test Comments')

        //Edit Comment
        cy.get('[data-testid="edit-button-0"]').click()
        cy.get(CQLEditorPage.commentTextBox).clear().type('Updated Test Comment')
        //Save
        cy.get(CQLEditorPage.saveDefinitionBtn).click()

        //Verify Updated Comment
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()

        //Navigate to Saved Definitions tab and verify comment
        cy.get(CQLEditorPage.savedDefinitionsTab).click()
        cy.get('[data-testid="definition-comments-content"]').should('contain.text', 'Updated Test Comment')
    })
})
//these tests should be re-visted to make them more streamlined and / or refactored, after bug MAT-8645 is fixed
describe('QDM CQL Definitions - Expression Editor Name Option Validations', () => {

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('QDM CQL Definitions Expression editor Name options are not available when CQL has errors', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        CqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL_withError)
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)
        cy.get('[data-testid="groups-tab"]').click()
        cy.get('[data-testid="base-configuration-types-input"]').click()
            .type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}')
        cy.get('[id="scoring-select"]').click()
        cy.get('[data-testid="scoring-option-COHORT"]').click()
        cy.get('[class="PrivateSwitchBase-input css-j8yymo"]').eq(1).click()
        cy.get('[data-testid="measure-Base Configuration-save"]').click()
        cy.get('[data-testid="leftPanelMeasureInformation-MeasureGroup1"]').wait(2000).click()
        cy.get('[data-testid="population-select-initial-population"]').click()
        cy.get('[data-testid="select-option-measure-group-population"]').eq(2).should('have.attr', 'data-value', 'n').click()
        cy.get('[data-testid="group-form-submit-btn"]').wait(4000).click().wait(4000)
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookie()
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        //Click on Definitions tab
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="measure-details-tab"]').click().wait(2000)
        cy.get(EditMeasurePage.cqlEditorTab).click().wait(3000)
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')
        /*                 cy.get(CQLEditorPage.definitionNameTextBox).type('Test')
                cy.get(CQLEditorPage.expressionEditorTypeDropdown).click()
                cy.get(CQLEditorPage.definitionOption).click()
                cy.get(CQLEditorPage.expressionEditorNameDropdown).click() */

        //Expression editor name dropdown should be empty when there are CQL errors
        //cy.get('.MuiAutocomplete-noOptions').should('contain.text', 'No options')
    })

    it('Verify error message appears on Definitions tab when there is an error in the Measure CQL', () => {

        randValue = (Math.floor((Math.random() * 1000) + 1))
        CqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)
        cy.get('[data-testid="groups-tab"]').click()
        cy.get('[data-testid="base-configuration-types-input"]').click()
            .type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}')
        cy.get('[id="scoring-select"]').click()
        cy.get('[data-testid="scoring-option-COHORT"]').click()
        cy.get('[data-testid="measure-Base Configuration-save"]').click()
        cy.get('[data-testid="leftPanelMeasureInformation-MeasureGroup1"]').wait(1000).click()
        cy.get('[data-testid="population-select-initial-population"]').click()
        cy.get('[data-testid="select-option-measure-group-population"]').eq(2).should('have.attr', 'data-value', 'n').click()
        cy.get('[data-testid="group-form-submit-btn"]').click().wait(1000)

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Navigate to Definitions tab and verify no error message appears
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('not.exist').wait(1000)
        //Navigate to Definitions tab and verify saved definitions appear
        cy.get(CQLEditorPage.savedDefinitionsTab).should('contain.text', 'Saved Definitions (7)')

        //Add errors to CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}define "test":')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Navigate to Definitions tab
        cy.get(CQLEditorPage.expandCQLBuilder).click()
        cy.get(CQLEditorPage.definitionsTab).click()
        cy.get('[data-testid="cql-builder-errors"]').should('contain.text', 'Unable to retrieve CQL builder lookups. Please verify CQL has no errors. If CQL is valid, please contact the help desk.')

        //Navigate to Saved Definitions tab
        cy.get(CQLEditorPage.savedDefinitionsTab).should('contain.text', 'Saved Definitions (0)').click()
        cy.get('[class="Definitions___StyledTd-sc-cj02bv-0 kITigf"]').should('contain.text', 'No Results were found')
    })

    it('QDM CQL Definitions throws specific error when Definition has no name', () => {
        randValue = (Math.floor((Math.random() * 1000) + 2))
        CqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, cqlMissingDefinitionName)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)
        cy.get('[data-testid="groups-tab"]').click()
        cy.get('[data-testid="base-configuration-types-input"]').click()
            .type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}')
        cy.get('[id="scoring-select"]').click()
        cy.get('[data-testid="scoring-option-COHORT"]').click()
        cy.get('[data-testid="measure-Base Configuration-save"]').click()
        cy.get('[data-testid="leftPanelMeasureInformation-MeasureGroup1"]').wait(1000).click()
        cy.get('[data-testid="population-select-initial-population"]').click()
        cy.get('[data-testid="select-option-measure-group-population"]').eq(2).should('have.attr', 'data-value', 'n').click()
        cy.get('[data-testid="group-form-submit-btn"]').click().wait(1000)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "Parse: 7:8 | Definition is missing a name.")
    })

    it('QDM CQL Definitions throws specific error when Definition name is a reserved keyword', () => {

        randValue = (Math.floor((Math.random() * 1000) + 3))
        CqlLibraryName = CqlLibraryName + randValue
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, cqlMissingDefinitionName)
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)
        cy.get('[data-testid="groups-tab"]').click()
        cy.get('[data-testid="base-configuration-types-input"]').click()
            .type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}')
        cy.get('[id="scoring-select"]').click()
        cy.get('[data-testid="scoring-option-COHORT"]').click()
        cy.get('[data-testid="measure-Base Configuration-save"]').wait(1000).click().wait(1000)
        cy.get('[data-testid="leftPanelMeasureInformation-MeasureGroup1"]').wait(1000).click()
        cy.get('[data-testid="population-select-initial-population"]').click()
        cy.get('[data-testid="select-option-measure-group-population"]').eq(2).should('have.attr', 'data-value', 'n').click()
        cy.get('[data-testid="group-form-submit-btn"]').wait(1000).click().wait(2000)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, "Parse: 7:8 | Definition is missing a name.")
    })
})

describe('QDM CQL Definitions - Measure ownership Validations', () => {

    beforeEach('Create Measure and Login', () => {

        randValue = (Math.floor((Math.random() * 1000) + 4))
        CqlLibraryName = CqlLibraryName + randValue
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

        // return type is visible
        cy.get('[data-testid="definitions-row-2"] > :nth-child(2)').should('contain.text', 'PatientCharacteristicRace')
        cy.get('[data-testid="definitions-row-4"] > :nth-child(2)').should('contain.text', 'Boolean')

        //Edit button should not be visible
        cy.get(CQLEditorPage.editCQLDefinitions).should('not.exist')

        //Delete button should not be visible
        cy.get(CQLEditorPage.deleteCQLDefinitions).should('not.exist')

        // click into View screen
        cy.get('[data-testid="view-button-0"]').click()

        cy.get(CQLEditorPage.definitionNameTextBox).should('be.disabled')
        // sub element of tyoe combo-box
        cy.get('[data-testid="type-selector-input"]').should('be.disabled')
        cy.get(CQLEditorPage.expressionInsertBtn).should('be.disabled')
        cy.get('[data-testid="cancel-definition-btn"]').should('be.enabled')
    })
})
