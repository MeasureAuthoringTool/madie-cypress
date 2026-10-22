import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { CreateMeasureOptions, CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { TestData } from '../../../../Shared/TestData'

let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
let randValue = Math.floor(Math.random() * 1000 + 1)
let measureName = 'QDMTestMeasure' + Date.now() + randValue
let CqlLibraryName = 'QDMCQLLibrary' + Date.now() + randValue
let firstTestCaseTitle = 'PDxNotPsych60MinsDepart'
let anotherTestCaseTitle = 'PDxNotPsych60MinsDepart2nd'
let testCaseDescription = 'IPPStrat1Pass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let anotherTestCaseSeries = 'SBTestSeries2nd'
const qdmTestCaseJson = TestCaseJson.QDMTestCaseJson
const qrdaArchiveName = 'eCQMTitle4QDM-v0.0.000-QDM-TestCases.zip'

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const baseQrdaHtmlFixturePath = path.join('cypress', 'fixtures', 'baseQRDAHTMLfile.txt')

const assertExportedFileExists = (relativePath: string) => {
    return cy.task('fileExists', path.join(downloadsFolder, relativePath)).should('eq', true)
}
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

const measureData: CreateMeasureOptions = {}

describe('QDM Test Cases : Export Test Case', () => {
    deleteDownloadsFolderBeforeAll()

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {
        let newTimestamp = Date.now()
        let newRandValue = Math.floor(Math.random() * 1000 + 1)
        measureName = 'QDMTestMeasure' + newTimestamp + newRandValue
        CqlLibraryName = 'QDMCQLLibrary' + newTimestamp + newRandValue

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription, qdmTestCaseJson)
        TestCasesPage.CreateQDMTestCaseAPI(
            anotherTestCaseTitle,
            anotherTestCaseSeries,
            testCaseDescription,
            qdmTestCaseJson
        )
        TestData.saveMeasureCql(`${qdmMeasureCQL}\n`).then(TestData.expectSavedMeasureCql)

        return OktaLogin.Login()
    })

    afterEach('Log out and Clean up', () => {
        return Utilities.deleteMeasure().then(() => OktaLogin.UILogout())
    })

    it('Successful QRDA Export for QDM Test Cases', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Run the Test cases
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        Utilities.waitForElementEnabled('[data-testid="export-action-btn"]', 60000)

        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        cy.get('#export-menu').contains('QRDA').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'QRDA exported successfully')

        //verify zip file exists
        cy.task('fileExists', path.join(downloadsFolder, qrdaArchiveName), { timeout: 60000 }).should('eq', true)
        cy.log('Successfully verified zip file export')

        cy.task('unzipFile', { zipFile: qrdaArchiveName, path: downloadsFolder }).then(() => {
            cy.log('unzipFile Task finished')
        })

        cy.task('fileContains', {
            filePath: path.join(downloadsFolder, 'eCQMTitle4QDM_patients_results.html'),
            expectedFilePath: baseQrdaHtmlFixturePath,
        }).should('eq', true)

        assertExportedFileExists('eCQMTitle4QDM_patients_results.html')
        assertExportedFileExists('html/SBTestSeries_PDxNotPsych60MinsDepart.html')
        assertExportedFileExists('html/SBTestSeries2nd_PDxNotPsych60MinsDepart2nd.html')
        assertExportedFileExists('qrda/SBTestSeries_PDxNotPsych60MinsDepart.xml')
        assertExportedFileExists('qrda/SBTestSeries2nd_PDxNotPsych60MinsDepart2nd.xml')
    })

    it('Export Test Case button is disabled until Test cases are executed', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Export test case button should be disabled
        cy.get('[data-testid="export-tooltip"]').should('not.be.enabled')

        //Run the Test cases
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        Utilities.waitForElementEnabled('[data-testid="export-action-btn"]', 60000)

        //Export test case button should be enabled
        cy.get('[data-testid="export-action-btn"]').should('be.enabled')
    })
})

describe('Export Test cases by Non Measure Owner', () => {
    deleteDownloadsFolderBeforeAll()

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {
        let newTimestamp = Date.now()
        let newRandValue = Math.floor(Math.random() * 1000 + 1)
        measureName = 'QDMTestMeasure' + newTimestamp + newRandValue
        CqlLibraryName = 'QDMCQLLibrary' + newTimestamp + newRandValue

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription, qdmTestCaseJson)
        TestData.saveMeasureCql(`${qdmMeasureCQL}\n`).then(TestData.expectSavedMeasureCql)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        return OktaLogin.UILogout()
    })

    afterEach('Log out and Clean up', () => {
        return Utilities.deleteMeasure().then(() => OktaLogin.UILogout())
    })

    it('Non Measure Owner should be able to Export Test cases', () => {
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Run the Test cases
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        Utilities.waitForElementEnabled('[data-testid="export-action-btn"]', 60000)

        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        cy.get('#export-menu').contains('QRDA').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'QRDA exported successfully')

        cy.task('fileExists', path.join(downloadsFolder, qrdaArchiveName), { timeout: 60000 }).should('eq', true)
        cy.log('Successfully verified zip file export')
    })
})
