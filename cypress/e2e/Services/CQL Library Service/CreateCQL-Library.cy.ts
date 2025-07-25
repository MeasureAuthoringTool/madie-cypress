import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Environment } from "../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'

let CQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let CQLLibraryPublisher = 'SemanticBits'
let harpUser = Environment.credentials().harpUser

describe('CQL Library Service: Create CQL Library', () => {

    beforeEach('Set Access Token', () => {

        CQLLibraryName = 'TestCqlLibrary' + Date.now()

        cy.setAccessTokenCookie()

        //Create CQL Library with Regular User
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

    })

    it('Create QI-Core CQL Library, successful creation', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        let setId = uuidv4()

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
                    "librarySetId": setId,
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CQLLibraryName)
                expect(response.body.model).to.eql(model)
                expect(response.body.librarySetId).to.be.exist
                expect(response.body.createdBy).to.eql(harpUser)
            })
        })
    })

    it('Create QDM CQL Library, successful creation', () => {
        cy.clearAllCookies()
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
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CQLLibraryName)
                expect(response.body.model).to.eql('QDM v5.6')
                expect(response.body.librarySetId).to.be.exist
                expect(response.body.createdBy).to.eql(harpUser)
            })
        })
    })

    it('Get All CQL Libraries', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries/searches',
                method: 'PUT',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    'searchField': "", optionalSearchProperties: [""]  //can be ["libraryName", "version"]
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                expect(response.body.content[0].id).to.be.exist
            })
        })
    })

    it('Get specific CQL Library', () => {
        cy.clearAllCookies()
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
                })
            })
        })
    })

    it('Get All CQL Libraries created by logged in User', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries/searches?currentUser=true',
                method: 'PUT',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    'searchField': "", optionalSearchProperties: [""]  //can be ["libraryName", "version"]
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                expect(response.body.content[0].id).to.be.exist
                expect(response.body.content[0].librarySet.owner).to.eql(harpUser)
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
        cy.clearAllCookies()
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
        cy.clearAllCookies()
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
                expect(response.body.validationErrors).to.be.exist
            })
        })
    })

    it('Validation Error: CQL Library Name does not start with an Upper Case letter', () => {
        cy.clearAllCookies()
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
                expect(response.body.validationErrors).to.be.exist
            })
        })
    })

    it('Validation Error: CQL Library Name contains spaces', () => {
        cy.clearAllCookies()
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
                expect(response.body.validationErrors).to.be.exist
            })
        })
    })

    it('Validation Error: CQL Library Name has only numbers', () => {
        cy.clearAllCookies()
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
                expect(response.body.validationErrors).to.be.exist
            })
        })
    })

    it('Validation Error: CQL Library Name has more than 255 characters', () => {
        cy.clearAllCookies()
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
                expect(response.body.validationErrors.cqlLibraryName).to.eql('Library name cannot be more than 64 characters.')
            })
        })
    })

    it('Validation Error: Duplicate CQL Library Name', () => {
        cy.clearAllCookies()
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

describe('CQL Library Model Validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })

    it('Validation Error: CQL Library Model empty', () => {
        cy.clearAllCookies()
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
        cy.clearAllCookies()
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
