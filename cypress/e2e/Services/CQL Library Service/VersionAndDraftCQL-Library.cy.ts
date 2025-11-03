import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { v4 as uuidv4 } from 'uuid'
import { LibraryCQL } from "../../../Shared/LibraryCQL"
import {OktaLogin} from "../../../Shared/OktaLogin"

let CqlLibraryOne = ''
let CqlLibraryTwo = ''
let updatedCqlLibraryName = 'UpdatedTestLibrary' + Date.now()
let harpUser = ''
let harpUserALT = ''
const model = 'QI-Core v4.1.1'
const CQLLibraryPublisher = 'SemanticBits'
const versionNumber = '1.0.000'
const invalidLibraryCql = LibraryCQL.invalidFhir4Lib

describe('Version and Draft CQL Library', () => {

    beforeEach('Set Access Token', () => {

        harpUser = OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)
    })

    before('Create CQL Library', () => {

        //Create CQL Library with Regular User
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

        //Create Measure with Alternate User
        CqlLibraryTwo = 'TestLibrary2' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryTwo, CQLLibraryPublisher, true, true)
    })

    it('Add Version to the CQL Library', () => {

        CQLLibraryPage.versionLibraryAPI(versionNumber)
    })

    it('User can not draft CQL Library if the CQL Library naming validations fail', () => {
        const currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/draft/' + cqlLibraryId,
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId,
                        "cqlLibraryName": "testLibrary",
                        "model": model
                    }

                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.")
                })
            })
        })
    })

    it('User can not draft CQL Library if the CQL Library name is empty', () => {
        const currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/draft/' + cqlLibraryId,
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId,
                        "cqlLibraryName": "",
                        "model": model
                    }

                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql("Library name is required.")

                })
            })
        })
    })

    it('Add Draft to the Versioned Library', () => {
        const currentUser = Cypress.env('selectedUser')
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
                        "cqlLibraryName": updatedCqlLibraryName,
                        "model": model
                    }

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.draft).to.eql(true)
                })
            })
        })
    })

    it('Verify non Library owner unable to create Version', () => {

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(true)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(403)
                    expect(response.body.message).to.eql('User ' + harpUserALT + ' cannot modify resource CQL Library with id: ' + cqlLibraryId)
                })
            })
        })
    })
})

describe('Draft and Version Validations', () => {

    beforeEach('Set Access Token and create CQL Library', () => {

        harpUser = OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        CqlLibraryOne = 'TestLibraryOne' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)
    })

    it('Verify the CQL Library updates are restricted after Version is created', () => {

        const currentUser = Cypress.env('selectedUser')
        //Add Version to the CQL Library
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Edit Library Name after versioned
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId,
                        "cqlLibraryName": updatedCqlLibraryName,
                        "model": model,
                        "draft": false,
                        "librarySetId": uuidv4()
                    }
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Could not update resource CQL Library with id: ' + cqlLibraryId + '. Resource is not a Draft.')
                })
            })
        })
    })

    it('Elm data is generated on the fly per GET versioned library request', () => {
        //Add Version to the CQL Library
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //hit the cql-library-service versioned end point and validate that elm data is returned / generated
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries/versioned?name=' + CqlLibraryOne + '&version=1.0.000',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.elmJson).to.not.be.null
                expect(response.body.elmXml).to.not.be.null
            })
        })
    })
})

describe('Version CQL Library without CQL', () => {

    before('Set Access Token and create CQL Library', () => {

        harpUser = OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        CqlLibraryOne = 'CQLLibraryWithoutCQL' + Date.now()
        CQLLibraryPage.createCQLLibraryAPI(CqlLibraryOne, CQLLibraryPublisher)
    })

    it('User can not version CQL Library if there is no CQL', () => {
        const currentUser = Cypress.env('selectedUser')
        //Add Version to the CQL Library
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version resource CQL Library with id: ' + cqlLibraryId + ' as there is no associated Cql with this library')
                })
            })
        })
    })

})

describe('Version CQL Library with invalid CQL', () => {

    before('Set Access Token and create CQL Library', () => {

        harpUser = OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        CqlLibraryOne = 'CQLLibraryWithInvalidCQL' + Date.now()
        CQLLibraryPage.createLibraryAPI(CqlLibraryOne, SupportedModels.qiCore4, { publisher: CQLLibraryPublisher, cql: invalidLibraryCql, cqlErrors: true })
    })

    it('User can not version the CQL library if the CQL has errors', () => {
        const currentUser = Cypress.env('selectedUser')
        //Add Version to the CQL Library
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version resource CQL Library with id: ' + cqlLibraryId + ' as the Cql has errors in it')
                })
            })
        })
    })
})

