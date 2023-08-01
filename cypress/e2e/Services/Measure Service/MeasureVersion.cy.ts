import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { Environment } from "../../../Shared/Environment"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let harpUser = Environment.credentials().harpUser
let measureTwo = 'MeasureTwo' + Date.now()
let cqlLibraryTwo = 'LibraryTwo' + Date.now()
let testCaseTitle = 'FAIL'
let testCaseDescription = 'FAIL' + Date.now()
let testCaseSeries = 'SBTestSeries'
let invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
let measureCQL_ProportionMeasure = MeasureCQL.CQL_Multiple_Populations
let validTestCaseJson = TestCaseJson.CohortEpisodeEncounter_PASS
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCQLLibraryName = ''
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')

let measureCQL = 'library ' + cqlLibraryName + ' version \'0.0.000\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"ipp\":\n' +
    'exists [\"Encounter\": \"Office Visit\"] E where E.period.start during \"Measurement Period\"\n' +
    'define \"denom\":\n' +
    '\"ipp\"\n' +
    'define \"num\":\n' +
    'exists [\"Encounter\": \"Office Visit\"] E where E.status ~ \'finished\'\n'

let measureCQL_WithParsingAndVSACErrors = 'library APICQLLibrary35455 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' \n' +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4\' \n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "HPV Test": \'\'\n' +
    'define "ipp": true)'

describe('Measure Versioning', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    before('Create Measure', () => {

        newMeasureName = measureName + 1 + randValue
        newCQLLibraryName = cqlLibraryName + 1 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)

        //Create second Measure with Alt User
        CreateMeasurePage.CreateQICoreMeasureAPI(measureTwo, cqlLibraryTwo, measureCQL, true, true)

    })

    after('Clean up', () => {

        //Delete second Measure
        Utilities.deleteMeasure(measureTwo, cqlLibraryTwo, true, true)

    })

    it('Successful Measure Versioning', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((vId) => {
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
        })
    })

    it('Non Measure owner unable to version Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId2) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId2 + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(403)
                    expect(response.body.message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId2)
                })
            })
        })

    })
})

describe('Version Measure without CQL', () => {

    before('Create Measure and Set Access Token', () => {

        newMeasureName = measureName + 2 + randValue
        newCQLLibraryName = cqlLibraryName + 2 + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName)
    })
    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('User can not version Measure if there is no CQL', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure has no CQL.')
                })
            })
        })
    })
})


describe('Version Measure with invalid CQL', () => {

    before('Create Measure and Set Access Token', () => {

        newMeasureName = measureName + 3 + randValue
        newCQLLibraryName = cqlLibraryName + 3 + randValue

        cy.setAccessTokenCookie()

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': newMeasureName,
                    'cqlLibraryName': newCQLLibraryName,
                    'model': 'QI-Core v4.1.1',
                    "ecqmTitle": 'eCQMTitle',
                    'cql': measureCQL_WithParsingAndVSACErrors,
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                    'versionId': uuidv4(),
                    'measureSetId': uuidv4()

                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.errors[0]).to.eql('ERRORS_ELM_JSON')

                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
            })
        })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('User can not version Measure if the CQL has errors', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure has CQL errors.')
                })
            })
        })
    })
})

describe('Version Measure with invalid test case Json', () => {

    before('Create Measure, Test Case and Set Access Token', () => {

        newMeasureName = measureName + 4 + randValue
        newCQLLibraryName = cqlLibraryName + 4 + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, invalidTestCaseJson)
    })

    it('User can version Measure if the Test case Json has errors', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
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
    })
})

