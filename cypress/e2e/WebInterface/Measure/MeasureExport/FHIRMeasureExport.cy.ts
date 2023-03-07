import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

describe.skip('FHIR Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate the zip file Export for FHIR Measure', () => {

        MeasuresPage.measureAction('export')

        cy.readFile(path.join(downloadsFolder, 'ecqmTitle-v0.0.000-QI-Core v4.1.1.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'ecqmTitle-v0.0.000-QI-Core v4.1.1.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        // Verify all file types available in exported zip file
        cy.readFile(path.join(downloadsFolder, 'ecqmTitle-v0.0.000-QI-Core v4.1.1.zip')).should('contain', 'eCQMTitle-0.0.000-FHIR.html' && 'eCQMTitle-v0.0.000-QI-Core v4.1.1.xml' && 'eCQMTitle-v0.0.000-QI-Core v4.1.1.json')
        cy.log('Successfully verified file types in the Exported zip file')

    })
})