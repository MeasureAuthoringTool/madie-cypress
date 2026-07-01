import { TestData } from './TestData'

export class MeasureGroupTestData {
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

    public static expectPopulationDefinitions(responseBody: any, expectedDefinitions: string[]): void {
        expectedDefinitions.forEach((definition, index) => {
            expect(responseBody.populations[index].definition).to.eql(definition)
        })
    }
}
