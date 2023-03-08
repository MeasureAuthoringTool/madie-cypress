import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage";

let measureName = 'TestMeasure' + Date.now()
let measureCQL = 'library SimpleFhirLibrary version \'0.0.004\''//MeasureCQL.SBTEST_CQL
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTerminologyFHIR_and_QICORETestCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseSeries = 'SBTestSeries'

describe('Test Case Page CQL page object', () => {

    before('Create Measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
    })

    beforeEach('Login', () => {
        OktaLogin.Login()
    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Updates applied and saved from the Measure CQL page / tab are updated and reflective in the Test Case Page', () => {
        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyFHIR_and_QICORETestCaseJson)

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm that CQL field, on the Test Case page, cannot be edited
        cy.get(TestCasesPage.tcCQLArea).should('contain.text', measureCQL)

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //type in an additional value to the already existing value in the editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('using FHIR version \'4.0.1\'')

        //saving new CQL value
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //navigate to the test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm that CQL field, on the Test Case page, reflects the additional text
        cy.log(measureCQL)
        cy.get(TestCasesPage.tcCQLArea).should('contain.text', 'using FHIR version \'4.0.1\'')

    })

    it('A message is displayed if there are issues with the CQL', () => {
        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //type in an additional value to the already existing value in the editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}Additional erroneous line')

        //saving new CQL value
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyFHIR_and_QICORETestCaseJson)

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        cy.get(TestCasesPage.cqlHasErrorsMsg).should('exist')
        cy.get(TestCasesPage.cqlHasErrorsMsg).should('be.visible')
        cy.get(TestCasesPage.cqlHasErrorsMsg).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')
    })

})