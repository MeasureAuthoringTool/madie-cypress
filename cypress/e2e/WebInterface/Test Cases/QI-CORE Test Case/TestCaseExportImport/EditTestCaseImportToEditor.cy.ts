import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let fileToUpload = 'PatientFile.json'

describe('Import Test Case into the Test Case Editor', () => {

    beforeEach('Create Measure, Test case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries)
        OktaLogin.Login()

    })

    afterEach('Clean up and Logout', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Successful Json file Import', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Upload valid Json file
        cy.get(TestCasesPage.testCaseFileImport).attachFile(fileToUpload)
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'Test Case JSON copied into editor. QI-Core Defaults have been added. Please review and save your Test Case.')

        //Save uploaded Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

    })

    it('Verify error message when a Text file is imported', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Upload Text file
        cy.get(TestCasesPage.testCaseFileImport).attachFile('GenericCQLBoolean.txt')
        cy.get(TestCasesPage.importTestCaseErrorMsg).should('contain.text', 'An error occurred while reading the file. Please make sure the test case file is valid.')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

    })

    it('Verify error message when an invalid Json file is imported', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Upload invalid Json file
        cy.get(TestCasesPage.testCaseFileImport).attachFile('example.json')
        cy.get(TestCasesPage.importTestCaseErrorMsg).should('contain.text', 'No test case resources were found in imported file.')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

    })


    it('Verify error message when bulk Json file is imported', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Upload a bulk Json file
        cy.get(TestCasesPage.testCaseFileImport).attachFile('BulkPatientFile.json')
        cy.get(TestCasesPage.importTestCaseErrorMsg).should('contain.text', 'No test case resources were found in imported file.')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')
    })

})