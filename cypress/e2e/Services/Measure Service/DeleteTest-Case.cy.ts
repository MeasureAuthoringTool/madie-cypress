import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Header } from "../../../Shared/Header"
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

    it('Verify Non Measure owner unable to delete Test Case', () => {

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
})
describe('Delete test Case: Newer end point / url that takes an list array of test case ids', () => {

    beforeEach('Create Measure, Group, Test Case and set access token', () => {

        cy.setAccessTokenCookie()
        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        //Create Test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'a', testCaseDescription + ' a', testCaseSeries + 'a', testCaseJson, false, false)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + 'b', testCaseDescription + ' b', testCaseSeries + 'b', testCaseJson, false, true)
        OktaLogin.Login()
        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc)
            .click()
            .type('Some description')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMsg, 35000)
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group updated successfully.')
        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)
        MeasuresPage.measureAction("edit")
        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)
        MeasuresPage.measureAction("edit")
        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit', true)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Delete test Case - Success scenario - New Delete End Point', () => {

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
                            expect(response.body).to.eql('Succesfully deleted provided test cases')
                        })
                    })
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
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
                            expect(response.body.message).contains('User ' + harpUser + ' is not authorized for Measure with ID ')
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
                            expect(response.body).to.eql('Succesfully deleted provided test cases')
                        })
                    })
                })
            })
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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