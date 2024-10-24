import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"

let CQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let measureSharingAPIKey = Environment.credentials().deleteMeasureAdmin_API_Key
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore

describe('Delete CQL Library: Tests covering Libraries that are in draft and versioned states as well as when user is the owner, when user has had Library transferred to them, and when the user is neither the owner nor has had the Library transferred to them', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
        CQLLibraryPage.createCQLLibraryAPIOptionalCQL(CQLLibraryName, CQLLibraryPublisher, measureCQLAlt)

    })

    it('Delete CQL Library - Draft Library - user does not own nor has Library been shared with user', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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
    it('Delete test Case - Draft Library - user is the owner of the Library', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        //set local user that does not own the measure
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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
    it('Delete test Case - Draft Library - user has had the Library transferred to them', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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
    it('Delete CQL Library - Versioned Library - user does not own nor has Library been shared with user', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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
    it('Delete test Case - Versioned Library - user has had the Library transferred to them', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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
describe('Delete test Case - Versioned Library - user has had the Library transferred to them', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
        CQLLibraryPage.createCQLLibraryAPIOptionalCQL(CQLLibraryName, CQLLibraryPublisher, measureCQLAlt)

    })
    it('Delete test Case - Versioned Library - user has had the Library transferred to them', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(harpUserALT + ' granted ownership to Library successfully.')
                })
            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql("1.0.000")

                })

            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.wait(1000)
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
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