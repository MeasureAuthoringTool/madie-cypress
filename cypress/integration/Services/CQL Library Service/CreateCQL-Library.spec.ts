import {Environment} from "../../../Shared/Environment"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"

let CQLLibraryName = ''
let harpUser = Environment.credentials().harpUser
let model = 'QI-Core v4.1.1'

const authnUrl = Environment.authentication().authnUrl
const authUri = Environment.authentication().authUri
const redirectUri = Environment.authentication().redirectUri
const clientId = Environment.authentication().clientId
const authCodeUrl = authUri + '/v1/authorize'
const tokenUrl = authUri + '/v1/token'
const codeVerifier = Cypress.env('MADIE_CODEVERIFIER')

describe('CQL Library Service: Create CQL Library', () => {

    beforeEach('Set Access Token', () => {

        //cy.setAccessTokenCookie()

        cy.clearCookies()
        cy.clearLocalStorage()

        cy.request({
            url: authnUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'application/json'
            },

            body: { username: Environment.credentials().harpUser,
                password: Environment.credentials().password,

                options: {
                    multiOptionalFactorEnroll: false,
                    warnBeforePasswordExpired: true
                }
            },
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eql(200)
            const sessionToken = response.body.sessionToken


            let url = authCodeUrl + '?client_id=' + clientId +
                '&code_challenge=' + 'LBY2kyC5ZfYC9RaG9HOgRjf9i7U-zgmwHLC280r4UfA' +
                '&code_challenge_method=S256' +
                '&response_type=code' +
                '&response_mode=okta_post_message' +
                '&display=page' +
                '&nonce=uxiJab6ycJdNkEZkwbtqnSC1MRuIFCXQATQZSWiBjWdSuuBdbIDCN9EafOYiPaHs' + sessionToken +
                '&redirect_uri=' + redirectUri +
                '&sessionToken=' + sessionToken +
                '&state=iTIppKJsrKTXektB6F1h1dRsQEaDCjlTD3xtjDbYKZ1FlPFKVcq1u7FRuPgPMqxZ' +
                '&scope=openid%20email%20profile'


            cy.request({
                url: url,
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept': '*/*'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.headers.toString()).to.eql('test')
                //expect(response.body.toString()).to.eql('test')

                const resp = response.body

                const codeIdx = resp.indexOf("data.code")
                const codeEndIdx = resp.indexOf(";", codeIdx)
                const codeLine = resp.substring(codeIdx, codeEndIdx)
                const [v, c] = codeLine.split("=")
                const escapedCode = c.trim().replace(/'/g, '')
                const authCode = escapedCode.replace(/\\x([0-9A-Fa-f]{2})/g, function () {
                    return String.fromCharCode(parseInt(arguments[1], 16))
                })

                cy.request({
                    url: tokenUrl,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept': '*/*'
                    },
                    body: {
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        redirect_uri: redirectUri,
                        code: authCode,
                        code_verifier: codeVerifier
                    },
                    failOnStatusCode: false
                }).then((response) => {

                    expect(response.status).to.eql(200)
                    const access_token = response.body.access_token
                    //setting the cookie value to be grabbed for api authentication
                    cy.setCookie('accessToken', access_token)

                })
            })
        })

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
