import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCase } from "../../../Shared/TestCasesPage"
import { QdmCql } from "../../../Shared/QDMMeasuresCQL"
const dayjs = require('dayjs')

// no chance of re-usability for this
const testCaseJson = `{
  "birthDatetime": "1970-08-07T08:00:00.000+00:00",
  "qdmVersion": "5.6",
  "dataElements": [
    {
      "dataElementCodes": [
        {
          "code": "96125",
          "system": "2.16.840.1.113883.6.12",
          "version": null,
          "display": null
        }
      ],
      "description": "Encounter, Performed: Encounter to Screen for Depression",
      "codeListId": "2.16.840.1.113883.3.600.1916",
      "id": "5e4d9aedc703f50000579537",
      "_id": "660c451366e85b000016ebe6",
      "authorDatetime": null,
      "admissionSource": null,
      "relevantPeriod": {
        "low": "2026-01-02T08:00:00.000+00:00",
        "high": "2026-01-02T09:15:00.000+00:00",
        "lowClosed": true,
        "highClosed": true
      },
      "dischargeDisposition": null,
      "facilityLocations": null,
      "diagnoses": null,
      "lengthOfStay": null,
      "priority": null,
      "participant": [],
      "relatedTo": [],
      "qdmTitle": "Encounter, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.5",
      "qdmCategory": "encounter",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::EncounterPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "97161",
          "system": "2.16.840.1.113883.6.12",
          "version": null,
          "display": null
        }
      ],
      "description": "Encounter, Performed: Physical Therapy Evaluation",
      "codeListId": "2.16.840.1.113883.3.526.3.1022",
      "id": "5e4d9b04c703f500005795b7",
      "_id": "660c451366e85b000016ebe8",
      "authorDatetime": null,
      "admissionSource": null,
      "relevantPeriod": {
        "low": "2026-05-05T08:00:00.000+00:00",
        "high": "2026-05-05T09:15:00.000+00:00",
        "lowClosed": true,
        "highClosed": true
      },
      "dischargeDisposition": null,
      "facilityLocations": null,
      "diagnoses": null,
      "lengthOfStay": null,
      "priority": null,
      "participant": [],
      "relatedTo": [],
      "qdmTitle": "Encounter, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.5",
      "qdmCategory": "encounter",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::EncounterPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "73832-8",
          "system": "2.16.840.1.113883.6.1",
          "version": null,
          "display": null
        }
      ],
      "description": "Assessment, Performed: Adult depression screening assessment",
      "codeListId": "drc-d9da0520616eaa6568cd2bb74e6a5b58596778b50fea2b0e2d0346b88c757e18",
      "id": "5e4d9b32c703f50000579659",
      "_id": "660c451366e85b000016ebea",
      "authorDatetime": null,
      "relevantDatetime": "2026-01-02T08:00:00.000+00:00",
      "relevantPeriod": {
        "low": null,
        "high": null,
        "lowClosed": true,
        "highClosed": true
      },
      "negationRationale": null,
      "reason": null,
      "method": null,
      "result": {
        "code": "428181000124104",
        "system": "2.16.840.1.113883.6.96",
        "version": null,
        "display": "Depression screening positive (finding)"
      },
      "interpretation": null,
      "components": null,
      "relatedTo": null,
      "performer": [],
      "qdmTitle": "Assessment, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.117",
      "qdmCategory": "assessment",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::AssessmentPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "405780009",
          "system": "2.16.840.1.113883.6.96",
          "version": null,
          "display": null
        }
      ],
      "description": "Intervention, Performed: Follow Up for Adult Depression",
      "codeListId": "2.16.840.1.113883.3.526.3.1568",
      "id": "5e4d9b53c703f5000057970b",
      "_id": "660c451366e85b000016ebec",
      "authorDatetime": null,
      "relevantDatetime": "2026-01-02T08:00:00.000+00:00",
      "relevantPeriod": {
        "low": null,
        "high": null,
        "lowClosed": true,
        "highClosed": true
      },
      "reason": null,
      "result": null,
      "status": null,
      "negationRationale": null,
      "performer": [],
      "relatedTo": [],
      "qdmTitle": "Intervention, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.36",
      "qdmCategory": "intervention",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::InterventionPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "73832-8",
          "system": "2.16.840.1.113883.6.1",
          "version": null,
          "display": null
        }
      ],
      "description": "Assessment, Performed: Adult depression screening assessment",
      "codeListId": "drc-d9da0520616eaa6568cd2bb74e6a5b58596778b50fea2b0e2d0346b88c757e18",
      "id": "5e4d9b8dc703f5000057988d",
      "_id": "660c451366e85b000016ebee",
      "authorDatetime": null,
      "relevantDatetime": "2026-05-05T08:00:00.000+00:00",
      "relevantPeriod": {
        "low": null,
        "high": null,
        "lowClosed": true,
        "highClosed": true
      },
      "negationRationale": null,
      "reason": null,
      "method": null,
      "result": {
        "code": "428181000124104",
        "system": "2.16.840.1.113883.6.96",
        "version": null,
        "display": "Depression screening positive (finding)"
      },
      "interpretation": null,
      "components": null,
      "relatedTo": null,
      "performer": [],
      "qdmTitle": "Assessment, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.117",
      "qdmCategory": "assessment",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::AssessmentPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "G0270",
          "system": "http://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets",
          "version": "urn:hl7:version:2025",
          "display": "Medical nutrition therapy; reassessment and subsequent intervention(s) following second referral in same year for change in diagnosis, medical condition or treatment regimen (including additional hours needed for renal disease), individual, face to face with the patient, each 15 minutes"
        }
      ],
      "description": "Encounter, Performed: Encounter to Screen for Depression",
      "codeListId": "2.16.840.1.113883.3.600.1916",
      "id": "5e4d9bc3c703f5000057991e",
      "_id": "660c451366e85b000016ebf0",
      "authorDatetime": null,
      "admissionSource": null,
      "relevantPeriod": {
        "low": "2026-08-11T08:00:00.000+00:00",
        "high": "2026-08-11T09:15:00.000+00:00",
        "lowClosed": true,
        "highClosed": true
      },
      "dischargeDisposition": null,
      "facilityLocations": null,
      "diagnoses": null,
      "lengthOfStay": null,
      "priority": null,
      "participant": [],
      "relatedTo": [],
      "qdmTitle": "Encounter, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.5",
      "qdmCategory": "encounter",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::EncounterPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "308477009",
          "system": "2.16.840.1.113883.6.96",
          "version": null,
          "display": null
        }
      ],
      "description": "Intervention, Order: Referral for Adult Depression",
      "codeListId": "2.16.840.1.113883.3.526.3.1571",
      "id": "5e4d9bedc703f500005799d6",
      "_id": "660c451366e85b000016ebf2",
      "authorDatetime": "2026-05-05T08:05:00.000+00:00",
      "reason": null,
      "negationRationale": null,
      "requester": [],
      "qdmTitle": "Intervention, Order",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.35",
      "qdmCategory": "intervention",
      "qdmStatus": "order",
      "qdmVersion": "5.6",
      "_type": "QDM::InterventionOrder"
    },
    {
      "dataElementCodes": [
        {
          "code": "73832-8",
          "system": "2.16.840.1.113883.6.1",
          "version": null,
          "display": null
        }
      ],
      "description": "Assessment, Performed: Adult depression screening assessment",
      "codeListId": "drc-d9da0520616eaa6568cd2bb74e6a5b58596778b50fea2b0e2d0346b88c757e18",
      "id": "5e4d9c49c703f50000579a7d",
      "_id": "660c451366e85b000016ebf4",
      "authorDatetime": null,
      "relevantDatetime": "2026-08-11T08:00:00.000+00:00",
      "relevantPeriod": {
        "low": null,
        "high": null,
        "lowClosed": true,
        "highClosed": true
      },
      "negationRationale": null,
      "reason": null,
      "method": null,
      "result": {
        "code": "428181000124104",
        "system": "2.16.840.1.113883.6.96",
        "version": null,
        "display": "Depression screening positive (finding)"
      },
      "interpretation": null,
      "components": null,
      "relatedTo": null,
      "performer": [],
      "qdmTitle": "Assessment, Performed",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.117",
      "qdmCategory": "assessment",
      "qdmStatus": "performed",
      "qdmVersion": "5.6",
      "_type": "QDM::AssessmentPerformed"
    },
    {
      "dataElementCodes": [
        {
          "code": "M",
          "system": "2.16.840.1.113883.5.1",
          "version": null,
          "display": "Male"
        }
      ],
      "description": "Patient Characteristic Sex: ONCAdministrativeSex",
      "codeListId": "2.16.840.1.113762.1.4.1",
      "id": "6228d55c8af4010122dd3188",
      "_id": "660c451366e85b000016ebf6",
      "qdmTitle": "Patient Characteristic Sex",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.55",
      "qdmCategory": "patient_characteristic",
      "qdmStatus": "gender",
      "qdmVersion": "5.6",
      "_type": "QDM::PatientCharacteristicSex"
    },
    {
      "dataElementCodes": [],
      "description": null,
      "codeListId": null,
      "id": "62586f02a2b60a00003407db",
      "_id": "660c451366e85b000016ebf8",
      "birthDatetime": "1970-08-07T08:00:00.000+00:00",
      "qdmTitle": "Patient Characteristic Birthdate",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.54",
      "qdmCategory": "patient_characteristic",
      "qdmStatus": "birthdate",
      "qdmVersion": "5.6",
      "_type": "QDM::PatientCharacteristicBirthdate"
    },
    {
      "dataElementCodes": [
        {
          "code": "1002-5",
          "system": "2.16.840.1.113883.6.238",
          "version": null,
          "display": "American Indian or Alaska Native"
        }
      ],
      "description": "Patient Characteristic Race: Race",
      "codeListId": "2.16.840.1.114222.4.11.836",
      "id": "6228d55c8af4010122dd3190",
      "_id": "660c451366e85b000016ebfa",
      "qdmTitle": "Patient Characteristic Race",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.59",
      "qdmCategory": "patient_characteristic",
      "qdmStatus": "race",
      "qdmVersion": "5.6",
      "_type": "QDM::PatientCharacteristicRace"
    },
    {
      "dataElementCodes": [
        {
          "code": "2186-5",
          "system": "2.16.840.1.113883.6.238",
          "version": null,
          "display": "Not Hispanic or Latino"
        }
      ],
      "description": "Patient Characteristic Ethnicity: Ethnicity",
      "codeListId": "2.16.840.1.114222.4.11.837",
      "id": "6228d55c8af4010122dd318e",
      "_id": "660c451366e85b000016ebfc",
      "qdmTitle": "Patient Characteristic Ethnicity",
      "hqmfOid": "2.16.840.1.113883.10.20.28.4.56",
      "qdmCategory": "patient_characteristic",
      "qdmStatus": "ethnicity",
      "qdmVersion": "5.6",
      "_type": "QDM::PatientCharacteristicEthnicity"
    }
  ],
  "extendedData": null,
  "_id": "660c451366e85b000016ebe4"
}`

