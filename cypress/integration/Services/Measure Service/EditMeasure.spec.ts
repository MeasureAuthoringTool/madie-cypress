import {Utilities} from "../../../Shared/Utilities"

export {}
let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = measureName + randValue
let newCQLLibraryName = cqlLibraryName + randValue

describe('Measure Service: Edit Measure', () => {

    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': measureName,
                    'cqlLibraryName': cqlLibraryName,
                    'model': 'QI-Core',
                    'measureScoring': 'Cohort',
                    "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                    "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
            })
        })
    })

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    after('Clean up',() => {

        let measurementPeriodStart = "2023-01-01T00:00:00.000+00:00"
        let measurementPeriodEnd = "2023-12-31T00:00:00.000+00:00"
        Utilities.deleteMeasure(measureName, cqlLibraryName, 'Cohort', measurementPeriodStart, measurementPeriodEnd)

    })


    it('Update Measure details', () => {

        //Update Measure details
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureScoring': 'Ratio'
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.eql('Measure updated successfully.')
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
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': "",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
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
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': '12343456456',
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.measureName).to.eql('A measure name must contain at least one letter.')
                })
            })
        })
    })

    it('Verify error message when the measure name contains underscore', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'Test_Measure',
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.measureName).to.eql('Measure Name can not contain underscores.')
                })
            })
        })
    })

    it('Verify error message when the measure name is over 500 characters', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
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
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.measureName).to.eql('Measure Name can not be more than 500 characters.')
                })
            })
        })
    })

    it('Save CQL to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Measure Steward to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"measureSteward": "SemanticBits"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Description to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"description": "SemanticBits"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Copyright to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"copyright": "copyright"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Disclaimer to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"disclaimer": "disclaimer"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Rationale to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"rationale": "rationale"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Author to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"author": "author"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })

    it('Add Meta Data Guidance to the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cql': "library xyz version '1.5.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"SDE Ethnicity\":\n  SDE.\"SDE Ethnicity\"\n\ndefine \"SDE Payer\":\n  SDE.\"SDE Payer\"\n\ndefine \"SDE Race\":\n  SDE.\"SDE Race\"\n\ndefine \"SDE Sex\":\n  SDE.\"SDE Sex\"",
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        'measureScoring': 'Ratio',
                        "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000",
                        'measureMetaData': {"guidance": "guidance"}
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                })
            })
        })
    })
})

describe('Measurement Period Validations', () => {

    before('Create Measure', () => {

        cy.setAccessTokenCookie()

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': newMeasureName,
                    'cqlLibraryName': newCQLLibraryName,
                    'model': 'QI-Core',
                    'measureScoring': 'Cohort',
                    "measurementPeriodStart": "2022-01-01T05:00:00.000+0000",
                    "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
            })
        })
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up',() => {

        let measurementPeriodStart = "2023-01-01T00:00:00.000+00:00"
        let measurementPeriodEnd = "2023-12-31T00:00:00.000+00:00"
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = cqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName, 'Cohort', measurementPeriodStart, measurementPeriodEnd)

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
                        "measurementPeriodStart": "2023-01-01T05:00:00.000+0000",
                        "measurementPeriodEnd": "2022-01-01T05:00:00.000+0000",
                        'measureScoring': 'Ratio'
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('Measurement period end date should be greater than measurement period start date.')
                })
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
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

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
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

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' +id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT',
                    body: {
                        'id': id,
                        'measureName': 'UpdatedTestMeasure' + Date.now(),
                        'cqlLibraryName': 'UpdatedCqlLibrary' + Date.now(),
                        'model': 'QI-Core',
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

