import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { TestData } from "../../../Shared/TestData"

const measureName = 'MeasureGroupService' + Date.now()
const cqlLibraryName = 'MeasureGroupServiceLib' + Date.now()
const measureScoring = 'Cohort'
const booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

describe('Validations: Population Criteria: Return Types -- Boolean', () => {

    beforeEach('Create Measure and save CQL, in the UI', () => {

        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let newMeasureName = measureName + randValue + Date.now()
        let newCqlLibraryName = cqlLibraryName + randValue + Date.now()

        OktaLogin.setupUserSession(false)

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        TestData.saveMeasureCql(`${booleanPatientBasisQDM_CQL}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
        })
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Attempt to use a non-boolean population critieria value for a patient basis that expecting boolean', () => {
        let currentUser = Cypress.env('selectedUser')
        //attempt create group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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

describe('Validations: Population Criteria: Return Types -- Non-Boolean', () => {

    beforeEach('Create Measure and save CQL, in the UI', () => {

        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let newMeasureName = measureName + randValue + Date.now()
        let newCqlLibraryName = cqlLibraryName + randValue + Date.now()

        OktaLogin.setupUserSession(false)

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'false'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        TestData.saveMeasureCql(`${booleanPatientBasisQDM_CQL}\n`).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.elmJson).to.be.a('string').and.not.be.empty
        })
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Attempt to use a boolean population critieria value for a patient basis that expecting non-boolean', () => {
        let currentUser = Cypress.env('selectedUser')
        //attempt create group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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
