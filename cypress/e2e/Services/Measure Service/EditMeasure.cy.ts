import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = measureName + randValue
let newCQLLibraryName = cqlLibraryName + randValue
let measureCQL = MeasureCQL.SBTEST_CQL
let model = 'QI-Core v4.1.1'
let versionIdPath = 'cypress/fixtures/versionId'

const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')

describe('Measure Service: Edit Measure', () => {

    before('Create Measure', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Update Measure details', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": id,
                            "measureName": 'UpdatedTestMeasure' + randValue,
                            "cqlLibraryName": 'UpdatedCqlLibrary' + randValue,
                            "model": model,
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "ecqmTitle": "ecqmTitle",
                            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql('Measure updated successfully.')
                    })
                })
            })
        })
    })

    it('Verify error message when the measure name is empty', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': model,
                        'measureScoring': 'Ratio',
                        "ecqmTitle": "eCQMTitle",
                        'cql': measureCQL,
                        "measurementPeriodStart": mpStartDate,
                        "measurementPeriodEnd": mpEndDate
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.measureName).to.eql('Measure Name is required.')
                })
            })
        })
    })

    it('Verify error message when the measure name does not contain at least 1 letter', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            "ecqmTitle": "eCQMTitle",
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            'cql': measureCQL,
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.validationErrors.measureName).to.eql('Measure Name can not be more than 500 characters.')
                    })
                })
            })
        })
    })

    it('Save CQL to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            'ecqmTitle': "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Measure Steward to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "measureSteward": "SemanticBits" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Description to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "description": "SemanticBits" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Copyright to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "copyright": "copyright" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Disclaimer to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "disclaimer": "disclaimer" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Rationale to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "rationale": "rationale" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Author to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "author": "author" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Guidance to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "guidance": "guidance" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })

    it('Add Meta Data Risk Adjustment to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': id,
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'measureScoring': 'Ratio',
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measurementPeriodStart": mpStartDate,
                            "measurementPeriodEnd": mpEndDate,
                            'measureMetaData': { "riskAdjustment": "Risk Adjustment" }
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                    })
                })
            })
        })
    })
})

describe('Measurement Period Validations', () => {

    before('Create Measure', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = cqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName)

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
                            'versionId': vId,
                            'measureSetId': uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            'cql': measureCQL,
                            "measurementPeriodStart": mpEndDate,
                            "measurementPeriodEnd": mpStartDate,
                            'measureScoring': 'Ratio'
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                            'measureName': 'UpdatedTestMeasure' + Date.now(),
                            'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                            'model': model,
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': model,
                        "ecqmTitle": "eCQMTitle",
                        'cql': measureCQL,
                        "measurementPeriodStart": "01/01/2021",
                        "measurementPeriodEnd": "01/01/2023",
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

describe('Validate CMS ID', () => {

    before('Set Access Token and create Measure', () => {

        cy.setAccessTokenCookie()

        //Create Measure with CMS ID
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(versionIdPath).should('exist').then((vId) => {
                cy.request({
                    url: '/api/measure',
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "measureName": measureName,
                        "cqlLibraryName": cqlLibraryName,
                        "model": model,
                        "versionId": vId,
                        "measureSetId": uuidv4(),
                        "cmsId": "99999",
                        "ecqmTitle": "eCQMTitle",
                        "measurementPeriodStart": mpStartDate,
                        "measurementPeriodEnd": mpEndDate
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    cy.writeFile('cypress/fixtures/measureId', response.body.id)
                    cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                })
            })
        })
    })

    after('Clean up', () => {

        cy.setAccessTokenCookie()

        //Delete Measure with CMS ID
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "id": id, "measureName": measureName, "cqlLibraryName": cqlLibraryName, "ecqmTitle": "ecqmTitle", "cmsId": "99999",
                            "model": 'QI-Core v4.1.1', "measurementPeriodStart": mpStartDate, "measurementPeriodEnd": mpEndDate, "active": false, 'versionId': vId, 'measureSetId': uuidv4()
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body).to.eql("Measure updated successfully.")
                    })
                })
            })
        })

    })

    it('Validate error message while editing CMS ID', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            "id": id,
                            "measureName": 'UpdatedTestMeasure' + randValue,
                            "cqlLibraryName": 'UpdatedCqlLibrary' + randValue,
                            "model": model,
                            "measureScoring": "Ratio",
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "cmsId": "55555",
                            "ecqmTitle": "ecqmTitle",
                            "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                            "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.message).to.eql('Invalid CMS ID: 55555, CMS ID is readonly')
                    })
                })
            })
        })
    })
})
