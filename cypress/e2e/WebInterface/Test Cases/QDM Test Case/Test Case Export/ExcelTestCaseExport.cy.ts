import {MeasureCQL} from "../../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../../Shared/OktaLogin"
import {Utilities} from "../../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../../Shared/CQLEditorPage"

let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMCQLLibrary' + Date.now()
let firstTestCaseTitle = 'PDxNotPsych60MinsDepart'
let anotherTestCaseTitle = 'PDxNotPsych60MinsDepart2nd'
let testCaseDescription = 'IPPStrat1Pass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let anotherTestCaseSeries = 'SBTestSeries2nd'

const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const XLSX = require('xlsx')
let baseExcelFile = 'cypress/fixtures/baseTestcaseExcelFile.xls'

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

    it('Verify Test case Excel Export and validate file contents', () => {

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

        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 60000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        cy.get('[class="btn-container"]').contains('Excel').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Excel exported successfully')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.xls')).should('exist')

        cy.task('readXlsx', { excelFile: 'eCQMTitle-v0.0.000-QDM-TestCases.xls', path: downloadsFolder, sheetName: '1 - Population Criteria Section'}).then((rows) => {

            cy.log('Successfully verified Excel file export')
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.xls'), 'binary').then((excelContent) => {
            // Read downloaded Excel file from downloads folder
            const workbook = XLSX.read(excelContent, { type: 'binary' })
            const sheetOne = workbook.SheetNames[0]
            const sheetTwo = workbook.SheetNames[1]
            const sheet1 = workbook.Sheets[sheetOne]
            const sheet2 = workbook.Sheets[sheetTwo]
            const exportedFile = XLSX.utils.sheet_to_json(sheet1, sheet2)
            cy.log('exported file contents is: \n' + exportedFile)

            cy.readFile(baseExcelFile, 'binary').should('exist').then((dataCompared) => {
                // Read Excel file from Fixtures Folder
                const workbook = XLSX.read(dataCompared, {type: 'binary'})
                const sheetOne = workbook.SheetNames[0]
                const sheetTwo = workbook.SheetNames[2]
                const sheet1 = workbook.Sheets[sheetOne]
                const sheet2 = workbook.Sheets[sheetTwo]
                const expectedFile = XLSX.utils.sheet_to_json(sheet1, sheet2)
                cy.log('expected file contents is: \n' + expectedFile)

                expect((exportedFile)).to.deep.equal((expectedFile))
            })
        })

    })
})
