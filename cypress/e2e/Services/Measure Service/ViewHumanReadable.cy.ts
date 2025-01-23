import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {Utilities} from "../../../Shared/Utilities"
import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = 'TestMeasure' + Date.now() + randValue
let cqlLibraryName = 'TestCql' + Date.now() + randValue
let measureCQL = MeasureCQL.SBTEST_CQL
let qdmMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

describe('Measure Service: View Human Readable for Draft Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('View Measure Human Readable for Qi Core Draft Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).not.empty
                })
            })
        })
    })
})

describe('Measure Service: View Human Readable for Versioned Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp', 'boolean')
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)

    })

    it('View Measure Human Readable for Qi Core Versioned Measure', () => {

        //Version Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.include('1.0.000')
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).not.empty
                })
            })
        })
    })
})

describe('Measure Service: Error message for QDM Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryName, 'Cohort', true, qdmMeasureCQL)
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Verify error message while viewing Human Readable for QDM Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/humanreadable/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET'
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Factory cms.gov.madie.measure.services.HumanReadableService unable to create the requested instance as the following are not yet support: [QDM v5.6]')
                })
            })
        })
    })
})