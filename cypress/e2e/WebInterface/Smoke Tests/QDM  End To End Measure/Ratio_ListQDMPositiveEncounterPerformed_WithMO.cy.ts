import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../Shared/QDMElements"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

const now = Date.now()
const measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + now
const CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + now
const firstTestCaseTitle = '3Encounters1Exclusion'
const testCaseDescription = 'DENEXPass' + now
const testCaseSeries = 'SBTestSeries'
const secondTestCaseTitle = '2EncBothGlucose1000inAndoutsideOfTimeframe'
const measureCQL = MeasureCQL.QDMRatio_ListPositiveEncounterPerformed_withMO

describe('Measure Creation: Ratio ListQDMPositiveEncounterPerformed with MO', () => {

    before('Create Measure', () => {
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2023-01-01', '2023-12-31')
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, null, true)

        OktaLogin.Login()
    })

    after('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Ratio ListQDMPositiveEncounterPerformed with MO', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully')

        //Group Creation
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.waitForElementVisible(MeasureGroupPage.denominatorSelect, 50000)
        cy.get(MeasureGroupPage.denominatorSelect).click()
            .get('ul > li[data-value="Denominator"]').wait(2000).click()

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'DenominatorObservations')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator Exclusions')

        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).should('exist')
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'NumeratorObservations')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Sum')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/31/2003 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Element - Condition: Diagnosis: Diabetes
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Diabetes')
        QDMElements.addTimingPrevalencePeriodDateTime('07/09/2023 08:00 AM', ' ')

        //add Code
        QDMElements.addCode('SNOMEDCT', '46635009')

        //Element - Encounter:Performed:Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('07/11/2023 08:00 AM', '07/15/2023 09:00 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Glucose Lab Test Mass Per Volume')
        cy.get('[data-testid="relevant-datetime-input"]').type('07/11/2023 07:00 AM')
        //add Code
        QDMElements.addCode('LOINC', '1556-0')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1000', 'mg/dl')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Encounter:Performed:Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('10/11/2023 08:00 AM', '10/18/2023 08:15 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Glucose Lab Test Mass Per Volume')
        cy.get('[data-testid="relevant-datetime-input"]').type('10/13/2023 08:00 AM')
        //add Code
        QDMElements.addCode('LOINC', '1556-0')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1100', 'mg/dl')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Encounter:Performed:Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('11/01/2023 08:00 AM', '11/04/2023 08:15 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('3')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('2')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('6')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Add Elements to the second Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/31/2003 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Element - Condition: Diagnosis: Diabetes
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Diabetes')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingPrevalencePeriodDateTime('07/09/2023 08:00 AM', '07/11/2023 08:00 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '46635009')

        //Element - Encounter:Performed:Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('07/11/2023 08:00 AM', '07/13/2023 09:00 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')
        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('2', 'd')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Glucose Lab Test Mass Per Volume')
        cy.get('[data-testid="relevant-datetime-input"]').type('07/11/2023 08:00 AM')
        //add Code
        QDMElements.addCode('LOINC', '1556-0')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1000', 'mg/dl')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Encounter:Performed: Observation Services
        //add Element
        QDMElements.addElement('encounter', 'Performed: Observation Services')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/07/2023 08:00 AM', '03/08/2023 08:15 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '448951000124107')
        //Close the Element
        QDMElements.closeElement()

        //Element - Encounter:Performed:Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/08/2023 08:30 AM', '03/11/2023 08:15 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Glucose Lab Test Mass Per Volume')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/08/2023 08:30 AM', '03/08/2023 08:45 AM')
        //add Code
        QDMElements.addCode('LOINC', '1547-9')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('201', 'mg/dl')
        //add attribute to test case action
        QDMElements.addAttribute()
        //Close the Element
        QDMElements.closeElement()

        //Element - Laboratory Test: Performed: Glucose Lab Test Mass Per Volume
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Glucose Lab Test Mass Per Volume')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/08/2023 09:30 AM', '03/08/2023 10:15 AM')
        //add Code
        QDMElements.addCode('LOINC', '1547-9')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1000', 'mg/dl')
        //add attribute to test case action
        QDMElements.addAttribute()

        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('3')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Execute Test case on Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')

    })
})