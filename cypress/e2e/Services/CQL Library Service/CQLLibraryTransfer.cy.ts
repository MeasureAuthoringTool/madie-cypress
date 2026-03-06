import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"
import { OktaLogin } from "../../../Shared/OktaLogin"

let CQLLibraryName = 'LibraryTransfer' + Date.now()
let newCQLLibraryName = ''
let harpUserALT = ''
const CQLLibraryPublisher = 'SemanticBits'

describe('CQL Library Transfer Service', () => {

    beforeEach('Create CQL Library', () => {

        harpUserALT = OktaLogin.getUser(true)

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    it('Successful CQL Library transfer', () => {

        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
    })
})

describe('CQL Library Transfer Validations', () => {

    beforeEach('Create CQL Library', () => {

        harpUserALT = OktaLogin.getUser(true)

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 5

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    it('Verify error when non-admin attempts to share', () => {

        const currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/admin/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        "acls": [
                            {
                                "userId": harpUserALT,
                                "roles": [
                                    "SHARED_WITH"
                                ]
                            }
                        ],
                        "action": "GRANT"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(403)
                })
            })
        })
    })

    it('Verify error message when the CQL Library does not exist in MADiE', () => {

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupAdminSession()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/cql-libraries/admin/' + id + 25 + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        "acls": [
                            {
                                "userId": harpUserALT,
                                "roles": [
                                    "SHARED_WITH"
                                ]
                            }
                        ],
                        "action": "GRANT"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(404)
                    expect(response.body.message).to.contain('Library does not exist:')
                })
            })
        })
    })
})

