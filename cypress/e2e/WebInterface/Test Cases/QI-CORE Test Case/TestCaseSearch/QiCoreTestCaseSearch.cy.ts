import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header";

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = 'test'
let testCaseJson2nd = 'test'
let newMeasureName = measureName + randValue
let measureCQL = MeasureCQL.CQL_Multiple_Populations
let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

describe.skip('Non Boolean Population Basis Expected values', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

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

    it('Verify Expected values for non boolean population basis', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')

        //Save updated test case
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully with ' +
            'errors in JSON')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('contain.value', '1')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('contain.value', '2')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('contain.value', '3')

    })

    //
    it('QDM Test Case search and filter functionality', () => {

        //
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd, testCaseJson2nd)

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

        //start of work on MAT-7601


        //search for something that is in the description field
        //search for soemthing that is in the status field
        //search for something that is in the group field
        //search for something that is in the title field

        //the filter by field

        //search result should have no results

        //clear search by clicking on "x"

        //clear the Filter By by selecting the "-" option

        //running test cases on the test case list page runs all test wheither they are in the search results or not



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
    it('QDM Test Case number and sorting behavior', () => {

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