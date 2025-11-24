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
const now = require('dayjs')
const todaysDate = now().format('MM/DD/YYYY')
// Convert timestamp to UTC
const utcTime = dayjs(timestamp).utc().format('MM/DD/YYYYHH')

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
    '\t\twhere NoCervixHysterectomy.status = \'completed\'\n'

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
    })

    it('Verify last saved time stamp for Test case', () => {

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Verify Last Saved Date on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        // Asserting on last saved hour only since there is a difference between time saved and the actual time
        cy.get(TestCasesPage.lastSavedDate).should('contain.text', utcTime)
        cy.get(TestCasesPage.lastSavedDate).should('contain.text', 'UTC')
    })
})

describe('Create and Update Test Case for Qi Core 6 Measure', () => {

    beforeEach('Create Qi Core 6 Measure and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: qiCore6MeasureCQL })
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Procedure')

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

    it('Create and Update Test Case for Qi Core Version 6.0.0 Measure', () => {

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson, true)

        //Verify Last Saved Date on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.lastSavedDate).should('contain', todaysDate)

        //Edit / update Test Case
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.updateTestCase(updatedTestCaseTitle, updatedTestCaseDescription, updatedTestCaseSeries)
    })
})
