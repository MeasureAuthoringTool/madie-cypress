import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

const timestamp = Date.now()
const measureName = 'TestMeasure' + timestamp
const CqlLibraryName = 'TestLibrary' + timestamp
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + timestamp
const testCaseSeries = 'SBTestSeries'
const updatedTestCaseTitle = testCaseTitle + " some update"
const updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
const updatedTestCaseSeries = 'CMSTestSeries'
const testCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQL = MeasureCQL.ICFCleanTest_CQL
const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')
const qiCore6MeasureCQL = 'library QICoreTestLibrary1733500481375 version \'0.0.000\'\n' +
    'using QICore version \'6.0.0\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'codesystem "SNOMEDCT:2017-09": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "Surgical Absence of Cervix":\n' +
    '\t[Procedure: "Hysterectomy with No Residual Cervix"] NoCervixHysterectomy\n' +
    '\t\twhere NoCervixHysterectomy.status = \'completed\'\n' +
    '\t\t'

describe('Create and Update Test Case for Qi Core 4 Measure', () => {

    beforeEach('Create Measure and login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and delete measure', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create and Update Test Case for Qi Core Version 4.1.1 Measure', () => {

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //Verify Last Saved Date on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.lastSavedDate).should('contain', todaysDate)

        //Edit / update Test Case
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.updateTestCase(updatedTestCaseTitle, updatedTestCaseDescription, updatedTestCaseSeries)
    })
})

describe('Create and Update Test Case for Qi Core 6 Measure', () => {

    beforeEach('Create Qi Core 6 Measure and login', () => {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: qiCore6MeasureCQL })
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Procedure')

        OktaLogin.Login()
    })

    afterEach('Logout and delete measure', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create and Update Test Case for Qi Core Version 6.0.0 Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
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

        cy.log('Test Case created successfully')

        //Add json to the test case
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.jsonTab).click()
        
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 21500)
        cy.get(TestCasesPage.aceEditor).type(testCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.detailsTab).click()

        //Save edited / updated to test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 6500)
        cy.log('JSON added to test case successfully')

        //Verify Last Saved Date on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.lastSavedDate).should('contain', todaysDate)

        //Edit / update Test Case
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.updateTestCase(updatedTestCaseTitle, updatedTestCaseDescription, updatedTestCaseSeries)
    })
})
