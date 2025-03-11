import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'RatioEpisodeTwoIPsWithMOs' + Date.now()
let CqlLibraryName = 'RatioEpisodeTwoIPsWithMOs' + Date.now()
let testCaseTitlePass = 'MO PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioEpisodeTwoIPsWithMOs_PASS
let measureCQL = 'library HHSH version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include QICoreCommon version \'1.2.000\' called QICoreCommon\n' +
    'include CQMCommon version \'1.0.000\' called CQMCommon\n' +
    '\n' +
    'valueset "Diabetes": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1001\'\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n' +
    'valueset "Emergency Department Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.292\'\n' +
    'valueset "Hypoglycemics Treatment Medications": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1196.394\'\n' +
    '\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population 1":\n' +
    '    [Encounter: "Encounter Inpatient"] \n' +
    '    \n' +
    'define "Initial Population 2":\n' +
    '    [Encounter: "Emergency Department Visit"] \n' +
    '       \n' +
    'define "Denominator":\n' +
    '    "Initial Population 1" IP\n' +
    '        with [Condition: "Diabetes"] Dx\n' +
    '            such that Dx.toPrevalenceInterval() starts before start of IP.period\n' +
    '    \n' +
    'define "Numerator":\n' +
    '    "Initial Population 2" IP\n' +
    '        with [Condition: "Diabetes"] Dx\n' +
    '            such that Dx.toPrevalenceInterval() starts before start of IP.period\n' +
    '    \n' +
    'define function "Denominator Observation"(TheEncounter Encounter):\n' +
    '    Count( [MedicationRequest: "Hypoglycemics Treatment Medications"] MedOrder\n' +
    '        with TheEncounter E \n' +
    '            such that MedOrder.authoredOn before start of E.period )\n' +
    '            \n' +
    'define function "Numerator Observation"(TheEncounter Encounter):\n' +
    '    Count( [MedicationRequest: "Hypoglycemics Treatment Medications"] MedOrder\n' +
    '        with TheEncounter E \n' +
    '            such that MedOrder.authoredOn before start of E.period )'

describe('Measure Creation and Testing: Ratio Episode Two IPs w/ MOs', () => {

    before('Create Measure and Test Case', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2022-01-01', '2022-12-31')

        TestCasesPage.CreateTestCaseAPI(testCaseTitlePass, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Ratio')

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.dropdownSelect(MeasureGroupPage.firstInitialPopulationSelect, 'Initial Population 1')
        Utilities.dropdownSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial Population 2')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()

        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Denominator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'Numerator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Sum')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Ratio Episode Two IPs w/ MOs Pass Result', () => {

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).clear().type('2')

        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).clear().type('2')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).clear().type('2')

        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).should('exist')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).should('be.enabled')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).should('be.visible')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('1')

        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).should('exist')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).should('be.enabled')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).should('be.visible')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('1')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).clear().type('2')

        cy.get(TestCasesPage.numeratorObservationRow).eq(0).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).should('be.enabled')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).should('be.visible')
        cy.get(TestCasesPage.numeratorObservationRow).eq(0).clear().type('1')

        cy.get(TestCasesPage.numeratorObservationRow).eq(1).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).should('be.enabled')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).should('be.visible')
        cy.get(TestCasesPage.numeratorObservationRow).eq(1).clear().type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
