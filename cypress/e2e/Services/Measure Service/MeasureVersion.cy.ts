import { Utilities } from '../../../Shared/Utilities'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { TestCaseJson } from '../../../Shared/TestCaseJson'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
const now = require('dayjs')
const mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
const mpEndDate = now().format('YYYY-MM-DD')

const measureName = 'TestMeasure' + Date.now()
const cqlLibraryName = 'TestCql' + Date.now()
const testCaseTitle = 'FAIL'
const testCaseDescription = 'test case description'
const testCaseSeries = 'SBTestSeries'
const measureCQL_ProportionMeasure = MeasureCQL.CQL_Multiple_Populations
const validTestCaseJson = TestCaseJson.CohortEpisodeEncounter_PASS
const invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
const randValue = Math.floor(Math.random() * 1000 + 1)
let newMeasureName = ''
let newCQLLibraryName = ''
let harpUser = ''
let harpUserALT = ''
const versionedMeasureError = (measureId: string) =>
    'Response could not be completed for measure with ID ' +
    measureId +
    ', since the measure is not in a draft status'

const measureCQL =
    'library ' +
    cqlLibraryName +
    " version '0.0.000'\n" +
    "using FHIR version '4.0.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n" +
    'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter \"Measurement Period\" Interval<DateTime>\n' +
    'context Patient\n' +
    'define \"ipp\":\n' +
    'exists [\"Encounter\": \"Office Visit\"] E where E.period.start during \"Measurement Period\"\n' +
    'define \"denom\":\n' +
    '\"ipp\"\n' +
    'define \"num\":\n' +
    'exists [\"Encounter\": \"Office Visit\"] E where E.status ~ \'finished\'\n'

const measureCQL_WithParsingAndVSACErrors =
    "library APICQLLibrary35455 version '0.0.000'\n" +
    "using QICore version '4.1.1'\n" +
    "include FHIRHelpers version '4.1.000' \n" +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4\' \n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "HPV Test": \'\'\n' +
    'define "ipp": true)'

const writeCurrentMeasureFixtures = (responseBody: {
    id: string
    versionId: string
    measureSetId: string
}): void => {
    TestData.writeFixture('measureId', responseBody.id)
    TestData.writeFixture('versionId', responseBody.versionId)
    TestData.writeFixture('measureSetId', responseBody.measureSetId)
}

const versionedMeasureUpdateBody = (measureId: string, versionId: string) => ({
    id: measureId,
    measureName: 'UpdatedTestMeasure' + randValue,
    cqlLibraryName: 'UpdatedCqlLibrary' + randValue,
    model: 'QI-Core v4.1.1',
    measureScoring: 'Ratio',
    versionId,
    measureSetId: uuidv4(),
    version: '1.0.000',
    ecqmTitle: 'ecqmTitle',
    measurementPeriodStart: mpStartDate + 'T00:00:00.000Z',
    measurementPeriodEnd: mpEndDate + 'T00:00:00.000Z'
})

const versionedMeasureGroupUpdateBody = (measureId: string) => ({
    id: measureId,
    scoring: 'Ratio',
    populations: [
        TestData.population('initialPopulation', 'num'),
        TestData.population('numerator', 'denom'),
        TestData.population('numeratorExclusion', 'ipp'),
        TestData.population('denominator', 'num')
    ],
    measureGroupTypes: ['Outcome'],
    populationBasis: 'Boolean'
})

const versionedMeasureGroupDeleteBody = (measureId: string, groupId: string) => ({
    id: measureId,
    groups: [
        {
            id: groupId,
            scoring: 'Cohort',
            populations: [
                {
                    id: uuidv4(),
                    name: 'initialPopulation',
                    definition: 'ipp',
                    associationType: null,
                    description: null
                }
            ],
            measureGroupTypes: ['Outcome'],
            scoringUnit: '',
            stratifications: [],
            populationBasis: 'boolean'
        }
    ]
})

const versionedTestCaseUpdateBody = (testCaseId: string) => ({
    id: testCaseId,
    name: 'IPPPass',
    series: 'WhenBPLessThan120',
    title: 'test case title edited',
    description: 'IPP Pass Test BP Less Than 120',
    json: '{ \n  Encounter: "Office Visit union" \n  Id: "Identifier" \n  value: "Visit out of hours (procedure)" \n}'
})

