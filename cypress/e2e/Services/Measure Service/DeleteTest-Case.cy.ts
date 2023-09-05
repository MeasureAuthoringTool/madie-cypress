import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"

let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
let harpUserALT = Environment.credentials().harpUserALT
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Passing Test Case'
let testCaseDescription = 'DENOMPass' + Date.now()
let testCaseSeries = 'SBTestSeriesP'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations
let harpUser = Environment.credentials().harpUserALT

describe('Delete test Case: Older end point / url that takes id and title in the body of DELETE request', () => {

    beforeEach('Create Measure, Test Case and set access token', () => {

        cy.setAccessTokenCookie()
        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        //Create Test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Delete test Case - Success scenario - Old end point', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        method: 'DELETE',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "id": testCaseId,
                            "title": testCaseTitle
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql('Test case deleted successfully: ' + testCaseId)
                    })
                })
            })
        })
    })

    it('Verify Non Measure owner unable to delete Test Case', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        method: 'DELETE',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "id": testCaseId,
                            "title": testCaseTitle
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.include('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })
})
describe('Delete test Case: Newer end point / url that takes an list array of test case ids', () => {

    beforeEach('Create Measure, Group, Test Case and set access token', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        //Create Test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseDescription + ' a', testCaseSeries + 'a', testCaseJson, false, false, false)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseDescription + ' b', testCaseSeries + 'b', testCaseJson, false, true, false)

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Delete test Case - Success scenario - New Delete End Point', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.wait(1000)
                    cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((testCaseId2) => {
                        cy.request({
                            url: '/api/measures/' + measureId + '/test-cases',
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body:
                                [
                                    testCaseId, testCaseId2
                                ]

                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).to.eql('Succesfully deleted provided test cases')
                        })
                    })
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(404)
                        expect(response.body.message).to.eql('Could not find Test Case with id: ' + testCaseId)
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testcaseId2').should('exist').then((testCaseId2) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId2,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(404)
                        expect(response.body.message).to.eql('Could not find Test Case with id: ' + testCaseId2)
                    })
                })
            })
        })

    })
    it('Delete test Case - user trying to delete is not owner of measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.wait(1000)
                    cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((testCaseId2) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + measureId + '/test-cases',
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body:
                                [
                                    testCaseId, testCaseId2
                                ]

                        }).then((response) => {
                            expect(response.status).to.eql(403)
                            expect(response.body.message).to.include('User ' + harpUser + ' is not authorized for Measure with ID ')
                        })
                    })
                })
            })
        })
    })
    it('Delete test Case - user has had measure shared with them', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //Share Measure with ALT User
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.wait(1000)
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.wait(1000)
                    cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((testCaseId2) => {
                        cy.request({
                            url: '/api/measures/' + measureId + '/test-cases',
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body:
                                [
                                    testCaseId, testCaseId2
                                ]

                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).to.eql('Succesfully deleted provided test cases')
                        })
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.wait(1000)
                    cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'GET',
                        }).then((response) => {
                            expect(response.status).to.eql(404)
                            expect(response.body.message).to.eql('Could not find Test Case with id: ' + testCaseId)
                        })
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.wait(1000)
                    cy.readFile('cypress/fixtures/testcaseId2').should('exist').then((testCaseId2) => {
                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/measures/' + id + '/test-cases/' + testCaseId2,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'GET',
                        }).then((response) => {
                            expect(response.status).to.eql(404)
                            expect(response.body.message).to.eql('Could not find Test Case with id: ' + testCaseId2)
                        })
                    })
                })
            })
        })
    })
})
