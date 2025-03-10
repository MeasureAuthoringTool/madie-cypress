import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { QDMElements } from "../../../../../Shared/QDMElements";
import { Header } from "../../../../../Shared/Header";

let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'

let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()

describe('QDM Test Case Search, Filter, and sorting by Test Case number', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('QDM Test Case search and filter functionality', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('085/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //search for something that is in the description field
        cy.get(TestCasesPage.tcSearchInput).type('Second')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Edit')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the status field
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Edit')
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the group field
        cy.get(TestCasesPage.tcSearchInput).clear().type('SecondTC-SBTestSeries')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Edit')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the title field
        cy.get(TestCasesPage.tcSearchInput).type('QDMManifestTC')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)


        //the filter by field
        cy.get(TestCasesPage.tcFilterInput).scrollIntoView().click()
        cy.get(TestCasesPage.tcFilterByGroup).click()
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        cy.get(TestCasesPage.tcSearchInput).type('QDMManifestTC')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)

        //clear the Filter By by selecting the "-" option
        cy.get(TestCasesPage.tcFilterInput).click()
        cy.get(TestCasesPage.tcFilterByGroup).click()
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcFilterInput).click()
        cy.get(TestCasesPage.tcFilterByDeselect).click()
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)


        //running test cases on the test case list page runs all test whether they are in the search results or not
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        cy.get(TestCasesPage.tcSearchInput).type('QDMManifestTC')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')

        //clear search to show all test cases
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassSecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Edit')
        cy.get(TestCasesPage.testCaseResultrow2).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Edit')


    })

})