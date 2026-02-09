import { Utilities } from "../../../Shared/Utilities"
import { v4 as uuidv4 } from 'uuid'
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { QdmCql } from "../../../Shared/QDMMeasuresCQL"
const now = require('dayjs')
const mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
const mpEndDate = now().format('YYYY-MM-DD')
const eCQMTitle = 'eCQMTitle'
const QDMModel = 'QDM v5.6'
const cql = QdmCql.qdmCQLPatientBasedTest

let measureName = ''
let CQLLibraryName = ''
let harpUser = ''

describe('Measure Service: QDM Measure', () => {

    beforeEach('Set Access Token', () => {

        harpUser = OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Create QDM Measure, successful creation', () => {

        measureName = 'SuccessQDMCreate' + Date.now()
        CQLLibraryName = 'SuccessQDMCreateLib' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": QDMModel,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "measureScoring": "Cohort",
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate,
                    "rateAggregation": "Aggregation",
                    "improvementNotation": "Increased score indicates improvement",
                    "improvementNotationDescription": "This is a description for when the IN is set to \"Increased score indicates improvement\"",
                    "testCaseConfiguration": {
                        "id": null,
                        "sdeIncluded": null
                    },
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)

                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                expect(response.body.rateAggregation).to.eql('Aggregation')
                expect(response.body.improvementNotation).to.eql('Increased score indicates improvement')
                expect(response.body.improvementNotationDescription).to.eql('This is a description for when the IN is set to \"Increased score indicates improvement\"')
            })

        })
    })

    it('Base Configuration fields - QDM Measure', () => {

        measureName = 'BaseConfigCreation' + Date.now()
        CQLLibraryName = 'BaseConfigCreationLib' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": QDMModel,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "measureScoring": "Cohort",
                    "baseConfigurationTypes": [
                        "Efficiency",
                        "Outcome",
                        "Process"
                    ],
                    "patientBasis": true,
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate,
                    "testCaseConfiguration": {
                        "id": null,
                        "sdeIncluded": null
                    },
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)

                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                expect(response.body.baseConfigurationTypes[0]).to.eql('Efficiency')
                expect(response.body.baseConfigurationTypes[1]).to.eql('Outcome')
                expect(response.body.baseConfigurationTypes[2]).to.eql('Process')
                expect(response.body.patientBasis).to.eql(true)
            })
        })
    })

    it('Verify Supplemental Data Elements and Risk Adjustment Variables are added to create Measure Model - QDM', () => {

        measureName = 'QdmSdeRav' + Date.now()
        CQLLibraryName = 'QdmSdeRavLib' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": QDMModel,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate,
                    "testCaseConfiguration": {
                        "id": null,
                        "sdeIncluded": null
                    },
                    "supplementalData": [
                        {
                            "definition": "supplementalDataDefinition",
                            "description": "supplementalDataDescription"
                        },
                        {
                            "definition": "supplementalDataDefinition2",
                            "description": "supplementalDataDescription2"
                        }
                    ],
                    "riskAdjustments": [
                        {
                            "definition": "riskAdjustmentDefinition",
                            "description": "riskAdjustmentDescription"
                        },
                        {
                            "definition": "riskAdjustmentDefinition2",
                            "description": "riskAdjustmentDescription2"
                        }
                    ]
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)

                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                expect(response.body.supplementalData[0].definition).to.eql('supplementalDataDefinition')
                expect(response.body.supplementalData[0].description).to.eql('supplementalDataDescription')
                expect(response.body.supplementalData[1].definition).to.eql('supplementalDataDefinition2')
                expect(response.body.supplementalData[1].description).to.eql('supplementalDataDescription2')
                expect(response.body.riskAdjustments[0].definition).to.eql('riskAdjustmentDefinition')
                expect(response.body.riskAdjustments[0].description).to.eql('riskAdjustmentDescription')
                expect(response.body.riskAdjustments[1].definition).to.eql('riskAdjustmentDefinition2')
                expect(response.body.riskAdjustments[1].description).to.eql('riskAdjustmentDescription2')
            })
        })
    })
})

describe('QDM Measure: Transmission format', () => {

    measureName = 'QDMTransmissionFormat' + Date.now()
    CQLLibraryName = 'QDMTransmissionFormatLib' + Date.now()

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CQLLibraryName, cql)
        OktaLogin.setupUserSession(false)
    })

    afterEach('Delete Measure', () => {

        Utilities.deleteMeasure()
    })

    it('Add Transmission format to the QDM Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/versionId').should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": id,
                            "measureName": measureName,
                            "cqlLibraryName": CQLLibraryName,
                            "model": QDMModel,
                            "cql": cql,
                            "version": "0.0.000",
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "measureMetaData": { 
                                "experimental": false, 
                                "draft": true, 
                                "transmissionFormat": "Test Transmission format"
                            },
                            "reviewMetaData": {
                                "approvalDate": null,
                                "lastReviewDate": null
                            },
                            "measureSet": {
                                "id": "68ac804018f2135a1f3a17d3",
                                "cmsId": null,
                                "measureSetId": "db336d58-3f9c-407f-88f6-890cec960a83",
                                "owner": "test.ReUser6408",
                                "acls": null
                            },
                            "ecqmTitle": "ecqmTitle",
                            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z",
                            "testCaseConfiguration": {
                                "id": null,
                                "sdeIncluded": null
                            },
                            "scoring": null,
                            "baseConfigurationTypes": null,
                            "patientBasis": true,
                            "rateAggregation": null,
                            "improvementNotation": null,
                            "improvementNotationDescription": null
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.measureMetaData.transmissionFormat).to.eql('Test Transmission format')

                        cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                        cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                        cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
                    })
                })
            })
        })
    })
})
