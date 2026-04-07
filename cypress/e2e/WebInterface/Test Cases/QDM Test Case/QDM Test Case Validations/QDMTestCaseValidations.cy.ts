import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { LandingPage } from "../../../../../Shared/LandingPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { QdmCql } from "../../../../../Shared/QDMMeasuresCQL"

let altMeasureName = ''
let altCqlLibraryName = ''
let measureName = ''
let CqlLibraryName = ''
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseTitle = 'test case title'
const testCaseSeries = 'SBTestSeries'
const twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
const QDMTCJson = TestCaseJson.QDMTestCaseJson
const measureQDMCQL = QdmCql.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}

describe('Test Case Ownership Validations for QDM Measures', () => {

    beforeEach('Create measure and login', () => {

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = 'TCValidationsOwnership' + altRandValue
        altCqlLibraryName = 'TCValidationsOwnershipLib' + altRandValue

        measureData.ecqmTitle = altMeasureName
        measureData.cqlLibraryName = altCqlLibraryName
        measureData.measureScoring = 'Ratio'
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL
        measureData.measureNumber = undefined
        measureData.altUser = false

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.AltLogin()
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure()
    })

    it('Fields on Test Case page are not editable by Non Measure Owner', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(LandingPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        //click on Edit button to edit measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get('[id="date-of-birth"]').should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.QDMLivingStatus).should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.QDMRace).should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.QDMGender).should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.QDMEthnicity).should('have.attr', 'readonly', 'readonly')

        //Navigate to Details tab
        cy.get(TestCasesPage.detailsTab).click()
        cy.get('[id="test-case-title"]').should('have.attr', 'readonly', 'readonly')
        cy.get('[id="test-case-description"]').should('have.attr', 'readonly', 'readonly')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('have.attr', 'readonly', 'readonly')

        //Navigate to Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.enabled')
    })
})

describe('Create Test Case Validations', () => {

    beforeEach('Login', () => {
        measureName = 'QDMTCValidationsCreate' + Date.now()
        CqlLibraryName = 'QDMTCValidationsCreateLib' + Date.now()

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)

        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        
        Utilities.deleteMeasure()
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

    it('Group has more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).type(twoFiftyTwoCharacters)
        cy.get('[data-testid*="Add"]').last().click()
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseGroupInlineError).contains('Test Case Group cannot be more ' +
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
        measureName = 'QDMTCValidationsEdit' + Date.now()
        CqlLibraryName = 'QDMTCValidationsEditLib' + Date.now()

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        Utilities.deleteMeasure()
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
        cy.get(TestCasesPage.createTestCaseGroupInput).click()
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
        cy.get(TestCasesPage.createTestCaseGroupInput).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTCSaveTooltip).should('have.attr', 'aria-label', 'title: Test Case Title cannot be more than 250 characters.')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Group more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.createTestCaseGroupInput).clear()

        //Update Test Case Group with more than 250 characters
        cy.get(TestCasesPage.createTestCaseGroupInput).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.contains('Add').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseGroupInlineError).contains('Test Case Group cannot be more ' +
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
        cy.get(TestCasesPage.createTestCaseGroupInput).click()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.editTCSaveTooltip).should('have.attr', 'aria-label', 'title: Test Case Title is required.')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).should('contain.text', 'Test Case Title is required.')
    })
})
