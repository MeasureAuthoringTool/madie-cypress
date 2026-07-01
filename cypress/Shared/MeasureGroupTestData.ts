import { MeasureGroupDescriptionTestData } from './MeasureGroupDescriptionTestData'
import { MeasureGroupObservationTestData } from './MeasureGroupObservationTestData'
import { MeasureGroupPopulationTestData } from './MeasureGroupPopulationTestData'
import { MeasureGroupStratificationTestData } from './MeasureGroupStratificationTestData'
import { MeasureGroupBody } from './TestData'

export class MeasureGroupTestData {
    public static proportionPopulations() {
        return MeasureGroupPopulationTestData.proportionPopulations()
    }

    public static ratioPopulations() {
        return MeasureGroupPopulationTestData.ratioPopulations()
    }

    public static secondInitialPopulationRatioPopulations() {
        return MeasureGroupPopulationTestData.secondInitialPopulationRatioPopulations()
    }

    public static populationBasisValidationPopulations() {
        return MeasureGroupPopulationTestData.populationBasisValidationPopulations()
    }

    public static ratioObservationPopulations() {
        return MeasureGroupObservationTestData.ratioObservationPopulations()
    }

    public static ratioMeasureObservations() {
        return MeasureGroupObservationTestData.ratioMeasureObservations()
    }

    public static continuousVariableObservationPopulations() {
        return MeasureGroupObservationTestData.continuousVariableObservationPopulations()
    }

    public static continuousVariableMeasureObservations() {
        return MeasureGroupObservationTestData.continuousVariableMeasureObservations()
    }

    public static ratioObservationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return MeasureGroupObservationTestData.ratioObservationGroup(overrides)
    }

    public static continuousVariableObservationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return MeasureGroupObservationTestData.continuousVariableObservationGroup(overrides)
    }

    public static describedRatioPopulations(includeDescriptions = true) {
        return MeasureGroupDescriptionTestData.describedRatioPopulations(includeDescriptions)
    }

    public static describedSecondInitialPopulationRatioPopulations(includeDescriptions = true) {
        return MeasureGroupDescriptionTestData.describedSecondInitialPopulationRatioPopulations(includeDescriptions)
    }

    public static describedRatioMeasureObservations(includeDescriptions = true) {
        return MeasureGroupDescriptionTestData.describedRatioMeasureObservations(includeDescriptions)
    }

    public static describedContinuousVariableObservationPopulations(includeDescriptions = true) {
        return MeasureGroupDescriptionTestData.describedContinuousVariableObservationPopulations(includeDescriptions)
    }

    public static describedContinuousVariableMeasureObservations(includeDescriptions = true) {
        return MeasureGroupDescriptionTestData.describedContinuousVariableMeasureObservations(includeDescriptions)
    }

    public static describedRatioGroup(
        includeDescriptions = true,
        overrides: Partial<MeasureGroupBody> = {}
    ): MeasureGroupBody {
        return MeasureGroupDescriptionTestData.describedRatioGroup(includeDescriptions, overrides)
    }

    public static describedSecondInitialPopulationRatioGroup(
        includeDescriptions = true,
        overrides: Partial<MeasureGroupBody> = {}
    ): MeasureGroupBody {
        return MeasureGroupDescriptionTestData.describedSecondInitialPopulationRatioGroup(
            includeDescriptions,
            overrides
        )
    }

    public static describedContinuousVariableObservationGroup(
        includeDescriptions = true,
        overrides: Partial<MeasureGroupBody> = {}
    ): MeasureGroupBody {
        return MeasureGroupDescriptionTestData.describedContinuousVariableObservationGroup(
            includeDescriptions,
            overrides
        )
    }

    public static stratificationAssociationPopulations(missingIds = false) {
        return MeasureGroupStratificationTestData.stratificationAssociationPopulations(missingIds)
    }

    public static validStratifications() {
        return MeasureGroupStratificationTestData.validStratifications()
    }

    public static mismatchedReturnTypeStratifications() {
        return MeasureGroupStratificationTestData.mismatchedReturnTypeStratifications()
    }

    public static describedStratificationPopulations() {
        return MeasureGroupStratificationTestData.describedStratificationPopulations()
    }

    public static describedStratifications() {
        return MeasureGroupStratificationTestData.describedStratifications()
    }

    public static stratificationValidationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return MeasureGroupStratificationTestData.stratificationValidationGroup(overrides)
    }

    public static stratificationMissingPopulationIdsGroup(): MeasureGroupBody {
        return MeasureGroupStratificationTestData.stratificationMissingPopulationIdsGroup()
    }

    public static describedStratificationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return MeasureGroupStratificationTestData.describedStratificationGroup(overrides)
    }

    public static addStratificationAssociation() {
        return MeasureGroupStratificationTestData.addStratificationAssociation()
    }

    public static editStratificationAssociation(stratificationId: string) {
        return MeasureGroupStratificationTestData.editStratificationAssociation(stratificationId)
    }

    public static proportionGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Proportion',
            populations: this.proportionPopulations(),
            ...overrides
        }
    }

    public static populationBasisValidationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Proportion',
            populations: this.populationBasisValidationPopulations(),
            ...overrides
        }
    }

    public static secondInitialPopulationRatioGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Ratio',
            populations: this.secondInitialPopulationRatioPopulations(),
            ...overrides
        }
    }

    public static expectPopulationDefinitions(responseBody: any, expectedDefinitions: string[]): void {
        expectedDefinitions.forEach((definition, index) => {
            expect(responseBody.populations[index].definition).to.eql(definition)
        })
    }
}
