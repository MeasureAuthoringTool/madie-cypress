import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { TestCasesPage } from "../../../Shared/TestCasesPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue

describe('QI-Core Single Test Case Export', () => {

    beforeEach('Create measure, test case, login, and make an edit to the test case', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        OktaLogin.Login()

        MeasuresPage.measureAction("edit")
        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit')
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()
        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')
        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)
        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    afterEach('Logout and Clean up Measures', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Export single QI-Core Test case', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/exports',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: [
                            testCaseId
                        ]
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).is.not.empty
                    })
                })
            })
        })

    })
})

describe('QI-Core Multiple Test Case Export', () => {

    beforeEach('Create measure, test case, login, and make an edit to the test cases', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + '2', testCaseSeries + '2', testCaseDescription + '2', testCaseJson, true)
        OktaLogin.Login()

        MeasuresPage.measureAction("edit")
        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit')
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()
        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')
        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)
        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit', true)
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    afterEach('Logout and Clean up Measures', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Export All QI-Core Test cases', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
                    cy.readFile('cypress/fixtures/testcaseId2').should('exist').then((testCaseId2) => {
                        cy.request({
                            url: '/api/measures/' + id + '/test-cases/exports',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            method: 'PUT',
                            body: [
                                testCaseId, testCaseId2
                            ]
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).is.not.empty
                        })
                    })
                })
            })
        })
    })
})
