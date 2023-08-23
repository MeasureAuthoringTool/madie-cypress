import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Environment } from "../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'

let CQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let CQLLibraryPublisher = 'SemanticBits'
let harpUser = Environment.credentials().harpUser


// still seeing issues with these tests locking up; skipping until we can investigate further
describe.skip('CQL Library Service: Create CQL Library', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

    })

    it('Create QI-Core CQL Library, successful creation', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CQLLibraryName = 'QICoreCqlLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "cql": "",
                    "librarySetId": uuidv4(),
                    "programUseContext": { "code": "a", "display": "b", "codeSystem": "c" }
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CQLLibraryName)
                expect(response.body.model).to.eql(model)
                expect(response.body.createdBy).to.eql(harpUser)
                expect(response.body.programUseContext.code).to.eql('a')
                expect(response.body.programUseContext.display).to.eql('b')
                expect(response.body.programUseContext.codeSystem).to.eql('c')
            })
        })
    })

    it('Create QDM CQL Library, successful creation', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CQLLibraryName = 'QDMCqlLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": CQLLibraryName,
                    "model": 'QDM v5.6',
                    "cql": "",
                    "librarySetId": uuidv4(),
                    "programUseContext": { "code": "a", "display": "b", "codeSystem": "c" }
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CQLLibraryName)
                expect(response.body.model).to.eql('QDM v5.6')
                expect(response.body.createdBy).to.eql(harpUser)
                expect(response.body.programUseContext.code).to.eql('a')
                expect(response.body.programUseContext.display).to.eql('b')
                expect(response.body.programUseContext.codeSystem).to.eql('c')
            })
        })
    })

    it('Get All CQL Libraries', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
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

    it('Get specific CQL Library', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()


        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/' + cqlLibraryId,
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.not.be.null
                    expect(response.body.id).to.be.exist
                    expect(response.body.programUseContext.code).to.eql('a')
                    expect(response.body.programUseContext.display).to.eql('b')
                    expect(response.body.programUseContext.codeSystem).to.eql('c')
                })
            })
        })
    })

    it('Get All CQL Libraries created by logged in User', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                expect(response.body[0].librarySet.owner).to.eql(harpUser)
            })
        })
    })
})

// still seeing issues with these tests locking up; skipping until we can investigate further
describe.skip('CQL Library Name validations', () => {

    let apiCQLLibraryName = 'TestLibrary' + Date.now()
    let CQLLibraryPublisher = 'SemanticBits'

    before('Create CQL Library', () => {

        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Validation Error: CQL Library Name empty', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "model": model,
                    "librarySetId": uuidv4(),
                    "cql": ""
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name is required.')
            })
        })
    })

    it('Validation Error: CQL Library Name has special characters', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name does not start with an Upper Case letter', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name contains spaces', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name has only numbers', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
            })
        })
    })

    it('Validation Error: CQL Library Name has more than 255 characters', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 255 characters.')
            })
        })
    })

    it('Validation Error: Duplicate CQL Library Name', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": model
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name must be unique.')
            })
        })
    })
})

// still seeing issues with these tests locking up; skipping until we can investigate further
describe.skip('CQL Library Model Validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Validation Error: CQL Library Model empty', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": ""
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.eql('Model must be one of the supported types in MADiE.')
            })
        })
    })

    it('Validation Error: Invalid CQL Library Model', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

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
                    "librarySetId": uuidv4(),
                    "model": 'QI-CoreINVALID'
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.model).to.eql('Model must be one of the supported types in MADiE.')
            })
        })
    })
})
