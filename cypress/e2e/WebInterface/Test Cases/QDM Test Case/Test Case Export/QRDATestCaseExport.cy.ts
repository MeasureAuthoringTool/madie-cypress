import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"


let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
let measureName = 'QDMTestMeasure' //+ Date.now()
let CqlLibraryName = 'QDMCQLLibrary' //+ Date.now()
let firstTestCaseTitle = 'PDxNotPsych60MinsDepart'
let anotherTestCaseTitle = 'PDxNotPsych60MinsDepart2nd'
let testCaseDescription = 'IPPStrat1Pass' //+ Date.now()
let testCaseSeries = 'SBTestSeries'
let anotherTestCaseSeries = 'SBTestSeries2nd'
let baseHTMLFile = 'cypress/fixtures/baseQRDAHTMLfile.txt'

let exported = ''
let expected = ''

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

describe('QDM Test Cases : Export Test Case', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {

        //Create New Measure and Test case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(anotherTestCaseTitle, anotherTestCaseSeries, testCaseDescription)

        OktaLogin.Login()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Successful QRDA Export for QDM Test Cases', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Run the Test cases
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        cy.get('[class="btn-container"]').contains('QRDA').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'QRDA exported successfully')

        //verify zip file exists
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.zip'), { timeout: 500000 }).should('exist')
        cy.log('Successfully verified zip file export')

        // unzipping the QRDA Export
        cy.task('unzipFile', { zipFile: 'eCQMTitle-v0.0.000-QDM-TestCases.zip', path: downloadsFolder }).then(results => {
            cy.log('unzipFile Task finished')
        })

        //read contents of the html file and compare that with the expected file contents (minus specific measure name)
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle_patients_results.html')).should('exist').then((exportedFile) => {
            debugger
            exported = exportedFile.toString(); //'exportedFile'
            cy.log('exported file contents is: \n' + exported)
            cy.readFile(baseHTMLFile).should('exist').then((dataCompared) => {
                debugger
                expected = dataCompared.toString() //'compareFile'
                cy.log('expected file contents is: \n' + expected)
                expect((exported).toString()).to.includes((expected).toString())

            })
        })

        //Verify all files exist in exported zip file
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle_patients_results.html'), null).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-0.0.000QDM-TestCases/html/1_SBTestSeries_PDxNotPsych60MinsDepart.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-0.0.000QDM-TestCases/html/2_SBTestSeries2nd_PDxNotPsych60MinsDepart2nd.html')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-0.0.000QDM-TestCases/qrda/1_SBTestSeries_PDxNotPsych60MinsDepart.xml')).should('exist')
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-0.0.000QDM-TestCases/qrda/2_SBTestSeries2nd_PDxNotPsych60MinsDepart2nd.xml')).should('exist')

    })
})

it('Export Test Case button is disabled until Test cases are executed', () => {

    //Click on Edit Button
    MeasuresPage.measureAction("edit")

    //Save CQL
    cy.get(EditMeasurePage.cqlEditorTab).click()
    cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
    cy.get(EditMeasurePage.cqlEditorSaveButton).click()
    cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

    //Navigate to test case page
    cy.get(EditMeasurePage.testCasesTab).should('be.visible')
    cy.get(EditMeasurePage.testCasesTab).click()

    //Export test case button should be disabled
    cy.get(TestCasesPage.testcaseQRDAExportBtn).should('be.disabled')

    //Run the Test cases
    cy.get(TestCasesPage.executeTestCaseButton).click()

    //Export test case button should be enabled
    cy.get(TestCasesPage.testcaseQRDAExportBtn).should('be.enabled')
})



describe('Export Test cases by Non Measure Owner', () => {


    deleteDownloadsFolderBeforeAll()

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {

        //Create New Measure and Test case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
        //Click on Edit Button
        MeasuresPage.measureAction("edit")
        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')
        OktaLogin.UILogout()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Non Measure Owner should be able to Export Test cases', () => {

        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Run the Test cases
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        cy.get('[class="btn-container"]').contains('QRDA').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'QRDA exported successfully')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')

    })
})





