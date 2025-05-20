import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../Shared/MeasureGroupPage"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

const now = Date.now()
const measure = {
    name: 'TestCaseButtons' + now,
    cqlLibraryName: 'TestCaseButtonsLib' + now,
    cql: MeasureCQL.ICFCleanTest_CQL
}
const testCase1: TestCase = {
    title: 'Title for Auto Test',
    description: 'example',
    group: 'SBTestSeries'
}
const testCase2: TestCase = {
    title: 'Second Test Case',
    description: 'wonderful',
    group: 'ICFTestSeries',
    json: TestCaseJson.TestCaseJson_Valid_w_All_Encounter
}
const populations: MeasureGroups = {
    initialPopulation: 'Surgical Absence of Cervix',
    denominator: 'Surgical Absence of Cervix',
    numerator: 'Surgical Absence of Cervix'
}


describe('Test case list page - Action Center icons for measure owner', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measure.name, measure.cqlLibraryName, SupportedModels.qiCore4, { measureCql: measure.cql})
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.procedure, MeasureScoring.Proportion, populations)
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.description, testCase1.group)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.description, testCase2.group, testCase2.json, false, true)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measure.name, measure.cqlLibraryName)
    })

    it('Delete icon is present and enables correctly', () => {

        cy.get(TestCasesPage.actionCenterDelete).should('be.disabled')
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled')

    })

    it('Clone icon is present and enables correctly', () => {

        cy.get(TestCasesPage.actionCenterClone).should('be.disabled')
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterClone).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterClone).should('be.disabled')

        cy.get('.header-button').find('input[type="checkbox"]').check()
        TestCasesPage.createTestCase('Test Case 3', 'Example test case', 'Extra')

        TestCasesPage.checkTestCase(3)
        cy.get(TestCasesPage.actionCenterClone).should('be.disabled')
    })

    it('Export icon is present and enables correctly', () => {

        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')
        cy.get('[data-testid="export-tooltip"]').should('have.attr', 'aria-label', 'Select test cases to export')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')

        cy.get(TestCasesPage.actionCenterExport).click()

        cy.get(TestCasesPage.exportCollectionTypeOption).should('be.visible')
        cy.get(TestCasesPage.exportTransactionTypeOption).should('be.visible').click()
    })

    it('Shift dates icon is present and enables correctly', () => {

        cy.get(TestCasesPage.actionCenterShiftDates).should('be.disabled')
        cy.get('[data-testid="shift-test-case-dates-tooltip"]').should('have.attr', 'aria-label', 'Select test cases to shift test case dates')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterShiftDates).should('be.enabled')
        cy.get('[data-testid="shift-test-case-dates-tooltip"]').should('have.attr', 'aria-label', 'Shift test case dates')

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterShiftDates).should('be.enabled')

        cy.get(TestCasesPage.actionCenterShiftDates).click()

        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCasesCancelBtn, 5500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).should('be.disabled')
    })
})

describe('Test case list page - Action Center icons for versioned measure', () => {
    
    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measure.name, measure.cqlLibraryName, SupportedModels.qiCore4, { measureCql: measure.cql})
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.procedure, MeasureScoring.Proportion, populations)
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.description, testCase1.group, testCase2.json)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.description, testCase2.group, testCase2.json, false, true)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        EditMeasurePage.actionCenter(EditMeasureActions.version)
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(measure.name, measure.cqlLibraryName)
    })

    it('Export icon is present and it enables correctly', () => {
        // checks that delete, clone, and shift dates are not present at all
        cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
        cy.get(TestCasesPage.actionCenterClone).should('not.exist')
        cy.get(TestCasesPage.actionCenterShiftDates).should('not.exist')

        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')
        cy.get('[data-testid="export-tooltip"]').should('have.attr', 'aria-label', 'Select test cases to export')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')

        cy.get(TestCasesPage.actionCenterExport).click()

        cy.get(TestCasesPage.exportCollectionTypeOption).should('be.visible')
        cy.get(TestCasesPage.exportTransactionTypeOption).should('be.visible').click()
    })

    it('Copy To icon is present and it enables correctly', () => {

        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.disabled')
        cy.get('[data-testid="copy-tooltip"]').should('have.attr', 'aria-label', 'Select test cases to copy to another measure')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')

        cy.get(TestCasesPage.actionCenterCopyToMeasure).click()

        cy.contains('Copy To').should('be.visible')
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
    })

})

describe('Test case list page - Action Center icons for non-owner', () => {
    
    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measure.name, measure.cqlLibraryName, SupportedModels.qiCore4, { measureCql: measure.cql})
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.procedure, MeasureScoring.Proportion, populations)
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.description, testCase1.group)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.description, testCase2.group, testCase2.json, false, true)

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measure.name, measure.cqlLibraryName)
    })

    it('Non-owner sees Export icon; it enables correctly', () => {
         // checks that delete, clone, shift dates are not present at all
         cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
         cy.get(TestCasesPage.actionCenterClone).should('not.exist')
         cy.get(TestCasesPage.actionCenterShiftDates).should('not.exist')

        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')
        cy.get('[data-testid="export-tooltip"]').should('have.attr', 'aria-label', 'Select test cases to export')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')

        cy.get(TestCasesPage.actionCenterExport).click()

        cy.get(TestCasesPage.exportCollectionTypeOption).should('be.visible')
        cy.get(TestCasesPage.exportTransactionTypeOption).should('be.visible').click()
    })

    it('Non-owner sees Copy To icon; it enables correctly', () => {

        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.disabled')
        cy.get('[data-testid="copy-tooltip"]').should('have.attr', 'aria-label', 'Select test cases to copy to another measure')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')

        cy.get(TestCasesPage.actionCenterCopyToMeasure).click()

        cy.contains('Copy To').should('be.visible')
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
    })
})

