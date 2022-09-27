import {Environment} from "../../../../Shared/Environment"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {LandingPage} from "../../../../Shared/LandingPage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"

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
        OktaLogin.Logout()
    })

    it('Verify shared Measure is viewable under My Measures tab', () => {

        //Share Measure with ALT User
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

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(LandingPage.myMeasuresTab).click()
        cy.get(MeasuresPage.measureListTitles).should('contain', measureName)

    })
})