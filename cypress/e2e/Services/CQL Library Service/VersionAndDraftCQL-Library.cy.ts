import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { LibraryCQL } from "../../../Shared/LibraryCQL"
import { CqlLibraryBody, TestData } from "../../../Shared/TestData"

let harpUser = ''
let harpUserAlt = ''
let cqlLibraryOne = ''
let cqlLibraryTwo = ''

const updatedCqlLibraryName = `UpdatedTestLibrary${Date.now()}`
const model = 'QI-Core v4.1.1'
const cqlLibraryPublisher = 'SemanticBits'
const versionNumber = '1.0.000'
const invalidLibraryCql = LibraryCQL.invalidFhir4Lib
const validCql = LibraryCQL.validCQL4QICORELib
const invalidDraftNameMessage =
    'Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.'

const requestLibraryDraft = (
    cqlLibraryName: string,
    options: Partial<Cypress.RequestOptions> = {},
    owner: 'selectedUser' | 'selectedAltUser' = 'selectedUser',
    fixtureOwner: 'selectedUser' | 'selectedAltUser' = owner
): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.draftCqlLibrary<CqlLibraryBody>(
        (libraryId) => ({
            id: libraryId,
            cqlLibraryName,
            model
        }),
        options,
        0,
        owner,
        fixtureOwner
    )
}

const requestVersionedLibraryUpdate = (
    cqlLibraryName: string,
    options: Partial<Cypress.RequestOptions> = {}
): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.readCqlLibrary<CqlLibraryBody>().then((libraryResponse) => {
        expect(libraryResponse.status).to.eql(200)

        return TestData.updateCurrentCqlLibrary<CqlLibraryBody>(
            (libraryId) => ({
                ...libraryResponse.body,
                id: libraryId,
                cqlLibraryName,
                model,
                draft: false,
                cql: libraryResponse.body.cql ?? ''
            }),
            options
        )
    })
}

describe('Version and Draft CQL Library', () => {
    beforeEach(() => {
        harpUser = TestData.setupUserScope()
        harpUserAlt = TestData.selectedUser('selectedAltUser')
    })

    before(() => {
        cqlLibraryOne = `TestLibrary1${Date.now()}`
        CQLLibraryPage.createLibraryAPI(cqlLibraryOne, SupportedModels.qiCore4, { cql: validCql })

        cqlLibraryTwo = `TestLibrary2${Date.now()}`
        CQLLibraryPage.createLibraryAPI(cqlLibraryTwo, SupportedModels.qiCore4, {
            cql: validCql,
            libraryNumber: 2,
            altUser: true
        })
    })

    it('Add Version to the CQL Library', () => {
        CQLLibraryPage.versionLibraryAPI(versionNumber)
    })

    it('User can not draft CQL Library if the CQL Library naming validations fail', () => {
        requestLibraryDraft('testLibrary', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql(invalidDraftNameMessage)
        })
    })

    it('User can not draft CQL Library if the CQL Library name is empty', () => {
        requestLibraryDraft('', { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(400)
            expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name is required.')
        })
    })

    it('Add Draft to the Versioned Library', () => {
        requestLibraryDraft(updatedCqlLibraryName).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.draft).to.eql(true)
        })
    })

    it('Verify non Library owner unable to create Version', () => {
        const actingUser = TestData.setupUserScope('selectedAltUser')

        TestData.readCqlLibraryId().then((libraryId) => {
            TestData.versionCqlLibrary(
                undefined,
                0,
                'selectedAltUser',
                { failOnStatusCode: false },
                'selectedUser'
            ).then((response) => {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql(
                    `User ${actingUser} cannot modify resource CQL Library with id: ${libraryId}`
                )
            })
        })
    })
})

describe('Draft and Version Validations', () => {
    beforeEach(() => {
        harpUser = TestData.setupUserScope()
        harpUserAlt = TestData.selectedUser('selectedAltUser')

        cqlLibraryOne = `TestLibraryOne${Date.now()}`
        CQLLibraryPage.createLibraryAPI(cqlLibraryOne, SupportedModels.qiCore4, { cql: validCql })
    })

    it('Verify the CQL Library updates are restricted after Version is created', () => {
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        requestVersionedLibraryUpdate(updatedCqlLibraryName, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(409)
            expect(response.body.message).to.contain('Resource is not a Draft.')
        })
    })

    it('Elm data is generated on the fly per GET versioned library request', () => {
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        TestData.requestVersionedCqlLibrary<CqlLibraryBody>(cqlLibraryOne, versionNumber).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.not.be.null
            expect(response.body.elmXml).to.not.be.null
        })
    })
})

describe('Version CQL Library without CQL', () => {
    before(() => {
        harpUser = TestData.setupUserScope()
        harpUserAlt = TestData.selectedUser('selectedAltUser')

        cqlLibraryOne = `CQLLibraryWithoutCQL${Date.now()}`
        CQLLibraryPage.createLibraryAPI(cqlLibraryOne, SupportedModels.qiCore4)
    })

    it('User can not version CQL Library if there is no CQL', () => {
        TestData.readCqlLibraryId().then((libraryId) => {
            TestData.versionCqlLibrary(undefined, 0, 'selectedUser', { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql(
                    `User ${harpUser} cannot version resource CQL Library with id: ${libraryId} as there is no associated Cql with this library`
                )
            })
        })
    })
})

describe('Version CQL Library with invalid CQL', () => {
    before(() => {
        harpUser = TestData.setupUserScope()
        harpUserAlt = TestData.selectedUser('selectedAltUser')

        cqlLibraryOne = `CQLLibraryWithInvalidCQL${Date.now()}`
        CQLLibraryPage.createLibraryAPI(cqlLibraryOne, SupportedModels.qiCore4, {
            publisher: cqlLibraryPublisher,
            cql: invalidLibraryCql,
            cqlErrors: true
        })
    })

    it('User can not version the CQL library if the CQL has errors', () => {
        TestData.readCqlLibraryId().then((libraryId) => {
            TestData.versionCqlLibrary(undefined, 0, 'selectedUser', { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql(
                    `User ${harpUser} cannot version resource CQL Library with id: ${libraryId} as the Cql has errors in it`
                )
            })
        })
    })
})
