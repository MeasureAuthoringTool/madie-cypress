import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { TestData } from "../../../Shared/TestData"
import type { MeasureGroupBody, TestCaseBody } from "../../../Shared/TestData"

let harpUserALT = ''
let harpUser = ''
let measureName = 'ServiceQiCoreTC' + Date.now()
let cqlLibraryName = 'ServiceQiCoreTCLib' + Date.now()
const TCJsonRace = TestCaseJson.TCJsonRaceOMBRaceDetailed
const TCJsonRace_Update = TestCaseJson.TCJsonRaceOMBRaceDetailed_Update
const measureCQLAlt = MeasureCQL.ICFCleanTestQICore
const measureCQL = MeasureCQL.ICFTest_CQL

const measureScoring = 'Proportion'
const PopIniPop = 'ipp'
const PopNum = 'num'
const PopDenom = 'denom'
const PopDenex = 'denom'
const PopDenexcep = 'denom'
const PopNumex = 'num'

const TCName = 'TCName' + Date.now()
const TCSeries = 'SBTestSeries'
const TCTitle = 'test case title'
const TCDescription = 'DENOMFail1651609688032'
const randValue = (Math.floor((Math.random() * 1000) + 1))
const testCaseJsonSnippet = "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
const overlongTestCaseField = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
    "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
    "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr"
const TCJson = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },' +
'"type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter", "resource": { "id":"1", "resourceType": "Encounter","meta": {' +
'"versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"}, "text": { "status": "generated",' +
'"div":"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Sep 9th 2021 for Asthma<a name=\\\"mm\\\"/></div>"}, "status": "finished","class":' + 
'{ "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],' +
'"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],' +
'"period": { "start": "2023-09-10T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2", "resourceType": "Patient",' +
'"text": { "status": "generated","div": "<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Lizzy Health</div>"},"identifier": [ { "system": ' +
'"http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", "text": "Lizzy Health",' +
'"family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

const measureGroupRequestBody = (includeNumeratorExclusion = true): MeasureGroupBody => ({
    scoring: measureScoring,
    populationBasis: 'Boolean',
    populations: [
        TestData.population('initialPopulation', PopIniPop),
        TestData.population('denominator', PopDenom),
        TestData.population('denominatorExclusion', PopDenex),
        TestData.population('denominatorException', PopDenexcep),
        TestData.population('numerator', PopNum),
        ...(includeNumeratorExclusion ? [TestData.population('numeratorExclusion', PopNumex)] : [])
    ],
    measureGroupTypes: ['Outcome']
})

const populationValues = (includeNumeratorExclusion = true) => [
    { name: 'initialPopulation', expected: false, actual: false },
    { name: 'denominator', expected: false, actual: false },
    { name: 'denominatorExclusion', expected: false, actual: false },
    { name: 'denominatorException', expected: false, actual: false },
    { name: 'numerator', expected: false, actual: false },
    ...(includeNumeratorExclusion ? [{ name: 'numeratorExclusion', expected: false, actual: false }] : [])
]

const groupedTestCaseBody = (groupId: string, testCaseId?: string): TestCaseBody => ({
    ...(testCaseId ? { id: testCaseId } : {}),
    name: TCName,
    title: TCTitle,
    series: TCSeries,
    description: TCDescription,
    json: TCJson,
    hapiOperationOutcome: {
        code: 201,
        message: null,
        outcomeResponse: null
    },
    groupPopulations: [{
        groupId,
        scoring: measureScoring,
        populationValues: populationValues()
    }]
})

const expectPopulationNames = (response: Cypress.Response<any>, expectedNames: string[]) => {
    expectedNames.forEach((name, index) => {
        expect(response.body.groupPopulations[0].populationValues[index].name).to.eq(name)
    })
}

const expectGroupedTestCaseBasics = (response: Cypress.Response<any>, expectedTestCaseId?: string) => {
    expect(response.status).to.eql(200)
    if (expectedTestCaseId) {
        expect(response.body.id).to.eql(expectedTestCaseId)
    }
    expect(response.body.series).to.eql(TCSeries)
    expect(response.body.json).to.be.exist
    expect(response.body.title).to.eql(TCTitle)
}

