import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"

let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()



describe('Validating that the valueset version is removed and message appears, once user attempts to save CQL whom has a valueset version listed', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //logout of MADiE
        OktaLogin.UILogout()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Valueset version removed and user is informed', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click().wait(2000)
        //add new valueset and also specify a version
        cy.get(EditMeasurePage.cqlEditorTextBox)
            .wait(500)
            .type('{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{moveToEnd}{enter}valueset \"Adolescent depression screening assessment with version\":  \'urn:oid:2.16.840.1.113762.1.4.1260.162\' version \'urn:hl7:version:20240307\'')

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementVisible(CQLEditorPage.saveAlertMessage, 35000)
        cy.get(CQLEditorPage.saveAlertMessage).find('[class="madie-alert success"]').find('[id="content"]').find('[data-testid="library-warning"]').should('contain.text', 'MADiE does not currently support use of value set version directly in measures at this time. Your value set versions have been removed. Please use the relevant manifest for value set expansion for testing.')

        //confirm that the CQL does not include the version
        //cy.get(EditMeasurePage.cqlEditorTextBox).should('include.text', 'library ' + CqlLibraryName + ' version \'0.0.000\'using QDM version \'5.6\'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Globalinclude TJCOverallQDM version \'8.0.000\' called TJCvalueset "Antithrombotic Therapy for Ischemic Stroke": \'urn:oid:2.16.840.1.113762.1.4    .1110.62\'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'valueset "Medical Reason For Not Providing Treatment": \'urn:oid:2.16.840.1.113883.3    .117.1.7.1.473\'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'valueset "Patient Refusal": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.93\'valueset "Adolescent depression screening assessment with version": \'urn:oid:2.16.840    .1.113762.1.4.1260.162\'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'valueset "Pharmacological Contraindications For Antithrombotic Therapy": \'urn:oid:2.16    .840.1.113762.1.4.1110.52\'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'context Patientdefine "SDE Ethnicity":  ["Patient Characteristic Ethnicity": "Ethnicity"]define "SDE Payer":  ["Patient Characteristic Payer": "Payer Type"]define "SDE Race":  ["Patient Characteristic Race": "Race"]define "SDE Sex":  ["Patient Characteristic Sex": "ONC Administrative Sex"]define "Denominator Exclusions":  TJC."Ischemic Stroke Encounters with Discharge Disposition"    union TJC."Encounter with Comfort Measures during Hospitalization"define "Encounter with Pharmacological Contraindications for Antithrombotic Therapy at     Discharge":  TJC."Ischemic Stroke Encounter" IschemicStrokeEncounter    with ["Medication, Discharge": "Pharmacological Contraindications For         Antithrombotic Therapy"] Pharmacological\'')

    })

})
