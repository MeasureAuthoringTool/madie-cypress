import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let fileToUpload = 'PatientFile.json'

describe('Import Test Case', () => {

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
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Upload file
        cy.get(TestCasesPage.importTestCaseBtn).attachFile(fileToUpload)
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'Test Case JSON copied into editor. QI-Core Defaults have been added. Please review and save your Test Case.')

        //Save uploaded Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

    })

    it('Verify error message when a Text file is imported', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Upload file
        cy.get(TestCasesPage.importTestCaseBtn).attachFile('GenericCQLBoolean.txt')
        cy.get(TestCasesPage.importTestCaseErrorMsg).should('contain.text', 'An error occurred while reading the file. Please make sure the test case file is valid.')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

    })

    it('Verify error message when virus file is imported', () => {

        //const virusString = new Blob(['X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'])
        const virusString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        // @ts-ignore
        cy.get(TestCasesPage.importTestCaseBtn).attachFile({
            fileContent: virusString,
            filePath: 'VIRUS - Virus-v2-0-004-QDM-5-6.json',
            encoding: 'utf-8',
            lastModified: new Date().getTime()
        })

        cy.get(TestCasesPage.importTestCaseErrorMsg).should('contain.text', 'There was an error importing this file. Please contact the help desk for error code V100')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.disabled')

    })
})