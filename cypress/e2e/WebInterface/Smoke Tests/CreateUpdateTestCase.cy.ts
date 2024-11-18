import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let updatedTestCaseTitle = testCaseTitle + " some update"
let updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'CMSTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQL = MeasureCQL.ICFCleanTest_CQL
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

describe('Create Test Case', () => {

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Surgical Absence of Cervix', '', '', 'Surgical Absence of Cervix', '', 'Surgical Absence of Cervix', 'Procedure')
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Logout and delete measure', () => {
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Create Test Case', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter("edit")

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //Verify Last Saved Date on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.lastSavedDate).should('contain', todaysDate)

    })

    it('Edit and update test case', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter("edit")

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //click tab to get to test cases
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit / update Test Case
        TestCasesPage.updateTestCase(updatedTestCaseTitle, updatedTestCaseDescription, updatedTestCaseSeries)

    })
})
