import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Environment } from "../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from "../../../Shared/OktaLogin"

let CQLLibraryName = ''
let updatedCQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let CQLLibraryPublisher = 'SemanticBits'
let CqlLibraryTwo = ''
let harpUser = Environment.credentials().harpUserALT

describe('Edit CQL Library', () => {

    before('Create Measure', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

        //Create CQL Library with Alternate User
        CqlLibraryTwo = 'TestLibrary2' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryTwo, CQLLibraryPublisher, true, true)

    })

    beforeEach('Set Access Token', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    it('Edit CQL Library : Successful Update', () => {

        updatedCQLLibraryName = 'UpdatedCQLLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId,
                        "cqlLibraryName": updatedCQLLibraryName,
                        "model": model,
                        "librarySetId": uuidv4(),
                        "cql": ""
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.cqlLibraryName).to.eql(updatedCQLLibraryName)
                })
            })
        })
        cy.log('CQL Library Name Updated Successfully')
    })

    it('Validation Error: Edit CQL Library Name empty', () => {

        updatedCQLLibraryName = " "

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name is required.')
                })
            })
        })
    })

    it('Validation Error: Edit CQL Library Name has special characters', () => {

        updatedCQLLibraryName = 'Test_Measure'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
                })
            })
        })
    })

    it('Validation Error: Edit CQL Library Name does not start with an Upper Case letter', () => {

        updatedCQLLibraryName = 'testMeasure'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
                })
            })
        })
    })

    it('Validation Error: Edit CQL Library Name contains spaces', () => {

        updatedCQLLibraryName = 'Test  Measure'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
                })
            })
        })
    })

    it('Validation Error: Edit CQL Library Name has only numbers', () => {

        updatedCQLLibraryName = '1234565'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
                })
            })
        })
    })

    it('Validation Error: Edit CQL Library Name has more than 64 characters', () => {

        updatedCQLLibraryName = 'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 64 characters.')
                })
            })
        })
    })

    it('Verify non Library owner unable to Edit CQL Library', () => {

        updatedCQLLibraryName = 'UpdatedCQLLibrary' + Date.now()
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        cy.wait(5000)
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId2').should('exist').then((cqlLibraryId2) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + cqlLibraryId2,
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId2,
                        "cqlLibraryName": updatedCQLLibraryName,
                        "librarySetId": uuidv4(),
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(403)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot modify resource CQL Library with id: ' + cqlLibraryId2)

                })
            })
        })
    })
})
