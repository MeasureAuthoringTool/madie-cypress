import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let measureScoring = 'Cohort'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.QDM4TestCaseElementsAttributes


describe('Quantity Attribute -- Adding multiple attributes', () => {

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, false, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Add Quantity attribute to the Test case', () => {

        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.testCaseAction('edit')

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Selecting Laboratory element and performed
        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()

        //navigating to the attribute sub-tab
        cy.get(TestCasesPage.attributesTab).click()

        //selecting attribute
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')

        //adding a date value tot he attribute
        cy.get('[id="dateTime"]').eq(0).type('09/12/2023 12:00 AM')

        //adding values to the attribute
        cy.get('[data-testid="quantity-value-input-low"]').type('2')
        cy.get('[id="quantity-unit-input-low"]').click()
        cy.get('[id="quantity-unit-input-low"]').type('m') //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-input-high"]').click()
        cy.get('[id="quantity-unit-input-high"]').type('m') //Select unit as m meter
        cy.get(TestCasesPage.addAttribute).click() //click the "Add" button

        //asserting value that appears in the element table
        cy.get('tbody > tr > :nth-child(1)').should('contain.text', 'Laboratory_test, PerformedChlamydia Screening ')
        cy.get('tbody > tr > :nth-child(4)').should('contain.text', 'View')

        //select new attribute to add
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.interpretationAttribute).click()

        //select value set value for this attribute
        cy.get(TestCasesPage.valueSetSelector).click()
        cy.get(TestCasesPage.ABEMBDiathesisValue).click()

        //select the SNOMED code system
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get(TestCasesPage.codeSNOMEDCTValue).click()

        //select a value for the code
        cy.get(TestCasesPage.codeSystemValueSelector).click()
        cy.get(TestCasesPage.codeSystemOptionValue).click()

        cy.get(TestCasesPage.addAttribute).click() //click the "Add" button

        //asserting value that appears in the element table
        cy.get('tbody > tr > :nth-child(4)').should('contain.text', 'Interpretation - interpretation SNOMEDCT : 112648003')

    })

    it('Edit previously added Element from the Element table', () => {

        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.testCaseAction('edit')

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Selecting Laboratory element and performed
        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()

        //navigating to the attribute sub-tab
        cy.get(TestCasesPage.attributesTab).click()

        //selecting attribute
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')

        //adding a date value tot he attribute
        cy.get('[id="dateTime"]').eq(0).type('09/12/2023 12:00 AM')

        //adding values to the attribute
        cy.get('[data-testid="quantity-value-input-low"]').type('2')
        cy.get('[id="quantity-unit-input-low"]').click()
        cy.get('[id="quantity-unit-input-low"]').type('m') //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-input-high"]').click()
        cy.get('[id="quantity-unit-input-high"]').type('m') //Select unit as m meter
        cy.get(TestCasesPage.addAttribute).click() //click the "Add" button

        //asserting value that appears in the element table
        cy.get('tbody > tr > :nth-child(1)').should('contain.text', 'Laboratory_test, PerformedChlamydia Screening ')
        cy.get('tbody > tr > :nth-child(4)').should('contain.text', 'View')

        //select new attribute to add
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.interpretationAttribute).click()

        //select value set value for this attribute
        cy.get(TestCasesPage.valueSetSelector).click()
        cy.get(TestCasesPage.ABEMBDiathesisValue).click()

        //select the SNOMED code system
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get(TestCasesPage.codeSNOMEDCTValue).click()

        //select a value for the code
        cy.get(TestCasesPage.codeSystemValueSelector).click()
        cy.get(TestCasesPage.codeSystemOptionValue).click()

        cy.get(TestCasesPage.addAttribute).click() //click the "Add" button

        //asserting value that appears in the element table
        cy.get('tbody > tr > :nth-child(4)').should('contain.text', 'Interpretation - interpretation SNOMEDCT : 112648003')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate back to Edit test case page and Edit Elements
        TestCasesPage.clickEditforCreatedTestCase()
        cy.wait(1000)

        //click on Edit button from Elements table
        cy.get('tbody > tr > :nth-child(5)').contains('View').click()
        cy.get('[class="btn-container"]').contains('Edit').click()

        //Add Code to the Element
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get(TestCasesPage.codeLOINCValue).click()
        cy.get(TestCasesPage.codeSelector).click()
        cy.get('[data-testid="code-option-14463-4"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click() //click the "Add" button
        cy.get('tbody > tr > :nth-child(1)').should('contain.text', 'Laboratory_test, PerformedChlamydia ScreeningLOINC: 14463-4 ')

    })
})
