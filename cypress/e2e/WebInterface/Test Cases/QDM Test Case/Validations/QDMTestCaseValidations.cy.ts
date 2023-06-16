import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { LandingPage } from "../../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Global } from "../../../../../Shared/Global"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"

let testCaseDescription = 'DENOMFail' + Date.now()
let QDMTCJson = TestCaseJson.QDMTestCaseJson
let testCasePath = 'cypress/fixtures/testCaseId'
let measureName = 'QDMTestMeasure' + Date.now()
let measurePath = 'cypress/fixtures/measureId'
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
let altMeasureName = ''
let altCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'


//Skipping until QDM Test Case feature flag is removed
describe.skip('Test Case Ownership Validations for QDM Measures', () => {

    beforeEach('Create measure and login', () => {

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(altMeasureName, altCqlLibraryName, measureScoring, true, measureCQL, false, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, true)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(altMeasureName, altCqlLibraryName, false, true)

    })
    it('Fields on Test Case page are not editable by Non Measure Owner', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()


        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMDob).should('be.disabled')
        cy.get(TestCasesPage.QDMLivingStatus).should('not.be.enabled')
        cy.get(TestCasesPage.QDMRace).should('not.be.enabled')
        cy.get(TestCasesPage.QDMGender).should('not.be.enabled')
        cy.get(TestCasesPage.QDMEthnicity).should('not.be.enabled')

        //Navigate to Details tab
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('not.be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('not.be.enabled')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('not.be.enabled')

        //Navigate to Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.enabled')

    })
})

//Skipping until QDM Test Case feature flag is removed
describe.skip('Create Test Case Validations', () => {

    before('Create Measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)
    })

    beforeEach('Login', () => {
        OktaLogin.Login()
    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
    })

    it('Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')

        cy.get(TestCasesPage.createTestCaseTitleInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.createTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Create Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //save button to save the test case is not available
        cy.get(TestCasesPage.createTestCaseSaveButton).should('not.be.enabled')
    })
})

//Skipping until QDM Test Case feature flag is removed
describe.skip('Edit Test Case Validations', () => {

    before('Create QDM Measure and Test Case ', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
    })

    beforeEach('Login', () => {
        OktaLogin.Login()
    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseDescriptionInlineError).should('contain.text', 'Test Case Description cannot be more than 250 characters.')
    })


    it('Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear()

        //Update Test Case Title with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Edit Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()

        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).should('contain.text', 'Test Case Title is required.')
    })

    it('Test Case dob validations: no dob', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //select the dob field, enter nothing for DOB, and, then, enter a value for Race
        cy.get(TestCasesPage.QDMDob).click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()

        //confirm helper text / validation message for the DOB field
        cy.get(TestCasesPage.QDMDOBHelperTxt).should('contain.text', 'Birthdate is required')

    })

    it('Test Case dob validations: wrong format for dob value', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //select the dob field, enter nothing for DOB, and, then, enter a value for Race
        cy.get(TestCasesPage.QDMDob).type('2020/01/01').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()

        //confirm helper text / validation message for the DOB field
        cy.get(TestCasesPage.QDMDOBHelperTxt).should('contain.text', 'Birthdate is required')

    })

    //dirty check validation
    it('Validate dirty check when user attempts to navigate away from the QDM Test Case edit page', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.elementsTab).should('exist')
        cy.get(TestCasesPage.elementsTab).should('be.enabled')
        cy.get(TestCasesPage.elementsTab).click()

        //enter a value of the dob
        cy.get(TestCasesPage.QDMDob).type('01/01/2000').click()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.waitForElementVisible(Global.discardChangesConfirmationModal, 37000)

        //verify that the discard modal appears
        Global.clickOnDirtyCheckCancelChanges()

        //verify that the user remains on the test case edit page
        cy.readFile(measurePath).should('exist').then((measureId) => {
            cy.readFile(testCasePath).should('exist').then((testCaseId) => {
                cy.url().should('eq', 'https://dev-madie.hcqis.org/measures/' + measureId + '/edit/test-cases/' + testCaseId)
            })

        })
        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(Global.discardChangesConfirmationModal, 37000)
        //verify that the discard modal appears
        Global.clickOnDirtyCheckDiscardChanges()
        //verify that the user is, now, on the PC -> Base Configuration page
        cy.readFile(measurePath).should('exist').then((measureId) => {
            cy.url().should('eq', 'https://dev-madie.hcqis.org/measures/' + measureId + '/edit/base-configuration')
        })

    })

})

