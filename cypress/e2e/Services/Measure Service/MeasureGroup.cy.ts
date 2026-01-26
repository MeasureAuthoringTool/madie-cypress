import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from "../../../Shared/OktaLogin"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let measureScoring = 'Proportion'
let newMeasureName = ''
let newCqlLibraryName = ''
let popMeasureCQL = MeasureCQL.SBTEST_CQL
let currentUser = null
let PopIniPop = ''
let PopNum = ''
let PopDenom = ''

describe('Measure Service: Measure Group Endpoints', () => {

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

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
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'
        let PopNumExc = 'numeratorExclusion'
        let measureTstScoring = 'Ratio'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureTstScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumExc
                            },
                            {
                                "id": uuidv4(),
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

    it('Add UCUM Scoring unit to the Measure Group', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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

    it('Update UCUM Scoring unit for the Measure Group', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
        let currentUser = Cypress.env('selectedUser')
        let SecondPopInPop = 'numeratorExclusion'
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": SecondPopInPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
        let currentUser = Cypress.env('selectedUser')
        let SecondPopInPop = 'numeratorExclusion'
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'
        let measureGroupPath = 'cypress/fixtures/groupId'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": SecondPopInPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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

describe('Measure Service: Edit Measure group / Population Criteria: composite score', () => {
    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })
    before('Create Measure', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        let measureCQL = "library CQLLibraryName1662121072763538 version '0.0.000'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  true\n\ndefine \"denom\":\n \"ipp\"\n\ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n\ndefine \"numeratorExclusion\":\n    \"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n          version: coding.version.value,\n           display: coding.display.value\n           }\n\ndefine function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true\n\n\n\n"

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL, null, false, '2022-01-01', '2023-01-01', true)

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })


    it('Add Population Criteria Data: composite score value of "All-or-nothing", to the measure', () => {
        currentUser = Cypress.env('selectedUser')
        PopIniPop = 'ipp'
        PopNum = 'num'
        PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
                        "populationBasis": "Boolean",
                        "compositeScoring": "All-or-nothing"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Proportion')
                    expect(response.body.compositeScoring).to.eql('All-or-nothing')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
                })
            })
        })
    })

    it('Add Population Criteria Data: composite score value of "Opportunity", to the measure', () => {
        currentUser = Cypress.env('selectedUser')
        PopIniPop = 'ipp'
        PopNum = 'num'
        PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
                        "populationBasis": "Boolean",
                        "compositeScoring": "Opportunity"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Proportion')
                    expect(response.body.compositeScoring).to.eql('Opportunity')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
                })
            })
        })
    })

    it('Add Population Criteria Data: composite score value of "Linear", to the measure', () => {
        currentUser = Cypress.env('selectedUser')
        PopIniPop = 'ipp'
        PopNum = 'num'
        PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
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
                        "populationBasis": "Boolean",
                        "compositeScoring": "Linear"
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Proportion')
                    expect(response.body.compositeScoring).to.eql('Linear')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[1].definition).to.eql('num')
                    expect(response.body.populations[2].definition).to.eql('denom')
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

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify that 400 level response is returned when Population Basis is not included, when trying to create a group', () => {
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
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
                    //expect(response.body.validationErrors.populationBasis).to.eql('Population Basis is required.')
                })
            })
        })
    })

    it('Measure group created successfully when the population basis match with population return type', () => {
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
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
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
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

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false,)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    before('Create Measure', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        let measureCQL = "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  exists [\"Encounter\"] E where E.period.start during \"Measurement Period\"\n\ndefine \"denom\":\n \"ipp\"\n\ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n\ndefine \"numeratorExclusion\":\n    \"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n          version: coding.version.value,\n           display: coding.display.value\n           }\n\ndefine function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"():\n  true\n\n\n\n"
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

    })

    it('Add Measure Observations for Ratio Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "b2622e59-a169-45af-a4b5-fe298e220ae4",
                                "definition": "isFinishedEncounter",
                                "criteriaReference": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "aggregateMethod": "Count"
                            },
                            {
                                "id": "5da9610f-bdc5-4922-bd43-48ae0a0b07a4",
                                "definition": "isFinishedEncounter",
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
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                    expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
                })
            })
        })
    })

    it('Add Measure Observations for Continuous Variable Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "measurePopulation",
                                "definition": PopDenom
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "60778b60-e913-4a6a-98ae-3f0cf488b710",
                                "definition": "isFinishedEncounter",
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
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
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

        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure group created successfully when the population basis match with Stratification return type', () => {
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "stratifications": [
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": 'ipp',
                                "association": "initialPopulation"
                            },
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": 'denom',
                                "association": "denominator"
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
                    expect(response.body.stratifications[0].id).to.be.empty
                    expect(response.body.stratifications[1].id).to.be.empty
                })
            })
        })
    })

    it('Verify error message when the population basis does not match with Stratification return type', () => {
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "stratifications": [
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "Surgical Absence of Cervix",
                                "association": "denominator"
                            },
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "Surgical Absence of Cervix",
                                "association": "initialPopulation"
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

    it('Verify error message when the populations are missing IDs', () => {
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": "",
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": "",
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": "",
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": "",
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": "",
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "id": "",
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "stratifications": [
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "Surgical Absence of Cervix",
                                "association": "denominator"
                            },
                            {
                                "id": "",
                                "description": "",
                                "cqlDefinition": "Surgical Absence of Cervix",
                                "association": "initialPopulation"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors).to.have.property("populations[0].id").to.eql("Population ID is required.")
                    expect(response.body.validationErrors).to.have.property("populations[3].id").to.eql("Population ID is required.")
                    expect(response.body.validationErrors).to.have.property("populations[4].id").to.eql("Population ID is required.")
                    expect(response.body.validationErrors).to.have.property("populations[5].id").to.eql("Population ID is required.")
                    expect(response.body.validationErrors).to.have.property("populations[2].id").to.eql("Population ID is required.")
                    expect(response.body.validationErrors).to.have.property("populations[1].id").to.eql("Population ID is required.")
                })
            })
        })
    })

    it('Add, Edit and Delete  multiple Stratification Associations for the Measure group', () => {
        let currentUser = Cypress.env('selectedUser')
        let measurePath = ''
        let measureScoring = 'Proportion'
        measurePath = 'cypress/fixtures/' + currentUser + '/measureId'
        let measureGroupPath = 'cypress/fixtures/' + currentUser + '/groupId'
        let stratificationIdPath = 'cypress/fixtures/' + currentUser + '/stratificationId'

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": "Boolean",
                        "groupDescription": "<p>test gD P</p>",
                        "rateAggregation": "<p>test rA P</p>",
                        "populations": [
                            {
                                "description": "<p>test ip P</p>",
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "description": "<p>test d P</p>",
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "description": "<p>test dExcl P</p>",
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "description": "<p>test dExc P</p>",
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "description": "<p>test n P</p>",
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
                            },
                            {
                                "description": "<p>test nExcl</p>",
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "stratifications": [
                            {
                                "id": uuidv4(),
                                "description": "<p>test ip strat</p>",
                                "cqlDefinition": 'ipp',
                                "associations": ["initialPopulation"]
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test d strat</p>",
                                "cqlDefinition": 'denom',
                                "associations": ["denominator"]
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ],
                        "improvementNotation": "Increased score indicates improvement",
                        "improvementNotationDescription": "<p>test iND</p>"

                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(201)
                    expect(response.body.scoring).to.eql(measureScoring)
                    cy.writeFile(measureGroupPath, response.body.id)
                })
            })
        })
        //Add Stratification and Associations to Measure group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.readFile(measureGroupPath).should('exist').then((measureGroupId) => {
                    cy.request({
                        url: 'api/measures/' + fileContents + '/groups/' + measureGroupId + '/stratification',
                        method: 'POST',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "description": "",
                            "cqlDefinition": "Surgical Absence of Cervix",
                            "association": "initialPopulation",
                            "associations": ["initialPopulation", "numerator"]
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        expect(response.body.cqlDefinition).to.eql('Surgical Absence of Cervix')
                        expect(response.body.associations[0]).to.eql('initialPopulation')
                        expect(response.body.associations[1]).to.eql('numerator')
                        cy.writeFile(stratificationIdPath, response.body.id)
                        cy.log('Multiple Stratification Associations added successfully')
                    })
                })
            })
        })
        //Edit Stratification
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.readFile(measureGroupPath).should('exist').then((measureGroupId) => {
                    cy.readFile(stratificationIdPath).should('exist').then((stratificationId) => {
                        cy.request({
                            url: 'api/measures/' + fileContents + '/groups/' + measureGroupId + '/stratification',
                            method: 'PUT',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": stratificationId,
                                "description": "",
                                "cqlDefinition": "ipp",
                                "association": "initialPopulation",
                                "associations": ["initialPopulation", "denominator"]
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body.id).to.be.exist
                            expect(response.body.cqlDefinition).to.eql('ipp')
                            expect(response.body.associations[0]).to.eql('initialPopulation')
                            expect(response.body.associations[1]).to.eql('denominator')
                            cy.log('Stratifications updated successfully')
                        })
                    })
                })
            })
        })
        //Delete Stratification
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.readFile(measureGroupPath).should('exist').then((measureGroupId) => {
                    cy.readFile(stratificationIdPath).should('exist').then((stratificationId) => {
                        cy.request({
                            url: 'api/measures/' + fileContents + '/groups/' + measureGroupId + '/stratification/' + stratificationId,
                            method: 'DELETE',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            expect(response.body.id).to.be.exist
                            cy.log('Stratification deleted successfully')
                        })
                    })
                })
            })
        })
    })
})
describe('Creating a group / PC with description for various fields', () => {

    beforeEach('Set Access Token', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        let measureCQL = "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  exists [\"Encounter\"] E where E.period.start during \"Measurement Period\"\n\ndefine \"denom\":\n \"ipp\"\n\ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n\ndefine \"numeratorExclusion\":\n    \"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n          version: coding.version.value,\n           display: coding.display.value\n           }\n\ndefine function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"():\n  true\n\n\n\n"
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Description is added to all fields are saved -- no second IP', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'
        let NumExc = 'numeratorExclusion'

        //if descriptions are added, they are returned and saved to the database
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": "Initial Population Description"
                            },
                            {
                                "id": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "name": "denominator",
                                "definition": PopDenom,
                                "description": "Denominator Description"
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopIniPop,
                                "description": "Denominator Exclusion Description"
                            },
                            {
                                "id": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "name": "numerator",
                                "definition": PopNum,
                                "description": "Numerator Description"
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": NumExc,
                                "description": "Numerator Exclusion Description"
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "b2622e59-a169-45af-a4b5-fe298e220ae4",
                                "definition": "isFinishedEncounter",
                                "description": "denominator observation description",
                                "criteriaReference": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "aggregateMethod": "Count"
                            },
                            {
                                "id": "5da9610f-bdc5-4922-bd43-48ae0a0b07a4",
                                "definition": "isFinishedEncounter",
                                "description": "numerator observation description",
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
                    expect(response.body.populations[0].description).to.eql('Initial Population Description')
                    expect(response.body.populations[1].definition).to.eql('denom')
                    expect(response.body.populations[1].description).to.eql('Denominator Description')
                    expect(response.body.populations[2].definition).to.eql('ipp')
                    expect(response.body.populations[2].description).to.eql('Denominator Exclusion Description')
                    expect(response.body.populations[3].definition).to.eql('num')
                    expect(response.body.populations[3].description).to.eql('Numerator Description')
                    expect(response.body.populations[4].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[4].description).to.eql('Numerator Exclusion Description')
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].description).to.eql('denominator observation description')
                    expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[1].description).to.eql('numerator observation description')
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                    expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": null
                            },
                            {
                                "id": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "name": "denominator",
                                "definition": PopDenom,
                                "description": null
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopIniPop,
                                "description": null
                            },
                            {
                                "id": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "name": "numerator",
                                "definition": PopNum,
                                "description": null
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": NumExc,
                                "description": null
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "b2622e59-a169-45af-a4b5-fe298e220ae4",
                                "definition": "isFinishedEncounter",
                                "description": null,
                                "criteriaReference": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "aggregateMethod": "Count"
                            },
                            {
                                "id": "5da9610f-bdc5-4922-bd43-48ae0a0b07a4",
                                "definition": "isFinishedEncounter",
                                "description": null,
                                "criteriaReference": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "aggregateMethod": "Average"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[0].description).is.null
                    expect(response.body.populations[1].definition).to.eql('denom')
                    expect(response.body.populations[1].description).is.null
                    expect(response.body.populations[2].definition).to.eql('ipp')
                    expect(response.body.populations[2].description).is.null
                    expect(response.body.populations[3].definition).to.eql('num')
                    expect(response.body.populations[3].description).is.null
                    expect(response.body.populations[4].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[4].description).is.null
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].description).is.null
                    expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[1].description).is.null
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                    expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
                })
            })
        })

    })
    it('Description is added to all fields are saved -- second IP', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopNum = 'num'
        let PopDenom = 'denom'
        let NumExc = 'numeratorExclusion'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": "Initial Population 1 Description"
                            },
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": "Initial Population 2 Description"
                            },
                            {
                                "id": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "name": "denominator",
                                "definition": PopDenom,
                                "description": "Denominator Description"
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopIniPop,
                                "description": "Denominator Exclusion Description"
                            },
                            {
                                "id": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "name": "numerator",
                                "definition": PopNum,
                                "description": "Numerator Description"
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": NumExc,
                                "description": "Numerator Exclusion Description"
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "b2622e59-a169-45af-a4b5-fe298e220ae4",
                                "definition": "isFinishedEncounter",
                                "description": "denominator observation description",
                                "criteriaReference": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "aggregateMethod": "Count"
                            },
                            {
                                "id": "5da9610f-bdc5-4922-bd43-48ae0a0b07a4",
                                "definition": "isFinishedEncounter",
                                "description": "numerator observation description",
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
                    expect(response.body.populations[0].description).to.eql('Initial Population 1 Description')
                    expect(response.body.populations[1].definition).to.eql('ipp')
                    expect(response.body.populations[1].description).to.eql('Initial Population 2 Description')
                    expect(response.body.populations[2].definition).to.eql('denom')
                    expect(response.body.populations[2].description).to.eql('Denominator Description')
                    expect(response.body.populations[3].definition).to.eql('ipp')
                    expect(response.body.populations[3].description).to.eql('Denominator Exclusion Description')
                    expect(response.body.populations[4].definition).to.eql('num')
                    expect(response.body.populations[4].description).to.eql('Numerator Description')
                    expect(response.body.populations[5].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[5].description).to.eql('Numerator Exclusion Description')
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].description).to.eql('denominator observation description')
                    expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[1].description).to.eql('numerator observation description')
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                    expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Ratio",
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": null
                            },
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": null
                            },
                            {
                                "id": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "name": "denominator",
                                "definition": PopDenom,
                                "description": null
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopIniPop,
                                "description": null
                            },
                            {
                                "id": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "name": "numerator",
                                "definition": PopNum,
                                "description": null
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": NumExc,
                                "description": null
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "b2622e59-a169-45af-a4b5-fe298e220ae4",
                                "definition": "isFinishedEncounter",
                                "description": null,
                                "criteriaReference": "89f42def-f989-4e9d-8e5f-c2c0cafc04d7",
                                "aggregateMethod": "Count"
                            },
                            {
                                "id": "5da9610f-bdc5-4922-bd43-48ae0a0b07a4",
                                "definition": "isFinishedEncounter",
                                "description": null,
                                "criteriaReference": "fa60458b-b2fa-4ba2-9bc4-d6db3468f895",
                                "aggregateMethod": "Average"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Ratio')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[0].description).is.null
                    expect(response.body.populations[1].definition).to.eql('ipp')
                    expect(response.body.populations[1].description).is.null
                    expect(response.body.populations[2].definition).to.eql('denom')
                    expect(response.body.populations[2].description).is.null
                    expect(response.body.populations[3].definition).to.eql('ipp')
                    expect(response.body.populations[3].description).is.null
                    expect(response.body.populations[4].definition).to.eql('num')
                    expect(response.body.populations[4].description).is.null
                    expect(response.body.populations[5].definition).to.eql('numeratorExclusion')
                    expect(response.body.populations[5].description).is.null
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].description).is.null
                    expect(response.body.measureObservations[1].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[1].description).is.null
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                    expect(response.body.measureObservations[1].aggregateMethod).to.eql('Average')
                })
            })
        })
    })
    it('Description is added to all fields are saved -- CV Score -- Measure Population', () => {
        let currentUser = Cypress.env('selectedUser')
        let PopIniPop = 'ipp'
        let PopDenom = 'denom'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "associationType": null,
                                "description": "Initial Population Description on CV"
                            },
                            {
                                "id": uuidv4(),
                                "name": "measurePopulation",
                                "definition": PopDenom,
                                "associationType": null,
                                "description": "Measure Population Description on CV"
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "60778b60-e913-4a6a-98ae-3f0cf488b710",
                                "definition": "isFinishedEncounter",
                                "description": "Measure Observations description on CV",
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
                    expect(response.body.populations[0].description).to.eql('Initial Population Description on CV')
                    expect(response.body.populations[1].definition).to.eql('denom')
                    expect(response.body.populations[1].description).to.eql('Measure Population Description on CV')
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].description).to.eql('Measure Observations description on CV')
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": "Continuous Variable",
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "associationType": null,
                                "description": null
                            },
                            {
                                "id": uuidv4(),
                                "name": "measurePopulation",
                                "definition": PopDenom,
                                "associationType": null,
                                "description": null
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": "60778b60-e913-4a6a-98ae-3f0cf488b710",
                                "definition": "isFinishedEncounter",
                                "description": null,
                                "criteriaReference": null,
                                "aggregateMethod": "Count"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist
                    expect(response.body.scoring).to.eql('Continuous Variable')
                    expect(response.body.populations[0].definition).to.eql('ipp')
                    expect(response.body.populations[0].description).is.null
                    expect(response.body.populations[1].definition).to.eql('denom')
                    expect(response.body.populations[1].description).is.null
                    expect(response.body.measureObservations[0].definition).to.eql('isFinishedEncounter')
                    expect(response.body.measureObservations[0].description).is.null
                    expect(response.body.measureObservations[0].aggregateMethod).to.eql('Count')
                })
            })
        })
    })
})