const now = Date.now()
const measureData: CreateMeasureOptions = {
    cqlLibraryName: 'AUCSLib' + now,
    ecqmTitle: 'AdminUpdateCodeSystem' + now,
    measureScoring: 'Proportion',
    patientBasis: 'true',
    measureCql: QdmCql.legacyCMS2ForAdminCodeSystemUpdates,
    mpStartDate: dayjs().subtract('1', 'year').format('YYYY-MM-DD'),
    mpEndDate: dayjs().format('YYYY-MM-DD')
}
const testCase: TestCase = {
    title: 'Has HCPCS URL value',
    group: 'IPPass',
    description: 'example tc for testing codesystem update',
    json: testCaseJson

}
const adminAPIKey = Environment.credentials().adminApiKey
let harpUser = ''

describe('Admin API - Update CodeSystem value in QDM test cases', () => {

    beforeEach('Set Access Token', () => {

        harpUser = OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Replace HCPCS URL with oid value', () => {

        const currentUser = Cypress.env('selectedUser')

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', 'Denominator Exclusions', 
            'Denominator Exceptions', 'Numerator', null, 'Denominator', 'true')
        TestCasesPage.CreateQDMTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()

        // API call admin with values
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
               
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/admin/measures/' + measureId + '/testcases/code-system-correction',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        "api-key": adminAPIKey
                    },
                    method: 'PUT',
                    qs: {
                        "incorrectCodeSystem": "http://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets",
                        "correctCodeSystem": "2.16.840.1.113883.6.285"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                // body has tc # of affected test cases - we expect to see 1
                    expect(response.body[0]).to.eql(1)                    
                })

                // API to validate change
                cy.request({
                    url: '/api/measures/' + measureId + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body[0].json).to.include("2.16.840.1.113883.6.285")
                        expect(response.body[0].json).to.not.include("http://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets")
                    })
            })
        })
        


    })

})