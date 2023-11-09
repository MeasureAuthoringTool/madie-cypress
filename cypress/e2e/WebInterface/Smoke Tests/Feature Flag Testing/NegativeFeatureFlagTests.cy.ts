import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let filePath = 'cypress/fixtures/measureId'
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let measureCQL = MeasureCQL.QDMTestCaseCQLFullElementSection
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()
let QDMmeasureCQL = MeasureCQL.simpleQDM_CQL
let measureScoring = 'Cohort'
let secondTestCaseTitle = 'Failing Test Case'
let secondTestCaseDescription = 'DENOMFail' + Date.now()
let secondTestCaseSeries = 'SBTestSeriesF'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
let measureCQLPFTests = MeasureCQL.CQL_Populations

const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')

// "exportQiCoreBundleType": true
describe('QI Core Test Cases: Ensure / verify that Export QI-Core Bundle type dropdown is present', () => {

    beforeEach('Create measure and login', () => {
        CqlLibraryName = 'TestLibrary6' + Date.now()

        //Create QI Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('QI Core Test Cases: Verify that Export QI-Core Bundle type dropdown is present', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the highlighting tab is present
        Utilities.waitForElementVisible(TestCasesPage.exportTestCasesBtn, 35000)
        Utilities.waitForElementEnabled(TestCasesPage.exportTestCasesBtn, 35000)

        //confirm that the PC sub tab / selector is not present
        Utilities.waitForElementVisible(('[class="export-chevron-container"]'), 35000)
        cy.get('[class="export-chevron-container"]').click({ force: true })
        cy.get('[data-testid=export-transaction-bundle]').should('be.visible')
        cy.get('[data-testid="export-collection-bundle"]').should('be.visible')

    })
})

// "importTestCases": false
describe('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)


        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {
        OktaLogin.Login()

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.bonnieImportTestCaseBtn, 35000)


    })

})



// "qdmExport": false
describe('QDM Measure Export: Export option is not available', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, false, measureCQL)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population',
            'boolean')
        OktaLogin.Login()

    })

    it('QDM Measure Export: Export option for measure is not available', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled').wait(10000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
            Utilities.waitForElementToNotExist('[data-testid=export-measure-' + fileContents + ']', 105000)
        })
        cy.reload()
        OktaLogin.Login()
        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionMajor).should('exist')
        cy.get(MeasuresPage.measureVersionMajor).click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        //MeasuresPage.measureAction('export')

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled').wait(10000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
            Utilities.waitForElementToNotExist('[data-testid=export-measure-' + fileContents + ']', 105000)
        })

        OktaLogin.Logout()
    })
})

// "qiCoreElementsTab": false
describe('QI Core: Elements tab is not present', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

    })

    beforeEach('Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('QI Core Test Case edit page: Ensure / verify that the Elements tab does not exist on the QI Core Test Case edit page', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist').wait(500)
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.testCaseAction('edit')

        //add json value to measure's test case
        Utilities.waitForElementToNotExist(TestCasesPage.elementsTab, 20000)
    })
})
