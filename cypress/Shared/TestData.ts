import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from './OktaLogin'
import { Environment } from './Environment'

export type FixtureOwner = 'selectedUser' | 'selectedAltUser'
export type TestUserScope = FixtureOwner

export type PopulationDefinition = {
    id?: string
    name: string
    definition: string
    associationType?: string | null
    description?: string | null
}

export type MeasureObservationDefinition = {
    id?: string
    definition: string
    criteriaReference: string | null
    aggregateMethod: string
    description?: string | null
}

export type StratificationDefinition = {
    id?: string
    description?: string
    cqlDefinition: string
    association?: string
    associations?: string[]
}

export type MeasureGroupBody = {
    id?: string
    scoring: string
    populations: PopulationDefinition[]
    measureObservations?: MeasureObservationDefinition[]
    stratifications?: StratificationDefinition[]
    measureGroupTypes?: string[]
    populationBasis?: string
    groupDescription?: string
    rateAggregation?: string
    scoringUnit?: {
        label: string
        value?: {
            code: string
            name: string
            guidance?: string
            system: string
        }
    }
    compositeScoring?: string
    improvementNotation?: string
    improvementNotationDescription?: string
}

export type VersionedMeasureResponse = {
    version?: string
    measureName?: string
    elmJson?: string
    message?: string
}

export type MeasureDeleteActionResponse = {
    message?: string
}

export type MeasureLockResponse = {
    locked: boolean
    lockedBy: string | null
}

export type TestCaseImportBody = {
    patientId: string
    json: string
}

export type TestCaseBody = {
    id?: string
    name: string
    series: string
    title: string
    description?: string
    json?: string
    [key: string]: any
}

export type TestCaseRequestContext = {
    measureId: string
    testCaseId?: string
}

export type TestCaseImportResponse = {
    outcomes: Array<{
        successful: boolean
        message?: string
    }>
}

export type ShareableMadieObject = 'measure' | 'library'

export type MeasureDraftBody = {
    measureSetId?: string
    measureName: string
    cqlLibraryName: string
    model: string
    createdBy: string
    cql: string
    elmJson: string
    ecqmTitle: string
    measurementPeriodStart: string
    measurementPeriodEnd: string
    versionId?: string
}

export type MeasureBody = {
    id?: string
    measureName: string
    cqlLibraryName: string
    model: string
    versionId?: string
    measureSetId?: string
    ecqmTitle?: string
    measurementPeriodStart?: string
    measurementPeriodEnd?: string
    [key: string]: any
}

export type CurrentMeasureContext = {
    measureId: string
    versionId: string
}

export type CqlTranslationResponse = {
    json: string
    xml: string
}

export type CqlLibraryBody = {
    id?: string
    cqlLibraryName: string
    model: string
    createdBy?: string
    description?: string
    publisher?: string
    librarySetId?: string
    version?: string
    cql?: string
    cqlErrors?: boolean
    [key: string]: any
}

export type CqlLibrarySearchBody = {
    searchField: string
    optionalSearchProperties: string[]
}

export type CqlLibrarySearchResponse<T = CqlLibraryBody> = {
    content: T[]
    totalPages?: number
    totalElements?: number
}

export type CqlLibraryDraftBody = {
    id?: string
    cqlLibraryName: string
    model: string
    [key: string]: any
}

export type MeasureCqlSaveOptions = {
    measureNumber?: number
    owner?: TestUserScope
}

export type SavedMeasureCqlExpectation = {
    elmXml?: boolean
}

export class TestData {
    public static selectedUser(owner: FixtureOwner = 'selectedUser'): string {
        const user = Cypress.env(owner)

        if (!user) {
            throw new Error(`Cypress env ${owner} is not set. User allocation likely failed in support setup.`)
        }

        return user
    }

    public static fixturePath(name: string, owner: FixtureOwner = 'selectedUser'): string {
        return `cypress/fixtures/${this.selectedUser(owner)}/${name}`
    }

    public static readFixture(name: string, owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return cy.readFile(this.fixturePath(name, owner)).should('exist')
    }

