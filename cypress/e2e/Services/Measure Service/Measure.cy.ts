import { Utilities } from "../../../Shared/Utilities"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { Environment } from "../../../Shared/Environment"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { v4 as uuidv4 } from 'uuid'
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

let measureName = ''
let newMeasureName = ''
let CQLLibraryName = ''
let newCQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let harpUser = Environment.credentials().harpUser
let harpUserALT = Environment.credentials().harpUserALT
let measureNameU = 'TestMeasure' + Date.now() + 1
let CqlLibraryNameU = 'TestLibrary' + Date.now() + 1
let defaultUser = ''
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let measureCQL = MeasureCQL.SBTEST_CQL
let eCQMTitle = 'eCQMTitle'
let versionIdPath = 'cypress/fixtures/versionId'
let randValue = (Math.floor((Math.random() * 1000) + 1))
const adminAPIKey = Environment.credentials().adminApiKey

describe('Measure Service: QICore Measure', () => {

    beforeEach('Set Access Token', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.clearAllSessionStorage({ log: true })
        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue
    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName, false, false)

    })

    it('Create QICore Measure, successful creation', () => {


        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate,
                    "testCaseConfiguration": {
                        "id": null,
                        "sdeIncluded": null
                    },
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
            })

        })
    })

    it('Verify Supplemental Data Elements and Risk Adjustment Variables are added to create Measure Model', () => {

        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate,
                    "supplementalData": [
                        {
                            "definition": "supplementalDataDefinition"
                        },
                        {
                            "definition": "supplementalDataDefinition2"
                        }
                    ],
                    "supplementalDataDescription": "SupplementalData Description",
                    "riskAdjustments": [
                        {
                            "definition": "riskAdjustmentDefinition"
                        },
                        {
                            "definition": "riskAdjustmentDefinition2"
                        }
                    ],
                    "riskAdjustmentDescription": "RiskAdjustment Description"
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                expect(response.body.supplementalData[0].definition).to.eql('supplementalDataDefinition')
                expect(response.body.supplementalData[1].definition).to.eql('supplementalDataDefinition2')
                expect(response.body.supplementalDataDescription).to.eql('SupplementalData Description')
                expect(response.body.riskAdjustments[0].definition).to.eql('riskAdjustmentDefinition')
                expect(response.body.riskAdjustments[1].definition).to.eql('riskAdjustmentDefinition2')
                expect(response.body.riskAdjustmentDescription).to.eql('RiskAdjustment Description')
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
            })

        })

    })
})

describe('Measure Service: GET Requests tests', () => {
    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })
    //Get All Measures
    it('Get all Measures', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                cy.get(response.body.content.length)
                expect(response.body.content[0].id).to.be.exist
            })
        })
    })

    //Get Measures by User
    it('Get all Measures created by logged in User', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measures?currentUser=true',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                }
            }).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body).to.not.be.null
                expect(response.body.content).to.be.a('array')
                cy.get(response.body.content.length)
                expect(response.body.content[0].id).to.be.exist
                expect(response.body.content[0].measureSet.owner).to.eql(harpUser)
            })
        })
    })
})
describe('Measure Service: Error validations', () => {
    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()
    })
    //Measure Name Validations
    it('Validation Error: Measure Name empty', () => {
        measureName = ''
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("Measure Name is required.")
            })
        })
    })

    it('Validation Error: Measure Name does not contain alphabets', () => {
        measureName = '123456'
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("A measure name must contain at least one letter.")
            })
        })
    })

    it('Validation Error: Measure Name contains under scores', () => {
        measureName = 'Test_Measure'
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("Measure Name can not contain underscores.")
            })
        })
    })

    it('Validation Error: Measure Name contains more than 500 characters', () => {
        measureName = 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' +
            'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwqwertyqwertyqwertyqwertyqwertyq'
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.measureName).to.eql("Measure Name can not be more than 500 characters.")
            })
        })
    })

    it('Validation Error: Model Invalid Value', () => {
        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue
        model = 'QI-CoreINVALID'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
            })
        })
    })

    it('Validation Error: Missing Measure Id', () => {
        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                //expect(response.body.validationErrors.measureSetId).to.eql("Measure Set ID is required.")
            })
        })
    })
})

