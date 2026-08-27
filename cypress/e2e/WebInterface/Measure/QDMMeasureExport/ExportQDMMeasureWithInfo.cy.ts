import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { CreateMeasureOptions, CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { QdmCql } from '../../../../Shared/QDMMeasuresCQL'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { MeasureActionOptions, MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { Header } from '../../../../Shared/Header'

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const qdmMeasureCQL = QdmCql.severeObstetricComplications
const exportFileName = 'eCQMTitle4QDM-v0.0.000-QDM'

const createMeasureData = (measureName: string, cqlLibraryName: string): CreateMeasureOptions => ({
    ecqmTitle: measureName,
    cqlLibraryName,
    measureScoring: 'Proportion',
    patientBasis: 'false',
    measureCql: qdmMeasureCQL
})

const exportAndUnzipMeasure = (exportOptions: MeasureActionOptions): void => {
    MeasuresPage.actionCenter('export', undefined, exportOptions)
    cy.verifyDownload(exportFileName + '.zip', { timeout: 5500 })
    cy.log('Successfully verified zip file export')

    cy.task('unzipFile', { zipFile: exportFileName + '.zip', path: downloadsFolder }).then(() => {
        cy.log('unzipFile Task finished')
    })
}

const cqlWarnings = (annotations: Array<{ errorSeverity?: string; type?: string }>) =>
    annotations.filter((annotation) => annotation.errorSeverity === 'warning' && annotation.type === 'CqlToElmError')

describe('Successful QDM Measure Export with Info', () => {
    const exportOptions: MeasureActionOptions = {
        exportForPublish: false
    }
    const qdmMeasureName = 'QDMExportWithInfo' + Date.now()
    const qdmCqlLibraryName = 'QDMExportWithInfoLib' + Date.now()

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(
            createMeasureData(qdmMeasureName, qdmCqlLibraryName)
        )
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Numerator 1 Delivery Encounters With Severe Obstetric Complications',
            '',
            'Denominator'
        )

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        cy.get(Header.mainMadiePageButton).click()
        exportAndUnzipMeasure(exportOptions)
    })

    after('Clean up and Logout', () => {
        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Validate CQL info appears as annotations on the library JSON', () => {
        const elmFile = path.join(downloadsFolder, 'resources', qdmCqlLibraryName + '-0.0.000.json')

        cy.readFile(elmFile).then((fileContents) => {
            expect(cqlWarnings(fileContents.library.annotation)).to.have.length(43)
        })
    })
})

describe('Successful QDM Measure Export for Publish', () => {
    const exportOptions: MeasureActionOptions = {
        exportForPublish: true
    }
    const qdmMeasureName = 'QDMExportWithInfo' + Date.now()
    const qdmCqlLibraryName = 'QDMExportWithInfoLib' + Date.now()

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(
            createMeasureData(qdmMeasureName, qdmCqlLibraryName)
        )
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Numerator 1 Delivery Encounters With Severe Obstetric Complications',
            '',
            'Denominator'
        )

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        cy.get(Header.mainMadiePageButton).click()
        exportAndUnzipMeasure(exportOptions)
    })

    after('Clean up and Logout', () => {
        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Validate CQL info DOES NOT appear as annotations on the library JSON', () => {
        const elmFile = path.join(downloadsFolder, 'resources', qdmCqlLibraryName + '-0.0.000.json')

        cy.readFile(elmFile).then((fileContents) => {
            expect(fileContents.library.annotation).to.have.length(2)
            expect(cqlWarnings(fileContents.library.annotation)).to.have.length(0)
        })
    })
})
