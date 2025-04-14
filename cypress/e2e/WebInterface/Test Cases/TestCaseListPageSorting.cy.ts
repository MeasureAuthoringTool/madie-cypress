import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Header } from "../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'A Test Case 1 Fails'
let secondTestCaseTitle = 'Be Test Case 2 Passes'
let testCaseDescription = 'A Description 1'
let secondTestCaseDescription = 'B Description 2'
let testCaseSeries = 'A Test Series 1'
let secondTestCaseSeries = 'B Test Series 2'
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

describe('Sort by each of the test case list page\'s columns', () => {

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
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test case sorting functionality', () => {

        OktaLogin.Login()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit test case to cause it to fail
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'Test case updated successfully with warnings in JSON')
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'MADiE only supports a timezone offset of 0. MADiE has overwritten any timezone offsets that are not zero.')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //click group to sort descending
        cy.get(TestCasesPage.tcColumnHeading).contains('Group').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Group').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')

        //click group to sort ascending
        cy.get(TestCasesPage.tcColumnHeading).contains('Group').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Group').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit')

        //click group to remove sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Group').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')


        //click title to sort ascending
        cy.get(TestCasesPage.tcColumnHeading).contains('Title').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Title').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit')

        //click title to sort descending
        cy.get(TestCasesPage.tcColumnHeading).contains('Title').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Title').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')

        //click title to remove sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Title').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')


        //click description to sort ascending
        cy.get(TestCasesPage.tcColumnHeading).contains('Description').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Description').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit')

        //click description to sort descending
        cy.get(TestCasesPage.tcColumnHeading).contains('Description').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Description').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')

        //click description to remove sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Description').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2N/AB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1N/AA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')

        //run test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //click status to sort descending
        cy.get(TestCasesPage.tcColumnHeading).contains('Status').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Status').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2PassB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1FailA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')

        //click status to sort ascending
        cy.get(TestCasesPage.tcColumnHeading).contains('Status').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Status').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved1FailA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit2PassB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit')

        //click status to remove sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Status').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved2PassB Test Series 2Be Test Case 2 PassesB Description 2' + todaysDate + 'Edit1FailA Test Series 1A Test Case 1 FailsA Description 1' + todaysDate + 'Edit')

    })
})