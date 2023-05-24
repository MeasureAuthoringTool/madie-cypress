import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../../Shared/OktaLogin"
import {Utilities} from "../../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../../../Shared/TestCasesPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'

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
})

