import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"
import {Environment} from "../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let measureSharingAPIKey = Environment.credentials().measureSharing_API_Key
let harpUserALT = Environment.credentials().harpUserALT
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Sharing Service', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Successful Measure sharing', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                        url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value,
                            'api-key': measureSharingAPIKey
                        },
                        method: 'PUT'

                }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql(harpUserALT + ' granted access to Measure successfully.')
                })
            })
        })
    })

    it('Verify error message when wrong API key is provided', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/grant?userid=' + harpUserALT,
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

    it('Verify error message when the Measure does not exist in MADiE', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id+5 + '/grant?userid=' + harpUserALT,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
                        'api-key': measureSharingAPIKey
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.eql('Measure does not exist.')
                })
            })
        })
    })
})

