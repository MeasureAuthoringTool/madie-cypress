import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { v4 as uuidv4 } from 'uuid'

let measureName = 'MeasureBundle' + Date.now()
let CqlLibraryName = 'MeasureBundle' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let newmeasureCQL = MeasureCQL.CQL_Multiple_Populations
const now = require('dayjs')
let date = now().format('YYYY-MM-DD')

let measureCQL = 'library SimpleFhirMeasure version \'0.0.001\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
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
let CVmeasureCQL = 'library TestLibrary1664888387806162 version \'0.0.000\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "ipp":\n' +
    '  exists ["Encounter"] E where E.period.start during "Measurement Period"\n' +
    '  \n' +
    'define "denom":\n' +
    '  "ipp"\n' +
    '  \n' +
    'define "num":\n' +
    '  exists ["Encounter"] E where E.status ~ \'finished\'\n' +
    '  \n' +
    'define "numeratorExclusion":\n' +
    '    "num"\n' +
    '    \n' +
    'define function ToCode(coding FHIR.Coding):\n' +
    ' if coding is null then\n' +
    '   null\n' +
    '      else\n' +
    '        System.Code {\n' +
    '           code: coding.code.value,\n' +
    '           system: coding.system.value,\n' +
    '           version: coding.version.value,\n' +
    '           display: coding.display.value\n' +
    '           }\n' +
    '           \n' +
    'define function fun(notPascalCase Integer ):\n' +
    '  true\n' +
    '  \n' +
    'define function "isFinishedEncounter"():\n' +
    '  true'
let PopIniPop = 'ipp'
let PopNum = 'num'
let PopDenom = 'denom'
let PopDenex = 'ipp'
let PopDenexcep = 'denom'
let PopNumex = 'numeratorExclusion'

describe('Proportion Measure Bundle end point returns expected data with valid Measure CQL and elmJson', () => {

    beforeEach('Create Measure and set access token', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                            "value": {
                                "code": "ml",
                                "name": "milliLiters",
                                "guidance": "",
                                "system": "https://clinicaltables.nlm.nih.gov/"
                            }
                        },
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
        cy.setAccessTokenCookie()
    })


    afterEach('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
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
                    expect(response.body.entry[0].resource.group[0].extension[1].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis')
                    expect(response.body.entry[0].resource.group[0].extension[1].valueCode).to.eql('boolean')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('ml')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('ml milliLiters')
                    expect(response.body.entry[0].resource.group[0].population[0].code.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].population[0].criteria.expression).to.eql(PopIniPop)
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('denominator')
                    expect(response.body.entry[0].resource.group[0].population[1].criteria.expression).to.eql(PopDenom)
                    expect(response.body.entry[0].resource.group[0].population[2].code.coding[0].code).to.eql('denominator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[2].criteria.expression).to.eql(PopDenex)
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('denominator-exception')
                    expect(response.body.entry[0].resource.group[0].population[3].criteria.expression).to.eql(PopDenexcep)
                    expect(response.body.entry[0].resource.group[0].population[4].code.coding[0].code).to.eql('numerator')
                    expect(response.body.entry[0].resource.group[0].population[4].criteria.expression).to.eql(PopNum)
                    expect(response.body.entry[0].resource.group[0].population[5].code.coding[0].code).to.eql('numerator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[5].criteria.expression).to.eql(PopNumex)
                    expect(response.body.entry[1].resource.resourceType).to.eql('Library')
                    expect(response.body.entry[1].resource.dataRequirement[0].codeFilter[0].path).to.eql('code')
                    expect(response.body.entry[1].resource.dataRequirement[0].codeFilter[0].valueSet).to.eql('http://cts.nlm.nih.' +
                        'gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001')
                })
            })
        })
    })

    it('Get Measure bundle data from madie-fhir-service and confirm Measure meta data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((versionId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/bundle',
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
                        expect(response.body.entry[0].resource.meta.versionId).to.eql(versionId)
                        expect(response.body.entry[0].resource.meta.lastUpdated).contain(date)
                        expect(response.body.entry[0].resource.meta.profile[0]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm')
                        expect(response.body.entry[0].resource.meta.profile[1]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm')
                        expect(response.body.entry[0].resource.meta.profile[2]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm')
                    })
                })
            })
        })
    })
})

describe('CV Measure Bundle end point returns expected data with valid Measure CQL and elmJson', () => {

    before('Create Measure', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, CVmeasureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Continuous Variable',
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "measurePopulation",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
                                "name": "measurePopulationExclusion",
                                "definition": 'numeratorExclusion'
                            },
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                            "value": {
                                "code": "ml",
                                "name": "milliLiters",
                                "guidance": "",
                                "system": "https://clinicaltables.nlm.nih.gov/"
                            }
                        },
                        "measureObservations": [
                            {
                                "id": retrievedMeasureID,
                                "criteriaReference": null,
                                "definition": 'isFinishedEncounter',
                                "aggregateMethod": 'Count'
                            },
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

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
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
                    expect(response.body.entry[0].resource.group[0].extension[1].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis')
                    expect(response.body.entry[0].resource.group[0].extension[1].valueCode).to.eql('boolean')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('ml')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('ml milliLiters')
                    expect(response.body.entry[0].resource.group[0].population[0].code.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].population[0].criteria.expression).to.eql('ipp')
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('measure-population')
                    expect(response.body.entry[0].resource.group[0].population[1].criteria.expression).to.eql('num')
                    expect(response.body.entry[0].resource.group[0].population[2].code.coding[0].code).to.eql('measure-population-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[2].criteria.expression).to.eql('numeratorExclusion')
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('measure-observation')
                    expect(response.body.entry[0].resource.group[0].population[3].criteria.expression).to.eql('isFinishedEncounter')
                    expect(response.body.entry[0].resource.group[0].population[3].extension[0].valueString).to.eql('Count')
                })
            })
        })
    })
})

