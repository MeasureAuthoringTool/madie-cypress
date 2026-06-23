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
import { Toasts } from '../../../../Shared/Toasts'

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
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.initialPopulationStratificationExpectedValue).should('be.enabled')
        cy.get(TestCasesPage.initialPopulationStratificationExpectedValue).type('1')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(Toasts.otherSuccessToast).should(
            'contain.text',
            'Test case updated successfully! Test case validation has started running, please continue working in MADiE.',
        )

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
