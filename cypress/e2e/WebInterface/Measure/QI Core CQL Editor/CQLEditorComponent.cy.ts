import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"

const measureName = 'CqlEditorComponent' + Date.now()
const CqlLibraryName = 'CqlEditorComponentLib' + Date.now()
const measureCQL = MeasureCQL.ICFCleanTest_CQL
const measureCQL_WithWarnings = QiCore4Cql.intentionalWarningCql
const measureCQL_valid = 'library abcde version \'0.0.000\'\n\n' +
    'using FHIR version \'4.0.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "ipp":\n' +
    '  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period" \n\n' +
    'define "denom":\n' +
    '    "ipp"\n\n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n\n' +
    'define "numeratorExclusion":\n' +
    '    "num"'

const measureCQL_WithErrors = 'library qwerty version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
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
    'valueset "HPV Test": \'\')\n' +
    'context Patient\n'

describe('Validate errors/warnings/success messages on CQL editor component on save', () => {

    const newMeasureName = measureName + 1
    const newCqlLibraryName = CqlLibraryName + 1
    let measureCQLValid = measureCQL_valid.replace('abcde', newCqlLibraryName)
    let measureCQLErrors = measureCQL_WithErrors.replace('qwerty', newCqlLibraryName)
    let measureCQLWarnings = measureCQL_WithWarnings.replace('TestLibrary16969620425371870', newCqlLibraryName)

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
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

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQLValid)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

    })

    //Skipping until MAT-8777 is fixed
    it.skip('Verify errors appear on CQL Editor component and in the CQL Editor object, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQLErrors)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Verify errors in CQL Editor component
        cy.get(TestCasesPage.importTestCaseAlertMessage).should('contain', '(3) Errors:')
        cy.get(TestCasesPage.importTestCaseAlertMessage).should('contain.text', 'CQL updated successfully(3) Errors:Row: 14, Col:0: VSAC: 0:22 | "\'\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'"Row: 14, Col:0: VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 14:0-14:22Row: 14, Col:23: Parse: 23:24 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}')

    })

    //Skipping until MAT-8777 is fixed
    it.skip('Verify warnings appear on CQL Editor component and in the CQL Editor object, on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQLWarnings)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Verify errors in CQL Editor component
        cy.get(TestCasesPage.importTestCaseAlertMessage).should('contain.text', 'CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(4) Errors:Row: 26, Col:27: ELM: 27:81 | Expected an expression of type \'System.Boolean\', but found an expression of type \'Interval of System.DateTime\'.Row: 26, Col:83: ELM: 83:95 | Could not resolve call to operator IncludedIn with signature (list<QICore.Encounter>,interval<System.DateTime>).Row: 26, Col:116: Parse: 116:117 | no viable alternative at input \'during day of "Measurement Period")\'Row: 26, Col:116: Parse: 116:117 | extraneous input \')\' expecting {<EOF>, \'define\', \'context\'}(1) Warning:Row: 24, Col:17: ELM: 17:268 | Could not resolve membership operator for terminology target of the retrieve.')

        //Verify the same warning(s) appear in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.warningInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 17:268 | Could not ' +
            'resolve membership operator for terminology target of the retrieve.')

    })
})

describe('Validate errors/warnings/success messages on CQL editor component on CQL update', () => {

    const newMeasureName = measureName + 2
    const newCqlLibraryName = CqlLibraryName + 2
    let measureCQLValid = measureCQL_valid.replace('abcde', newCqlLibraryName)
    let measureCQLErrors = measureCQL_WithErrors.replace('qwerty', newCqlLibraryName)
    let measureCQLWarnings = measureCQL_WithWarnings.replace('TestLibrary16969620425371870', newCqlLibraryName)

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify success message on CQL editor component, on CQL update and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Update text in the CQL Library Editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQLValid)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

    })

    //Skipping until MAT-8777 is fixed
    it.skip('Verify errors appear on CQL Editor component and in the CQL Editor object, on CQL update and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Update text in the CQL Library Editor that will cause error
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQLErrors)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get('[data-testid="library-warning"]').should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Verify errors in CQL Editor component
        cy.get(TestCasesPage.importTestCaseAlertMessage).should('contain.text', 'CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(3) Errors:Row: 14, Col:0: VSAC: 0:22 | \"\'\' is not a valid URL. Fhir URL should start with \'http://cts.nlm.nih.gov/fhir/ValueSet/\'\"Row: 14, Col:0: VSAC: 0:22 | Request failed with status code 404 for oid = \'\' location = 14:0-14:22Row: 14, Col:23: Parse: 23:24 | extraneous input \')\' expecting {<EOF>, \'using\', \'include\', \'public\', \'private\', \'parameter\', \'codesystem\', \'valueset\', \'code\', \'concept\', \'define\', \'context\'}')

    })

    //Skipping until MAT-8777 is fixed
    it.skip('Verify warnings appear on CQL Editor component and in the CQL Editor object, on CQL update and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //Clear the text in CQL Library Editor
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        //Update text in the CQL Library Editor that will cause warning
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQLWarnings)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Verify errors in CQL Editor component
        cy.get(TestCasesPage.importTestCaseAlertMessage).should('contain.text', 'CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.(4) Errors:Row: 26, Col:27: ELM: 27:81 | Expected an expression of type \'System.Boolean\', but found an expression of type \'Interval of System.DateTime\'.Row: 26, Col:83: ELM: 83:95 | Could not resolve call to operator IncludedIn with signature (list<QICore.Encounter>,interval<System.DateTime>).Row: 26, Col:116: Parse: 116:117 | no viable alternative at input \'during day of "Measurement Period")\'Row: 26, Col:116: Parse: 116:117 | extraneous input \')\' expecting {<EOF>, \'define\', \'context\'}(1) Warning:Row: 24, Col:17: ELM: 17:268 | Could not resolve membership operator for terminology target of the retrieve.')

        //Verify the same warning(s) appear in CQL Editor windows
        Utilities.validateErrors(CQLEditorPage.warningInCQLEditorWindow, CQLEditorPage.errorContainer, 'ELM: 17:268 | Could not ' +
            'resolve membership operator for terminology target of the retrieve.')

    })
})
