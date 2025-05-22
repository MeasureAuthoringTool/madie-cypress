import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Global } from "../../../../../Shared/Global"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { TestCase, TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../../Shared/Utilities"

const now = Date.now()
const measureName = 'QDMRAVMeasure' + now
const CqlLibraryName = 'QDMRAVLibrary' + now
const testCase: TestCase = {
    title: 'PDxNotPsych60MinsDepart',
    description: 'example test case',
    group: 'SBTestSeries'
}

describe('QDM Test Cases : RAV Sub tab validations', () => {

    beforeEach('Create Measure, Measure Group, Test case and Log in', () => {

        const createMeasure: CreateMeasureOptions = {
            ecqmTitle: measureName,
            cqlLibraryName: CqlLibraryName,
            measureScoring: 'Cohort',
            patientBasis: 'false',
            measureCql: MeasureCQL.CQLQDMObservationRun
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(createMeasure)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCase.title, testCase.group, testCase.description)

        OktaLogin.Login()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    // taking this test as far as is possible after MAT-8627, leaving outline of future steps in as comments
    it('RAV sub tab is visible on Edit Test case Highlighting page when RAV is included', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add RAV Data Elements
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()

        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).find('[aria-label="option Denominator not selected"]').click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).find('[aria-label="option Initial Population not selected"]').click()


        //Save RAV data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //Navigate to test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the RAV side tab section on the test cases tab
        Utilities.waitForElementVisible(TestCasesPage.qdmRAVSideNavLink, 30000)
        cy.get(TestCasesPage.qdmRAVSideNavLink).click()

        // go through discard cycle 
        // patientBasis works for all 2 choice radios
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.discardRavChangesOption).click()
        Global.clickOnDiscardChanges()
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).should('be.checked')

        cy.get(TestCasesPage.saveRAVOption).should('be.disabled')
        cy.get(TestCasesPage.discardRavChangesOption).should('be.disabled')

        // re-do & save
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.saveRAVOption).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Configuration Updated Successfully')

        // check buttons disabled
        cy.get(TestCasesPage.saveRAVOption).should('be.disabled')
        cy.get(TestCasesPage.discardRavChangesOption).should('be.disabled')


    /*  
        this is all from the SDESubTabValidations test
        everything below will be useful after https://jira.cms.gov/browse/MAT-8630    

        //Add Elements to the test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Selecting Laboratory element and performed
        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(0).click()

        //navigating to the attribute sub-tab
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()

        //selecting attribute
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')

        //adding a date value tot he attribute
        cy.get(TestCasesPage.relevantPeriodStartDate).type('09/12/2023 12:00 AM')

        //adding values to the attribute
        cy.get('[data-testid="quantity-value-input-low"]').type('2')
        cy.get('[id="quantity-unit-input-low"]').click()
        cy.get('[id="quantity-unit-input-low"]').type('m') //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-input-high"]').click()
        cy.get('[id="quantity-unit-input-high"]').type('m') //Select unit as m meter
        cy.get(TestCasesPage.addAttribute).click() //click the "Add" button

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Execute test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        //Navigate to Highlighting tab
        cy.get(TestCasesPage.tcHighlightingTab).click()
        //Click on SDE Sub tab
        cy.get(TestCasesPage.qdmSDESubTab).click()
        Utilities.waitForElementVisible('[data-testid="cql-highlighting"] > :nth-child(1)', 35000)
        cy.get('[data-testid="cql-highlighting"] > :nth-child(1)').should('contain.text', 'define "SDE Ethnicity":\n' +
            '  ["Patient Characteristic Ethnicity": "Ethnicity"]')
        cy.get('[data-testid="cql-highlighting"] > :nth-child(2)').should('contain.text', 'Results[Patient Characteristic Ethnicity: Ethnicity\n' +
            'CODE: CDCREC 2186-5] ')

    */
    })
})
