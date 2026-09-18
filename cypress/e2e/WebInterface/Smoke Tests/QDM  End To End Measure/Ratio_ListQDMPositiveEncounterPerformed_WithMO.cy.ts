import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { QDMElements } from '../../../../Shared/QDMElements'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { Toasts } from '../../../../Shared/Toasts'

const now = Date.now()
const measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + now
const CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + now
const firstTestCaseTitle = '3Encounters1Exclusion'
const testCaseDescription = 'DENEXPass' + now
const testCaseSeries = 'SBTestSeries'
const secondTestCaseTitle = '2EncBothGlucose1000inAndoutsideOfTimeframe'
const measureCQL = MeasureCQL.QDMRatio_ListPositiveEncounterPerformed_withMO

const addDiabetesDiagnosis = (startDate: string, endDate: string) => {
    QDMElements.addElement('condition', 'Diagnosis: Diabetes')
    QDMElements.addTimingPrevalencePeriodDateTime(startDate, endDate)
    QDMElements.addCode('SNOMEDCT', '46635009')
}

const addInpatientEncounter = (startDate: string, endDate: string) => {
    QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
    QDMElements.addTimingRelevantPeriodDateTime(startDate, endDate)
    QDMElements.addCode('SNOMEDCT', '183452005')
}

const addGlucoseLaboratoryResult = (date: string, code: string, result: string, endDate?: string) => {
    QDMElements.addElement('laboratory', 'Performed: Glucose Lab Test Mass Per Volume')
    if (endDate) {
        QDMElements.addTimingRelevantPeriodDateTime(date, endDate)
    } else {
        cy.get('[data-testid="relevant-datetime-input"]').type(date)
    }
    QDMElements.addCode('LOINC', code)
    QDMElements.enterAttribute('Result', 'Quantity')
    QDMElements.enterQuantity(result, 'mg/dl')
    QDMElements.addAttribute()
}

describe('Measure Creation: Ratio ListQDMPositiveEncounterPerformed with MO', () => {
    before('Create Measure', () => {
        CreateMeasurePage.CreateQDMMeasureAPI(
            measureName,
            CqlLibraryName,
            measureCQL,
            false,
            false,
            '2023-01-01',
            '2023-12-31'
        )

        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, undefined, true)

        OktaLogin.Login()
    })

    after('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End Ratio ListQDMPositiveEncounterPerformed with MO', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        // Group Creation
        EditMeasurePage.openPopulationCriteriaTab(MeasureGroupPage.leftPanelBaseConfigTab)

        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible').click()
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Toasts.clearToast(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 'Measure Base Configuration Updated Successfully')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'DenominatorObservations')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator Exclusions')
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'NumeratorObservations')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Sum')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible').click()
        Toasts.clearToast(EditMeasurePage.successMessage, 'Population details for this group saved successfully.')

        MeasureGroupPage.includeSdeData()

        //Add Elements to first Test case
        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics(
            '07/31/2003 12:00 AM',
            'Living',
            'White',
            'Male',
            'Not Hispanic or Latino'
        )

        addDiabetesDiagnosis('07/09/2023 08:00 AM', ' ')

        addInpatientEncounter('07/11/2023 08:00 AM', '07/15/2023 09:00 AM')

        addGlucoseLaboratoryResult('07/11/2023 07:00 AM', '1556-0', '1000')

        addInpatientEncounter('10/11/2023 08:00 AM', '10/18/2023 08:15 AM')

        addGlucoseLaboratoryResult('10/13/2023 08:00 AM', '1556-0', '1100')

        addInpatientEncounter('11/01/2023 08:00 AM', '11/04/2023 08:15 AM')

        TestCasesPage.saveTestCaseAndWait()

        //Add Expected value for Test case
        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')

        const firstExpectedValues = [
            { selector: TestCasesPage.testCaseDENOMExpected, value: '3' },
            { selector: TestCasesPage.denominatorObservationExpectedRow, value: '2', clearFirst: true, index: 0 },
            { selector: TestCasesPage.denominatorObservationExpectedRow, value: '6', clearFirst: true, index: 1 },
            { selector: TestCasesPage.testCaseDENEXExpected, value: '1' },
            { selector: TestCasesPage.testCaseNUMERExpected, value: '1' },
            { selector: TestCasesPage.numeratorObservationRow, value: '1', clearFirst: true },
            // Population updates rerender the Initial Population controlled input; enter it last.
            { selector: TestCasesPage.testCaseIPPExpected, value: '3' }
        ]
        TestCasesPage.typeExpectedActualValues(firstExpectedValues)
        //Save Test case
        TestCasesPage.saveTestCaseAndWait()
        Toasts.clearToast(EditMeasurePage.successMessage, 'Test Case Updated Successfully')
        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.assertExpectedActualValues(firstExpectedValues)

        //Add Elements to the second Test case
        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics(
            '07/31/2003 12:00 AM',
            'Living',
            'White',
            'Male',
            'Not Hispanic or Latino'
        )

        addDiabetesDiagnosis('07/09/2023 08:00 AM', '07/11/2023 08:00 AM')

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

        addGlucoseLaboratoryResult('07/11/2023 08:00 AM', '1556-0', '1000')

        //Element - Encounter:Performed: Observation Services
        //add Element
        QDMElements.addElement('encounter', 'Performed: Observation Services')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/07/2023 08:00 AM', '03/08/2023 08:15 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '448951000124107')
        //Close the Element
        QDMElements.closeElement()

        addInpatientEncounter('03/08/2023 08:30 AM', '03/11/2023 08:15 AM')

        addGlucoseLaboratoryResult('03/08/2023 08:30 AM', '1547-9', '201', '03/08/2023 08:45 AM')
        //Close the Element
        QDMElements.closeElement()

        addGlucoseLaboratoryResult('03/08/2023 09:30 AM', '1547-9', '1000', '03/08/2023 10:15 AM')

        TestCasesPage.saveTestCaseAndWait()

        //Add Expected value for Test case
        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        const secondExpectedValues = [
            { selector: TestCasesPage.testCaseDENOMExpected, value: '2', clearFirst: true },
            { selector: TestCasesPage.denominatorObservationExpectedRow, value: '3', clearFirst: true, index: 0 },
            { selector: TestCasesPage.testCaseDENEXExpected, value: '1', clearFirst: true },
            { selector: TestCasesPage.testCaseNUMERExpected, value: '1', clearFirst: true },
            { selector: TestCasesPage.numeratorObservationRow, value: '1', clearFirst: true },
            // Population updates rerender the Initial Population controlled input; enter it last.
            { selector: TestCasesPage.testCaseIPPExpected, value: '2' }
        ]
        TestCasesPage.typeExpectedActualValues(secondExpectedValues)

        //Save Test case
        TestCasesPage.saveTestCaseAndWait()
        Toasts.clearToast(EditMeasurePage.successMessage, 'Test Case Updated Successfully')
        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.assertExpectedActualValues(secondExpectedValues)

        //Execute Test case on Test Case page
        TestCasesPage.openTestCasesTabAndWaitForList()
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        // QDM list execution has no stable request route; named row status is the completion signal.
        TestCasesPage.assertTestCaseStatus(firstTestCaseTitle, 'Pass')
        TestCasesPage.assertTestCaseStatus(secondTestCaseTitle, 'Pass')
    })
})
