import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import {CreateMeasureOptions, CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import {Header} from "../../../../Shared/Header";

const url = Cypress.config('baseUrl')
let qdmMeasureName = 'QDMTestMeasure' + Date.now()
let qdmCqlLibraryName = 'QDMLibrary' + Date.now()
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let qdmMeasureCQL = MeasureCQL.QDM_CQL_withDRC
let qdmCMSMeasureCQL = MeasureCQL.QDM_CQL_withLargeIncludedLibrary

const measureData: CreateMeasureOptions = {
    measureCql: qdmCMSMeasureCQL,
    ecqmTitle: qdmMeasureName,
    cqlLibraryName: qdmCqlLibraryName,
    measureScoring: 'Proportion',
    patientBasis: 'true',
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}

describe('Successful QDM Measure Export', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population',
            'Denominator Exclusions', '', 'Numerator', '', 'Denominator')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('export')
        cy.verifyDownload('eCQMTitle4QDM-v0.0.000-QDM.zip', {timeout: 5500})
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', {zipFile: 'eCQMTitle4QDM-v0.0.000-QDM.zip', path: downloadsFolder})
            .then(results => {
                cy.log('unzipFile Task finished')
            })


    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName)

    })

    it('Validate the contents of the Human Readable HTML file', () => {

        //remove the baseUrl so that we can visit a local file
        Cypress.config('baseUrl', null)

        // Load the HTML file
        cy.visit('./cypress/downloads/eCQMTitle4QDM-v0.0.000-QDM.html')

        // Scrub the HTML and verify the data we are looking for
        cy.document().then((doc) => {

            const bodyText = doc.body.innerText;

            //eCQM Title
            expect(bodyText).to.include('eCQM Title\t\n' + qdmMeasureName)

            //eCQM Version Number
            expect(bodyText).to.include('eCQM Version Number\tDraft based on 0.0.000')

            //Various meta data
            expect(bodyText).to.include('Measurement Period\tJanuary 1, 2026 through December 31, 2026')
            expect(bodyText).to.include('Measure Steward\tSemanticBits')
            expect(bodyText).to.include('Measure Developer\tAcademy of Nutrition and Dietetics')
            expect(bodyText).to.include('Endorsed By\tNone')
            expect(bodyText).to.include('Description\t\n' +
                'SemanticBits')
            expect(bodyText).to.include('Measure Scoring\tProportion')
            expect(bodyText).to.include('Measure Type\tProcess')
            expect(bodyText).to.include('Stratification\t\n' +
                'None')
            expect(bodyText).to.include('Initial Population\t\n' +
                'None')
            expect(bodyText).to.include('Denominator\t\n' +
                'None')
            expect(bodyText).to.include('Denominator Exclusions\t\n' +
                'None')
            expect(bodyText).to.include('Numerator\t\n' +
                'None')
            expect(bodyText).to.include('Numerator Exclusions\t\n' +
                'None')
            expect(bodyText).to.include('Denominator Exceptions\t\n' +
                'None')

            //Population Criteria
            //Initial Population
            expect(bodyText).to.include('Initial Population\n' +
                '  AgeInYearsAt(date from \n' +
                '    end of "Measurement Period"\n' +
                '  ) in Interval[16, 24]\n' +
                '    and exists ( ["Patient Characteristic Sex": "Female"] )\n' +
                '    and exists ( "Qualifying Encounters" )\n' +
                '    and ( ( "Has Assessments Identifying Sexual Activity" )\n' +
                '        or ( "Has Diagnoses Identifying Sexual Activity" )\n' +
                '        or ( "Has Active Contraceptive Medications" )\n' +
                '        or ( "Has Ordered Contraceptive Medications" )\n' +
                '        or ( "Has Laboratory Tests Identifying Sexual Activity" )\n' +
                '        or ( "Has Diagnostic Studies Identifying Sexual Activity" )\n' +
                '        or ( "Has Procedures Identifying Sexual Activity" )\n' +
                '    )')

            //Denominator
            expect(bodyText).to.include('Denominator\n' +
                '  "Initial Population"')

            //Denominator Exclusions
            expect(bodyText).to.include('Denominator Exclusions\n' +
                '  Hospice."Has Hospice Services"\n' +
                '    or ( ( "Has Pregnancy Test Exclusion" )\n' +
                '        and not ( "Has Assessments Identifying Sexual Activity" )\n' +
                '        and not ( "Has Diagnoses Identifying Sexual Activity" )\n' +
                '        and not ( "Has Active Contraceptive Medications" )\n' +
                '        and not ( "Has Ordered Contraceptive Medications" )\n' +
                '        and not ( "Has Laboratory Tests Identifying Sexual Activity But Not Pregnancy" )\n' +
                '        and not ( "Has Diagnostic Studies Identifying Sexual Activity" )\n' +
                '        and not ( "Has Procedures Identifying Sexual Activity" )\n' +
                '    )')

            //Denominator Exceptions
            expect(bodyText).to.include('Denominator Exceptions\n' +
                'None')

            //Numerator
            expect(bodyText).to.include('Numerator\n' +
                '  exists ( ["Laboratory Test, Performed": "Chlamydia Screening"] ChlamydiaTest\n' +
                '      where Global."LatestOf" ( ChlamydiaTest.relevantDatetime, ChlamydiaTest.relevantPeriod ) during day of "Measurement Period"\n' +
                '        and ChlamydiaTest.result is not null\n' +
                '  )')

            //Numerator Exclusions
            expect(bodyText).to.include('Numerator Exclusions\n' +
                'None')

            //Stratification
            expect(bodyText).to.include('Denominator\n' +
                '  "Initial Population"')

            //Definitions
            expect(bodyText).to.include('Denominator Exclusions\n' +
                '  Hospice."Has Hospice Services"\n' +
                '    or ( ( "Has Pregnancy Test Exclusion" )\n' +
                '        and not ( "Has Assessments Identifying Sexual Activity" )\n' +
                '        and not ( "Has Diagnoses Identifying Sexual Activity" )\n' +
                '        and not ( "Has Active Contraceptive Medications" )\n' +
                '        and not ( "Has Ordered Contraceptive Medications" )\n' +
                '        and not ( "Has Laboratory Tests Identifying Sexual Activity But Not Pregnancy" )\n' +
                '        and not ( "Has Diagnostic Studies Identifying Sexual Activity" )\n' +
                '        and not ( "Has Procedures Identifying Sexual Activity" )\n' +
                '    )')
            expect(bodyText).to.include('Has Active Contraceptive Medications\n' +
                '  exists ( ["Medication, Active": "Contraceptive Medications"] ActiveContraceptives\n' +
                '      where ActiveContraceptives.relevantPeriod overlaps "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Has Assessments Identifying Sexual Activity\n' +
                '  exists ( ["Assessment, Performed": "Have you ever had vaginal intercourse [PhenX]"] SexualActivityAssessment\n' +
                '      where SexualActivityAssessment.result ~ "Yes (qualifier value)"\n' +
                '        and Global."NormalizeInterval" ( SexualActivityAssessment.relevantDatetime, SexualActivityAssessment.relevantPeriod ) on or before end of "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Has Diagnoses Identifying Sexual Activity\n' +
                '  exists ( ( ["Diagnosis": "Diagnoses Used to Indicate Sexual Activity"]\n' +
                '      union ["Diagnosis": "HIV"]\n' +
                '      union ["Diagnosis": "Complications of Pregnancy, Childbirth and the Puerperium"] ) SexualActivityDiagnosis\n' +
                '      where SexualActivityDiagnosis.prevalencePeriod overlaps "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Has Diagnostic Studies Identifying Sexual Activity\n' +
                '  exists ( ["Diagnostic Study, Order": "Diagnostic Studies During Pregnancy"] SexualActivityDiagnostics\n' +
                '      where SexualActivityDiagnostics.authorDatetime during day of "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Has Laboratory Tests Identifying Sexual Activity\n' +
                '  exists ( ["Laboratory Test, Order": "Pregnancy Test"] PregnancyTest\n' +
                '      where PregnancyTest.authorDatetime during day of "Measurement Period"\n' +
                '  )\n' +
                '    or "Has Laboratory Tests Identifying Sexual Activity But Not Pregnancy"')
            expect(bodyText).to.include('Has Laboratory Tests Identifying Sexual Activity But Not Pregnancy\n' +
                '  exists ( ( ["Laboratory Test, Order": "Pap Test"]\n' +
                '      union ["Laboratory Test, Order": "Lab Tests During Pregnancy"]\n' +
                '      union ["Laboratory Test, Order": "Lab Tests for Sexually Transmitted Infections"] ) LabOrders\n' +
                '      where LabOrders.authorDatetime during day of "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Has Ordered Contraceptive Medications\n' +
                '  exists ( ["Medication, Order": "Contraceptive Medications"] OrderedContraceptives\n' +
                '      where OrderedContraceptives.authorDatetime during day of "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Has Pregnancy Test Exclusion\n' +
                '  exists ( ( ["Laboratory Test, Order": "Pregnancy Test"] PregnancyTest\n' +
                '        with ["Diagnostic Study, Order": "XRay Study"] XrayOrder\n' +
                '          such that XrayOrder.authorDatetime occurs 6 days or less on or after day of PregnancyTest.authorDatetime\n' +
                '        where PregnancyTest.authorDatetime during "Measurement Period"\n' +
                '    )\n' +
                '      union ( ["Laboratory Test, Order": "Pregnancy Test"] PregnancyTestOrder\n' +
                '          with ["Medication, Order": "Isotretinoin"] AccutaneOrder\n' +
                '            such that AccutaneOrder.authorDatetime occurs 6 days or less on or after day of PregnancyTestOrder.authorDatetime\n' +
                '          where PregnancyTestOrder.authorDatetime during "Measurement Period"\n' +
                '      )\n' +
                '  )')
            expect(bodyText).to.include('Has Procedures Identifying Sexual Activity\n' +
                '  exists ( ["Procedure, Performed": "Procedures Used to Indicate Sexual Activity"] ProceduresForSexualActivity\n' +
                '      where Global."NormalizeInterval" ( ProceduresForSexualActivity.relevantDatetime, ProceduresForSexualActivity.relevantPeriod ) during day of "Measurement Period"\n' +
                '  )')
            expect(bodyText).to.include('Hospice.Has Hospice Services\n' +
                '  exists ( ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
                '      where ( InpatientEncounter.dischargeDisposition ~ "Discharge to home for hospice care (procedure)"\n' +
                '          or InpatientEncounter.dischargeDisposition ~ "Discharge to healthcare facility for hospice care (procedure)"\n' +
                '      )\n' +
                '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
                '  )\n' +
                '    or exists ( ["Encounter, Performed": "Hospice Encounter"] HospiceEncounter\n' +
                '        where HospiceEncounter.relevantPeriod overlaps day of "Measurement Period"\n' +
                '    )\n' +
                '    or exists ( ["Assessment, Performed": "Hospice care [Minimum Data Set]"] HospiceAssessment\n' +
                '        where HospiceAssessment.result ~ "Yes (qualifier value)"\n' +
                '          and Global."NormalizeInterval" ( HospiceAssessment.relevantDatetime, HospiceAssessment.relevantPeriod ) overlaps day of "Measurement Period"\n' +
                '    )\n' +
                '    or exists ( ["Intervention, Order": "Hospice Care Ambulatory"] HospiceOrder\n' +
                '        where HospiceOrder.authorDatetime during day of "Measurement Period"\n' +
                '    )\n' +
                '    or exists ( ["Intervention, Performed": "Hospice Care Ambulatory"] HospicePerformed\n' +
                '        where Global."NormalizeInterval" ( HospicePerformed.relevantDatetime, HospicePerformed.relevantPeriod ) overlaps day of "Measurement Period"\n' +
                '    )\n' +
                '  or exists ( ["Diagnosis": "Hospice Diagnosis"] HospiceCareDiagnosis\n' +
                '        where HospiceCareDiagnosis.prevalencePeriod overlaps day of "Measurement Period"\n' +
                '    )')
            expect(bodyText).to.include('Initial Population\n' +
                '  AgeInYearsAt(date from \n' +
                '    end of "Measurement Period"\n' +
                '  ) in Interval[16, 24]\n' +
                '    and exists ( ["Patient Characteristic Sex": "Female"] )\n' +
                '    and exists ( "Qualifying Encounters" )\n' +
                '    and ( ( "Has Assessments Identifying Sexual Activity" )\n' +
                '        or ( "Has Diagnoses Identifying Sexual Activity" )\n' +
                '        or ( "Has Active Contraceptive Medications" )\n' +
                '        or ( "Has Ordered Contraceptive Medications" )\n' +
                '        or ( "Has Laboratory Tests Identifying Sexual Activity" )\n' +
                '        or ( "Has Diagnostic Studies Identifying Sexual Activity" )\n' +
                '        or ( "Has Procedures Identifying Sexual Activity" )\n' +
                '    )')
            expect(bodyText).to.include('Numerator\n' +
                '  exists ( ["Laboratory Test, Performed": "Chlamydia Screening"] ChlamydiaTest\n' +
                '      where Global."LatestOf" ( ChlamydiaTest.relevantDatetime, ChlamydiaTest.relevantPeriod ) during day of "Measurement Period"\n' +
                '        and ChlamydiaTest.result is not null\n' +
                '  )')
            expect(bodyText).to.include('Qualifying Encounters\n' +
                '  ( ( ["Encounter, Performed": "Office Visit"]\n' +
                '      union ["Encounter, Performed": "Preventive Care Services Established Office Visit, 18 and Up"]\n' +
                '      union ["Encounter, Performed": "Preventive Care Services Initial Office Visit, 18 and Up"]\n' +
                '      union ["Encounter, Performed": "Preventive Care Services, Initial Office Visit, 0 to 17"]\n' +
                '      union ["Encounter, Performed": "Preventive Care, Established Office Visit, 0 to 17"]\n' +
                '      union ["Encounter, Performed": "Home Healthcare Services"]\n' +
                '      union ["Encounter, Performed": "Telephone Visits"]\n' +
                '      union ["Encounter, Performed": "Virtual Encounter"] ) ValidEncounters\n' +
                '      where ValidEncounters.relevantPeriod during day of "Measurement Period"\n' +
                '  )')

            //Functions
            expect(bodyText).to.include('Global.HasEnd(period Interval<DateTime>)\n' +
                '  not ( \n' +
                '    end of period is null\n' +
                '      or \n' +
                '      end of period = maximum DateTime\n' +
                '  )')
            expect(bodyText).to.include('Global.Latest(period Interval<DateTime>)\n' +
                '  if ( HasEnd(period)) then \n' +
                '  end of period \n' +
                '    else start of period')
            expect(bodyText).to.include('\n' +
                'Global.LatestOf(pointInTime DateTime, period Interval<DateTime>)\n' +
                '  Latest(NormalizeInterval(pointInTime, period))')
            expect(bodyText).to.include('Global.NormalizeInterval(pointInTime DateTime, period Interval<DateTime>)\n' +
                '  if pointInTime is not null then Interval[pointInTime, pointInTime]\n' +
                '    else if period is not null then period \n' +
                '    else null as Interval<DateTime>')

            //Terminology
            expect(bodyText).to.include('code "Discharge to healthcare facility for hospice care (procedure)" ("SNOMEDCT Code (428371000124100)")\n' +
                'code "Discharge to home for hospice care (procedure)" ("SNOMEDCT Code (428361000124107)")\n' +
                'code "Female" ("AdministrativeGender Code (F)")\n' +
                'code "Have you ever had vaginal intercourse [PhenX]" ("LOINC Code (64728-9)")\n' +
                'code "Hospice care [Minimum Data Set]" ("LOINC Code (45755-6)")\n' +
                'code "Yes (qualifier value)" ("SNOMEDCT Code (373066001)")\n' +
                'valueset "Chlamydia Screening" (2.16.840.1.113883.3.464.1003.110.12.1052)\n' +
                'valueset "Complications of Pregnancy, Childbirth and the Puerperium" (2.16.840.1.113883.3.464.1003.111.12.1012)\n' +
                'valueset "Contraceptive Medications" (2.16.840.1.113883.3.464.1003.196.12.1080)\n' +
                'valueset "Diagnoses Used to Indicate Sexual Activity" (2.16.840.1.113883.3.464.1003.111.12.1018)\n' +
                'valueset "Diagnostic Studies During Pregnancy" (2.16.840.1.113883.3.464.1003.111.12.1008)\n' +
                'valueset "Encounter Inpatient" (2.16.840.1.113883.3.666.5.307)\n' +
                'valueset "HIV" (2.16.840.1.113883.3.464.1003.120.12.1003)\n' +
                'valueset "Home Healthcare Services" (2.16.840.1.113883.3.464.1003.101.12.1016)\n' +
                'valueset "Hospice Care Ambulatory" (2.16.840.1.113883.3.526.3.1584)\n' +
                'valueset "Hospice Diagnosis" (2.16.840.1.113883.3.464.1003.1165)\n' +
                'valueset "Hospice Encounter" (2.16.840.1.113883.3.464.1003.1003)\n' +
                'valueset "Isotretinoin" (2.16.840.1.113883.3.464.1003.196.12.1143)\n' +
                'valueset "Lab Tests During Pregnancy" (2.16.840.1.113883.3.464.1003.111.12.1007)\n' +
                'valueset "Lab Tests for Sexually Transmitted Infections" (2.16.840.1.113883.3.464.1003.110.12.1051)\n' +
                'valueset "Office Visit" (2.16.840.1.113883.3.464.1003.101.12.1001)\n' +
                'valueset "Pap Test" (2.16.840.1.113883.3.464.1003.108.12.1017)\n' +
                'valueset "Pregnancy Test" (2.16.840.1.113883.3.464.1003.111.12.1011)\n' +
                'valueset "Preventive Care Services Established Office Visit, 18 and Up" (2.16.840.1.113883.3.464.1003.101.12.1025)\n' +
                'valueset "Preventive Care Services Initial Office Visit, 18 and Up" (2.16.840.1.113883.3.464.1003.101.12.1023)\n' +
                'valueset "Preventive Care Services, Initial Office Visit, 0 to 17" (2.16.840.1.113883.3.464.1003.101.12.1022)\n' +
                'valueset "Preventive Care, Established Office Visit, 0 to 17" (2.16.840.1.113883.3.464.1003.101.12.1024)\n' +
                'valueset "Procedures Used to Indicate Sexual Activity" (2.16.840.1.113883.3.464.1003.111.12.1017)\n' +
                'valueset "Telephone Visits" (2.16.840.1.113883.3.464.1003.101.12.1080)\n' +
                'valueset "Virtual Encounter" (2.16.840.1.113883.3.464.1003.101.12.1089)\n' +
                'valueset "XRay Study" (2.16.840.1.113883.3.464.1003.198.12.1034)')

            //Data Criteria (QDM Data Elements)
            expect(bodyText).to.include('"Assessment, Performed: Have you ever had vaginal intercourse [PhenX]" using "Have you ever had vaginal intercourse [PhenX] (LOINC Code 64728-9)"\n' +
                '"Assessment, Performed: Hospice care [Minimum Data Set]" using "Hospice care [Minimum Data Set] (LOINC Code 45755-6)"\n' +
                '"Diagnosis: Complications of Pregnancy, Childbirth and the Puerperium" using "Complications of Pregnancy, Childbirth and the Puerperium (2.16.840.1.113883.3.464.1003.111.12.1012)"\n' +
                '"Diagnosis: Diagnoses Used to Indicate Sexual Activity" using "Diagnoses Used to Indicate Sexual Activity (2.16.840.1.113883.3.464.1003.111.12.1018)"\n' +
                '"Diagnosis: HIV" using "HIV (2.16.840.1.113883.3.464.1003.120.12.1003)"\n' +
                '"Diagnosis: Hospice Diagnosis" using "Hospice Diagnosis (2.16.840.1.113883.3.464.1003.1165)"\n' +
                '"Diagnostic Study, Order: Diagnostic Studies During Pregnancy" using "Diagnostic Studies During Pregnancy (2.16.840.1.113883.3.464.1003.111.12.1008)"\n' +
                '"Diagnostic Study, Order: XRay Study" using "XRay Study (2.16.840.1.113883.3.464.1003.198.12.1034)"\n' +
                '"Encounter, Performed: Encounter Inpatient" using "Encounter Inpatient (2.16.840.1.113883.3.666.5.307)"\n' +
                '"Encounter, Performed: Home Healthcare Services" using "Home Healthcare Services (2.16.840.1.113883.3.464.1003.101.12.1016)"\n' +
                '"Encounter, Performed: Hospice Encounter" using "Hospice Encounter (2.16.840.1.113883.3.464.1003.1003)"\n' +
                '"Encounter, Performed: Office Visit" using "Office Visit (2.16.840.1.113883.3.464.1003.101.12.1001)"\n' +
                '"Encounter, Performed: Preventive Care Services Established Office Visit, 18 and Up" using "Preventive Care Services Established Office Visit, 18 and Up (2.16.840.1.113883.3.464.1003.101.12.1025)"\n' +
                '"Encounter, Performed: Preventive Care Services Initial Office Visit, 18 and Up" using "Preventive Care Services Initial Office Visit, 18 and Up (2.16.840.1.113883.3.464.1003.101.12.1023)"\n' +
                '"Encounter, Performed: Preventive Care Services, Initial Office Visit, 0 to 17" using "Preventive Care Services, Initial Office Visit, 0 to 17 (2.16.840.1.113883.3.464.1003.101.12.1022)"\n' +
                '"Encounter, Performed: Preventive Care, Established Office Visit, 0 to 17" using "Preventive Care, Established Office Visit, 0 to 17 (2.16.840.1.113883.3.464.1003.101.12.1024)"\n' +
                '"Encounter, Performed: Telephone Visits" using "Telephone Visits (2.16.840.1.113883.3.464.1003.101.12.1080)"\n' +
                '"Encounter, Performed: Virtual Encounter" using "Virtual Encounter (2.16.840.1.113883.3.464.1003.101.12.1089)"\n' +
                '"Intervention, Order: Hospice Care Ambulatory" using "Hospice Care Ambulatory (2.16.840.1.113883.3.526.3.1584)"\n' +
                '"Intervention, Performed: Hospice Care Ambulatory" using "Hospice Care Ambulatory (2.16.840.1.113883.3.526.3.1584)"\n' +
                '"Laboratory Test, Order: Lab Tests During Pregnancy" using "Lab Tests During Pregnancy (2.16.840.1.113883.3.464.1003.111.12.1007)"\n' +
                '"Laboratory Test, Order: Lab Tests for Sexually Transmitted Infections" using "Lab Tests for Sexually Transmitted Infections (2.16.840.1.113883.3.464.1003.110.12.1051)"\n' +
                '"Laboratory Test, Order: Pap Test" using "Pap Test (2.16.840.1.113883.3.464.1003.108.12.1017)"\n' +
                '"Laboratory Test, Order: Pregnancy Test" using "Pregnancy Test (2.16.840.1.113883.3.464.1003.111.12.1011)"\n' +
                '"Laboratory Test, Performed: Chlamydia Screening" using "Chlamydia Screening (2.16.840.1.113883.3.464.1003.110.12.1052)"\n' +
                '"Medication, Active: Contraceptive Medications" using "Contraceptive Medications (2.16.840.1.113883.3.464.1003.196.12.1080)"\n' +
                '"Medication, Order: Contraceptive Medications" using "Contraceptive Medications (2.16.840.1.113883.3.464.1003.196.12.1080)"\n' +
                '"Medication, Order: Isotretinoin" using "Isotretinoin (2.16.840.1.113883.3.464.1003.196.12.1143)"\n' +
                '"Patient Characteristic Sex: Female" using "Female (AdministrativeGender Code F)"\n' +
                '"Procedure, Performed: Procedures Used to Indicate Sexual Activity" using "Procedures Used to Indicate Sexual Activity (2.16.840.1.113883.3.464.1003.111.12.1017)"')
        })
    })
})

