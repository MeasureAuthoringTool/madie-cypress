import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { Utilities } from '../../../../Shared/Utilities'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'

const now = Date.now()
const measureName = 'CQLPageObject' + now
const CqlLibraryName = 'CQLPageObjectLib' + now
const validMeasureCQL =
    "library TestLibrary1736348266658 version '0.0.000'\n" +
    "using QICore version '4.1.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n\n" +
    'context Patient'
const measureCQL =
    "library SimpleFhirLibrary version '0.0.004'\n" +
    "using QICore version '4.1.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers"
const testCaseTitle = 'test case title'
const testCaseSeries = 'SBTestSeries'
const testCaseDescription = 'DENOMFail' + Date.now()
const tcJson = TestCaseJson.TestCaseJson_Valid

describe('Test Case Page CQL page object', () => {
    beforeEach('Create Measure, TestCase and Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, validMeasureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, tcJson)
        OktaLogin.SessionLogin()
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Updates applied and saved from the Measure CQL page / tab are updated and reflective in the Test Case Page', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //type in an additional value to the already existing value in the editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('define "ipp": true')

        //saving new CQL value
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.collapseEditor()

        //navigate to the test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm that CQL field, on the Test Case page, reflects the additional text
        cy.get(TestCasesPage.tcCQLArea).should('contain.text', 'define "ipp": true')
    })
})

describe('Test Case Page CQL page object', () => {
    beforeEach('Create Measure, TestCase and Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, tcJson)
        OktaLogin.SessionLogin()
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('A message is displayed if there are issues with the CQL', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        cy.get(TestCasesPage.cqlHasErrorsMsg).should('exist')
        cy.get(TestCasesPage.cqlHasErrorsMsg).should('be.visible')
        cy.get(TestCasesPage.cqlHasErrorsMsg).should(
            'contain.text',
            'An error exists with the measure CQL, please review the CQL Editor tab'
        )
    })
})
