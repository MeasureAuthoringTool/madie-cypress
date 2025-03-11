import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Header } from "../../../../../Shared/Header"

let measureName = 'TCExport' + Date.now()
let CqlLibraryName = 'TCExportLib' + Date.now()
const testCase: TestCase = {
    title: 'Title for Auto Test',
    description: 'DENOMFail',
    group: 'SBTestSeries',
    json: TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
}
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

describe('QI-Core Single Test Case Export', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Export single QI-Core Test case', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'

        OktaLogin.Login()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain',patientId, 'README.txt')
        })
    })

    it('Non-owner of Measure: Export single QI-Core Test case', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
    })
})

describe('QI-Core Test Case Export for all test cases', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)
        TestCasesPage.CreateTestCaseAPI(testCase.title + '2', testCase.group + '2', testCase.description + '2', testCase.json, false, true)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Export All QI-Core Test cases', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        let testCasePIdPathSecnD = 'cypress/fixtures/testCasePId2'

        OktaLogin.Login()

        Utilities.waitForElementVisible(Header.cqlLibraryTab, 35000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(Header.mainMadiePageButton, 35000)
        cy.get(Header.mainMadiePageButton).should('be.visible')
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
        cy.readFile(testCasePIdPathSecnD).should('exist').then((patientId2) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries2-TitleforAutoTest2.json')
                .and('contain', patientId2)
        })
    })

    it('Non-owner of Measure: Export All QI-Core Test cases', () => {
        let testCasePIdPath = 'cypress/fixtures/testCasePId'
        let testCasePIdPathSecnD = 'cypress/fixtures/testCasePId2'
        OktaLogin.AltLogin()

        cy.reload()
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 35000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
        cy.readFile(testCasePIdPathSecnD).should('exist').then((patientId2) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries2-TitleforAutoTest2.json')
                .and('contain', patientId2)
        })
        cy.reload()
        Utilities.waitForElementVisible('[data-testid="user-profile-select"]', 60000)

        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.clearAllSessionStorage({ log: true })
    })
})
