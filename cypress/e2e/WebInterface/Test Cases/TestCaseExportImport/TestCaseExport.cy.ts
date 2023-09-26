import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Header } from "../../../../Shared/Header"

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

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Export single QI-Core Test case', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'

        OktaLogin.Login()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

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

    it('Non-owner of Measure: Export single QI-Core Test case', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').wait(3000)
        cy.get(MeasuresPage.allMeasuresTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

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
        TestCasesPage.CreateTestCaseAPI(testCaseTitle + '2', testCaseSeries + '2', testCaseDescription + '2', testCaseJson, false, true)

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

        OktaLogin.Login()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })

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
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible').wait(3000)
        cy.get(MeasuresPage.allMeasuresTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible').wait(3000)
        cy.get(Header.cqlLibraryTab).click().wait(3000)

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible').wait(3000)
        cy.get(Header.mainMadiePageButton).click().wait(3000)

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.exportTestCasesBtn).scrollIntoView().click({ force: true })

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
