import { CreateMeasurePage, CreateMeasureOptions, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCase, TestCasesPage } from "../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { QiCore6Cql } from "../../../Shared/FHIRMeasuresCQL"
const dayjs = require('dayjs')

const now = Date.now()
const measureName = 'CalculatorDates' + now
const libraryName = 'CalculatorDatesLib' + now
const testCase: TestCase = {
    title: 'cohortEnc',
    description: 'testing test cases',
    group: 'IPPass',
    json: TestCaseJson.fromCMS529IPP
}
const opts: CreateMeasureOptions = {
    // test measure based on CMS529FHIR, same config as CohortEncounter600.cy.ts
    measureCql: QiCore6Cql.cqlCMS529, 
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}
const today = dayjs().format('MM/DD/YYYY')

describe('Check all variations of calculated dates', () => {

    beforeEach('Create Measure and Test Case', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6, opts)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.openDateCalculator).click()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure()
    })

    it('Check all options in Duration/Difference tab', () => {

        // verify initial
        cy.contains('Start Date').should('be.visible')
        cy.contains('End Date').should('be.visible')
        cy.contains('Precision').should('be.visible')
        cy.contains('Duration Result').should('be.visible')
        cy.contains('Difference Result').should('be.visible')

        // years, enter start end calculate
        cy.get(TestCasesPage.calculatorTool.startDate).type('01/01/2020')
        cy.get(TestCasesPage.calculatorTool.endDate).type('06/01/2020')
        cy.get(TestCasesPage.calculatorTool.calculateDuration).click()

        cy.get(TestCasesPage.calculatorTool.durationResults).should('have.text', '0 years')
        cy.get(TestCasesPage.calculatorTool.differenceResults).should('have.text', '1 years')

        // switch to months, check include end date
        Utilities.dropdownSelect(TestCasesPage.calculatorTool.precision, 'months')
        cy.get(TestCasesPage.calculatorTool.includeEndDateCheckbox).click()
        cy.get(TestCasesPage.calculatorTool.calculateDuration).click()

        cy.get(TestCasesPage.calculatorTool.durationResults).should('have.text', '5 months')
        cy.get(TestCasesPage.calculatorTool.differenceResults).should('have.text', '6 months')

        // switch to weeks, leave include on
        Utilities.dropdownSelect(TestCasesPage.calculatorTool.precision, 'weeks')
        cy.get(TestCasesPage.calculatorTool.calculateDuration).click()

        cy.get(TestCasesPage.calculatorTool.durationResults).should('have.text', '21 weeks')
        cy.get(TestCasesPage.calculatorTool.differenceResults).should('have.text', '22 weeks')

        //switch to days
        Utilities.dropdownSelect(TestCasesPage.calculatorTool.precision, 'days')
        cy.get(TestCasesPage.calculatorTool.calculateDuration).click()

        cy.get(TestCasesPage.calculatorTool.durationResults).should('have.text', '153 days')
        cy.get(TestCasesPage.calculatorTool.differenceResults).should('have.text', '153 days')

        // click on both Today buttons
        cy.get('[data-testid="ds-btn"]').eq(0).click()
        cy.get(TestCasesPage.calculatorTool.startDate).should('have.value', today)

        cy.get('[data-testid="ds-btn"]').eq(1).click()
        cy.get(TestCasesPage.calculatorTool.endDate).should('have.value', today)

        // close
        cy.get(TestCasesPage.calculatorTool.close).click()
    })

    it('Check all options in Computed Date tab', () => {

        cy.get(TestCasesPage.calculatorTool.computedDateTab).click()

        // verify initial
        cy.contains('Initial Date').should('be.visible')
        cy.contains('Add/Subtract').should('be.visible')
        cy.contains('Days/Weeks/Months/Years').should('be.visible')
        cy.contains('Computed Date Result').should('be.visible')

        cy.get(TestCasesPage.calculatorTool.initialDate).type('02/01/2023')

        cy.get(TestCasesPage.calculatorTool.addRadio).should('be.checked')

        cy.get(TestCasesPage.calculatorTool.dwmyInput).type('2')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '02/01/2025')

        Utilities.dropdownSelect(TestCasesPage.calculatorTool.dwmyUnitsSelect, 'months')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '04/01/2023')

        Utilities.dropdownSelect(TestCasesPage.calculatorTool.dwmyUnitsSelect, 'weeks')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '02/15/2023')

        Utilities.dropdownSelect(TestCasesPage.calculatorTool.dwmyUnitsSelect, 'days')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '02/03/2023')

        cy.get(TestCasesPage.calculatorTool.subtractRadio).check()

        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '01/30/2023')

        Utilities.dropdownSelect(TestCasesPage.calculatorTool.dwmyUnitsSelect, 'months')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '12/01/2022')

        Utilities.dropdownSelect(TestCasesPage.calculatorTool.dwmyUnitsSelect, 'weeks')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '01/18/2023')

        Utilities.dropdownSelect(TestCasesPage.calculatorTool.dwmyUnitsSelect, 'years')
        cy.get(TestCasesPage.calculatorTool.calculateDate).click()
        cy.get(TestCasesPage.calculatorTool.computedDateResults).should('have.text', '02/01/2021')
    })
})