describe('Measure Service: CQL Library name validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    it('Validation Error: CQL library Name contains spaces', () => {

        measureName = 'test'
        CQLLibraryName = 'Test 222'
        model = 'QI-Core v4.1.1'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                console.log('validations errors were:\n' + (response.body.validationErrors.measure).toString())
                expect(response.body.validationErrors.measure).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.")
            })
        })
    })

    it('Validation Error: CQL library Name contains underscores', () => {

        measureName = 'test'
        CQLLibraryName = 'Test_222'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                console.log('validations errors were:\n' + (response.body.validationErrors.measure).toString())
                expect(response.body.validationErrors.measure).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.")
            })
        })
    })

    it('Validation Error: CQL library Name contains special characters', () => {

        measureName = 'test'
        CQLLibraryName = 'Test!@#%$^&'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                console.log('validations errors were:\n' + (response.body.validationErrors.measure).toString())
                expect(response.body.validationErrors.measure).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.")
            })
        })
    })

    it('Validation Error: CQL library Name empty', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureNameU,
                    "cqlLibraryName": "",
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("Measure Library Name is required.")
            })
        })
    })

    it('Validation Error: CQL library Name does not starts with an upper case letter', () => {

        CQLLibraryName = 'test'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureNameU,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                console.log('validations errors were:\n' + (response.body.validationErrors.measure).toString())
                expect(response.body.validationErrors.measure).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.")
            })
        })
    })


    it('Validation Error: CQL library Name does not contain alphabets', () => {

        measureName = 'test'
        CQLLibraryName = '123456'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                console.log('validations errors were:\n' + (response.body.validationErrors.measure).toString())
                expect(response.body.validationErrors.measure).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.")
            })
        })
    })

    it('Validation Error: CQL library Name start with number', () => {

        measureName = 'test'
        CQLLibraryName = '123Test'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                console.log('validations errors were:\n' + (response.body.validationErrors.measure).toString())
                expect(response.body.validationErrors.measure).to.eql("Library name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters except of underscore for QDM.")
            })
        })
    })

    it('Validation Error: CQL library Name already exists', () => {

        newMeasureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'CQLLibraryName' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, CQLLibraryName, measureCQL)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": 'measureName6677',
                    "cqlLibraryName": CQLLibraryName,
                    "model": "QI-Core v4.1.1",
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "cql": "library SimpleFhirMeasure version '0.0.001'\n\nusing FHIR version '4.0.1'\n\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\n\nparameter \"Measurement Period\" Interval<DateTime>\n\ncontext Patient\n\ndefine \"ipp\":\n  exists [\"Encounter\"] E where E.period.start during \"Measurement Period\"\n\ndefine \"denom\":\n \"ipp\"\n\ndefine \"num\":\n  exists [\"Encounter\"] E where E.status ~ 'finished'\n\ndefine \"numeratorExclusion\":\n    \"num\"\n\ndefine function ToCode(coding FHIR.Coding):\n if coding is null then\n   null\n      else\n        System.Code {\n           code: coding.code.value,\n           system: coding.system.value,\n          version: coding.version.value,\n           display: coding.display.value\n           }\n\ndefine function fun(notPascalCase Integer ):\n  true\n\ndefine function \"isFinishedEncounter\"(Enc Encounter):\n  true\n",
                    "elmJson": "{\"library\":{\"identifier\":{\"id\":\"SimpleFhirMeasure\",\"version\":\"0.0.001\"},\"schemaIdentifier\":{\"id\":\"urn:hl7-org:elm\",\"version\":\"r1\"},\"usings\":{\"def\":[{\"localIdentifier\":\"System\",\"uri\":\"urn:hl7-org:elm-types:r1\"},{\"localId\":\"1\",\"locator\":\"3:1-3:26\",\"localIdentifier\":\"FHIR\",\"uri\":\"http://hl7.org/fhir\",\"version\":\"4.0.1\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"1\",\"s\":[{\"value\":[\"\",\"using \"]},{\"s\":[{\"value\":[\"FHIR\"]}]},{\"value\":[\" version \",\"'4.0.1'\"]}]}}]}]},\"includes\":{\"def\":[{\"localId\":\"2\",\"locator\":\"5:1-5:56\",\"localIdentifier\":\"FHIRHelpers\",\"path\":\"FHIRHelpers\",\"version\":\"4.1.000\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"2\",\"s\":[{\"value\":[\"\",\"include \"]},{\"s\":[{\"value\":[\"FHIRHelpers\"]}]},{\"value\":[\" version \",\"'4.1.000'\",\" called \",\"FHIRHelpers\"]}]}}]}]},\"parameters\":{\"def\":[{\"localId\":\"5\",\"locator\":\"7:1-7:49\",\"name\":\"Measurement Period\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"5\",\"s\":[{\"value\":[\"\",\"parameter \",\"\\\"Measurement Period\\\"\",\" \"]},{\"r\":\"4\",\"s\":[{\"value\":[\"Interval<\"]},{\"r\":\"3\",\"s\":[{\"value\":[\"DateTime\"]}]},{\"value\":[\">\"]}]}]}}],\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"parameterTypeSpecifier\":{\"localId\":\"4\",\"locator\":\"7:32-7:49\",\"type\":\"IntervalTypeSpecifier\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}},\"pointType\":{\"localId\":\"3\",\"locator\":\"7:41-7:48\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]},\"contexts\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\"}]},\"statements\":{\"def\":[{\"locator\":\"9:1-9:15\",\"name\":\"Patient\",\"context\":\"Patient\",\"expression\":{\"type\":\"SingletonFrom\",\"operand\":{\"locator\":\"9:1-9:15\",\"dataType\":\"{http://hl7.org/fhir}Patient\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Patient\",\"type\":\"Retrieve\"}}},{\"localId\":\"15\",\"locator\":\"11:1-12:73\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"15\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"ipp\\\"\",\":\\n  \"]},{\"r\":\"14\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"13\",\"s\":[{\"s\":[{\"r\":\"7\",\"s\":[{\"r\":\"6\",\"s\":[{\"r\":\"6\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"12\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"12\",\"s\":[{\"r\":\"10\",\"s\":[{\"r\":\"9\",\"s\":[{\"r\":\"8\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"9\",\"s\":[{\"value\":[\"period\"]}]}]},{\"value\":[\".\"]},{\"r\":\"10\",\"s\":[{\"value\":[\"start\"]}]}]},{\"r\":\"12\",\"value\":[\" \",\"during\",\" \"]},{\"r\":\"11\",\"s\":[{\"value\":[\"\\\"Measurement Period\\\"\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"14\",\"locator\":\"12:3-12:73\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"13\",\"locator\":\"12:10-12:73\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"7\",\"locator\":\"12:10-12:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"6\",\"locator\":\"12:10-12:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"12\",\"locator\":\"12:26-12:73\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"In\",\"operand\":[{\"name\":\"ToDateTime\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"10\",\"locator\":\"12:32-12:45\",\"resultTypeName\":\"{http://hl7.org/fhir}dateTime\",\"path\":\"start\",\"type\":\"Property\",\"source\":{\"localId\":\"9\",\"locator\":\"12:32-12:39\",\"resultTypeName\":\"{http://hl7.org/fhir}Period\",\"path\":\"period\",\"scope\":\"E\",\"type\":\"Property\"}}]},{\"localId\":\"11\",\"locator\":\"12:54-12:73\",\"name\":\"Measurement Period\",\"type\":\"ParameterRef\",\"resultTypeSpecifier\":{\"type\":\"IntervalTypeSpecifier\",\"pointType\":{\"name\":\"{urn:hl7-org:elm-types:r1}DateTime\",\"type\":\"NamedTypeSpecifier\"}}}]}}}},{\"localId\":\"17\",\"locator\":\"14:1-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"denom\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"17\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"denom\\\"\",\":\\n \"]},{\"r\":\"16\",\"s\":[{\"value\":[\"\\\"ipp\\\"\"]}]}]}}],\"expression\":{\"localId\":\"16\",\"locator\":\"15:2-15:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"ipp\",\"type\":\"ExpressionRef\"}},{\"localId\":\"26\",\"locator\":\"17:1-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"26\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"num\\\"\",\":\\n  \"]},{\"r\":\"25\",\"s\":[{\"value\":[\"exists \"]},{\"r\":\"24\",\"s\":[{\"s\":[{\"r\":\"19\",\"s\":[{\"r\":\"18\",\"s\":[{\"r\":\"18\",\"s\":[{\"value\":[\"[\",\"\\\"Encounter\\\"\",\"]\"]}]}]},{\"value\":[\" \",\"E\"]}]}]},{\"value\":[\" \"]},{\"r\":\"23\",\"s\":[{\"value\":[\"where \"]},{\"r\":\"23\",\"s\":[{\"r\":\"21\",\"s\":[{\"r\":\"20\",\"s\":[{\"value\":[\"E\"]}]},{\"value\":[\".\"]},{\"r\":\"21\",\"s\":[{\"value\":[\"status\"]}]}]},{\"value\":[\" \",\"~\",\" \"]},{\"r\":\"22\",\"s\":[{\"value\":[\"'finished'\"]}]}]}]}]}]}]}}],\"expression\":{\"localId\":\"25\",\"locator\":\"18:3-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Exists\",\"operand\":{\"localId\":\"24\",\"locator\":\"18:10-18:52\",\"type\":\"Query\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"source\":[{\"localId\":\"19\",\"locator\":\"18:10-18:24\",\"alias\":\"E\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}},\"expression\":{\"localId\":\"18\",\"locator\":\"18:10-18:22\",\"dataType\":\"{http://hl7.org/fhir}Encounter\",\"templateId\":\"http://hl7.org/fhir/StructureDefinition/Encounter\",\"type\":\"Retrieve\",\"resultTypeSpecifier\":{\"type\":\"ListTypeSpecifier\",\"elementType\":{\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}}}],\"relationship\":[],\"where\":{\"localId\":\"23\",\"locator\":\"18:26-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"Equivalent\",\"operand\":[{\"name\":\"ToString\",\"libraryName\":\"FHIRHelpers\",\"type\":\"FunctionRef\",\"operand\":[{\"localId\":\"21\",\"locator\":\"18:32-18:39\",\"resultTypeName\":\"{http://hl7.org/fhir}EncounterStatus\",\"path\":\"status\",\"scope\":\"E\",\"type\":\"Property\"}]},{\"localId\":\"22\",\"locator\":\"18:43-18:52\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"valueType\":\"{urn:hl7-org:elm-types:r1}String\",\"value\":\"finished\",\"type\":\"Literal\"}]}}}},{\"localId\":\"28\",\"locator\":\"20:1-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"numeratorExclusion\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"28\",\"s\":[{\"value\":[\"\",\"define \",\"\\\"numeratorExclusion\\\"\",\":\\n    \"]},{\"r\":\"27\",\"s\":[{\"value\":[\"\\\"num\\\"\"]}]}]}}],\"expression\":{\"localId\":\"27\",\"locator\":\"21:5-21:9\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"num\",\"type\":\"ExpressionRef\"}},{\"localId\":\"47\",\"locator\":\"23:1-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"name\":\"ToCode\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"47\",\"s\":[{\"value\":[\"\",\"define function \",\"ToCode\",\"(\",\"coding\",\" \"]},{\"r\":\"29\",\"s\":[{\"value\":[\"FHIR\",\".\",\"Coding\"]}]},{\"value\":[\"):\\n \"]},{\"r\":\"46\",\"s\":[{\"r\":\"46\",\"s\":[{\"value\":[\"if \"]},{\"r\":\"31\",\"s\":[{\"r\":\"30\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\" is null\"]}]},{\"r\":\"32\",\"value\":[\" then\\n   \",\"null\",\"\\n      else\\n        \"]},{\"r\":\"45\",\"s\":[{\"value\":[\"System\",\".\",\"Code\",\" {\\n           \"]},{\"s\":[{\"value\":[\"code\",\": \"]},{\"r\":\"35\",\"s\":[{\"r\":\"34\",\"s\":[{\"r\":\"33\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"34\",\"s\":[{\"value\":[\"code\"]}]}]},{\"value\":[\".\"]},{\"r\":\"35\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"system\",\": \"]},{\"r\":\"38\",\"s\":[{\"r\":\"37\",\"s\":[{\"r\":\"36\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"37\",\"s\":[{\"value\":[\"system\"]}]}]},{\"value\":[\".\"]},{\"r\":\"38\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n          \"]},{\"s\":[{\"value\":[\"version\",\": \"]},{\"r\":\"41\",\"s\":[{\"r\":\"40\",\"s\":[{\"r\":\"39\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"40\",\"s\":[{\"value\":[\"version\"]}]}]},{\"value\":[\".\"]},{\"r\":\"41\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\",\\n           \"]},{\"s\":[{\"value\":[\"display\",\": \"]},{\"r\":\"44\",\"s\":[{\"r\":\"43\",\"s\":[{\"r\":\"42\",\"s\":[{\"value\":[\"coding\"]}]},{\"value\":[\".\"]},{\"r\":\"43\",\"s\":[{\"value\":[\"display\"]}]}]},{\"value\":[\".\"]},{\"r\":\"44\",\"s\":[{\"value\":[\"value\"]}]}]}]},{\"value\":[\"\\n           }\"]}]}]}]}]}}],\"expression\":{\"localId\":\"46\",\"locator\":\"24:2-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"If\",\"condition\":{\"localId\":\"31\",\"locator\":\"24:5-24:18\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"type\":\"IsNull\",\"operand\":{\"localId\":\"30\",\"locator\":\"24:5-24:10\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}},\"then\":{\"asType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"As\",\"operand\":{\"localId\":\"32\",\"locator\":\"25:4-25:7\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Any\",\"type\":\"Null\"}},\"else\":{\"localId\":\"45\",\"locator\":\"27:9-32:12\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Code\",\"classType\":\"{urn:hl7-org:elm-types:r1}Code\",\"type\":\"Instance\",\"element\":[{\"name\":\"code\",\"value\":{\"localId\":\"35\",\"locator\":\"28:18-28:34\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"34\",\"locator\":\"28:18-28:28\",\"resultTypeName\":\"{http://hl7.org/fhir}code\",\"path\":\"code\",\"type\":\"Property\",\"source\":{\"localId\":\"33\",\"locator\":\"28:18-28:23\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"system\",\"value\":{\"localId\":\"38\",\"locator\":\"29:20-29:38\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"37\",\"locator\":\"29:20-29:32\",\"resultTypeName\":\"{http://hl7.org/fhir}uri\",\"path\":\"system\",\"type\":\"Property\",\"source\":{\"localId\":\"36\",\"locator\":\"29:20-29:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"version\",\"value\":{\"localId\":\"41\",\"locator\":\"30:20-30:39\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"40\",\"locator\":\"30:20-30:33\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"version\",\"type\":\"Property\",\"source\":{\"localId\":\"39\",\"locator\":\"30:20-30:25\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}},{\"name\":\"display\",\"value\":{\"localId\":\"44\",\"locator\":\"31:21-31:40\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}String\",\"path\":\"value\",\"type\":\"Property\",\"source\":{\"localId\":\"43\",\"locator\":\"31:21-31:34\",\"resultTypeName\":\"{http://hl7.org/fhir}string\",\"path\":\"display\",\"type\":\"Property\",\"source\":{\"localId\":\"42\",\"locator\":\"31:21-31:26\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"coding\",\"type\":\"OperandRef\"}}}}]}},\"operand\":[{\"name\":\"coding\",\"operandTypeSpecifier\":{\"localId\":\"29\",\"locator\":\"23:31-23:41\",\"resultTypeName\":\"{http://hl7.org/fhir}Coding\",\"name\":\"{http://hl7.org/fhir}Coding\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"50\",\"locator\":\"34:1-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"fun\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"50\",\"s\":[{\"value\":[\"\",\"define function \",\"fun\",\"(\",\"notPascalCase\",\" \"]},{\"r\":\"48\",\"s\":[{\"value\":[\"Integer\"]}]},{\"value\":[\" ):\\n  \"]},{\"r\":\"49\",\"s\":[{\"r\":\"49\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"49\",\"locator\":\"35:3-35:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"notPascalCase\",\"operandTypeSpecifier\":{\"localId\":\"48\",\"locator\":\"34:35-34:41\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Integer\",\"name\":\"{urn:hl7-org:elm-types:r1}Integer\",\"type\":\"NamedTypeSpecifier\"}}]},{\"localId\":\"53\",\"locator\":\"37:1-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"name\":\"isFinishedEncounter\",\"context\":\"Patient\",\"accessLevel\":\"Public\",\"type\":\"FunctionDef\",\"annotation\":[{\"type\":\"Annotation\",\"s\":{\"r\":\"53\",\"s\":[{\"value\":[\"\",\"define function \",\"\\\"isFinishedEncounter\\\"\",\"(\",\"Enc\",\" \"]},{\"r\":\"51\",\"s\":[{\"value\":[\"Encounter\"]}]},{\"value\":[\"):\\n  \"]},{\"r\":\"52\",\"s\":[{\"r\":\"52\",\"value\":[\"true\"]}]}]}}],\"expression\":{\"localId\":\"52\",\"locator\":\"38:3-38:6\",\"resultTypeName\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"valueType\":\"{urn:hl7-org:elm-types:r1}Boolean\",\"value\":\"true\",\"type\":\"Literal\"},\"operand\":[{\"name\":\"Enc\",\"operandTypeSpecifier\":{\"localId\":\"51\",\"locator\":\"37:43-37:51\",\"resultTypeName\":\"{http://hl7.org/fhir}Encounter\",\"name\":\"{http://hl7.org/fhir}Encounter\",\"type\":\"NamedTypeSpecifier\"}}]}]}},\"externalErrors\":[]}",
                    "measureScoring": "Cohort",
                    "ecqmTitle": "ecqmTitle",
                    "measurementPeriodStart": "2020-01-01T05:00:00.000+00:00",
                    "measurementPeriodEnd": "2023-01-01T05:00:00.000+00:00"
                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.cqlLibraryName).to.eql("CQL library with given name already exists.")
            })
        })
    })

})

