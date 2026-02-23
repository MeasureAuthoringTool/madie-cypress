import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
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

const expectedQiCoreVersion = '4.2.0'
const expectedQdmVersion = '3.29.0'
const measureData: CreateMeasureOptions = {}

describe('Measure Service: Translator Version for QI-Core Measure', () => {

    beforeEach('Create QI-Core Measure and Set Access Token', () => {

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
    })

    after('Delete Versioned Measure', () => {

        Utilities.deleteVersionedMeasure(qicoreCqlLibraryName, qicoreCqlLibraryName)
    })

    it('Get Translator version for QI-Core Measure', () => {
        const currentUser = Cypress.env('selectedUser')
        //Get Translator Version for Draft Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureSetId').should('exist').then((measureSetId) => {

                    cy.request({
                        url: '/api/fhir/translator-version?draft=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql(expectedQiCoreVersion)
                    })

                    //Version QI Core Measure
                    cy.request({
                        url: '/api/measures/' + id + '/version?versionType=major',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.version).to.include('1.0.000')
                        // versioned measures read translator version from ELM
                        expect(response.body.elmJson).to.include('"translatorVersion\":\"' + expectedQiCoreVersion +'\"')
                    })
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
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Delete Versioned Measure', () => {

        Utilities.deleteVersionedMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Get Translator version for QDM Measure', () => {
        const currentUser = Cypress.env('selectedUser')
        //Get Translator Version for Draft Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/measureSetId').should('exist').then((measureSetId) => {

                    cy.request({
                        url: '/api/qdm/translator-version?draft=true',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql(expectedQdmVersion)
                    })

                    //Version QDM Measure
                    cy.request({
                        url: '/api/measures/' + id + '/version?versionType=major',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.version).to.include('1.0.000')
                        // versioned measures read translator version from ELM
                        expect(response.body.elmJson).to.include('"translatorVersion" : "' + expectedQdmVersion + '"')
                    })
                })
            })
        })
    })
})