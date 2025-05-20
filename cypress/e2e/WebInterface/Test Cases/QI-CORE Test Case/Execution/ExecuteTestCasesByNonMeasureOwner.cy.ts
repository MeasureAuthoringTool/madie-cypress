import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { LandingPage } from "../../../../../Shared/LandingPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let warningTestCaseJson = TestCaseJson.TestCaseJson_with_warnings
let testCaseSeries = 'SBTestSeries'
let mesureCQLPFTests = MeasureCQL.CQL_Populations

describe('Ability to run valid test cases whether or not the user is the owner of the measure or if the measure has not been shared with the user', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, mesureCQLPFTests, null, true)
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

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

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

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName, false, true)
    })

    it('Run / Execute single passing Test Case, on the Test Case list page, where the user is not the owner nor shared' +
        ' -- Run button is available and correct results are provided', () => {

            //Add json to the test case
            Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
            Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
            cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, {parseSpecialCharSequences: false})

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            Utilities.waitForElementEnabled(TestCasesPage.editTestCaseSaveButton, 9500)
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 9500)

            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).type('1')

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
            Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
            Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(2000)
            cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()

            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            TestCasesPage.checkToastMessageOK(TestCasesPage.successMsg)
            Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 37700)
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).click()

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
            cy.reload()

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

        TestCasesPage.checkToastMessageOK(TestCasesPage.successMsg)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on actual / expected sub-tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

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
