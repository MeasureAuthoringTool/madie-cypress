import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { v4 as uuidv4 } from 'uuid'
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

const measureName = 'MeasureBundle' + Date.now()
const CqlLibraryName = 'MeasureBundleLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
const newmeasureCQL = MeasureCQL.CQL_Multiple_Populations
const now = require('dayjs')
const mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
const mpEndDate = now().format('YYYY-MM-DD')
const updatedMeasureName = measureName + randValue
const updatedCQLLibraryName = CqlLibraryName + randValue

const measureCQL = 'library MeasureBundleLibrary1678980273052215 version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include Hospice version \'6.0.000\' called Hospice\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    '//define "ipp":\n' +
    '  //exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n\n' +
    '//define "denom":\n' +
    '    //"ipp"\n\n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n\n' +
    'define "numeratorExclusion":\n' +
    '    Hospice."Has Hospice Services"\n\n' +
    'define "test":\n' +
    '    true'
const CVmeasureCQL = 'library TestLibrary1664888387806162 version \'0.0.000\'\n\n' +
    'using QICore version \'4.1.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    '//define "ipp":\n' +
    '  //exists ["Encounter"] E where E.period.start during "Measurement Period"\n\n' +
    '//define "denom":\n' +
    '  //"ipp"\n\n' +
    'define "num":\n' +
    '  exists ["Encounter"] E where E.status ~ \'finished\'\n\n' +
    'define "numeratorExclusion":\n' +
    '    "num"\n\n' +
    'define function ToCode(coding FHIR.Coding):\n' +
    ' if coding is null then\n' +
    '   null\n' +
    '      else\n' +
    '        System.Code {\n' +
    '           code: coding.code.value,\n' +
    '           system: coding.system.value,\n' +
    '           version: coding.version.value,\n' +
    '           display: coding.display.value\n' +
    '           }\n\n' +
    'define function fun(notPascalCase Integer ):\n' +
    '  true\n\n' +
    'define function "isFinishedEncounter"():\n' +
    '  true'
const PopIniPop = 'num'
const PopNum = 'num'
const PopDenom = 'test'
const PopDenex = 'num'
const PopDenexcep = 'num'
const PopNumex = 'numeratorExclusion'

