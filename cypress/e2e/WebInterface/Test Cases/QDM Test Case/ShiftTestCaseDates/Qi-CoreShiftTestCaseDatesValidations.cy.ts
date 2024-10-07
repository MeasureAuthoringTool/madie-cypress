import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import {TestCaseJson} from "../../../../../Shared/TestCaseJson"

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreLibrary' + Date.now()
let measureCQL = MeasureCQL.CQL_Multiple_Populations
let testCaseTitle = 'First Test case'
let secondTestCaseTitle = 'Second Test case'
let testCaseDescription = 'First Test Group'
let testCaseSeries = 'SBTestSeries'
let validTestCaseJson = TestCaseJson.TestCaseJson_ShiftTCDates
let secondTestCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Shift Test Case Dates tests for Qi-Core Measure', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
        cy.get(EditMeasurePage.cqlEditorTextBox).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false,
            'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'Boolean')

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, testCaseDescription, testCaseSeries, secondTestCaseJson, false, true)
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('MADiE Shift Test Case Dates -> Shift All Test Case\'s dates for Qi-Core Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the page to utilize the shift *all* test case feature
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('4')

        //confirm buttons that appear on page to either discard or save the shift dates
        Utilities.waitForElementEnabled(TestCasesPage.shiftAllTestCasesDiscardBtn, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)

        //discard shifting dates
        cy.get(TestCasesPage.shiftAllTestCasesDiscardBtn).click()

        //confirm discarding change on page
        cy.get(TestCasesPage.continueDiscardChangesBtn).click()
        //confirm that shift test case text box is empty
        cy.get(TestCasesPage.shiftAllTestCaseDates).should('be.empty')

        //enter new value in the shift test case text box
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get(TestCasesPage.shiftAllTestCasesSuccessMsg).should('contain.text', 'All Test Case dates successfully shifted.')

        //Validate if the Measurement period start date is updated for first Test case
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
                        expect(response.body.title).to.eql('First Test case')
                        expect(response.body.json).to.contain('"start" : "2027-01-01T03:34:10.054Z"')

                    })
                })
            })
        })

        //Validate if the Measurement period start date is updated for second Test case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId2').should('exist').then((testCaseId2) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId2,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId2)
                        expect(response.body.title).to.eql('Second Test case')
                        expect(response.body.json).to.contain('"start" : "2025-05-13T03:34:10.054Z"')
                    })
                })
            })
        })
    })

    it('MADiE Shift Test Case Dates -> Shift single / specific test case\'s dates for Qi-Core Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', false)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).type('3')

        //shiftSpecificTestCasesCancelBtn
        cy.get(TestCasesPage.shiftSpecificTestCasesCancelBtn).click()

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', false)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get('[class="toast success"]').should('contain.text', 'Test Case Shift Dates for First Test Group - First Test case successful.')

        //Validate if the Measurement period start date is updated for first Test case
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
                        expect(response.body.title).to.eql('First Test case')
                        expect(response.body.json).to.contain('"start" : "2021-01-01T03:34:10.054Z"')

                    })
                })
            })
        })
    })
})