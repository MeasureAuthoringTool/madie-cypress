import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { Utilities } from '../../../Shared/Utilities'
import { MeasureDraftBody, TestData } from '../../../Shared/TestData'

let randValue = Math.floor(Math.random() * 1000 + 1)
let newMeasureName = ''
let newCqlLibraryName = ''
let cohortMeasureCQL = MeasureCQL.CQL_For_Cohort
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let elmJson =
    '{"library":{"identifier":{"id":"SimpleFhirMeasureLib","version":"0.0.004"},"schemaIdentifier":{"id":"urn:hl7-org:elm","version":"r1"},"usings":{"def":[{"localIdentifier":"System","uri":"urn:hl7-org:elm-types:r1"},{"localId":"1","locator":"2:1-2:26","localIdentifier":"FHIR","uri":"http://hl7.org/fhir","version":"4.0.1","annotation":[{"type":"Annotation","s":{"r":"1","s":[{"value":["","using "]},{"s":[{"value":["FHIR"]}]},{"value":[" version ","\'4.0.1\'"]}]}}]}]},"includes":{"def":[{"localId":"2","locator":"3:1-3:56","localIdentifier":"FHIRHelpers","path":"FHIRHelpers","version":"4.1.000","annotation":[{"type":"Annotation","s":{"r":"2","s":[{"value":["","include "]},{"s":[{"value":["FHIRHelpers"]}]},{"value":[" version ","\'4.0.001\'"," called ","FHIRHelpers"]}]}}]}]},"parameters":{"def":[{"localId":"5","locator":"4:1-4:49","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"5","s":[{"value":["","parameter ","\'Measurement Period\'"," "]},{"r":"4","s":[{"value":["Interval<"]},{"r":"3","s":[{"value":["DateTime"]}]},{"value":[">"]}]}]}}],"parameterTypeSpecifier":{"localId":"4","locator":"4:32-4:49","type":"IntervalTypeSpecifier","pointType":{"localId":"3","locator":"4:41-4:48","name":"{urn:hl7-org:elm-types:r1}DateTime","type":"NamedTypeSpecifier"}}}]},"contexts":{"def":[{"locator":"5:1-5:15","name":"Patient"}]},"statements":{"def":[{"locator":"5:1-5:15","name":"Patient","context":"Patient","expression":{"type":"SingletonFrom","operand":{"locator":"5:1-5:15","dataType":"{http://hl7.org/fhir}Patient","templateId":"http://hl7.org/fhir/StructureDefinition/Patient","type":"Retrieve"}}}]}},"externalErrors":[]}'
let harpUser = ''
let measureName = 'TestMeasure' + Date.now()

const draftBody = (): MeasureDraftBody => ({
    measureName,
    cqlLibraryName: newCqlLibraryName,
    model: 'QI-Core v4.1.1',
    createdBy: harpUser,
    cql: cohortMeasureCQL,
    elmJson,
    ecqmTitle: 'ecqmTitle',
    measurementPeriodStart: mpStartDate + 'T00:00:00.000Z',
    measurementPeriodEnd: mpEndDate + 'T00:00:00.000Z'
})

const requestCurrentDraft = (options: Partial<Cypress.RequestOptions> = {}) => {
    return TestData.requestMeasureDraft(draftBody(), 0, options)
}

const setCurrentMeasureId = (measureId: string): Cypress.Chainable<null> => {
    return TestData.writeFixture('measureId', measureId)
}

const expectCurrentVersion = (versionType: 'major' | 'minor' | 'patch', expectedVersion: string): void => {
    TestData.versionMeasure(versionType).then((response) => {
        expect(response.status).to.eql(200)
        expect(response.body.version).to.eql(expectedVersion)
    })
}

const expectCurrentDraftStatus = (expectedDraftable: boolean): void => {
    TestData.readMeasureSetId().then((measureSetId) => {
        TestData.requestDraftStatus().then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body).has.property(measureSetId).and.is.eql(expectedDraftable)
        })
    })
}

describe('Version and Draft CQL Library', () => {
    beforeEach('Create Measure, and add Cohort group', () => {
        harpUser = OktaLogin.setupUserSession(false)

        //Create Measure
        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        TestData.saveMeasureCql(`${cohortMeasureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })

        MeasureGroupPage.CreateCohortMeasureGroupAPI()
    })

    it('Add Draft to the Versioned measure', () => {
        OktaLogin.setupUserSession(false)

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.eql('1.0.000')
        })

        requestCurrentDraft().then((response) => {
            expect(response.status).to.eql(201)
            TestData.writeFixture('draftId', response.body.id)
        })
    })

    it('User cannot create a draft when a draft already exists, per measure', () => {
        OktaLogin.setupUserSession(false)

        let newerMeasureName = ''

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.eql('1.0.000')
            newerMeasureName = response.body.measureName
        })

        requestCurrentDraft().then((response) => {
            expect(response.status).to.eql(201)
        })

        requestCurrentDraft({ failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.message).to.eql(
                'Can not create a draft for the measure "' +
                    newerMeasureName +
                    '". Only one draft is permitted per measure.'
            )
        })
    })
})

describe('Draftable API end point tests', () => {
    // Deferred refactor: these scenarios chain version, draft, minor-version, and
    // draft-status transitions against the same measure family. Extract after the
    // draft-status helper path is proven in the simpler draft tests above.

    beforeEach('Create Measure, and add Cohort group', () => {
        harpUser = OktaLogin.setupUserSession(false)

        //Create Measure
        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        TestData.saveMeasureCql(`${cohortMeasureCQL}\n`).then((response) => {
            TestData.expectSavedMeasureCql(response)
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
    })
    it('Draftable end point return measure set id that was used in request and false if the measure is not version', () => {
        OktaLogin.setupUserSession(false)

        expectCurrentDraftStatus(false)
    })
    it('Draftable end point return measure set id that was used in request and false if another measure, in that measure family, is in a draft status', () => {
        OktaLogin.setupUserSession(false)

        expectCurrentVersion('major', '1.0.000')
        requestCurrentDraft().then((response) => {
            expect(response.status).to.eql(201)
            setCurrentMeasureId(response.body.id)
        })
        expectCurrentVersion('minor', '1.1.000')
        requestCurrentDraft().then((response) => {
            expect(response.status).to.eql(201)
        })
        expectCurrentDraftStatus(false)
    })
    it('Draftable end point return measure set id that was used in request and true if the measure is versioned, regardless of version type (major, minor, or patch)', () => {
        OktaLogin.setupUserSession(false)

        expectCurrentVersion('major', '1.0.000')
        expectCurrentDraftStatus(true)

        requestCurrentDraft().then((response) => {
            expect(response.status).to.eql(201)
            setCurrentMeasureId(response.body.id)
        })

        expectCurrentVersion('minor', '1.1.000')
        expectCurrentDraftStatus(true)

        requestCurrentDraft().then((response) => {
            expect(response.status).to.eql(201)
            setCurrentMeasureId(response.body.id)
        })

        expectCurrentVersion('patch', '1.1.001')
        expectCurrentDraftStatus(true)
    })
})
