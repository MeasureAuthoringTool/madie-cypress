import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import {CreateMeasureOptions, CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { QdmCql } from "../../../../Shared/QDMMeasuresCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureActionOptions, MeasuresPage } from "../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const qdmMeasureCQL = QdmCql.severeObstetricComplications

const measureData: CreateMeasureOptions = {}

describe('Successful QDM Measure Export with Info', () => {

    const exportOptions: MeasureActionOptions = {
        exportForPublish: false
    }
    const qdmMeasureName = 'QDMExportWithInfo' + Date.now()
    const qdmCqlLibraryName = 'QDMExportWithInfoLib' + Date.now()

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        measureData.ecqmTitle = qdmMeasureName
        measureData.cqlLibraryName = qdmCqlLibraryName
        measureData.measureScoring = 'Proportion'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population',
            '', '', 'Numerator 1 Delivery Encounters With Severe Obstetric Complications', '', 'Denominator')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export', null, exportOptions)
        cy.verifyDownload('eCQMTitle4QDM-v0.0.000-QDM.zip', {timeout: 5500})
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', {zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder})
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Validate CQL info appears as annotations on the library JSON', () => {

        const elmFile = path.join(downloadsFolder, 'resources', qdmCqlLibraryName + '-0.0.000.json')
        
        cy.readFile(elmFile).then(fileContents => {

            // remove other types of warnings/info
            const warnings = fileContents.library.annotation.filter(obj => {
                return obj.errorSeverity === 'warning' && obj.type === 'CqlToElmError'
            })
            // assert exact number of warnings we expect
            expect(warnings).to.have.length(43)
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

        measureData.ecqmTitle = qdmMeasureName
        measureData.cqlLibraryName = qdmCqlLibraryName
        measureData.measureScoring = 'Proportion'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population',
            '', '', 'Numerator 1 Delivery Encounters With Severe Obstetric Complications', '', 'Denominator')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export', null, exportOptions)
        cy.verifyDownload('eCQMTitle4QDM-v0.0.000-QDM.zip', {timeout: 5500})
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', {zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder})
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Validate CQL info DOES NOT appear as annotations on the library JSON', () => {

        const elmFile = path.join(downloadsFolder, 'resources', qdmCqlLibraryName + '-0.0.000.json')
        
        cy.readFile(elmFile).then(fileContents => {

            expect(fileContents.library.annotation).to.have.length(2)
            // remove other types of warnings/info
            const warnings = fileContents.library.annotation.filter(obj => {
                return obj.errorSeverity === 'warning' && obj.type === 'CqlToElmError'
            })
            // assert exact number of warnings we expect
            expect(warnings).to.have.length(0)
        })
    })
})