describe('Measure Versioning', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    before('Create Measure', () => {
        newMeasureName = measureName + 1 + randValue
        newCQLLibraryName = cqlLibraryName + 1 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestData.saveMeasureCql(`${measureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    it('Successful Measure Versioning', () => {
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
        })
    })

    it('Non Measure owner unable to version Measure', () => {
        harpUserALT = OktaLogin.setupUserSession(true) // auth as altUser, with no access

        TestData.readMeasureId().then((measureId) => {
            TestData.versionMeasure('major', 0, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.include(
                    'User ' + harpUserALT + ' is not authorized for Measure with ID ' + measureId
                )
            })
        })
    })
})

describe('Version Measure without CQL', () => {
    before('Create Measure and Set Access Token', () => {
        newMeasureName = measureName + 2 + randValue
        newCQLLibraryName = cqlLibraryName + 2 + randValue
        harpUser = OktaLogin.getUser(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestData.readMeasure<any>().then((response) => {
            expect(response.status).to.eql(200)

            TestData.updateMeasure({
                ...response.body,
                cql: '',
                elmJson: '',
                elmXml: '',
                cqlErrors: false
            }).then((updateResponse) => {
                expect(updateResponse.status).to.eql(200)
            })
        })
    })

    after('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })

    it('User can not version Measure if there is no CQL', () => {
        OktaLogin.setupUserSession(false)
        TestData.readMeasureId().then((measureId) => {
            TestData.versionMeasure('major', 0, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.include(
                    'User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure has no CQL.'
                )
            })
        })
    })
})

describe('Version Measure with invalid CQL', () => {
    before('Create Measure and Set Access Token', () => {
        newMeasureName = measureName + 3 + randValue
        newCQLLibraryName = cqlLibraryName + 3 + randValue

        OktaLogin.setupUserSession(false)

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestData.readMeasure<any>().then((response) => {
            expect(response.status).to.eql(200)

            TestData.updateMeasure({
                ...response.body,
                cql: measureCQL_WithParsingAndVSACErrors,
                cqlErrors: true
            }).then((updateResponse) => {
                expect(updateResponse.status).to.eql(200)
            })
        })
    })

    after('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })

    it('User can not version Measure if the CQL has errors', () => {
        OktaLogin.setupUserSession(false)
        TestData.readMeasureId().then((measureId) => {
            TestData.versionMeasure('major', 0, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.include(
                    'User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure has CQL errors.'
                )
            })
        })
    })
})

describe('Version Measure with invalid test case Json', () => {
    before('Create Measure, Test Case and Set Access Token', () => {
        newMeasureName = measureName + 4 + randValue
        newCQLLibraryName = cqlLibraryName + 4 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, invalidTestCaseJson)
        TestData.saveMeasureCql(`${measureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    it('User can version Measure if the Test case Json has errors', () => {
        TestData.versionMeasure('major', 0, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
        })
    })
})

describe('Edit validations for versioned Measure', () => {
    // Deferred refactor: this scenario intentionally keeps one auth/measure scope across
    // measure-detail, group, and test-case update requests. Extract after adding domain
    // helpers for versioned-measure edit validation so the behavior stays atomic.
    before('Create Measure, Measure group and Test case', () => {
        newMeasureName = measureName + 5 + randValue
        newCQLLibraryName = cqlLibraryName + 5 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL_ProportionMeasure)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            null,
            false,
            'Qualifying Encounters',
            '',
            '',
            'Qualifying Encounters',
            '',
            'Qualifying Encounters',
            'Encounter'
        )
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
        TestData.saveMeasureCql(`${measureCQL_ProportionMeasure}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    after('Clean up', () => {
        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)
    })

    it('Verify error messages when user try to edit Measure details, Measure Groups or Test cases for versioned Measure', () => {
        cy.log('Version the Measure')
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.eql('1.0.000')
        })

        cy.log('Verify error message on editing Measure details')
        TestData.readMeasureId().then((measureId) => {
            TestData.updateCurrentMeasure(
                ({ versionId }) => versionedMeasureUpdateBody(measureId, versionId),
                { failOnStatusCode: false }
            ).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body.message).to.include(versionedMeasureError(measureId))
            })
        })

        cy.log('Verify error message on editing Measure group')
        TestData.readMeasureId().then((measureId) => {
            TestData.requestMeasureGroup<any>('PUT', versionedMeasureGroupUpdateBody(measureId), 0, {
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body.message).to.include(versionedMeasureError(measureId))
            })
        })

        cy.log('Verify error message on editing Test case')
        TestData.readMeasureId().then((measureId) => {
            TestData.requestMeasureTestCase(
                'PUT',
                ({ testCaseId }) => versionedTestCaseUpdateBody(testCaseId ?? ''),
                { failOnStatusCode: false }
            ).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.id).to.exist
            })
        })
    })
})

describe('Delete validations for versioned Measure', () => {
    // Deferred refactor: this scenario mixes versioning, measure update, group delete,
    // and test-case delete assertions. Extract with a versioned-measure validation helper
    // instead of splitting the request chain inline.
    before('Create Measure, Measure group and Test case', () => {
        newMeasureName = measureName + 6 + randValue
        newCQLLibraryName = cqlLibraryName + 6 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL_ProportionMeasure)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            null,
            false,
            'Qualifying Encounters',
            '',
            '',
            'Qualifying Encounters',
            '',
            'Qualifying Encounters',
            'Encounter'
        )
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
        TestData.saveMeasureCql(`${measureCQL_ProportionMeasure}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    beforeEach('Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    it('Verify error messages when user try to delete Measure, Measure Groups or Test cases for versioned Measures', () => {
        cy.log('Version the Measure')
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
        })

        cy.log('Verify error message on delete Measure')
        TestData.readMeasureId().then((measureId) => {
            TestData.updateCurrentMeasure(
                ({ versionId }) => versionedMeasureUpdateBody(measureId, versionId),
                { failOnStatusCode: false }
            ).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body.message).to.include(versionedMeasureError(measureId))
            })
        })

        cy.log('Verify error message on delete Measure group')
        TestData.readMeasureId().then((measureId) => {
            TestData.readFixture('measureGroupId').then((groupId) => {
                TestData.requestMeasureGroupById<any>(
                    'DELETE',
                    groupId,
                    versionedMeasureGroupDeleteBody(measureId, groupId),
                    0,
                    { failOnStatusCode: false }
                ).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.include(versionedMeasureError(measureId))
                })
            })
        })

        cy.log('Verify error message on delete Test case')
        TestData.requestMeasureTestCase('DELETE', undefined, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(405)
            expect(response.body.error).to.include('Method Not Allowed')
        })
    })
})
