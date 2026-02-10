import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"

let CQLLibraryName = ''
const CQLLibraryPublisher = 'SemanticBits'
const measureCQLAlt = MeasureCQL.ICFCleanTestQICore
const adminApiKey = Environment.credentials().adminApiKey
const versionNumber = '1.0.000'

describe('Delete CQL Library', () => {
    /*
        Tests covering Libraries that are in draft and versioned states as well as when user is the owner, 
        when user has had Library transferred to them, and when the user is neither the owner nor has had 
        the Library transferred to them
    */

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'DeleteCqlLibrary' + Date.now()
        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: measureCQLAlt })
    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {
        const currentUser = Cypress.env('selectedUser')
        // this is altUser, since we are looking for a failure
        OktaLogin.setupUserSession(true)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'DELETE'
                }).then((response) => {
                    expect(response.status).to.eql(403)
                })
            })
        })
    })

    it('Delete CQL Library - Draft Library - user is the owner of the Library', () => {
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)
        //set local user that does not own the measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'DELETE'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Delete CQL Library - Draft Library - user has had the Library transferred to them', () => {
        const currentUser = Cypress.env('selectedUser')
        const harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/transfer?retainShareAccess=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpid': harpUserALT
                    },
                    body: [id],
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })

            OktaLogin.setupUserSession(true)
            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                    cy.request({
                        url: '/api/cql-libraries/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'DELETE'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Delete CQL Library - Versioned Library - user does not own nor has Library been shared with user', () => {
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        OktaLogin.setupUserSession(true)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'DELETE'
                }).then((response) => {
                    expect(response.status).to.eql(403)
                })
            })
        })
    })

    it('Delete CQL Library - Versioned Library - user is the owner of the Library', () => {
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        OktaLogin.setupUserSession(false)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'DELETE'
                }).then((response) => {
                    expect(response.status).to.eql(409)
                })
            })
        })
    })

    it('Delete CQL Library - Versioned Library - user has had the Library transferred to them', () => {
        const currentUser = Cypress.env('selectedUser')
        const harpUserALT = OktaLogin.getUser(true)

        OktaLogin.setupUserSession(false)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/transfer?retainShareAccess=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpid': harpUserALT
                    },
                    body: [id],
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })

            OktaLogin.setupUserSession(true)
            CQLLibraryPage.versionLibraryAPI(versionNumber)

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/cql-libraries/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'DELETE'
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                    })
                })
            })
        })
    })

    it('Delete all Versions of the CQL Library - user is the owner of the Library', () => {
        const currentUser = Cypress.env('selectedUser')
        const harpUser = OktaLogin.setupUserSession(false)
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Draft Versioned Library
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/draft/' + cqlLibraryId,
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId,
                        "cqlLibraryName": CQLLibraryName,
                        "model": 'QI-Core v4.1.1'
                    }

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.draft).to.eql(true)
                })
            })
        })

     //   OktaLogin.setupUserSession(false)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries/' + CQLLibraryName + '/delete-all-versions',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': adminApiKey,
                    'harpId': harpUser
                },
                method: 'DELETE'
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.eql('The library and all its associated versions have been removed successfully.')
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(404)
                })
            })
        })
    })

    it('Delete all Versions of the CQL Library - user does not own nor has Library been shared with user', () => {
        const currentUser = Cypress.env('selectedUser')
        const harpUser = OktaLogin.setupUserSession(false)
        const harpUserALT = OktaLogin.getUser(true)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + CQLLibraryName + '/delete-all-versions',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminApiKey,
                        'harpId': harpUserALT
                    },
                    method: 'DELETE'
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Response could not be completed because the HARP id of ' + harpUserALT + ' passed in does not match the owner of the library with the library id of ' + cqlLibraryId + '. The owner of the library is ' + harpUser)
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })
})
