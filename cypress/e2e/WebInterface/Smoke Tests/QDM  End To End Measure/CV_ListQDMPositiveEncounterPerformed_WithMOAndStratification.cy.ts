import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage";

let measureName = 'CVListQDMPositiveEncounterPerformedWithMOAndStratification' + Date.now()
let CqlLibraryName = 'CVListQDMPositiveEncounterPerformedWithMOAndStratification' + Date.now()
let measureCQL = 'library MedianAdmitDecisionTimetoEDDepartureTimeforAdmittedPatients version \'11.1.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'valueset "Admit Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1111.164\' \n' +
    'valueset "Decision to Admit to Hospital Inpatient": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.295\' \n' +
    'valueset "Emergency Department Evaluation": \'urn:oid:2.16.840.1.113762.1.4.1111.163\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Hospital Settings": \'urn:oid:2.16.840.1.113762.1.4.1111.126\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Psychiatric/Mental Health Diagnosis": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.299\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "ED Encounter with Decision to Admit"\n' +
    '\n' +
    'define "Measure Population":\n' +
    '  "Initial Population"\n' +
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
    'define "Stratification 2":\n' +
    '  /*Patient encounters with a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    where exists ( EncounterInpatient.diagnoses Diagnosis\n' +
    '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
    '          and Diagnosis.rank = 1\n' +
    '    )\n' +
    '\n' +
    'define "Stratification 1":\n' +
    '  /*Patient encounters without a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    where not exists ( EncounterInpatient.diagnoses Diagnosis\n' +
    '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
    '          and Diagnosis.rank = 1\n' +
    '    )\n' +
    '\n' +
    'define "Measure Population Exclusions":\n' +
    '  /*Exclude the most recent ED encounter (LastEDVisit) that occurred within an hour of the inpatient admission with ED admission source in "Hospital Setting" (any different facility- by location or CCN )*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    where "LastEDEncounter"(EncounterInpatient).admissionSource in "Hospital Settings"\n' +
    '\n' +
    'define "ED Encounter with Decision to Admit":\n' +
    '  /*Constrains the inpatient encounter to having an ED visit with a decision to admit (assessment or order) to inpatient and ED facility location period is not null*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    let LastEDVisit: LastEDEncounter(EncounterInpatient),\n' +
    '    AdmitAssessment: "AdmitDecisionUsingAssessment"(EncounterInpatient)\n' +
    '    where ( Global."NormalizeInterval" ( AdmitAssessment.relevantDatetime, AdmitAssessment.relevantPeriod ) starts during LastEDVisit.relevantPeriod\n' +
    '        or ( "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime during LastEDVisit.relevantPeriod )\n' +
    '    )\n' +
    '      and exists ( LastEDVisit.facilityLocations Location\n' +
    '          where Location.code in "Emergency Department Visit"\n' +
    '            and Global."HasEnd" ( Location.locationPeriod )\n' +
    '      )\n' +
    '\n' +
    'define function "EDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  Global."ED Encounter" EDVisit\n' +
    '    where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
    '    sort by \n' +
    '    end of relevantPeriod ascending\n' +
    '\n' +
    'define function "LastEDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*The most recent (last) ED encounter that is within an hour of an inpatient encounter*/\n' +
    '  Last(Global."ED Encounter" EDVisit\n' +
    '      where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
    '      sort by \n' +
    '      end of relevantPeriod ascending\n' +
    '  )\n' +
    '\n' +
    'define function "EDDepartureTime"(Encounter "Encounter, Performed" ):\n' +
    '  /*The time the patient physically departed the Emergency Department*/\n' +
    '  Last(Encounter.facilityLocations Location\n' +
    '      where Location.code in "Emergency Department Visit"\n' +
    '        and Global."HasEnd"(Location.locationPeriod)\n' +
    '      return \n' +
    '      end of Location.locationPeriod\n' +
    '      sort ascending\n' +
    '  )\n' +
    '\n' +
    'define function "AdmitDecisionUsingEncounterOrder"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*Captures the decision to admit order and time that occurred during the last ED visit*/\n' +
    '  Last(["Encounter, Order": "Decision to Admit to Hospital Inpatient"] AdmitOrder\n' +
    '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
    '      where AdmitOrder.authorDatetime during LastEDVisit.relevantPeriod\n' +
    '        and AdmitOrder.authorDatetime before or on "EDDepartureTime"(LastEDVisit)\n' +
    '      sort by authorDatetime\n' +
    '  )\n' +
    '\n' +
    'define function "MeasureObservation"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*The duration from the Decision to Admit (order or assessment) to the departure from the Emergency Department*/\n' +
    '  duration in minutes of Interval[Coalesce(start of Global."NormalizeInterval"("AdmitDecisionUsingAssessment"(EncounterInpatient).relevantDatetime, "AdmitDecisionUsingAssessment"(EncounterInpatient).relevantPeriod), "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime), "EDDepartureTime"("LastEDEncounter"(EncounterInpatient))]\n' +
    '\n' +
    'define function "AdmitDecisionUsingAssessment"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*Captures the decision to admit assessment, time, and result that was performed during the last ED visit*/\n' +
    '  Last(["Assessment, Performed": "Emergency Department Evaluation"] EDEvaluation\n' +
    '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
    '      where EDEvaluation.result in "Admit Inpatient"\n' +
    '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts during LastEDVisit.relevantPeriod\n' +
    '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts before or on "EDDepartureTime"(LastEDVisit)\n' +
    '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
    '  )'

describe('Measure Creation: CV ListQDMPositiveEncounterPerformed With MO And Stratification', () => {

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

    it('End to End CV ListQDMPositiveEncounterPerformed With MO And Stratification', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

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
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCV)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Continuous Variable')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ED Encounter with Decision to Admit')

        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'ED Encounter with Decision to Admit')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'ED Encounter with Decision to Admit')
        Utilities.dropdownSelect(MeasureGroupPage.measureObservationPopSelect, 'EDEncounter')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Median')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //Add Stratifications here once MAT-5977 is fixed

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

    })
})
