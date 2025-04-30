import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const cqlQiCore4 = 'library AnotherDrc430 version \'0.0.000\'\n' +
'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
'codesystem "LOINC:2.78": \'http://loinc.org\' version \'2.78\'\n' +
'code "Abdomen and Pelvis High Dose": \'LA31754-7\' from "LOINC:2.78" display \'Abdomen and Pelvis High Dose\'\n' +
'using QICore version \'4.1.1\'\n' +
'context Patient\n' +
'define "X":\n' +
'  [Observation: "Abdomen and Pelvis High Dose"]'
const cqlQiCore6 = 'library AnotherDrc430 version \'0.0.000\'\n' +
'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
'codesystem "LOINC:2.78": \'http://loinc.org\' version \'2.78\'\n' +
'code "Abdomen and Pelvis High Dose": \'LA31754-7\' from "LOINC:2.78" display \'Abdomen and Pelvis High Dose\'\n' +
'using QICore version \'6.0.0\'\n' +
'context Patient\n' +
'define "X":\n' +
'  [SimpleObservation: "Abdomen and Pelvis High Dose"]'
const expectedCoding = {
    "system": "http://loinc.org",
    "version": "2.78",
    "code": "LA31754-7",
    "display": "Abdomen and Pelvis High Dose"
}

describe('Check extensions data in QiCore 4.1.1 export', () => {

    const measureName = 'ExportExtensionsCheck' + Date.now()
    const CqlLibraryName = 'ExportExtensionsCheckLib' + Date.now()

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, {measureCql: cqlQiCore4})
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'X', 'observation')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export')
        cy.verifyDownload('AutoTestTitle-v0.0.000-FHIR4.zip', {timeout: 5500})
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', {zipFile: 'AutoTestTitle-v0.0.000-FHIR4.zip', path: downloadsFolder})
            .then(results => {
                cy.log('unzipFile Task finished')
                cy.wait(1000)
            })
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Check export files for codesystem version in Library DRC extension', () => {

        const elmFile = path.join(downloadsFolder, 'AutoTestTitle-v0.0.000-FHIR.json')

        cy.readFile(elmFile).then(fileContents => {

            expect(fileContents.entry[1].resource.extension[0].valueCoding).to.eql(expectedCoding)
        })
    })
})

describe('Check extensions data in QiCore 6.0.0 export', () => {

    const measureName = 'ExportExtensionsCheck' + Date.now()
    const CqlLibraryName = 'ExportExtensionsCheckLib' + Date.now()

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {measureCql: cqlQiCore6})
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'X', 'Observation')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export')
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

    it('Check export files for codesystem version in Library DRC extension', () => {

        const elmFile = path.join(downloadsFolder, 'AutoTestTitle-v0.0.000-FHIR.json')

        cy.readFile(elmFile).then(fileContents => {

            expect(fileContents.entry[1].resource.extension[0].valueCoding).to.eql(expectedCoding)
        })
    })
})