    public static writeFixture(
        name: string,
        value: string,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<null> {
        return cy.writeFile(this.fixturePath(name, owner), value)
    }

    public static readElementId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('elementId', owner)
    }

    public static writeElementId(value: string, owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<null> {
        return this.writeFixture('elementId', value, owner)
    }

    public static measureIdPath(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): string {
        const suffix = measureNumber > 0 ? measureNumber : ''
        return this.fixturePath(`measureId${suffix}`, owner)
    }

    public static readMeasureId(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return cy.readFile(this.measureIdPath(measureNumber, owner)).should('exist')
    }

    public static cqlLibraryIdPath(libraryNumber = 0, owner: FixtureOwner = 'selectedUser'): string {
        const suffix = libraryNumber > 0 ? libraryNumber : ''
        return this.fixturePath(`cqlLibraryId${suffix}`, owner)
    }

    public static readCqlLibraryId(libraryNumber = 0, owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return cy.readFile(this.cqlLibraryIdPath(libraryNumber, owner)).should('exist')
    }

    public static writeCqlLibraryId(
        value: string,
        libraryNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<null> {
        return this.writeFixture(`cqlLibraryId${libraryNumber > 0 ? libraryNumber : ''}`, value, owner)
    }

    public static testCaseIdPath(testCaseNumber = 0, owner: FixtureOwner = 'selectedUser'): string {
        const suffix = testCaseNumber > 0 ? testCaseNumber : ''
        return this.fixturePath(`testCaseId${suffix}`, owner)
    }

    public static builderResourceIdFixtureName(resourceNumber = 0): string {
        const suffix = resourceNumber > 0 ? resourceNumber : ''
        return `builderResourceId${suffix}`
    }

    public static readTestCaseId(testCaseNumber = 0, owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return cy.readFile(this.testCaseIdPath(testCaseNumber, owner)).should('exist')
    }

    public static writeTestCaseId(
        value: string,
        testCaseNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<null> {
        return this.writeFixture(`testCaseId${testCaseNumber > 0 ? testCaseNumber : ''}`, value, owner)
    }

    public static readBuilderResourceId(
        resourceNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<string> {
        return this.readFixture(this.builderResourceIdFixtureName(resourceNumber), owner)
    }

    public static writeBuilderResourceId(
        value: string,
        resourceNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<null> {
        return this.writeFixture(this.builderResourceIdFixtureName(resourceNumber), value, owner)
    }

    public static readTestCasePatientId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('testCasePId', owner)
    }

    public static writeTestCasePatientId(
        value: string,
        testCaseNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<null> {
        return this.writeFixture(`testCasePId${testCaseNumber > 0 ? testCaseNumber : ''}`, value, owner)
    }

    public static readMeasureSetId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('measureSetId', owner)
    }

    public static readVersionId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('versionId', owner)
    }

    public static readCurrentMeasureContext(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<CurrentMeasureContext> {
        return this.readMeasureId(0, owner).then((measureId) => {
            return this.readVersionId(owner).then((versionId) => ({
                measureId,
                versionId
            }))
        })
    }

    public static measureGroupIdPath(groupNumber = 0, owner: FixtureOwner = 'selectedUser'): string {
        const suffix = groupNumber > 0 ? groupNumber : ''
        return this.fixturePath(`groupId${suffix}`, owner)
    }

    public static readMeasureGroupId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('groupId', owner)
    }

    public static writeMeasureGroupId(
        value: string,
        groupNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<null> {
        return this.writeFixture(`groupId${groupNumber > 0 ? groupNumber : ''}`, value, owner)
    }

    public static readStratificationId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('stratificationId', owner)
    }

    public static withAccessToken(callback: (accessToken: string) => Cypress.Chainable | void): Cypress.Chainable {
        return cy.getCookie('accessToken').then((cookie) => {
            expect(cookie?.value, 'accessToken cookie').to.be.a('string').and.not.be.empty
            return callback(cookie.value)
        })
    }

    public static requestWithAccessToken<T = unknown>(
        options: Partial<Cypress.RequestOptions> & Pick<Cypress.RequestOptions, 'url'>
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.withAccessToken((accessToken) => {
            return cy.request({
                ...options,
                headers: {
                    ...options.headers,
                    authorization: `Bearer ${accessToken}`
                }
            })
        }) as Cypress.Chainable<Cypress.Response<T>>
    }

    public static setupUserScope(owner: TestUserScope = 'selectedUser'): string {
        return OktaLogin.setupUserSession(owner === 'selectedAltUser')
    }

    public static population(name: string, definition: string, overrides: Partial<PopulationDefinition> = {}) {
        return {
            id: uuidv4(),
            name,
            definition,
            ...overrides
        }
    }

    public static measureGroupBody(measureId: string, body: MeasureGroupBody): MeasureGroupBody {
        return {
            id: measureId,
            measureGroupTypes: ['Outcome'],
            populationBasis: 'Boolean',
            ...body
        }
    }

    public static measureBody(body: Partial<MeasureBody>): MeasureBody {
        return {
            versionId: uuidv4(),
            measureSetId: uuidv4(),
            ...body
        } as MeasureBody
    }

    public static writeMeasureContext(
        measure: Pick<MeasureBody, 'id' | 'versionId' | 'measureSetId'>,
        measureNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        const suffix = measureNumber > 0 ? measureNumber : ''

        this.writeFixture(`measureId${suffix}`, measure.id ?? '', owner)
        this.writeFixture(`versionId${suffix}`, measure.versionId ?? '', owner)
        this.writeFixture(`measureSetId${suffix}`, measure.measureSetId ?? '', owner)
    }

    public static cqlLibraryBody(body: Partial<CqlLibraryBody>): CqlLibraryBody {
        return {
            librarySetId: uuidv4(),
            cql: '',
            ...body
        } as CqlLibraryBody
    }

    public static requestMeasure<T = any>(
        body: Partial<MeasureBody>,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: '/api/measure',
            method: 'POST',
            body: this.measureBody(body)
        })
    }

    public static requestMeasureCreate<T = any>(
        body: Partial<MeasureBody>,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: '/api/measure?addDefaultCQL=false',
            method: 'POST',
            body: this.measureBody(body)
        })
    }

    public static requestCqlLibrary<T = CqlLibraryBody>(
        body: Partial<CqlLibraryBody>,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: '/api/cql-libraries',
            method: 'POST',
            body: this.cqlLibraryBody(body)
        })
    }

    public static readCqlLibrary<T = CqlLibraryBody>(
        libraryNumber = 0,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/cql-libraries/${libraryId}`,
                method: 'GET'
            })
        })
    }

    public static requestCqlLibraryById<T = CqlLibraryBody>(
        method: 'GET' | 'PUT' | 'DELETE',
        libraryId: string,
        options: Partial<Cypress.RequestOptions> = {},
        body?: Partial<CqlLibraryBody>
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/cql-libraries/${libraryId}`,
            method,
            ...(body ? { body } : {})
        })
    }

    public static updateCqlLibrary<T = CqlLibraryBody>(
        body: CqlLibraryBody,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/cql-libraries/${body.id}`,
            method: 'PUT',
            body
        })
    }

    public static updateCurrentCqlLibrary<T = CqlLibraryBody>(
        body: (libraryId: string) => Partial<CqlLibraryBody>,
        options: Partial<Cypress.RequestOptions> = {},
        libraryNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/cql-libraries/${libraryId}`,
                method: 'PUT',
                body: body(libraryId)
            })
        })
    }

    public static searchCqlLibraries<T = CqlLibrarySearchResponse>(
        body: Partial<CqlLibrarySearchBody> = {},
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: '/api/cql-libraries/searches',
            method: 'PUT',
            body: {
                searchField: '',
                optionalSearchProperties: [''],
                ...body
            }
        })
    }

    public static versionCqlLibrary<T extends CqlLibraryBody = CqlLibraryBody>(
        expectedVersionNumber?: string,
        libraryNumber = 0,
        owner: FixtureOwner = 'selectedUser',
        options: Partial<Cypress.RequestOptions> = {},
        fixtureOwner: FixtureOwner = owner
    ): Cypress.Chainable<Cypress.Response<T>> {
        this.setupUserScope(owner)

        return this.readCqlLibraryId(libraryNumber, fixtureOwner).then((libraryId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/cql-libraries/version/${libraryId}?isMajor=true`,
                method: 'PUT'
            }).then((response) => {
                if (expectedVersionNumber !== undefined) {
                    expect(response.body.version).to.eql(expectedVersionNumber)
                }

                return response
            })
        })
    }

    public static draftCqlLibrary<T = CqlLibraryBody>(
        body: (libraryId: string) => CqlLibraryDraftBody,
        options: Partial<Cypress.RequestOptions> = {},
        libraryNumber = 0,
        owner: FixtureOwner = 'selectedUser',
        fixtureOwner: FixtureOwner = owner
    ): Cypress.Chainable<Cypress.Response<T>> {
        this.setupUserScope(owner)

        return this.readCqlLibraryId(libraryNumber, fixtureOwner).then((libraryId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/cql-libraries/draft/${libraryId}`,
                method: 'POST',
                body: body(libraryId)
            })
        })
    }

    public static requestVersionedCqlLibrary<T = CqlLibraryBody>(
        libraryName: string,
        version: string,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/cql-libraries/versioned?name=${libraryName}&version=${version}`,
            method: 'GET'
        })
    }

    public static readMeasure<T = MeasureBody>(
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(measureNumber, owner).then((measureId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${measureId}`,
                method: 'GET'
            })
        })
    }

    public static requestMeasureBundle<T = any>(
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(0, owner).then((measureId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${measureId}/bundle`,
                method: 'GET'
            })
        })
    }

    public static requestMeasureExport<T = unknown>(
        options: Partial<Cypress.RequestOptions> = {},
        measureNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(measureNumber, owner).then((measureId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${measureId}/exports`,
                method: 'GET'
            })
        })
    }

    public static requestMeasureById<T = MeasureBody>(
        method: 'GET' | 'PUT' | 'DELETE',
        measureId: string,
        options: Partial<Cypress.RequestOptions> = {},
        body?: Partial<MeasureBody>
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/measures/${measureId}`,
            method,
            ...(body ? { body } : {})
        })
    }

    public static requestAdminMeasureDelete<T = unknown>(
        harpId: string,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(0, owner).then((measureId) => {
            return this.requestAdminMeasureDeleteById<T>(measureId, harpId, options)
        })
    }

    public static requestAdminMeasureDeleteById<T = unknown>(
        measureId: string,
        harpId: string,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/admin/measures/${measureId}`,
            method: 'DELETE',
            headers: {
                ...options.headers,
                harpId
            }
        })
    }

    public static requestMeasureDeleteAction<T = MeasureDeleteActionResponse>(
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(0, owner).then((measureId) => {
            return this.requestMeasureDeleteActionById<T>(measureId, options)
        })
    }

    public static requestMeasureDeleteActionById<T = MeasureDeleteActionResponse>(
        measureId: string,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/measures/${measureId}/delete`,
            method: 'DELETE'
        })
    }

    public static updateMeasure<T = MeasureBody>(
        body: MeasureBody,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.requestWithAccessToken<T>({
            ...options,
            url: `/api/measures/${body.id}`,
            method: 'PUT',
            body
        })
    }

    public static updateCurrentMeasure<T = MeasureBody>(
        body: (context: CurrentMeasureContext) => Partial<MeasureBody>,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readCurrentMeasureContext(owner).then((context) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${context.measureId}`,
                method: 'PUT',
                body: body(context)
            })
        })
    }

    public static translateFhirCql(cql: string): Cypress.Chainable<Cypress.Response<CqlTranslationResponse>> {
        return this.requestWithAccessToken<CqlTranslationResponse>({
            url:
                '/api/fhir/cql/translator/cql?errorSeverity=Info&annotations=true&locators=true&' +
                'disable-list-demotion=true&disable-list-promotion=true&validate-units=true&checkContext=true',
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                Accept: 'application/json, text/plain, */*'
            },
            body: cql
        })
    }

    public static translateQdmCql(cql: string): Cypress.Chainable<Cypress.Response<CqlTranslationResponse>> {
        return this.requestWithAccessToken<CqlTranslationResponse>({
            url:
                '/api/qdm/cql/translator/cql?errorSeverity=Info&annotations=true&locators=true&' +
                'disable-list-demotion=true&disable-list-promotion=true&validate-units=true',
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                Accept: 'application/json, text/plain, */*'
            },
            body: cql
        })
    }

    private static normalizedMeasureCql(cql: string, measure: MeasureBody): string {
        const version = measure.version ?? '0.0.000'

        return cql.replace(
            /^library\s+\S+\s+version\s+'[^']+'/m,
            `library ${measure.cqlLibraryName} version '${version}'`
        )
    }

    private static translateMeasureCql(
        cql: string,
        measure: MeasureBody
    ): Cypress.Chainable<Cypress.Response<CqlTranslationResponse>> {
        if (measure.model === 'QDM v5.6') {
            return this.translateQdmCql(cql)
        }

        return this.translateFhirCql(cql)
    }

    public static saveMeasureCql(
        cql: string,
        measureNumberOrOptions: number | MeasureCqlSaveOptions = 0
    ): Cypress.Chainable<Cypress.Response<MeasureBody>> {
        const options =
            typeof measureNumberOrOptions === 'number'
                ? { measureNumber: measureNumberOrOptions }
                : measureNumberOrOptions

        return this.saveMeasureCqlFor(cql, options)
    }

    public static expectSavedMeasureCql(
        response: Cypress.Response<MeasureBody>,
        { elmXml = false }: SavedMeasureCqlExpectation = {}
    ): void {
        expect(response.status).to.eql(200)
        expect(response.body.elmJson, 'saved measure ELM JSON').to.be.a('string').and.not.be.empty

        if (elmXml) {
            expect(response.body.elmXml, 'saved measure ELM XML').to.be.a('string').and.not.be.empty
        }
    }

    private static saveMeasureCqlFor(
        cql: string,
        { measureNumber = 0, owner = 'selectedUser' }: MeasureCqlSaveOptions = {}
    ): Cypress.Chainable<Cypress.Response<MeasureBody>> {
        this.setupUserScope(owner)

        return this.readMeasure<MeasureBody>(measureNumber, {}, owner).then((measureResponse) => {
            expect(measureResponse.status).to.eql(200)
            const normalizedCql = this.normalizedMeasureCql(cql, measureResponse.body)

            return this.translateMeasureCql(normalizedCql, measureResponse.body).then((translationResponse) => {
                expect(translationResponse.status).to.eql(200)
                expect(translationResponse.body.json, 'translated ELM JSON').to.be.a('string').and.not.be.empty
                expect(translationResponse.body.xml, 'translated ELM XML').to.be.a('string').and.not.be.empty

                return this.updateMeasure<MeasureBody>({
                    ...measureResponse.body,
                    cql: normalizedCql,
                    cqlErrors: false,
                    elmJson: translationResponse.body.json,
                    elmXml: translationResponse.body.xml
                })
            })
        })
    }

    public static requestMeasureGroup<T = MeasureGroupBody>(
        method: 'GET' | 'POST' | 'PUT',
        body?: MeasureGroupBody,
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(measureNumber, owner).then((measureId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${measureId}/groups`,
                method,
                ...(body ? { body: this.measureGroupBody(measureId, body) } : {})
            })
        }) as Cypress.Chainable<Cypress.Response<T>>
    }

    public static requestMeasureGroupById<T = MeasureGroupBody>(
        method: 'DELETE',
        groupId: string,
        body: Cypress.RequestBody,
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(measureNumber).then((measureId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${measureId}/groups/${groupId}`,
                method,
                body
            })
        }) as Cypress.Chainable<Cypress.Response<T>>
    }

    public static requestMeasureGroupStratification<T = StratificationDefinition>(
        method: 'POST' | 'PUT' | 'DELETE',
        body?: StratificationDefinition | ((stratificationId: string) => StratificationDefinition),
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId().then((measureId) => {
            return this.readMeasureGroupId().then((measureGroupId) => {
                const requestStratification = (stratificationId?: string) => {
                    const requestBody = typeof body === 'function' ? body(stratificationId ?? '') : body
                    const stratificationPath = method === 'DELETE' && stratificationId ? `/${stratificationId}` : ''

                    return this.requestWithAccessToken<T>({
                        ...options,
                        url: `/api/measures/${measureId}/groups/${measureGroupId}/stratification${stratificationPath}`,
                        method,
                        ...(requestBody ? { body: requestBody } : {})
                    })
                }

                if (method === 'PUT' || method === 'DELETE') {
                    return this.readStratificationId().then((stratificationId) =>
                        requestStratification(stratificationId)
                    )
                }

                return requestStratification()
            })
        }) as Cypress.Chainable<Cypress.Response<T>>
    }

    public static requestTranslatorVersion(
        model: 'fhir' | 'qdm',
        draft = true
    ): Cypress.Chainable<Cypress.Response<string>> {
        return this.requestWithAccessToken<string>({
            url: `/api/${model}/translator-version?draft=${draft}`,
            method: 'GET'
        })
    }

    public static versionMeasure(
        versionType: 'major' | 'minor' | 'patch' = 'major',
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<VersionedMeasureResponse>> {
        return this.readMeasureId(measureNumber).then((measureId) => {
            return this.requestWithAccessToken<VersionedMeasureResponse>({
                ...options,
                url: `/api/measures/${measureId}/version?versionType=${versionType}`,
                method: 'PUT'
            })
        })
    }

    public static requestHumanReadable(
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<any>> {
        return this.readMeasureId(measureNumber).then((measureId) => {
            return this.requestWithAccessToken<any>({
                ...options,
                url: `/api/humanreadable/${measureId}`,
                method: 'GET'
            })
        })
    }

    public static requestHtmlDiff(
        newMeasureNumber = 0,
        oldMeasureNumber = 1
    ): Cypress.Chainable<Cypress.Response<any>> {
        return this.readMeasureId(newMeasureNumber).then((newMeasureId) => {
            return this.readMeasureId(oldMeasureNumber).then((oldMeasureId) => {
                return this.requestWithAccessToken<any>({
                    url: `/api/html-diff?newMeasureId=${newMeasureId}&oldMeasureId=${oldMeasureId}`,
                    method: 'GET'
                })
            })
        })
    }

    public static requestMeasureLock(
        method: 'PUT' | 'DELETE',
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<MeasureLockResponse>> {
        return this.readMeasureId(measureNumber).then((measureId) => {
            return this.requestWithAccessToken<MeasureLockResponse>({
                ...options,
                url: `/api/measures/${measureId}/measure-lock`,
                method
            })
        })
    }

    public static requestTestCaseLock(
        lockObject: boolean,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser',
        measureNumber = 0,
        testCaseNumber = 0
    ): Cypress.Chainable<Cypress.Response<any>> {
        return this.readMeasureId(measureNumber, owner).then((measureId) => {
            return this.readTestCaseId(testCaseNumber, owner).then((testCaseId) => {
                const url = lockObject
                    ? `/api/measures/${measureId}/test-cases/${testCaseId}/lock`
                    : `/api/test-cases/${testCaseId}/unlock`

                return this.requestWithAccessToken<any>({
                    ...options,
                    url,
                    method: 'POST'
                })
            })
        })
    }

    public static requestCqlLibraryLock(
        method: 'PUT' | 'DELETE',
        libraryNumber = 0,
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<any>> {
        return this.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            return this.requestWithAccessToken<any>({
                ...options,
                url: `/api/cql-libraries/${libraryId}/lock`,
                method
            })
        })
    }

    public static requestUnlockAll(
        type: 'measures' | 'cql-libraries',
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<any>> {
        return this.requestWithAccessToken<any>({
            ...options,
            url: `/api/${type}/unlock`,
            method: 'DELETE'
        })
    }

    public static requestSharePermissions(
        objectType: ShareableMadieObject,
        action: 'GRANT' | 'REVOKE',
        madieId: string,
        user: string,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<any>> {
        const url =
            objectType === 'library'
                ? `/api/cql-libraries/${action === 'GRANT' ? 'share' : 'unshare'}`
                : `/api/measures/${action === 'GRANT' ? 'shared' : 'unshared'}`

        return this.requestWithAccessToken<any>({
            failOnStatusCode: false,
            ...options,
            url,
            method: 'PUT',
            headers: {
                'api-key': Environment.credentials().adminApiKey,
                ...options.headers
            },
            body: { [madieId]: [user] }
        })
    }

    public static requestMeasureTestCase<T = TestCaseBody>(
        method: 'POST' | 'GET' | 'PUT' | 'DELETE',
        body?: TestCaseBody | ((context: TestCaseRequestContext) => TestCaseBody),
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser',
        testCaseNumber: number | null = 0,
        measureNumber = 0
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(measureNumber, owner).then((measureId) => {
            const requestTestCase = (testCaseId?: string) => {
                const requestBody =
                    typeof body === 'function' ? body({ measureId, testCaseId }) : body
                const testCasePath = method === 'POST' || !testCaseId ? '' : `/${testCaseId}`

                return this.requestWithAccessToken<T>({
                    ...options,
                    url: `/api/measures/${measureId}/test-cases${testCasePath}`,
                    method,
                    ...(requestBody ? { body: requestBody } : {})
                })
            }

            if (method === 'POST') {
                return requestTestCase()
            }

            if (method === 'GET' && testCaseNumber === null) {
                return requestTestCase()
            }

            return this.readTestCaseId(testCaseNumber, owner).then((testCaseId) =>
                requestTestCase(testCaseId)
            )
        }) as Cypress.Chainable<Cypress.Response<T>>
    }

    public static requestMeasureTestCaseList<T = TestCaseBody[]>(
        body: TestCaseBody[],
        options: Partial<Cypress.RequestOptions> = {},
        owner: FixtureOwner = 'selectedUser'
    ): Cypress.Chainable<Cypress.Response<T>> {
        return this.readMeasureId(0, owner).then((measureId) => {
            return this.requestWithAccessToken<T>({
                ...options,
                url: `/api/measures/${measureId}/test-cases/list`,
                method: 'POST',
                body
            })
        })
    }

    public static requestTestCaseImports(
        body: TestCaseImportBody[],
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<TestCaseImportResponse>> {
        return this.readMeasureId(measureNumber).then((measureId) => {
            return this.requestWithAccessToken<TestCaseImportResponse>({
                failOnStatusCode: false,
                ...options,
                url: `/api/measures/${measureId}/test-cases/imports`,
                method: 'PUT',
                body
            })
        })
    }

    public static requestMeasureDraft(
        body: MeasureDraftBody,
        measureNumber = 0,
        options: Partial<Cypress.RequestOptions> = {}
    ): Cypress.Chainable<Cypress.Response<any>> {
        return this.readMeasureId(measureNumber).then((measureId) => {
            return this.readMeasureSetId().then((measureSetId) => {
                return this.readVersionId().then((versionId) => {
                    return this.requestWithAccessToken<any>({
                        ...options,
                        url: `/api/measures/${measureId}/draft`,
                        method: 'POST',
                        body: {
                            measureSetId,
                            versionId,
                            ...body
                        }
                    })
                })
            })
        })
    }

    public static requestDraftStatus(
        measureSetIds?: string[]
    ): Cypress.Chainable<Cypress.Response<Record<string, boolean>>> {
        if (measureSetIds) {
            return this.requestWithAccessToken<Record<string, boolean>>({
                url: '/api/measures/draftstatus',
                method: 'POST',
                body: measureSetIds
            })
        }

        return this.readMeasureSetId().then((measureSetId) => {
            return this.requestWithAccessToken<Record<string, boolean>>({
                url: '/api/measures/draftstatus',
                method: 'POST',
                body: [measureSetId]
            })
        })
    }
}
