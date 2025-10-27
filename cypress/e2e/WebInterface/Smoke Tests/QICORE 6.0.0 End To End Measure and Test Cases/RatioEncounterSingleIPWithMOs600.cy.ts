import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { Toasts } from "../../../../Shared/Toasts"

const now = Date.now()
const measureName = 'RatioEncWithMOs' + now
const libraryName = 'RatioEncWithMOsLib' + now
const testCase: TestCase = {
    title: 'ratioEnc with MOs',
    description: 'testing test cases',
    group: 'IPPass',
    json: TestCaseJson.fromCMS1017NumPass
}
const opts: CreateMeasureOptions = {
    measureCql: QiCore6Cql.cqlCMS1017, // test measure based on CMS1017FHIR
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}

describe('Measure Creation and Testing: Ratio Encounter Single IP w/ MOs', () => {

    before('Create Measure and Test Case', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6, opts)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Numerator', 'Denominator', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, libraryName)
    })

    it('End to End - Numerator Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get('[data-value="Denominator Observation"]').click()
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get('[data-value="Sum"]').click()

        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get('[data-value="Numerator Observation"]').click()
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get('[data-value="Count"]').click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')

        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')

        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXExpected).type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(Toasts.otherSuccessToast, { timeout: 7500 }).should('contain.text', 'Test case updated successfully! Test case validation has started running, please continue working in MADiE.Timezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

    })
})
