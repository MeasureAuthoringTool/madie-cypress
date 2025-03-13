import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { Global } from "../../../../../Shared/Global"

const now = Date.now()
const measureName = 'QiCoreShiftDates' + now
const CqlLibraryName = 'QiCoreShiftDatesLib' + now
const measureCQL = MeasureCQL.CQL_Multiple_Populations.replace('TestLibrary4664', measureName)
const testCase1: TestCase = {
    title: 'First Test case',
    description: 'First Test Group',
    group: 'SBTestSeries',
    json: TestCaseJson.TestCaseJson_ShiftTCDates
}
const testCase2: TestCase = {
    title: 'Second Test case',
    description: 'Second Test Group',
    group: 'SBTestSeries',
    json: TestCaseJson.TestCaseJson_Valid
}
const testCaseErrorTst: TestCase = {
    title: 'Erroring Test case',
    description: 'Erroring Test Group',
    group: 'SBTestSeriesError',
    json: null
}

describe('Shift Test Case Dates tests - Qi-Core Measure', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false,
            'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'Boolean')

        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, testCase2.json, false, true)
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    /* 2/14/25 - did not change any steps to this test
        only updated the title for clarity compared to
        the new action center workflow for the same operation
    */
    it('Shift all Test Case dates to the future using the tab in left menu', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the page to utilize the shift *all* test case feature
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('4')

        //confirm buttons that appear on page to either discard or save the shift dates
        Utilities.waitForElementEnabled(Global.DiscardCancelBtn, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)

        //discard shifting dates
        cy.get(Global.DiscardCancelBtn).click()

        //confirm discarding change on page
        cy.get(Global.discardChangesContinue).click()
        //confirm that shift test case text box is empty
        cy.get(TestCasesPage.shiftAllTestCaseDates).should('be.empty')

        //enter new value in the shift test case text box
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 3500)

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
                        expect(response.body.title).to.eql(testCase1.title)
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
                        expect(response.body.title).to.eql(testCase2.title)
                        expect(response.body.json).to.contain('"start" : "2025-05-13T03:34:10.054Z"')
                    })
                })
            })
        })
    })

    it('Shift single test case dates to the past using the acion center option', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).type('3')

        //shiftSpecificTestCasesCancelBtn
        cy.get(TestCasesPage.shiftSpecificTestCasesCancelBtn).click()

        // re-activate action center
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 3500)

        //confirm success message
        cy.get(TestCasesPage.TestCasesSuccessMsg).should('contain.text', 'All Test Case dates successfully shifted.')

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
                        expect(response.body.title).to.eql(testCase1.title)
                        expect(response.body.json).to.contain('"start" : "2021-01-01T03:34:10.054Z"')
                    })
                })
            })
        })
    })
})

describe('Shift Test Case Dates tests - Qi-Core Measure', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false,
            'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'Boolean')

        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
        TestCasesPage.CreateTestCaseAPI(testCaseErrorTst.title, testCaseErrorTst.group, testCaseErrorTst.description, testCaseErrorTst.json, false, true)
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Shift test case date error message, when test case is erroroneous, on the Test Case Data', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the page to utilize the shift *all* test case feature
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('4')

        //confirm buttons that appear on page to either discard or save the shift dates
        Utilities.waitForElementEnabled(Global.DiscardCancelBtn, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)

        //discard shifting dates
        cy.get(Global.DiscardCancelBtn).click()

        //confirm discarding change on page
        cy.get(Global.discardChangesContinue).click()
        //confirm that shift test case text box is empty
        cy.get(TestCasesPage.shiftAllTestCaseDates).should('be.empty')

        //enter new value in the shift test case text box
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.executionContextWarning, 50000)
        cy.get(TestCasesPage.executionContextWarning).should('contain.text', 'The following Test Case dates could not be shifted. Please try again. If the issue continues, please contact helpdesk.SBTestSeriesError - Erroring Test case')

    })
    it('Shift test case date error message, when test case is erroroneous, through the Action center buttons', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).type('3')

        //shiftSpecificTestCasesCancelBtn
        cy.get(TestCasesPage.shiftSpecificTestCasesCancelBtn).click()

        // re-activate action center
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.executionContextWarning, 50000)
        cy.get(TestCasesPage.executionContextWarning).should('contain.text', 'The following Test Case dates could not be shifted. Please try again. If the issue continues, please contact helpdesk.SBTestSeriesError - Erroring Test case')
    })
})