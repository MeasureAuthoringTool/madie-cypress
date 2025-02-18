import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'First Test Case'
let secondTestCaseTitle = 'Second Test Case'
let testCaseDescription = 'A Description 1'
let secondTestCaseDescription = 'B Description 2'
let testCaseSeries = 'SBTestSeries'
let secondTestCaseSeries = 'ICFTestSeries'
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations

describe('Test Case name dropdown on Edit Test case screen', () => {

    beforeEach('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJson, false, true)
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case name dropdown', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 6500)
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        // verify we are on test case 2
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('have.attr', 'value', 'Second Test Case')

        cy.get(TestCasesPage.testCaseNameDropdown).should('contain.text', 'Case #2: ICFTestSeries - Second Test Case', 'Case #1: SBTestSeries - First Test Case')

        // use name dropdrop to switch test cases
        Utilities.dropdownSelect(TestCasesPage.testCaseNameDropdown, 'Case #1: SBTestSeries - First Test Case')

        // verify we are on test case 1
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('have.attr', 'value', 'First Test Case')
    })
})