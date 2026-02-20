import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MadieObject, Utilities } from "../../../Shared/Utilities"

const coreMeasureName = 'AdminTransferMeasure'
const coreLibName = 'AdminTransferMeasureLib'
const now = Date.now()

describe('Transfer ownership of measure via Admin API', () => {

    before('Create many measures', () => {

        CreateMeasurePage.CreateMeasureAPI(coreMeasureName + now, coreLibName + now, SupportedModels.qiCore6)
        CreateMeasurePage.CreateMeasureAPI(coreMeasureName + 1 + now, coreLibName + 1 + now, SupportedModels.qiCore6, null, 1)
        CreateMeasurePage.CreateMeasureAPI(coreMeasureName + 2 + now, coreLibName + 2 + now, SupportedModels.qiCore6, null, 2)
        CreateMeasurePage.CreateMeasureAPI(coreMeasureName + 3 + now, coreLibName + 3 + now, SupportedModels.qiCore6, null, 3)
    })

    after('Clean up', () => {
        /*
            Our delete methods do not allow for having the measure transfering ownership.
            We can only delete this 1 since it stays with the original owner.
        */
        Utilities.deleteMeasure() 
    })

    it('Request sent with no measure data returns 400', () => {
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/admin/measures/ownership?harpId=' + currentUser,
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                },
                method: 'PUT',
                body: []
            }).then((response) => {
                expect(response.status).to.eql(400)
            })
        })
    })

    it('Successful admin transfer of 1 measure', () => {
        const currentUser = Cypress.env('selectedUser')
        const altUserName = OktaLogin.getUser(true)
        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId3').should('exist').then((measureId3) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/admin/measures/ownership?harpId=' + altUserName,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value,
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

    it('Partial success case - attempt to admin transfer 3 measures - 2 succeed, 1 fails due to lock', () => {
        const currentUser = Cypress.env('selectedUser')
        const altUserName = OktaLogin.getUser(true)

        // as current owner, lock Measure with measureId
        Utilities.lockControl(MadieObject.Measure, true, false)

        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId1').should('exist').then((measureId1) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((measureId2) => {

                        cy.request({
                            failOnStatusCode: false,
                            url: '/api/admin/measures/ownership?harpId=' + altUserName,
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                            },
                            method: 'PUT',
                            body: [measureId, measureId1, measureId2]
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
})