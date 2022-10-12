import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"

let measureName = 'TestMeasure' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
let updatedTestCaseDescription = testCaseDescription + ' '+ 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'CMSTestSeries'


describe('Test Case Validations', () => {

    before('Create Measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
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
    //skipping tests until the implementation of user story MAT-4694
    it.skip('Validate text on the "Run Test", "Discard Changes", and "Save" buttons', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.testCaseTitle, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.testCaseTitle, 20000)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).focus()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle.toString())

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
            //setup for grabbing the measure create call
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.detailsTab).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')        
            cy.get(EditMeasurePage.testCasesTab).click()
        })
        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //validate text on "Run Test" button
        cy.get(TestCasesPage.runTestButton).should('contain.text', 'Run Test')
        //validate text on "Discard Changes" button
        cy.get(TestCasesPage.tcDiscardChangesButton).should('contain.text', 'Discard Changes')
        //validate text on "Save" button
        cy.get(TestCasesPage.editTestCaseSaveButton).should('contain.text', 'Save')
    })
    //skipping tests until the implementation of user story MAT-4694
    it.skip('Validate that the "Run Test", "Discard Changes", and "Save" buttons are all viewable after clicking on Edit for a test case and on any right-pane tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.testCaseTitle, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.testCaseTitle, 20000)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).focus()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle.toString())

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
            //setup for grabbing the measure create call
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.detailsTab).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')        
            cy.get(EditMeasurePage.testCasesTab).click()
        })
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the CQL sub tab for test cases
        cy.get(TestCasesPage.tctMeasureCQLSubTab).should('be.visible')
        cy.get(TestCasesPage.tctMeasureCQLSubTab).click()

        //validate the presence and accessibility of the "Run Test" button
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        //validate the presence and accessibility of the "Discard Changes" button
        cy.get(TestCasesPage.tcDiscardChangesButton).should('be.visible')
        //validate the presence and accessibility of the "Save" button
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        //navigate to the Expected / Actual sub tab for test cases
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //validate the presence and accessibility of the "Run Test" button
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        //validate the presence and accessibility of the "Discard Changes" button
        cy.get(TestCasesPage.tcDiscardChangesButton).should('be.visible')
        //validate the presence and accessibility of the "Save" button
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        //navigate to the Details sub tab for test cases
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        //validate the presence and accessibility of the "Run Test" button
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        //validate the presence and accessibility of the "Discard Changes" button
        cy.get(TestCasesPage.tcDiscardChangesButton).should('be.visible')
        //validate the presence and accessibility of the "Save" button
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
    })

    it('Create Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })

    //skipping tests until the implementation of user story MAT-4694
    it.skip('Edit Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, {delay: 0})
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })

    it('Create Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.detailsTab).click()
        cy.wait(2000)

        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')

        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')

    })

    //skipping tests until the implementation of user story MAT-4694
    it.skip('Edit Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()
        cy.wait(2000)

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, {delay: 0})
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })
})
describe('Attempting to create a test case without a title', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Surgical Absence of Cervix', 'Procedure')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Create Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).focus()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)

        //save button to save the test case is not available
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.be.enabled')



    })

    //skipping tests until the implementation of user story MAT-4694
    it.skip('Edit and update test case to have no title', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.wait(500)

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries).type('{enter}')


        //save button to save the test case is not available
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.be.enabled')
    })
    it('Validate dirty check on the test case title, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseTitle).type('newTestCaseTitle')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //verify that the discard modal appears
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('exist')
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('exist')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.enabled')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).click()


    })
    it('Validate dirty check on the test case description, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //verify that the discard modal appears
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('exist')
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('exist')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.enabled')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).click()        
    })
    it('Validate dirty check on the test case series, in the test case details tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        
        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()
        
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()
        
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries).type('{enter}')
        
        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
                
        //verify that the discard modal appears
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('exist')
        cy.get(MeasureGroupPage.discardChangesConfirmationModal).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('exist')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.visible')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).should('be.enabled')
        cy.get(MeasureGroupPage.continueDiscardChangesBtn).click()
    })
})
describe('Validate dirty check modal after saving test case', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    //skipping due to issues related to user story MAT-4694; once MAT-4694 is implemented this test case needs to be ran and it should pass
    it.skip('Validate that, once saved, no dirty check prompt is provided for the test case', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        
        cy.get(TestCasesPage.testCaseTitle).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.testCaseTitle, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.testCaseTitle, 20000)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).focus()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle.toString())

        //save test case
        TestCasesPage.clickCreateTestCaseButton(true)

        //navigate to the test cases tab
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm test case is present on main test case page
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('exist')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('be.enabled')
        })
    })
})