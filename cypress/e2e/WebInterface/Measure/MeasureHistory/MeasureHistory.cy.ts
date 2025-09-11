import {Environment} from "../../../../Shared/Environment"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {LandingPage} from "../../../../Shared/LandingPage"
import {Header} from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let harpUser = Environment.credentials().harpUser
let measureSharingAPIKey = Environment.credentials().adminApiKey

//Skipping until Feature flag MeasureHistory is removed
describe.skip('Measure History', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify that Create and Delete CMS ID actions are recorded in Measure History', () => {

        //Generate CMS ID
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.generateCmsIdButton).should('exist')
        cy.get(EditMeasurePage.generateCmsIdButton).should('be.enabled')
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(EditMeasurePage.cmsIdInput).should('exist')
        cy.get(EditMeasurePage.cmsIdInput).invoke('val').then(val => {
            const cmsId = val.toString().valueOf()
            cy.writeFile('cypress/fixtures/cmsId', cmsId)
            cy.log('CMS ID Generated successfully: ' + cmsId)
        })

        //Navigate back to Measure List page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')

        //Go to Measure History and verify that CMS ID generation is recorded
        MeasuresPage.actionCenter('viewHistory')
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'CREATE_CMSID')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', harpUser)
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Created CMS ID')

        //Delete CMS ID
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

        OktaLogin.Login()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')

        //Go to Measure History and verify that Delete CMS ID is recorded
        MeasuresPage.actionCenter('viewHistory')
        cy.get(MeasuresPage.additionalActionRow).should('contain.text', 'Deleted CMS ID ')
    })
})