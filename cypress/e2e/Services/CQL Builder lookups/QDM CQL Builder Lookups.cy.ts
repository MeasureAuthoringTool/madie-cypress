import { Utilities } from "../../../Shared/Utilities"

let cql= 'library CohortListQDMPositiveEncounterPerformed1723119423497 version \'0.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
    '\n' +
    'valueset "Acute care hospital Inpatient Encounter": \'urn:oid:2.16.840.1.113883.3.666.5.2289\' \n' +
    'valueset "Bicarbonate lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.139\' \n' +
    'valueset "Body temperature": \'urn:oid:2.16.840.1.113762.1.4.1045.152\' \n' +
    'valueset "Body weight": \'urn:oid:2.16.840.1.113762.1.4.1045.159\' \n' +
    'valueset "Creatinine lab test": \'urn:oid:2.16.840.1.113883.3.666.5.2363\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Glucose lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.134\' \n' +
    'valueset "Heart Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.149\' \n' +
    'valueset "Hematocrit lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.114\' \n' +
    'valueset "Medicare Advantage payer": \'urn:oid:2.16.840.1.113762.1.4.1104.12\' \n' +
    'valueset "Medicare FFS payer": \'urn:oid:2.16.840.1.113762.1.4.1104.10\' \n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Oxygen Saturation by Pulse Oximetry": \'urn:oid:2.16.840.1.113762.1.4.1045.151\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
    'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
    'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
    'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\' \n' +
    '\n' +
    'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Inpatient Encounters"\n' +
    '\n' +
    'define "Numerator":\n' +
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
    'define "SDE Results":\n' +
    '  {\n' +
    '  // First physical exams\n' +
    '    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n' +
    '    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n' +
    '    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n' +
    '    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n' +
    '    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n' +
    '  // Weight uses lab test timing\n' +
    '    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n' +
    '  \n' +
    '  // First lab tests\n' +
    '    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n' +
    '    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n' +
    '    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n' +
    '    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n' +
    '    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n' +
    '    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n' +
    '    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n' +
    '  }\n' +
    '\n' +
    'define "Inpatient Encounters":\n' +
    '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
    '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
    '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
    '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
    '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
    '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n' +
    '\n' +
    'define function "LengthOfStay"(Stay Interval<DateTime> ):\n' +
    '  difference in days between start of Stay and \n' +
    '  end of Stay\n' +
    '\n' +
    'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
    '  "Inpatient Encounters" Encounter\n' +
    '    let FirstExam: First(ExamList Exam\n' +
    '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n' +
    '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
    '    )\n' +
    '    return {\n' +
    '      EncounterId: Encounter.id,\n' +
    '      FirstResult: FirstExam.result as Quantity,\n' +
    '      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n' +
    '    }\n' +
    '\n' +
    'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
    '  "Inpatient Encounters" Encounter\n' +
    '    let FirstExamWithLabTiming: First(ExamList Exam\n' +
    '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
    '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
    '    )\n' +
    '    return {\n' +
    '      EncounterId: Encounter.id,\n' +
    '      FirstResult: FirstExamWithLabTiming.result as Quantity,\n' +
    '      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n' +
    '    }\n' +
    '\n' +
    'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n' +
    '  "Inpatient Encounters" Encounter\n' +
    '    let FirstLab: First(LabList Lab\n' +
    '        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
    '        sort by resultDatetime\n' +
    '    )\n' +
    '    return {\n' +
    '      EncounterId: Encounter.id,\n' +
    '      FirstResult: FirstLab.result as Quantity,\n' +
    '      Timing: FirstLab.resultDatetime\n' +
    '    }\n' +
    'define fluent function "confirmed"(Medication List<"Medication, Order">):\n' +
    ' "Medication" OrderMedication1  where OrderMedication1.authorDatetime during "Measurement Period"'


describe('CQL Builder Lookups: QDM', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })
    afterEach('Clean up', () => {

    })

    it('Verify QDM CQL is parsed correctly', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.log(accessToken.value)
            cy.request({
                failOnStatusCode: false,
                url: '/api/qdm/cql-builder-lookups',
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: cql
            }).then((response) => {

                expect(response.status).to.eql(200)
                expect(response.body.parameters).to.have.lengthOf(2)
                expect(response.body.definitions).to.have.lengthOf(11)
                expect(response.body.functions).to.have.lengthOf(25)
                expect(response.body.fluentFunctions).to.have.lengthOf(1)

            })

        })

    })
})
