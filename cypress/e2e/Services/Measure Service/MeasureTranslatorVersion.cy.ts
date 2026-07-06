import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { CreateMeasurePage, CreateMeasureOptions } from '../../../Shared/CreateMeasurePage'
import { Utilities } from '../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { TestData } from '../../../Shared/TestData'

const timestamp = Date.now()
const qicoreMeasureName = 'QICoreTranslatorVersion' + timestamp
const qicoreCqlLibraryName = 'QiCoreTranslatorVersionLibrary' + timestamp
const qicoreMeasureCQL = MeasureCQL.SBTEST_CQL
const qdmMeasureName = 'QDMTranslatorVersion' + timestamp
const qdmCqlLibraryName = 'QDMTranslatorVersionLibrary' + timestamp
const qdmMeasureCQL = MeasureCQL.QDMSimpleCQL

const expectedQiCoreVersion = '4.8.0'
const expectedQdmVersion = '4.8.0'
const measureData: CreateMeasureOptions = {}

describe('Measure Service: Translator Version for QI-Core Measure', () => {
    beforeEach('Create QI-Core Measure and Set Access Token', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(qicoreMeasureName, qicoreCqlLibraryName, qicoreMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestData.saveMeasureCql(`${qicoreMeasureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    after('Delete Versioned Measure', () => {
        Utilities.deleteVersionedMeasure(qicoreCqlLibraryName, qicoreCqlLibraryName)
    })

    it('Get Translator version for QI-Core Measure', () => {
        TestData.requestTranslatorVersion('fhir').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.eql(expectedQiCoreVersion)
        })

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
            // versioned measures read translator version from ELM
            expect(response.body.elmJson).to.include(`"translatorVersion":"${expectedQiCoreVersion}"`)
        })
    })
})

describe('Measure Service: Translator Version for QDM Measure', () => {
    beforeEach('Create QDM Measure and Set Access Token', () => {
        measureData.ecqmTitle = qdmMeasureName
        measureData.cqlLibraryName = qdmCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        TestData.saveMeasureCql(`${qdmMeasureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
    })

    after('Delete Versioned Measure', () => {
        Utilities.deleteVersionedMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Get Translator version for QDM Measure', () => {
        TestData.requestTranslatorVersion('qdm').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.eql(expectedQdmVersion)
        })

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
            // versioned measures read translator version from ELM
            expect(response.body.elmJson).to.include(`translatorVersion":"${expectedQdmVersion}"`)
        })
    })
})
