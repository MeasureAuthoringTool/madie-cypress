import {MeasureCQL} from "../../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../../Shared/MeasureGroupPage"
import {OktaLogin} from "../../../../../Shared/OktaLogin"
import {Utilities} from "../../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../../../Shared/TestCaseJson"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid

//Skipping until QDM feature flag is removed
describe('Create and Update QDM Test Case', () => {

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'ipp')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Create and Update Test Case for QDM Measure', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //Place holder for Edit QDM Test Case
        //Left panel tabs
        cy.get(TestCasesPage.elementsTab).should('contain.text', 'Elements')
        cy.get(TestCasesPage.jsonTab).should('contain.text', 'JSON')

        //Right panel tabs
        cy.get(TestCasesPage.highlightingTab).should('contain.text', 'Highlighting')
        cy.get(TestCasesPage.expectedOrActualTab).should('contain.text', 'Expected / Actual')
        cy.get(TestCasesPage.detailsTab).should('contain.text', 'Details')

    })
})