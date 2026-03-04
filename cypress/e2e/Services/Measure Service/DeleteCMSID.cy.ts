import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"

let measureName = 'DeleteCMSID' + Date.now()
let CqlLibraryName = 'DeleteCMSIDLib' + Date.now()
let harpUser = ''
let harpUserALT = ''

describe('Delete CMS ID for QI-Core Measure', () => {

    before('Login', () => {
        let currentUser = Cypress.env('selectedUser')
        harpUserALT = OktaLogin.getUser(true)
        harpUser = OktaLogin.setupUserSession(false)

        let cmsId: string

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)

        OktaLogin.Login()

        //Generate CMS ID
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()

        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            cmsId = val.toString().valueOf()
            cy.writeFile('cypress/fixtures/' + currentUser + '/cmsId', cmsId)
        })
        cy.log('CMS ID Generated successfully')

        OktaLogin.UILogout()
    })

    after('Log out and Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Verify that the CMS ID deleted successfully for QDM Measure', () => {

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupAdminSession()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/cmsId').should('exist').then((cmsId) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/measureSetId').should('exist').then((measureSetId) => {
                        cy.request({
                            url: '/api/admin/measures/' + measureId + '/delete-cms-id?cmsId=' + cmsId,
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                                'harpId': harpUser
                            }
                        }).then((response) => {
                            console.log(response)
                            expect(response.status).to.eql(200)
                            expect(response.body).to.eql('CMS id of ' + cmsId + ' was deleted successfully from measure set with measure set id of ' + measureSetId)
                        })
                    })
                })
            })
        })
    })

    it('Verify Error Message when Non Measure Owner tries to delete CMS ID', () => {

        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/cmsId').should('exist').then((cmsId) => {
                    cy.request({
                        url: '/api/admin/measures/' + measureId + '/delete-cms-id?cmsId=' + cmsId,
                        method: 'DELETE',
                        failOnStatusCode: false,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value,
                            'harpId': harpUserALT
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body).to.eql('Forbidden: Invalid user role')
                    })
                })
            })
        })
    })
})