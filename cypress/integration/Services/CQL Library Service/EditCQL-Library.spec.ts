import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"

let CQLLibraryName = ''
let updatedCQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let CQLLibraryPublisher = 'SemanticBits'

describe('Edit CQL Library', () => {

    before('Create Measure', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.setAccessTokenCookie()

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

    })

    beforeEach('Set Access Token', () => {

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
                        "model": model
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
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
                })
            })
        })
    })

    it('Validation Error: Edit CQL Library Name has more than 255 characters', () => {

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
                        "model": model
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 255 characters.')
                })
            })
        })
    })

})