describe('Measure Service: Authentication', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    it('Bad Access Token', () => {

        measureName = 'MeasureScoringTest' + Date.now()
        CQLLibraryName = 'ScoringTestLibrary' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value + 'TEST'
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(401)
                expect(response.statusText).to.eql('Unauthorized')
            })
        })
    })
})

describe('Measure Service: Update Delete Flag', () => {

    beforeEach('Set access token and create a new measure to run update against', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureNameU + randValue
        newCQLLibraryName = CqlLibraryNameU + randValue
        let measureCQL = "library EXM124v7QICore4 version '7.0.000'\n\n/*\nBased on CMS124v7 - Cervical Cancer Screening\n*/\n\n/*\nThis example is a work in progress and should not be considered a final specification\nor recommendation for guidance. This example will help guide and direct the process\nof finding conventions and usage patterns that meet the needs of the various stakeholders\nin the measure development community.\n*/\n\nusing QICore version '4.1.000'\n\ninclude FHIRHelpers version '4.1.000'\n\ninclude HospiceQICore4 version '2.0.000' called Hospice\ninclude AdultOutpatientEncountersQICore4 version '2.0.000' called AdultOutpatientEncounters\ninclude CQMCommon version '1.0.000' called Global\ninclude SupplementalDataElementsQICore4 version '2.0.000' called SDE\n\ncodesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n\nvalueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\nvalueset \"Race\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836'\nvalueset \"Ethnicity\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837'\nvalueset \"Payer\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591'\nvalueset \"Female\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2'\nvalueset \"Home Healthcare Services\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016'\nvalueset \"Hysterectomy with No Residual Cervix\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014'\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nvalueset \"Pap Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017'\nvalueset \"Preventive Care Services - Established Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025'\nvalueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023'\nvalueset \"HPV Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059'\n\ncode \"Congenital absence of cervix (disorder)\": '37687000' from \"SNOMEDCT:2017-09\" display 'Congenital absence of cervix (disorder)'\n\nparameter \"Measurement Period\" Interval<DateTime>\n  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n  \ncontext Patient\n\ndefine \"SDE Ethnicity\":\n\n  SDE.\"SDE Ethnicity\"\n  \n  \ndefine \"SDE Payer\":\n\n  SDE.\"SDE Payer\"\n  \n  \ndefine \"SDE Race\":\n\n  SDE.\"SDE Race\"\n  \n  \ndefine \"SDE Sex\":\n\n  SDE.\"SDE Sex\"\n  \n  \ndefine \"Initial Population\":\n  Patient.gender = 'female'\n      and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period\") in Interval[23, 64]\n      and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n      \ndefine \"Denominator\":\n        \"Initial Population\"\n        \ndefine \"Denominator Exclusion\":\n    Hospice.\"Has Hospice\"\n          or exists \"Surgical Absence of Cervix\"\n         or exists \"Absence of Cervix\"\n         \ndefine \"Absence of Cervix\":\n    [Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n          where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n          \ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n            and NoCervixHysterectomy.status = 'completed'\n            \ndefine \"Numerator\":\n    exists \"Pap Test Within 3 Years\"\n        or exists \"Pap Test With HPV Within 5 Years\"\n        \ndefine \"Pap Test with Results\":\n    [Observation: \"Pap Test\"] PapTest\n        where PapTest.value is not null\n            and PapTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n            \ndefine \"Pap Test Within 3 Years\":\n    \"Pap Test with Results\" PapTest\n        where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n        \ndefine \"PapTest Within 5 Years\":\n    ( \"Pap Test with Results\" PapTestOver30YearsOld\n            where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n                and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n    )\n    \ndefine \"Pap Test With HPV Within 5 Years\":\n    \"PapTest Within 5 Years\" PapTestOver30YearsOld\n        with [Observation: \"HPV Test\"] HPVTest\n            such that HPVTest.value is not null\n        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n                and HPVTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n                "

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        defaultUser = CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)

    })
    //update / delete measure
    it('Update / delete measure', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/measureSetId').should('exist').then((measureSetId) => {
                    cy.readFile(versionIdPath).should('exist').then((vId) => {
                        cy.request({
                            url: '/api/measures/' + id,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": id,
                                "measureName": newMeasureName,
                                "cqlLibraryName": newCQLLibraryName,
                                "model": 'QI-Core v4.1.1',
                                "versionId": vId,
                                "measureSetId": measureSetId,
                                "ecqmTitle": eCQMTitle,
                                "measurementPeriodStart": mpStartDate,
                                "measurementPeriodEnd": mpEndDate,
                                "active": false,
                                "createdBy": defaultUser
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                            cy.log("Measure Deleted successfully")
                        })
                    })
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(404)
                })

            })
        })
    })
    //attempt to update measure that does not belong to user
    it('Attempt to update / delete measure that does not belong to current user', () => {

        newCQLLibraryName = 'TestLibrary2' + Date.now() + 1
        let measureCQL = "library EXM124v7QICore4 version '7.0.000'\n\n/*\nBased on CMS124v7 - Cervical Cancer Screening\n*/\n\n/*\nThis example is a work in progress and should not be considered a final specification\nor recommendation for guidance. This example will help guide and direct the process\nof finding conventions and usage patterns that meet the needs of the various stakeholders\nin the measure development community.\n*/\n\nusing QICore version '4.1.000'\n\ninclude FHIRHelpers version '4.1.000'\n\ninclude HospiceQICore4 version '2.0.000' called Hospice\ninclude AdultOutpatientEncountersQICore4 version '2.0.000' called AdultOutpatientEncounters\ninclude CQMCommon version '1.0.000' called Global\ninclude SupplementalDataElementsQICore4 version '2.0.000' called SDE\n\ncodesystem \"SNOMEDCT:2017-09\": 'http://snomed.info/sct/731000124108' version 'http://snomed.info/sct/731000124108/version/201709'\n\nvalueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\nvalueset \"Race\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836'\nvalueset \"Ethnicity\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837'\nvalueset \"Payer\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591'\nvalueset \"Female\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2'\nvalueset \"Home Healthcare Services\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016'\nvalueset \"Hysterectomy with No Residual Cervix\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014'\nvalueset \"Office Visit\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001'\nvalueset \"Pap Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017'\nvalueset \"Preventive Care Services - Established Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025'\nvalueset \"Preventive Care Services-Initial Office Visit, 18 and Up\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1023'\nvalueset \"HPV Test\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1059'\n\ncode \"Congenital absence of cervix (disorder)\": '37687000' from \"SNOMEDCT:2017-09\" display 'Congenital absence of cervix (disorder)'\n\nparameter \"Measurement Period\" Interval<DateTime>\n  default Interval[@2019-01-01T00:00:00.0, @2020-01-01T00:00:00.0)\n  \ncontext Patient\n\ndefine \"SDE Ethnicity\":\n\n  SDE.\"SDE Ethnicity\"\n  \n  \ndefine \"SDE Payer\":\n\n  SDE.\"SDE Payer\"\n  \n  \ndefine \"SDE Race\":\n\n  SDE.\"SDE Race\"\n  \n  \ndefine \"SDE Sex\":\n\n  SDE.\"SDE Sex\"\n  \n  \ndefine \"Initial Population\":\n  Patient.gender = 'female'\n      and Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of \"Measurement Period\") in Interval[23, 64]\n      and exists AdultOutpatientEncounters.\"Qualifying Encounters\"\n      \ndefine \"Denominator\":\n        \"Initial Population\"\n        \ndefine \"Denominator Exclusion\":\n    Hospice.\"Has Hospice\"\n          or exists \"Surgical Absence of Cervix\"\n         or exists \"Absence of Cervix\"\n         \ndefine \"Absence of Cervix\":\n    [Condition : \"Congenital absence of cervix (disorder)\"] NoCervixBirth\n          where Global.\"Normalize Interval\"(NoCervixBirth.onset) starts before end of \"Measurement Period\"\n          \ndefine \"Surgical Absence of Cervix\":\n    [Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n        where Global.\"Normalize Interval\"(NoCervixHysterectomy.performed) ends before end of \"Measurement Period\"\n            and NoCervixHysterectomy.status = 'completed'\n            \ndefine \"Numerator\":\n    exists \"Pap Test Within 3 Years\"\n        or exists \"Pap Test With HPV Within 5 Years\"\n        \ndefine \"Pap Test with Results\":\n    [Observation: \"Pap Test\"] PapTest\n        where PapTest.value is not null\n            and PapTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n            \ndefine \"Pap Test Within 3 Years\":\n    \"Pap Test with Results\" PapTest\n        where Global.\"Normalize Interval\"(PapTest.effective) ends 3 years or less before end of \"Measurement Period\"\n        \ndefine \"PapTest Within 5 Years\":\n    ( \"Pap Test with Results\" PapTestOver30YearsOld\n            where Global.\"CalendarAgeInYearsAt\"(Patient.birthDate, start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective))>= 30\n                and Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective) ends 5 years or less before end of \"Measurement Period\"\n    )\n    \ndefine \"Pap Test With HPV Within 5 Years\":\n    \"PapTest Within 5 Years\" PapTestOver30YearsOld\n        with [Observation: \"HPV Test\"] HPVTest\n            such that HPVTest.value is not null\n        and Global.\"Normalize Interval\"(HPVTest.effective) starts within 1 day of start of Global.\"Normalize Interval\"(PapTestOver30YearsOld.effective)\n                and HPVTest.status in { 'final', 'amended', 'corrected', 'preliminary' }\n                "
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, measureCQL)

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile(versionIdPath).should('exist').then((vId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "id": id,
                            "measureName": newMeasureName,
                            "cqlLibraryName": newCQLLibraryName,
                            "model": model,
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "ecqmTitle": "eCQMTitle",
                            "measureScoring": 'Ratio',
                            "active": false,
                            //"createdBy": user
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                    })
                })
            })
        })
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.active).to.eql(true)
                })

            })
        })

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })
    //attempt to update / delete measure that does not exist
    it('Attempt to update / delete measure that does not exist', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(versionIdPath).should('exist').then((vId) => {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '1',
                        method: 'PUT',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        body: {
                            "id": id + 1,
                            "measureName": newMeasureName,
                            "cqlLibraryName": newCQLLibraryName,
                            "model": model,
                            "versionId": vId,
                            "measureSetId": uuidv4(),
                            "ecqmTitle": eCQMTitle,
                            "active": false,
                            "createdBy": defaultUser
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(404)
                    })
                })
            })
        })
    })
    it('After updating / deleting measure, test cases should be unavailable, too', () => {

        let title = 'someTitleValue'
        let series = 'SomeSeriesValue'
        let description = 'SomeDescription'
        let TCJson = '{ "resourceType": "Bundle", "id": "1366", "meta": {   "versionId": "1", "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {   "fullUrl": "http://local/Encounter", "resource": { "id":"1", "resourceType": "Encounter","meta": { "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"}, "text": { "status": "generated","div":"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Sep 9th 2021 for Asthma<a name=\\\"mm\\\"/></div>"}, "status": "finished","class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"}, "type": [ { "text": "OutPatient"} ],"subject": { "reference": "Patient/1"},"participant": [ { "individual": { "reference": "Practitioner/30164", "display": "Dr John Doe"}} ],"period": { "start": "2023-09-10T03:34:10.054Z"}}}, { "fullUrl": "http://local/Patient","resource": { "id":"2", "resourceType": "Patient","text": { "status": "generated","div": "<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\">Lizzy Health</div>"},"identifier": [ { "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ { "use": "official", "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'


        TestCasesPage.CreateTestCaseAPI(title, series, description, TCJson)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/measureSetId').should('exist').then((measureSetId) => {
                    cy.readFile(versionIdPath).should('exist').then((vId) => {
                        cy.request({
                            url: '/api/measures/' + id,
                            method: 'PUT',
                            headers: {
                                authorization: 'Bearer ' + accessToken.value
                            },
                            body: {
                                "id": id,
                                "measureName": newMeasureName,
                                "cqlLibraryName": newCQLLibraryName,
                                "model": model,
                                "versionId": vId,
                                "measureSetId": measureSetId,
                                "ecqmTitle": eCQMTitle,
                                "measurementPeriodStart": mpStartDate,
                                "measurementPeriodEnd": mpEndDate,
                                "active": false,
                                "createdBy": defaultUser
                            }
                        }).then((response) => {
                            expect(response.status).to.eql(200)
                        })
                    })
                })
            })

        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(404)
                })

            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',

                    }).then((response) => {
                        expect(response.status).to.eql(404)
                    })
                })
            })
        })
    })
})

