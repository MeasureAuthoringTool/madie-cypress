import { MeasureGroupBody, TestData } from './TestData'

export class MeasureGroupStratificationTestData {
    public static stratificationAssociationPopulations(missingIds = false) {
        const idOverride = missingIds ? { id: '' } : {}

        return [
            TestData.population('initialPopulation', 'ipp', idOverride),
            TestData.population('denominator', 'denom', idOverride),
            TestData.population('denominatorExclusion', '', idOverride),
            TestData.population('denominatorException', '', idOverride),
            TestData.population('numerator', 'num', idOverride),
            TestData.population('numeratorExclusion', '', idOverride)
        ]
    }

    public static validStratifications() {
        return [
            {
                id: '',
                description: '',
                cqlDefinition: 'ipp',
                association: 'initialPopulation'
            },
            {
                id: '',
                description: '',
                cqlDefinition: 'denom',
                association: 'denominator'
            }
        ]
    }

    public static mismatchedReturnTypeStratifications() {
        return [
            {
                id: '',
                description: '',
                cqlDefinition: 'Surgical Absence of Cervix',
                association: 'denominator'
            },
            {
                id: '',
                description: '',
                cqlDefinition: 'Surgical Absence of Cervix',
                association: 'initialPopulation'
            }
        ]
    }

    public static describedStratificationPopulations() {
        return [
            TestData.population('initialPopulation', 'ipp', {
                description: '<p>test ip P</p>'
            }),
            TestData.population('denominator', 'denom', {
                description: '<p>test d P</p>'
            }),
            TestData.population('denominatorExclusion', '', {
                description: '<p>test dExcl P</p>'
            }),
            TestData.population('denominatorException', '', {
                description: '<p>test dExc P</p>'
            }),
            TestData.population('numerator', 'num', {
                description: '<p>test n P</p>'
            }),
            TestData.population('numeratorExclusion', '', {
                description: '<p>test nExcl</p>'
            })
        ]
    }

    public static describedStratifications() {
        return [
            {
                id: TestData.population('stratification', 'ipp').id,
                description: '<p>test ip strat</p>',
                cqlDefinition: 'ipp',
                associations: ['initialPopulation']
            },
            {
                id: TestData.population('stratification', 'denom').id,
                description: '<p>test d strat</p>',
                cqlDefinition: 'denom',
                associations: ['denominator']
            }
        ]
    }

    public static stratificationValidationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Proportion',
            populations: this.stratificationAssociationPopulations(),
            stratifications: this.validStratifications(),
            ...overrides
        }
    }

    public static stratificationMissingPopulationIdsGroup(): MeasureGroupBody {
        return this.stratificationValidationGroup({
            populations: this.stratificationAssociationPopulations(true),
            stratifications: this.mismatchedReturnTypeStratifications()
        })
    }

    public static describedStratificationGroup(overrides: Partial<MeasureGroupBody> = {}): MeasureGroupBody {
        return {
            scoring: 'Proportion',
            groupDescription: '<p>test gD P</p>',
            rateAggregation: '<p>test rA P</p>',
            populations: this.describedStratificationPopulations(),
            stratifications: this.describedStratifications(),
            improvementNotation: 'Increased score indicates improvement',
            improvementNotationDescription: '<p>test iND</p>',
            ...overrides
        }
    }

    public static addStratificationAssociation() {
        return {
            description: '',
            cqlDefinition: 'Surgical Absence of Cervix',
            association: 'initialPopulation',
            associations: ['initialPopulation', 'numerator']
        }
    }

    public static editStratificationAssociation(stratificationId: string) {
        return {
            id: stratificationId,
            description: '',
            cqlDefinition: 'ipp',
            association: 'initialPopulation',
            associations: ['initialPopulation', 'denominator']
        }
    }
}
