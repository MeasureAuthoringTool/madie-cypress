import { Environment } from "../../../Shared/Environment"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"

let adminApiKey = Environment.credentials().adminApiKey
let CQLLibraryName = 'TestCqlLibrary' + Date.now()
let CQLLibraryPublisher = 'SemanticBits'
let libraryCQL = MeasureCQL.ICFCleanTestQICore
let harpUser = ''

describe('Verify Library usage and Delete Library', () => {

    before('Create CQL Library', () => {

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher, false, false, libraryCQL)
    })

    beforeEach('Set Access token', () => {

        harpUser = OktaLogin.setupUserSession(false)
    })

    // last test deletes as part of its process, no need for after()

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

                type responseObject = {
                    name: string,
                    owner: string,
                    version: object
                }
                let libraryPresent = false

                const responses = response.body as Array<responseObject>
                responses.forEach(library => {
                    if(  library.name == 'PBDPalliativeCareQDM' ) {
                        libraryPresent = true
                    }
                })
                expect(libraryPresent).to.be.true
            })
        })
    })

    it('Verify Library usage within the Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures/library/usage?libraryName=AlaraCommonFunctions',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body[0].name).to.include('Excessive Radiation Dose or Inadequate Image Quality for Diagnostic Computed Tomography in Adults')
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
                    'api-key': adminApiKey,
                    'harpId': harpUser
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
                    'api-key': adminApiKey,
                    'harpId': harpUser
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.eql('The library and all its associated versions have been removed successfully.')
            })
        })
    })
})
