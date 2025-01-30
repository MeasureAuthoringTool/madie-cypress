import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCQLLibraryName = ''

let measureCQL = MeasureCQL.CQLQDMObservationRun

describe('Measure Versioning', () => {

    newMeasureName = measureName + 1 + randValue
    newCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', false, measureCQL)
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

    it('Successful QDM Measure Export', () => {

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