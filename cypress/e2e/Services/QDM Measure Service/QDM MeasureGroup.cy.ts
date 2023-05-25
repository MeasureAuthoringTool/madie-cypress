import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Cohort'
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

describe('Test Case invalid population criteria value CQL and patient basis', () => {
    beforeEach('Create Measure and save CQL, in the UI', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryName, measureScoring, true, booleanPatientBasisQDM_CQL, false, false)

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.setAccessTokenCookie()
    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Attempt to use a non-boolean population critieria value for a patient basis that expecting boolean', () => {
        //attempt create group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": "Cohort",
                        "populationBasis": "true",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": "Bilateral Mastectomy Diagnosis",
                                "associationType": null,
                                "description": ""
                            }
                        ],
                        "measureObservations": null,
                        "groupDescription": "",
                        "improvementNotation": "",
                        "rateAggregation": "",
                        "measureGroupTypes": null,
                        "scoringUnit": "",
                        "stratifications": [],
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('For Patient-based Measures, selected definitions must return a Boolean.')
                })
            })
        })
    })
})

describe('Test Case invalid population criteria value CQL and patient basis', () => {
    beforeEach('Create Measure and save CQL, in the UI', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryName, measureScoring, false, booleanPatientBasisQDM_CQL, false, false)

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.setAccessTokenCookie()
    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Attempt to use a boolean population critieria value for a patient basis that expecting non-boolean', () => {
        //attempt create group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": "Cohort",
                        "populationBasis": "true",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": "Initial Population",
                                "associationType": null,
                                "description": ""
                            }
                        ],
                        "measureObservations": null,
                        "groupDescription": "",
                        "improvementNotation": "",
                        "rateAggregation": "",
                        "measureGroupTypes": null,
                        "scoringUnit": "",
                        "stratifications": [],
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('For Episode-based Measures, selected definitions must return a list of the same type (Non-Boolean).')
                })
            })
        })
    })
})