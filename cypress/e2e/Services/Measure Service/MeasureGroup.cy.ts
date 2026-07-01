import { Utilities } from '../../../Shared/Utilities'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { MeasureGroupTestData } from '../../../Shared/MeasureGroupTestData'

const measureName = 'MeasureGroup ' + Date.now()
const CqlLibraryName = 'MeasureGroupLib' + Date.now()
const measureScoring = 'Proportion'
const popMeasureCQL = MeasureCQL.SBTEST_CQL
const measureCQL =
    "library CQLLibraryName1662121072763538 version '0.0.000'\n\n" +
    "using FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\n\n" +
    'parameter "Measurement Period" Interval<DateTime>\n\ncontext Patient\n\n' +
    'define "ipp":\n  true\n\ndefine "denom":\n "ipp"\n\ndefine "num":\n  exists [\"Encounter\"] E where E.status ~ \'finished\'\n\n' +
    'define \"numeratorExclusion\":\n\t\"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n\tnull\n\telse\n\tSystem.Code {\n' +
    '\t\tcode: coding.code.value,\n\t\tsystem: coding.system.value,\n\t\tversion: coding.version.value,\n\t\tdisplay: coding.display.value\n\t}\n\n' +
    'define function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true'
const measureCQL2 =
    "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\n" +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\n' +
    'context Patient\n\ndefine "ipp":\n  exists ["Encounter"] E where E.period.start during "Measurement Period"\n\n' +
    'define "denom":\n "ipp"\n\ndefine "num":\n  exists ["Encounter"] E where E.status ~ \'finished\'\n\n' +
    'define "numeratorExclusion":\n"num"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\nnull\nelse\nSystem.Code {\n\tcode: coding.code.value,\n' +
    '\tsystem: coding.system.value,\n\tversion: coding.version.value,\n\tdisplay: coding.display.value\n}\n\n' +
    'define function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"():\n  true'
let newMeasureName = ''
let newCqlLibraryName = ''
let currentUser = ''
let PopIniPop = ''
let PopNum = ''
let PopDenom = ''

describe('Measure Service: Measure Group Endpoints', () => {
    beforeEach('Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    before('Create Measure', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    it('Create Proportion measure group', () => {
        TestData.requestMeasureGroup('POST', {
            scoring: measureScoring,
            populations: MeasureGroupTestData.proportionPopulations()
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql(measureScoring)
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
        })
    })

    it('Update measure group to Ratio', () => {
        let measureTstScoring = 'Ratio'

        TestData.requestMeasureGroup('PUT', {
            scoring: measureTstScoring,
            populations: MeasureGroupTestData.ratioPopulations()
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                'ipp',
                'num',
                'numeratorExclusion',
                'denom'
            ])
        })
    })

    it('Add UCUM Scoring unit to the Measure Group', () => {
        TestData.requestMeasureGroup(
            'POST',
            MeasureGroupTestData.proportionGroup({
                scoringUnit: {
                    label: 'ml milliLiters'
                }
            })
        ).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql(measureScoring)
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
            expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
        })
    })

    it('Update UCUM Scoring unit for the Measure Group', () => {
        TestData.requestMeasureGroup(
            'POST',
            MeasureGroupTestData.proportionGroup({
                scoringUnit: {
                    label: '455 455'
                }
            })
        ).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql(measureScoring)
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
            expect(response.body.scoringUnit.label).to.eql('455 455')
        })
    })

    it('Add Second Initial Population for Ratio Measure', () => {
        TestData.requestMeasureGroup(
            'POST',
            MeasureGroupTestData.secondInitialPopulationRatioGroup({
                scoringUnit: {
                    label: 'ml milliLiters'
                }
            })
        ).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                'ipp',
                'numeratorExclusion',
                'num',
                'denom'
            ])
            expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
        })
    })

    it('Add and Delete Second Initial Population for Ratio Measure', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'

        TestData.requestMeasureGroup(
            'POST',
            MeasureGroupTestData.secondInitialPopulationRatioGroup({
                scoringUnit: {
                    label: 'ml milliLiters'
                }
            })
        ).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                'ipp',
                'numeratorExclusion',
                'num',
                'denom'
            ])
            expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
            cy.writeFile(measureGroupPath, response.body.id)
        })

        TestData.requestMeasureGroup('PUT', {
            scoring: 'Ratio',
            populations: MeasureGroupTestData.proportionPopulations(),
            scoringUnit: {
                label: 'ml milliLiters'
            }
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
            expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
        })
    })
})

