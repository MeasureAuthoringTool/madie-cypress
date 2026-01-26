import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"
import {Environment} from "../../../Shared/Environment"
import {OktaLogin} from "../../../Shared/OktaLogin";

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let measureSharingAPIKey = Environment.credentials().adminApiKey
let harpUserALT = ''
let harpUser = ''
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Sharing Service', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        harpUser = OktaLogin.getUser(false)
        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Successful Measure sharing', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
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
                    expect(response.status).to.eql(200)
                    expect(response.body[0].userId).to.eql(harpUserALT)
                    expect(response.body[0].roles[0]).to.eql('SHARED_WITH')
                })
            })
        })
    })

    it('Verify error message when wrong API key is provided', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': '1233'
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

    it('Verify error message when the Measure does not exist in MADiE', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id+5 + '/acls',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
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
                    expect(response.status).to.eql(500)
                })
            })
        })
    })

    it('Get details of Measure shared with', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/admin/measures/sharedWith?measureids=' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey,
                        'harpId': harpUser
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body[0].measureName).to.eql(measureName)
                    expect(response.body[0].measureId).to.eql(id)
                    expect(response.body[0].measureOwner).to.eql(harpUser)
                    expect(response.body[0].sharedWith).to.eql(null)
                })
            })
        })
    })

    it('Verify error Message when Non Measure owner tried to get details of Measure Shared with', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/admin/measures/sharedWith?measureids=' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey,
                        'harpId': harpUserALT
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Response could not be completed because the HARP id of ' + harpUserALT + ' passed in does not match the owner of the measure with the measure id of ' + id + '. The owner of the measure is ' + harpUser)
                })
            })
        })
    })
})
