import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseJson2nd = TestCaseJson.TestCaseJson_Valid
let newMeasureName = measureName + randValue
let measureCQL = MeasureCQL.CQL_Multiple_Populations
let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

describe('Non Boolean Population Basis Expected values', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })


    it('Qi Core Test Case search and filter functionality', () => {

        //
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd, testCaseJson2nd)

        //search for something that is in the description field
        cy.get(TestCasesPage.tcSearchInput).type('Second')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for soemthing that is in the status field
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the group field
        cy.get(TestCasesPage.tcSearchInput).clear().type('SecondTC-SBTestSeries')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the title field
        cy.get(TestCasesPage.tcSearchInput).type('Second TC - Title')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)

        //the filter by field
        cy.get(TestCasesPage.tcFilterInput).scrollIntoView().wait(1500).click()
        cy.get(TestCasesPage.tcFilterByGroup).click()
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        cy.get(TestCasesPage.tcSearchInput).type('Second TC - Title')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
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


        //running test cases on the test case list page runs all test wheither they are in the search results or not
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()
        cy.get(TestCasesPage.tcSearchInput).type('Second TC - Title')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassSecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')

        //clear search to show all test cases
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.tcClearSearchIcon).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassSecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        cy.get(TestCasesPage.testCaseResultrow2).should('contain.text', 'PassSBTestSeriesTitle for Auto Test' + testCaseDescription + todaysDate + 'Select')

    })
    it.skip('QDM Test Case number and sorting behavior', () => {

        //
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //save the Test Case

        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        //

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //start of work on MAT-7604

        //test case numbers appear


        //first click sorts ascending order
        //second click sorts in descending order
        //thrid click removes sorting

        //sort by case number and then edit some test case that is not at the top



        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')


        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'FailQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

    })
    //
})