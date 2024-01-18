import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"

let measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let firstTestCaseTitle = '3Encounters1Exclusion'
let testCaseDescription = 'DENEXPass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = '2EncBothGlucose1000inAndoutsideOfTimeframe'
let measureCQL = 'library RatioListQDMPositiveEncounterPerformedWithMO1701801315767 version \'0.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\' \n' +
    'valueset "Comfort Measures": \'urn:oid:1.3.6.1.4.1.33895.1.3.0.45\' \n' +
    'valueset "Diabetes": \'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001\' \n' +
    'valueset "Discharged to Health Care Facility for Hospice Care": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.207\' \n' +
    'valueset "Discharged to Home for Hospice Care": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.209\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Glucose Lab Test Mass Per Volume": \'urn:oid:2.16.840.1.113762.1.4.1248.34\' \n' +
    'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\' \n' +
    'valueset "Ketoacidosis": \'urn:oid:2.16.840.1.113762.1.4.1222.520\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Comfort Measures Care":\n' +
    '  ["Intervention, Order": "Comfort Measures"]\n' +
    '    union ["Intervention, Performed": "Comfort Measures"]\n' +
    '\n' +
    'define "Days in Hospitalization":\n' +
    '  "Measurement Population" EligibleInpatientHospitalization\n' +
    '    let period: Global."HospitalizationWithObservation" ( EligibleInpatientHospitalization ),\n' +
    '    relevantPeriod: "HospitalDaysMax10"(period)\n' +
    '    return Tuple {\n' +
    '      encounter: EligibleInpatientHospitalization,\n' +
    '      hospitalizationPeriod: period,\n' +
    '      relevantPeriod: relevantPeriod,\n' +
    '      relevantDays: "DaysInPeriod"(relevantPeriod)\n' +
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
    '  "Encounter with Early Glucose Greater Than or Equal to 1000 or with Comfort or Hospice Care"\n' +
    '\n' +
    'define "Encounter with Comfort Measures during Hospitalization":\n' +
    '  "Initial Population" InpatientHospitalization\n' +
    '    with "Comfort Measures Care" ComfortCare\n' +
    '      such that Coalesce(start of Global."NormalizeInterval"(ComfortCare.relevantDatetime, ComfortCare.relevantPeriod), ComfortCare.authorDatetime) during Global."HospitalizationWithObservation" ( InpatientHospitalization )\n' +
    '\n' +
    'define "Encounter with Discharge for Hospice Care":\n' +
    '  "Initial Population" InpatientHospitalization\n' +
    '    where InpatientHospitalization.dischargeDisposition in "Discharged to Home for Hospice Care"\n' +
    '      or InpatientHospitalization.dischargeDisposition in "Discharged to Health Care Facility for Hospice Care"\n' +
    '\n' +
    'define "Encounter with Early Glucose Greater Than or Equal to 1000 or with Comfort or Hospice Care":\n' +
    '  "Encounter with Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start"\n' +
    '    union "Encounter with Comfort Measures during Hospitalization"\n' +
    '    union "Encounter with Discharge for Hospice Care"\n' +
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
    '      such that DiabetesCondition.prevalencePeriod starts before end of Hospitalization.hospitalizationPeriod\n' +
    '    return Hospitalization.encounter\n' +
    '\n' +
    'define "Encounter with Glucose Greater Than or Equal to 1000 within 1 Hour Prior To and 6 Hours After Encounter Start":\n' +
    '  from\n' +
    '    "Initial Population" InpatientHospitalization,\n' +
    '    ["Laboratory Test, Performed": "Glucose Lab Test Mass Per Volume"] GlucoseTest\n' +
    '    let GlucoseTestTime: Global."EarliestOf" ( GlucoseTest.relevantDatetime, GlucoseTest.relevantPeriod ),\n' +
    '    HospitalPeriod: Global."HospitalizationWithObservation" ( InpatientHospitalization )\n' +
    '    where GlucoseTest.result is not null\n' +
    '      and GlucoseTest.result >= 1000 \'mg/dL\'\n' +
    '      and GlucoseTestTime during Interval[( start of HospitalPeriod - 1 hour ), ( start of HospitalPeriod + 6 hours )]\n' +
    '      and GlucoseTestTime before end of InpatientHospitalization.relevantPeriod\n' +
    '    return InpatientHospitalization\n' +
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
    'define "Numerator Exclusions":\n' +
    '  "Encounter with Early Glucose Greater Than or Equal to 1000 or with Comfort or Hospice Care"\n' +
    '\n' +
    'define "Qualifying Encounter":\n' +
    '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
    '    where InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
    '      and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod) >= 18\n' +
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
    'define function "DaysInPeriod"(Period Interval<DateTime> ):\n' +
    '  ( "IntervalToDayNumbers"(Period) ) DayNumber\n' +
    '    let startPeriod: start of Period + ( 24 hours * ( DayNumber - 1 ) ),\n' +
    '    endPeriod: if ( hours between startPeriod and end of Period < 24 ) then startPeriod \n' +
    '      else start of Period + ( 24 hours * DayNumber )\n' +
    '    return Tuple {\n' +
    '      dayNumber: DayNumber,\n' +
    '      dayPeriod: Interval[startPeriod, endPeriod )\n' +
    '    }\n' +
    '\n' +
    'define function "IntervalToDayNumbers"(Period Interval<DateTime> ):\n' +
    '  ( expand { Interval[1, days between start of Period and end of Period]} ) DayExpand\n' +
    '    return end of DayExpand\n' +
    '\n' +
    'define function "DenominatorObservations"(QualifyingEncounter "Encounter, Performed" ):\n' +
    '  singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
    '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
    '      return Count(EncounterWithEventDays.eligibleEventDays)\n' +
    '  )\n' +
    '\n' +
    'define function "NumeratorObservations"(QualifyingEncounter "Encounter, Performed" ):\n' +
    '  singleton from ( "Days with Hyperglycemic Events" EncounterWithEventDays\n' +
    '      where EncounterWithEventDays.encounter = QualifyingEncounter\n' +
    '      return Count(EncounterWithEventDays.eligibleEventDays EligibleEventDay\n' +
    '          where EligibleEventDay.hasHyperglycemicEvent\n' +
    '      )\n' +
    '  )\n' +
    '\n' +
    'define function "HospitalDaysMax10"(Period Interval<DateTime> ):\n' +
    '  Interval[start of Period, Min({ \n' +
    '    end of Period, start of Period + 10 days }\n' +
    '  )]\n' +
    '\n'

