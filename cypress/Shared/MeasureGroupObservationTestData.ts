import { denominatorCriteriaReference, numeratorCriteriaReference } from './MeasureGroupConstants'
import { MeasureGroupBody, TestData } from './TestData'

export class MeasureGroupObservationTestData {
    public static ratioObservationPopulations() {
        return [
            TestData.population('initialPopulation', 'ipp'),
            TestData.population('denominator', 'denom', {
                id: denominatorCriteriaReference
            }),
            TestData.population('denominatorExclusion', ''),
            TestData.population('numerator', 'num', {
                id: numeratorCriteriaReference
            }),
            TestData.population('numeratorExclusion', '')
        ]
    }

    public static ratioMeasureObservations() {
        return [
            {
                id: 'b2622e59-a169-45af-a4b5-fe298e220ae4',
                definition: 'isFinishedEncounter',
                criteriaReference: denominatorCriteriaReference,
                aggregateMethod: 'Count'
            },
            {
                id: '5da9610f-bdc5-4922-bd43-48ae0a0b07a4',
                definition: 'isFinishedEncounter',
                criteriaReference: numeratorCriteriaReference,
                aggregateMethod: 'Average'
            }
        ]
    }

    public static continuousVariableObservationPopulations() {
        return [TestData.population('initialPopulation', 'ipp'), TestData.population('measurePopulation', 'denom')]
    }

    public static continuousVariableMeasureObservations() {
        return [
            {
                id: '60778b60-e913-4a6a-98ae-3f0cf488b710',
                definition: 'isFinishedEncounter',
                criteriaReference: null,
                aggregateMethod: 'Count'
            }
        ]
    }

    public static ratioObservationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Ratio',
            populations: this.ratioObservationPopulations(),
            measureObservations: this.ratioMeasureObservations(),
            ...overrides
        }
    }

    public static continuousVariableObservationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Continuous Variable',
            populations: this.continuousVariableObservationPopulations(),
            measureObservations: this.continuousVariableMeasureObservations(),
            ...overrides
        }
    }
}
