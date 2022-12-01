import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"

let measureName = 'CVEpisodeWithMO' + Date.now()
let CqlLibraryName = 'CVEpisodeWithMO' + Date.now()
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.CVEpisodeWithMO_PASS
let measureCQL = 'library TestLibrary356786y8 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "SNOMED": \'http://snomed.info/sct\'\n' +
    '\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n' +
    '\n' +
    'code "Unscheduled (qualifier value)": \'103390000\' from "SNOMED" display \'Unscheduled (qualifier value)\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '   [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    '      where InptEncounter.status = \'finished\' \n' +
    '       \n' +
    'define "Measure Population":\n' +
    '    "Initial Population" IP\n' +
    '      where IP.period ends during day of "Measurement Period"\n' +
    '\n' +
    'define "Measure Population Exclusions":\n' +
    '    "Measure Population" MP \n' +
    '    where Global."LengthInDays"(MP.period) > 120\n' +
    '\n' +
    'define function "Measure Observation"(Encounter Encounter): \n' +
    '  Count({\n' +
    '        Encounter Enc\n' +
    '          where Enc.priority ~ "Unscheduled (qualifier value)"          \n' +
    '          })'

describe('Measure Creation and Testing: CV Episode Measure With MO', () => {

    before('Create Measure, Test Case and Login', () => {

        OktaLogin.Login()
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2022-01-01', '2022-12-31')

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Login()

    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End CV Episode Measure with MO, Pass Result', () => {

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

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Continuous Variable')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Measure Population')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'Measure Observation')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).type('1')
        cy.get(TestCasesPage.measureObservationRow).type('1')

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')

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
