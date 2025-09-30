import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { Header } from "../../../../../Shared/Header"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { CQLLibrariesPage } from "../../../../../Shared/CQLLibrariesPage"
import { QdmCql } from "../../../../../Shared/QDMMeasuresCQL"

let testCaseDescription = 'DENOMFail' + Date.now()
let QDMTCJson = TestCaseJson.QDMTestCaseJson
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
const measureQDMCQL = QdmCql.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}

describe('Dirty Check Validations', () => {

    beforeEach('Create QDM Measure, Test Case and Login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Ratio'
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 90000)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 90000)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and cleanup', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {

        //navigate to the all measures tab
        cy.get(Header.mainMadiePageButton).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).click().focus()
        cy.get(TestCasesPage.testCaseTitle).clear().type('tc01')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)

        //verify that the discard modal appears
        Utilities.clickOnKeepWorking()

        cy.reload()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).click().focus()
        cy.get(TestCasesPage.testCaseTitle).clear().type('tc01')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)
        //verify that the discard modal appears
        Utilities.clickOnDiscardChanges()
        cy.contains('Base Configuration').should('be.visible')
    })

    it('Validate dirty check on Testcase Expected/Actual tab', () => {

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to Expected/Actual tab and enter Expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('4')

        //Discard the changes
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('exist')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('be.enabled')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

        //verify discard modal and click on keep working
        Utilities.clickOnDiscardChanges()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.empty')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.empty')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.empty')
    })
})

