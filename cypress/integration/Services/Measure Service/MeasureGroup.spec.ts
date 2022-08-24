import {Utilities} from "../../../Shared/Utilities"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasureCQL} from "../../../Shared/MeasureCQL"

let measureName = 'MeasureName ' + Date.now()
let CqlLibraryName = 'CQLLibraryName' + Date.now()
let measureScoring = 'Proportion'
let newMeasureName = ''
let newCqlLibraryName = ''
let popMeasureCQL = MeasureCQL.SBTEST_CQL

describe('Measure Service: Test Case Endpoints', () => {

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
        let measureCQL = "library EXM124v7QICore4 version '7.0.000'\n\n/*\nBased on CMS124v7 - Cervical Cancer Screening\n*/\n\n/*\nThis example is a work in progress and should not be considered a final specification\nor recommendation for guidance. This example will help guide and direct the process\nof finding conventions and usage patterns that meet the needs of the various stakeholders\nin the measure development community.\n*/\n\nusing QICore version '4.1.000'\n\ninclude FHIRHelpers version '4.0.001'\n\ninclude HospiceQICore4 version '2.0.000' called Hospice\ninclude AdultOutpatientEncountersQICore4 version '2.0.000' called AdultOutpatientEncounters\ninclude MATGlobalCommonFunctionsQICore4 version '5.0.000' called Global\ninclude SupplementalDataElementsQICore4 version '2.0.000' called SDE\n\ncodesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n\nvalueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\nvalueset \"Race\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836'\nvalueset \"Ethnicity\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837'\nvalueset \"Payer\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591'\nvalueset \"Female\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2'\nvalueset \"Home Healthcare Services\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016'\nvalueset \"Hysterectomy with No Residual Cervix\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014'\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nvalueset \"Pap Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017'\nvalueset \"Preventive Care Services - Established Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025'\nvalueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023'\nvalueset \"HPV Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059'\n\ncode \"Congenital absence of cervix (disorder)\": '37687000' from \"SNOMEDCT:2017-09\" display 'Congenital absence of cervix (disorder)'\n\nparameter \"Measurement Period\" Interval<DateTime>\n  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n  \ncontext Patient\n\ndefine \"SDE Ethnicity\":\n\n  SDE.\"SDE Ethnicity\"\n  \n  \ndefine \"SDE Payer\":\n\n  SDE.\"SDE Payer\"\n  \n  \ndefine \"SDE Race\":\n\n  SDE.\"SDE Race\"\n  \n  \ndefine \"SDE Sex\":\n\n  SDE.\"SDE Sex\"\n  \n  \ndefine \"Initial Population\":\n  Patient.gender = 'female'\n      and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period\") in Interval[23, 64]\n      and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n      \ndefine \"Denominator\":\n        \"Initial Population\"\n        \ndefine \"Denominator Exclusion\":\n    Hospice.\"Has Hospice\"\n          or exists \"Surgical Absence of Cervix\"\n         or exists \"Absence of Cervix\"\n         \ndefine \"Absence of Cervix\":\n    [Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n          where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n          \ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n            and NoCervixHysterectomy.status = 'completed'\n            \ndefine \"Numerator\":\n    exists \"Pap Test Within 3 Years\"\n        or exists \"Pap Test With HPV Within 5 Years\"\n        \ndefine \"Pap Test with Results\":\n    [Observation: \"Pap Test\"] PapTest\n        where PapTest.value is not null\n            and PapTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n            \ndefine \"Pap Test Within 3 Years\":\n    \"Pap Test with Results\" PapTest\n        where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n        \ndefine \"PapTest Within 5 Years\":\n    ( \"Pap Test with Results\" PapTestOver30YearsOld\n            where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n                and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n    )\n    \ndefine \"Pap Test With HPV Within 5 Years\":\n    \"PapTest Within 5 Years\" PapTestOver30YearsOld\n        with [Observation: \"HPV Test\"] HPVTest\n            such that HPVTest.value is not null\n        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n                and HPVTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n                "

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)

    })
    it('Create Proportion measure group', () => {

        let PopIniPop = 'Initial Population'
        let PopNum = 'Absence of Cervix'
        let PopDenom = 'Pap Test with Results'

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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[2].definition).to.eql('Pap Test with Results')
                })
            })
        })
    })

    it('Update measure group to Ratio', () => {

        let PopIniPop = 'Initial Population'
        let PopNum = 'Absence of Cervix'
        let PopDenom = 'Pap Test with Results'
        let PopNumExc = 'Surgical Absence of Cervix'
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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[2].definition).to.eql('Surgical Absence of Cervix')
                    expect(response.body.populations[3].definition).to.eql('Pap Test with Results')
                })
            })
        })
    })

    it('Add UCUM Scoring unit to the Measure Group', () =>  {

        let PopIniPop = 'Initial Population'
        let PopNum = 'Absence of Cervix'
        let PopDenom = 'Pap Test with Results'

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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[2].definition).to.eql('Pap Test with Results')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                })
            })
        })

    })

    it('Update UCUM Scoring unit for the Measure Group', () =>  {

        let PopIniPop = 'Initial Population'
        let PopNum = 'Absence of Cervix'
        let PopDenom = 'Pap Test with Results'

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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[2].definition).to.eql('Pap Test with Results')
                    expect(response.body.scoringUnit.label).to.eql('455 455')
                })
            })
        })

    })

    it('Add Second Initial Population for Ratio Measure', () => {

        let PopIniPop = 'Initial Population'
        let SecondPopInPop = 'SDE Race'
        let PopNum = 'Absence of Cervix'
        let PopDenom = 'Pap Test with Results'

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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('SDE Race')
                    expect(response.body.populations[2].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[3].definition).to.eql('Pap Test with Results')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                })
            })
        })
    })

    it('Add and Delete Second Initial Population for Ratio Measure', () => {

        let PopIniPop = 'Initial Population'
        let SecondPopInPop = 'SDE Race'
        let PopNum = 'Absence of Cervix'
        let PopDenom = 'Pap Test with Results'
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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('SDE Race')
                    expect(response.body.populations[2].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[3].definition).to.eql('Pap Test with Results')
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
                    expect(response.body.populations[0].definition).to.eql('Initial Population')
                    expect(response.body.populations[1].definition).to.eql('Absence of Cervix')
                    expect(response.body.populations[2].definition).to.eql('Pap Test with Results')
                    expect(response.body.scoringUnit.label).to.eql('ml milliLiters')
                })
            })
        })
    })
})

describe('Verify Population Basis is required when creating group on backend', () => {
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
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, popMeasureCQL)
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
                                "_id" : "",
                                "name" : "initialPopulation",
                                "definition" : 'ipp'
                            },
                            {
                                "_id" : "",
                                "name" : "denominator",
                                "definition" : 'denom'
                            },
                            {
                                "_id" : "",
                                "name" : "denominatorExclusion",
                                "definition" : ""
                            },
                            {
                                "_id" : "",
                                "name" : "denominatorException",
                                "definition" : ""
                            },
                            {
                                "_id" : "",
                                "name" : "numerator",
                                "definition" : 'num'
                            },
                            {
                                "_id" : "",
                                "name" : "numeratorExclusion",
                                "definition" : ""
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
        let measureCQL = "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.0.001' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  exists [\"Encounter\"] E where E.period.start during \"Measurement Period\"\n  \ndefine \"denom\":\n  \"ipp\"\n  \ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n  \ndefine \"numeratorExclusion\":\n    \"num\"\n    \ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n           version: coding.version.value,\n           display: coding.display.value\n           }\n           \ndefine function fun(notPascalCase Integer ):\n  true\n  \ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true\n  \n"

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