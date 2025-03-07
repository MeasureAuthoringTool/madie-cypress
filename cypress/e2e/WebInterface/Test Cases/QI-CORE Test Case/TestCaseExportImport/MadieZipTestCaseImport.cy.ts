import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Header } from "../../../../../Shared/Header"

const { deleteDownloadsFolderBeforeAll, deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')
const now = Date.now()
let measureName = 'ZipTCImport' + now
let CqlLibraryName = 'ZipTCImportLib' + now
let measureCQLPFTests = MeasureCQL.CQL_Populations
const testCase1: TestCase = {
    title: 'Test Case 1',
    description: 'Description 1',
    group: 'Test Series 1',
    json: TestCaseJson.TestCaseJson_Valid
}
const testCase2: TestCase = {
    title: 'Test Case 2',
    description: 'Description 2',
    group: 'Test Series 2',
    json: TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
}

describe('MADIE Zip Test Case Import', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, testCase2.json, false, true)

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('MADIE Zip Test Case Import', () => {

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //edit second test case so that it will fail
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.clickEditforCreatedTestCase()

        //edit second test case so that it will fail
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        //export test case
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        //verify that the export occurred
        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).click()
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get('[data-testid="test-case-title-0_caseNumber"]').should('contain.text', '2')
        cy.get('[data-testid="test-case-title-1_caseNumber"]').should('contain.text', '1')

        //verify confirmation message
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 35000)
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', '(2) Test cases imported successfully')

        //Verify created test case Titles exist on Test Cases Page 
        cy.contains(testCase2.title).should('be.visible')
        cy.contains(testCase1.title).should('be.visible')
    })

    it('Copy Warning message while importing Test cases', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //edit second test case so that it will fail
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.clickEditforCreatedTestCase()

        //edit second test case so that it will fail
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        //export test case
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile('cypress/fixtures/CMS108FHIR-v0.2.000-FHIR4-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'CMS108FHIR-v0.2.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 65000)

        // updated validations - 10 visible test cases
        cy.get(TestCasesPage.countVisibleTestCases).should('have.length', 10)
        // imported 138 totaltest cases
        TestCasesPage.grabValidateTestCaseNumber(138)
        // specific title seen
        cy.contains('SCIPKneeRank1').should('be.visible')
        // another test case's specific description seen
        cy.contains('ICU LOS < 1 day').should('be.visible')

        //Click on the Copy button and verify success msg
        cy.get('[data-testid="copy-button-tooltip"]').should('exist')
        cy.get('[data-testid="copy-button-tooltip"]').click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Copied to clipboard!')
    })
})

describe('MADIE Zip Test Case Import: error message should appear when the .madie file is missing', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCase1.json)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.group, testCase2.description, testCase2.json, false, true)

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('MADIE Zip Test Case Import: error message appears when .madie file is missing from the .zip file', () => {

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)
        Utilities.waitForElementVisible(TestCasesPage.tcImportButton, 3750)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.tcFileDrop).find(TestCasesPage.tcFileDropInput).attachFile('TestCase7345TsteCQM-v0.0.000-FHIR4-TestCases.zip')
        cy.get(TestCasesPage.tcImportError).should('contain.text', 'Zip file is in an incorrect format. If this is an export prior to June 20, 2024 please reexport your test case and try again.')

        //close the test case import modal
        cy.get(TestCasesPage.importTestCaseCancelBtnOnModal).click()
    })
})

