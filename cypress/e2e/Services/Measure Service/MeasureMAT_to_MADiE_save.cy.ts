import { MeasureDetails } from "../../../Shared/MeasureDetails"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { v4 as uuidv4 } from 'uuid'

let measureToMADiESave = Environment.credentials().measureMAT_to_MADiE_save_API_Key
let harpUser = Environment.credentials().harpUser
let staticCQLLibraryName = 'Bug65044now' + Date.now()
let dynamicCQLLibraryName = ''
let randValue = null

describe('Measure Transfer Service From MAT -to- MADiE', () => {

    beforeEach('Set Access Token', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })


    it('Successful Measure transfer from MAT -to- MADiE', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure-transfer/mat-measures?cmsId=0',//?cmsId=null
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": uuidv4(),
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94" + randValue,
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": staticCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now25" + randValue,
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": uuidv4(),
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": uuidv4(),
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279" + randValue,
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": uuidv4(),
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279" + randValue,
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529" + randValue,
                    //"cmsId": 0,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": uuidv4(),
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94" + randValue,
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(201)
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- missing CQL Library name', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures?cmsId=null',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": uuidv4(),
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94" + randValue,
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    //"cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now6" + randValue,
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": uuidv4(),
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": uuidv4(),
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279" + randValue,
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": uuidv4(),
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279" + randValue,
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529" + randValue,
                    //"cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": uuidv4(),
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94" + randValue,
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.be.eq('Measure Library Name is required.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- CQL Library name already exists', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures?cmsId=0',//?cmsId=null
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": uuidv4(),
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94" + randValue,
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": staticCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now25" + randValue,
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": uuidv4(),
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": uuidv4(),
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279" + randValue,
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": uuidv4(),
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279" + randValue,
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529" + randValue,
                    //"cmsId": 0,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": uuidv4(),
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94" + randValue,
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('CQL library with given name already exists.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Model name is missing', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now8",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    //"model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.be.eq('Model is required')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Model value is incomplete', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now9",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.be.eq('Model should be either QDM v5.6 or QI-Core v4.1.1')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- MeasureSetId is missing', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    //"measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now10",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureSetId).to.be.eq('Measure Set ID is required.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- eCQM Abbreviated Title is missing', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    //"ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now11",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.ecqmTitle).to.be.eq('eCQM Abbreviated Title is required.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- eCQM Abbreviated Title exceeds 32 characters', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504Bug6504",
                    "measureName": "Bug65044now12",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.ecqmTitle).to.be.eq('eCQM Abbreviated Title cannot be more than 32 characters.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Measure Name is missing', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    //"measureName": "Bug65044now13",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.be.eq('Measure Name is required.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Measure Name does not contain a letter', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "14",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.be.eq('A measure name must contain at least one letter.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Measure Name exceeds 500 characters', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15Bug65044now15",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.be.eq('Measure Name can not be more than 500 characters.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Measure Name contains underscores', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044_now16",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    "versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.be.eq('Measure Name can not contain underscores.')
            })

        })
    })
    it('Measure transfer from MAT -to- MADiE -- Version ID is missing', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        dynamicCQLLibraryName = 'Randomize' + Date.now() + randValue
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure-transfer/mat-measures',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': measureToMADiESave,
                    'harp-id': harpUser,
                    'Content-Type': 'application/json'
                },
                body: {
                    "id": "659445a44d794b327b5eb74467",
                    "measureHumanReadableId": null,
                    "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                    "version": "0.0.000",
                    "revisionNumber": null,
                    "state": null,
                    "cqlLibraryName": dynamicCQLLibraryName,
                    "ecqmTitle": "Bug6504",
                    "measureName": "Bug65044now17",
                    "active": true,
                    "cqlErrors": false,
                    "errors": [],
                    "cql": "library Bug6504 version '0.0.000'\nusing QDM version '5.6'\ncodesystem \"Test\": 'urn:oid:2.16.840.1.113883.6.1'\r\ncodesystem \"LOINC\": 'urn:oid:2.16.840.1.113883.6.1'\r\nvalueset \"Emergency Department Visit\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'\r\nvalueset \"Encounter Inpatient\": 'urn:oid:2.16.840.1.113883.3.666.5.307'\r\nvalueset \"Ethnicity\": 'urn:oid:2.16.840.1.114222.4.11.837'\r\nvalueset \"Observation Services\": 'urn:oid:2.16.840.1.113762.1.4.1111.143'\r\nvalueset \"ONC Administrative Sex\": 'urn:oid:2.16.840.1.113762.1.4.1'\r\nvalueset \"Payer\": 'urn:oid:2.16.840.1.114222.4.11.3591'\r\nvalueset \"Race\": 'urn:oid:2.16.840.1.114222.4.11.836'\r\nvalueset \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\": 'urn:oid:2.16.840.1.113883.3.3157.4036'\r\nvalueset \"Active Peptic Ulcer\": 'urn:oid:2.16.840.1.113883.3.3157.4031'\r\nvalueset \"Adverse reaction to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.6'\r\nvalueset \"Allergy to thrombolytics\": 'urn:oid:2.16.840.1.113762.1.4.1170.5'\r\nvalueset \"Anticoagulant Medications, Oral\": 'urn:oid:2.16.840.1.113883.3.3157.4045'\r\nvalueset \"Aortic Dissection and Rupture\": 'urn:oid:2.16.840.1.113883.3.3157.4028'\r\nvalueset \"birth date\": 'urn:oid:2.16.840.1.113883.3.560.100.4'\r\nvalueset \"Cardiopulmonary Arrest\": 'urn:oid:2.16.840.1.113883.3.3157.4048'\r\nvalueset \"Cerebral Vascular Lesion\": 'urn:oid:2.16.840.1.113883.3.3157.4025'\r\nvalueset \"Closed Head and Facial Trauma\": 'urn:oid:2.16.840.1.113883.3.3157.4026'\r\nvalueset \"Dementia\": 'urn:oid:2.16.840.1.113883.3.3157.4043'\r\nvalueset \"Discharge To Acute Care Facility\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'\r\nvalueset \"ED\": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'\r\nvalueset \"Endotracheal Intubation\": 'urn:oid:2.16.840.1.113762.1.4.1045.69'\r\n\r\nvalueset \"Fibrinolytic Therapy\": 'urn:oid:2.16.840.1.113883.3.3157.4020'\r\nvalueset \"Intracranial or Intraspinal surgery\": 'urn:oid:2.16.840.1.113762.1.4.1170.2'\r\nvalueset \"Ischemic Stroke\": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024'\r\nvalueset \"Major Surgical Procedure\": 'urn:oid:2.16.840.1.113883.3.3157.4056'  \r\nvalueset \"Malignant Intracranial Neoplasm Group\": 'urn:oid:2.16.840.1.113762.1.4.1170.3'\r\nvalueset \"Mechanical Circulatory Assist Device\": 'urn:oid:2.16.840.1.113883.3.3157.4052'\r\nvalueset \"Neurologic impairment\": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012'\r\nvalueset \"Patient Expired\": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309'\r\nvalueset \"Percutaneous Coronary Intervention\": 'urn:oid:2.16.840.1.113883.3.3157.2000.5'\r\nvalueset \"Pregnancy\": 'urn:oid:2.16.840.1.113883.3.3157.4055'\r\nvalueset \"STEMI\": 'urn:oid:2.16.840.1.113883.3.3157.4017'\r\nvalueset \"Thrombolytic medications\": 'urn:oid:2.16.840.1.113762.1.4.1170.4'\r\nvalueset \"Chlamydia Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052'\r\nvalueset \"Falls Screening\": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028'\r\ncode \"Birth date\": '21112-8' from \"LOINC\" display 'Birth date'\r\nparameter \"Measurement Period\" Interval<DateTime>\r\ncontext Patient\r\ndefine \"SDE Ethnicity\":\r\n  [\"Patient Characteristic Ethnicity\": \"Ethnicity\"]\r\ndefine \"SDE Payer\":\r\n  [\"Patient Characteristic Payer\": \"Payer\"]\r\ndefine \"SDE Race\":\r\n  [\"Patient Characteristic Race\": \"Race\"]\r\ndefine \"SDE Sex\":\r\n  [\"Patient Characteristic Sex\": \"ONC Administrative Sex\"]\r\ndefine \"Initial Population\":\r\n  [\"Adverse Event\": \"Encounter Inpatient\"] //Adverse Event\r\n      union [\"Allergy/Intolerance\": \"Observation Services\"] //Allergy\r\n      union [\"Assessment, Order\": \"Active Bleeding or Bleeding Diathesis (Excluding Menses)\"] //Assessment\r\n      union [\"Patient Care Experience\": \"Active Peptic Ulcer\"] //Care Experience\r\n      union [\"Care Goal\": \"Adverse reaction to thrombolytics\"] //Care Goal - missing from current list\r\n      union [\"Patient Characteristic Payer\": \"Payer\"] //Characteristic\r\n      //threw in a patient demographic - should not show up\r\n      union [\"Patient Characteristic Race\": \"Race\"]\r\n      union [\"Diagnosis\": \"Allergy to thrombolytics\"] //Condition\r\n      union [\"Communication, Performed\": \"Anticoagulant Medications, Oral\"] //Communication\r\n      //threw a negation element in to see if it maps correctly\r\n    //   union [\"Communication, Not Performed\": \"Aortic Dissection and Rupture\"] //Communication\r\n      union [\"Device, Order\": \"Cardiopulmonary Arrest\"] //Device\r\n      union [\"Diagnostic Study, Order\": \"Cerebral Vascular Lesion\"] //Diagnostic Study\r\n      union [\"Encounter, Performed\": \"Emergency Department Visit\"] //Encounter\r\n      union [\"Family History\": \"Closed Head and Facial Trauma\"] //Family History\r\n      union [\"Immunization, Order\": \"Dementia\"] //Immunization\r\n      union [\"Intervention, Order\": \"ED\"] //Intervention\r\n      union [\"Laboratory Test, Order\": \"Endotracheal Intubation\"] //Laboratory\r\n      union [\"Laboratory Test, Performed\": \"Chlamydia Screening\"]\r\n      union [\"Medication, Active\": \"Fibrinolytic Therapy\"] //Medication\r\n      union [\"Participation\": \"Intracranial or Intraspinal surgery\"] //Participation\r\n      union [\"Physical Exam, Order\": \"Ischemic Stroke\"] //Physical Exam\r\n      union [\"Procedure, Order\": \"Major Surgical Procedure\"] //Procedure\r\n      union [\"Related Person\": \"Malignant Intracranial Neoplasm Group\"] //Related Person - mssing from curent list\r\n      union [\"Substance, Administered\": \"Mechanical Circulatory Assist Device\"] //Substance\r\n      union [\"Symptom\": \"Neurologic impairment\"] //Symptom\r\n      union [\"Assessment, Performed\": \"Falls Screening\"] //Assessment ",

                    "elmXml": null,
                    "testCases": [
                        {
                            "id": "6596f1944d794b327b5eb74b",
                            "name": null,
                            "title": "Test1",
                            "series": "",
                            "description": "",
                            "createdAt": "2024-01-04T17:57:40.538Z",
                            "createdBy": "prateek.keerthi@semanticbits.com",
                            "lastModifiedAt": "2024-01-04T20:01:51.640Z",
                            "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                            "validResource": true,
                            "json": "{\"qdmVersion\":\"5.6\",\"dataElements\":[{\"dataElementCodes\":[{\"code\":\"32485007\",\"system\":\"2.16.840.1.113883.6.96\",\"version\":null,\"display\":\"Hospital admission (procedure)\"}],\"_id\":\"65970e944b5450000012309b\",\"recorder\":[],\"qdmTitle\":\"Adverse Event\",\"hqmfOid\":\"2.16.840.1.113883.10.20.28.4.120\",\"qdmCategory\":\"adverse_event\",\"qdmVersion\":\"5.6\",\"_type\":\"QDM::AdverseEvent\",\"description\":\"Adverse Event: Encounter Inpatient\",\"codeListId\":\"2.16.840.1.113883.3.666.5.307\",\"id\":\"65970e944b5450000012309a\",\"authorDatetime\":\"2024-01-31T00:00:00.000+00:00\",\"relevantDatetime\":\"2024-01-18T00:00:00.000+00:00\"}],\"_id\":\"65970e914b54500000123015\"}",
                            "patientId": "bfeb0ae5-0a93-4846-86d0-21ead9984817",
                            "hapiOperationOutcome": null,
                            "groupPopulations": [
                                {
                                    "groupId": "659446084d794b327b5eb746",
                                    "scoring": "Cohort",
                                    "populationBasis": "false",
                                    "populationValues": [
                                        {
                                            "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                            "criteriaReference": null,
                                            "name": "initialPopulation",
                                            "expected": null,
                                            "actual": null
                                        }
                                    ],
                                    "stratificationValues": []
                                }
                            ]
                        }
                    ],
                    "groups": [
                        {
                            "id": "659446084d794b327b5eb746",
                            "scoring": "Cohort",
                            "populations": [
                                {
                                    "id": "0f4d37d5-f188-40c8-9840-24f0eac5279d",
                                    "name": "initialPopulation",
                                    "definition": "Initial Population",
                                    "associationType": null,
                                    "description": ""
                                }
                            ],
                            "measureObservations": null,
                            "groupDescription": "",
                            "improvementNotation": "",
                            "rateAggregation": "",
                            "measureGroupTypes": null,
                            "scoringUnit": "",
                            "stratifications": [],
                            "populationBasis": "false"
                        }
                    ],
                    "createdAt": "2024-01-02T17:19:32.292Z",
                    "createdBy": "prateek.keerthi@semanticbits.com",
                    "lastModifiedAt": "2024-01-02T17:21:12.563Z",
                    "lastModifiedBy": "prateek.keerthi@semanticbits.com",
                    "measurementPeriodStart": "2001-12-22T00:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-12-22T23:59:59.999+00:00",
                    "supplementalData": [],
                    "supplementalDataDescription": null,
                    "riskAdjustments": [],
                    "riskAdjustmentDescription": null,
                    "model": "QDM v5.6",

                    //"versionId": "8a4c66e6-df09-4e4b-891d-cdc882df529a",
                    "cmsId": null,
                    "reviewMetaData": {
                        "approvalDate": null,
                        "lastReviewDate": null
                    },
                    "measureSet": {
                        "id": "659445a44d794b327b5eb745",
                        "measureSetId": "ee4ff6dc-3772-4aae-b207-c38abed0a94f",
                        "owner": "prateek.keerthi@semanticbits.com",
                        "acls": null
                    },
                    "scoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Appropriate Use Process"
                    ],
                    "patientBasis": false,
                    "rateAggregation": null,
                    "improvementNotation": null
                }


            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.versionId).to.be.eq('Version ID is required.')
            })

        })
    })
})