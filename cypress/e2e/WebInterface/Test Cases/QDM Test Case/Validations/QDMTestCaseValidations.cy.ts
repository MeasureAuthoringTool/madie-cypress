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
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"


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
let qdmMeasureCQL = MeasureCQL.simpleQDM_CQL
let qdmMeasureCQLwInvalidValueset = MeasureCQL.simpleQDM_CQL_invalid_valueset
let qdmMeasureCQLwDataTMMtoCQM = MeasureCQL.QDMTestCaseCQLFullElementSection
let qdmMeasureCQLwNonVsacValueset = MeasureCQL.QDMTestCaseCQLNonVsacValueset



describe('Test Case Ownership Validations for QDM Measures', () => {

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


describe('Create Test Case Validations', () => {

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

describe('Edit Test Case Validations', () => {

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

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(Global.discardChangesConfirmationModal, 37000)
        //verify that the discard modal appears
        Global.clickOnDirtyCheckDiscardChanges()

    })
})


describe('Dirty Check Validations', () => {

    before('Create QDM Measure and Test Case ', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {

        //create test case and login
        //TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()

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

        //enter a value of the Ethnicity
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')


        //take focus off of the date field
        cy.get(TestCasesPage.elementsTab).click()

        //verify that the Ethnicity value changes back to it's previous value
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')

        //change a value for the dob, again
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Hispanic or Latino').click()

        //take focus off of the date field
        cy.get(TestCasesPage.elementsTab).click()

        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('exist')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('be.enabled')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

        //verify discard modal and click on keep working
        Global.clickDiscardAndKeepWorking()

        //verify that the Ethnicity valu is left unchanged from it's last change
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')


    })

})


describe('QDM CQM-Execution failure error validations: CQL Errors and missing group', () => {

    beforeEach('Create Measure, and Test Case', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, true, qdmMeasureCQL)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)

    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('A message is displayed if there are issues with the CQL', () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //type in an additional value to the already existing value in the editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}Additional erroneous line')

        //saving new CQL value
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.qdmCQLFailureErrorList, 105000)
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('exist')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('be.visible')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')
    })
    it('A message is displayed if the measure is missing a group', () => {

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')

    })

})


describe('QDM CQM-Execution failure error validations: Valueset not found in Vsac', () => {

    beforeEach('Create Measure, and Test Case', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, true, qdmMeasureCQLwInvalidValueset)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)


    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.qdmCQLFailureErrorList, 105000)
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('exist')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('be.visible')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')

    })
})


describe('QDM CQM-Execution failure error validations: Data transformation- MADiE Measure to CQMMeasure', () => {

    beforeEach('Create Measure, and Test Case', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, false, qdmMeasureCQLwNonVsacValueset)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)


    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')

    })
})

