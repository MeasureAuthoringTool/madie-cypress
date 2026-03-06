import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin";

const measureName = 'ServiceDeleteTC' + Date.now()
const CqlLibraryName = 'ServiceDeleteTCLib' + Date.now()
const testCaseTitle = 'Passing Test Case'
const testCaseDescription = 'DENOMPass' + Date.now()
const testCaseSeries = 'SBTestSeriesP'
const testCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQLPFTests = MeasureCQL.CQL_Populations
const randValue = (Math.floor((Math.random() * 1000) + 1))
let harpUser = ''
let harpUserALT = ''


describe('Delete test Case: Newer end point / url that takes an list array of test case ids - simple delete', () => {

    let newMeasureName = measureName + randValue
    let newCQLLibraryName = CqlLibraryName + randValue
    beforeEach('Create Measure, Group, Test Case and set access token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQLPFTests)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseDescription + ' a', testCaseSeries + 'a', testCaseJson, false, false, false)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseDescription + ' b', testCaseSeries + 'b', testCaseJson, false, true, false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Delete test Case - Success scenario - New Delete End Point', () => {

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)

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

        const currentUser = Cypress.env('selectedUser')
        harpUser = OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        //Share Measure with ALT User
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        //set local user that does not own the measure - harpUserAlt
        OktaLogin.setupUserSession(true)
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

                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(404)
                        expect(response.body.message).to.eql('Could not find Test Case with id: ' + testCaseId)
                    })
                })

                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId2').should('exist').then((testCaseId2) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId2,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(404)
                        expect(response.body.message).to.eql('Could not find Test Case with id: ' + testCaseId2)
                    })
                })

                // force unlock to allow clean up
                cy.request({
                    url: '/api/measures/unlock',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                    },
                    method: 'DELETE'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })
})
