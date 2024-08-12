import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"

let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
let qdmCMSMeasureCQL = 'library CMS1192 version \'1.1.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
    'include SDOH version \'3.0.000\' called SDOH\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Patient Expired": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.309\'\n' +
    'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer Type"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    '\n' +
    'define "Qualifying Encounters":\n' +
    '  SDOH."Qualifying Encounters"\n' +
    '\n' +
    'define "Encounter without Food Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Food Insecurity Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Food Insecurity Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Housing Instability Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Housing Instability Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Housing Instability Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Interpersonal Safety Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Interpersonal Safety Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Interpersonal Safety Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Transportation Needs Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Transportation Needs Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Transportation Needs Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Utility Difficulties Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Utility Difficulties Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Utility Difficulties Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Denominator Exclusions":\n' +
    '  SDOH."Qualifying Encounters" QualifyingEncounter\n' +
    '    where QualifyingEncounter.dischargeDisposition in "Patient Expired"'

describe('Successful QDM Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()

    })

    afterEach('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)

        OktaLogin.Logout()
    })

    it('Validate the zip file Export is downloaded for QDM Measure', () => {

        MeasuresPage.measureAction('qdmexport')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

    })
})

describe('QDM Measure Export for CMS Measure with huge included Library', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create New Measure and Login', () => {

        //Create Measure and Measure group
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasureName, qdmCqlLibraryName, 'Proportion', false, qdmCMSMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Denominator Exclusions', '', 'Encounter without Food Screening', '', 'Qualifying Encounters')
        OktaLogin.Login()

    })

    afterEach('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)

        OktaLogin.Logout()
    })

    it('Validate the zip file Export is downloaded for QDM Measure', () => {

        MeasuresPage.measureAction('qdmexport')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

    })
})