describe('Delete QI-Core Measure with admin API Key', () => {

    beforeEach('Create Measure', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureNameU + randValue
        newCQLLibraryName = CqlLibraryNameU + randValue
        let versionMeasureCQL = 'library ' + newCQLLibraryName + ' version \'0.0.000\'\n' +
            'using FHIR version \'4.0.1\'\n' +
            'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
            'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
            'parameter \"Measurement Period\" Interval<DateTime>\n' +
            'context Patient\n' +
            'define \"ipp\":\n' +
            'exists [\"Encounter\": \"Office Visit\"] E where E.period.start during \"Measurement Period\"\n' +
            'define \"denom\":\n' +
            '\"ipp\"\n' +
            'define \"num\":\n' +
            'exists [\"Encounter\": \"Office Visit\"] E where E.status ~ \'finished\'\n'

        defaultUser = CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, versionMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')

    })

    it('Delete versioned QI-Core Measure with admin API key', () => {

        //Version Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/versionId').should('exist').then((vId) => {
                    cy.request({
                        url: '/api/measures/' + measureId + '/version?versionType=major',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT'
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.version).to.include('1.0.000')
                    })
                })
            })
        })

        //Delete Versioned Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey,
                        'harpId': harpUser
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    cy.log("Measure Deleted successfully")
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(404)
                })

            })
        })
    })

    it('Delete QI-Core Draft Measure with admin API key', () => {

        //Delete Draft Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey,
                        'harpId': harpUser
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    cy.log("Measure Deleted successfully")
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(404)
                })

            })
        })
    })

    it('Verify Error Message when Non Measure owner try to Delete Qi Core Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey,
                        'harpId': harpUserALT
                    }
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Response could not be completed because the HARP id of ' + harpUserALT + ' passed in does not match the owner of the measure with the measure id of ' + id + '. The owner of the measure is ' +harpUser)
                })
            })
        })
    })
})

