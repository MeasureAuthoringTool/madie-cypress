import { TestData } from './TestData'

export class MeasureGroupPopulationTestData {
    public static proportionPopulations() {
        return [
            TestData.population('initialPopulation', 'ipp'),
            TestData.population('numerator', 'num'),
            TestData.population('denominator', 'denom')
        ]
    }

    public static ratioPopulations() {
        return [
            TestData.population('initialPopulation', 'ipp'),
            TestData.population('numerator', 'num'),
            TestData.population('numeratorExclusion', 'numeratorExclusion'),
            TestData.population('denominator', 'denom')
        ]
    }

    public static secondInitialPopulationRatioPopulations() {
        return [
            TestData.population('initialPopulation', 'ipp'),
            TestData.population('initialPopulation', 'numeratorExclusion'),
            TestData.population('numerator', 'num'),
            TestData.population('denominator', 'denom')
        ]
    }

    public static populationBasisValidationPopulations() {
        return [
            TestData.population('initialPopulation', 'ipp'),
            TestData.population('denominator', 'denom'),
            TestData.population('denominatorExclusion', ''),
            TestData.population('denominatorException', ''),
            TestData.population('numerator', 'num'),
            TestData.population('numeratorExclusion', '')
        ]
    }
}
