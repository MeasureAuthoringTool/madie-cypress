import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"

const timestamp = Date.now()
const qicoreMeasureName = 'QICoreTranslatorVersion' + timestamp
const qicoreCqlLibraryName = 'QiCoreTranslatorVersionLibrary' + timestamp
const qicoreMeasureCQL = MeasureCQL.SBTEST_CQL
const qdmMeasureName = 'QDMTranslatorVersion' + timestamp
const qdmCqlLibraryName = 'QDMTranslatorVersionLibrary' + timestamp
const qdmMeasureCQL = MeasureCQL.QDMSimpleCQL
const now = require('dayjs')
const mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
const mpEndDate = now().format('YYYY-MM-DD')

const expectedQiCoreVersion = '3.25.0'
const expectedQdmVersion = '3.25.0'
const measureData: CreateMeasureOptions = {}

describe('Measure Service: Translator Version for QI-Core Measure', () => {


    beforeEach('Create QI-Core Measure and Set Access Token', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(qicoreMeasureName, qicoreCqlLibraryName, qicoreMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.log('Updated CQL name, on measure, is ' + qicoreCqlLibraryName)
        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
        cy.setAccessTokenCookie()

    })

    after('Delete Versioned Measure', () => {

        Utilities.deleteVersionedMeasure(qicoreCqlLibraryName, qicoreCqlLibraryName)
    })


    it('Get Translator version for QI-Core Measure', () => {

        //Get Translator Version for Draft Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/fhir/translator-version?draft=true',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                    body: {
                        "id": id,
                        "measureName": qicoreMeasureName,
                        "cqlLibraryName": qicoreCqlLibraryName,
                        "model": 'QI-Core v4.1.1',
                        "version": "0.0.000",
                        "measureScoring": "Ratio",
                        "measureMetaData": { "experimental": false, "draft": true },
                        "measureSetId": uuidv4(),
                        "ecqmTitle": "ecqmTitle",
                        "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                        "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(expectedQiCoreVersion)
                })
            })
        })

        //Version QI Core Measure
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
        //Verify Translator version for Versioned Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/fhir/translator-version?draft=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                    body: {
                        "id": id,
                        "measureName": qicoreMeasureName,
                        "cqlLibraryName": qicoreCqlLibraryName,
                        "model": 'QI-Core v4.1.1',
                        "version": "1.0.000",
                        "measureScoring": "Ratio",
                        "measureMetaData": { "experimental": false, "draft": false },
                        "measureSetId": uuidv4(),
                        "ecqmTitle": "ecqmTitle",
                        "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                        "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(expectedQiCoreVersion)
                })
            })
        })
    })
})

describe('Measure Service: Translator Version for QDM Measure', () => {

    beforeEach('Create QDM Measure and Set Access Token', () => {

        measureData.ecqmTitle = qdmMeasureName
        measureData.cqlLibraryName = qdmCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        cy.setAccessTokenCookie()

    })

    after('Delete Versioned Measure', () => {

        Utilities.deleteVersionedMeasure(qdmMeasureName, qdmCqlLibraryName)
    })


    it('Get Translator version for QDM Measure', () => {

        //Get Translator Version for Draft Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/qdm/translator-version?draft=true',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                    body: {
                        "id": id,
                        "measureName": qdmMeasureName,
                        "cqlLibraryName": qdmCqlLibraryName,
                        "model": 'QDM v5.6',
                        "version": "0.0.000",
                        "measureScoring": "Cohort",
                        "measureMetaData": { "experimental": false, "draft": true },
                        "measureSetId": uuidv4(),
                        "ecqmTitle": "ecqmTitle",
                        "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                        "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(expectedQdmVersion)
                })
            })
        })

        //Version QDM Measure
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

        //Verify Translator version for Versioned Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/qdm/translator-version?draft=false',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                    body: {
                        "id": id,
                        "measureName": qdmMeasureName,
                        "cqlLibraryName": qdmCqlLibraryName,
                        "model": 'QDM v5.6',
                        "version": "1.0.000",
                        "measureScoring": "Cohort",
                        "measureMetaData": { "experimental": false, "draft": false },
                        "measureSetId": uuidv4(),
                        "ecqmTitle": "ecqmTitle",
                        "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                        "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql(expectedQdmVersion)
                })
            })
        })
    })
})