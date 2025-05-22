import {CreateMeasureOptions, CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import { Header } from "../../../../../Shared/Header"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { LandingPage } from "../../../../../Shared/LandingPage"
import { Global } from "../../../../../Shared/Global"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { CQLLibrariesPage } from "../../../../../Shared/CQLLibrariesPage"
import { QdmCql } from "../../../../../Shared/QDMMeasuresCQL"

let testCaseDescription = 'DENOMFail' + Date.now()
let QDMTCJson = TestCaseJson.QDMTestCaseJson
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
let altMeasureName = ''
let altCqlLibraryName = ''
let measureScoringCohort = 'Cohort'
const qdmMeasureCQL = QdmCql.simpleQDM_CQL
const qdmMeasureCQLwInvalidValueset = QdmCql.simpleQDM_CQL_invalid_valueset
const qdmMeasureCQLwNonVsacValueset = QdmCql.QDMTestCaseCQLNonVsacValueset
const measureQDMCQL = QdmCql.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}

describe('Test Case Ownership Validations for QDM Measures', () => {

    beforeEach('Create measure and login', () => {

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue

        measureData.ecqmTitle = altMeasureName
        measureData.cqlLibraryName = altCqlLibraryName
        measureData.measureScoring = 'Ratio'
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL
        measureData.measureNumber = null
        measureData.altUser = true

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, true, 'Initial Population', 'Initial Population', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, true)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
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
        MeasuresPage.actionCenter('edit')

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
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
    })

    it('Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

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
        MeasuresPage.actionCenter('edit')

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

    beforeEach('Create QDM Measure and Test Case and, then, Login', () => {
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

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
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseDescriptionInlineError).should('contain.text', 'Test Case Description cannot be more than 250 characters.')
    })


    it('Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

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
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Edit Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).click().focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).should('contain.text', 'Test Case Title is required.')
    })

    it('Validate dirty check when user attempts to navigate away from the QDM Test Case edit page', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.elementsTab).should('exist')
        cy.get(TestCasesPage.elementsTab).should('be.enabled')
        cy.get(TestCasesPage.elementsTab).click()

        // enter full patient to ensure page is dirty
        TestCasesPage.enterPatientDemographics('04/10/1942 12:00 AM', 'Living')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)

        //verify that the discard modal appears
        Global.clickOnKeepWorking()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)
        //verify that the discard modal appears
        Global.clickOnDiscardChanges()
    })
})

describe('Dirty Check Validations', () => {

    beforeEach('Create QDM Measure, Test Case and Login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Ratio'
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
    })

    afterEach('Logout and cleanup', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).click().focus()
        cy.get(TestCasesPage.testCaseTitle).clear().type('tc01')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)

        //verify that the discard modal appears
        Global.clickOnKeepWorking()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)
        //verify that the discard modal appears
        Global.clickOnDiscardChanges()
    })

    it('Validate dirty check on Testcase Expected/Actual tab', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to Expected/Actual tab and enter Expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('4')

        //Discard the changes
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('exist')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('be.enabled')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

        //verify discard modal and click on keep working
        Global.clickOnDiscardChanges()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.empty')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.empty')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.empty')
    })
})

//work in progress for MAT-5974
describe.skip('QDM Measure / Test Case: Dirty Check on attribute: Quantity Attribute', () => {

    beforeEach('Create measure, group and login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate dirty check on the test case attributes', () => {
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living')

        //select element and begin to add attribute
        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')
        cy.get('[data-testid=quantity-value-input-low]').type('2')
        cy.get('[id="quantity-unit-dropdown-low"]').click()
        cy.get('#quantity-unit-dropdown-low-option-0').click() //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-dropdown-high"]').click()
        cy.get('#quantity-unit-dropdown-high-option-0').click() //Select unit as m meter

        //attempt to navigate away without clicking on the add button (for the attribute)
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasureGroupPage.popUpConfirmationModal, 35000)
        Global.clickOnKeepWorking()
        //user stays on current page
        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureid) => {
            cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                cy.location('pathname', { timeout: 60000 }).should('include', 'measures/' + measureid + '/edit/test-cases/' + testCaseId)
            })
        })
        //confirm that attribute is still on page and has not been discarded**
        cy.get('[data-testid=quantity-value-input-low]').should('include.value', 2)
        cy.get('[id="quantity-unit-dropdown-low"]').should('contain.value', "m meter")
        cy.get('[data-testid=quantity-value-input-high]').should('include.value', 4)
        cy.get('[id="quantity-unit-dropdown-high"]').should('contain.value', "m meter")

        //another attempt to navigate away from current page after clicking on the add button
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasureGroupPage.popUpConfirmationModal, 35000)
        Global.clickOnDiscardChanges()

        //user is navigated away from test case page
        cy.location('pathname', { timeout: 60000 }).should('include', '/measures')

        //when the user navigates back to the test case details page the attribute details are not present**
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Internal<Quantity> values are no longer present
        Utilities.waitForElementToNotExist('[data-testid=quantity-value-field-low]', 35000)
        Utilities.waitForElementToNotExist('[id="quantity-unit-dropdown-low"]', 35000)
        Utilities.waitForElementToNotExist('[data-testid=quantity-value-field-high]', 35000)
        Utilities.waitForElementToNotExist('[id="quantity-unit-dropdown-high"]', 35000)
    })
})

describe('QDM CQM-Execution failure error validations: CQL Errors and missing group', () => {

    beforeEach('Create Measure, and Test Case', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('A message is displayed if there are issues with the CQL', () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20000)
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 21000)

        //Navigate to Test Case page
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 50000)
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })

    it('A message is displayed if the measure is missing a group', () => {

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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
        //wait for alert / successful save message to appear
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
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('QDM CQM-Execution failure error validations: Valueset not found in Vsac', () => {

    beforeEach('Create Measure, and Test Case', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQLwInvalidValueset

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //log out of UI
        OktaLogin.UILogout()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('QDM CQM-Execution failure error validations: Data transformation- MADiE Measure to CQMMeasure', () => {

    beforeEach('Create Measure, and Test Case', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLwNonVsacValueset

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.reload()

        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        //log into MADiE
        OktaLogin.Login()
        cy.reload()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get('[data-testid="generic-warning-text-header"]').should('contain.text', 'CQL updated successfully but the following issues were found')

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
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('Non Boolean Population basis Expected values', () => {

    beforeEach('Create Measure, and Test Case', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLwNonVsacValueset

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Denominator', '', 'Numerator')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Validate Non Boolean Expected values', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('abc')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only positive numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('$%@')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only positive numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('13@a')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Only positive numeric values can be entered in the expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).clear().type('1.9')
        cy.get(TestCasesPage.nonBooleanExpectedValueError).should('contain.text', 'Decimals values cannot be entered in the population expected values')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })
})

