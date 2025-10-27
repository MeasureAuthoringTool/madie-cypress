import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import {OktaLogin} from "../../../Shared/OktaLogin";

let measureSharingAPIKey = Environment.credentials().adminApiKey
let harpUserALT = ''
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Passing Test Case'
let testCaseDescription = 'DENOMPass' + Date.now()
let testCaseSeries = 'SBTestSeriesP'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations
let randValue = (Math.floor((Math.random() * 1000) + 1))


describe('Delete test Case: Newer end point / url that takes an list array of test case ids', () => {

    let newMeasureName = measureName + randValue
    let newCQLLibraryName = CqlLibraryName + randValue
    beforeEach('Create Measure, Group, Test Case and set access token', () => {
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

        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false, currentUser, currentAltUser)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId2').should('exist').then((testCaseId2) => {
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
                            expect(response.body).to.eql('Successfully deleted test cases: ' + testCaseId + ', ' + testCaseId2)
                        })
                    })
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
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
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId2').should('exist').then((testCaseId2) => {
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
        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false, currentUser, currentAltUser)
        harpUserALT = OktaLogin.getUser(true, currentUser, currentAltUser)
        //Share Measure with ALT User

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
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

        //set local user that does not own the measure
        OktaLogin.setupUserSession(true, currentUser, currentAltUser)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId2').should('exist').then((testCaseId2) => {
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
                            expect(response.body).to.eql('Successfully deleted test cases: ' + testCaseId + ', ' + testCaseId2)
                        })
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
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
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId2').should('exist').then((testCaseId2) => {
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
