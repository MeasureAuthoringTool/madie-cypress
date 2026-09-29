import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'

let measureName = 'CohortEpisodeEncounter' + Date.now()
let CqlLibraryName = 'CohortEpisodeEncounter' + Date.now()
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.CohortEpisodeEncounter_PASS

let measureCQL =
    "library CohortEpisodeEncounter1699460161402 version '0.0.000'\n\n" +
    "using QICore version '4.1.1'\n\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n" +
    "include CQMCommon version '1.0.000' called Global\n\n" +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    '   Global."Inpatient Encounter"'

// upgraded in CohortEncounter600
describe('Measure Creation and Testing: Cohort Episode Encounter', () => {
    before('Create Measure and Test Case', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(
            measureName,
            CqlLibraryName,
            measureCQL,
            0,
            false,
            '2012-01-02',
            '2013-01-01',
        )
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End Cohort Episode Encounter, Pass Result', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true })

        TestCasesPage.openTestCasesTabAndWaitForList()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        const expectedValues = [{ selector: TestCasesPage.testCaseIPPExpected, value: '1', clearFirst: true }]
        TestCasesPage.typeExpectedActualValues(expectedValues)
        TestCasesPage.saveTestCaseAndWait({ expectedPopulationValues: { initialPopulation: '1' } })

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.assertExpectedActualValues(expectedValues)

        TestCasesPage.runTestCaseAndWaitForCompletion()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')

        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.executeTestCasesAndWaitForCompletion()
        TestCasesPage.assertTestCaseStatus(testCaseTitle, 'Pass')
    })
})
