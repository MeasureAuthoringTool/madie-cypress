import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"


let newMeasureName = ''
let newCQLLibraryName = ''

let qdmMeasureCQLVm = MeasureCQL.CQLQDMObservationRun

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = 'TestMeasure' + Date.now() + randValue
let cqlLibraryName = 'TestCql' + Date.now() + randValue
let measureCQL = MeasureCQL.SBTEST_CQL
let qdmMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

describe('Measure Service: View Human Readable for Qi Core Draft Measure', () => {

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

describe('Measure Service: View Human Readable for Versioned Qi Core Measure', () => {

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

describe('Measure Service: View Human Readable for Draft QDM Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('View Measure Human Readable for QDM Draft Measure', () => {

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

describe('Measure Service: View Human readable for Versioned QDM Measure', () => {

    newMeasureName = measureName + 1 + randValue
    newCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCQLLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLVm

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    afterEach('Clean up', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)
    })

    //MAT-8548
    it('Successful export of a versioned QDM Measure', () => {

        //version measure
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
                    expect(response.body.version).to.eql('1.0.000')
                })
            })
        })

        //export measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/humanreadable/' + id,
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                    expect(response.body).is.not.null
                    expect(response.body).contains('<html')
                })
            })
        })
    })
})

describe('Measure Service: Verify error message when there is no Population Criteria for QDM Measure', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Verify error message when there is no Population Criteria for QDM Measure', () => {

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
                    expect(response.body.message).to.eql('Response could not be completed for Measure with ID ' + id + ', since there is no population criteria on the measure.')
                })
            })
        })
    })
})