describe('Measure Bundle end point returns 409 with valid Measure CQL but is missing elmJson', () => {

    before('Create Measure without elmJson', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": newMeasureName, "cqlLibraryName": newCqlLibraryName, 'cql': measureCQL, "model": 'QI-Core v4.1.1', "ecqmTitle": 'eCQMTitle', "measurementPeriodStart": '2020-01-01T05:00:00.000+00:00',
                    "measurementPeriodEnd": '2023-01-01T05:00:00.000+00:00', 'versionId': uuidv4(), 'measureSetId': uuidv4()
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
            })
        })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName + 1)

    })

    it('Measure Bundle end point returns 409 when there is no elmJson for the measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/bundle',
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

    before('Create Measure', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName + 1, measureCQL)

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
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex
                            }
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                            "value": {
                                "code": "ml",
                                "name": "milliLiters",
                                "guidance": "",
                                "system": "https://clinicaltables.nlm.nih.gov/"
                            }
                        },
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

    after('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName + 1)

    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
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
                    expect(response.body.entry[0].resource.group[0].extension[1].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis')
                    expect(response.body.entry[0].resource.group[0].extension[1].valueCode).to.eql('boolean')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('ml')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('ml milliLiters')
                    expect(response.body.entry[0].resource.group[0].population[0].code.coding[0].code).to.eql('initial-population')
                    expect(response.body.entry[0].resource.group[0].population[0].criteria.expression).to.eql(PopIniPop)
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('denominator')
                    expect(response.body.entry[0].resource.group[0].population[1].criteria.expression).to.eql(PopDenom)
                    expect(response.body.entry[0].resource.group[0].population[2].code.coding[0].code).to.eql('denominator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[2].criteria.expression).to.eql(PopDenex)
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('denominator-exception')
                    expect(response.body.entry[0].resource.group[0].population[3].criteria.expression).to.eql(PopDenexcep)
                    expect(response.body.entry[0].resource.group[0].population[4].code.coding[0].code).to.eql('numerator')
                    expect(response.body.entry[0].resource.group[0].population[4].criteria.expression).to.eql(PopNum)
                    expect(response.body.entry[0].resource.group[0].population[5].code.coding[0].code).to.eql('numerator-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[5].criteria.expression).to.eql(PopNumex)
                    expect(response.body.entry[1].resource.resourceType).to.eql('Library')
                })
            })
        })
    })
})
describe('Measure Bundle end point returns 403 if measure was not created by current user', () => {

    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue
    let measureCQL = "library SimpleFhirMeasureLib version '0.0.004'\nusing FHIR version '4.0.1'\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\nparameter 'Measurement Period' Interval<DateTime>\ncontext Patient\ndefine 'ipp':\n  exists ['Encounter'] E where E.period.start during 'Measurement Period'\ndefine 'denom':\n  'ipp'\ndefine 'num':\n  exists ['Encounter'] E where E.status ~ 'finished'"

    before('Create Measure', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName + 2, measureCQL, true, true)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(true, true, 'ipp', 'num', 'denom')
    })

    beforeEach('Set Access Token', () => {
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName + 2, true, true)

    })
    it('Get Measure bundle resource will only return if current user is equal to createdBy user', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId2').should('exist').then((id2) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id2 + '/bundle',
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

    before('Create Measure', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName + 3, measureCQL)
    })

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName + 3)

    })
    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/bundle',
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
describe('Non-boolean populationBasis returns the correct value and in the correct format', () => {

    beforeEach('Create measure and login', () => {
        randValue = (Math.floor((Math.random() * 2000) + 5))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, newmeasureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
        cy.get(EditMeasurePage.cqlEditorTextBox).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(13500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Qualifying Encounters', 'Qualifying Encounters', 'Encounter')
        cy.setAccessTokenCookie()
    })

    afterEach('Clean up', () => {

        randValue = (Math.floor((Math.random() * 2000) + 5))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Get Measure bundle data from madie-fhir-service and verify that non-boolean value returns as "Encounter"', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
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
                    expect(response.body.entry[0].resource.group[0].extension[1].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis')
                    expect(response.body.entry[0].resource.group[0].extension[1].valueCode).to.eql('Encounter')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('ml')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('ml milliLiters')
                })
            })
        })
    })
})