describe('Measure Service: Edit Measure group / Population Criteria: composite score', () => {
    beforeEach('Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    before('Create Measure', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(
            newMeasureName,
            newCqlLibraryName,
            measureCQL,
            undefined,
            false,
            '2022-01-01',
            '2023-01-01',
            true
        )
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Add Population Criteria Data: composite score value of "All-or-nothing", to the measure', () => {
        TestData.requestMeasureGroup(
            'PUT',
            MeasureGroupTestData.proportionGroup({
                scoringUnit: {
                    label: 'ml milliLiters'
                },
                compositeScoring: 'All-or-nothing'
            })
        ).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Proportion')
            expect(response.body.compositeScoring).to.eql('All-or-nothing')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
        })
    })

    it('Add Population Criteria Data: composite score value of "Opportunity", to the measure', () => {
        TestData.requestMeasureGroup(
            'PUT',
            MeasureGroupTestData.proportionGroup({
                scoringUnit: {
                    label: 'ml milliLiters'
                },
                compositeScoring: 'Opportunity'
            })
        ).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Proportion')
            expect(response.body.compositeScoring).to.eql('Opportunity')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
        })
    })

    it('Add Population Criteria Data: composite score value of "Linear", to the measure', () => {
        TestData.requestMeasureGroup(
            'PUT',
            MeasureGroupTestData.proportionGroup({
                scoringUnit: {
                    label: 'ml milliLiters'
                },
                compositeScoring: 'Linear'
            })
        ).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Proportion')
            expect(response.body.compositeScoring).to.eql('Linear')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'num', 'denom'])
        })
    })
})

describe('Measure Populations', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, popMeasureCQL)

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Verify that 400 level response is returned when Population Basis is not included, when trying to create a group', () => {
        TestData.requestMeasureGroup(
            'POST',
            MeasureGroupTestData.populationBasisValidationGroup({
                populationBasis: undefined
            }),
            0,
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
        })
    })

    it('Measure group created successfully when the population basis match with population return type', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.populationBasisValidationGroup(), 0, {
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.scoring).to.eql(measureScoring)
        })
    })

    it('Verify error message when the population basis does not match with population return type', () => {
        TestData.requestMeasureGroup<{ message: string }>(
            'POST',
            MeasureGroupTestData.populationBasisValidationGroup({
                populationBasis: 'Encounter'
            }),
            0,
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql(
                'Return type for the CQL definition selected for the Initial Population does not match with population basis.'
            )
        })
    })
})

describe('Measure Observations', () => {
    beforeEach('Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    before('Create Measure', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL2)
    })

    it('Add Measure Observations for Ratio Measure', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.ratioObservationGroup()).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            expect(response.body.populations[0].definition).to.eql('ipp')
            expect(response.body.populations[1].definition).to.eql('denom')
            expect(response.body.populations[3].definition).to.eql('num')
            expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
            expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
        })
    })

    it('Add Measure Observations for Continuous Variable Measure', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.continuousVariableObservationGroup()).then(
            (response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.scoring).to.eql('Continuous Variable')
                MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'denom'])
                expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
            }
        )
    })
})

