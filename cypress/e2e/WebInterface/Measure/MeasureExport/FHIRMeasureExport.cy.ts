import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')

describe.skip('FHIR Measure Export', () => {

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate the zip file Export for FHIR Measure', () => {

        MeasuresPage.exportMeasure()

        cy.readFile(path.join(downloadsFolder, 'ecqmTitle-v0.0.000-QI-Core v4.1.1.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'ecqmTitle-v0.0.000-QI-Core v4.1.1.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
    })
})