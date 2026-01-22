import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { 
    CVGroups, 
    MeasureGroupPage, 
    MeasureGroups, 
    MeasureScoring, 
    MeasureType, 
    PopulationBasis 
} from "../../../../Shared/MeasureGroupPage"

let measureName = 'CVPatientWithMO' + Date.now()
let CqlLibraryName = 'CVPatientWithMO' + Date.now()
let measureCQL = MeasureCQL.QICORE_CQL_CVPatientwithMO
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.CVPatientWithMO_PASS

describe('Measure Creation and Testing: CV Patient With MO', () => {

    // backwards compatability - declare this empty, then in CreateMeasureGroupAPI 
    // the CVGroups values will overwrite it all
    const pops: MeasureGroups = {
        initialPopulation: '',
        numerator: '',
        denominator: ''
    }
    const cvPops: CVGroups = {
        initialPopulation: 'Initial Population 1',
        measurePopulation: 'Initial Population 1',
        observation: {
            aggregateMethod: 'Maximum',
            definition: 'Measure Observation'
        }
    }

    before('Create Measure, Test Case and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-01', '2012-12-31')
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.boolean, MeasureScoring.ContinousVariable, 
                        pops, false, null, null, cvPops)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure()
    })

    it('End to End CV Patient with MO, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible').wait(2000)

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).check().should('be.checked')
        cy.get(TestCasesPage.measureObservationRow).type('1')

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
