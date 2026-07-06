import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { TestData } from '../../../Shared/TestData'

let measureName = 'DeleteCMSID' + Date.now()
let CqlLibraryName = 'DeleteCMSIDLib' + Date.now()
let harpUser = ''
let harpUserALT = ''

describe('Delete CMS ID for QI-Core Measure', () => {
    before('Login', () => {
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
        cy.get(EditMeasurePage.cmsIdInput)
            .invoke('val')
            .then((val) => {
                cmsId = val.toString().valueOf()
                TestData.writeFixture('cmsId', cmsId)
            })
        cy.log('CMS ID Generated successfully')

        OktaLogin.UILogout()
    })

    after('Log out and Clean up', () => {
        Utilities.deleteMeasure()
    })

    // Keep the non-owner authorization check before the successful delete because
    // the admin path removes the shared CMS ID created in the suite setup.
    it('Verify Error Message when Non Measure Owner tries to delete CMS ID', () => {
        OktaLogin.setupUserSession(false)

        TestData.readMeasureId().then((measureId) => {
            TestData.readFixture('cmsId').then((cmsId) => {
                TestData.requestWithAccessToken({
                    url: `/api/admin/measures/${measureId}/delete-cms-id?cmsId=${cmsId}`,
                    method: 'DELETE',
                    failOnStatusCode: false,
                    headers: {
                        harpId: harpUserALT
                    }
                }).then((response) => {
                    expect(response.status).to.eql(403)
                    expect(response.body).to.eql('Forbidden: Invalid user role')
                })
            })
        })
    })

    it('Verify that the CMS ID deleted successfully for QDM Measure', () => {
        OktaLogin.setupAdminSession()

        TestData.readMeasureId().then((measureId) => {
            TestData.readFixture('cmsId').then((cmsId) => {
                TestData.readMeasureSetId().then((measureSetId) => {
                    TestData.requestWithAccessToken({
                        url: `/api/admin/measures/${measureId}/delete-cms-id?cmsId=${cmsId}`,
                        method: 'DELETE',
                        headers: {
                            harpId: harpUser
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql(
                            `CMS id of ${cmsId} was deleted successfully from measure set with measure set id of ${measureSetId}`
                        )
                    })
                })
            })
        })
    })
})