describe('User without edit access attempts to change a test case', () => {

    before('Create Measure', () => {

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create Measure as the alt user
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt, undefined, true)
        TestData.saveMeasureCql(`${measureCQLAlt}\n`, { owner: 'selectedAltUser' })
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(true)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName, false, true)
    })

    it('Attempt to enter valid Test Case Json with SDE when the measure has not been shared with the user', () => {

        harpUser = OktaLogin.getUser(false)

        //Create test case as the alt user (owner)
        OktaLogin.setupUserSession(true)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOMFail",
            'series': "Test Series",
            'title': "Title",
            'description': "description",
            'json': TCJsonRace
        }, { failOnStatusCode: false }, 'selectedAltUser').then((response) => {
            expect(response.status).to.eql(201)
            TestData.writeFixture('testCaseId', response.body.id, 'selectedAltUser')
        })

        //Switch to the regular user (non-owner) and attempt to edit
        cy.then(() => {
            OktaLogin.setupUserSession(false)
        })

        //Edit created Test Case
        let measureId = ''
        TestData.requestMeasureTestCase('PUT', (context) => {
            measureId = context.measureId
            return {
                'id': context.testCaseId,
                'name': "IPPPass",
                'series': "WhenBP120",
                'title': "test case title edited",
                'description': "IPP Pass Test BP <120",
                'json': TCJsonRace_Update
            }
        }, { failOnStatusCode: false }, 'selectedAltUser').then((response) => {
            expect(response.status).to.eql(403)
            expect(response.body.message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId)
        })
    })
})

