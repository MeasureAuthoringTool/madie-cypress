export {}

describe('Terminology Service: Value Set', () => {

    beforeEach('Set Access Token and tgt',() => {

        cy.setAccessTokenCookie()
        cy.UMLSAPIKeyLogin()
    })

    it('GET valueSet: Successful retrieval of valueSet', () => {

        cy.getCookie('accessToken').then((accessToken) => {
                cy.request({
                    url: '/api/vsac/valueset',
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value
                    },
                    qs: {
                        oid: '2.16.840.1.113762.1.4.1'
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('ValueSet')
                    expect(response.body.title).to.eql('ONC Administrative Sex')
                })
        })
    })

    it('GET valueSet: valueSet not found', () => {

        cy.getCookie('accessToken').then((accessToken) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/vsac/valueset',
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value
                    },
                    qs: {
                        oid: '2.16.840.1.11356762.1.4.1'
                    }
                }).then((response) => {
                    expect(response.status).to.eql(500)
                    expect(response.statusText).to.eql('Internal Server Error')
                    expect(response.isOkStatusCode).to.eql(false)
                })
        })
    })
})

describe('Terminology Service: Value Set: Authentication', () => {

    beforeEach('Set Access Token and tgt',() => {

        cy.setAccessTokenCookie()
        cy.UMLSAPIKeyLogin()
    })

    it('GET valueSet: Bad Access Token', () => {

        cy.getCookie('accessToken').then((accessToken) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/vsac/valueset',
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value + 'test'
                    },
                    qs: {
                        oid: '2.16.840.1.11356762.1.4.1'
                    }
                }).then((response) => {
                    expect(response.status).to.eql(401)
                    expect(response.statusText).to.eql('Unauthorized')
                    expect(response.isOkStatusCode).to.eql(false)
                    expect(response.headers["www-authenticate"]).contains('Bearer error=\"invalid_token\"')
                })

        })

    })
})




