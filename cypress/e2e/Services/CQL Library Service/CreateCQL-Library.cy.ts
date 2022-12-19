import {Environment} from "../../../Shared/Environment"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"

let CQLLibraryName = ''
let harpUser = Environment.credentials().harpUser
let model = 'QI-Core v4.1.1'

describe('CQL Library Service: Create CQL Library', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    it('Create CQL Library, successful creation', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CQLLibraryName)
                expect(response.body.createdBy).to.eql(harpUser)
            })
        })
    })

    it('Get All CQL Libraries', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body).to.be.a('array')
                expect(response.body[0].id).to.be.exist
            })
        })
    })

    it('Get All CQL Libraries created by logged in User', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries?currentUser=true',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body).to.be.a('array')
                cy.get(response.body.length)
                expect(response.body[0].id).to.be.exist
                expect(response.body[0].createdBy).to.eql(harpUser)
            })
        })
    })
})

describe('CQL Library Name validations', () => {

    let apiCQLLibraryName = 'TestLibrary' + Date.now()
    let CQLLibraryPublisher = 'SemanticBits'

    before('Create CQL Library', () => {

        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Validation Error: CQL Library Name empty', () => {

        CQLLibraryName = " "

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name is required.')
            })
        })
    })

    it('Validation Error: CQL Library Name has special characters', () => {

        CQLLibraryName = 'Test_Measure'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name does not start with an Upper Case letter', () => {

        CQLLibraryName = 'testMeasure'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name contains spaces', () => {

        CQLLibraryName = 'Test  Measure'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name has only numbers', () => {

        CQLLibraryName = '1234565'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name has more than 255 characters', () => {

        CQLLibraryName = 'Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvw'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 255 characters.')
            })
        })
    })

    it('Validation Error: Duplicate CQL Library Name', () => {

        CQLLibraryName = apiCQLLibraryName

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must be unique.')
            })
        })
    })
})

describe('CQL Library Model Validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Validation Error: CQL Library Model empty', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": ""
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.eql('Model must be one of the supported types in MADiE.')
            })
        })
    })

    it('Validation Error: Invalid CQL Library Model', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": 'QI-CoreINVALID'
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.eql('Model must be one of the supported types in MADiE.')
            })
        })
    })
})
