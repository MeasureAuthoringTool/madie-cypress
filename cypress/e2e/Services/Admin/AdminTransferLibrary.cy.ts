import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MadieObject, Utilities } from "../../../Shared/Utilities"

const coreLibName = 'AdminTransferLibrary'
const adminAPIKey = Environment.credentials().adminApiKey
const now = Date.now()

describe('Transfer ownership of library via Admin API', () => {

    before('Create many libraries', () => {

        CQLLibraryPage.createLibraryAPI(coreLibName + now, SupportedModels.qiCore6, {})
        CQLLibraryPage.createLibraryAPI(coreLibName + 1 + now, SupportedModels.qiCore6, { libraryNumber: 1 })
        CQLLibraryPage.createLibraryAPI(coreLibName + 2 + now, SupportedModels.qiCore6, { libraryNumber: 2 })
    })

    after('Clean up', () => {
        /*
            Our delete methods do not allow for having the library transfering ownership.
            We can only delete this 1 since it stays with the original owner.
        */
        Utilities.deleteLibrary(coreLibName + now)
    })

    it('Request sent with no library data returns 400', () => {
        const currentUser = Cypress.env('selectedUser')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/cql-libraries/admin/ownership?harpId=' + currentUser,
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': adminAPIKey
                },
                method: 'PUT',
                body: []
            }).then((response) => {
                expect(response.status).to.eql(400)
            })
        })
    })

    it('Successful admin transfer of 1 Library', () => {
        const currentUser = Cypress.env('selectedUser')
        const altUserName = OktaLogin.getUser(true)
        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId2').should('exist').then((measureId3) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/admin/ownership?harpId=' + altUserName,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey
                    },
                    method: 'PUT',
                    body: [measureId3]
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql([measureId3])
                })
            })
        })
    })

    it('Partial success case - attempt to admin transfer 2 libraries - 1 succeed, 1 fails due to lock', () => {
        const currentUser = Cypress.env('selectedUser')
        const altUserName = OktaLogin.getUser(true)

        // as current owner, lock Measure with measureId
        Utilities.lockControl(MadieObject.Library, true, false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId1').should('exist').then((measureId1) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/cql-libraries/admin/ownership?harpId=' + altUserName,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value,
                            'api-key': adminAPIKey
                        },
                        method: 'PUT',
                        body: [measureId, measureId1]
                    }).then((response) => {
                        expect(response.status).to.eql(207)
                        // report failure of only measureId, since it was locked
                        expect(response.body).to.eql([measureId])
                    })
                })
            })
        })
    })
})