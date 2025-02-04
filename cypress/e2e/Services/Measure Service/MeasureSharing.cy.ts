import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"
import {Environment} from "../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let measureSharingAPIKey = Environment.credentials().adminApiKey
let harpUserALT = Environment.credentials().harpUserALT
let harpUser = Environment.credentials().harpUser
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Sharing Service', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Successful Measure sharing', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                    expect(response.status).to.eql(404)
                    expect(response.body.message).to.eql('Measure does not exist: ' + id + '5')
                })
            })
        })
    })

    it('Get details of Measure shared with', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
