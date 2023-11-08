import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

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
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
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
        cy.get(TestCasesPage.QDMDob).type('01/01/2020').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Expired').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

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
        cy.get(TestCasesPage.relPStartEnd).first().type('09/12/2023 12:00 AM')


        //adding values to the attribute
        cy.get('[data-testid="quantity-value-input-low"]').type('2')
        cy.get('[id="quantity-unit-dropdown-low"]').click()
        cy.get('#quantity-unit-dropdown-low-option-0').click() //Select unit as m meter
        cy.get('[data-testid="quantity-value-input-high"]').type('4')
        cy.get('[id="quantity-unit-dropdown-high"]').click()
        cy.get('#quantity-unit-dropdown-high-option-0').click() //Select unit as m meter
        cy.get(TestCasesPage.addAttribute).click() //click the "Add" button

        //asserting value that appears in the element table
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsLaboratory_test, PerformedChlamydia Screening relP:  09/12/2023 6:00 AM - N/AReference Range - referenceRange 2 \'m\' - 4 \'m\'View')

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
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1Attribute 2ActionsLaboratory_test, PerformedChlamydia Screening relP:  09/12/2023 6:00 AM - N/AReference Range - referenceRange 2 \'m\' - 4 \'m\'Interpretation - interpretation SNOMEDCT : 112648003View')

    })
})