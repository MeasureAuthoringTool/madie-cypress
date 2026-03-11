import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

const measureName = 'IntervalQuantity' + Date.now()
const CqlLibraryName = 'IntervalQuantityLib' + Date.now()
const measureScoringProportion = 'Proportion'
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'
const measureCQL = MeasureCQL.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}

describe('Quantity Attribute', () => {

    beforeEach('Create measure and login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringProportion
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Add Quantity attribute to the Test case', () => {

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        MeasureGroupPage.includeSdeData()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')
        cy.get('[data-testid=quantity-value-input-low]').type('2')
        cy.get('[id="quantity-unit-input-low"]').click()
        cy.get('[id="quantity-unit-input-low"]').type('m') //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-input-high"]').click()
        cy.get('[id="quantity-unit-input-high"]').type('m') //Select unit as m meter
        cy.get(TestCasesPage.addAttribute).click()
        cy.get(TestCasesPage.attributeChip).should('contain.text', 'Reference Range - referenceRange 2 \'m\' - 4 \'m\'')
    })
})
