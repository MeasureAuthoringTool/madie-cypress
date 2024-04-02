import { Utilities } from "../../../Shared/Utilities"
import { Environment } from "../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"

let measureName = ''
let CQLLibraryName = ''
let QDMModel = 'QDM v5.6'
let harpUser = Environment.credentials().harpUser
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let eCQMTitle = 'eCQMTitle'
let randValue = (Math.floor((Math.random() * 1000) + 1))

describe('Measure Service: QDM Measure', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
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
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
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
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
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
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
            })

        })

    })
})

describe('QDM Measure: Transmission format', () => {

    measureName = 'QDMMeasure' + Date.now() + randValue
    CQLLibraryName = 'TestCql' + Date.now() + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CQLLibraryName)
        cy.setAccessTokenCookie()
    })

    afterEach('Delete Measure', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName)
    })

    it('Add Transmission format to the QDM Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((vId) => {
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
                            "measureMetaData": { "draft": true, "transmissionFormat": "Test Transmission format" },
                            "measureSetId": uuidv4(),
                            "ecqmTitle": "ecqmTitle",
                            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z",
                            "testCaseConfiguration": {
                                "id": null,
                                "sdeIncluded": null
                            },
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