describe('Test Case population values based on Measure Group population definitions', () => {

    before('Create Measure and measure group', () => {

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        OktaLogin.setupUserSession(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)

        TestData.requestMeasureGroup('POST', measureGroupRequestBody()).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })

        TestData.readMeasureGroupId().then((groupId) => {
            TestData.requestMeasureTestCase('POST', groupedTestCaseBody(groupId)).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.series).to.eql(TCSeries)
                expect(response.body.title).to.eql(TCTitle)
                expect(response.body.description).to.eql(TCDescription)
                expect(response.body.json).to.be.exist
                TestData.writeFixture('testCaseId', response.body.id)
            })
        })
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Test Case population value check boxes match that of the measure group definitons -- all are defined', () => {

        OktaLogin.setupUserSession(false)

        TestData.readTestCaseId().then((testCaseId) => {
            TestData.requestMeasureTestCase('GET').then((response) => {
                expectGroupedTestCaseBasics(response, testCaseId)
                expectPopulationNames(response, [
                    'initialPopulation',
                    'denominator',
                    'denominatorExclusion',
                    'denominatorException',
                    'numerator',
                    'numeratorExclusion'
                ])
            })
        })
    })

    it('Test Case population value check boxes match that of the measure group definition -- optional population is removed', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureGroup('PUT', measureGroupRequestBody(false)).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
        })

        TestData.readTestCaseId().then((testCaseId) => {
            TestData.requestMeasureTestCase('GET').then((response) => {
                expectGroupedTestCaseBasics(response, testCaseId)
                expectPopulationNames(response, [
                    'initialPopulation',
                    'denominator',
                    'denominatorExclusion',
                    'denominatorException',
                    'numerator'
                ])
                expect(response.body.groupPopulations[0].populationValues[5].definition).does.not.exist
            })
        })
    })

    it('Test Case population value check boxes match that of the measure group definition -- optional population is added', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureGroup('PUT', measureGroupRequestBody()).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })

        TestData.readMeasureGroupId().then((groupId) => {
            TestData.requestMeasureTestCase('PUT', (context) =>
                groupedTestCaseBody(groupId, context.testCaseId)
            ).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.id).to.be.exist
                expect(response.body.series).to.eql(TCSeries)
                expect(response.body.title).to.eql(TCTitle)
                expect(response.body.description).to.eql(TCDescription)
                expect(response.body.json).to.be.exist
                TestData.writeFixture('testCaseId', response.body.id)
            })
        })

        TestData.readTestCaseId().then((testCaseId) => {
            TestData.requestMeasureTestCase('GET').then((response) => {
                expectGroupedTestCaseBasics(response, testCaseId)
                expectPopulationNames(response, [
                    'initialPopulation',
                    'denominator',
                    'denominatorExclusion',
                    'denominatorException',
                    'numerator',
                    'numeratorExclusion'
                ])
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints', () => {

    let newMeasureNameLocal = ''
    let newCqlLibraryNameLocal = ''

    beforeEach('Create Measure, group, and test case', () => {

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        newMeasureNameLocal = 'TestMeasureE' + Date.now() + randVal
        newCqlLibraryNameLocal = 'TestLibraryE' + Date.now() + randVal

        OktaLogin.setupUserSession(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureNameLocal, newCqlLibraryNameLocal, measureCQL)

        TestData.requestMeasureGroup('POST', measureGroupRequestBody()).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })

        TestData.readMeasureGroupId().then((groupId) => {
            TestData.requestMeasureTestCase('POST', groupedTestCaseBody(groupId)).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.series).to.eql(TCSeries)
                expect(response.body.title).to.eql(TCTitle)
                expect(response.body.description).to.eql(TCDescription)
                expect(response.body.json).to.be.exist
                TestData.writeFixture('testCaseId', response.body.id)
            })
        })
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Create Test Case', () => {

        OktaLogin.setupUserSession(false)

        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let title = 'test case title create'
        let series = 'test case series create'
        let description = 'DENOME pass Test HB <120 ~!@#!@#$$%^&%^&* &()(?><'
        //Add Test Case to the Measure
        TestData.requestMeasureTestCase('POST', {
            'name': TCName + randValue + 4,
            'series': series,
            'title': title,
            'description': description,
            'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
        }).then((response) => {
            console.log(response)
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.patientId).to.be.exist
            expect(response.body.series).to.eql(series)
            expect(response.body.title).to.eql(title)
            expect(response.body.description).to.eql(description)
            expect(response.body.json).to.be.exist
            TestData.writeFixture('testCaseId', response.body.id)
        })
    })

    it('Edit Test Case', () => {

        OktaLogin.setupUserSession(false)

        //Edit created Test Case
        let expectedTestCaseId = ''
        TestData.requestMeasureTestCase('PUT', (context) => {
            expectedTestCaseId = context.testCaseId ?? ''

            return {
                'id': expectedTestCaseId,
                'name': "IPPPass",
                'series': "WhenBP120",
                'title': "test case title edited",
                'description': "IPP Pass Test BP <120",
                'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
            }
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.eql(expectedTestCaseId)
            expect(response.body.json).to.be.exist
            expect(response.body.series).to.eql("WhenBP120")
            expect(response.body.title).to.eql('test case title edited')
            expect(response.body.json).to.be.exist
            TestData.writeFixture('testCaseId', response.body.id)
        })
    })

    it('Get All Test Cases', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('GET', undefined, {}, 'selectedUser', null).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.be.exist
        })
    })

    it('Get a specific test case', () => {

        OktaLogin.setupUserSession(false)

        TestData.readTestCaseId().then((testCaseId) => {
            TestData.requestMeasureTestCase('GET').then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.id).to.eql(testCaseId)
                expect(response.body.series).to.eql("SBTestSeries")
                expect(response.body.json).to.be.exist
                expect(response.body.title).to.eql(TCTitle)
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints: Validations', () => {

    before('Create Measure', () => {

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()
        OktaLogin.setupUserSession(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Create Test Case: Description more than 250 characters', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOMFail",
            'series': "WhenBP<120",
            'title': "test case title",
            'description': overlongTestCaseField,
            'json': testCaseJsonSnippet
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
        })
    })

    it('Edit Test Case: Description more than 250 characters', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('PUT', (context) => ({
            'id': context.testCaseId,
            'name': "IPPPass",
            'series': "WhenBP<120",
            'title': "test case title edited",
            'description': overlongTestCaseField,
            'json': testCaseJsonSnippet
        }), { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
        })
    })

    it('Create Test Case: Title more than 250 characters', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOMFail",
            'series': "WhenBP<120",
            'title': overlongTestCaseField,
            'description': "description",
            'json': testCaseJsonSnippet
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.title).to.eql('Test Case Title can not be more than 250 characters.')
        })

    })

    it('Create Test Case: Series more than 250 characters', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOMFail",
            'series': overlongTestCaseField,
            'title': "Title",
            'description': "description",
            'json': testCaseJsonSnippet
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.series).to.eql('Test Case Series can not be more than 250 characters.')
        })
    })
})

