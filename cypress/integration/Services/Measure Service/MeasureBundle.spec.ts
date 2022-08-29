import {Utilities} from "../../../Shared/Utilities"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let measureCQL = 'library SimpleFhirMeasure version \'0.0.001\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.0.001\' called FHIRHelpers\n' +
    '\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "ipp":\n' +
    '  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period" \n' +
    '  \n' +
    'define "denom":\n' +
    '    "ipp"\n' +
    '    \n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n' +
    '      \n' +
    'define "numeratorExclusion":\n' +
    '    "num"'

let PopIniPop = 'ipp'
let PopNum = 'num'
let PopDenom = 'denom'
let PopDenex = 'ipp'
let PopDenexcep = 'denom'
let PopNumex = 'numeratorExclusion'

describe('Measure Bundle end point returns expected data with valid Measure CQL and elmJson', () => {

    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Proportion',
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
    })

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    after('Clean up',() => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry).to.be.a('array')
                    expect(response.body.entry[0].resource.resourceType).to.eql('Measure')
                    expect(response.body.entry[0].resource.effectivePeriod).to.have.property('start')
                    expect(response.body.entry[0].resource.effectivePeriod).to.have.property('end')
                    expect(response.body.entry[0].resource.library[0]).is.not.empty
                    expect(response.body.entry[0].resource.group[0].population[0].code.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].population[0].criteria.expression).to.eql('SDE Payer')
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('denominator')
                    expect(response.body.entry[0].resource.group[0].population[1].criteria.expression).to.eql('SDE Sex')
                    expect(response.body.entry[0].resource.group[0].population[2].code.coding[0].code).to.eql('denominator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[2].criteria.expression).to.eql('Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('denominator-exception')
                    expect(response.body.entry[0].resource.group[0].population[3].criteria.expression).to.eql('SDE Ethnicity')
                    expect(response.body.entry[0].resource.group[0].population[4].code.coding[0].code).to.eql('numerator')
                    expect(response.body.entry[0].resource.group[0].population[4].criteria.expression).to.eql('SDE Race')
                    expect(response.body.entry[0].resource.group[0].population[5].code.coding[0].code).to.eql('numerator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[5].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[1].resource.resourceType).to.eql('Library')
                    expect(response.body.entry[1].resource.dataRequirement[0].codeFilter[0].path).to.eql('code')
                    expect(response.body.entry[1].resource.dataRequirement[0].codeFilter[0].valueSet).to.eql('http://cts.nlm.nih.' +
                        'gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001')
                })
            })
        })
    })
})
describe('Measure Bundle end point returns 409 with valid Measure CQL but is missing elmJson', () => {

    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Proportion',
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
    })

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    after('Clean up',() => {
        Utilities.deleteMeasure(measureName, CqlLibraryName+1)

    })
    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(409)
                })
            })
        })
    })
})
describe('Measure Bundle end point returns nothing with Measure CQL missing FHIRHelpers include line', () => {
    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Proportion',
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
    })

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    after('Clean up',() => {
        Utilities.deleteMeasure(measureName, CqlLibraryName+5)

    })
    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry).to.be.a('array')
                    expect(response.body.entry[0].resource.resourceType).to.eql('Measure')
                    expect(response.body.entry[0].resource.effectivePeriod).to.have.property('start')
                    expect(response.body.entry[0].resource.effectivePeriod).to.have.property('end')
                    expect(response.body.entry[0].resource.library[0]).is.not.empty
                    expect(response.body.entry[0].resource.group[0].population[0].code.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].population[0].criteria.expression).to.eql('SDE Payer')
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('denominator')
                    expect(response.body.entry[0].resource.group[0].population[1].criteria.expression).to.eql('SDE Sex')
                    expect(response.body.entry[0].resource.group[0].population[2].code.coding[0].code).to.eql('denominator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[2].criteria.expression).to.eql('Absence of Cervix')
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('denominator-exception')
                    expect(response.body.entry[0].resource.group[0].population[3].criteria.expression).to.eql('SDE Ethnicity')
                    expect(response.body.entry[0].resource.group[0].population[4].code.coding[0].code).to.eql('numerator')
                    expect(response.body.entry[0].resource.group[0].population[4].criteria.expression).to.eql('SDE Race')
                    expect(response.body.entry[0].resource.group[0].population[5].code.coding[0].code).to.eql('numerator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[5].criteria.expression).to.eql('Surgical Absence of Cervix')
                    expect(response.body.entry[1].resource.resourceType).to.eql('Library')
                })
            })
        })
    })
})
describe('Measure Bundle end point returns 403 if measure was not created by current user', () => {
    let measureName = 'MeasureName ' + Date.now()
    let CqlLibraryName = 'CQLLibraryName' + Date.now()
    let measureCQL = "library SimpleFhirMeasureLib version '0.0.004'\nusing FHIR version '4.0.1'\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\nparameter 'Measurement Period' Interval<DateTime>\ncontext Patient\ndefine 'ipp':\n  exists ['Encounter'] E where E.period.start during 'Measurement Period'\ndefine 'denom':\n  'ipp'\ndefine 'num':\n  exists ['Encounter'] E where E.status ~ 'finished'"
    before('Create Measure',() => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, true, true)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(true, true)
    })

    beforeEach('Set Access Token',() => {
        cy.setAccessTokenCookie()
    })

    after('Clean up',() => {

        Utilities.deleteMeasure(measureName, CqlLibraryName, true, true)

    })
    it('Get Measure bundle resource will only return if current user is equal to createdBy user', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId2').should('exist').then((id2) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id2 + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(403)

                })
            })
        })
    })

})
describe('Measure Bundle end point returns 409 when the measure is missing a group', () => {

    before('Create Measure',() => {

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
    })

    beforeEach('Set Access Token',() => {

        cy.setAccessTokenCookie()

    })

    after('Clean up',() => {
        Utilities.deleteMeasure(measureName, CqlLibraryName+2)

    })
    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/bundles',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(409)
                })
            })
        })
    })
})