describe('Measure Creation: Ratio ListQDMPositiveEncounterPerformed with MO', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2023-01-01', '2023-12-31')
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, null, true)

        OktaLogin.Login()
    })

    after('Logout and Clean up', () => {

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
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'DenominatorObservations')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator Exclusions')

        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).should('exist')
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'NumeratorObservations')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Sum')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({force:true})
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('07/31/2003').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Living').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        //Element - Condition: Diagnosis: Diabetes
        cy.get('[data-testid="elements-tab-condition"]').click()
        cy.get('[data-testid="data-type-Diagnosis: Diabetes"]').click()
        cy.get('[id="dateTime"]').eq(0).type('07/09/2023 08:00 AM')
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-46635009"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Element - Encounter:Performed:Encounter Inpatient
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]').click()
        cy.get('[id="dateTime"]').eq(0).type('07/11/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('07/15/2023 09:00 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        cy.get('[data-testid="elements-tab-laboratory_test"]').click()
        cy.get('[data-testid="data-type-Laboratory Test, Performed: Glucose Lab Test Mass Per Volume"]').click()
        cy.get('[id="dateTime"]').eq(2).type('07/11/2023 07:00 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-LOINC"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1556-0"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()
        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Quantity"]').click()
        cy.get('[data-testid="quantity-value-input-quantity"]').type('1000')
        cy.get('[id="quantity-unit-input-quantity"]').type('mg/dl')
        cy.get('[data-testid="add-attribute-button"]').click()

        //Element - Encounter:Performed:Encounter Inpatient
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]').click()
        cy.get('[id="dateTime"]').eq(0).type('10/11/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('10/18/2023 08:15 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        cy.get('[data-testid="elements-tab-laboratory_test"]').click()
        cy.get('[data-testid="data-type-Laboratory Test, Performed: Glucose Lab Test Mass Per Volume"]').click()
        cy.get('[id="dateTime"]').eq(2).type('10/13/2023 08:00 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-LOINC"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1556-0"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()
        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Quantity"]').click()
        cy.get('[data-testid="quantity-value-input-quantity"]').type('1100')
        cy.get('[id="quantity-unit-input-quantity"]').type('mg/dl')
        cy.get('[data-testid="add-attribute-button"]').click()

        //Element - Encounter:Performed:Encounter Inpatient
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]').click()
        cy.get('[id="dateTime"]').eq(0).type('11/01/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('11/04/2023 08:15 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('3')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('2')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('6')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Add Elements to the second Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('07/31/2003').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Living').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        //Element - Condition: Diagnosis: Diabetes
        cy.get('[data-testid="elements-tab-condition"]').click()
        cy.get('[data-testid="data-type-Diagnosis: Diabetes"]').click()
        cy.get('[id="dateTime"]').eq(0).type('07/09/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('07/11/2023 08:00 AM')
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-46635009"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Element - Encounter:Performed:Encounter Inpatient
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]').click()
        cy.get('[id="dateTime"]').eq(0).type('07/11/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('07/13/2023 09:00 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()
        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-Length Of Stay"]').click()
        cy.get('[data-testid="quantity-value-input-quantity"]').type('2')
        cy.get('#quantity-unit-input-quantity').type('d')
        cy.get('[data-testid="add-attribute-button"]').click()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        cy.get('[data-testid="elements-tab-laboratory_test"]').click()
        cy.get('[data-testid="data-type-Laboratory Test, Performed: Glucose Lab Test Mass Per Volume"]').click()
        cy.get('[id="dateTime"]').eq(2).type('07/11/2023 08:00 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-LOINC"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1556-0"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()
        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Quantity"]').click()
        cy.get('[data-testid="quantity-value-input-quantity"]').type('1000')
        cy.get('[id="quantity-unit-input-quantity"]').type('mg/dl')
        cy.get('[data-testid="add-attribute-button"]').click()

        //Element - Encounter:Performed: Observation Services
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Observation Services"]').click()
        cy.get('[id="dateTime"]').eq(0).type('03/07/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('03/08/2023 08:15 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-448951000124107"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        //Close the Element
        cy.get('[data-testid=CloseIcon]').click()

        //Element - Encounter:Performed:Encounter Inpatient
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]').click()
        cy.get('[id="dateTime"]').eq(0).type('03/08/2023 08:30 AM')
        cy.get('[id="dateTime"]').eq(1).type('03/11/2023 08:15 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        cy.get('[data-testid="elements-tab-laboratory_test"]').click()
        cy.get('[data-testid="data-type-Laboratory Test, Performed: Glucose Lab Test Mass Per Volume"]').click()
        cy.get('[id="dateTime"]').eq(0).type('03/08/2023 08:30 AM')
        cy.get('[id="dateTime"]').eq(1).type('03/08/2023 08:45 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-LOINC"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1547-9"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()
        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Quantity"]').click()
        cy.get('[data-testid="quantity-value-input-quantity"]').type('201')
        cy.get('[id="quantity-unit-input-quantity"]').type('mg/dl')
        cy.get('[data-testid="add-attribute-button"]').click()
        //Close the Element
        cy.get('[data-testid=CloseIcon]').click()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        cy.get('[data-testid="elements-tab-laboratory_test"]').click()
        cy.get('[data-testid="data-type-Laboratory Test, Performed: Glucose Lab Test Mass Per Volume"]').click()
        cy.get('[id="dateTime"]').eq(0).type('03/08/2023 09:30 AM')
        cy.get('[id="dateTime"]').eq(1).type('03/08/2023 10:15 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-LOINC"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1547-9"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get('[data-testid="sub-navigation-tab-attributes"]').click()
        cy.get('[id="attribute-select"]').click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Quantity"]').click()
        cy.get('[data-testid="quantity-value-input-quantity"]').type('1000')
        cy.get('[id="quantity-unit-input-quantity"]').type('mg/dl')
        cy.get('[data-testid="add-attribute-button"]').click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('3')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Execute Test case on Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')
    })
})
