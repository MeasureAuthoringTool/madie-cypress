import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../../Shared/Utilities"

const now = Date.now()
const measureName = 'RAVSubTab' + now
const CqlLibraryName = 'RAVSubTabLib' + now
const testCase: TestCase = {
    title: '60MinsDepart',
    description: 'example test case',
    group: 'SBTestSeries'
}
const qiCoreMeasureCQL = MeasureCQL.QiCoreCQLSDE.replace('QiCoreCQLLibrary1739988331418', measureName)
const testCaseLizzyHealth = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health

describe('QiCore Test Cases : RAV Sub tab validations', () => {

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, qiCoreMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patients Age 20 or Older at Start of Measurement Period')
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCaseLizzyHealth)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('RAV sub tab is visible on Edit Test case Highlighting page when RAV is included', () => {

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add RAV Data Elements
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save RAV data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the RAV side tab section on the test cases tab
        Utilities.waitForElementVisible(TestCasesPage.qdmRAVSideNavLink, 30000)
        cy.get(TestCasesPage.qdmRAVSideNavLink).click()

        // go through discard cycle 
        // patientBasis works for all 2 choice radios
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.discardRavChangesOption).click()
        Utilities.clickOnDiscardChanges()
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).should('be.checked')

        cy.get(TestCasesPage.saveRAVOption).should('be.disabled')
        cy.get(TestCasesPage.discardRavChangesOption).should('be.disabled')

        // re-do & save
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.saveRAVOption).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Configuration Updated Successfully')

        // check buttons disabled
        cy.get(TestCasesPage.saveRAVOption).should('be.disabled')
        cy.get(TestCasesPage.discardRavChangesOption).should('be.disabled')

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')

        //return to test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.wait('@callstacks', { timeout: 120000 })

        //Execute test case
        cy.get(TestCasesPage.runTestButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.runTestButton, 9500)

        //Navigate to Highlighting tab
        cy.get(TestCasesPage.tcHighlightingTab).click()
        //Click on RAV Sub tab
        cy.get(TestCasesPage.qdmRAVSubTab).click()
        Utilities.waitForElementVisible('[data-testid="rav-highlighting"]', 35000)
        cy.get('[data-testid="rav-highlighting"]').first().should('contain.text', 'define "SDE Ethnicity":\n  SDE."SDE Ethnicity"\nResultsFALSE (null)')
        cy.get('[data-testid="rav-highlighting"]').eq(3).should('contain.text', 'define "SDE Sex":\n  SDE."SDE Sex"\nResultsCODE: http:\/\/hl7.org/fhir/administrative-gender F, Female ')
    })

    it('RAV sub tab is not visible on Edit Test case Highlighting page when RAV is not included', () => {

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add RAV
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save RAV data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //Execute test case
        cy.get(TestCasesPage.runTestButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.runTestButton, 9500)

        //Navigate to Highlighting tab
        cy.get(TestCasesPage.tcHighlightingTab).click()
        //Click on RAV Sub tab
        cy.get(TestCasesPage.qdmRAVSubTab).should('not.exist')

    })

    it('Test Case Coverage Percentage updated based on the RAV selection', () => {

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        //Add RAV
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save RAV data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Execute test case
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '0%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')

        //Navigate to the RAV side tab and select Yes
        Utilities.waitForElementVisible(TestCasesPage.qdmRAVSideNavLink, 30000)
        cy.get(TestCasesPage.qdmRAVSideNavLink).click()

        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.saveRAVOption).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Configuration Updated Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Execute test case
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()


        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '29%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })
})
