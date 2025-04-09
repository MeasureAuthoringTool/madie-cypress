import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasureActionOptions, MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

const measureName = 'ExportWithInfo' + Date.now()
const CqlLibraryName = 'ExportWithInfoLib' + Date.now()
const measureCQL = MeasureCQL.CQL_Multiple_Populations
const exportOptions: MeasureActionOptions = {
    exportWithInfo: true
}

const expCql = 'library FMPW version \'0.0.000\'\n' +
'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
'using QICore version \'6.0.0\'\n' +
'parameter "Measurement Period" Interval<DateTime>\n' +
'context Patient\n' +
'define "IP":\n' +
'  exists ["QICore Condition Encounter Diagnosis"]\n' +
'  and exists "Encounter"\n' +
'define "Encounter":\n' + 
'  [Encounter] IP\n' +
'  where IP.class is not null'

describe('QI-Core Measure Export for Publish', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {measureCql: expCql})
      //  CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, expCql, null, false)
      //  MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        // outcome boolean cohort "IP"
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'IP', 'boolean')


        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export', null, exportOptions)
        cy.verifyDownload('AutoTestTitle-v0.0.000-FHIR6.zip', {timeout: 5500})
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', {zipFile: 'AutoTestTitle-v0.0.000-FHIR6.zip', path: downloadsFolder})
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate CQL info appears as annotations on the library JSON', () => {

        const elmFile = path.join(downloadsFolder, 'resources', 'library-' + CqlLibraryName + '-0.0.000.json')
        
        cy.readFile(elmFile).then(fileContents => {

            // the data we need is encoded - below will fetch, decode, and check for details
            const encodedData = fileContents.content[2].data
            Cypress.Blob.base64StringToBlob(encodedData).text().then(str => {
                const elm = JSON.parse(str)

                // assert details for the expected warning
                expect(elm.library.annotation[1].errorSeverity).to.eq('warning')
                expect(elm.library.annotation[1].type).to.eq('CqlToElmError')
                expect(elm.library.annotation[1].message).to.eq('An alias identifier [IP] is hiding another identifier of the same name.')
            })
        })
    })
})