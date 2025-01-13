import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureName = 'QDMTestMeasure' + Date.now() + 1
let CqlLibraryName = 'QDMTestLibrary' + Date.now() + 1
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let measureQDMCQL_without_using = MeasureCQL.simpleQDM_CQL_without_using
let measureQDMCQL_with_incorrect_using = MeasureCQL.simpleQDM_CQL_with_incorrect_using
let measureQDMCQL_with_different_Lib_name = 'library ' + newCqlLibraryName + 'b' + ' version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.113883.3.3616.200.110.102.5069\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
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
    'define "i":\n' +
    '  true\n' +
    'define "d":\n' +
    '  true\n' +
    'define "n":\n' +
    '  true'
let measureCQL = 'library ' + newCqlLibraryName + ' version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.113883.3.3616.200.110.102.5069\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
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
    'define "i":\n' +
    '  true\n' +
    'define "d":\n' +
    '  true\n' +
    'define "n":\n' +
    '  true'

let measureCQL_withSameLibraryVersionAndDifferentAlias = 'library ' + newCqlLibraryName + ' version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called GlobalOne\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.113883.3.3616.200.110.102.5069\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
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
    'define "i":\n' +
    '  true\n' +
    'define "d":\n' +
    '  true\n' +
    'define "n":\n' +
    '  true'

let measureCQL_withDifferentLibraryVersionAndDifferentAlias = 'library ' + newCqlLibraryName + ' version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
    'include MATGlobalCommonFunctionsQDM version \'7.0.000\' called GlobalOne\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.113883.3.3616.200.110.102.5069\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
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
    'define "i":\n' +
    '  true\n' +
    'define "d":\n' +
    '  true\n' +
    'define "n":\n' +
    '  true'

let measureCQL_without_CodeSystem_Name = 'library QDMCQLFunctions1735670044066 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'code "Assessed Patient": \'2\' display \'Assessed Patient\'\n' +
    '\n' +
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
    '\ttrue'

describe('Validate errors/warnings/success messages on CQL editor component on save', () => {

    beforeEach('Create measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify success message on CQL editor component, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

    })
    it('Verify error message when there is no using statement in the CQL', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQDMCQL_without_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Missing a using statement. Please add in a valid model and version.Library statement was incorrect. MADiE has overwritten it.')

    })
    it('Verify error message when there is an using statement in the CQL, but it is not accurate', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQDMCQL_with_incorrect_using)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.Incorrect using statement(s) detected. MADiE has corrected it.')

    })
    it('Verify error message when there is an using statement in the CQL, but it is not accurate, and the library name used is not correct', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureQDMCQL_with_different_Lib_name)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

    })

    it('Verify error message when same included Library with same version is used with different alias', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_withSameLibraryVersionAndDifferentAlias)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.errorContainer).should('contain.text', 'Row: 4, Col:0: ELM: 0:0 | Library MATGlobalCommonFunctionsQDM Version 8.0.000 is already in use in this library.')

    })

    it('Verify error message when same included Library with different version is used with different alias', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_withDifferentLibraryVersionAndDifferentAlias)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.errorContainer, 60000)

        cy.get(CQLEditorPage.errorContainer).should('contain.text', 'Row: 4, Col:0: ELM: 0:0 | Library MATGlobalCommonFunctionsQDM is already in use in this library.')

    })

    it('Verify error message when Code System name is missing from Code declaration', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_without_CodeSystem_Name)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.errorContainer, 60000)

        cy.get(CQLEditorPage.errorContainer).should('contain.text', 'Row: 10, Col:29: Parse: 29:36 | code statement requires a codesystem reference. Please add a \'from\' clause to your statement.')

    })

    it('Verify error message on CQL Editor when the CQL has a retrieve without filter', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTab).type('{selectAll}{del}')
        Utilities.typeFileContents('cypress/fixtures/QDMCQLRetrieve_WithoutFilter.txt', EditMeasurePage.cqlEditorTextBox)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.errorContainer, 60000)

        cy.get(CQLEditorPage.errorContainer).should('contain.text', 'Row: 20, Col:2: ELM: 2:25 | Retrieves must contain a code or value set filter')
    })
})

