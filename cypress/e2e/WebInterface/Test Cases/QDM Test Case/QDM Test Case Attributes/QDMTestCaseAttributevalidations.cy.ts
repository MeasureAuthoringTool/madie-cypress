import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

const measureName = 'QDMAttributeTestMeasure' + Date.now()
const CqlLibraryName = 'QDMAttributeTestLibrary' + Date.now()
const measureScoringProportion = 'Proportion'
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'
const measureCQL = MeasureCQL.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}

describe('QDM Test case Attribute validations', () => {

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

    it('Remove test case attributes', () => {

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
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

        //Delete the attribute from Elements table
        // grab the element id of the first entry in the element table
        TestCasesPage.grabElementId(1)

        // delete that element
        TestCasesPage.qdmTestCaseElementAction('delete')
        cy.get(TestCasesPage.attributeChip).should('not.exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        // remove ethnicity from Demographics section
        cy.get(TestCasesPage.QDMEthnicity).click()
        Utilities.waitForElementVisible('[data-value="Not Hispanic or Latino__2.16.840.1.114222.4.11.837"]', 60000)
        cy.get('[data-testid="dash-option"]').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.contains('Select an Ethnicity').should('be.visible')
    })

    it('Check Result attribute for expanded units past UCUM standard', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()

        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.resultAttribute).click()
        cy.get(TestCasesPage.selectAttributeDropdown).should('contain.text', 'Result')

        cy.get(TestCasesPage.attributeType).click()
        cy.get(TestCasesPage.quantityType).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Quantity')

        // check all units from https://jira.cms.gov/browse/MAT-7631
        const validUnits = [
                'years',
                'year',
                'months',
                'month',
                'weeks',
                'week',
                'days',
                'day',
                'hours',
                'hour',
                'minutes',
                'minute',
                'seconds',
                'second',
                'milliseconds',
                'millisecond'
            ]

        cy.get(TestCasesPage.quantityValueInput).type('5')

        for (let unit of validUnits) {
            cy.get(TestCasesPage.quantityUnitInput).clear().type(unit)
            cy.wait(750)

            cy.get('[data-testid="quantity-unit-input-quantity-helper-text"]').should('not.exist')
        }
        
        cy.get(TestCasesPage.quantityUnitInput).clear().type('problem')

        cy.get('[data-testid="quantity-unit-input-quantity-helper-text"]').should('be.visible')
    })
})
