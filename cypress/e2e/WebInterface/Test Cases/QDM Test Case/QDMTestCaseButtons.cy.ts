import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasureActions, EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../Shared/MeasureGroupPage"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Header } from "../../../../Shared/Header"


const now = Date.now()
const measure = {
    name: 'QDMTestCaseButtons' + now,
    cqlLibraryName: 'QDMTestCaseButtonsLib' + now,
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
const populations: MeasureGroups = {
    initialPopulation: 'Initial Population',
    denominator: 'Denominator',
    numerator: 'Numerator'
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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 9500)

        EditMeasurePage.actionCenter(EditMeasureActions.version)
        cy.get(EditMeasurePage.testCasesTab).click()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(measure.name, measure.cqlLibraryName)
    })

    it('Only Export icon is present and it enables correctly', () => {
        // checks that delete and clone are not present at all
        cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
        cy.get(TestCasesPage.actionCenterClone).should('not.exist')
    

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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
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

    it('Non-owner only sees Export icon; it enables correctly', () => {
         // checks that delete and clone are not present at all
         cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
         cy.get(TestCasesPage.actionCenterClone).should('not.exist')
     
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
})

