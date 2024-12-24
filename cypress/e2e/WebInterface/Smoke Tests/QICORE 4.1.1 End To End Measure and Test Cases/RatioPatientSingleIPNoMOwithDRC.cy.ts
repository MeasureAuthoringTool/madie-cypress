import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'RatioPatientSingleIPNoMODRC' + Date.now()
let CqlLibraryName = 'RatioPatientSingleIPNoMODRC' + Date.now()
let testCaseTitleIppPass = 'IPP PASS'
let testCaseTitleDrcPass = 'DRC PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioPatientSingleIPNoMO_IPP_PASS
let testCaseJsonDrcPass = TestCaseJson.RatioPatientSingleIPNoMO_DRC_PASS
let measureCQL = 'library RatioPatientSingleIPNoMO version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "SNOMED": \'http://snomed.info/sct\'\n' +
    'codesystem "ActCode": \'http://terminology.hl7.org/CodeSystem/v3-ActCode\'\n' +
    '\n' +
    'valueset "Emergency Department Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.292\'\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n' +
    '\n' +
    'code "Unscheduled (qualifier value)": \'103390000\' from "SNOMED" display \'Unscheduled (qualifier value)\'\n' +
    'code "Emergency": \'EMER\' from "ActCode" display \'Emergency\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population 1":\n' +
    '   exists "Inpatient Encounters"\n' +
    '\n' +
    'define "Denominator":\n' +
    '    exists "Inpatient Encounters Ends During MP"\n' +
    '        \n' +
    'define "Denominator Exclusions":\n' +
    '    exists "Inpatient Encounters Ends During MP GT 120 Days"\n' +
    '\n' +
    'define "Numerator":\n' +
    '    exists "Unscheduled Inpatient Encounters Ends During MP"\n' +
    '\n' +
    'define "Numerator Exclusions":\n' +
    '    exists "Unscheduled Emergency Inpatient Encounters Ends During MP"\n' +
    '\n' +
    'define "Inpatient Encounters":\n' +
    '  [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    '      where InptEncounter.status = \'finished\'\n' +
    '\n' +
    'define "Inpatient Encounters Ends During MP":\n' +
    '  "Inpatient Encounters" IE\n' +
    '        where IE.period ends during day of "Measurement Period"\n' +
    '\n' +
    'define "Inpatient Encounters Ends During MP GT 120 Days":\n' +
    '  "Inpatient Encounters Ends During MP" IE\n' +
    '        where Global."LengthInDays"(IE.period) > 120\n' +
    '\n' +
    'define "Unscheduled Inpatient Encounters Ends During MP":\n' +
    '  "Inpatient Encounters Ends During MP" IE\n' +
    '        where IE.priority ~ "Unscheduled (qualifier value)"\n' +
    '\n' +
    'define "Unscheduled Emergency Inpatient Encounters Ends During MP":\n' +
    '  "Unscheduled Inpatient Encounters Ends During MP" IE\n' +
    '        where IE.class ~ "Emergency"'

describe('Measure Creation and Testing: Ratio Patient Single IP w/o MO w/ DRC', () => {

    before('Create Measure and Test Case', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2022-01-01', '2022-12-31')

        TestCasesPage.CreateTestCaseAPI(testCaseTitleIppPass, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Cohort Ratio Patient Single IP w/o MO w/ DRC, IPP Pass Result', () => {

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
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Ratio')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population 1')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator Exclusions')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully ' +
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

    it('End to End Cohort Ratio Patient Single IP w/o MO w/ DRC, DRC Pass Result', () => {

        TestCasesPage.CreateTestCaseAPI(testCaseTitleDrcPass, testCaseDescription, testCaseSeries, testCaseJsonDrcPass)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).click()
        cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXExpected).click()
        cy.get(TestCasesPage.testCaseNUMEXExpected).check().should('be.checked')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully ' +
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
