import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"

let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
let CqlLibraryName = 'TestLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let measureCQL = MeasureCQL.SBTEST_CQL

describe('QI-Core Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')
        OktaLogin.Login()

    })

    it('Validate the zip file Export is downloaded for QI-Core Measure', () => {

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.measureAction('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QI-Core Measure', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v1.0.000-FHIR4.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR.xml')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'cql/CQMCommon-1.0.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/FHIRCommon-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/FHIRHelpers-4.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/QICoreCommon-1.2.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/SupplementalDataElements-3.1.000.cql')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'cql/'+CqlLibraryName+'-1.0.000.cql')).should('exist')

        cy.readFile(path.join(downloadsFolder, 'resources/CQMCommon-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/CQMCommon-1.0.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRCommon-4.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRCommon-4.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRHelpers-4.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/FHIRHelpers-4.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/QICoreCommon-1.2.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/QICoreCommon-1.2.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/SupplementalDataElements-3.1.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/SupplementalDataElements-3.1.000.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/'+CqlLibraryName+'-1.0.000.json'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'resources/'+CqlLibraryName+'-1.0.000.xml')).should('exist')

    })

})


