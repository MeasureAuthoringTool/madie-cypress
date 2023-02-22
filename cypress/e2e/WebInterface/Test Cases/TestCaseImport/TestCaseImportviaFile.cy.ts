import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let singleTestCaseFile = 'CMS1213FHIRv0_stc.json'
let smallBatchTestCaseFile = 'CMS1213FHIRv0_sbf.json'
let largeBatchTestCaseFile = 'CMS1213FHIRv0_lbf.json'
let genericTextFile = 'GenericCQLBoolean.txt'
let mesureCQLPFTests = MeasureCQL.CQL_Populations
describe('Import Test cases onto an existing measure via file', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, mesureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Import new test case onto an existing measure -- single test case', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.clickEditforCreatedMeasure()

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(singleTestCaseFile)

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'EncounterStatusMulti')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Person')
    })

    it('Import new test case onto an existing measure -- small batch file', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.clickEditforCreatedMeasure()

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(smallBatchTestCaseFile)

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'NumFail')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'NoServiceRequest')
        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'IPFail')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'NoDiabetesCondition')

    })

    it('Import new test case onto an existing measure -- large batch file', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.clickEditforCreatedMeasure()

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(largeBatchTestCaseFile)

        //click on the 'Import' button on the modal window
        TestCasesPage.clickImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'EncounterStatusMulti')
        //test case list table contains the title of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Person (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1)')

    })
    it('Verify error message when a Text file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //Attach Text file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(genericTextFile)

        //error in import modal window
        cy.get(TestCasesPage.testCaseImportErrorAtValidating).should('contain.text', 'An error occurred while validating the import file. Please try again or reach out to the Help Desk.')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })

    it('Verify error message when an invalid / empty Json file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //Upload invalid Json file
        cy.get(TestCasesPage.filAttachDropBox).attachFile('example.json')

        //message in import modal window about the file being empty
        cy.get(TestCasesPage.testCaseImportErrorAtValidating).should('contain.text', 'No patients were found in the selected import file!')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })

    //Need to work with Ben to get the EICAR files allowed
    it.skip('Verify error message when virus file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //const virusString = new Blob(['X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'])
        const virusString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        // @ts-ignore
        cy.get(TestCasesPage.filAttachDropBox).attachFile({
            fileContent: virusString,
            filePath: 'VIRUS - Virus-v2-0-004-QDM-5-6.json',
            encoding: 'utf-8',
            lastModified: new Date().getTime()
        })

        cy.get(TestCasesPage.testCaseImportErrorAtValidating).should('contain.text', 'There was an error importing this file. Please contact the help desk for error code V100')

        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')

    })
})