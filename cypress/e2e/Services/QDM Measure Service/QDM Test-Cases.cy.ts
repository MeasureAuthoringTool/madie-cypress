import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { TestData } from "../../../Shared/TestData"

let harpUserALT = ''
let harpUser = ''
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.QDMTestCaseJson
let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()
let CQLLibraryName = ''
let measureScoring = 'Cohort'
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

let TCName = ''
let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'
let TCJson = TestCaseJson.QDMTestCaseJson

const measureData: CreateMeasureOptions = {}
const qdmPopulationValues = [
    {
        name: 'initialPopulation',
        expected: false,
        actual: false
    },
    {
        name: 'denominator',
        expected: false,
        actual: false
    },
    {
        name: 'denominatorExclusion',
        expected: false,
        actual: false
    },
    {
        name: 'denominatorException',
        expected: false,
        actual: false
    },
    {
        name: 'numerator',
        expected: false,
        actual: false
    },
    {
        name: 'numeratorExclusion',
        expected: false,
        actual: false
    }
]

const qdmGroupBody = () => ({
    scoring: measureScoring,
    populationBasis: 'true',
    populations: [
        TestData.population('initialPopulation', 'Initial Population', {
            associationType: null,
            description: ''
        })
    ],
    measureObservations: null,
    groupDescription: '',
    improvementNotation: '',
    rateAggregation: '',
    measureGroupTypes: null,
    scoringUnit: '',
    stratifications: []
})

const qdmTestCaseBody = (
    overrides: Record<string, unknown> = {},
    withGroupPopulations = false
): Cypress.Chainable<any> => {
    if (!withGroupPopulations) {
        return cy.wrap({
            name: TCName,
            title: TCTitle,
            series: TCSeries,
            description: TCDescription,
            json: TCJson,
            ...overrides
        })
    }

    return TestData.readMeasureGroupId().then((groupId) => ({
        name: TCName,
        title: TCTitle,
        series: TCSeries,
        description: TCDescription,
        json: TCJson,
        hapiOperationOutcome: {
            code: 201,
            message: null,
            outcomeResponse: null
        },
        groupPopulations: [
            {
                groupId,
                scoring: measureScoring,
                populationValues: qdmPopulationValues
            }
        ],
        ...overrides
    }))
}

const qdmTestCaseListBody = (count = 3): Record<string, unknown>[] => {
    return Array.from({ length: count }, (_, index) => ({
        name: TCName + String(index + 1),
        title: TCTitle + String(index + 1),
        series: TCSeries,
        description: TCDescription,
        json: TCJson
    }))
}

