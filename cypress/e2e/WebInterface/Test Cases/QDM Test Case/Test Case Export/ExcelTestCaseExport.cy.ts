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

// skipping until 'TestCaseExport' flag is removed
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

    it('Successful Excel Export for QDM Test Cases', () => {

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
        cy.get('[class="btn-container"]').contains('Excel').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Excel exported successfully')

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.xls')).should('exist')

        cy.task('readXlsx', { excelFile: 'eCQMTitle-v0.0.000-QDM-TestCases.xls', path: downloadsFolder, sheetName: '1 - Population Criteria Section'}).then((rows) => {

            cy.log('Successfully verified Excel file export')
        })

        cy.readFile(path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.xls'), null)
            .then((contents) => {

                expect(contents.length).to.equal(9694)

            })
    })
})






