import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { LandingPage } from "../../../../../Shared/LandingPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Toasts } from "../../../../../Shared/Toasts"
import { QiCore4Cql } from "../../../../../Shared/FHIRMeasuresCQL"

const measureName = 'ETCByNonOwner' + Date.now()
const CqlLibraryName = 'ETCByNonOwnerLib' + Date.now()
const testCaseTitle = 'test case title'
const testCaseDescription = 'DENOMFail' + Date.now()
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const warningTestCaseJson = TestCaseJson.TestCaseJson_with_warnings
const testCaseSeries = 'SBTestSeries'
const measureCQLPFTests = QiCore4Cql.reduced_CQL_Multiple_Populations

describe('Ability to run valid test cases whether or not the user is the owner of the measure or if the measure has not been shared with the user', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, null, true)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, true, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.AltLogin()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 18500)

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries, { delay: 50 })
        cy.contains(testCaseSeries).click()

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(null, null, false, true)
    })

    it('Run / Execute single passing Test Case, on the Test Case list page, where the user is not the owner nor shared' +
        ' -- Run button is available and correct results are provided', () => {

            //Add json to the test case
            Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
            cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, {parseSpecialCharSequences: false})

            Utilities.waitForElementEnabled(TestCasesPage.editTestCaseSaveButton, 9500)
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).click()

            cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseDENOMExpected).click()

            cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
            cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseNUMERExpected).click()

            Utilities.waitForElementEnabled(TestCasesPage.editTestCaseSaveButton, 9500)
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

            //logout as ALT user and, then, log in as non-alt user
            OktaLogin.Logout()
            sessionStorage.clear()
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
            OktaLogin.Login()

            cy.get(LandingPage.allMeasuresTab).click()

            //Click on Edit Measure
            MeasuresPage.actionCenter('edit')

            //Click on Execute Test Case button on Edit Test Case page
            Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 37700)
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.executeTestCaseButton).should('exist')
            cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')

            Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 23500)
            cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            //verify Passing Tab's text
            cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
            cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
            cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
            cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
            cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/1)')

            cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
            cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
            cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
            cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })

    it('Run / Execute single passing Test Case, on the Test Case details page, where the user is not the owner nor shared' +
        ' -- Run button is available and correct results are provided', () => {

            //Add json to the test case
            Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
            cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()

            cy.get(Toasts.otherSuccessToast).should('have.text', Toasts.warningOffsetText)

            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).click()

            cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseDENOMExpected).click()

            cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
            cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseNUMERExpected).click()

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

            //logout as ALT user and, then, log in as non-alt user
            OktaLogin.Logout()
            sessionStorage.clear()
            cy.clearAllCookies()
            cy.clearLocalStorage()
            cy.setAccessTokenCookie()
            OktaLogin.Login()

            cy.get(LandingPage.allMeasuresTab).click()

            //Click on Edit Measure
            MeasuresPage.actionCenter('edit')
            //refresh test case list page
            Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 37700)
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')

            TestCasesPage.clickEditforCreatedTestCase()

            //navigate to the details tab for the test case
            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

            //confirm warning message
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
            //attempt to click on 'Run Test Case' to run the test case via the edit page
            cy.get(TestCasesPage.runTestButton).should('exist')
            cy.get(TestCasesPage.runTestButton).should('be.visible')
            cy.get(TestCasesPage.runTestButton).should('be.enabled')
            cy.get(TestCasesPage.runTestButton).click()

            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()
            cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')
            cy.get(TestCasesPage.measureActualCheckbox).should('be.checked')
    })

    it('Can "Run Test Case" and "Execute Test Case"  when a test case has only a warning -- when user is not the owner', () => {

        //Add json to the test case
        TestCasesPage.enterErroneousJson(warningTestCaseJson)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()
        cy.get(Toasts.otherSuccessToast).should('have.text', Toasts.warningOffsetText)
            
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on actual / expected sub-tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).click()

        Utilities.waitForElementEnabled(TestCasesPage.editTestCaseSaveButton, 9500)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', 'To see the logic highlights, click \'Run Test\'')

        //logout as ALT user and, then, log in as non-alt user
        OktaLogin.Logout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

        cy.get(LandingPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //refresh test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //open edit page for test case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details tab for the test case
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //confirm warning message
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Warning: The Coding provided (http://clinfhir.com/fhir/NamingSystem/identifier#IMP) was not found in the value set \'V3 Value SetActEncounterCode\' (http://terminology.hl7.org/ValueSet/v3-ActEncounterCode|2014-03-26), and a code should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable).  (error message = Unknown code \'http://clinfhir.com/fhir/NamingSystem/identifier#IMP\' for in-memory expansion of ValueSet \'http://terminology.hl7.org/ValueSet/v3-ActEncounterCode\')Warning: No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
        //attempt to click on 'Run Test Case' to run the test case via the edit page
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Warning: The Coding provided (http://clinfhir.com/fhir/NamingSystem/identifier#IMP) was not found in the value set \'V3 Value SetActEncounterCode\' (http://terminology.hl7.org/ValueSet/v3-ActEncounterCode|2014-03-26), and a code should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable).  (error message = Unknown code \'http://clinfhir.com/fhir/NamingSystem/identifier#IMP\' for in-memory expansion of ValueSet \'http://terminology.hl7.org/ValueSet/v3-ActEncounterCode\')Warning: No code provided, and a code should be provided from the value set \'US Core Encounter Type\' (http://hl7.org/fhir/us/core/ValueSet/us-core-encounter-type|3.1.0)')
    })
})