describe('Test Case population values based on Measure Group population definitions', () => {

    beforeEach('Create Measure and measure group', () => {

        let randTCNameValue = (Math.floor((Math.random() * 2000) + 3))
        TCName = 'TCName' + randTCNameValue

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        let newMeasureName = measureName + randVal + Date.now()
        let newCqlLibraryName = cqlLibraryName + randVal + Date.now()

        OktaLogin.setupUserSession(false)

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        TestData.saveMeasureCql(`${booleanPatientBasisQDM_CQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })

        TestData.requestMeasureGroup<any>('POST', qdmGroupBody() as any).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })

        qdmTestCaseBody({}, true).then((body) => {
            TestData.requestMeasureTestCase<any>('POST', body as any).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.series).to.eql(TCSeries)
                expect(response.body.title).to.eql(TCTitle)
                expect(response.body.description).to.eql(TCDescription)
                expect(response.body.json).to.be.exist
                TestData.writeFixture('testCaseId', response.body.id)
            })
        })
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Test Case population value check boxes match that of the measure group definitons -- all are defined', () => {
        TestData.readTestCaseId().then((testCaseId) => {
            TestData.requestMeasureTestCase<any>('GET').then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.id).to.eql(testCaseId)
                expect(response.body.series).to.eql(TCSeries)
                expect(response.body.json).to.be.exist
                expect(response.body.json).to.eql(TCJson)
                expect(response.body.title).to.eql(TCTitle)
                expect(response.body.groupPopulations[0].populationValues[0].name).to.eq('initialPopulation')
                expect(response.body['groupPopulations'][0].populationValues[1].name).to.eq('denominator')
                expect(response.body['groupPopulations'][0].populationValues[2].name).to.eq('denominatorExclusion')
                expect(response.body['groupPopulations'][0].populationValues[3].name).to.eq('denominatorException')
                expect(response.body['groupPopulations'][0].populationValues[4].name).to.eq('numerator')
                expect(response.body['groupPopulations'][0].populationValues[5].name).to.eq('numeratorExclusion')
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints: Create and Edit', () => {

    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    let newTCJson = TestCaseJson.QDMTestCaseJson_for_update

    before('Create Measure', () => {

        OktaLogin.setupUserSession(false)

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryNameDeux
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
    })

    beforeEach('Set Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Create Test Case', () => {
        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let title = 'test case title  - _'
        let series = 'test case series  - _'
        let description = 'DENOME pass Test HB - _'

        qdmTestCaseBody({
            name: TCName + randValue + 4,
            title,
            series,
            description
        }).then((body) => {
            TestData.requestMeasureTestCase<any>('POST', body as any).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.series).to.eql(series)
                expect(response.body.title).to.eql(title)
                expect(response.body.description).to.eql(description)
                expect(response.body.json).to.be.exist
                expect(response.body.json).to.eql(TCJson)
                TestData.writeFixture('testCaseId', response.body.id)
            })
        })
    })

    it('Edit Test Case', () => {
        qdmTestCaseBody({
            name: "IPPPass",
            series: "WhenBP120",
            title: TCTitle,
            description: "IPP Pass Test BP <120",
            json: newTCJson
        }).then((body) => {
            TestData.readTestCaseId().then((testCaseId) => {
                TestData.requestMeasureTestCase<any>(
                    'PUT',
                    { ...body, id: testCaseId } as any
                ).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.eql(testCaseId)
                    expect(response.body.json).to.be.exist
                    expect(response.body.json).to.eql(newTCJson)
                    expect(response.body.series).to.eql("WhenBP120")
                    expect(response.body.title).to.eql(TCTitle)
                    expect(response.body.json).to.be.exist
                    TestData.writeFixture('testCaseId', response.body.id)
                })
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints: Validations', () => {

    before('Create Measure', () => {

        OktaLogin.setupUserSession(false)

        measureName = 'QDMTestMeasure' + Date.now()
        CQLLibraryName = 'QDMTestCql' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CQLLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
    })

    beforeEach('Set Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Create Test Case: Description more than 250 characters', () => {
        qdmTestCaseBody({
            name: "DENOMFail",
            series: "WhenBP120",
            title: "test case title",
            description: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr"
        }).then((body) => {
            TestData.requestMeasureTestCase<any>('POST', body as any, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
            })
        })
    })

    it('Edit Test Case: Description more than 250 characters', () => {
        qdmTestCaseBody({
            name: "IPPPass",
            series: "WhenBP<120",
            title: "test case title edited",
            description: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr"
        }).then((body) => {
            TestData.readTestCaseId().then((testCaseId) => {
                TestData.requestMeasureTestCase<any>(
                    'PUT',
                    { ...body, id: testCaseId } as any,
                    { failOnStatusCode: false }
                ).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
                })
            })
        })
    })

    it('Create Test Case: Title more than 250 characters', () => {
        qdmTestCaseBody({
            name: "DENOMFail",
            series: "WhenBP120",
            title: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
            description: "description"
        }).then((body) => {
            TestData.requestMeasureTestCase<any>('POST', body as any, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.title).to.eql('Test Case Title can not be more than 250 characters.')
            })
        })
    })

    it('Create Test Case: Series more than 250 characters', () => {
        qdmTestCaseBody({
            name: "DENOMFail",
            series: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
            title: "Title",
            description: "description"
        }).then((body) => {
            TestData.requestMeasureTestCase<any>('POST', body as any, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.series).to.eql('Test Case Series can not be more than 250 characters.')
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints: Attempt to edit when user is not owner', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    let newTCJson = TestCaseJson.QDMTestCaseJson_for_update
    before('Create Measure', () => {

        harpUser = OktaLogin.getUser(false)

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryNameDeux
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL
        measureData.altUser = true

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, true)

        TestData.saveMeasureCql(`${booleanPatientBasisQDM_CQL}\n`, { owner: 'selectedAltUser' }).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    it('QDM Test Case Demographic fields are not available / editable for non-owner', () => {

        OktaLogin.setupUserSession(false)
        qdmTestCaseBody({
            name: "IPPPass",
            series: "WhenBP120",
            title: TCTitle,
            description: "IPP Pass Test BP <120",
            json: newTCJson
        }).then((body) => {
            TestData.readMeasureId(0, 'selectedAltUser').then((measureId) => {
                TestData.readTestCaseId(0, 'selectedAltUser').then((testCaseId) => {
                    TestData.requestMeasureTestCase<any>(
                        'PUT',
                        { ...body, id: testCaseId } as any,
                        { failOnStatusCode: false },
                        'selectedAltUser'
                    ).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })
})

describe('Measure Service: Test Case Endpoint: User validation with test case import', () => {
    beforeEach('Create Measure and measure group', () => {

        let randTCNameValue = (Math.floor((Math.random() * 2000) + 3))
        TCName = 'TCName' + randTCNameValue

        let randVal = (Math.floor((Math.random() * 2000) + 3))
        let newMeasureName = measureName + randVal + Date.now()
        let newCqlLibraryName = cqlLibraryName + randVal + Date.now()

        OktaLogin.setupUserSession(false)

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL
        measureData.altUser = false

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        TestData.saveMeasureCql(`${booleanPatientBasisQDM_CQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })

        TestData.requestMeasureGroup<any>('POST', qdmGroupBody() as any).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })
    })

    it('Non-owner or non-shared user cannot hit the end point to add test cases to a measure', () => {

        OktaLogin.setupUserSession(true)

        TestData.requestMeasureTestCaseList<any>(qdmTestCaseListBody() as any, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(403)
        })
    })
})
