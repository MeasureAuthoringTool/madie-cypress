import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { v4 as uuidv4 } from 'uuid'
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Environment } from "../../../Shared/Environment"

let harpUserALT = Environment.credentials().harpUserALT
let TCJsonRace = TestCaseJson.TCJsonRaceOMBRaceDetailed
let TCJsonRace_Update = TestCaseJson.TCJsonRaceOMBRaceDetailed_Update
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let testCasePath = 'cypress/fixtures/testCaseId'

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Proportion'
let measureCQL = MeasureCQL.ICFTest_CQL

let PopIniPop = 'ipp'
let PopNum = 'num'
let PopDenom = 'denom'
let PopDenex = 'denom'
let PopDenexcep = 'denom'
let PopNumex = 'num'

let TCName = 'TCName' + Date.now()
let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'
let randValue = (Math.floor((Math.random() * 1000) + 1))
let TCJson = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter", "resource": { "id":"1", "resourceType": "Encounter","meta": { "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"}, "text": { "status": "generated","div":"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Sep 9th 2021 for Asthma<a name=\\\"mm\\\"/></div>"}, "status": "finished","class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],"period": { "start": "2023-09-10T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2", "resourceType": "Patient","text": { "status": "generated","div": "<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Lizzy Health</div>"},"identifier": [ { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'

// attempt to edit a test case with whom the measure has not been shared and whom is also not the owner
describe('QI Core DOB, Gender, Race, and Ethnicity data validations: Attempt to update Json with a user whom is not the owner nor has the measure been shared', () => {

    before('Create Measure', () => {

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
    })

    beforeEach('Set Access Token', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Attempt to enter valid Test Case Json that contains DOB, Gender, Race, and Ethnicity data, when the measure has not been shared with the user', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "Test Series",
                        'title': "Title",
                        'description': "description",
                        'json': TCJsonRace
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    cy.writeFile(testCasePath, response.body.id)
                })
            })
        })

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        //Edit created Test Case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testCaseId,
                            'name': "IPPPass",
                            'series': "WhenBP120",
                            'title': "test case title edited",
                            'description': "IPP Pass Test BP <120",
                            'json': TCJsonRace_Update
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.eql('User ' + harpUserALT + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })
})

