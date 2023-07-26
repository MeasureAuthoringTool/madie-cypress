import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage";

let measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let measureCQL = 'library HospitalHarmHyperglycemiainHospitalizedPatients version \'3.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\' \n' +
    'valueset "Diabetes": \'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Glucose Lab Test Mass Per Volume": \'urn:oid:2.16.840.1.113762.1.4.1248.34\' \n' +
    'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\' \n' +
    'valueset "Ketoacidosis": \'urn:oid:2.16.840.1.113762.1.4.1222.520\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Days in Hospitalization":\n' +
    '  "Measurement Population" EligibleInpatientHospitalization\n' +
    '    let period: Global."HospitalizationWithObservation" ( EligibleInpatientHospitalization ),\n' +
    '    relevantPeriod: "Hospital Days Max 10"(period)\n' +
    '    return Tuple {\n' +
    '      encounter: EligibleInpatientHospitalization,\n' +
    '      hospitalizationPeriod: period,\n' +
    '      relevantPeriod: relevantPeriod,\n' +
    '      relevantDays: "Days In Period"(relevantPeriod)\n' +
    '    }\n' +
    '\n' +
    'define "Days with Glucose Results":\n' +
    '  "Days in Hospitalization" InpatientHospitalDays\n' +
    '    return Tuple {\n' +
    '      encounter: InpatientHospitalDays.encounter,\n' +
    '      relevantPeriod: InpatientHospitalDays.relevantPeriod,\n' +
    '      relevantDays: ( InpatientHospitalDays.relevantDays EncounterDay\n' +
    '          return Tuple {\n' +
    '            dayNumber: EncounterDay.dayNumber,\n' +
    '            dayPeriod: EncounterDay.dayPeriod,\n' +
    '            hasSevereResult: exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
    '                where GlucoseTest.result > 300 \'mg/dL\'\n' +
    '                  and Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
    '            ),\n' +
    '            hasElevatedResult: exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
    '                where GlucoseTest.result >= 200 \'mg/dL\'\n' +
    '                  and Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
    '            ),\n' +
    '            hasNoGlucoseTest: not exists ( ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
    '                where Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during EncounterDay.dayPeriod\n' +
    '            )\n' +
    '          }\n' +
    '      )\n' +
    '    }\n' +
    '\n' +
    'define "Days with Hyperglycemic Events":\n' +
    '  "Days with Glucose Results" EncounterWithResultDays\n' +
    '    let eligibleEventDays: EncounterWithResultDays.relevantDays EncounterDay\n' +
    '      where EncounterDay.dayNumber > 1\n' +
    '      return Tuple {\n' +
    '        dayNumber: EncounterDay.dayNumber,\n' +
    '        dayPeriod: EncounterDay.dayPeriod,\n' +
    '        hasHyperglycemicEvent: ( EncounterDay.hasSevereResult\n' +
    '            or ( EncounterDay.hasNoGlucoseTest\n' +
    '                and EncounterWithResultDays.relevantDays[EncounterDay.dayNumber - 2].hasElevatedResult\n' +
    '                and EncounterWithResultDays.relevantDays[EncounterDay.dayNumber - 3].hasElevatedResult\n' +
    '            )\n' +
    '        )\n' +
    '      }\n' +
    '    return Tuple {\n' +
    '      encounter: EncounterWithResultDays.encounter,\n' +
    '      relevantPeriod: EncounterWithResultDays.relevantPeriod,\n' +
    '      eligibleEventDays: eligibleEventDays\n' +
    '    }\n' +
    '\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Denominator Exclusions":\n' +
    '  "Encounter with First Glucose Greater Than or Equal to 1000"\n' +
    '\n' +
    'define "Encounter with Elevated Glucose Greater Than or Equal to 200":\n' +
    '  "Encounter with Hospitalization Period" Hospitalization\n' +
    '    with ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
    '      such that Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ) during Hospitalization.hospitalizationPeriod\n' +
    '        and GlucoseTest.result >= 200 \'mg/dL\'\n' +
    '    return Hospitalization.encounter\n' +
    '\n' +
    'define "Encounter with Existing Diabetes Diagnosis":\n' +
    '  "Encounter with Hospitalization Period" Hospitalization\n' +
    '    with ["Diagnosis": "Diabetes"] DiabetesCondition\n' +
    '      such that DiabetesCondition.prevalencePeriod starts before \n' +
    '      end of Hospitalization.hospitalizationPeriod\n' +
    '    return Hospitalization.encounter\n' +
    '\n' +
    'define "Encounter with Hospitalization Period":\n' +
    '  "Qualifying Encounter" QualifyingHospitalization\n' +
    '    return Tuple {\n' +
    '      encounter: QualifyingHospitalization,\n' +
    '      hospitalizationPeriod: Global."HospitalizationWithObservation" ( QualifyingHospitalization )\n' +
    '    }\n' +
    '\n' +
    'define "Encounter with Hyperglycemic Events":\n' +
    '  "Days with Hyperglycemic Events" HyperglycemicEventDays\n' +
    '    where exists ( HyperglycemicEventDays.eligibleEventDays EligibleEventDay\n' +
    '        where EligibleEventDay.hasHyperglycemicEvent\n' +
    '    )\n' +
    '    return HyperglycemicEventDays.encounter\n' +
    '\n' +
    'define "Encounter with Hypoglycemic Medication":\n' +
    '  "Encounter with Hospitalization Period" Hospitalization\n' +
    '    with ["Medication, Administered": "Hypoglycemics Treatment Medications"] HypoglycemicMedication\n' +
    '      such that Global."NormalizeInterval" ( HypoglycemicMedication.relevantDatetime, HypoglycemicMedication.relevantPeriod ) starts during Hospitalization.hospitalizationPeriod\n' +
    '    return Hospitalization.encounter\n' +
    '\n' +
    'define "Initial Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
    '  "Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start" GlucoseResult1000\n' +
    '    where not ( GlucoseResult1000.id in "Glucose Tests Earlier Than Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start".id )\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Encounter with Existing Diabetes Diagnosis"\n' +
    '    union "Encounter with Hypoglycemic Medication"\n' +
    '    union "Encounter with Elevated Glucose Greater Than or Equal to 200"\n' +
    '\n' +
    'define "Measurement Population":\n' +
    '  "Denominator"\n' +
    '\n' +
    'define "Numerator":\n' +
    '  "Encounter with Hyperglycemic Events"\n' +
    '\n' +
    'define "Qualifying Encounter":\n' +
    '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
    '    where InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
    '      and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 18\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    '\n' +
    'define "Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
    '  from\n' +
    '    "Initial Population" InpatientHospitalization,\n' +
    '    ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
    '    let HospitalizationInterval: Global."HospitalizationWithObservation" ( InpatientHospitalization ),\n' +
    '    GlucoseTestTime: Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod )\n' +
    '    where GlucoseTest.result >= 1000 \'mg/dL\'\n' +
    '      and GlucoseTest.result is not null\n' +
    '      and GlucoseTestTime during Interval[( start of HospitalizationInterval - 1 hour ), ( start of HospitalizationInterval + 6 hours )]\n' +
    '    return GlucoseTest\n' +
    '\n' +
    'define "Encounter with First Glucose Greater Than or Equal to 1000":\n' +
    '  "Initial Population" InpatientHospitalization\n' +
    '    with "Initial Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start" FirstGlucoseResult\n' +
    '      such that FirstGlucoseResult.result is not null\n' +
    '        and FirstGlucoseResult.result >= 1000 \'mg/dL\'\n' +
    '        and Global."EarliestOf" ( FirstGlucoseResult.relevantDatetime, FirstGlucoseResult.relevantPeriod ) during Interval[( start of Global."HospitalizationWithObservation" ( InpatientHospitalization ) - 1 hour ), ( start of Global."HospitalizationWithObservation" ( InpatientHospitalization ) + 6 hours )]\n' +
    '    return InpatientHospitalization\n' +
    '\n' +
    'define "Glucose Tests Earlier Than Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
    '  from\n' +
    '    "Initial Population" InpatientHospitalization,\n' +
    '    "Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start" GlucoseResult1000,\n' +
    '    ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] EarlierGlucoseTest\n' +
    '    let HospitalizationInterval: Global."HospitalizationWithObservation" ( InpatientHospitalization ),\n' +
    '    GlucoseTest1000Time: Global."EarliestOf" ( GlucoseResult1000.relevantDatetime, GlucoseResult1000.relevantPeriod ),\n' +
    '    EarlierGlucoseTestTime: Global."EarliestOf" ( EarlierGlucoseTest.relevantDatetime, EarlierGlucoseTest.relevantPeriod )\n' +
    '    where GlucoseTest1000Time during Interval[( start of HospitalizationInterval - 1 hour ), ( start of HospitalizationInterval + 6 hour )]\n' +
    '      and EarlierGlucoseTestTime during Interval[( start of HospitalizationInterval - 1 hour ), GlucoseTest1000Time )\n' +
    '      and EarlierGlucoseTest is not null\n' +
    '      and EarlierGlucoseTest.id !~ GlucoseResult1000.id\n' +
    '    return GlucoseResult1000\n' +
    '\n' +
    'define function "Interval To Day Numbers"(Period Interval<DateTime> ):\n' +
    '  ( expand { Interval[1, days between start of Period and \n' +
    '  end of Period]} ) DayExpand\n' +
    '    return \n' +
    '    end of DayExpand\n' +
    '\n' +
    'define function "Hospital Days Max 10"(Period Interval<DateTime> ):\n' +
    '  Interval[start of Period, Min({ \n' +
    '    end of Period, start of Period + 10 days }\n' +
    '  )]\n' +
    '\n' +
    'define function "Days In Period"(Period Interval<DateTime> ):\n' +
    '  ( "Interval To Day Numbers"(Period)) DayNumber\n' +
    '    let startPeriod: start of Period + ( 24 hours * ( DayNumber - 1 ) ),\n' +
    '    endPeriod: if ( hours between startPeriod and \n' +
    '      end of Period < 24\n' +
    '    ) then startPeriod \n' +
    '      else start of Period + ( 24 hours * DayNumber )\n' +
    '    return Tuple {\n' +
    '      dayNumber: DayNumber,\n' +
    '      dayPeriod: Interval[startPeriod, endPeriod )\n' +
    '    }\n' +
    '\n' +
    'define function "Denominator Observations"(QualifyingEncounter "Encounter, Performed" ):\n' +
    '  if QualifyingEncounter.id in "Denominator Exclusions".id then singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
    '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
    '      return 0\n' +
    '  ) \n' +
    '    else singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
    '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
    '      return Count(EncounterWithEventDays.eligibleEventDays)\n' +
    '  )\n' +
    '\n' +
    'define function "Numerator Observations"(QualifyingEncounter "Encounter, Performed" ):\n' +
    '  if QualifyingEncounter.id in "Denominator Exclusions".id then singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
    '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
    '      return 0\n' +
    '  ) \n' +
    '    else singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
    '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
    '      return Count(EncounterWithEventDays.eligibleEventDays EligibleEventDay\n' +
    '          where EligibleEventDay.hasHyperglycemicEvent\n' +
    '      )\n' +
    '  )\n' +
    '\n'

describe('Measure Creation: Ratio ListQDMPositiveEncounterPerformed with MO', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2023-01-01', '2024-01-01')

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End Ratio ListQDMPositiveEncounterPerformed with MO', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')


        //commenting group creation out until defect MAT-5973 is fixed

        //Group Creation

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Denominator Observations')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')

        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()

        cy.get(MeasureGroupPage.numeratorObservation).should('exist')
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'Numerator Observations')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Sum')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')
    })
})
