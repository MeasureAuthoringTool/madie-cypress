import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Toasts } from "../../../../Shared/Toasts"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"

const now = Date.now()
const measureName = 'CohortEncounter600' + now
const libraryName = 'CohortEncounter600Lib' + now
const testCase: TestCase = {
    title: 'cohortEnc',
    description: 'testing test cases',
    group: 'IPPass',
    json: TestCaseJson.fromCMS529IPP
}
const opts: CreateMeasureOptions = {
    measureCql: QiCore6Cql.cqlCMS529, // test measure based on CMS529FHIR
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}

describe('Measure Creation and Testing: Cohort Episode Encounter', () => {

    before('Create Measure and Test Case', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6, opts)

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit', null)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, libraryName)
    })

    it('End to End Cohort Episode Encounter, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.testCasesTab).wait(2500).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(Toasts.otherSuccessToast).should('contain.text', 'Test case updated successfully')

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
