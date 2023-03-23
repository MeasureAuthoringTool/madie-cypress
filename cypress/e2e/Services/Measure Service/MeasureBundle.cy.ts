import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { v4 as uuidv4 } from 'uuid'

let measureName = 'MeasureBundle' + Date.now()
let CqlLibraryName = 'MeasureBundleLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let newmeasureCQL = MeasureCQL.CQL_Multiple_Populations
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let updatedMeasureName = measureName + randValue
let updatedCQLLibraryName = CqlLibraryName + randValue

let measureCQL = 'library MeasureBundleLibrary1678980273052215 version \'0.0.000\'\n' +
    '\n' +
    'using FHIR version \'4.0.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include Hospice version \'6.0.000\' called Hospice\n' +
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
    '    Hospice."Has Hospice Services"\n' +
    '    \n' +
    'define "test":\n' +
    '    true'
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

        //add meta data, still in progress, needs more work cvasile 2/23/23
        //Utilities.UpdateMeasureAddMetaDataAPI(newMeasureName, newCqlLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((retrievedMeasureID) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + retrievedMeasureID + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Proportion',
                        "populationBasis": 'boolean',
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
                    console.log(response)
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
                    expect(response.body.entry[0].resource.identifier[0].value).to.eql('eCQMTitle')
                    expect(response.body.entry[0].resource.identifier[1].value).is.not.empty
                    expect(response.body.entry[0].resource.identifier[2].value).is.not.empty
                    expect(response.body.entry[0].resource.publisher).to.eql('SemanticBits')
                    expect(response.body.entry[0].resource.contact[0].telecom[0].value).to.eql('https://semanticbits.com/')
                    expect(response.body.entry[0].resource.useContext[0].valueCodeableConcept.coding[0].code).to.eql('mips')
                    expect(response.body.entry[0].resource.useContext[0].valueCodeableConcept.coding[0].display).to.eql('MIPS')
                    expect(response.body.entry[0].resource.useContext[0].valueCodeableConcept.coding[0].system).to.eql('http://hl7.org/fhir/us/cqfmeasures/CodeSystem/quality-programs')
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
                    expect(response.body.entry[1].resource.useContext[0].valueCodeableConcept.coding[0].code).to.eql('mips')
                    expect(response.body.entry[1].resource.useContext[0].valueCodeableConcept.coding[0].display).to.eql('MIPS')
                    expect(response.body.entry[1].resource.useContext[0].valueCodeableConcept.coding[0].system).to.eql('http://hl7.org/fhir/us/cqfmeasures/CodeSystem/quality-programs')
                })
            })
        })
    })

    it('Get Measure bundle data from madie-fhir-service and confirm Measure meta data is present', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((versionId) => {
                    cy.readFile('cypress/fixtures/groupId').should('exist').then((groupId) => {

                        //Add Meta data to the Measure
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
                                "model": 'QI-Core v4.1.1',
                                "versionId": versionId,
                                "cql": measureCQL,
                                "version": "0.0.000",
                                "groups": [
                                    {
                                        "id": groupId,
                                        "scoring": "Cohort",
                                        "populations": [
                                            {
                                                "id": uuidv4(),
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
                                    "description": "Measure Description",
                                    "steward": {"name": "Able Health",
                                        "id": "64120f265de35122e68dac40",
                                        "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                                        "url": "https://www.healthcatalyst.com/insights/introducing-able-health-quality-measures-solution"},
                                    "developers": [{ "name": "ACO Health Solutions",
                                        "id": "64120f265de35122e68dac67",
                                        "oid": "02c84f54-919b-5867-bf51-a1438f2710e2",
                                        "url": "https://www.acohealthsolutions.com/" }],
                                    "guidance": "Measure Guidance",
                                    "clinicalRecommendation": "Measure Clinical Recommendation",
                                },
                                "measureSetId": uuidv4(),
                                "ecqmTitle": "ecqmTitle",
                                "measurementPeriodStart": mpStartDate + "T00:00:00.000Z",
                                "measurementPeriodEnd": mpEndDate + "T00:00:00.000Z"
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            cy.log('Measure updated successfully')
                        })

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
                            expect(response.body.entry[0].resource.approvalDate).is.not.empty
                            expect(response.body.entry[0].resource.lastReviewDate).is.not.empty
                            expect(response.body.entry[0].resource.meta.profile[0]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[1]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-measure-cqfm')
                            expect(response.body.entry[0].resource.meta.profile[2]).to.eql('http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/executable-measure-cqfm')
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

            CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, newmeasureCQL)
            OktaLogin.Login()
            MeasuresPage.measureAction("edit")
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

    describe('Measure bundle end point returns Supplemental data elements and Risk adjustment variables', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue
        let elmJson = "{\"library\":{\"identifier\":{\"id\":\"CQLLibraryName1662121072763538\",\"version\":\"0.0.000\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"3:1-3:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"5:1-5:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.1.000\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.1.000'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"7:1-7:49\",\"name\":\"Measurement Period\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"\\\"Measurement Period\\\"\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"7:32-7:49\",\"type\":\"IntervalTypeSpecifier\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"pointType\":{\"localId\":\"3\",\"locator\":\"7:41-7:48\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"9:1-9:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}},{\"localId\":\"7\",\"locator\":\"11:1-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"7\",\"s\":[{\"r\":\"6\",\"value\":[\"\",\"define \",\"\\\"ipp\\\"\",\":\\n  \",\"true\"]}]}}],\"expression\":{\"localId\":\"6\",\"locator\":\"12:3-12:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"}},{\"localId\":\"9\",\"locator\":\"14:1-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"denom\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"9\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"denom\\\"\",\":\\n \"]},{\"r\":\"8\",\"s\":[{\"value\":[\"\\\"ipp\\\"\"]}]}]}}],\"expression\":{\"localId\":\"8\",\"locator\":\"15:2-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"type\":\"ExpressionRef\"}},{\"localId\":\"18\",\"locator\":\"17:1-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"18\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"num\\\"\",\":\\n  \"]},{\"r\":\"17\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"16\",\"s\":[{\"s\":[{\"r\":\"11\",\"s\":[{\"r\":\"10\",\"s\":[{\"r\":\"10\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"15\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"15\",\"s\":[{\"r\":\"13\",\"s\":[{\"r\":\"12\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"13\",\"s\":[{\"value\":[\"status\"]}]}]},{\"value\":[\" \",\"~\",\" \"]},{\"r\":\"14\",\"s\":[{\"value\":[\"'finished'\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"17\",\"locator\":\"18:3-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"16\",\"locator\":\"18:10-18:52\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"11\",\"locator\":\"18:10-18:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"10\",\"locator\":\"18:10-18:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"15\",\"locator\":\"18:26-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Equivalent\",\"operand\":[{\"name\":\"ToString\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"13\",\"locator\":\"18:32-18:39\",\"resultTypeName\":\"{http://hl7.org/fhir}EncounterStatus\",\"path\":\"status\",\"scope\":\"E\",\"type\":\"Property\"}]},{\"localId\":\"14\",\"locator\":\"18:43-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"valueType\":\"{urn:hl7-org:elm-types:r1}String\",\"value\":\"finished\",\"type\":\"Literal\"}]}}}},{\"localId\":\"20\",\"locator\":\"20:1-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"numeratorExclusion\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"20\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"numeratorExclusion\\\"\",\":\\n    \"]},{\"r\":\"19\",\"s\":[{\"value\":[\"\\\"num\\\"\"]}]}]}}],\"expression\":{\"localId\":\"19\",\"locator\":\"21:5-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"type\":\"ExpressionRef\"}},{\"localId\":\"39\",\"locator\":\"23:1-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"name\":\"ToCode\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"39\",\"s\":[{\"value\":[\"\",\"define function \",\"ToCode\",\"(\",\"coding\",\" \"]},{\"r\":\"21\",\"s\":[{\"value\":[\"FHIR\",\".\",\"Coding\"]}]},{\"value\":[\"):\\n \"]},{\"r\":\"38\",\"s\":[{\"r\":\"38\",\"s\":[{\"value\":[\"if \"]},{\"r\":\"23\",\"s\":[{\"r\":\"22\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\" is null\"]}]},{\"r\":\"24\",\"value\":[\" then\\n   \",\"null\",\"\\n      else\\n        \"]},{\"r\":\"37\",\"s\":[{\"value\":[\"System\",\".\",\"Code\",\" {\\n           \"]},{\"s\":[{\"value\":[\"code\",\": \"]},{\"r\":\"27\",\"s\":[{\"r\":\"26\",\"s\":[{\"r\":\"25\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"26\",\"s\":[{\"value\":[\"code\"]}]}]},{\"value\":[\".\"]},{\"r\":\"27\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"system\",\": \"]},{\"r\":\"30\",\"s\":[{\"r\":\"29\",\"s\":[{\"r\":\"28\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"29\",\"s\":[{\"value\":[\"system\"]}]}]},{\"value\":[\".\"]},{\"r\":\"30\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n          \"]},{\"s\":[{\"value\":[\"version\",\": \"]},{\"r\":\"33\",\"s\":[{\"r\":\"32\",\"s\":[{\"r\":\"31\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"32\",\"s\":[{\"value\":[\"version\"]}]}]},{\"value\":[\".\"]},{\"r\":\"33\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"display\",\": \"]},{\"r\":\"36\",\"s\":[{\"r\":\"35\",\"s\":[{\"r\":\"34\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"35\",\"s\":[{\"value\":[\"display\"]}]}]},{\"value\":[\".\"]},{\"r\":\"36\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\"\\n           }\"]}]}]}]}]}}],\"expression\":{\"localId\":\"38\",\"locator\":\"24:2-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"If\",\"condition\":{\"localId\":\"23\",\"locator\":\"24:5-24:18\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"IsNull\",\"operand\":{\"localId\":\"22\",\"locator\":\"24:5-24:10\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}},\"then\":{\"asType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"As\",\"operand\":{\"localId\":\"24\",\"locator\":\"25:4-25:7\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Any\",\"type\":\"Null\"}},\"else\":{\"localId\":\"37\",\"locator\":\"27:9-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"classType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"Instance\",\"element\":[{\"name\":\"code\",\"value\":{\"localId\":\"27\",\"locator\":\"28:18-28:34\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"26\",\"locator\":\"28:18-28:28\",\"resultTypeName\":\"{http://hl7.org/fhir}code\",\"path\":\"code\",\"type\":\"Property\",\"source\":{\"localId\":\"25\",\"locator\":\"28:18-28:23\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"system\",\"value\":{\"localId\":\"30\",\"locator\":\"29:20-29:38\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"29\",\"locator\":\"29:20-29:32\",\"resultTypeName\":\"{http://hl7.org/fhir}uri\",\"path\":\"system\",\"type\":\"Property\",\"source\":{\"localId\":\"28\",\"locator\":\"29:20-29:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"version\",\"value\":{\"localId\":\"33\",\"locator\":\"30:20-30:39\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"32\",\"locator\":\"30:20-30:33\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"version\",\"type\":\"Property\",\"source\":{\"localId\":\"31\",\"locator\":\"30:20-30:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"display\",\"value\":{\"localId\":\"36\",\"locator\":\"31:21-31:40\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"35\",\"locator\":\"31:21-31:34\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"display\",\"type\":\"Property\",\"source\":{\"localId\":\"34\",\"locator\":\"31:21-31:26\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}}]}},\"operand\":[{\"name\":\"coding\",\"operandTypeSpecifier\":{\"localId\":\"21\",\"locator\":\"23:31-23:41\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"{http://hl7.org/fhir}Coding\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"42\",\"locator\":\"34:1-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"fun\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"42\",\"s\":[{\"value\":[\"\",\"define function \",\"fun\",\"(\",\"notPascalCase\",\" \"]},{\"r\":\"40\",\"s\":[{\"value\":[\"Integer\"]}]},{\"value\":[\" ):\\n  \"]},{\"r\":\"41\",\"s\":[{\"r\":\"41\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"41\",\"locator\":\"35:3-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"notPascalCase\",\"operandTypeSpecifier\":{\"localId\":\"40\",\"locator\":\"34:35-34:41\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Integer\",\"name\":\"{urn:hl7-org:elm-types:r1}Integer\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"45\",\"locator\":\"37:1-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"isFinishedEncounter\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"45\",\"s\":[{\"value\":[\"\",\"define function \",\"\\\"isFinishedEncounter\\\"\",\"(\",\"Enc\",\" \"]},{\"r\":\"43\",\"s\":[{\"value\":[\"Encounter\"]}]},{\"value\":[\"):\\n  \"]},{\"r\":\"44\",\"s\":[{\"r\":\"44\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"44\",\"locator\":\"38:3-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[]}]}},\"externalErrors\":[]}"

        before('Create Measure, Measure Group and Set Access Token', () => {

            cy.setAccessTokenCookie()
            cy.getCookie('accessToken').then((accessToken) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measure',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'measureName': newMeasureName,
                        'cqlLibraryName': newCqlLibraryName,
                        'model': 'QI-Core v4.1.1',
                        "ecqmTitle": 'eCQMTitle',
                        'cql': measureCQL,
                        'elmJson': elmJson,
                        'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                        'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                        'versionId': uuidv4(),
                        'measureSetId': uuidv4(),
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
                    console.log(response)
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/measureId', response.body.id)
                    cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                    cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
                })
            })
            MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')
        })

        after('Clean up', () => {

            Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

        })

        it('Get Measure bundle data and verify that the Supplemental data elements and Risk Adjustment variables are added', () => {

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
                        expect(response.body.entry[0].resource.supplementalData[0].criteria.expression).to.eql('SDE Race')
                        expect(response.body.entry[0].resource.supplementalData[0].description).to.eql('SDE Race description')
                        expect(response.body.entry[0].resource.supplementalData[1].criteria.expression).to.eql('Risk Adjustments example')
                        expect(response.body.entry[0].resource.supplementalData[1].description).to.eql('Risk Adjustments example description')
                    })
                })
            })
        })
    })

    describe('Measure bundle end point returns Measure Population Description', () => {

        beforeEach('Create Measure, Measure group and Set Access token', () => {

            newMeasureName = measureName + randValue
            newCqlLibraryName = CqlLibraryName + randValue

            cy.setAccessTokenCookie()

            //Create New Measure
            CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, CVmeasureCQL)

        })

        afterEach('Clean up', () => {

            Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

        })

        it('Get Measure bundle data and verify that the description fields for Measure Population criteria are added', () => {

            cy.getCookie('accessToken').then((accessToken) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {

                    cy.request({
                        url: '/api/measures/' + id + '/groups/',
                        method: 'POST',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
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
                                    "description": "Initial Population 1 Description"
                                },
                                {
                                    "id": uuidv4(),
                                    "name": "initialPopulation",
                                    "definition": PopIniPop,
                                    "description": "Initial Population 2 Description"
                                },
                                {
                                    "id": "809794a0-7768-407b-a28e-74226168fafe",
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
                                    "id": "63895363-9f2a-43fe-b63a-7b3bd4b25f08",
                                    "name": "numerator",
                                    "definition": PopNum,
                                    "description": "Numerator Description"
                                },
                                {
                                    "id": uuidv4(),
                                    "name": "numeratorExclusion",
                                    "definition": PopNumex,
                                    "description": "Numerator Exclusion Description"
                                }
                            ],
                            "measureObservations": [
                                {
                                    "id": uuidv4(),
                                    "definition": "isFinishedEncounter",
                                    "description": "Denominator Observation Description",
                                    "criteriaReference": "809794a0-7768-407b-a28e-74226168fafe",
                                    "aggregateMethod": "Count"
                                },
                                {
                                    "id": uuidv4(),
                                    "definition": "isFinishedEncounter",
                                    "description": "Numerator Observation Description",
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
                            authorization: 'Bearer ' + accessToken.value
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
