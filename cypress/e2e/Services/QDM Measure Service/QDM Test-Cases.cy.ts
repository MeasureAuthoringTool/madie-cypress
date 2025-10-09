import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Environment } from "../../../Shared/Environment"

let harpUserALT = Environment.credentials().harpUserALT
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.QDMTestCaseJson
let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()
let CQLLibraryName = ''
let measureScoring = 'Cohort'
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL


let TCName = ''
let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'
let TCJson = TestCaseJson.QDMTestCaseJson

const measureData: CreateMeasureOptions = {}

describe('Test Case population values based on Measure Group population definitions', () => {
    beforeEach('Create Measure and measure group', () => {
        let currentUser = Cypress.env('selectedUser')
        let randTCNameValue = (Math.floor((Math.random() * 2000) + 3))
        TCName = 'TCName' + randTCNameValue

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.setAccessTokenCookie()

        //create group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": "Cohort",
                        "populationBasis": "true",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": "Initial Population",
                                "associationType": null,
                                "description": ""
                            }
                        ],
                        "measureObservations": null,
                        "groupDescription": "",
                        "improvementNotation": "",
                        "rateAggregation": "",
                        "measureGroupTypes": null,
                        "scoringUnit": "",
                        "stratifications": [],
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })
        //create test case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/groupId').should('exist').then((groupIdFc) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases',
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'POST',
                        body: {
                            "name": TCName,
                            "title": TCTitle,
                            "series": TCSeries,
                            "description": TCDescription,
                            "json": TCJson,
                            "hapiOperationOutcome": {
                                "code": 201,
                                "message": null,
                                "outcomeResponse": null
                            },
                            "groupPopulations": [{
                                "groupId": groupIdFc,
                                "scoring": measureScoring,
                                "populationValues": [
                                    {
                                        "name": "initialPopulation",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominator",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominatorExclusion",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "denominatorException",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "numerator",
                                        "expected": false,
                                        "actual": false
                                    },
                                    {
                                        "name": "numeratorExclusion",
                                        "expected": false,
                                        "actual": false
                                    }

                                ]
                            }]
                        }
                    }).then((response) => {
                        let currentUser = Cypress.env('selectedUser')
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.description).to.eql(TCDescription)
                        expect(response.body.json).to.be.exist
                        cy.writeFile('cypress/fixtures/' + currentUser + '/testCaseId', response.body.id)
                    })
                })
            })
        })
        cy.setAccessTokenCookie()

    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })
    it('Test Case population value check boxes match that of the measure group definitons -- all are defined', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        url: '/api/measures/' + id + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'GET',
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testCaseId)
                        expect(response.body.series).to.eql(TCSeries)
                        expect(response.body.json).to.be.exist
                        expect(response.body.json).to.eql(TCJson)
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.groupPopulations[0].populationValues[0].name).to.eq('initialPopulation')
                        expect(response.body['groupPopulations'][0].populationValues[1].name).to.eq('denominator')
                        expect(response.body['groupPopulations'][0].populationValues[2].name).to.eq('denominatorExclusion')
                        expect(response.body['groupPopulations'][0].populationValues[3].name).to.eq('denominatorException')
                        expect(response.body['groupPopulations'][0].populationValues[4].name).to.eq('numerator')
                        expect(response.body['groupPopulations'][0].populationValues[5].name).to.eq('numeratorExclusion')
                    })
                })
            })
        })
    })


})

describe('Measure Service: Test Case Endpoints: Create and Edit', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    let newTCJson = TestCaseJson.QDMTestCaseJson_for_update
    before('Create Measure', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryNameDeux
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
    })

    beforeEach('Set Token', () => {
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryNameDeux)

    })

    it('Create Test Case', () => {
        let currentUser = Cypress.env('selectedUser')
        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let title = 'test case title  - _'
        let series = 'test case series  - _'
        let description = 'DENOME pass Test HB - _'
        //Add Test Case to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        "name": TCName + randValue + 4,
                        "title": title,
                        "series": series,
                        "description": description,
                        "json": TCJson,
                    }
                }).then((response) => {
                    let currentUser = Cypress.env('selectedUser')
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.series).to.eql(series)
                    expect(response.body.title).to.eql(title)
                    expect(response.body.description).to.eql(description)
                    expect(response.body.json).to.be.exist
                    expect(response.body.json).to.eql(TCJson)
                    cy.writeFile('cypress/fixtures/' + currentUser + '/testCaseId', response.body.id)
                })
            })
        })
    })

    it('Edit Test Case', () => {
        let currentUser = Cypress.env('selectedUser')
        //Edit created Test Case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testcaseid) => {
                    cy.request({
                        url: '/api/measures/' + measureId + '/test-cases/' + testcaseid,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testcaseid,
                            'name': "IPPPass",
                            'series': "WhenBP120",
                            'title': TCTitle,
                            'description': "IPP Pass Test BP <120",
                            'json': newTCJson
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testcaseid)
                        expect(response.body.json).to.be.exist
                        expect(response.body.json).to.eql(newTCJson)
                        expect(response.body.series).to.eql("WhenBP120")
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.json).to.be.exist
                        cy.writeFile('cypress/fixtures/' + currentUser + '/testCaseId', response.body.id)
                    })
                })
            })
        })
    })

})

