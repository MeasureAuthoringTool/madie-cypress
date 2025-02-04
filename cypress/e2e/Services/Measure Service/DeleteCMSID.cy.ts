import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {Utilities} from "../../../Shared/Utilities"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {Environment} from "../../../Shared/Environment"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureSharingAPIKey = Environment.credentials().adminApiKey
let harpUser = Environment.credentials().harpUser
let harpUserALT = Environment.credentials().harpUserALT

describe('Delete CMS ID for QI-Core Measure', () => {

    before('Login', () => {

        let cmsId: string

        //Create New Measure
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
            cy.writeFile('cypress/fixtures/cmsId', cmsId)
        })
        cy.log('CMS ID Generated successfully')

    })

    after('Log out and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Verify that the CMS ID deleted successfully for QDM Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/cmsId').should('exist').then((cmsId) => {
                    cy.readFile('cypress/fixtures/measureSetId').should('exist').then((measureSetId) => {
                        cy.request({
                            url: '/api/measures/' + measureId + '/delete-cms-id?cmsId=' + cmsId,
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value,
                                'api-key': measureSharingAPIKey,
                                'harpId': harpUser
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body).to.eql('CMS id of ' + cmsId + ' was deleted successfully from measure set with measure set id of ' + measureSetId)
                        })
                    })
                })
            })
        })
    })

    it('Verify Error Message when Non Measure Owner tries to delete CMS ID', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/cmsId').should('exist').then((cmsId) => {
                    cy.request({
                        url: '/api/measures/' + measureId + '/delete-cms-id?cmsId=' + cmsId,
                        method: 'DELETE',
                        failOnStatusCode: false,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value,
                            'api-key': measureSharingAPIKey,
                            'harpId': harpUserALT
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(409)
                        expect(response.body.message).to.eql('Response could not be completed because the HARP id of ' + harpUserALT + ' passed in does not match the owner of the measure with the measure id of ' + measureId + '. The owner of the measure is ' + harpUser)
                    })
                })
            })
        })
    })
})