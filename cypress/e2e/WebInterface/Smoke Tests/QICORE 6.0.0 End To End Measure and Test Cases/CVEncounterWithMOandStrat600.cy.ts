import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CVGroups, MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../Shared/MeasureGroupPage"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { Toasts } from "../../../../Shared/Toasts"
import { PopulationType, Stratification } from "@madie/madie-models"
import { v4 as uuidv4 } from 'uuid'

/*  this test essentially combines the 
    4.1.1 CVEpisodeWithMO.cy.ts & CVEpisodeWithStratification.cy.ts
    into a single scenario
*/
const now = Date.now()
const measureName = 'CVPatientWithStrat6' + now
const libraryName = 'CVPatientWithStrat6Lib' + now
const testCase: TestCase = {
    title: 'cv patient with strat',
    description: 'testing test cases',
    group: 'IPPass',
    json: TestCaseJson.fromCMS1272Strata1
}
const opts: CreateMeasureOptions = {
    measureCql: QiCore6Cql.cqlCMS1272, // test measure based on CMS1272
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}
// backwards compatability - declare this empty, then in CreateMeasureGroupAPI 
// the CVGroups values will overwrite it all
const pops: MeasureGroups = {
    initialPopulation: '',
    numerator: '',
    denominator: ''
}
const cvPops: CVGroups = {
    initialPopulation: 'Initial Population',
    measurePopulation: 'Measure Population',
    observation: {
        aggregateMethod: "Median",
        definition: "Measure Observation"
    }
}
const strats: Array<Stratification> = [
    {
        id:  uuidv4(),
        description: "Stratification 1: Pain medication administered via parenteral route",
        cqlDefinition: "Stratification 1",
        associations: [
        PopulationType.INITIAL_POPULATION,
        PopulationType.MEASURE_POPULATION
        ]
    },
    {
        id:  uuidv4(),
        description: "Stratification 2: Pain medication administered via non-parenteral route",
        cqlDefinition: "Stratification 2",
        associations: [
        PopulationType.INITIAL_POPULATION,
        PopulationType.MEASURE_POPULATION
        ]
    }
]

describe.skip('Measure Creation and Testing: CV Patient Measure With Stratification', () => {

    before('Create Measure, Test Case and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6, opts)
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.encounter, MeasureScoring.ContinousVariable, pops, false, null, null, cvPops)
        MeasureGroupPage.addStratificationDataAPI(strats)
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, libraryName)
    })

    it('End to End CV Encounter Measure with MO and Stratification, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{upArrow}{upArrow}{end}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')
        cy.wait('@callstacks', { timeout: 120000 })

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
      //  cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).type('1')
        //.check().should('be.checked')
        cy.get(TestCasesPage.measureObservationRow).clear().type('125')

        //goood til here - strata not showing

        cy.get(TestCasesPage.initialPopulationStratificationExpectedValue).type('1')
        cy.get(TestCasesPage.measurePopulationStratificationExpectedValue).type('1')
        cy.get(TestCasesPage.initialPopulationStrata2ExpectedValue).type('0')
        cy.get(TestCasesPage.measurePopulationStrata2ExpectedValue).type('0')


        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(Toasts.otherSuccessToast, { timeout: 7500 }).should('contain.text', 'Test case updated successfully!MADiE enforces a UTC (offset 0) timestamp format with mandatory millisecond precision. All timestamps with non-zero offsets have been overwritten to UTC, and missing milliseconds have been defaulted to \'000\'.')
        //.should('contain.text', Toasts.successOffsetText)

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
