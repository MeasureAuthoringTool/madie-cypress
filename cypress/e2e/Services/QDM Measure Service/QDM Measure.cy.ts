import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"

let measureName = ''
let CQLLibraryName = ''
let QDMModel = 'QDM v5.6'
let harpUser = ''
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let eCQMTitle = 'eCQMTitle'
let randValue = (Math.floor((Math.random() * 1000) + 1))

describe('Measure Service: QDM Measure', () => {

    beforeEach('Set Access Token', () => {

        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        harpUser = OktaLogin.setupUserSession(false, currentUser, currentAltUser)
    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName)

    })

    it('Create QDM Measure, successful creation', () => {

        measureName = 'QDMMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue

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
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
                expect(response.body.rateAggregation).to.eql('Aggregation')
                expect(response.body.improvementNotation).to.eql('Increased score indicates improvement')
                expect(response.body.improvementNotationDescription).to.eql('This is a description for when the IN is set to \"Increased score indicates improvement\"')
            })

        })
    })

    it('Base Configuration fields - QDM Measure', () => {

        measureName = 'QDMMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue

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
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
                expect(response.body.baseConfigurationTypes[0]).to.eql('Efficiency')
                expect(response.body.baseConfigurationTypes[1]).to.eql('Outcome')
                expect(response.body.baseConfigurationTypes[2]).to.eql('Process')
                expect(response.body.patientBasis).to.eql(true)
            })

        })
    })

    it('Verify Supplemental Data Elements and Risk Adjustment Variables are added to create Measure Model - QDM', () => {

        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue

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
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
            })

        })

    })
})

describe('QDM Measure: Transmission format', () => {

    measureName = 'QDMMeasure' + Date.now() + randValue
    CQLLibraryName = 'TestCql' + Date.now() + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CQLLibraryName)
        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false, currentUser, currentAltUser)
    })

    afterEach('Delete Measure', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName)
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
                            "version": "0.0.000",
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "measureMetaData": { "experimental": false, "draft": true, "transmissionFormat": "Test Transmission format" },
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
                        cy.log('Transmission Format added successfully')
                    })
                })
            })
        })
    })
})