describe('Test Case population values based on Measure Group population definitions', () => {
    before('Create Measure and measure group', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })


        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/groupId').should('exist').then((groupIdFc) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'POST',
                        body: {
                            "name": TCName,
                            "title": TCTitle,
                            "series": TCSeries,
                            "description": TCDescription,
                            "json": TCJson,
                            "hapiOperationOutcome": {
                                "code": 201,
                                "message": null,
                                "outcomeResponse": null
                            },
                            "groupPopulations": [{
                                "groupId": groupIdFc,
                                "scoring": measureScoring,
                                "populationValues": [
                                    {
                                        "name": "initialPopulation",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominator",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominatorExclusion",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominatorException",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "numerator",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "numeratorExclusion",
                                        "expected": false,
                                        "actual": false
                                    }

                                ]
                            }]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.description).to.eql(TCDescription)
                        expect(response.body.json).to.be.exist
                        cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
                    })
                })
            })
        })
    })
    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })
    it('Test Case population value check boxes match that of the measure group definitons -- all are defined', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId)
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.json).to.be.exist
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.groupPopulations[0].populationValues[0].name).to.eq('initialPopulation')
                        expect(response.body['groupPopulations'][0].populationValues[1].name).to.eq('denominator')
                        expect(response.body['groupPopulations'][0].populationValues[2].name).to.eq('denominatorExclusion')
                        expect(response.body['groupPopulations'][0].populationValues[3].name).to.eq('denominatorException')
                        expect(response.body['groupPopulations'][0].populationValues[4].name).to.eq('numerator')
                        expect(response.body['groupPopulations'][0].populationValues[5].name).to.eq('numeratorExclusion')
                    })
                })
            })
        })
    })
    it('Test Case population value check boxes match that of the measure group definition -- optional population is removed', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureIdFc) => {
                cy.request({
                    url: '/api/measures/' + measureIdFc + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                })
            })
        })

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId)
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.json).to.be.exist
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.groupPopulations[0].populationValues[0].name).to.eq('initialPopulation')
                        expect(response.body['groupPopulations'][0].populationValues[1].name).to.eq('denominator')
                        expect(response.body['groupPopulations'][0].populationValues[2].name).to.eq('denominatorExclusion')
                        expect(response.body['groupPopulations'][0].populationValues[3].name).to.eq('denominatorException')
                        expect(response.body['groupPopulations'][0].populationValues[4].name).to.eq('numerator')
                        expect(response.body['groupPopulations'][0].populationValues[5].definition).does.not.exist
                    })
                })
            })
        })
    })
    it('Test Case population value check boxes match that of the measure group definition -- optional population is added', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/groupId').should('exist').then((groupIdFc) => {
                    cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseIdFc) => {
                        cy.request({
                            url: '/api/measures/' + id + '/test-cases/' + testCaseIdFc,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'PUT',
                            body: {
                                "id": testCaseIdFc,
                                "name": TCName,
                                "title": TCTitle,
                                "series": TCSeries,
                                "description": TCDescription,
                                "json": TCJson,
                                "hapiOperationOutcome": {
                                    "code": 201,
                                    "message": null,
                                    "outcomeResponse": null
                                },
                                "groupPopulations": [{
                                    "groupId": groupIdFc,
                                    "scoring": measureScoring,
                                    "populationValues": [
                                        {
                                            "name": "initialPopulation",
                                            "expected": false,
                                            "actual": false
                                        },
                                        {
                                            "name": "denominator",
                                            "expected": false,
                                            "actual": false
                                        },
                                        {
                                            "name": "denominatorExclusion",
                                            "expected": false,
                                            "actual": false
                                        },
                                        {
                                            "name": "denominatorException",
                                            "expected": false,
                                            "actual": false
                                        },
                                        {
                                            "name": "numerator",
                                            "expected": false,
                                            "actual": false
                                        },
                                        {
                                            "name": "numeratorExclusion",
                                            "expected": false,
                                            "actual": false
                                        }

                                    ]
                                }]
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body.id).to.be.exist
                            expect(response.body.series).to.eql(TCSeries)
                            expect(response.body.title).to.eql(TCTitle)
                            expect(response.body.description).to.eql(TCDescription)
                            expect(response.body.json).to.be.exist
                            cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
                        })
                    })
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId)
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.json).to.be.exist
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.groupPopulations[0].populationValues[0].name).to.eq('initialPopulation')
                        expect(response.body['groupPopulations'][0].populationValues[1].name).to.eq('denominator')
                        expect(response.body['groupPopulations'][0].populationValues[2].name).to.eq('denominatorExclusion')
                        expect(response.body['groupPopulations'][0].populationValues[3].name).to.eq('denominatorException')
                        expect(response.body['groupPopulations'][0].populationValues[4].name).to.eq('numerator')
                        expect(response.body['groupPopulations'][0].populationValues[5].name).to.eq('numeratorExclusion')
                    })
                })
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    beforeEach('Create Measure, group, and test case', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/groupId').should('exist').then((groupIdFc) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'POST',
                        body: {
                            "name": TCName,
                            "title": TCTitle,
                            "series": TCSeries,
                            "description": TCDescription,
                            "json": TCJson,
                            "hapiOperationOutcome": {
                                "code": 201,
                                "message": null,
                                "outcomeResponse": null
                            },
                            "groupPopulations": [{
                                "groupId": groupIdFc,
                                "scoring": measureScoring,
                                "populationValues": [
                                    {
                                        "name": "initialPopulation",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominator",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominatorExclusion",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominatorException",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "numerator",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "numeratorExclusion",
                                        "expected": false,
                                        "actual": false
                                    }

                                ]
                            }]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.description).to.eql(TCDescription)
                        expect(response.body.json).to.be.exist
                        cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
                    })
                })
            })
        })
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryNameDeux)

    })

    it('Create Test Case', () => {
        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let title = 'test case title create'
        let series = 'test case series create'
        let description = 'DENOME pass Test HB <120 ~!@#!@#$$%^&%^&* &()(?><'
        //Add Test Case to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': TCName + randValue + 4,
                        'series': series,
                        'title': title,
                        'description': description,
                        'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.patientId).to.be.exist
                    expect(response.body.series).to.eql(series)
                    expect(response.body.title).to.eql(title)
                    expect(response.body.description).to.eql(description)
                    expect(response.body.json).to.be.exist
                    cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
                })
            })
        })
    })

    it('Edit Test Case', () => {

        //Edit created Test Case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testCaseId,
                            'name': "IPPPass",
                            'series': "WhenBP120",
                            'title': "test case title edited",
                            'description': "IPP Pass Test BP <120",
                            'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId)
                        expect(response.body.json).to.be.exist
                        expect(response.body.series).to.eql("WhenBP120")
                        expect(response.body.title).to.eql('test case title edited')
                        expect(response.body.json).to.be.exist
                        cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
                    })
                })
            })
        })
    })

    it('Get All Test Cases', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.be.exist
                })
            })
        })
    })

    it('Get a specific test case', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId)
                        expect(response.body.series).to.eql("SBTestSeries")
                        expect(response.body.json).to.be.exist
                        expect(response.body.title).to.eql(TCTitle)
                    })
                })
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints: Validations', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Create Test Case: Description more than 250 characters', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP<120",
                        'title': "test case title",
                        'description': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                            "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                            "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                        'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
                })
            })
        })
    })

    it('Edit Test Case: Description more than 250 characters', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testCaseId,
                            'name': "IPPPass",
                            'series': "WhenBP<120",
                            'title': "test case title edited",
                            'description': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                                "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                                "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                            'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
                    })
                })
            })
        })
    })

    it('Create Test Case: Title more than 250 characters', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP<120",
                        'title': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                            "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                            "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                        'description': "description",
                        'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.title).to.eql('Test Case Title can not be more than 250 characters.')
                })
            })
        })

    })

    it('Create Test Case: Series more than 250 characters', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                            "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                            "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                        'title': "Title",
                        'description': "description",
                        'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.series).to.eql('Test Case Series can not be more than 250 characters.')
                })
            })
        })
    })
})