describe('Test Case Json Validations', () => {

    before('Create Measure', () => {

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Enter Valid Test Case Json', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOMFail",
            'series': "Test Series",
            'title': "Title",
            'description': "description",
            'json': TestCaseJson.TestCaseJson_Valid
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.hapiOperationOutcome.code).to.eql(200)
        })
    })

    it('Enter Invalid Test Case Json and Verify Error Message', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOM_Fail" + randValue,
            'series': "Test_Series" + randValue,
            'title': "Test_Title" + randValue,
            'description': "Test_Description" + randValue,
            'json': TestCaseJson.API_TestCaseJson_InValid
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.hapiOperationOutcome.code).to.eql(400)
            expect(response.body.hapiOperationOutcome.message).to.eql('An error occurred while parsing the resource')
            expect(response.body.hapiOperationOutcome.outcomeResponse.issue[0].diagnostics).to.eql('HAPI-1814: Incorrect resource type found, expected "Bundle" but found "Account"')
        })
    })

    it('Enter Patient XML and Verify Error Message', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOM_Pass001" + randValue,
            'series': "Test_Series001" + randValue,
            'title': "Test_Title001" + randValue,
            'description': "Test_Description001" + randValue,
            'json': TestCaseJson.TestCase_XML
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.hapiOperationOutcome.code).to.eql(400)
            expect(response.body.hapiOperationOutcome.message).to.eql('An error occurred while parsing the resource')
            expect(response.body.hapiOperationOutcome.outcomeResponse.issue[0].diagnostics).to.eql('HAPI-1861: Failed to parse JSON encoded FHIR content: HAPI-1859: Content does not appear to be FHIR JSON, first non-whitespace character was: \'<\' (must be \'{\')')
        })
    })

    it('Verify test case errors flag when json has errors', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': "DENOM_Fail002" + randValue,
            'series': "Test_Series002" + randValue,
            'title': "Test_Title002" + randValue,
            'description': "Test_Description002" + randValue,
            'json': TestCaseJson.API_TestCaseJson_InValid
        }, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.hapiOperationOutcome.code).to.eql(400)
            expect(response.body.hapiOperationOutcome.message).to.eql('An error occurred while parsing the resource')
            expect(response.body.hapiOperationOutcome.outcomeResponse.issue[0].diagnostics).to.eql('HAPI-1814: Incorrect resource type found, expected "Bundle" but found "Account"')
            expect(response.body.validResource).to.eql(false)
        })
    })
})

describe('Measure Service: Test Case Endpoint: Authentication', () => {

    before('Create Measure', () => {

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('Bad Access Token', () => {

        OktaLogin.setupUserSession(false)

        TestData.withAccessToken((accessToken) => {
            TestData.readMeasureId().then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken + 'TEST'
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP<120",
                        'description': "DENOME pass Test HB <120"
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eql(401)
                    expect(response.statusText).to.eql('Unauthorized')
                })
            })
        })
    })
})

describe('Measure Service: Test Case Endpoint: User validation with test case import', () => {

    beforeEach('Create Measure and measure group', () => {

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        let newMName = 'TestMeasureF' + Date.now() + randVal
        let newCqlLibName = 'TestLibraryF' + Date.now() + randVal

        OktaLogin.setupUserSession(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMName, newCqlLibName, measureCQL)

        TestData.requestMeasureGroup('POST', measureGroupRequestBody()).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Non-owner or non-shared user cannot hit the end point to add test cases to a measure', () => {

        OktaLogin.setupUserSession(true)

        TestData.requestMeasureTestCaseList([{
            "name": TCName + '1',
            "title": TCTitle + '1',
            "series": TCSeries,
            "description": TCDescription,
            "json": TCJson,
        },
        {
            "name": TCName + '2',
            "title": TCTitle + '2',
            "series": TCSeries,
            "description": TCDescription,
            "json": TCJson,
        },
        {
            "name": TCName + '3',
            "title": TCTitle + '3',
            "series": TCSeries,
            "description": TCDescription,
            "json": TCJson,
        }], { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(403)
        })
    })
})

describe('Duplicate Test Case Title and Group validations', () => {

    let newMName = ''
    let newCqlLibName = ''

    beforeEach('Create Measure, Test case', () => {

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        newMName = 'TestMeasureG' + Date.now() + randVal
        newCqlLibName = 'TestLibraryG' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMName, newCqlLibName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(TCTitle, TCSeries, TCDescription)
    })

    afterEach('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Create Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        OktaLogin.setupUserSession(false)

        TestData.requestMeasureTestCase('POST', {
            'name': TCName,
            'series': TCSeries,
            'title': TCTitle,
            'description': TCDescription,
            'json': testCaseJsonSnippet
        }, { failOnStatusCode: false }).then((response) => {
            console.log(response)
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql('The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
        })
    })

    it('Edit Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        OktaLogin.setupUserSession(false)

        //Create second Test case
        TestCasesPage.CreateTestCaseAPI('SecondTCTitle', 'SecondTCSeries', 'SecondTCDescription', undefined, false, true)

        TestData.readFixture('testCasePId2').then((tcId) => {
            TestData.requestMeasureTestCase('POST', {
                'id': tcId,
                'name': TCName,
                'series': TCSeries,
                'title': TCTitle,
                'description': TCDescription,
                'json': testCaseJsonSnippet
            }, { failOnStatusCode: false }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
            })
        })
    })
})