describe('Measure Stratifications', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        let stratMeasureCQL =
            "library CQLLibraryName1662480444560541 version '0.0.000'\nusing FHIR version '4.0.1'\n" +
            "include FHIRHelpers version '4.1.000' called FHIRHelpers\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\n" +
            'parameter "Measurement Period" Interval<DateTime>\n\ncontext Patient\n\n' +
            'define "ipp":\nexists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n\n' +
            'define "denom":\n"ipp"\ndefine "num":\nexists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n' +
            'define "Surgical Absence of Cervix":\n[Procedure: "Hysterectomy with No Residual Cervix"] NoCervixHysterectomy\n\twhere NoCervixHysterectomy.status = \'completed\''
        let randValue = Math.floor(Math.random() * 1000 + 1)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, stratMeasureCQL)

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Measure group created successfully when the population basis match with Stratification return type', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.stratificationValidationGroup(), 0, {
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.scoring).to.eql(measureScoring)
            expect(response.body.stratifications[0].id).to.be.empty
            expect(response.body.stratifications[1].id).to.be.empty
        })
    })

    it('Verify error message when the population basis does not match with Stratification return type', () => {
        TestData.requestMeasureGroup<{ message: string }>(
            'POST',
            MeasureGroupTestData.stratificationValidationGroup({
                stratifications: MeasureGroupTestData.mismatchedReturnTypeStratifications()
            }),
            0,
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql(
                'Return type for the CQL definition selected for the Stratification(s) does not match with population basis.'
            )
        })
    })

    it('Verify error message when the populations are missing IDs', () => {
        TestData.requestMeasureGroup<{ validationErrors: Record<string, string> }>(
            'POST',
            MeasureGroupTestData.stratificationMissingPopulationIdsGroup(),
            0,
            { failOnStatusCode: false }
        ).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors)
                .to.have.property('populations[0].id')
                .to.eql('Population ID is required.')
            expect(response.body.validationErrors)
                .to.have.property('populations[3].id')
                .to.eql('Population ID is required.')
            expect(response.body.validationErrors)
                .to.have.property('populations[4].id')
                .to.eql('Population ID is required.')
            expect(response.body.validationErrors)
                .to.have.property('populations[5].id')
                .to.eql('Population ID is required.')
            expect(response.body.validationErrors)
                .to.have.property('populations[2].id')
                .to.eql('Population ID is required.')
            expect(response.body.validationErrors)
                .to.have.property('populations[1].id')
                .to.eql('Population ID is required.')
        })
    })

    it('Add, Edit and Delete  multiple Stratification Associations for the Measure group', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.describedStratificationGroup(), 0, {
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.scoring).to.eql(measureScoring)
            TestData.writeFixture('groupId', response.body.id)
        })

        TestData.requestMeasureGroupStratification('POST', MeasureGroupTestData.addStratificationAssociation()).then(
            (response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlDefinition).to.eql('Surgical Absence of Cervix')
                expect(response.body.associations[0]).to.eql('initialPopulation')
                expect(response.body.associations[1]).to.eql('numerator')
                TestData.writeFixture('stratificationId', response.body.id)
                cy.log('Multiple Stratification Associations added successfully')
            }
        )

        TestData.requestMeasureGroupStratification('PUT', MeasureGroupTestData.editStratificationAssociation).then(
            (response) => {
                expect(response.status).to.eql(200)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlDefinition).to.eql('ipp')
                expect(response.body.associations[0]).to.eql('initialPopulation')
                expect(response.body.associations[1]).to.eql('denominator')
                cy.log('Stratifications updated successfully')
            }
        )

        TestData.requestMeasureGroupStratification('DELETE').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            cy.log('Stratification deleted successfully')
        })
    })
})

