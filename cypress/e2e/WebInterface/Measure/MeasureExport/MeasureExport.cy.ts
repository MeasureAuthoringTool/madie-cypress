import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"

let measureNameTimeStamp = 'TestMeasure' + Date.now()
let measureName = measureNameTimeStamp
let CqlLibraryName = 'TestLibrary' + Date.now()
let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun

let measureCQL = 'library TestLibrary1678378360032 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'3.1.000\' called SDE\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon \n' +
    'include FHIRCommon version \'4.1.000\' called FHIRCommon\n' +
    '\n' +
    '\n' +
    'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'  \n' +
    '\n' +
    '\n' +
    '\n' +
    'valueset "Care Services in Long-Term Residential Facility": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1014\' \n' +
    'valueset "Diabetic Retinopathy": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.327\' \n' +
    'valueset "Level of Severity of Retinopathy Findings": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1283\' \n' +
    'valueset "Macular Edema Findings Present": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1320\' \n' +
    'valueset "Macular Exam": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1251\' \n' +
    'valueset "Medical Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1007\' \n' +
    'valueset "Nursing Facility Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1012\' \n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\' \n' +
    'valueset "Ophthalmological Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1285\' \n' +
    'valueset "Patient Reason": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.1008\' \n' +
    '\n' +
    'code "Healthcare professional (occupation)": \'223366009\' from "SNOMEDCT" display \'Healthcare professional (occupation)\'\n' +
    'code "Medical practitioner (occupation)": \'158965000\' from "SNOMEDCT" display \'Medical practitioner (occupation)\'\n' +
    'code "Ophthalmologist (occupation)": \'422234006\' from "SNOMEDCT" display \'Ophthalmologist (occupation)\'\n' +
    'code "Optometrist (occupation)": \'28229004\' from "SNOMEDCT" display \'Optometrist (occupation)\'\n' +
    'code "Physician (occupation)": \'309343006\' from "SNOMEDCT" display \'Physician (occupation)\'\n' +
    'code "virtual": \'VR\' from "ActCode" display \'virtual\'\n' +
    'code "Macular edema absent (situation)": \'428341000124108\' from "SNOMEDCT" display \'Macular edema absent (situation)\'\n' +
    'code "AMB" : \'AMB\' from "ActCode" display \'Ambulatory\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  SDE."SDE Ethnicity"\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  SDE."SDE Payer"\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  SDE."SDE Race"\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  SDE."SDE Sex"\n' +
    '\n' +
    '\n' +
    '\n' +
    'define "Initial Population":\n' +
    'true\n' +
    '\n' +
    'define "Num":\n' +
    'true\n' +
    '\n' +
    'define "Denom":\n' +
    'true'

describe('QI-Core Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        //create Measure Group
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population',
            'Num', 'Denom', 'boolean')
        OktaLogin.Login()

    })

    it('Validate the zip file Export is downloaded for QI-Core Measure', () => {

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionMajor).should('exist')
        cy.get(MeasuresPage.measureVersionMajor).click()

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
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip')).should('contain', 'eCQMTitle-v1.0.000-FHIR.html' &&
            'eCQMTitle-v1.0.000-FHIR.xml' && 'eCQMTitle-v1.0.000-FHIR.json')

        // cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip')).should('contain', 'eCQMTitle-v1.0.000-FHIR.html' &&
        //     'eCQMTitle-v1.0.000-FHIR.xml' && 'eCQMTitle-v1.0.000-FHIR.json' && 'FHIRHelpers-4.1.000.cql' && 'CQMCommon-1.0.000.cql' && 'FHIRCommon-4.1.000.cql'
        //     && 'QICoreCommon-1.2.000.cql' && 'SupplementalDataElements-3.1.000.cql' && measureName+'-1.0.000.cql' && 'CQMCommon-1.0.000.xml'
        //     && 'CQMCommon-1.0.000.json' && 'FHIRCommon-4.1.000.xml' && 'FHIRCommon-4.1.000.json' && 'FHIRHelpers-4.1.000.xml' && 'FHIRHelpers-4.1.000.json'
        //     && 'QICoreCommon-1.2.000.xml' && 'QICoreCommon-1.2.000.json' && 'SupplementalDataElements-3.1.000.xml' && 'SupplementalDataElements-3.1.000.json'
        //     && measureName+'-1.0.000.xml' && measureName+'-1.0.000.json')

    })

})

//Skipping until the feature flag for QDM Measure Export is removed
describe.skip('QDM Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()

    })

    it('Validate the zip file Export is downloaded for QDM Measure', () => {

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionMajor).should('exist')
        cy.get(MeasuresPage.measureVersionMajor).click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        MeasuresPage.measureAction('qdmexport')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-QDM5.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        OktaLogin.Logout()
    })

    it('Unzip the downloaded file and verify file types for QDM Measure', () => {

        // unzipping the Measure Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v1.0.000-QDM5.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-QDM5.zip')).should('contain', 'MATGlobalCommonFunctionsQDM-1.0.000.json' &&
            'MATGlobalCommonFunctionsQDM-1.0.000.xml' && 'RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.json' && 'RatioListQDMPositiveEncounterPerformedWithMO1697030589521-0.0.000.xml')

        // cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v1.0.000-FHIR4.zip')).should('contain', 'eCQMTitle-v1.0.000-FHIR.html' &&
        //     'eCQMTitle-v1.0.000-FHIR.xml' && 'eCQMTitle-v1.0.000-FHIR.json' && 'FHIRHelpers-4.1.000.cql' && 'CQMCommon-1.0.000.cql' && 'FHIRCommon-4.1.000.cql'
        //     && 'QICoreCommon-1.2.000.cql' && 'SupplementalDataElements-3.1.000.cql' && measureName+'-1.0.000.cql' && 'CQMCommon-1.0.000.xml'
        //     && 'CQMCommon-1.0.000.json' && 'FHIRCommon-4.1.000.xml' && 'FHIRCommon-4.1.000.json' && 'FHIRHelpers-4.1.000.xml' && 'FHIRHelpers-4.1.000.json'
        //     && 'QICoreCommon-1.2.000.xml' && 'QICoreCommon-1.2.000.json' && 'SupplementalDataElements-3.1.000.xml' && 'SupplementalDataElements-3.1.000.json'
        //     && measureName+'-1.0.000.xml' && measureName+'-1.0.000.json')

    })

})

