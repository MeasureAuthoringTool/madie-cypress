import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {Utilities} from "../../../../Shared/Utilities"

let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun

describe('Successful QDM Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Validate the zip file Export is downloaded for QDM Measure', () => {

        MeasuresPage.measureAction('qdmexport')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QDM Measure', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-QDM.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/MATGlobalCommonFunctionsQDM-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/MATGlobalCommonFunctionsQDM-1.0.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.xml')).should('exist')

    })

})

describe('QDM Measure Export, Not the Owner', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.AltLogin()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)
    })


    it('Non Measure owner able to Export QDM Measure', () => {

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.measureAction('qdmexport')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM.zip'), {timeout: 500000}).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

        OktaLogin.UILogout()

    })
})
