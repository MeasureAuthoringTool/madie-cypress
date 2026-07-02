import { denominatorCriteriaReference, numeratorCriteriaReference } from './MeasureGroupConstants'
import { MeasureGroupBody, TestData } from './TestData'

export class MeasureGroupDescriptionTestData {
    private static descriptionValue(description: string, includeDescriptions: boolean): string | null {
        return includeDescriptions ? description : null
    }

    public static describedRatioPopulations(includeDescriptions = true) {
        return [
            TestData.population('initialPopulation', 'ipp', {
                description: this.descriptionValue('Initial Population Description', includeDescriptions)
            }),
            TestData.population('denominator', 'denom', {
                id: denominatorCriteriaReference,
                description: this.descriptionValue('Denominator Description', includeDescriptions)
            }),
            TestData.population('denominatorExclusion', 'ipp', {
                description: this.descriptionValue('Denominator Exclusion Description', includeDescriptions)
            }),
            TestData.population('numerator', 'num', {
                id: numeratorCriteriaReference,
                description: this.descriptionValue('Numerator Description', includeDescriptions)
            }),
            TestData.population('numeratorExclusion', 'numeratorExclusion', {
                description: this.descriptionValue('Numerator Exclusion Description', includeDescriptions)
            })
        ]
    }

    public static describedSecondInitialPopulationRatioPopulations(includeDescriptions = true) {
        return [
            TestData.population('initialPopulation', 'ipp', {
                description: this.descriptionValue('Initial Population 1 Description', includeDescriptions)
            }),
            TestData.population('initialPopulation', 'ipp', {
                description: this.descriptionValue('Initial Population 2 Description', includeDescriptions)
            }),
            TestData.population('denominator', 'denom', {
                id: denominatorCriteriaReference,
                description: this.descriptionValue('Denominator Description', includeDescriptions)
            }),
            TestData.population('denominatorExclusion', 'ipp', {
                description: this.descriptionValue('Denominator Exclusion Description', includeDescriptions)
            }),
            TestData.population('numerator', 'num', {
                id: numeratorCriteriaReference,
                description: this.descriptionValue('Numerator Description', includeDescriptions)
            }),
            TestData.population('numeratorExclusion', 'numeratorExclusion', {
                description: this.descriptionValue('Numerator Exclusion Description', includeDescriptions)
            })
        ]
    }

    public static describedRatioMeasureObservations(includeDescriptions = true) {
        return [
            {
                id: 'b2622e59-a169-45af-a4b5-fe298e220ae4',
                definition: 'isFinishedEncounter',
                description: this.descriptionValue('denominator observation description', includeDescriptions),
                criteriaReference: denominatorCriteriaReference,
                aggregateMethod: 'Count'
            },
            {
                id: '5da9610f-bdc5-4922-bd43-48ae0a0b07a4',
                definition: 'isFinishedEncounter',
                description: this.descriptionValue('numerator observation description', includeDescriptions),
                criteriaReference: numeratorCriteriaReference,
                aggregateMethod: 'Average'
            }
        ]
    }

    public static describedContinuousVariableObservationPopulations(includeDescriptions = true) {
        return [
            TestData.population('initialPopulation', 'ipp', {
                associationType: null,
                description: this.descriptionValue('Initial Population Description on CV', includeDescriptions)
            }),
            TestData.population('measurePopulation', 'denom', {
                associationType: null,
                description: this.descriptionValue('Measure Population Description on CV', includeDescriptions)
            })
        ]
    }

    public static describedContinuousVariableMeasureObservations(includeDescriptions = true) {
        return [
            {
                id: '60778b60-e913-4a6a-98ae-3f0cf488b710',
                definition: 'isFinishedEncounter',
                description: this.descriptionValue('Measure Observations description on CV', includeDescriptions),
                criteriaReference: null,
                aggregateMethod: 'Count'
            }
        ]
    }

    public static describedRatioGroup(
        includeDescriptions = true,
        overrides: Partial<MeasureGroupBody> = {}
    ): MeasureGroupBody {
        return {
            scoring: 'Ratio',
            populations: this.describedRatioPopulations(includeDescriptions),
            measureObservations: this.describedRatioMeasureObservations(includeDescriptions),
            ...overrides
        }
    }

    public static describedSecondInitialPopulationRatioGroup(
        includeDescriptions = true,
        overrides: Partial<MeasureGroupBody> = {}
    ): MeasureGroupBody {
        return {
            scoring: 'Ratio',
            populations: this.describedSecondInitialPopulationRatioPopulations(includeDescriptions),
            measureObservations: this.describedRatioMeasureObservations(includeDescriptions),
            ...overrides
        }
    }

    public static describedContinuousVariableObservationGroup(
        includeDescriptions = true,
        overrides: Partial<MeasureGroupBody> = {}
    ): MeasureGroupBody {
        return {
            scoring: 'Continuous Variable',
            populations: this.describedContinuousVariableObservationPopulations(includeDescriptions),
            measureObservations: this.describedContinuousVariableMeasureObservations(includeDescriptions),
            ...overrides
        }
    }
}
