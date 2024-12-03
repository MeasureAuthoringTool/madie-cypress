import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
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
let randValue = (Math.floor((Math.random() * 1000) + 1))

describe('Delete test Case: Older end point / url that takes id and title in the body of DELETE request', () => {

    beforeEach('Create Measure, Test Case and set access token', () => {

        cy.setAccessTokenCookie()
        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        //Create Test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

    })

    it('Delete test Case - Success scenario - Old end point', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
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

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Non Measure owner unable to delete Test Case', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
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
                        expect(response.body.message).to.include('User ' + harpUserALT + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })
})
describe('Delete test Case: Newer end point / url that takes an list array of test case ids', () => {

    let newMeasureName = measureName + randValue
    let newCQLLibraryName = CqlLibraryName + randValue
    beforeEach('Create Measure, Group, Test Case and set access token', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQLPFTests)
        //Create Test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseDescription + ' a', testCaseSeries + 'a', testCaseJson, false, false, false)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseDescription + ' b', testCaseSeries + 'b', testCaseJson, false, true, false)

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Delete test Case - Success scenario - New Delete End Point', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
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
                            expect(response.body).to.eql('Successfully deleted provided test cases')
                        })
                    })
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
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
                cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((testCaseId2) => {
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

    it('Delete test Case - user has had measure shared with them', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        //Share Measure with ALT User
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT',
                    body: {
                        "acls": [
                            {
                                "userId": harpUserALT,
                                "roles": [
                                    "SHARED_WITH"
                                ]
                            }
                        ],
                        "action": "GRANT"
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body[0].userId).to.eql(harpUserALT)
                    expect(response.body[0].roles[0]).to.eql('SHARED_WITH')
                })
            })
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
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
                            expect(response.body).to.eql('Successfully deleted provided test cases')
                        })
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
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
                    cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((testCaseId2) => {
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