describe('Edit validations for versioned Measure', () => {

    before('Create Measure, Measure group and Test case', () => {

        newMeasureName = measureName + 5 + randValue
        newCQLLibraryName = cqlLibraryName + 5 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL_ProportionMeasure)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Qualifying Encounters', 'Qualifying Encounters', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Verify error messages when user try to edit Measure details, Measure Groups or Test cases for versioned Measure', () => {

        cy.log('Version the Measure')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((vId) => {
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

                    cy.log('Verify error message on editing Measure details')
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": measureId,
                            "measureName": 'UpdatedTestMeasure' + randValue,
                            "cqlLibraryName": 'UpdatedCqlLibrary' + randValue,
                            "model": 'QI-Core v4.1.1',
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "version": "1.0.000",
                            "ecqmTitle": "ecqmTitle",
                            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                        expect(response.body.message).to.eql('Response could not be completed for measure with ID ' + measureId + ', since the measure is not in a draft status')
                    })

                    cy.log('Verify error message on editing Measure group')
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/groups',
                        method: 'PUT',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "id": measureId,
                            "scoring": 'Ratio',
                            "populations": [
                                {
                                    "id": uuidv4(),
                                    "name": "initialPopulation",
                                    "definition": 'num'
                                },
                                {
                                    "id": uuidv4(),
                                    "name": "numerator",
                                    "definition": 'denom'
                                },
                                {
                                    "id": uuidv4(),
                                    "name": "numeratorExclusion",
                                    "definition": 'ipp'
                                },
                                {
                                    "id": uuidv4(),
                                    "name": "denominator",
                                    "definition": 'num'
                                }
                            ],
                            "measureGroupTypes": [
                                "Outcome"
                            ],
                            "populationBasis": "Boolean"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                        expect(response.body.message).to.eql('Response could not be completed for measure with ID ' + measureId + ', since the measure is not in a draft status')
                    })

                    cy.log('Verify error message on editing Test case')
                    cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testcaseid) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + measureId + '/test-cases/' + testcaseid,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'PUT',
                            body: {
                                'id': testcaseid,
                                'name': "IPPPass",
                                'series': "WhenBP<120",
                                'title': "test case title edited",
                                'description': "IPP Pass Test BP <120",
                                'json': "{ \n  Encounter: \"Office Visit union\" \n  Id: \"Identifier\" \n  value: \"Visit out of hours (procedure)\" \n}"
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(409)
                            expect(response.body.message).to.eql('Response could not be completed for measure with ID ' + measureId + ', since the measure is not in a draft status')
                        })
                    })
                })
            })
        })
    })
})

describe('Delete validations for versioned Measure', () => {

    before('Create Measure, Measure group and Test case', () => {

        newMeasureName = measureName + 6 + randValue
        newCQLLibraryName = cqlLibraryName + 6 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL_ProportionMeasure)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Qualifying Encounters', 'Qualifying Encounters', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Verify error messages when user try to delete Measure, Measure Groups or Test cases for versioned Measures', () => {

        cy.log('Version the Measure')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((vId) => {
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

                    cy.log('Verify error message on delete Measure')
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": measureId,
                            "measureName": 'UpdatedTestMeasure' + randValue,
                            "cqlLibraryName": 'UpdatedCqlLibrary' + randValue,
                            "model": 'QI-Core v4.1.1',
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "version": "1.0.000",
                            "ecqmTitle": "ecqmTitle",
                            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                        expect(response.body.message).to.eql('Response could not be completed for measure with ID ' + measureId + ', since the measure is not in a draft status')
                    })

                    cy.log('Verify error message on delete Measure group')
                    cy.readFile('cypress/fixtures/groupId').should('exist').then((groupId) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + measureId + '/groups/' + groupId,
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": measureId,
                                "groups": [
                                    {
                                        "id": groupId,
                                        "scoring": "Cohort",
                                        "populations": [
                                            {
                                                "id": uuidv4,
                                                "name": "initialPopulation",
                                                "definition": "ipp",
                                                "associationType": null,
                                                "description": null
                                            }
                                        ],
                                        "measureGroupTypes": [
                                            "Outcome"
                                        ],
                                        "scoringUnit": "",
                                        "stratifications": [],
                                        "populationBasis": "boolean"
                                    }
                                ]
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(409)
                            expect(response.body.message).to.eql('Response could not be completed for measure with ID ' + measureId + ', since the measure is not in a draft status')
                        })
                    })

                    cy.log('Verify error message on delete Test case')
                    cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testcaseid) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + measureId + '/test-cases/' + testcaseid,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'DELETE',
                            body: {
                                'id': testcaseid,
                                'title': testCaseTitle,
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(409)
                            expect(response.body.message).to.eql('Response could not be completed for measure with ID ' + measureId + ', since the measure is not in a draft status')
                        })
                    })
                })
            })
        })
    })
})