describe('Proportion Measure Bundle end point returns expected data with valid Measure CQL and elmJson', () => {

    beforeEach('Create Measure and set access token', () => {
        let currentUser = Cypress.env('selectedUser')
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + retrievedMeasureID + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    },
                    body: {
                        "scoring": 'Proportion',
                        "populationBasis": 'boolean',
                        "rateAggregation": "<p>test rA</p>",
                        "groupDescription": "<p>test gD</p>",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "description": "<p>test IP P</p>",
                                "name": "initialPopulation",
                                "definition": PopIniPop
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test d P</p>",
                                "name": "denominator",
                                "definition": PopDenom
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test dE P</p>",
                                "name": "denominatorExclusion",
                                "definition": PopDenex
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test dEx P</p>",
                                "name": "denominatorException",
                                "definition": PopDenexcep
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test n P</p>",
                                "name": "numerator",
                                "definition": PopNum
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test nE P</p>",
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
                    console.log(response)
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
        OktaLogin.setupUserSession(false)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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
                    expect(response.body.entry[0].resource.identifier[0].value).to.eql('eCQMTitle4QICore')
                    expect(response.body.entry[0].resource.identifier[1].value).is.not.empty
                    expect(response.body.entry[0].resource.identifier[2].value).is.not.empty
                    expect(response.body.entry[0].resource.publisher).to.eql('SemanticBits')
                    expect(response.body.entry[0].resource.contact[0].telecom[0].value).to.eql('https://semanticbits.com/')
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
                    expect(response.body.entry[0].resource.group[0].extension[0].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoring')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].code).to.eql('proportion')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].display).to.eql('Proportion')
                    expect(response.body.entry[0].resource.group[0].extension[0].valueCodeableConcept.coding[0].system).to.eql('http://terminology.hl7.org/CodeSystem/measure-scoring')
                    expect(response.body.entry[0].resource.group[0].extension[1].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis')
                    expect(response.body.entry[0].resource.group[0].extension[1].valueCode).to.eql('boolean')
                    expect(response.body.entry[0].resource.group[0].extension[2].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-scoringUnit')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].code).to.eql('ml')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].display).to.eql('ml milliLiters')
                    expect(response.body.entry[0].resource.group[0].extension[2].valueCodeableConcept.coding[0].system).to.eql('https://clinicaltables.nlm.nih.gov/')
                    expect(response.body.entry[0].resource.group[0].extension[3].url).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-type')
                    expect(response.body.entry[0].resource.group[0].extension[3].valueCodeableConcept.coding[0].code).to.eql('outcome')
                    expect(response.body.entry[0].resource.group[0].extension[3].valueCodeableConcept.coding[0].display).to.eql('Outcome')
                    expect(response.body.entry[0].resource.group[0].extension[3].valueCodeableConcept.coding[0].system).to.eql('http://terminology.hl7.org/CodeSystem/measure-type')
                    expect(response.body.entry[1].resource.resourceType).to.eql('Library')
                })
            })
        })
    })

    it('Get Measure bundle data from madie-fhir-service and confirm Measure meta data is present', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/versionId').should('exist').then((versionId) => {
                    cy.readFile('cypress/fixtures/' + currentUser + '/groupId').should('exist').then((groupId) => {

                        //Add Meta data to the Measure
                        cy.request({
                            url: '/api/measures/' + id,
                            headers: {
                                authorization: 'Bearer ' + accessToken?.value
                            },
                            method: 'PUT',
                            body: {
                                "id": id,
                                "measureName": updatedMeasureName,
                                "cqlLibraryName": updatedCQLLibraryName,
                                "model": 'QI-Core v4.1.1',
                                "versionId": versionId,
                                "cql": measureCQL,
                                "version": "0.0.000",
                                "groups": [
                                    {
                                        "id": groupId,
                                        "scoring": "Cohort",
                                        "rateAggregation": "<p>test rA</p>",
                                        "groupDescription": "<p>test gD</p>",
                                        "populations": [
                                            {
                                                "id": uuidv4(),
                                                "description": "<p>test IP P</p>",
                                                "name": "initialPopulation",
                                                "definition": PopIniPop
                                            }
                                        ],
                                        "measureGroupTypes": [
                                            "Outcome"
                                        ],
                                        "populationBasis": "boolean"
                                    }
                                ],
                                "measureMetaData": {
                                    "experimental": false,
                                    "description": "<p>Measure Description</p>",
                                    "steward": {
                                        "name": "Able Health",
                                        "id": "64120f265de35122e68dac40",
                                        "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                                        "url": "https://www.healthcatalyst.com/insights/introducing-able-health-quality-measures-solution"
                                    },
                                    "developers": [{
                                        "name": "ACO Health Solutions",
                                        "id": "64120f265de35122e68dac67",
                                        "oid": "02c84f54-919b-5867-bf51-a1438f2710e2",
                                        "url": "https://www.acohealthsolutions.com/"
                                    }],
                                    "guidance": "Measure Guidance",
                                    "clinicalRecommendation": "Measure Clinical Recommendation",
                                },
                                "measureSetId": uuidv4(),
                                "ecqmTitle": "ecqmTitle",
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
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            cy.log('Measure updated successfully')
                        })

                        cy.request({
                            url: '/api/measures/' + id + '/bundle',
                            method: 'GET',
                            headers: {
                                authorization: 'Bearer ' + accessToken?.value
                            }
                        }).then((response) => {
                            console.log(response)
                            expect(response.status).to.eql(200)
                            expect(response.body.resourceType).to.eql('Bundle')
                            expect(response.body.entry).to.be.a('array')
                            expect(response.body.entry[0].resource.resourceType).to.eql('Measure')
                            expect(response.body.entry[0].resource.meta.profile[0]).to.eql('http://hl7.org/fhir/uv/crmi/StructureDefinition/crmi-shareablemeasure')
                            expect(response.body.entry[0].resource.meta.profile[1]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[2]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[3]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[4]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cql-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[5]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/elm-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[6]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cohort-measure-cqfm')
                            expect(response.body.entry[0].resource.description).to.eql('Measure Description')
                            expect(response.body.entry[0].resource.usage).to.eql('Measure Guidance')
                            expect(response.body.entry[0].resource.author[0].name).to.eql('ACO Health Solutions')
                            expect(response.body.entry[0].resource.clinicalRecommendationStatement).to.eql('Measure Clinical Recommendation')
                        })
                    })
                })
            })
        })
    })

    it('Get Measure bundle data from madie-fhir-service and confirm Library.identifier, Library.publisher, and Library.title are present', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {

                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                    expect(response.body.resourceType).to.eql('Bundle')
                    expect(response.body.entry).to.be.a('array')
                    expect(response.body.entry[1].resource.resourceType).to.eql('Library')
                    expect(response.body.entry[1].resource.identifier[0].use).to.eql('official')
                    expect(response.body.entry[1].resource.identifier[0].system).to.eql('https://madie.cms.gov/login')
                    expect(response.body.entry[1].resource.title).to.eql(newCqlLibraryName)
                    expect(response.body.entry[2].resource.publisher).to.eql('National Committee for Quality Assurance')
                })
            })
        })
    })
})

