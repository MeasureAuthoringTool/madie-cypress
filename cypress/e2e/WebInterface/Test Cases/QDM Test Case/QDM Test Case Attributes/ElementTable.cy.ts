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

// Bugs needs to be fixed (MAT-6185)
//  -- not all elements have expected date related fields
//  -- date related fields entries are being recorded in the wrong time
// the above bugs will need to be fixed and, then, this automation will need to be re-visited / completed.
describe.skip('Quantity Attribute', () => {

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

        // “Assessment, Performed” :
        // -- relevantPeriod - relP
        // -- relevant dateTime - reldT
        // -- author dateTime - authdT

        // “Allergy/Intolerance” :
        // -- prevalencePeriod - prevP

        // “Communication, Performed” :**
        // -- sent dateTime - sentdT
        // -- received dateTime - recdT

        // “Laboratory Test, Performed” :
        // -- result dateTime - resdT

        // “Immunization, Order” :**
        // -- active dateTime - actdT

        // “Participation” :**
        // -- participationPeriod - partP

        // “Encounter, Performed” :**
        // -- locationPeriod - locP

        // “Care Goal” :**
        // -- statusDate - statD

        //Laboratory
        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.attributesTab).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')
        cy.get(TestCasesPage.relPStart).first().type('09/12/2023 12:00 AM')
        cy.get(TestCasesPage.relPEnd).first().type('09/13/2023 12:00 AM')

        // <label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-1e662l4" data-shrink="false" data-testid="relevant-datetime" style="margin-bottom: 0px; height: 16px;">Relevant Datetime</label>
        cy.contains('label', 'Relevant Datetime')
            .nextAll() // select the next element
            .find(TestCasesPage.reldT)
            .next()
            .get('[id=dateTime]')
            .type('09/14/2023 12:00 AM')

        //cy.get(TestCasesPage.reldT).next().type('09/14/2023 12:00 AM')
        cy.pause()
        cy.get(TestCasesPage.authdT).first().type('09/11/2023 12:00 AM')
        cy.get(TestCasesPage.resdT).first().type('09/15/2023 12:00 AM')
        cy.pause()
        cy.get('[data-testid=quantity-value-input-low]').type('2')
        cy.get('[id="quantity-unit-dropdown-low"]').click()
        cy.get('#quantity-unit-dropdown-low-option-0').click() //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-dropdown-high"]').click()
        cy.get('#quantity-unit-dropdown-high-option-0').click() //Select unit as m meter
        cy.get(TestCasesPage.plusIcon).click()

        cy.get(TestCasesPage.TimingCellContainer).contains('text', 'relP:          09/12/2023 5:00 AM - 09/13/2023        reldT:          09/14/2023        authdT:          09/11/2023 ')

        //cy.get(TestCasesPage.attributeChip).should('contain.text', 'Reference Range: 2 \'m\' - 4 \'m\'')

    })
})
