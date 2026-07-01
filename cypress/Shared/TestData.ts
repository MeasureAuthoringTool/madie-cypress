import { v4 as uuidv4 } from 'uuid'

export type FixtureOwner = 'selectedUser' | 'selectedAltUser'

export type PopulationDefinition = {
    id?: string
    name: string
    definition: string
    description?: string | null
}

export type MeasureGroupBody = {
    id?: string
    scoring: string
    populations: PopulationDefinition[]
    measureGroupTypes?: string[]
    populationBasis?: string
    scoringUnit?: {
        label: string
    }
    compositeScoring?: string
}

export type VersionedMeasureResponse = {
    version?: string
    measureName?: string
    elmJson?: string
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

export type TestCaseImportResponse = {
    outcomes: Array<{
        successful: boolean
        message?: string
    }>
}

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

    public static testCaseIdPath(testCaseNumber = 0, owner: FixtureOwner = 'selectedUser'): string {
        const suffix = testCaseNumber > 0 ? testCaseNumber : ''
        return this.fixturePath(`testCaseId${suffix}`, owner)
    }

    public static readTestCaseId(testCaseNumber = 0, owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return cy.readFile(this.testCaseIdPath(testCaseNumber, owner)).should('exist')
    }

    public static readTestCasePatientId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('testCasePId', owner)
    }

    public static readMeasureSetId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('measureSetId', owner)
    }

    public static readVersionId(owner: FixtureOwner = 'selectedUser'): Cypress.Chainable<string> {
        return this.readFixture('versionId', owner)
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

    public static requestMeasureGroup(
        method: 'POST' | 'PUT',
        body: MeasureGroupBody,
        measureNumber = 0
    ): Cypress.Chainable<Cypress.Response<MeasureGroupBody>> {
        return this.withAccessToken((accessToken) => {
            return this.readMeasureId(measureNumber).then((measureId) => {
                return cy.request({
                    url: `/api/measures/${measureId}/groups`,
                    method,
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    },
                    body: this.measureGroupBody(measureId, body)
                })
            })
        }) as Cypress.Chainable<Cypress.Response<MeasureGroupBody>>
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
        versionType: 'major' | 'minor' = 'major',
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
