import {Environment} from "../../../Shared/Environment"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let measureSharingAPIKey = Environment.credentials().deleteMeasureAdmin_API_Key
let harpUserALT = Environment.credentials().harpUserALT

describe('CQL Library Transfer Service', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    it('Successful CQL Library transfer', () => {

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
    })
})

describe('CQL Library Transfer Validations', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 5

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    it('Verify error message when wrong API key is provided', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + id + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': '1233'
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(403)
                })
            })
        })
    })

    it('Verify error message when the CQL Library does not exist in MADiE', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/' + id+5 + '/ownership?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.eql('Library does not exist.')
                })
            })
        })
    })
})