describe('Delete QDM Measure with admin API Key', () => {

    beforeEach('Create Measure', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureNameU + randValue + Date.now()
        newCQLLibraryName = CqlLibraryNameU + randValue + Date.now()
        let QDMMeasureCQL = MeasureCQL.simpleQDM_CQL

        defaultUser = CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', true, QDMMeasureCQL)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'd')
    })

    it('Delete versioned QDM Measure with admin API key', () => {

        //Version Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.include('1.0.000')
                })
            })
        })
        //Delete Versioned Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey,
                        'harpId': harpUser
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    cy.log("Measure Deleted successfully")
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',

                }).then((response) => {
                    expect(response.status).to.eql(404)
                })

            })
        })
    })

    it('Delete QDM Draft Measure with admin API key', () => {

        //Delete Draft Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey,
                        'harpId': harpUser
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    cy.log("Measure Deleted successfully")
                })
            })
        })
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id,
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'GET',
                }).then((response) => {
                    expect(response.status).to.eql(404)
                })
            })
        })
    })

    it('Verify Error Message when Non Measure owner try to Delete QDM Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/admin/measures/' + id,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                        'api-key': adminAPIKey,
                        'harpId': harpUserALT
                    }
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('Response could not be completed because the HARP id of ' + harpUserALT + ' passed in does not match the owner of the measure with the measure id of ' + id + '. The owner of the measure is ' +harpUser)
                })
            })
        })
    })
})

