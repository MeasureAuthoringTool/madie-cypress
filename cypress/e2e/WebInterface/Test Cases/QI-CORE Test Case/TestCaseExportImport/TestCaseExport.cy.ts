import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import * as path from 'path'

let randValue = (Math.floor((Math.random() * 1000) + 1))
const measureName = 'TCExport' + Date.now()
const CqlLibraryName = 'TCExportLib' + Date.now()
let newMeasureName = ''
let newCQLLibraryName = ''
const testCase: TestCase = {
    title: 'Title for Auto Test',
    description: 'DENOMFail',
    group: 'SBTestSeries',
    json: TestCaseJson.TestCaseJson_CohortPatientBoolean_PASS
}
let testCasePIdPath = ''
let testCasePIdPathSecnD = ''
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll, deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')
const zipPath = 'cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip'

describe('QI-Core Single Test Case Export', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    newMeasureName = measureName + randValue + 9 + randValue
    newCQLLibraryName = CqlLibraryName + randValue + 8 + randValue

    beforeEach('Create measure, measure group, test case and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName)
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })

    it('Export single QI-Core Test Case', () => {

        const currentUser = Cypress.env('selectedUser')
        testCasePIdPath = 'cypress/fixtures/' + currentUser + '/testCasePId'

        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile(zipPath).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile(zipPath).should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
    })

    it('Non-owner of Measure: Export single QI-Core Test case', () => {

        const currentUser = Cypress.env('selectedUser')
        testCasePIdPath = 'cypress/fixtures/' + currentUser + '/testCasePId'

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)
        cy.get(MeasuresPage.allMeasuresTab).click()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile(zipPath).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile(zipPath).should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
    })

    it('QMIG STU5 Reference Validations', () => {

        const currentUser = Cypress.env('selectedUser')
        testCasePIdPath = 'cypress/fixtures/' + currentUser + '/testCasePId'

        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile(zipPath).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {

            // read testcase json
            const testCasePath = path.join(downloadsFolder, patientId, 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
            cy.readFile(testCasePath).then(testCaseJson => {

                const measureReport = testCaseJson.entry.find(entries => {
                    return entries.resource.resourceType == 'MeasureReport'
                })

                expect(measureReport.resource.extension[0].url).to.eq('http://hl7.org/fhir/StructureDefinition/cqf-inputParameters')
            })
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

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Export All QI-Core Test cases', () => {

        const currentUser = Cypress.env('selectedUser')
        testCasePIdPath = 'cypress/fixtures/' + currentUser + '/testCasePId'
        testCasePIdPathSecnD = 'cypress/fixtures/' + currentUser + '/testCasePId2'
    
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
        cy.readFile(testCasePIdPathSecnD).should('exist').then((patientId2) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries2-TitleforAutoTest2.json')
                .and('contain', patientId2)
        })
    })

    it('Non-owner of Measure: Export All QI-Core Test cases', () => {

        const currentUser = Cypress.env('selectedUser')
        testCasePIdPath = 'cypress/fixtures/' + currentUser + '/testCasePId'
        testCasePIdPathSecnD = 'cypress/fixtures/' + currentUser + '/testCasePId2'

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)
        cy.get(MeasuresPage.allMeasuresTab).click()

         Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 35000)
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        // export
        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.exportCollectionTypeOption).click()

        cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the Test Case Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip', path: downloadsFolder })
            .then(results => {
                cy.log('unzipFile Task finished')
            })
        cy.readFile(testCasePIdPath).should('exist').then((patientId) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries-TitleforAutoTest.json')
                .and('contain', patientId, 'README.txt')
        })
        cy.readFile(testCasePIdPathSecnD).should('exist').then((patientId2) => {
            //Verify all files exist in exported zip file
            cy.readFile('cypress/downloads/eCQMTitle4QICore-v0.0.000-FHIR-TestCases.zip').should('contain', 'eCQMTitle4QICore-v0.0.000-SBTestSeries2-TitleforAutoTest2.json')
                .and('contain', patientId2)
        })
        cy.reload()
        Utilities.waitForElementVisible('[data-testid="user-profile-select"]', 60000)

    })
})