describe('Measure Service: Test Case Endpoints: Validations', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'QDMTestMeasure' + Date.now()
        CQLLibraryName = 'QDMTestCql' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CQLLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        cy.setAccessTokenCookie()
    })

    beforeEach('Set Token', () => {
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName)

    })

    it('Create Test Case: Description more than 250 characters', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP120",
                        'title': "test case title",
                        'description': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                            "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                            "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                        'json': TCJson
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
                })
            })
        })
    })

    it('Edit Test Case: Description more than 250 characters', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testCaseId) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testCaseId,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testCaseId,
                            'name': "IPPPass",
                            'series': "WhenBP<120",
                            'title': "test case title edited",
                            'description': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                                "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                                "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                            'json': TCJson
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(400)
                        expect(response.body.validationErrors.description).to.eql('Test Case Description can not be more than 250 characters.')
                    })
                })
            })
        })
    })

    it('Create Test Case: Title more than 250 characters', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP120",
                        'title': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                            "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                            "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                        'description': "description",
                        'json': TCJson
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.title).to.eql('Test Case Title can not be more than 250 characters.')
                })
            })
        })

    })

    it('Create Test Case: Series more than 250 characters', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrst" +
                            "uvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmn" +
                            "opqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr",
                        'title': "Title",
                        'description': "description",
                        'json': TCJson
                    }
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validationErrors.series).to.eql('Test Case Series can not be more than 250 characters.')
                })
            })
        })
    })
})

describe('Measure Service: Test Case Endpoints: Attempt to edit when user is not owner', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    let newTCJson = TestCaseJson.QDMTestCaseJson_for_update
    before('Create Measure', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryNameDeux
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.setAccessTokenCookie()

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population')
        //create test case
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    it('QDM Test Case Demographic fields are not available / editable for non-owner', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        //Edit created Test Case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/' + currentUser + '/testCaseId').should('exist').then((testcaseid) => {
                    cy.request({
                        failOnStatusCode: false,
                        url: '/api/measures/' + measureId + '/test-cases/' + testcaseid,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testcaseid,
                            'name': "IPPPass",
                            'series': "WhenBP120",
                            'title': TCTitle,
                            'description': "IPP Pass Test BP <120",
                            'json': newTCJson
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.eql('User ' + harpUserALT + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })
})
describe('Measure Service: Test Case Endpoint: User validation with test case import', () => {
    beforeEach('Create Measure and measure group', () => {
        let randTCNameValue = (Math.floor((Math.random() * 2000) + 3))
        TCName = 'TCName' + randTCNameValue
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = cqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.setAccessTokenCookie()

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        let currentUser = Cypress.env('selectedUser')
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": measureScoring,
                        "populationBasis": "true",
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": "Initial Population",
                                "associationType": null,
                                "description": ""
                            }
                        ],
                        "measureObservations": null,
                        "groupDescription": "",
                        "improvementNotation": "",
                        "rateAggregation": "",
                        "measureGroupTypes": null,
                        "scoringUnit": "",
                        "stratifications": [],
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/groupId', response.body.id)
                })
            })
        })


    })

    it('Non-owner or non-shared user cannot hit the end point to add test cases to a measure', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases/list',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: [{
                        "name": TCName + '1',
                        "title": TCTitle + '1',
                        "series": TCSeries,
                        "description": TCDescription,
                        "json": TCJson,

                    },
                    {
                        "name": TCName + '2',
                        "title": TCTitle + '2',
                        "series": TCSeries,
                        "description": TCDescription,
                        "json": TCJson,

                    },
                    {
                        "name": TCName + '3',
                        "title": TCTitle + '3',
                        "series": TCSeries,
                        "description": TCDescription,
                        "json": TCJson,

                    },]
                }).then((response) => {
                    expect(response.status).to.eql(403)
                })
            })
        })
    })
})

