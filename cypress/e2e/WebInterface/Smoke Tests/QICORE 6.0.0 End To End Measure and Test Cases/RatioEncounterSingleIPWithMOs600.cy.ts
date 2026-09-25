import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCase, TestCasesPage } from '../../../../Shared/TestCasesPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { QiCore6Cql } from '../../../../Shared/FHIRMeasuresCQL'

const now = Date.now()
const measureName = 'RatioEncWithMOs' + now
const libraryName = 'RatioEncWithMOsLib' + now
const testCase: TestCase = {
    title: 'ratioEnc with MOs',
    description: 'testing test cases',
    group: 'IPPass',
    json: TestCaseJson.fromCMS1017NumPass,
}
const opts: CreateMeasureOptions = {
    measureCql: QiCore6Cql.cqlCMS1017, // test measure based on CMS1017FHIR
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31',
}

// covers both RatioEpisodeSingleIPNoMO and RatioEpisodeTwoIPsWithMOs
describe('Measure Creation and Testing: Ratio Encounter Single IP w/ MOs', () => {
    before('Create Measure and Test Case', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6, opts)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(
            false,
            false,
            'Initial Population',
            'Numerator',
            'Denominator',
            'Encounter',
        )
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)

        OktaLogin.Login()
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End - Numerator Pass Result', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        // Add measure observations to the API-created group.
        EditMeasurePage.openPopulationCriteriaTab(MeasureGroupPage.addDenominatorObservationLink)

        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('be.visible').click()
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Denominator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')

        cy.get(MeasureGroupPage.addNumeratorObservationLink).should('be.visible').click()
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'Numerator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Count')

        cy.intercept('PUT', '/api/measures/**/groups*').as('updateMeasureGroup')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@updateMeasureGroup', { timeout: 60000 })
            .its('response.statusCode')
            .should('be.oneOf', [200, 201, 202])

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 30000)

        TestCasesPage.openTestCasesTabAndWaitForList()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        const expectedValues = [
            { selector: TestCasesPage.testCaseDENOMExpected, value: '1' },
            { selector: TestCasesPage.testCaseDENEXExpected, value: '1' },
            { selector: TestCasesPage.testCaseNUMERExpected, value: '1' },
            { selector: TestCasesPage.testCaseNUMEXExpected, value: '1' },
            // Population updates rerender the Initial Population controlled input; enter it last.
            { selector: TestCasesPage.testCaseIPPExpected, value: '1' },
        ]
        TestCasesPage.clearExpectedActualValues(expectedValues)
        TestCasesPage.typeExpectedActualValues(expectedValues)

        TestCasesPage.openDetailsTab(TestCasesPage.editTestCaseSaveButton)
        TestCasesPage.saveTestCaseAndWait()

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        TestCasesPage.assertExpectedActualValues(expectedValues)

        TestCasesPage.runTestCaseAndWaitForCompletion()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')

        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.executeTestCasesAndWaitForCompletion()
        TestCasesPage.assertTestCaseStatus(testCase.title, 'Pass')
    })
})
