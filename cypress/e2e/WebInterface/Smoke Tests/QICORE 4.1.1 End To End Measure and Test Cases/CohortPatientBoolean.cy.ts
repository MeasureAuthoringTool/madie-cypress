import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'

let measureName = 'CohortPatientBoolean' + Date.now()
let CqlLibraryName = 'CohortPatientBoolean' + Date.now()
let measureCQL = MeasureCQL.QICORE_CQL_CohortPatientBoolean
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS

describe('Measure Creation and Testing: Cohort Patient Boolean', () => {
    before('Create Measure, Test Case and Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(
            measureName,
            CqlLibraryName,
            measureCQL,
            0,
            false,
            '2012-01-01',
            '2012-12-31',
        )
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End Cohort Patient Boolean, Pass Result', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true })

        TestCasesPage.openTestCasesTabAndWaitForList()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        const expectedSelections = [{ selector: TestCasesPage.testCaseIPPExpected }]
        TestCasesPage.checkExpectedActualCheckboxes(expectedSelections)

        TestCasesPage.saveTestCaseAndWait()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.assertExpectedActualCheckboxesChecked(expectedSelections)

        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.executeTestCasesAndWaitForCompletion()
        TestCasesPage.assertTestCaseStatus(testCaseTitle, 'Pass')
    })
})
