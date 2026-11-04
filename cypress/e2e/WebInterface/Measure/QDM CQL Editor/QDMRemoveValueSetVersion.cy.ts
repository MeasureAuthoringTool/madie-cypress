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
import { TestData } from "../../../../Shared/TestData"

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
        TestData.saveMeasureCql(qdmManifestTestCQL).then(TestData.expectSavedMeasureCql)
        OktaLogin.SessionLogin()
        MeasuresPage.actionCenter('edit')
        return cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
    })

    afterEach('Clean up', () => {

        return Utilities.deleteMeasure()
    })

    it('Valueset version removed and user is informed', () => {

        CQLEditorPage.openMonacoCqlEditor()
        const versionedValueSet = 'valueset "Adolescent depression screening assessment with version":  \'urn:oid:2.16.840.1.113762.1.4.1260.162\' version \'urn:hl7:version:20240307\''
        TestData.readMeasure().then(({ status, body }) => {
            expect(status).to.eq(200)
            expect(body.cql.trimStart(), 'saved CQL begins with a library declaration').to.match(/^library /)
            expect(body.cql.match(/^context Patient\r?$/gm) ?? [], 'Patient context declarations').to.have.length(1)

            const updatedCql = body.cql.replace(/^context Patient\r?$/m, `${versionedValueSet}\ncontext Patient`)
            MonacoEditor.replaceDocument(EditMeasurePage.monacoCqlEditor, updatedCql)
        })

        cy.intercept('PUT', /\/api\/measures\/[^/?]+(?:\?.*)?$/).as('saveVersionedValueSet')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled').click()
        cy.wait('@saveVersionedValueSet').its('response.statusCode').should('eq', 200)
        Utilities.waitForElementVisible(CQLEditorPage.saveAlertMessage, 35000)
        cy.get(CQLEditorPage.saveAlertMessage)
            .find('[class="madie-alert success"]')
            .find(TestCasesPage.importTestCaseSuccessInfo)
            .find('[data-testid="library-warning"]')
            .should(($warning) => {
                expect($warning.text().replace(/\s+/g, ' ').trim()).to.match(
                    /^MADiE does not currently support use of value set version directly in (?:CQL|measures) at this time\. Your value set versions have been removed\. Please use the relevant manifest for value set expansion for testing\.$/
                )
            })

        //confirm that the CQL does not include the version
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'Adolescent depression screening assessment with version')
        MonacoEditor.assertRenderedTextDoesNotContain(EditMeasurePage.monacoCqlEditor, 'version \'urn:hl7:version:20240307\'')
    })
})
