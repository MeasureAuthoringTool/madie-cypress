import {Utilities} from "../../../Shared/Utilities"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {describe} from "mocha";

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let measureScoring = 'Proportion'
let newMeasureName = ''
let newCqlLibraryName = ''
let popMeasureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Service: Measure Group Endpoints', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()
    })

    after('Clean up',() => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    before('Create Measure', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        let measureCQL = "library CQLLibraryName1662121072763538 version '0.0.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  true\n\ndefine \"denom\":\n \"ipp\"\n\ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n\ndefine \"numeratorExclusion\":\n    \"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n          version: coding.version.value,\n           display: coding.display.value\n           }\n\ndefine function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true\n\n\n\n"

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

    })
    it('Create Proportion measure group', () => {

        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql(measureScoring)
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
                })
            })
        })
    })

    it('Update measure group to Ratio', () => {

        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'
        let PopNumExc = 'numeratorExclusion'
        let measureTstScoring = 'Ratio'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureTstScoring,
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "numeratorExclusion",
                                "definition": PopNumExc
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[3].definition).to.eql('denom')
                })
            })
        })
    })

    it('Add UCUM Scoring unit to the Measure Group', () =>  {

        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                        },
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql(measureScoring)
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                })
            })
        })

    })

    it('Update UCUM Scoring unit for the Measure Group', () =>  {

        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "scoringUnit": {
                            "label": "455 455",
                        },
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql(measureScoring)
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
                    expect(response.body.scoringUnit.label).to.eql('455 455')
                })
            })
        })

    })

    it('Add Second Initial Population for Ratio Measure', () => {

        let SecondPopInPop = 'numeratorExclusion'
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "initialPopulation",
                                "definition": SecondPopInPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                        },
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[2].definition).to.eql('num')
                    expect(response.body.populations[3].definition).to.eql('denom')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                })
            })
        })
    })

    it('Add and Delete Second Initial Population for Ratio Measure', () => {

        let SecondPopInPop = 'numeratorExclusion'
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'
        let measureGroupPath = 'cypress/fixtures/groupId'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "initialPopulation",
                                "definition": SecondPopInPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                        },
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[2].definition).to.eql('num')
                    expect(response.body.populations[3].definition).to.eql('denom')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                    cy.writeFile(measureGroupPath, response.body.id)
                })
            })
        })

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                        },
                        "populationBasis": "Boolean"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                })
            })
        })
    })
})

describe('Measure Populations', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, popMeasureCQL)

        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that 400 level response is returned when Population Basis is not included, when trying to create a group', () => {

        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "_id": "",
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "_id": "",
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "_id": "",
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "_id": "",
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.populationBasis).to.eql('Population Basis is required.')
                })
            })
        })
    })

    it('Measure group created successfully when the population basis match with population return type', () => {

        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "_id": "",
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "_id": "",
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "_id": "",
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "_id": "",
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(201)
                    expect(response.body.scoring).to.eql(measureScoring)
                })
            })
        })
    })

    it('Verify error message when the population basis does not match with population return type', () => {

        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": "Encounter",
                        "populations": [
                            {
                                "_id": "",
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "_id": "",
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "_id": "",
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "_id": "",
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('Return type for the CQL definition selected for the Initial Population does not match with population basis.')
                })
            })
        })
    })
})

describe('Measure Observations', () => {

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()
    })

    after('Clean up',() => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    before('Create Measure', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        //let measureCQL = "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  exists [\"Encounter\"] E where E.period.start during \"Measurement Period\"\n  \ndefine \"denom\":\n  \"ipp\"\n  \ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n  \ndefine \"numeratorExclusion\":\n    \"num\"\n    \ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n           version: coding.version.value,\n           display: coding.display.value\n           }\n           \ndefine function fun(notPascalCase Integer ):\n  true\n  \ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true\n  \n"
        let measureCQL = "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  exists [\"Encounter\"] E where E.period.start during \"Measurement Period\"\n\ndefine \"denom\":\n \"ipp\"\n\ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n\ndefine \"numeratorExclusion\":\n    \"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n          version: coding.version.value,\n           display: coding.display.value\n           }\n\ndefine function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true\n\n\n\n"
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

    })

    it('Add Measure Observations for Ratio Measure', () => {

        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "_id" : "",
                                "name" : "initialPopulation",
                                "definition" : PopIniPop
                            },
                            {
                                "id": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "name" : "denominator",
                                "definition" : PopDenom
                            },
                            {
                                "_id" : "",
                                "name" : "denominatorExclusion",
                                "definition" : ""
                            },
                            {
                                "id": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "name" : "numerator",
                                "definition" : PopNum
                            },
                            {
                                "_id" : "",
                                "name" : "numeratorExclusion",
                                "definition" : ""
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "b2622e59-a169-45af-a4b5-fe298e220ae4",
                                "definition": "fun",
                                "criteriaReference": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "aggregateMethod": "Sample Variance"
                            },
                            {
                                "id": "5da9610f-bdc5-4922-bd43-48ae0a0b07a4",
                                "definition": "ToCode",
                                "criteriaReference": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "aggregateMethod": "Average"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('denom')
                    expect(response.body.populations[3].definition).to.eql('num')
                    expect(response.body.measureObservations[0].definition).to.eql('fun')
                    expect(response.body.measureObservations[1].definition).to.eql('ToCode')
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Sample Variance')
                    expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
                })
            })
        })
    })

    it('Add Measure Observations for Continuous Variable Measure', () => {

        let PopIniPop = 'ipp'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Continuous Variable",
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "_id" : "",
                                "name" : "initialPopulation",
                                "definition" : PopIniPop
                            },
                            {
                                "name" : "measurePopulation",
                                "definition" : PopDenom
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "60778b60-e913-4a6a-98ae-3f0cf488b710",
                                "definition": "ToCode",
                                "criteriaReference": null,
                                "aggregateMethod": "Count"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Continuous Variable')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('denom')
                    expect(response.body.measureObservations[0].definition).to.eql('ToCode')
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                })
            })
        })
    })
})

describe('Measure Stratifications', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        let stratMeasureCQL = "library CQLLibraryName1662480444560541 version '0.0.000'\nusing FHIR version '4.0.1'\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nparameter \"Measurement Period\" Interval<DateTime>\ncontext Patient\ndefine \"ipp\":\nexists [\"Encounter\": \"Office Visit\"] E where E.period.start during \"Measurement Period\"\ndefine \"denom\":\n\"ipp\"\ndefine \"num\":\nexists [\"Encounter\": \"Office Visit\"] E where E.status ~ 'finished'\ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where NoCervixHysterectomy.status = 'completed'    \n"
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, stratMeasureCQL)

        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure group created successfully when the population basis match with Stratification return type', () => {

        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "_id": "",
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "_id": "",
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "_id": "",
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "_id": "",
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "stratifications": [
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "ipp",
                                "association": "Initial Population"
                            },
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "denom",
                                "association": "Initial Population"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(201)
                    expect(response.body.scoring).to.eql(measureScoring)
                })
            })
        })
    })

    it('Verify error message when the population basis does not match with Stratification return type', () => {

        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "_id": "",
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "_id": "",
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "_id": "",
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "_id": "",
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "_id": "",
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "stratifications": [
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "Surgical Absence of Cervix",
                                "association": "Denominator"
                            },
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "Surgical Absence of Cervix",
                                "association": "Initial Population"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('Return type for the CQL definition selected for the Stratification(s) does not match with population basis.')
                })
            })
        })
    })
})

