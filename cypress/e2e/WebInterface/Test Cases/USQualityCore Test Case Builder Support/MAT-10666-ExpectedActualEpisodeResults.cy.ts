import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import {
    MeasureGroupPage,
    MeasureGroups,
    MeasureObservations,
    MeasureScoring,
    MeasureType,
    PopulationBasis
} from '../../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { MeasureGroupBody, TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

const now = Date.now()
const measureName = `MAT10666NHSNHOB${now}`
const libraryName = `MAT10666NHSNHOBLibrary${now}`
const testCaseTitle = '12-HOB-Day-6'
const testCaseDescription = 'HOB result with no O-COB result'
const testCaseSeries = 'MAT-10666'
const cqlFixturePath = 'cypress/fixtures/MAT-10666-ExpectedActualEpisodeResults.cql'
const suppliedTestCaseBundle = require('../../../../fixtures/MAT-10666-HOB-Day-6.json')
const testCaseJson = JSON.stringify(suppliedTestCaseBundle)
const ratioScoringUnit = {
    label: '/100.d',
    value: {
        code: '/100.d',
        name: '',
        guidance: '',
        system: 'https://clinicaltables.nlm.nih.gov/'
    }
}

describe('MAT-10666 Expected/Actual episode results', () => {
    const hobIncidenceDensityPopulations: MeasureGroups = {
        initialPopulation: 'MAT-10666 HOB Encounter Result',
        denominator: 'MAT-10666 HOB Encounter Result',
        numerator: 'MAT-10666 HOB Encounter Result'
    }
    const oCobPrevalencePopulations: MeasureGroups = {
        initialPopulation: 'MAT-10666 No Encounter Result',
        denominator: 'MAT-10666 No Encounter Result',
        numerator: 'MAT-10666 No Encounter Result'
    }
    const denominatorObservation: MeasureObservations = {
        definition: 'MAT-10666 Observation',
        aggregateMethod: 'Sum'
    }
    const numeratorObservation: MeasureObservations = {
        definition: 'MAT-10666 Observation',
        aggregateMethod: 'Sum'
    }

    before('Create the MAT-10666 regression measure and supplied HOB test case', () => {
        return cy.readFile(cqlFixturePath).then((measureCql) => {
            CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.USQC, {
                measureCql,
                mpStartDate: '2026-01-01',
                mpEndDate: '2026-12-31'
            })
            return TestData.saveCurrentMeasureCql()
                .then(TestData.expectSavedMeasureCql)
                .then(() => {
                    // Put the group with episode observation results first. The supplied HOB bundle has no O-COB results.
                    MeasureGroupPage.CreateMeasureGroupAPI(
                        MeasureType.outcome,
                        PopulationBasis.encounter,
                        MeasureScoring.Ratio,
                        hobIncidenceDensityPopulations,
                        false,
                        denominatorObservation,
                        numeratorObservation,
                        undefined,
                        ratioScoringUnit
                    )
                    MeasureGroupPage.CreateMeasureGroupAPI(
                        MeasureType.outcome,
                        PopulationBasis.encounter,
                        MeasureScoring.Proportion,
                        oCobPrevalencePopulations
                    )
                    return TestData.requestMeasureGroup<MeasureGroupBody[]>('GET')
                        .then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).to.have.length(2)

                            const [ratioGroup, proportionGroup] = response.body
                            expect(ratioGroup.scoring).to.eql(MeasureScoring.Ratio)
                            expect(ratioGroup.populationBasis).to.eql(PopulationBasis.encounter)
                            expect(ratioGroup.scoringUnit).to.deep.equal(ratioScoringUnit)
                            expect(ratioGroup.measureObservations).to.have.length(2)
                            const populationIds = ratioGroup.populations.map(({ id }) => id)
                            ratioGroup.measureObservations?.forEach(({ criteriaReference }) => {
                                expect(criteriaReference).to.be.a('string').and.not.be.empty
                                expect(populationIds).to.include(criteriaReference)
                            })
                            expect(proportionGroup.scoring).to.eql(MeasureScoring.Proportion)
                            expect(proportionGroup.populationBasis).to.eql(PopulationBasis.encounter)
                            expect(proportionGroup.scoringUnit).to.be.null
                        })
                        .then(() => {
                            TestCasesPage.CreateTestCaseAPI(
                                testCaseTitle,
                                testCaseDescription,
                                testCaseSeries,
                                testCaseJson
                            )
                            return OktaLogin.SessionLogin()
                        })
                })
        })
    })

    after('Clean up', () => {
        return Utilities.deleteMeasure()
    })

    it('shows Expected/Actual after execution when the second group has no episode results', () => {
        MeasuresPage.actionCenter('edit')
        TestCasesPage.openTestCasesTabAndWaitForList()
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })

        const firstGroupExpectedValues = [
            { selector: TestCasesPage.testCaseIPPExpected, value: '1', index: 0 },
            { selector: TestCasesPage.testCaseDENOMExpected, value: '1', index: 0 },
            { selector: TestCasesPage.testCaseNUMERExpected, value: '1', index: 0 }
        ]
        TestCasesPage.clearExpectedActualValues(firstGroupExpectedValues)
        TestCasesPage.typeExpectedActualValues(firstGroupExpectedValues)
        TestCasesPage.saveTestCaseAndWait()

        TestCasesPage.openExpectedActualTab({ readySelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.runTestCaseAndWaitForCompletion()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('have.attr', 'aria-selected', 'true')
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.ippActualCheckBox).eq(0).should('have.value', '1')
        cy.get(TestCasesPage.ippActualCheckBox).eq(1).should('have.value', '0')
    })
})
