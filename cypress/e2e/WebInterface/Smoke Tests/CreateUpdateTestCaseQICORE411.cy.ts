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

const utc = require('dayjs/plugin/utc')
const dayjs = require('dayjs')
dayjs.extend(utc)
const timestamp = Date.now()
const todaysDate = dayjs(timestamp).format('MM/DD/YYYY')
// matches date & hour, allowing slack for test time to cross minute boundaries
const utcTime = dayjs(timestamp).utc().format('MM/DD/YYYYHH')
const measureName = 'CUTCQiCore' + timestamp
const CqlLibraryName = 'CUTCQiCoreLib' + timestamp
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + timestamp
const testCaseSeries = 'SBTestSeries'
const updatedTestCaseTitle = testCaseTitle + " some update"
const updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
const updatedTestCaseSeries = 'CMSTestSeries'
const testCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQL = MeasureCQL.ICFCleanTest_CQL

describe('Create and Update Test Case for Qi Core 4 Measure', () => {

    beforeEach('Create Measure and login', () => {

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
        Utilities.deleteMeasure()
    })

    it('Create and Update Test Case for Qi Core Version 4.1.1 Measure', () => {

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //Verify Last Saved Date on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.lastSavedDate).should('contain', todaysDate)

        //Edit / update Test Case
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.updateTestCase(updatedTestCaseTitle, updatedTestCaseDescription, updatedTestCaseSeries)

        cy.get(TestCasesPage.lastSavedDate).should('contain.text', utcTime)
        cy.get(TestCasesPage.lastSavedDate).should('contain.text', 'UTC')
    })
})