describe('Measure Observation Validation', () => {

    before('Create Measure', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Backend user cannot create or add a Measure Observation if one is not defined in the CQL', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + retrievedMeasureID + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    },
                    body: {
                        "scoring": 'Continuous Variable',
                        "populationBasis": 'Boolean',
                        "rateAggregation": "<p>test rA</p>",
                        "groupDescription": "<p>test gD</p>",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "description": "<p>test IP P</p>",
                                "name": "initialPopulation",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test mp p</p>",
                                "name": "measurePopulation",
                                "definition": 'num'
                            },
                            {
                                "id": uuidv4(),
                                "description": "<p>test mp excl</p>",
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
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.be.eq('Measure CQL does not have observation definition')
                })
            })
        })
    })
})

describe('CV Measure Bundle end point returns expected data with valid Measure CQL and elmJson', () => {

    before('Create Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, CVmeasureCQL)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({

                    url: '/api/measures/' + retrievedMeasureID + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    },
                    body: {
                        "scoring": 'Continuous Variable',
                        "populationBasis": 'Boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'num'
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

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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
                    expect(response.body.entry[0].resource.group[0].population[0].criteria.expression).to.eql('num')
                    expect(response.body.entry[0].resource.group[0].population[1].code.coding[0].code).to.eql('measure-population')
                    expect(response.body.entry[0].resource.group[0].population[1].criteria.expression).to.eql('num')
                    expect(response.body.entry[0].resource.group[0].population[2].code.coding[0].code).to.eql('measure-population-exclusion')
                    expect(response.body.entry[0].resource.group[0].population[2].criteria.expression).to.eql('numeratorExclusion')
                    expect(response.body.entry[0].resource.group[0].population[3].code.coding[0].code).to.eql('measure-observation')
                    expect(response.body.entry[0].resource.group[0].population[3].criteria.expression).to.eql('isFinishedEncounter')
                    expect(response.body.entry[0].resource.group[0].population[3].extension[0].valueCode).to.eql('count')
                })
            })
        })
    })
})

describe('Measure Bundle end point returns 409 with valid Measure CQL but is missing elmJson', () => {

    before('Create Measure without elmJson', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken?.value
                },
                body: {
                    "measureName": newMeasureName,
                    "cqlLibraryName": newCqlLibraryName,
                    'cql': measureCQL,
                    "model": 'QI-Core v4.1.1',
                    "ecqmTitle": 'eCQMTitle',
                    "measurementPeriodStart": '2020-01-01T05:00:00.000+00:00',
                    "measurementPeriodEnd": '2023-01-01T05:00:00.000+00:00',
                    'versionId': uuidv4(),
                    'measureSetId': uuidv4()
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                expect(response.status).to.eql(201)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
            })
        })
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Measure Bundle end point returns 409 when there is no elmJson for the measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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
        let currentUser = Cypress.env('selectedUser')
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName + 1, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    url: '/api/measures/' + retrievedMeasureID + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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
        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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

describe('Measure Bundle end point returns measure data regardless whom is requesting a read (GET) of the measure', () => {

    newMeasureName = 'TestMeasureName' + randValue
    newCqlLibraryName = 'TestCqlLibraryName' + randValue
    let measureCQL = MeasureCQL.CQL_Multiple_Populations

    before('Create Measure', () => {
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(true)
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName + 2, measureCQL, undefined, true)
         MeasureGroupPage.CreateProportionMeasureGroupAPI(0, true, 'Initial Population', '', '', 'Initial PopulationOne', '', 'Initial PopulationOne')
        OktaLogin.AltLogin()
        MeasuresPage.actionCenter('edit', undefined, { altUser: true })
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')       
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName + 2, false, true)
    })

    it('Get Measure bundle resource will return details of measure, regardless if the request is comfing from the owner / creator of the measure', () => {
        const currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eql(200)
                })
            })
        })
    })
})