describe('Test Case Json Validations', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Enter Valid Test Case Json', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "Test Series",
                        'title': "Title",
                        'description': "description",
                        'json': TestCaseJson.TestCaseJson_Valid
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.hapiOperationOutcome.code).to.eql(200)
                })
            })
        })

    })

    it('Enter Invalid Test Case Json and Verify Error Message', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOM_Fail" + randValue,
                        'series': "Test_Series" + randValue,
                        'title': "Test_Title" + randValue,
                        'description': "Test_Description" + randValue,
                        'json': TestCaseJson.API_TestCaseJson_InValid
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.hapiOperationOutcome.code).to.eql(400)
                    expect(response.body.hapiOperationOutcome.message).to.eql('An error occurred while parsing the resource')
                    expect(response.body.hapiOperationOutcome.outcomeResponse.issue[0].diagnostics).to.eql('HAPI-1814: Incorrect resource type found, expected "Bundle" but found "Account"')
                })
            })
        })
    })

    it('Enter Patient XML and Verify Error Message', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOM_Pass001" + randValue,
                        'series': "Test_Series001" + randValue,
                        'title': "Test_Title001" + randValue,
                        'description': "Test_Description001" + randValue,
                        'json': TestCaseJson.TestCase_XML
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.hapiOperationOutcome.code).to.eql(400)
                    expect(response.body.hapiOperationOutcome.message).to.eql('An error occurred while parsing the resource')
                    expect(response.body.hapiOperationOutcome.outcomeResponse.issue[0].diagnostics).to.eql('HAPI-1861: Failed to parse JSON encoded FHIR content: HAPI-1859: Content does not appear to be FHIR JSON, first non-whitespace character was: \'<\' (must be \'{\')')
                })
            })
        })
    })

    it('Verify test case errors flag when json has errors', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOM_Fail002" + randValue,
                        'series': "Test_Series002" + randValue,
                        'title': "Test_Title002" + randValue,
                        'description': "Test_Description002" + randValue,
                        'json': TestCaseJson.API_TestCaseJson_InValid
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.hapiOperationOutcome.code).to.eql(400)
                    expect(response.body.hapiOperationOutcome.message).to.eql('An error occurred while parsing the resource')
                    expect(response.body.hapiOperationOutcome.outcomeResponse.issue[0].diagnostics).to.eql('HAPI-1814: Incorrect resource type found, expected "Bundle" but found "Account"')
                    expect(response.body.validResource).to.eql(false)
                })

            })
        })
    })
})

describe('Measure Service: Test Case Endpoint: Authentication', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Bad Access Token', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value + 'TEST'
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

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })


    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })
    it('Non-owner or non-shared user cannot hit the end point to add test cases to a measure', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases/list',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: [{
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

                    },]
                }).then((response) => {
                    expect(response.status).to.eql(403)
                })
            })
        })
    })

})

describe('Duplicate Test Case Title and Group validations', () => {

    beforeEach('Create Measure, Test case', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(TCTitle, TCSeries, TCDescription)

    })
    afterEach('Cleanup', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Create Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': TCName,
                        'series': TCSeries,
                        'title': TCTitle,
                        'description': TCDescription,
                        'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
                })
            })
        })
    })

    it('Edit Test Case: Verify error message when the Test case Title and group names are duplicate', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create second Test case
        TestCasesPage.CreateTestCaseAPI('SecondTCTitle', 'SecondTCSeries', 'SecondTCDescription', null, false, true)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCasePId2').should('exist').then((tcId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'POST',
                        body: {
                            'id': tcId,
                            'name': TCName,
                            'series': TCSeries,
                            'title': TCTitle,
                            'description': TCDescription,
                            'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                        }
                    }).then((response) => {
                        console.log(response)
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('The Test Case Group and Title combination is not unique. The combination must be unique (case insensitive, spaces ignored) across all test cases associated with the measure.')
                    })
                })
            })
        })
    })
})
