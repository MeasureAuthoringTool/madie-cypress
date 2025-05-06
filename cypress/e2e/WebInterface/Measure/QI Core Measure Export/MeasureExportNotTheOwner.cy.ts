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

let measureCQL = MeasureCQL.zipfileExportQICore

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
        OktaLogin.Logout()

        OktaLogin.AltLogin()
    })

    it('Validate the zip file Export is downloaded for FHIR Measure', () => {

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for FHIR Measure', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4.zip'))
            .should('contain', 'eCQMTitle4QICore-v0.0.000-FHIR.html')
            .and('contain', 'eCQMTitle4QICore-v0.0.000-FHIR.xml')
            .and('contain', 'eCQMTitle4QICore-v0.0.000-FHIR.json')
    })
})

