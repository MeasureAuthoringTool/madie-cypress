import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"

let measureName = 'TestMeasure' + Date.now() + 1
let CqlLibraryName = 'TestLibrary' + Date.now() + 1
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let measureCQL = MeasureCQL.ICFCleanTest_CQL

let measureCQL_valid = 'library ' + newCqlLibraryName + ' version \'0.0.000\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    '\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "ipp":\n' +
    '  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period" \n' +
    '  \n' +
    'define "denom":\n' +
    '    "ipp"\n' +
    '    \n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n' +
    '      \n' +
    'define "numeratorExclusion":\n' +
    '    "num"'

let measureCQL_WithErrors = 'library ' + newCqlLibraryName + ' version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' \n' +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "HPV Test": \'\')'

let measureCQL_WithWarnings = 'library TestLibrary16969620425371870 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include QICoreCommon version \'1.2.000\' called QICoreCommon\n' +
    'include Hospice version \'6.1.000\' called Hospice\n' +
    'include Status version \'1.1.000\' called Status\n' +
    '\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    '\n' +
    'codesystem "CPT": \'http://www.ama-assn.org/go/cpt\' \n' +
    '\n' +
    'code "Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal.": \'99211\' from "CPT" display \'Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal.\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Qualifying Encounters":\n' +
    '  ( ["Encounter": "Office Visit"]\n' +
    '        union ["Encounter": "Office or other outpatient visit for the evaluation and management of an established patient, that may not require the presence of a physician or other qualified health care professional. Usually, the presenting problem(s) are minimal."]\n' +
    '        ) ValidEncounters\n' +
    '        where QICoreCommon."ToInterval"(ValidEncounters.period) during day of "Measurement Period"'

describe('Validate errors/warnings/success messages on CQL editor component on save', () => {

    beforeEach('Create measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify success message on CQL editor component, on save and on tab / page load', () => {

        cy.wait(3700)

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_valid)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

    })

    it('Verify errors appear on CQL Editor component and in the CQL Editor object, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_WithErrors)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Verify errors in CQL Editor component
        cy.get('.madie-alert').should('contain', '(4) Errors:')
        cy.get('.madie-alert').should('contain.text', 'Errors:Row: 14, Col:23: ELM: 23:23 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}Row: 14, Col:0: VSAC: 0:22 | "\'\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"Row: 14, Col:0: VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 14:0-14:22Row: 14, Col:23: Parse: 23:24 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'')

        //Verify the same error(s) appear in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 23:23 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}  VSAC: 0:22 | "\'\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"  VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 14:0-14:22  Parse: 23:24 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}')

    })

    it('Verify warnings appear on CQL Editor component and in the CQL Editor object, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_WithWarnings)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Verify errors in CQL Editor component
        cy.get('.madie-alert').should('contain', '(6) Errors:')
        cy.get('.madie-alert').should('contain', '(1) Warning:')
        cy.get('.madie-alert').should('contain.text', 'Row: 24, Col:17: ELM: 17:268 | Could not resolve membership operator for terminology ' +
            'target of the retrieve.')

        //Verify the same warning(s) appear in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.warningInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 17:268 | Could not ' +
            'resolve membership operator for terminology target of the retrieve.')

    })
})

describe('Validate errors/warnings/success messages on CQL editor component on CQL update', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify success message on CQL editor component, on CQL update and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.wait(1000)

        //Update text in the CQL Library Editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_valid)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

    })

    it('Verify errors appear on CQL Editor component and in the CQL Editor object, on CQL update and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.wait(1000)

        //Update text in the CQL Library Editor that will cause error
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_WithErrors)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get('[data-testid="library-warning"]').should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Verify errors in CQL Editor component
        cy.get('.madie-alert').should('contain', '(4) Errors:')
        cy.get('.madie-alert').should('contain.text', 'Errors:Row: 14, Col:23: ELM: 23:23 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}Row: 14, Col:0: VSAC: 0:22 | "\'\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"Row: 14, Col:0: VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 14:0-14:22Row: 14, Col:23: Parse: 23:24 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'')

        //Verify the same error(s) appear in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.errorInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 23:23 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}  VSAC: 0:22 | "\'\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"  VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 14:0-14:22  Parse: 23:24 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}')

    })

    it('Verify warnings appear on CQL Editor component and in the CQL Editor object, on CQL update and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.wait(1000)

        //Update text in the CQL Library Editor that will cause warning
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_WithWarnings)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Verify errors in CQL Editor component
        cy.get('.madie-alert').should('contain', '(6) Errors:')
        cy.get('.madie-alert').should('contain', '(1) Warning:')
        cy.get('.madie-alert').should('contain.text', 'Row: 24, Col:17: ELM: 17:268 | Could not resolve membership operator for terminology ' +
            'target of the retrieve.')

        //Verify the same warning(s) appear in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.warningInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 17:268 | Could not ' +
            'resolve membership operator for terminology target of the retrieve.')

    })
})
