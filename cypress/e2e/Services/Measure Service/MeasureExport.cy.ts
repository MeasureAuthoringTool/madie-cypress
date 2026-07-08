import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { OktaLogin } from "../../../Shared/OktaLogin";
import { TestData } from "../../../Shared/TestData"

const measureName = 'MeasureExport' + Date.now()
const CqlLibraryName = 'MeasureExportLibrary' + Date.now()
const randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
const now = require('dayjs')
const mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
const mpEndDate = now().format('YYYY-MM-DD')
const qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
const measureCQL_WithErrors = 'library APICQLLibrary35455 version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' \n' +
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

const measureCQL = 'library SimpleFhirMeasure version \'0.0.001\'\n\n' +
    'using FHIR version \'4.0.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "ipp":\n' +
    '  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n\n' +
    'define "denom":\n' +
    '    "ipp"\n\n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n\n' +
    'define "numeratorExclusion":\n' +
    '    "num"'

const PopIniPop = 'ipp'
const PopNum = 'num'
const PopDenom = 'denom'
const PopDenex = 'ipp'
const PopDenexcep = 'denom'
const PopNumex = 'numeratorExclusion'
const steward = {
    name: "SemanticBits",
    id: "64120f265de35122e68dac40",
    oid: "02c84f54-919b-4464-bf51-a1438f2710e2",
    url: "https://semanticbits.com/"
}
const developers = [
    {
        id: "64120f265de35122e68dabf7",
        name: "Academy of Nutrition and Dietetics",
        oid: "2.16.840.1.113883.3.6308",
        url: "www.eatrightpro.org"
    }
]
const qiCoreExportGroup = {
    scoring: 'Proportion',
    populationBasis: 'Boolean',
    populations: [
        TestData.population('initialPopulation', PopIniPop),
        TestData.population('denominator', PopDenom),
        TestData.population('denominatorExclusion', PopDenex),
        TestData.population('denominatorException', PopDenexcep),
        TestData.population('numerator', PopNum),
        TestData.population('numeratorExclusion', PopNumex)
    ],
    scoringUnit: {
        label: "ml milliLiters",
        value: {
            code: "ml",
            name: "milliLiters",
            guidance: "",
            system: "https://clinicaltables.nlm.nih.gov/"
        }
    },
    measureGroupTypes: ["Outcome"],
    improvementNotation: "Increased score indicates improvement"
}

const measureData: CreateMeasureOptions = {}

const writeCurrentMeasureFixtures = (responseBody: {
    id: string
    versionId: string
    measureSetId: string
}): void => {
    TestData.writeFixture('measureId', responseBody.id)
    TestData.writeFixture('versionId', responseBody.versionId)
    TestData.writeFixture('measureSetId', responseBody.measureSetId)
}

const requestCurrentMeasureExport = (options: Partial<Cypress.RequestOptions> = {}) => {
    return TestData.requestMeasureExport<any>(options)
}

const expectExportFailure = (expectedMessage: (measureId: string) => string): void => {
    TestData.readMeasureId().then((measureId) => {
        requestCurrentMeasureExport({ failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(409)
            expect(response.body.message).to.eql(expectedMessage(measureId))
        })
    })
}

describe('QI-Core Measure Export', () => {

    beforeEach('Create Measure and set access token', () => {
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        TestData.saveMeasureCql(`${measureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })

        TestData.requestMeasureGroup('POST', qiCoreExportGroup).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            TestData.writeFixture('groupId', response.body.id)
        })

        OktaLogin.setupUserSession(false)
    })


    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Confirm the export end point returns a contentType of "application/zip" for QI-Core Measure', () => {
        requestCurrentMeasureExport().then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body).is.not.null
        })
    })
})

describe('Error Message on Measure Export when the Measure does not have CQL', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + 1 + randValue
        newCqlLibraryName = CqlLibraryName + 1 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have CQL', () => {
        expectExportFailure(
            (measureId) =>
                'Response could not be completed for Measure with ID ' +
                measureId +
                ', since there is no population criteria on the measure.'
        )
    })
})

describe('Error Message on Measure Export when the Measure CQL has errors', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + 2 + randValue
        newCqlLibraryName = CqlLibraryName + 2 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL_WithErrors)
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {
        expectExportFailure(
            (measureId) =>
                'Response could not be completed for Measure with ID ' +
                measureId +
                ', since there is no population criteria on the measure.'
        )
    })
})

describe('Error Message on Measure Export when the Measure does not have Population Criteria', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + 3 + randValue
        newCqlLibraryName = CqlLibraryName + 3 + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Population Criteria', () => {
        expectExportFailure(
            (measureId) =>
                'Response could not be completed for Measure with ID ' +
                measureId +
                ', since there is no population criteria on the measure.'
        )
    })
})

describe('Error Message on Measure Export when the Measure does not have Steward and Developer', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.setupUserSession(false)

        TestData.requestMeasure({
            measureName: newMeasureName,
            cqlLibraryName: newCqlLibraryName,
            model: 'QI-Core v4.1.1',
            ecqmTitle: 'eCQMTitle',
            measurementPeriodStart: mpStartDate + "T00:00:00.000Z",
            measurementPeriodEnd: mpEndDate + "T00:00:00.000Z",
            measureMetaData: {
                experimental: false,
                description: "SemanticBits"
            }
        }).then((response) => {
            expect(response.status).to.eql(201)
            writeCurrentMeasureFixtures(response.body)
        })
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Steward and Developer', () => {
        expectExportFailure(
            (measureId) =>
                'Response could not be completed for Measure with ID ' +
                measureId +
                ', since there are no associated developers in metadata.'
        )
    })
})

describe('Error Message on Measure Export when the Measure does not have Description', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.setupUserSession(false)

        TestData.requestMeasure({
            measureName: newMeasureName,
            cqlLibraryName: newCqlLibraryName,
            model: 'QI-Core v4.1.1',
            ecqmTitle: 'eCQMTitle',
            measurementPeriodStart: mpStartDate + "T00:00:00.000Z",
            measurementPeriodEnd: mpEndDate + "T00:00:00.000Z",
            measureMetaData: {
                experimental: false,
                steward,
                developers
            }
        }).then((response) => {
            expect(response.status).to.eql(201)
            writeCurrentMeasureFixtures(response.body)
        })
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Description', () => {
        expectExportFailure(
            (measureId) =>
                'Response could not be completed for Measure with ID ' +
                measureId +
                ', since there is no description in metadata.'
        )
    })
})

describe('QDM Measure Export', () => {

    beforeEach('Create Measure and set access token', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQL

        OktaLogin.setupUserSession(false)

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestData.saveMeasureCql(`${qdmMeasureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Successful QDM Measure Export', () => {
        requestCurrentMeasureExport().then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body).is.not.null
        })
    })
})
