import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { Environment } from "../../../Shared/Environment"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from "../../../Shared/OktaLogin"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let updatedMeasureName = ''
let updatedCQLLibraryName = ''
const harpUser = Environment.credentials().harpUserALT
const measureCQL = MeasureCQL.SBTEST_CQL
const model = 'QI-Core v4.1.1'
const versionIdPath = 'cypress/fixtures/versionId'

const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')

describe('Measure Service: Edit Measure', () => {

    updatedMeasureName = measureName + 1 + randValue
    updatedCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        cy.setAccessTokenCookie()

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(updatedMeasureName, updatedCQLLibraryName)

    })

    it('Update Measure details', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": id,
                            "measureName": updatedMeasureName,
                            "cqlLibraryName": updatedCQLLibraryName,
                            "model": model,
                            "version": "0.0.000",
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureMetaData": { "experimental": false, "draft": true },
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
                            "improvementNotationDescription": null,
                            "measureSetId": uuidv4()
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        cy.log('Measure updated successfully')
                    })
                })
            })
        })
    })

    it('Verify Supplemental Data Elements and Risk Adjustment Variables are added to Update Measure Model', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": id,
                            "measureName": updatedMeasureName,
                            "cqlLibraryName": updatedCQLLibraryName,
                            "model": model,
                            "version": "0.0.000",
                            "measureScoring": "Ratio",
                            "measureMetaData": { "experimental": false, "draft": true },
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
                            "improvementNotationDescription": null,
                            "versionId": vId,
                            "measureSetId": uuidv4(),
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
                        expect(response.status).to.eql(200)
                        expect(response.body.supplementalData[0].definition).to.eql('supplementalDataDefinition')
                        expect(response.body.supplementalData[0].description).to.eql('supplementalDataDescription')
                        expect(response.body.supplementalData[1].definition).to.eql('supplementalDataDefinition2')
                        expect(response.body.supplementalData[1].description).to.eql('supplementalDataDescription2')
                        expect(response.body.riskAdjustments[0].definition).to.eql('riskAdjustmentDefinition')
                        expect(response.body.riskAdjustments[0].description).to.eql('riskAdjustmentDescription')
                        expect(response.body.riskAdjustments[1].definition).to.eql('riskAdjustmentDefinition2')
                        expect(response.body.riskAdjustments[1].description).to.eql('riskAdjustmentDescription2')
                        cy.log('Measure updated successfully')
                    })
                })
            })
        })
    })

    it('Save CQL to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
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
                            "improvementNotationDescription": null,
                            'measureSetId': uuidv4(),
                            "measureMetaData": { "experimental": false, "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Measure Steward to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': {
                                "experimental": false,
                                "steward": {
                                    "name": "SemanticBits",
                                    "id": "64120f265de35122e68dac40",
                                    "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                                    "url": "https://semanticbits.com/"
                                }, "draft": true
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
                    })
                })
            })
        })
    })

    it('Add Meta Data Description to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "description": "SemanticBits", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Copyright to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "copyright": "copyright", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Disclaimer to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "disclaimer": "disclaimer", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Rationale to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "rationale": "rationale", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Author to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "author": "author", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Guidance to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "guidance": "guidance", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Risk Adjustment to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
                            'riskAdjustmentDescription': "desc",
                            'riskAdjustments': [{ 'definition': "SDE Payer" }]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
                            'riskAdjustmentDescription': "desc",
                            'riskAdjustments': [{ 'definition': "" }]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
                            'riskAdjustmentDescription': "desc",
                            'riskAdjustments': [{ 'definition': null }]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Endorser Fields to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': {
                                "experimental": false,
                                "endorsements": [
                                    {
                                        "endorser": "NQF",
                                        "endorserSystemId": "78888",
                                        "endorsementId": "1234"
                                    }
                                ]
                            }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.measureMetaData.endorsements[0].endorser).to.eql('NQF')
                        expect(response.body.measureMetaData.endorsements[0].endorserSystemId).to.eql('78888')
                        expect(response.body.measureMetaData.endorsements[0].endorsementId).to.eql('1234')
                    })
                })
            })
        })
    })

    it('Add scoring precision value to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            'measureMetaData': {
                                "experimental": false,
                                "endorsements": [
                                    {
                                        "endorser": "NQF",
                                        "endorserSystemId": "78888",
                                        "endorsementId": "1234"
                                    }
                                ]
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
                            "improvementNotationDescription": null,
                            "scoringPrecision": 2
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Intended Venue to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": id,
                            "measureName": updatedMeasureName,
                            "cqlLibraryName": updatedCQLLibraryName,
                            "model": model,
                            "version": "0.0.000",
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureMetaData": {
                                "experimental": false,
                                "draft": true,
                                "intendedVenue": {
                                    "code": "eh",
                                    "codeSystem": "http://hl7.org/fhir/us/cqfmeasures/CodeSystem/intended-venue-codes",
                                    "display": "EH"
                                }
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
                            "improvementNotationDescription": null,
                            "measureSetId": uuidv4(),
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.measureMetaData.intendedVenue.code).to.eql('eh')
                        cy.log('Measure updated successfully')
                    })
                })
            })
        })
    })

    it('Add Purpose to the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "purpose": "reason for the measure to be made", "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.measureMetaData.purpose).to.eql('reason for the measure to be made')
                    })
                })
            })
        })
    })
})

