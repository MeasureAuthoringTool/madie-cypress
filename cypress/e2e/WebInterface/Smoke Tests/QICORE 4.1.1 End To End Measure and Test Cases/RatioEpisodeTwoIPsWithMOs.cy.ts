import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { QiCore4Cql } from '../../../../Shared/FHIRMeasuresCQL'
import { Toasts } from '../../../../Shared/Toasts'

const measureName = 'RatioEpisodeTwoIPsWithMOs' + Date.now()
const CqlLibraryName = 'RatioEpisodeTwoIPsWithMOs' + Date.now()
const testCaseTitlePass = 'MO PASS'
const testCaseDescription = 'PASS' + Date.now()
const testCaseSeries = 'SBTestSeries'
const testCaseJsonIppPass = TestCaseJson.RatioEpisodeTwoIPsWithMOs_PASS
const measureCQL = QiCore4Cql.ratioEpisodeTwoIPTwoMO

// upgraded into RatioEncounterSingleIPWithMOs600.cy.ts
describe('Measure Creation and Testing: Ratio Episode Two IPs w/ MOs', () => {
    before('Create Measure and Test Case', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(
            measureName,
            CqlLibraryName,
            measureCQL,
            0,
            false,
            '2022-01-01',
            '2022-12-31',
        )

        TestCasesPage.CreateTestCaseAPI(testCaseTitlePass, testCaseDescription, testCaseSeries, testCaseJsonIppPass)

        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        //Create Measure Group
        EditMeasurePage.openPopulationCriteriaTab(MeasureGroupPage.measureGroupTypeSelect)

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.populationSelect(MeasureGroupPage.firstInitialPopulationSelect, 'Initial Population 1')
        Utilities.populationSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial Population 2')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('be.visible').click()
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        cy.get(MeasureGroupPage.addNumeratorObservationLink).should('be.visible').click()
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Denominator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Sum')
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'Numerator Observation')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorAggregateFunction, 'Sum')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.intercept('POST', '/api/measures/**/groups').as('createMeasureGroup')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@createMeasureGroup', { timeout: 60000 })
            .its('response.statusCode')
            .should('be.oneOf', [200, 201, 202])

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.',
        )
        Utilities.waitForElementDisabled(MeasureGroupPage.saveMeasureGroupDetails, 30000)
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('End to End Ratio Episode Two IPs w/ MOs Pass Result', () => {
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        const populationExpectedValues = [
            { selector: TestCasesPage.testCaseIPPExpected, value: '2', clearFirst: true, index: 0 },
            { selector: TestCasesPage.testCaseIPPExpected, value: '2', clearFirst: true, index: 1 },
            { selector: TestCasesPage.testCaseDENOMExpected, value: '2', clearFirst: true },
            { selector: TestCasesPage.testCaseNUMERExpected, value: '2', clearFirst: true },
        ]
        TestCasesPage.typeExpectedActualValues(populationExpectedValues)

        cy.get(TestCasesPage.denominatorObservationExpectedRow).should('have.length', 2)
        cy.get(TestCasesPage.numeratorObservationRow).should('have.length', 2)
        const expectedValues = [
            ...populationExpectedValues,
            { selector: TestCasesPage.denominatorObservationExpectedRow, value: '1', clearFirst: true, index: 0 },
            { selector: TestCasesPage.denominatorObservationExpectedRow, value: '1', clearFirst: true, index: 1 },
            { selector: TestCasesPage.numeratorObservationRow, value: '1', clearFirst: true, index: 0 },
            { selector: TestCasesPage.numeratorObservationRow, value: '1', clearFirst: true, index: 1 },
        ]
        TestCasesPage.typeExpectedActualValues(expectedValues)

        TestCasesPage.openDetailsTab(TestCasesPage.editTestCaseSaveButton)
        TestCasesPage.saveTestCaseAndWait()
        cy.get(Toasts.otherSuccessToast).should(
            'contain.text',
            'Test case updated successfully with warnings in JSON',
        )

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        TestCasesPage.assertExpectedActualValues(expectedValues)

        TestCasesPage.runTestCaseAndWaitForCompletion()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')

        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.executeTestCasesAndWaitForCompletion()
        TestCasesPage.assertTestCaseStatus(testCaseTitlePass, 'Pass')
    })
})
