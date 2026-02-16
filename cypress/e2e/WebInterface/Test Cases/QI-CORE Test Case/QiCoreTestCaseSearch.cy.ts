import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'QiCoreTCSearch' + Date.now()
let CqlLibraryName = 'QiCoreTCSearchLib' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseJson2nd = TestCaseJson.TestCaseJson_Valid
let measureCQL = MeasureCQL.CQL_Multiple_Populations.replace('TestLibrary4664', measureName)
let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'

describe('Non Boolean Population Basis Expected values', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Qi Core Test Case search and filter functionality', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd, testCaseJson2nd)
        const expectedTestCaseValue = '2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd
        const expectedTestCaseValue2 = '(UTC)Edit'
        //search for something that is in the description field
        cy.get(TestCasesPage.tcSearchInput).type('Second')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue)
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue2)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for soemthing that is in the status field
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue)
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue2)
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the group field
        cy.get(TestCasesPage.tcSearchInput).clear().type('SecondTC-SBTestSeries')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue)
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue2)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)
        //search for something that is in the title field
        cy.get(TestCasesPage.tcSearchInput).type('Second TC - Title')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue)
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue2)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseResultrow2, 5000)

        //the filter by field
        cy.get(TestCasesPage.tcFilterInput).scrollIntoView().click()
        cy.get(TestCasesPage.tcFilterByGroup).click()
        cy.get(TestCasesPage.tcSearchInput).type('NA')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow, 5000)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()
        cy.get(TestCasesPage.tcSearchInput).type('Second TC - Title')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue)
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue2)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()
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

        // after a search, executing tests cases only runs matching test cases
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()
        cy.get(TestCasesPage.tcSearchInput).type('Second TC - Title')
        cy.get(TestCasesPage.tcTriggerSearch).find(TestCasesPage.tcSearchIcone).click()
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue)
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', expectedTestCaseValue2)
        Utilities.waitForElementToNotExist(TestCasesPage.testCaseResultrow2, 5000)
        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 25000)

        //verify the results row - only 1 test case, and it passed
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '2PassSecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd)
            .should('contain.text', '(UTC)Edit')

        //clear search to show all test cases
        cy.get(TestCasesPage.tcClearSearch).find(TestCasesPage.clearIconBtn).click()

        // verify the results rows - 2 test cases shown, 1 pass, 1 n/a
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', '2PassSecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd)
            .should('contain.text', '(UTC)Edit')

        cy.get(TestCasesPage.testCaseResultrow2).should('contain.text', '1N/ASBTestSeriesTitle for Auto Test' + testCaseDescription)
            .should('contain.text', '(UTC)Edit')
    })
})