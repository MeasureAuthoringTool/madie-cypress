import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Header } from "../../../../Shared/Header"

let randValue = (Math.floor((Math.random() * 1000) + 1))
const now = Date.now()
const measure = {
    name: 'QDMTestCaseButtons' + now + randValue,
    cqlLibraryName: 'QDMTestCaseButtonsLib' + now + randValue,
    cql: MeasureCQL.QDMHightlightingTabDefUsed_CQL
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
    json: TestCaseJson.tcJSON_QDM_Value
}

describe('Test case list page - Action Center icons for measure owner', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measure.name, measure.cqlLibraryName, 'Proportion', false, measure.cql, null, false, '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase2.json,)
        TestCasesPage.CreateQDMTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, testCase2.json, true)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 9500)

        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30500)
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
    })

    it('Export icon is present and enables correctly', () => {

        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')
        cy.get('[data-testid="export-tooltip"]').should('have.attr', 'aria-label', 'Test cases must be executed prior to exporting.')

        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')

        cy.get(TestCasesPage.executeTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30500)

        cy.get(TestCasesPage.actionCenterExport).should('be.enabled').click()

        let qrdaButton: string
        let excelButton: string
        cy.readFile('cypress/fixtures/measureId').then(measureId => {

            qrdaButton = 'button[data-testid="export-qrda-' + measureId + '"]'
            excelButton = 'button[data-testid="export-excel-' + measureId + '"]'

            cy.get(qrdaButton).should('be.visible')
            cy.get(excelButton).should('be.visible').click()
        })
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

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measure.name, measure.cqlLibraryName, 'Proportion', false, measure.cql, null, false, '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase2.json,)
        TestCasesPage.CreateQDMTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, testCase2.json, true)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 9500)

        EditMeasurePage.actionCenter(EditMeasureActions.version)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(measure.name, measure.cqlLibraryName)
    })

    it('Export icon is present and it enables correctly', () => {
        // checks that delete, clone, and shift dates are not present at all
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
        cy.get(TestCasesPage.actionCenterClone).should('not.exist')
        cy.get(TestCasesPage.actionCenterShiftDates).should('not.exist')

        cy.get(TestCasesPage.actionCenterExport).should('be.disabled')
        cy.get('[data-testid="export-tooltip"]').should('have.attr', 'aria-label', 'Test cases must be executed prior to exporting.')

        cy.get(TestCasesPage.executeTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30500)

        cy.get(TestCasesPage.actionCenterExport).should('be.enabled').click()

        let qrdaButton: string
        let excelButton: string
        cy.readFile('cypress/fixtures/measureId').then(measureId => {

            qrdaButton = 'button[data-testid="export-qrda-' + measureId + '"]'
            excelButton = 'button[data-testid="export-excel-' + measureId + '"]'

            cy.get(qrdaButton).should('be.visible')
            cy.get(excelButton).should('be.visible').click()
        })

    })

    it('Copy To icon is present and it enables correctly', () => {

        cy.get(EditMeasurePage.testCasesTab).click()

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

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measure.name, measure.cqlLibraryName, 'Proportion', false, measure.cql, null, false, '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase2.json,)
        TestCasesPage.CreateQDMTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, testCase2.json, true)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 9500)
        OktaLogin.UILogout()

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
        cy.get('[data-testid="export-tooltip"]').should('have.attr', 'aria-label', 'Test cases must be executed prior to exporting.')

        cy.get(TestCasesPage.executeTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30500)

        cy.get(TestCasesPage.actionCenterExport).should('be.enabled').click()

        let qrdaButton: string
        let excelButton: string
        cy.readFile('cypress/fixtures/measureId').then(measureId => {

            qrdaButton = 'button[data-testid="export-qrda-' + measureId + '"]'
            excelButton = 'button[data-testid="export-excel-' + measureId + '"]'

            cy.get(qrdaButton).should('be.visible')
            cy.get(excelButton).should('be.visible').click()
        })

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