describe('QDM Measure Export for CMS Measure with huge included Library', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {
        Cypress.config('baseUrl', url)

        measureData.cqlLibraryName = qdmCqlLibraryName+'2'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmCMSMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false,
            'Qualifying Encounters', 'Denominator Exclusions', '',
            'Encounter without Food Screening', '', 'Qualifying Encounters')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        cy.get(Header.mainMadiePageButton).click()
    })

    after('Clean up and Logout', () => {

        Utilities.deleteMeasure(qdmMeasureName, qdmCqlLibraryName+'2')

        OktaLogin.Logout()
    })

    it('Validate the zip file Export is downloaded for QDM Measure', () => {

        MeasuresPage.actionCenter('edit')

        // check for MAT-7961 - trim whitespace for export files
        cy.get(EditMeasurePage.abbreviatedTitleTextBox).invoke('val').then(value => {
            const whitespaceAddedName = '   ' + value + '   '
            cy.get(EditMeasurePage.abbreviatedTitleTextBox)
                .clear()
                .type(whitespaceAddedName)
        })

        cy.get(EditMeasurePage.measurementInformationSaveButton).click()

        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('exist')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('be.visible')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('contain.text', 'Measurement Information Updated Successfully')

        EditMeasurePage.actionCenter(EditMeasureActions.export)

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')
    })
})


