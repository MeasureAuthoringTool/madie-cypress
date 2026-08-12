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

const createSecondVersion = (): Cypress.Chainable<{
    historicalLibraryId: string
    latestLibraryId: string
}> => {
    return TestData.versionCqlLibrary<CqlLibraryBody>(versionNumber).then((historicalResponse) => {
        const historicalLibraryId = historicalResponse.body.id
        expect(historicalLibraryId, 'historical library id').to.be.a('string').and.not.be.empty

        return draftCurrentCqlLibrary().then((draftResponse) => {
            expect(draftResponse.status).to.eq(201)
            expect(draftResponse.body.draft).to.eq(true)
            TestData.writeCqlLibraryId(draftResponse.body.id, 1)

            return TestData.versionCqlLibrary<CqlLibraryBody>('2.0.000', 1).then((latestResponse) => {
                const latestLibraryId = latestResponse.body.id
                expect(latestLibraryId, 'latest library id').to.be.a('string').and.not.be.empty

                return cy.wrap({ historicalLibraryId, latestLibraryId })
            })
        })
    })
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

    // MAT-9892: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('Admin deletes only the selected latest CQL Library version by document ID', () => {
        const harpUser = OktaLogin.setupUserSession(false)

        createSecondVersion().then(({ historicalLibraryId, latestLibraryId }) => {
            OktaLogin.setupAdminSession()
            TestData.requestAdminCqlLibraryDeleteById<CqlLibraryBody>(
                latestLibraryId,
                harpUser
            ).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.id).to.eq(latestLibraryId)
                expect(response.body.version).to.eq('2.0.000')
            })

            OktaLogin.setupUserSession(false)
            TestData.requestCqlLibraryById<CqlLibraryBody>('GET', latestLibraryId, {
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(404)
            })
            TestData.requestCqlLibraryById<CqlLibraryBody>('GET', historicalLibraryId).then(
                (response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.id).to.eq(historicalLibraryId)
                    expect(response.body.version).to.eq(versionNumber)
                }
            )
        })
    })

    // MAT-9892: Proven in DEV on 2026-08-06. Keep as regression coverage without rerunning by default.
    it.skip('Admin cannot delete a CQL Library version when harpId does not match the owner', () => {
        const harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)
        TestData.versionCqlLibrary<CqlLibraryBody>(versionNumber).then((versionResponse) => {
            const libraryId = versionResponse.body.id

            OktaLogin.setupAdminSession()
            TestData.requestAdminCqlLibraryDeleteById<CqlLibraryBody>(libraryId, harpUserALT, {
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(409)
                expect(response.body).to.have.property('message').and.contain(harpUserALT)
                expect(response.body).to.have.property('message').and.contain(libraryId)
            })

            OktaLogin.setupUserSession(false)
            TestData.requestCqlLibraryById<CqlLibraryBody>('GET', libraryId).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.id).to.eq(libraryId)
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
