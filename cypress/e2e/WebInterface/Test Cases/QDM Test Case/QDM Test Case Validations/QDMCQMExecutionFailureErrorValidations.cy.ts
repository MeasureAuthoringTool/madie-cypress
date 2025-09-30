import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { QdmCql } from "../../../../../Shared/QDMMeasuresCQL"

let testCaseDescription = 'DENOMFail' + Date.now()
let QDMTCJson = TestCaseJson.QDMTestCaseJson
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let measureScoringCohort = 'Cohort'
const qdmMeasureCQLwInvalidValueset = QdmCql.simpleQDM_CQL_invalid_valueset
const qdmMeasureCQLwNonVsacValueset = QdmCql.QDMTestCaseCQLNonVsacValueset
const measureQDMCQL = QdmCql.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}



describe('QDM CQM-Execution failure error validations: CQL Errors and missing group', () => {

    beforeEach('Create Measure, and Test Case', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookieALT()

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'TestLibrary' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('A message is displayed if there are issues with the CQL', () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //type in an additional value to the already existing value in the editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}Additional erroneous line')

        //saving new CQL value
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20000)
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 21000)

        //Navigate to Test Case page
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 50000)
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })

    it('A message is displayed if the measure is missing a group', () => {

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('QDM CQM-Execution failure error validations: Valueset not found in Vsac', () => {

    beforeEach('Create Measure, and Test Case', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookie()

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'TestLibrary' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQLwInvalidValueset
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
        //log into MADiE
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('QDM CQM-Execution failure error validations: Data transformation- MADiE Measure to CQMMeasure', () => {

    beforeEach('Create Measure, and Test Case', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
        cy.setAccessTokenCookie()

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'TestLibrary' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLwNonVsacValueset

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
        //log into MADiE
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get('[data-testid="generic-error-text-header"]').should('contain.text', 'CQL updated successfully')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

