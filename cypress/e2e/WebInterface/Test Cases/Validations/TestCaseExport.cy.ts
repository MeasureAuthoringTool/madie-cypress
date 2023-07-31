import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

describe('QI-Core Single Test Case Export', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Export single QI-Core Test case', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries-Title for Auto Test.json' &&
                patientId, 'README.txt')
        })

    })

    it('Non-owner of Measure: Export single QI-Core Test case', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        OktaLogin.Logout()
        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('export')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries-Title for Auto Test.json' &&
                patientId, 'README.txt')
        })

    })


})

describe('QI-Core Test Case Export for all test cases', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + '2', testCaseSeries + '2', testCaseDescription + '2', testCaseJson, true)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Export All QI-Core Test cases', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        let testCasePIdPathSecnD = 'cypress/fixtures/testCasePId2'

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit', true)
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.exportTestCasesBtn).click()

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries-Title for Auto Test.json' &&
                patientId, 'README.txt')
        })
        cy.readFile(testCasePIdPathSecnD).should('exist').then((patientId2) => {
            //Verify all files exist in exported zip file
            cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries2-Title for Auto Test2.json' &&
                patientId2)
        })

    })

    it('Non-owner of Measure: Export All QI-Core Test cases', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        let testCasePIdPathSecnD = 'cypress/fixtures/testCasePId2'

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit', true)
        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.enabled')
        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()

        //save changes to description
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //verify message appears indicating that test case was saved
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(EditMeasurePage.measureDetailsTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.measureNameTextBox, 35000)

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        OktaLogin.Logout()
        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.exportTestCasesBtn).click()

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries-Title for Auto Test.json' &&
                patientId, 'README.txt')
        })
        cy.readFile(testCasePIdPathSecnD).should('exist').then((patientId2) => {
            //Verify all files exist in exported zip file
            cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-FHIR4-TestCases.zip')).should('contain', 'eCQMTitle-v0.0.000-SBTestSeries2-Title for Auto Test2.json' &&
                patientId2)
        })

    })
})