describe('Measure Bundle end point returns 409 when the measure is missing a group', () => {

    before('Create Measure', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName + 3, measureCQL)
    })

    beforeEach('Set Access Token', () => {

        OktaLogin.setupUserSession(false)
    })

    after('Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data from madie-fhir-service and confirm all pertinent data is present', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, newmeasureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
        cy.get(EditMeasurePage.cqlEditorTextBox).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data from madie-fhir-service and verify that non-boolean value returns as "Encounter"', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
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

describe('Measure bundle end point returns Supplemental data elements and Risk adjustment variables', () => {

    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure, Measure Group and Set Access Token', () => {

        OktaLogin.setupUserSession(false)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken?.value
                },
                method: 'POST',
                body: {
                    'measureName': newMeasureName,
                    'cqlLibraryName': newCqlLibraryName,
                    'model': 'QI-Core v4.1.1',
                    "ecqmTitle": 'eCQMTitle',
                    'cql': measureCQL,
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                    'versionId': uuidv4(),
                    'measureSetId': uuidv4(),
                    'measureMetaData': {
                        "description": "SemanticBits",
                        "experimental": false,
                        "steward": {
                            "name": "SemanticBits",
                            "id": "64120f265de35122e68dac40",
                            "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                            "url": "https://semanticbits.com/"

                        }, "developers": [
                            {
                                "id": "64120f265de35122e68dabf7",
                                "name": "Academy of Nutrition and Dietetics",
                                "oid": "2.16.840.1.113883.3.6308",
                                "url": "www.eatrightpro.org"
                            }
                        ]
                    },
                    "supplementalData": [
                        {
                            "definition": "SDE Race",
                            "description": "SDE Race description"
                        }
                    ],
                    "riskAdjustments": [
                        {
                            "definition": "Risk Adjustments example",
                            "description": "Risk Adjustments example description"
                        }
                    ]
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                console.log(response)
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
            })
        })

        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'num', '', '', 'num', '', 'numeratorExclusion')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data and verify that the Supplemental data elements and Risk Adjustment variables are added', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.entry[0].resource.supplementalData[0].criteria.expression).to.eql('SDE Race')
                    expect(response.body.entry[0].resource.supplementalData[1].criteria.expression).to.eql('Risk Adjustments example')
                })
            })
        })
    })
})

describe('Measure bundle end point returns Measure Population Description', () => {

    beforeEach('Create Measure, Measure group and Set Access token', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, CVmeasureCQL)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Get Measure bundle data and verify that the description fields for Measure Population criteria are added', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {

                cy.request({
                    url: '/api/measures/' + id + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    },
                    body: {
                        "id": id,
                        "scoring": "Ratio",
                        "populationBasis": "Boolean",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": "<p>Initial Population 1 Description</p>"
                            },
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPop,
                                "description": "<p>Initial Population 2 Description</p>"
                            },
                            {
                                "id": "809794a0-7768-407b-a28e-74226168fafe",
                                "name": "denominator",
                                "definition": PopIniPop,
                                "description": "<p>Denominator Description</p>"
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopIniPop,
                                "description": "<p>Denominator Exclusion Description</p>"
                            },
                            {
                                "id": "63895363-9f2a-43fe-b63a-7b3bd4b25f08",
                                "name": "numerator",
                                "definition": PopNum,
                                "description": "<p>Numerator Description</p>"
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumex,
                                "description": "<p>Numerator Exclusion Description</p>"
                            }
                        ],
                        "measureObservations": [
                            {
                                "id": uuidv4(),
                                "definition": "isFinishedEncounter",
                                "description": "<p>Denominator Observation Description</p>",
                                "criteriaReference": "809794a0-7768-407b-a28e-74226168fafe",
                                "aggregateMethod": "Count"
                            },
                            {
                                "id": uuidv4(),
                                "definition": "isFinishedEncounter",
                                "description": "<p>Numerator Observation Description</p>",
                                "criteriaReference": "63895363-9f2a-43fe-b63a-7b3bd4b25f08",
                                "aggregateMethod": "Average"
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
                cy.request({
                    url: '/api/measures/' + id + '/bundle',
                    method: 'GET',
                    headers: {
                        authorization: 'Bearer ' + accessToken?.value
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.entry[0].resource.group[0].population[0].description).to.eql('Initial Population 1 Description')
                    expect(response.body.entry[0].resource.group[0].population[1].description).to.eql('Initial Population 2 Description')
                    expect(response.body.entry[0].resource.group[0].population[2].description).to.eql('Denominator Description')
                    expect(response.body.entry[0].resource.group[0].population[3].description).to.eql('Denominator Exclusion Description')
                    expect(response.body.entry[0].resource.group[0].population[4].description).to.eql('Numerator Description')
                    expect(response.body.entry[0].resource.group[0].population[5].description).to.eql('Numerator Exclusion Description')
                    expect(response.body.entry[0].resource.group[0].population[6].description).to.eql('Denominator Observation Description')
                    expect(response.body.entry[0].resource.group[0].population[7].description).to.eql('Numerator Observation Description')
                })
            })
        })
    })
})
