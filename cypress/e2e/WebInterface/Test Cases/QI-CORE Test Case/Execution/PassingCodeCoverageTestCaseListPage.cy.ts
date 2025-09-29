import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { QiCore4Cql } from "../../../../../Shared/FHIRMeasuresCQL"

const measureName = 'PCCTCList' + Date.now()
const CqlLibraryName = 'PCCTCListLib' + Date.now()
const testCaseTitle = 'Title for Auto Test'
const secondTestCaseTitle = 'Second Test case'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid_w_All_Encounter
const measureCQL = QiCore4Cql.reduced_CQL_Multiple_Populations

describe('Code Coverage Highlighting', () => {

    beforeEach('Create Measure', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false,
            'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'Boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, false, true)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
        cy.get(EditMeasurePage.cqlEditorTextBox).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure()
    })

    it('Validate Passing and Code Coverage tabs contain the initial "-" value, and displays a percentage when Test Case is ran', () => {

        //navigate to the test case list page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //verify initial "-" value, appears in the passing and code coverage tabs
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '-')

        //click on edit button to go into the edit form for the test case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate back to the test case list page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //click the Execute Test Cases button
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('not.contain.text', '-')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()
        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should('contain.text', '\ndefine "Initial Population":\n   true\n')
    })

    it('Verify Measure highlighting for multiple Measure groups on test case list page', () => {

        //Add second Measure group
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30700)
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('be.visible')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.leftNavMenuList).should('contain', 'Population Criteria 1')
        cy.get(TestCasesPage.leftNavMenuList).should('contain', 'Population Criteria 2')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100% Coverage')

        //Verify Highlighting for first Measure group
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

       cy.get(TestCasesPage.testCaseListCoverageHighlighting).should('contain.text', '\ndefine "Initial Population":\n   true\n')

        //Verify Highlighting for second Measure group
        cy.get(TestCasesPage.leftNavMenuList).contains('Population Criteria 2').click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100% Coverage')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

       cy.get(TestCasesPage.testCaseListCoverageHighlighting).should('not.contain.text', '\ndefine "Initial Population":\n   true\n')
    })
})
