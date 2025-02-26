import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { v4 as uuidv4 } from 'uuid'
import { QiCore4Cql } from "../../../Shared/FHIRMeasuresCQL"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { Measure, TestCase } from '@madie/madie-models'
const dayjs = require('dayjs')

const now = Date.now()
const measure = {
    name:'AdminCorrectExpValues' + now,
    libraryName: 'ACExpValuesLib' + now,
    ecqmTitle: 'ACEV',
    model: SupportedModels.qiCore4,
    mpStartDate: dayjs().subtract('1', 'year').format('YYYY-MM-DD'),
    mpEndDate: dayjs().format('YYYY-MM-DD')
}
const measureCQL = QiCore4Cql.CQL_Populations.replace('TestLibrary4664', measure.name)
const testCase = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
const harpUser = Environment.credentials().harpUser
const adminAPIKey = Environment.credentials().adminApiKey

describe('Admin API - Reset test case expected values', () => {

    beforeEach('Set Access Token', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.clearAllSessionStorage({ log: true })
    })

    afterEach('Clean up', () => {

        Utilities.deleteVersionedMeasure(measure.name, measure.libraryName)
        Utilities.deleteMeasure(measure.name, measure.libraryName, true)
    })

    it('Reset test case expected values of current draft back to state from last version of the measure', () => {

        // establish original measure - measureId
        CreateMeasurePage.CreateQICoreMeasureAPI(measure.name, measure.libraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI('title', 'series', 'desc', testCase)
        
        // set expected value "true" on test case
        let initialTestCase: any 
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((tcId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + tcId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        initialTestCase = response.body

                        cy.readFile('cypress/fixtures/groupId').should('exist').then((gId) => {

                            const tcExpectedValue = {
                                'groupId': gId,
                                'populationBasis': 'boolean',
                                'populationValues': [
                                    {
                                        'actual': true,
                                        'expected': true,
                                        'id': uuidv4(),
                                        'name': 'initialPopulation'
                                    }
                                ],
                                'scoring': 'Cohort',
                                'stratificationValues': []
                            }
                            initialTestCase.groupPopulations[0] = tcExpectedValue
                            cy.request({
                                failOnStatusCode: false,
                                url: '/api/measures/' + measureId + '/test-cases/' + tcId,
                                headers: {
                                    authorization: 'Bearer ' + accessToken.value
                                },
                                body: initialTestCase,
                                method: 'PUT'
                            }).then((response) => {
                                expect(response.status).to.eql(200)
                            })
                        })
                    })
                })
            })
        })

        // version measure
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
                    expect(response.body.version).to.include('1.0.000')
                })
            })
        })

        // create draft
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureAID) => {
                cy.readFile( 'cypress/fixtures/measureSetId').should('exist').then((mSetId) => {
                    cy.readFile('cypress/fixtures/versionId').should('exist').then((mVersionId) => {
                        cy.request({
                            url: '/api/measures/' + measureAID + '/draft',
                            method: 'POST',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                'measureSetId': mSetId,
                                'measureName': measure.name,
                                'cqlLibraryName': measure.libraryName,
                                'model': measure.model,
                                'createdBy': harpUser,
                                'cql': 'cohortMeasureCQL',
                                'elmJson': 'elmJson',
                                "ecqmTitle": "ecqmTitle",
                                'measurementPeriodStart': measure.mpStartDate + "T00:00:00.000Z",
                                'measurementPeriodEnd': measure.mpEndDate + "T00:00:00.000Z",
                                'versionId': mVersionId,
                            }

                        }).then((response) => {
                            expect(response.status).to.eql(201)
                            cy.writeFile('cypress/fixtures/measureId2', response.body.id)
                            cy.writeFile('cypress/fixtures/versionId2', response.body.versionId)
                         //   cy.writeFile('cypress/fixtures/measureSetId2', response.body.measureSetId)
                            cy.writeFile('cypress/fixtures/testCaseId2', response.body.testCases[0].id)
                        })
                    })
                })
            })
        })

        /* 
            current state:
            versioned measure = measureId, testCaseId - testcase expected value = true
            draft measure = measureId2, testCaseId2 - testcase expected value = true
        */

        // get testcase data on draft measure
        let testCaseResponse: TestCase
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((tcId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + tcId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        testCaseResponse = response.body

                        // update tc - expected value = false
                        testCaseResponse.groupPopulations[0].populationValues[0].expected = false

                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + measureId + '/test-cases/' + tcId,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'PUT',
                            body: testCaseResponse
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body.groupPopulations[0].populationValues[0].expected).eql(false)
                        })
                    })
                })
            })
        })

        // hit admin endpoint to reset draft measure's tc to versioned measure values
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    const versionedMeasure: Measure = response.body

                    cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId2) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/admin/measures/' + measureId2,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                                'api-key': adminAPIKey
                            },
                            method: 'PUT',
                            body: versionedMeasure
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                        })
                    })
                })
            })
        })

        // verify original (measureId) expected values (true) are same on measureId2
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((tcId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + tcId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.groupPopulations[0].populationValues[0].expected).eql(true)
                    })
                })
            })
        })
    })
})