describe('Creating a group / PC with description for various fields', () => {
    beforeEach('Set Access Token', () => {
        let randValue = Math.floor(Math.random() * 1000 + 1)
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL2)
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Description is added to all fields are saved -- no second IP', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.describedRatioGroup()).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                'ipp',
                'denom',
                'ipp',
                'num',
                'numeratorExclusion'
            ])
            expect(response.body.populations[0].description).to.eql('Initial Population Description')
            expect(response.body.populations[1].description).to.eql('Denominator Description')
            expect(response.body.populations[2].description).to.eql('Denominator Exclusion Description')
            expect(response.body.populations[3].description).to.eql('Numerator Description')
            expect(response.body.populations[4].description).to.eql('Numerator Exclusion Description')
            expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[0].description).to.eql('denominator observation description')
            expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[1].description).to.eql('numerator observation description')
            expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
            expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
        })

        TestData.requestMeasureGroup('PUT', MeasureGroupTestData.describedRatioGroup(false)).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                'ipp',
                'denom',
                'ipp',
                'num',
                'numeratorExclusion'
            ])
            expect(response.body.populations[0].description).is.null
            expect(response.body.populations[1].description).is.null
            expect(response.body.populations[2].description).is.null
            expect(response.body.populations[3].description).is.null
            expect(response.body.populations[4].description).is.null
            expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[0].description).is.null
            expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[1].description).is.null
            expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
            expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
        })
    })

    it('Description is added to all fields are saved -- second IP', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.describedSecondInitialPopulationRatioGroup()).then(
            (response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.scoring).to.eql('Ratio')
                MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                    'ipp',
                    'ipp',
                    'denom',
                    'ipp',
                    'num',
                    'numeratorExclusion'
                ])
                expect(response.body.populations[0].description).to.eql('Initial Population 1 Description')
                expect(response.body.populations[1].description).to.eql('Initial Population 2 Description')
                expect(response.body.populations[2].description).to.eql('Denominator Description')
                expect(response.body.populations[3].description).to.eql('Denominator Exclusion Description')
                expect(response.body.populations[4].description).to.eql('Numerator Description')
                expect(response.body.populations[5].description).to.eql('Numerator Exclusion Description')
                expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                expect(response.body.measureObservations[0].description).to.eql('denominator observation description')
                expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
                expect(response.body.measureObservations[1].description).to.eql('numerator observation description')
                expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
            }
        )

        TestData.requestMeasureGroup(
            'PUT',
            MeasureGroupTestData.describedSecondInitialPopulationRatioGroup(false)
        ).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Ratio')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, [
                'ipp',
                'ipp',
                'denom',
                'ipp',
                'num',
                'numeratorExclusion'
            ])
            expect(response.body.populations[0].description).is.null
            expect(response.body.populations[1].description).is.null
            expect(response.body.populations[2].description).is.null
            expect(response.body.populations[3].description).is.null
            expect(response.body.populations[4].description).is.null
            expect(response.body.populations[5].description).is.null
            expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[0].description).is.null
            expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[1].description).is.null
            expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
            expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
        })
    })

    it('Description is added to all fields are saved -- CV Score -- Measure Population', () => {
        TestData.requestMeasureGroup('POST', MeasureGroupTestData.describedContinuousVariableObservationGroup()).then(
            (response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.scoring).to.eql('Continuous Variable')
                MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'denom'])
                expect(response.body.populations[0].description).to.eql('Initial Population Description on CV')
                expect(response.body.populations[1].description).to.eql('Measure Population Description on CV')
                expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                expect(response.body.measureObservations[0].description).to.eql(
                    'Measure Observations description on CV'
                )
                expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
            }
        )

        TestData.requestMeasureGroup(
            'PUT',
            MeasureGroupTestData.describedContinuousVariableObservationGroup(false)
        ).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.id).to.be.exist
            expect(response.body.scoring).to.eql('Continuous Variable')
            MeasureGroupTestData.expectPopulationDefinitions(response.body, ['ipp', 'denom'])
            expect(response.body.populations[0].description).is.null
            expect(response.body.populations[1].description).is.null
            expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
            expect(response.body.measureObservations[0].description).is.null
            expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
        })
    })
})