describe('Measure Service: Attempt to add RA when user is not owner of measure', () => {

    updatedMeasureName = measureName + 1 + randValue
    updatedCQLLibraryName = cqlLibraryName + 1 + randValue

    beforeEach('Create Measure and Set Access Token', () => {

        //Create Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName + '2', cqlLibraryName + '2', measureCQL)

    })

    it('Attempt to add Meta Data Risk Adjustment to the measure, when the user is not the owner', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.AltLogin()
        //set local user that does not own the measure
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'measureMetaData': { "experimental": false, "riskAdjustment": "Risk Adjustment", "draft": true },
                            'riskAdjustmentDescription': "desc",
                            'riskAdjustments': [{ 'definition': "SDE Payer" }]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.include('User ' + harpUser + ' is not authorized for Measure with ID ' + id)
                    })
                })
            })
        })
    })
})

describe('Edit Measure Validations', () => {

    updatedMeasureName = measureName + 2 + randValue
    updatedCQLLibraryName = cqlLibraryName + 2 + randValue

    beforeEach('Create Measure ans Set Access token', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)

    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Verify error message when the measure name is empty', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                //Verify error message when the measure name is empty
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': "",
                        'cqlLibraryName': updatedCQLLibraryName,
                        'model': model,
                        "version": "0.0.000",
                        'measureScoring': 'Ratio',
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
                        "improvementNotationDescription": null,
                        'cql': measureCQL
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.measureName).to.eql('Measure Name is required.')
                })
            })
        })
    })

    it('Verify error message when the measure name does not contain at least 1 letter', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': '12343456456',
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            "ecqmTitle": "eCQMTitle",
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                            "improvementNotationDescription": null,
                            'cql': measureCQL
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.validationErrors.measureName).to.eql('A measure name must contain at least one letter.')
                    })
                })
            })
        })
    })

    it('Verify error message when the measure name contains underscore', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'Test_Measure',
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                        expect(response.status).to.eql(400)
                        expect(response.body.validationErrors.measureName).to.eql('Measure Name can not contain underscores.')
                    })
                })
            })
        })
    })

    it('Verify error message when the measure name is over 500 characters', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
                                'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
                                'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
                                'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
                                'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwqwertyqwertyqwertyqwertyqwertyq',
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'measureScoring': 'Ratio',
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            'versionId': vId,
                            'measureSetId': uuidv4(),
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
                        expect(response.status).to.eql(400)
                        expect(response.body.validationErrors.measureName).to.eql('Measure Name can not be more than 500 characters.')
                    })
                })
            })
        })
    })
})

describe('Measurement Period Validations', () => {

    updatedMeasureName = measureName + 3 + randValue
    updatedCQLLibraryName = cqlLibraryName + 3 + randValue

    beforeEach('Create Measure', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(updatedMeasureName, updatedCQLLibraryName)

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            "measurementPeriodStart": mpEndDate,
                            "measurementPeriodEnd": mpStartDate,
                            'measureScoring': 'Ratio',
                            "measureMetaData": { "experimental": false, "draft": true }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('Measurement period end date should be greater than measurement period start date.')
                    })
                })
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            "measurementPeriodStart": "",
                            "measurementPeriodEnd": "",
                            'measureScoring': 'Ratio'
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('Measurement period date is required and must be valid')
                    })
                })
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': updatedMeasureName,
                            'cqlLibraryName': updatedCQLLibraryName,
                            'model': model,
                            "version": "0.0.000",
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            "measurementPeriodStart": "1823-01-01T05:00:00.000+0000",
                            "measurementPeriodEnd": "3023-01-01T05:00:00.000+0000",
                            'measureScoring': 'Ratio'
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('Measurement periods should be between the years 1900 and 2099.')
                    })
                })
            })
        })

    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': updatedMeasureName,
                        'cqlLibraryName': updatedCQLLibraryName,
                        'model': model,
                        "version": "0.0.000",
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
                        "improvementNotationDescription": null,
                        'cql': measureCQL,
                        'measureScoring': 'Ratio'
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.error).to.eql("Bad Request")
                })
            })
        })
    })
})

