import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { 
    MeasureGroupPage, 
    MeasureGroups, 
    MeasureScoring, 
    MeasureType, 
    PopulationBasis 
} from "../../../../Shared/MeasureGroupPage"

let measureName = 'ProportionEpisode' + Date.now()
let CqlLibraryName = 'ProportionEpisode' + Date.now()
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.ProportionEpisode_PASS
let measureCQL = 'library ProportionEpisodeMeasure version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n\n' +
    'codesystem "SNOMED": \'http://snomed.info/sct\'\n\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n\n' +
    'code "Unscheduled (qualifier value)": \'103390000\' from "SNOMED" display \'Unscheduled (qualifier value)\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n\n' +
    'context Patient\n\n' +
    'define "Initial Population":\n' +
    '   [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    '      where InptEncounter.status = \'finished\'\n\n' +
    'define "Denominator":\n' +
    '    "Initial Population" IP\n' +
    '      where IP.period ends during day of "Measurement Period"\n\n' +
    'define "Numerator":\n' +
    '    "Denominator" denom \n' +
    '    where Global."LengthInDays"(denom.period) > 120\n\n' +
    'define function "Measure Observation"(Encounter Encounter): \n' +
    '  Count({\n' +
    '        Encounter Enc\n' +
    '          where Enc.priority ~ "Unscheduled (qualifier value)"\n' +
    '          })'

describe('Measure Creation and Testing: Proportion Episode Measure', () => {

    const pops: MeasureGroups = {
        initialPopulation: 'Initial Population',
        denominator: 'Denominator',
        numerator: 'Numerator'
    }

    before('Create Measure, Test Case and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2023-01-01', '2023-12-31')
            MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.encounter, MeasureScoring.Proportion, pops)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)
    })

    after('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Proportion Episode Measure, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
