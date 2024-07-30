import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Header } from "../../../../../Shared/Header"

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Test Case 1'
let secondTestCaseTitle = 'Test Case 2'
let testCaseDescription = 'Description 1'
let secondTestCaseDescription = 'Description 2'
let testCaseSeries = 'Test Series 1'
let secondTestCaseSeries = 'Test Series 2'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
let measureCQLPFTests = MeasureCQL.CQL_Populations
let validFileToUpload = downloadsFolder.toString()

//Skipping until MAT-7436 is fixed
describe.skip('MADIE Zip Test Case Import', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)


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
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.testCaseAction('edit', true)

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

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the second test case
        TestCasesPage.testCaseAction('edit')

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

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        //export test case
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 35000)
        cy.get(TestCasesPage.exportCollectionTypeOption).wait(2000).scrollIntoView().click({ force: true })

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        cy.reload()

        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()
        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete All Test Cases?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join(validFileToUpload, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        //verify confirmation message
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 35000)
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', '(2) Test cases imported successfully')

        //Verify created test case Title and Series exists on Test Cases Page
        cy.get('[data-testid="test-case-title-0_group"]').should('be.visible')
        cy.get('[data-testid="test-case-title-0_group"]').invoke('text').then(
            (seriesText) => {
                let check = true
                if (seriesText === testCaseSeries || seriesText === secondTestCaseSeries) {

                }
                else {
                    check = false
                }

                expect(check).to.eql(true)
            })

        cy.get('[data-testid="test-case-title-0_title"]').should('be.visible')
        cy.get('[data-testid="test-case-title-0_title"]').invoke('text').then(
            (titleText) => {
                let check = true
                if (titleText === testCaseTitle || titleText === secondTestCaseTitle) {

                }
                else {
                    check = false
                }

                expect(check).to.eql(true)

            })

        cy.get('[data-testid="test-case-title-1_group"]').should('be.visible')
        cy.get('[data-testid="test-case-title-1_group"]').invoke('text').then(
            (seriesText) => {
                let check = true
                if (seriesText === testCaseSeries || seriesText === secondTestCaseSeries) {

                }
                else {
                    check = false
                }

                expect(check).to.eql(true)
            })

        cy.get('[data-testid="test-case-title-1_title"]').should('be.visible')
        cy.get('[data-testid="test-case-title-1_title"]').invoke('text').then(
            (titleText) => {
                let check = true
                if (titleText === testCaseTitle || titleText === secondTestCaseTitle) {

                }
                else {
                    check = false
                }

                expect(check).to.eql(true)

            })

    })

})
describe('MADIE Zip Test Case Import: error message should appear when the .madie file is missing', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)


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
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)
        Utilities.waitForElementVisible(TestCasesPage.tcImportButton, 3750)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.tcFileDrop).find(TestCasesPage.tcFileDropInput).attachFile("TestCase7345TsteCQM-v0.0.000-FHIR4-TestCases.zip").wait(3000)
        cy.get(TestCasesPage.tcImportError).should('contain.text', 'Zip file is in an incorrect format. If this is an export prior to June 20, 2024 please reexport your test case and try again.')

        //close the test case import modal
        cy.get(TestCasesPage.importTestCaseCancelBtnOnModal).click()
    })
})

