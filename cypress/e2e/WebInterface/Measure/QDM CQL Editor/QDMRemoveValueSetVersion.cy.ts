import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MonacoEditor } from "../../../../Shared/MonacoEditor"

let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()

const measureData: CreateMeasureOptions = {}

describe('Validating that the valueset version is removed and message appears, once user attempts to save CQL whom has a valueset version listed', () => {

    beforeEach('Create Measure', () => {

        measureData.ecqmTitle = measureQDMManifestName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Proportion'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmManifestTestCQL
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveMonacoCql()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Valueset version removed and user is informed', () => {

        CQLEditorPage.openMonacoCqlEditor()
        //add new value set and also specify a version
        MonacoEditor.insertBeforeLineContaining(
            EditMeasurePage.monacoCqlEditor,
            'context Patient',
            'valueset "Adolescent depression screening assessment with version":  \'urn:oid:2.16.840.1.113762.1.4.1260.162\' version \'urn:hl7:version:20240307\''
        )

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled').click()
        Utilities.waitForElementVisible(CQLEditorPage.saveAlertMessage, 35000)
        cy.get(CQLEditorPage.saveAlertMessage).find('[class="madie-alert success"]').find(TestCasesPage.importTestCaseSuccessInfo).find('[data-testid="library-warning"]').should('contain.text', 'MADiE does not currently support use of value set version directly in measures at this time. Your value set versions have been removed. Please use the relevant manifest for value set expansion for testing.')

        //confirm that the CQL does not include the version
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'Adolescent depression screening assessment with version')
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'version \'urn:hl7:version:20240307\'')
    })
})
