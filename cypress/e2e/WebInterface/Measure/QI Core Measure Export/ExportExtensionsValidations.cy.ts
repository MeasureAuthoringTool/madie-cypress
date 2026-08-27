import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { Utilities } from '../../../../Shared/Utilities'
import { Header } from '../../../../Shared/Header'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const cqlQiCore6 =
    "library AnotherDrc430 version '0.0.000'\n" +
    "include FHIRHelpers version '4.4.000' called FHIRHelpers\n" +
    "codesystem \"LOINC:2.78\": 'http://loinc.org' version '2.78'\n" +
    "code \"Abdomen and Pelvis High Dose\": 'LA31754-7' from \"LOINC:2.78\" display 'Abdomen and Pelvis High Dose'\n" +
    "using QICore version '6.0.0'\n" +
    'context Patient\n' +
    'define "X":\n' +
    '  [SimpleObservation: "Abdomen and Pelvis High Dose"]'
const expectedCoding = {
    system: 'http://loinc.org',
    version: '2.78',
    code: 'LA31754-7',
    display: 'Abdomen and Pelvis High Dose'
}
const exportFileName = 'AutoTestTitle-v0.0.000-FHIR'

describe('Check extensions data in QiCore 6.0.0 export', () => {
    const measureName = 'ExportExtensionsCheck' + Date.now()
    const CqlLibraryName = 'ExportExtensionsCheckLib' + Date.now()

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: cqlQiCore6 })
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'X', 'Observation')

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ waitForDisabled: true })

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export')
        cy.verifyDownload(exportFileName + '.zip', { timeout: 5500 })
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: exportFileName + '.zip', path: downloadsFolder }).then(() => {
            cy.log('unzipFile Task finished')
        })
    })

    after('Clean up and Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Check export files for codesystem version in Library DRC extension', () => {
        const elmFile = path.join(downloadsFolder, exportFileName + '.json')

        cy.readFile(elmFile).then((fileContents) => {
            const libraryEntry = fileContents.entry.find((entry) => entry.resource?.resourceType === 'Library')
            expect(libraryEntry, 'exported Library entry').to.exist

            const directReferenceCode = libraryEntry.resource.extension.find(
                (extension) => extension.valueCoding?.code === expectedCoding.code
            )
            expect(directReferenceCode.valueCoding).to.eql(expectedCoding)
        })
    })
})
