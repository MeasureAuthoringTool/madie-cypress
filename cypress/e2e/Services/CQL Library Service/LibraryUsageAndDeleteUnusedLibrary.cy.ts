import {Environment} from "../../../Shared/Environment"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"
import {MeasureCQL} from "../../../Shared/MeasureCQL"

let deleteMeasureAdminAPIKey = Environment.credentials().deleteMeasureAdmin_API_Key
let CQLLibraryName = 'TestCqlLibrary' + Date.now()
let CQLLibraryPublisher = 'SemanticBits'
let libraryCQL = MeasureCQL.ICFCleanTestQICore

describe('Verify Library usage and Delete Library', () => {

    before('Create CQL Library', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create CQL Library
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher, false, false, libraryCQL)
    })

    beforeEach('Set Access token', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    it('Verify Library usage within other CQL Library', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries/usage?libraryName=MATGlobalCommonFunctionsQDM',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(200)

                let i= 1
                let pass = 'false'
                while (i < 97) {
                    if( response.body[i].name == 'QDMSmokeTestLibrary0228') {
                        pass = 'true'
                        break
                    }
                    else {
                        i++
                    }
                }
                expect(pass).to.eql('true')
            })
        })
    })

    it('Verify Library usage within the Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures/library/usage?libraryName=MATGlobalCommonFunctionsQDM',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body[0].name).to.eql('MyCMS826')
            })
        })
    })

    it('Verify Library can not be deleted if used within another Library or Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: 'api/cql-libraries/FHIRHelpers/delete-all-versions',
                method: 'DELETE',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': deleteMeasureAdminAPIKey
                }
            }).then((response) => {
                expect(response.status).to.eql(409)
                expect(response.body.message).to.eql('Library is being used actively, hence can not be deleted.')
            })
        })
    })

    it('Verify Library can be deleted if not used within another Library or Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: 'api/cql-libraries/' + CQLLibraryName + '/delete-all-versions',
                method: 'DELETE',
                headers: {
                    authorization: 'Bearer ' + accessToken.value,
                    'api-key': deleteMeasureAdminAPIKey
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.eql('The library and all its associated versions have been removed successfully.')
            })
        })
    })
})
