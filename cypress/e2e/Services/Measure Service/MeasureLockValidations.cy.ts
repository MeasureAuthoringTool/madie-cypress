import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"

const measureName = 'ServiceMeasureSharing' + Date.now()
const cqlLibraryName = 'ServiceMeasureSharingLib' + Date.now()
const measureCQL = MeasureCQL.SBTEST_CQL
let harpUser = ''

describe('Young measure locks are not deleted to protect against race conditions', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        harpUser = OktaLogin.getUser(false)
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Continued test and clean up', () => {
        let currentUser = Cypress.env('selectedUser')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                
                // this lock deletion should be after the protection expires - the delete will process
                cy.request({
                    url: '/api/measures/' + measureId + '/measure-lock',
                    method: 'DELETE',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.locked).to.be.false
                    expect(response.body.lockedBy).to.be.null
                })
            })
        })
        Utilities.deleteMeasure()
    })

    it('Immediate lock deletion attempt is ignored', () => {
        let currentUser = Cypress.env('selectedUser')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                
                cy.request({
                    url: '/api/measures/' + measureId + '/measure-lock',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.locked).to.be.true
                    expect(response.body.lockedBy).to.eql(harpUser)
                })

                // this lock delete should happen within the 200 ms protection zone - it will report 200 but not perform the delete
                cy.request({
                    url: '/api/measures/' + measureId + '/measure-lock',
                    method: 'DELETE',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.locked).to.be.true
                    expect(response.body.lockedBy).to.eql(harpUser)
                })
            })
        })

        cy.wait(200)
    })
})