import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

let measureName = 'RatioEpisodeSingleIPNoMO' + Date.now()
let CqlLibraryName = 'RatioEpisodeSingleIPNoMO' + Date.now()
let testCaseTitleIppPass = 'IPP PASS'
let testCaseTitleMultipleEpisodesPass = 'Multiple Episodes PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJsonIppPass = TestCaseJson.RatioEpisodeSingleIPNoMO_IPP_PASS
let testCaseJsonMultipleEpisodesPass = TestCaseJson.RatioEpisodeSingleIPNoMO_MultipleEpisodes_PASS
let measureCQL = 'library RatioEpisodeSingleIPNoMO version \'0.0.000\'\n' +
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
    '   [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    '     where InptEncounter.status = \'finished\'\n' +
    '\n' +
    'define "Denominator":\n' +
    '    "Initial Population 1" IP\n' +
    '      where IP.period ends during day of "Measurement Period"\n' +
    '        \n' +
    'define "Denominator Exclusions":\n' +
    '    Denominator Denom\n' +
    '        where Global."LengthInDays"(Denom.period) > 120\n' +
    '\n' +
    'define "Numerator":\n' +
    '    "Denominator" Denom\n' +
    '        where Denom.priority ~ "Unscheduled (qualifier value)"\n' +
    '\n' +
    'define "Numerator Exclusions":\n' +
    '    Numerator Numer\n' +
    '        where Numer.class ~ "Emergency"'

describe('Measure Creation and Testing: Ratio Episode Single IP w/o MO', () => {

    before('Create Measure and Test Case', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2022-01-01', '2022-12-31')

        //create test case
        TestCasesPage.CreateTestCaseAPI(testCaseTitleIppPass, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End Cohort Ratio Episode Single IP w/o MO, IPP Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

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
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population 1')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator Exclusions')

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
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

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

    it('End to End Cohort Ratio Patient Single IP w/o MO, Multiple Episodes Pass Result', () => {

        TestCasesPage.CreateTestCaseAPI(testCaseTitleMultipleEpisodesPass, testCaseDescription, testCaseSeries, testCaseJsonMultipleEpisodesPass)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('2')

        cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXExpected).type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

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
