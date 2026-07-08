import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CqlLibraryBody, TestData } from "../../../Shared/TestData"

let CQLLibraryName = ''
const CQLLibraryPublisher = 'SemanticBits'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
const versionNumber = '1.0.000'

const deleteCurrentCqlLibrary = (
    options: Partial<Cypress.RequestOptions> = {}
): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.readCqlLibraryId().then((libraryId) => {
        return TestData.requestCqlLibraryById<CqlLibraryBody>('DELETE', libraryId, options)
    })
}

const transferCurrentCqlLibrary = (
    harpId: string
): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.readCqlLibraryId().then((libraryId) => {
        return TestData.requestWithAccessToken<CqlLibraryBody>({
            url: '/api/cql-libraries/transfer?retainShareAccess=false',
            method: 'PUT',
            headers: {
                harpid: harpId
            },
            body: [libraryId]
        })
    })
}

const draftCurrentCqlLibrary = (): Cypress.Chainable<Cypress.Response<CqlLibraryBody>> => {
    return TestData.draftCqlLibrary<CqlLibraryBody>((libraryId) => ({
        id: libraryId,
        cqlLibraryName: CQLLibraryName,
        model: 'QI-Core v4.1.1'
    }))
}

const deleteAllCqlLibraryVersions = (
    harpId: string,
    options: Partial<Cypress.RequestOptions> = {}
): Cypress.Chainable<Cypress.Response<string | { message: string }>> => {
    return TestData.requestWithAccessToken<string | { message: string }>({
        ...options,
        url: '/api/cql-libraries/admin/' + CQLLibraryName + '/delete-all-versions',
        method: 'DELETE',
        headers: {
            harpId
        }
    })
}

describe('Delete CQL Library', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'DeleteCqlLibrary' + Date.now()
        measureCQLAlt = measureCQLAlt.replace('SimpleFhirLibrary', CQLLibraryName)
        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: measureCQLAlt })
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {
        // this is altUser, since we are looking for a failure
        OktaLogin.setupUserSession(true)

        deleteCurrentCqlLibrary({ failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(403)
        })
    })

    it('Delete CQL Library - Draft Library - user is the owner of the Library', () => {
        OktaLogin.setupUserSession(false)

        deleteCurrentCqlLibrary().then((response) => {
            expect(response.status).to.eql(200)
        })
    })

    it('Delete CQL Library - Draft Library - user has had the Library transferred to them', () => {
        const harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)
        transferCurrentCqlLibrary(harpUserALT).then((response) => {
            expect(response.status).to.eql(200)
        }).then(() => {
            OktaLogin.setupUserSession(true)

            deleteCurrentCqlLibrary().then((response) => {
                expect(response.status).to.eql(200)
            })
        })
    })

    it('Delete CQL Library - Versioned Library - user does not own nor has Library been shared with user', () => {
        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        // switch to altUser
        OktaLogin.setupUserSession(true)
        deleteCurrentCqlLibrary({ failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(403)
        })
    })

    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        OktaLogin.setupUserSession(false)
        deleteCurrentCqlLibrary({ failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(409)
        })
    })

    it('Delete CQL Library - Versioned Library - user has had the Library transferred to them', () => {
        const harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)
        transferCurrentCqlLibrary(harpUserALT).then((response) => {
            expect(response.status).to.eql(200)
        }).then(() => {
            OktaLogin.setupUserSession(true)
            CQLLibraryPage.versionLibraryAPI(versionNumber)

            deleteCurrentCqlLibrary({ failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(409)
            })
        })
    })

    it('Delete all Versions of the CQL Library - user is the owner of the Library', () => {
        const harpUser = OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Draft Versioned Library
        draftCurrentCqlLibrary().then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.draft).to.eql(true)
        })

        OktaLogin.setupAdminSession()
        deleteAllCqlLibraryVersions(harpUser).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.eql('The library and all its associated versions have been removed successfully.')
        })

        OktaLogin.setupUserSession(false)
        TestData.readCqlLibrary<CqlLibraryBody>(0, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eql(404)
        })
    })

    it('Delete all Versions of the CQL Library - user does not own nor has Library been shared with user', () => {
        const harpUser = OktaLogin.setupUserSession(false)
        const harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupAdminSession()
        TestData.readCqlLibraryId().then((cqlLibraryId) => {
            deleteAllCqlLibraryVersions(harpUserALT, { failOnStatusCode: false }).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body).to.have.property(
                    'message',
                    'Response could not be completed because the HARP id of ' + harpUserALT + ' passed in does not match the owner of the library with the library id of ' + cqlLibraryId + '. The owner of the library is ' + harpUser
                )
            })
        })

        OktaLogin.setupUserSession(false)
        TestData.readCqlLibrary<CqlLibraryBody>().then((response) => {
            expect(response.status).to.eql(200)
        })
    })
})
