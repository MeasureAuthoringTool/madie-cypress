import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let harpUser = Environment.credentials().harpUserALT

describe('Delete test Case', () => {

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

    it('Delete test Case - Success scenario', () => {

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
    })

    it.only('Verify Non Measure owner unable to delete Test Case', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
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
                        expect(response.body.message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })

    it.only('Verify owner signed in with camel cased user id can delete Test Case', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the measure
        cy.setAccessTokenCookieCAMELCASE()

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
    })
})