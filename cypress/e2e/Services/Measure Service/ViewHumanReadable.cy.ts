import { CreateMeasurePage, CreateMeasureOptions } from '../../../Shared/CreateMeasurePage'
import { Utilities } from '../../../Shared/Utilities'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasureDraftBody, TestData } from '../../../Shared/TestData'

let newMeasureName = ''
let newCQLLibraryName = ''
let savedElmJson = ''
const qdmMeasureCQLVm = MeasureCQL.CQLQDMObservationRun
const measureCQL = MeasureCQL.SBTEST_CQL
const qdmMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
const measureData: CreateMeasureOptions = {}

describe('Measure Service: View Human Readable for Qi Core Draft Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureA' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlA' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestData.saveMeasureCql(`${measureCQL}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
        })
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('View Measure Human Readable for Qi Core Draft Measure', () => {
        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).not.empty
        })
    })
})

describe('Measure Service: View Human Readable for Versioned Qi Core Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureB' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlB' + Date.now() + randVal
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestData.saveMeasureCql(`${measureCQL}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
        })
    })

    afterEach('Clean up', () => {
        Utilities.deleteVersionedMeasure(newMeasureName, newCqlLibraryName)
    })

    it('View Measure Human Readable for Qi Core Versioned Measure', () => {
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
        })

        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).not.empty
        })
    })
})

describe('Measure Service: View Human Readable for Draft QDM Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureC' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlC' + Date.now() + randVal
        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestData.saveMeasureCql(`${qdmMeasureCQL}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
        })
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('View Measure Human Readable for QDM Draft Measure', () => {
        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).not.empty
        })
    })
})

describe('Measure Service: View Human readable for Versioned QDM Measure', () => {
    let localMeasureName = ''
    let localCqlLibraryName = ''

    beforeEach('Create Measure', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        localMeasureName = 'TestMeasureD' + Date.now() + randVal
        localCqlLibraryName = 'TestCqlD' + Date.now() + randVal

        measureData.ecqmTitle = localMeasureName
        measureData.cqlLibraryName = localCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLVm

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestData.saveMeasureCql(`${qdmMeasureCQLVm}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
        })
    })

    afterEach('Clean up', () => {
        Utilities.deleteVersionedMeasure(localMeasureName, localCqlLibraryName)
    })

    //MAT-8548
    it('Successful export of a versioned QDM Measure', () => {
        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.eql('1.0.000')
        })

        TestData.requestHumanReadable().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).is.not.null
            expect(response.body).contains('<html')
        })
    })
})

describe('Measure Human Readable comparison', () => {
    beforeEach('Create Measure and Set Access Token', () => {
        OktaLogin.setupUserSession(false)
    })

    before('Create Measure, version, and draft the measure', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureE' + Date.now() + randVal
        newCQLLibraryName = 'TestCqlE' + Date.now() + randVal
        let firstVersionedMeasureName = 'FirstVersioned' + newMeasureName + Date.now()
        let secondVersionedMeasureName = 'SecondVersioned' + newMeasureName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        TestData.saveMeasureCql(`${measureCQL}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
            savedElmJson = response.body.elmJson
        })

        const draftBody = (measureName: string): MeasureDraftBody => ({
            measureName,
            cqlLibraryName: newCQLLibraryName,
            model: 'QI-Core v4.1.1',
            createdBy: OktaLogin.getUser(false),
            cql: measureCQL,
            elmJson: savedElmJson,
            ecqmTitle: 'ecqmTitle',
            measurementPeriodStart: '2023-01-01T00:00:00.000Z',
            measurementPeriodEnd: '2023-12-31T00:00:00.000Z'
        })

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.eql('1.0.000')
        }).then(() =>
            TestData.requestMeasureDraft(draftBody(firstVersionedMeasureName)).then((response) => {
                expect(response.status).to.eql(201)
                TestData.writeFixture('measureId1', response.body.id)
            })
        ).then(() =>
            TestData.versionMeasure('major', 1).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.version).to.eql('2.0.000')
            })
        ).then(() =>
            TestData.requestMeasureDraft(draftBody(secondVersionedMeasureName + 'Dif'), 1).then((response) => {
                expect(response.status).to.eql(201)
                TestData.writeFixture('measureId2', response.body.id)
            })
        )
    })

    it('Successful Human Readable comparison, on versioned measures, via API call', () => {
        OktaLogin.setupUserSession(false)
        TestData.requestHtmlDiff().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.differences[0].field).to.eql('GUID (Version Specific)')
            expect(response.body.differences[1].field).to.eql('Version')
            expect(response.body.differences[2].field).to.eql('Title')
        })
    })
})

describe('Measure Service: Verify error message when there is no Population Criteria for QDM Measure', () => {
    let newMeasureName = ''
    let newCqlLibraryName = ''

    beforeEach('Create Measure and Set Access Token', () => {
        let randVal = Math.floor(Math.random() * 2000 + 3)
        newMeasureName = 'TestMeasureF' + Date.now() + randVal
        newCqlLibraryName = 'TestCqlF' + Date.now() + randVal
        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Verify error message when there is no Population Criteria for QDM Measure', () => {
        TestData.readMeasureId().then((measureId) => {
            TestData.requestHumanReadable(0, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body.message).to.eql(
                    `Response could not be completed for Measure with ID ${measureId}, since there is no population criteria on the measure.`
                )
            })
        })
    })
})