describe('Measurement Period Validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": mpEndDate,
                    "measurementPeriodEnd": mpStartDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Measurement period end date should be greater than measurement period start date.")
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": "",
                    "measurementPeriodEnd": ""
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Measurement period date is required and must be valid")
            })
        })
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": "1823-01-01T05:00:00.000+0000",
                    "measurementPeriodEnd": "3023-01-01T05:00:00.000+0000"
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Measurement periods should be between the years 1900 and 2099.")
            })
        })

    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": "01/01/2021",
                    "measurementPeriodEnd": "01/01/2023"
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql("Bad Request")
            })
        })

    })

    it('Verify error message when the Measurement Period start and end dates are same', () => {

        measureName = 'TestMeasure5' + Date.now()
        CQLLibraryName = 'TestCql5' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": "2023-01-01T05:00:00.000+0000",
                    "measurementPeriodEnd": "2023-01-01T05:00:00.000+0000"
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql("Bad Request")
                expect(response.body.message).to.eql("Measurement period end date should be greater than measurement period start date.")
            })
        })

    })

})

describe('Measure Service: eCQM abbreviated title validations', () => {

    beforeEach('Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    it('Validation error: ecqm abbreviated title empty', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": "",
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.ecqmTitle).to.eql("eCQM Abbreviated Title is required.")
            })
        })

    })

    it('Validation error: ecqm abbreviated title more than 32 characters', () => {

        measureName = 'TestMeasure' + Date.now()
        CQLLibraryName = 'TestCql' + Date.now()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": 'This test is for measure name validation.This test is',
                    "measurementPeriodStart": mpStartDate,
                    "measurementPeriodEnd": mpEndDate
                }
            }).then((response) => {
                expect(response.status).to.eql(400)
                expect(response.body.validationErrors.ecqmTitle).to.eql("eCQM Abbreviated Title cannot be more than 32 characters.")
            })
        })

    })
})
