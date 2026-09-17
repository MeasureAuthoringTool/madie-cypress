import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { QiCore6Cql } from '../../../../Shared/FHIRMeasuresCQL'

const measureName = 'CohortEpisodeWithStrat' + Date.now()
const CqlLibraryName = 'CohortEpisodeWithStrat' + Date.now()
const testCaseTitle = 'PASS'
const testCaseDescription = 'PASS'
const testCaseSeries = 'SBTestSeries'
const testCaseJson = TestCaseJson.TestCaseJson_CohortEpisodeWithStrat_PASS
const measureCQL = QiCore6Cql.EpisodeWithStrat

describe('Measure Creation and Testing: Cohort Episode w/ Stratification', () => {
    before('Create Measure, Test Case and Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {
            measureCql: measureCQL,
            mpStartDate: '2022-01-01',
            mpEndDate: '2023-01-01',
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End Cohort Episode w/ Stratification, Pass Result', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true })

        // add stratification data to group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.stratificationTab).click()

        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Stratificaction 1')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //Navigate to Test Cases page and add Test Case details
        TestCasesPage.openTestCasesTabAndWaitForList()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })

        const expectedValues = [
            { selector: TestCasesPage.testCaseIPPExpected, value: '1' },
            { selector: TestCasesPage.initialPopulationStratificationExpectedValue, value: '1' },
        ]
        TestCasesPage.clearExpectedActualValues(expectedValues)
        TestCasesPage.typeExpectedActualValues(expectedValues)
        TestCasesPage.saveTestCaseAndWait({
            expectedPopulationValues: {
                initialPopulation: '1',
            },
        })

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.assertExpectedActualValues(expectedValues)

        TestCasesPage.openTestCasesTabAndWaitForList()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        TestCasesPage.assertTestCaseStatus(testCaseTitle, 'Pass')
    })
})
