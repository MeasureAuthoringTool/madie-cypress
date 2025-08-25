import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Utilities } from "../../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const measureCQL = MeasureCQL.zipfileExportQICore
const expectedFileName = 'eCQMTitle4QICore-v0.0.000-FHIR4.zip'

describe('FHIR Measure Export, Not the Owner', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 16500)
        OktaLogin.UILogout()

        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
    })

    it('Validate the zip file Export is downloaded for FHIR Measure', () => {

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        MeasuresPage.actionCenter('export')

        cy.readFile(path.join(downloadsFolder, expectedFileName), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
    })

    it('Unzip the downloaded file and verify file types for FHIR Measure', () => {

        cy.verifyDownload(expectedFileName)

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: expectedFileName, path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        // Verify files exist after unzip
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR.html')
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR.xml')
        cy.verifyDownload('eCQMTitle4QICore-v0.0.000-FHIR.json')
    })
})

