import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { Utilities } from "../../../Shared/Utilities"
import { v4 as uuidv4 } from 'uuid'
import { Environment } from "../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.SBTEST_CQL
let harpUser = Environment.credentials().harpUserALT
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCQLLibraryName = ''

let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'
let secondTCSeries = 'ICFTestSeries'
let secondTCTitle = 'ICF test case title'
let secondTCDescription = 'DENOMPass1651609688032'
let TCJson = TestCaseJson.TestCaseJson_Valid
let ImportTCJon = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", ' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter",' +
    ' "resource": { "id":"1", "resourceType": "Encounter", "meta": {' +
    ' "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",' +
    ' "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00",' +
    ' "source": "#nEcAkGd8PRwPP5fA"},' +
    ' "text": { "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],"period": { "start": "2021-01-01T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2d5722cf-6051-4f8c-9af7-8732cdd17b8d", "resourceType": "Patient","text": { "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", ' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ] } ],"gender": "female","birthDate": "2000-10-11"} } ] }'
let TCJson_Invalid_PatientID = TestCaseJson.TestCaseJson_with_warnings
let TCJson_Invalid = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", ' +
    ' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter",' +
    ' "resource": { "id":"1", "resourceType": "Encounter", "meta": {' +
    ' "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",' +
    ' "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00",' +
    ' "source": "#nEcAkGd8PRwPP5fA"},' +
    ' "text": { "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
    ' "status": "finished","class": { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],"period": { "start": "2021-01-01T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2d5722cf-6051-4f8c-9af7-8732cdd17b8d", "resourceType": "Patient","text": { "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"}, "meta": { "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"}, "identifier":' +
    ' [ { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", ' +
    ' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ] } ],"gender": "female","birthDate": "2000-10-11"}  ] }'

describe('Test Case Import', () => {

    beforeEach('Create Measure and measure group', () => {

        newMeasureName = measureName + randValue + 4
        newCQLLibraryName = cqlLibraryName + randValue + 4

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        TestCasesPage.CreateTestCaseAPI(TCTitle, TCDescription, TCSeries, TCJson)
    })

    afterEach('Clean up measures', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })

    it('Success Scenario: Import single test case and over ride existing test case', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCasePId').should('exist').then((patientId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/imports',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: [{
                            "patientId": patientId,
                            "json": ImportTCJon

                        }]
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body[0].successful).to.eql(true)
                    })
                })
            })
        })
    })

    it('Measure\'s populations do not match the population in the file that is being imported', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases/imports',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: [{
                        "patientId": uuidv4(),
                        "json": TCJson_Invalid_PatientID
                    }]
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body[0].message).to.eql('the measure populations do not match the populations in the import file. The Test Case has been imported, but no expected values have been set.')
                    expect(response.body[0].successful).to.eql(true)
                })
            })
        })
    })

    it('Unable to Import when Test Case Json is not valid', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCasePId').should('exist').then((patientId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/imports',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: [{
                            "patientId": patientId,
                            "json": TCJson_Invalid

                        }]
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body[0].message).to.eql('Error while processing Test Case JSON.  Please make sure Test Case JSON is valid.')
                        expect(response.body[0].successful).to.eql(false)
                    })
                })
            })
        })
    })

    it('Non Measure owner unable to Import Test cases', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCasePId').should('exist').then((patientId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/imports',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: [{
                            "patientId": patientId,
                            "json": ImportTCJon

                        }]
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body[0].message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + id)
                        expect(response.body[0].successful).to.eql(false)
                    })
                })
            })
        })
    })
})

describe('Test Case import for versioned Measure', () => {

    beforeEach('Create Measure and measure group', () => {

        newMeasureName = measureName + randValue + 5
        newCQLLibraryName = cqlLibraryName + randValue + 5

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')
        TestCasesPage.CreateTestCaseAPI(TCTitle, TCDescription, TCSeries, TCJson)
    })

    it("Unable to Import Test Cases for Versioned Measures", () => {

        //Version Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                })
            })
        })

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCasePId').should('exist').then((patientId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/imports',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: [{
                            "patientId": patientId,
                            "json": ImportTCJon

                        }]
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body[0].message).to.eql('Response could not be completed for measure with ID ' + id + ', since the measure is not in a draft status')
                        expect(response.body[0].successful).to.eql(false)
                    })
                })
            })
        })
    })
})

describe('Multiple Test Case Import', () => {

    beforeEach('Create Measure, measure group and Test Cases', () => {

        newMeasureName = measureName + randValue + 6
        newCQLLibraryName = cqlLibraryName + randValue + 6

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        TestCasesPage.CreateTestCaseAPI(TCTitle, TCDescription, TCSeries, TCJson)
        TestCasesPage.CreateTestCaseAPI(secondTCTitle, secondTCDescription, secondTCSeries, TCJson)
    })

    afterEach('Clean up measures', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })

    it('Multiple test case files are not supported', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCasePId').should('exist').then((patientId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/imports',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: [
                            {
                                "patientId": patientId,
                                "json": ImportTCJon
                            },
                            {
                                "patientId": patientId,
                                "json": ImportTCJon
                            }
                        ]
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body[0].message).to.eql('Multiple test case files are not supported. Please make sure only one JSON file is in the folder.')
                        expect(response.body[0].successful).to.eql(false)
                    })
                })
            })
        })
    })
})


