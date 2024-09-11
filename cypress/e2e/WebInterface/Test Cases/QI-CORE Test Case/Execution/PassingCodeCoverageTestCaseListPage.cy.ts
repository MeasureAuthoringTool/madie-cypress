import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let secondTestCaseTitle = 'Second Test case'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid_w_All_Encounter
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let measureCQL = MeasureCQL.CQL_Multiple_Populations

describe('Code Coverage Highlighting', () => {

    beforeEach('Create Measure', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
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
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false,
            'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'Boolean')

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, false, true)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Validate Passing and Code Coverage tabs contain the initial "-" value, and displays a percentage when Test Case is ran', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //navigate to the test case list page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //verify initial "-" value, appears in the passing and code coverage tabs
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '-')

        //click on edit button to go into the edit form for the test case
        TestCasesPage.clickEditforCreatedTestCase

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
        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should('contain.text', 'define fluent function "isFinishedEncounter"(Enc Encounter):\n' +
            '(Enc E where E.status = \'finished\') is not null')

    })

    //Skipping due to bug MAT-7668
    it.skip('Verify Measure highlighting for multiple Measure groups on test case list page', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add second Measure group
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Qualifying Encounters')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.tcPopulationCriteriaNavLink).should('contain', 'Population Criteria 1')
        cy.get(TestCasesPage.tcPopulationCriteriaNavLink).should('contain', 'Population Criteria 2')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '45% Coverage')

        //Verify Highlighting for first Measure group
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should('contain.text', 'define "Initial Population":\n' +
            'exists "Qualifying Encounters"')

        //Verify Highlighting for second Measure group
        cy.get(TestCasesPage.tcPopulationCriteriaNavLink).contains('Population Criteria 2').click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '52% Coverage')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should('not.contain.text', 'define "Initial Population":\n' +
            'exists "Qualifying Encounters"')

    })
})
