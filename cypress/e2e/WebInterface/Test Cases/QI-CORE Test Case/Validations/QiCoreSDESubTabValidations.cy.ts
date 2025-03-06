import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"


const now = Date.now()
const measureName = 'QICoreSDETests' + now
const CqlLibraryName = 'QICoreSDETestsLib' + now
const qiCoreMeasureCQL = MeasureCQL.QiCoreCQLSDE.replace('QiCoreCQLLibrary1739988331418', measureName)
let firstTestCaseTitle = 'PDxNotPsych60Mins'
let testCaseDescription = 'IPPStrat1Pass'
let testCaseSeries = 'SBTestSeries'
let TCJsonRace = TestCaseJson.TCJsonRaceOMBRaceDetailed

describe('QiCore Test Cases : SDE Sub tab validations', () => {

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, qiCoreMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patients Age 20 or Older at Start of Measurement Period')
        TestCasesPage.CreateTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('SDE sub tab is visible on Edit Test case Highlighting page when SDE is included', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the SDE side tab section on the test cases tab
        Utilities.waitForElementEnabled(TestCasesPage.newTestCaseButton, 15500)
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        // access left menu - SDE = YES, save
        cy.get(TestCasesPage.includeSDERadioBtn).eq(0).click()
        cy.get(TestCasesPage.saveSDEOption).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Configuration Updated Successfully')

        //Add JSON for TC
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //add json to test case
        cy.wait(1500) // need this for editor to load data
        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

        //Execute test case
        cy.get(TestCasesPage.runTestButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.runTestButton, 9500)

        //Navigate to Highlighting tab
        cy.get(TestCasesPage.tcHighlightingTab).click()
        //Click on SDE Sub tab
        cy.get(TestCasesPage.qdmSDESubTab).click()

        Utilities.waitForElementVisible('[data-testid="sde-highlighting"] > :nth-child(1)', 35000)
        cy.get('[data-testid="sde-highlighting"] > :nth-child(1)').first().should('contain.text', 'define "SDE Ethnicity":\n' +
            '  SDE."SDE Ethnicity"')

        cy.get('[data-testid="results-section"]').first().invoke('text').then(resultsText => {
            expect(resultsText).to.contain('CDCREC 2135-2, Hispanic or Latino')
            expect(resultsText).to.contain('CDCREC 2184-0, Dominican')
            expect(resultsText).to.contain('CDCREC 2148-5, Mexican')
            expect(resultsText).to.contain(' display: "Hispanic or Latino"')
        })
    })

    it('SDE sub tab is not visible on Edit Test case Highlighting page when SDE is not included', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.newTestCaseButton, 15500)
        
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        // access left menu - SDE, verify NO is checked
        cy.get(TestCasesPage.includeSDERadioBtn).eq(1).should('be.checked')

        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.newTestCaseButton, 15500)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //add json to test case
        cy.wait(1500) // need this for editor to load data
        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

        //Execute test case
        cy.get(TestCasesPage.runTestButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.runTestButton, 9500)

        //Navigate to Highlighting tab
        cy.get(TestCasesPage.tcHighlightingTab).click()
        //Click on SDE Sub tab
        cy.get(TestCasesPage.qdmSDESubTab).should('not.exist')
    })

    it('Test Case Coverage Percentage updated based on the SDE selection', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //add json to test case
        cy.wait(1500) // need this for editor to load data
        cy.get(TestCasesPage.aceEditor).type(TCJsonRace, { parseSpecialCharSequences: false })

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

        //Execute test case
        cy.get(TestCasesPage.runTestButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.runTestButton, 9500)

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Execute test case
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 8500)

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')

        //Navigate to the SDE side tab and select Yes
        Utilities.waitForElementVisible(TestCasesPage.qdmSDESidNavLink, 30000)
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        cy.get(TestCasesPage.includeSDERadioBtn).eq(0).click()
        cy.get(TestCasesPage.saveSDEOption).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Configuration Updated Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Execute test case
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '68%')
    })
})
