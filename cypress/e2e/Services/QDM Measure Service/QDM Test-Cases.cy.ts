import { Utilities } from "../../../Shared/Utilities"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { v4 as uuidv4 } from 'uuid'
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Environment } from "../../../Shared/Environment"

let harpUser = Environment.credentials().harpUser
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.QDMTestCaseJson
let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestLibrary' + Date.now()
let CQLLibraryName = ''
let measureScoring = 'Cohort'
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

let TCName = 'TCName' + Date.now()
let TCSeries = 'SBTestSeries'
let TCTitle = 'test case title'
let TCDescription = 'DENOMFail1651609688032'
let TCJson = TestCaseJson.QDMTestCaseJson
//Skipping until feature flag for QDM Test case is removed
describe.skip('Test Case population values based on Measure Group population definitions', () => {
    beforeEach('Create Measure and measure group', () => {

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryName, measureScoring, true, booleanPatientBasisQDM_CQL, false, false)

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.setAccessTokenCookie()

        //create group
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
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
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                        "createdAt": "2023-05-22T18:14:37.791Z",
                        "createdBy": "SBXDV.bwelch",
                        "lastModifiedAt": "2023-05-22T18:14:37.791Z",
                        "lastModifiedBy": "SBXDV.bwelch",
                        "description": TCDescription,
                        "json": TCJson,
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.series).to.eql(TCSeries)
                    expect(response.body.title).to.eql(TCTitle)
                    expect(response.body.description).to.eql(TCDescription)
                    expect(response.body.json).to.be.exist
                    cy.writeFile('cypress/fixtures/testcaseId', response.body.id)
                })
            })
        })
        cy.setAccessTokenCookie()
        //leaving this section of commented out code because we may need it later if, later on, 
        //we have to associate a test case with a group before we can create the test case
        //----------------------------------------------------//
        /*         cy.getCookie('accessToken').then((accessToken) => {
                    cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupIdFc) => {
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
                                    "createdAt": "2022-05-05T18:14:37.791Z",
                                    "createdBy": "SBXDV.bwelch",
                                    "lastModifiedAt": "2022-05-05T18:14:37.791Z",
                                    "lastModifiedBy": "SBXDV.bwelch",
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
                                expect(response.status).to.eql(201)
                                expect(response.body.id).to.be.exist
                                expect(response.body.series).to.eql(TCSeries)
                                expect(response.body.title).to.eql(TCTitle)
                                expect(response.body.description).to.eql(TCDescription)
                                expect(response.body.json).to.be.exist
                                cy.writeFile('cypress/fixtures/testcaseId', response.body.id)
                            })
                        })
                    })
                }) */
        //---------------------------------------------------//

    })
    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })
    it.skip('Test Case population value check boxes match that of the measure group definitons -- all are defined', () => {
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
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
//Skipping until feature flag for QDM Test case is removed
describe.skip('Measure Service: Test Case Endpoints: Create and Edit', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    let newTCJson = TestCaseJson.QDMTestCaseJson_for_update
    before('Create Measure', () => {
        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryNameDeux, measureScoring, true, booleanPatientBasisQDM_CQL, false, false)
    })

    beforeEach('Set Token', () => {
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryNameDeux)

    })

    it('Create Test Case', () => {
        let randValue = (Math.floor((Math.random() * 2000) + 3))
        let title = 'test case title ~!@#!@#$$%^&%^&* &()(?><'
        let series = 'test case series ~!@#!@#$$%^&%^&* &()(?><'
        let description = 'DENOME pass Test HB <120 ~!@#!@#$$%^&%^&* &()(?><'
        //Add Test Case to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.series).to.eql(series)
                    expect(response.body.title).to.eql(title)
                    expect(response.body.description).to.eql(description)
                    expect(response.body.json).to.be.exist
                    expect(response.body.json).to.eql(TCJson)
                    cy.writeFile('cypress/fixtures/testcaseId', response.body.id)
                })
            })
        })
    })

    it('Edit Test Case', () => {

        //Edit created Test Case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testcaseid) => {
                    cy.request({
                        url: '/api/measures/' + measureId + '/test-cases/' + testcaseid,
                        headers: {
                            authorization: 'Bearer ' + accessToken.value
                        },
                        method: 'PUT',
                        body: {
                            'id': testcaseid,
                            'name': "IPPPass",
                            'series': "WhenBP<120",
                            'title': TCTitle,
                            'description': "IPP Pass Test BP <120",
                            'json': newTCJson
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(200)
                        expect(response.body.id).to.eql(testcaseid)
                        expect(response.body.json).to.be.exist
                        expect(response.body.json).to.eql(newTCJson)
                        expect(response.body.series).to.eql("WhenBP<120")
                        expect(response.body.title).to.eql(TCTitle)
                        expect(response.body.json).to.be.exist
                        cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
                    })
                })
            })
        })
    })

})
//Skipping until feature flag for QDM Test case is removed
describe.skip('Measure Service: Test Case Endpoints: Validations', () => {

    before('Create Measure', () => {

        cy.setAccessTokenCookie()

        measureName = 'QDMTestMeasure' + Date.now()
        CQLLibraryName = 'QDMTestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CQLLibraryName, measureScoring, true, booleanPatientBasisQDM_CQL, false, false)
        cy.setAccessTokenCookie()
    })

    beforeEach('Set Token', () => {
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CQLLibraryName)

    })

    it('Create Test Case: Description more than 250 characters', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP<120",
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testCaseId) => {
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "DENOMFail",
                        'series': "WhenBP<120",
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

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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

/*        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryNameDeux, measureScoring, true, booleanPatientBasisQDM_CQL, false, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population')
        //create test case
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, true)

        -----------

        expect(response.status).to.eql(403)
        expect(response.body.message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId)
*/

//Skipping until feature flag for QDM Test case is removed
describe.skip('Measure Service: Test Case Endpoints: Attempt to edit when user is not owner', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let cqlLibraryNameDeux = cqlLibraryName + randValue + 2
    let newTCJson = TestCaseJson.QDMTestCaseJson_for_update
    before('Create Measure', () => {
        cy.setAccessTokenCookieALT()

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryNameDeux, measureScoring, true, booleanPatientBasisQDM_CQL, false, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population')
        //create test case
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, true)
    })

    beforeEach('Set Token', () => {
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryNameDeux, false, true)

    })



    it('QDM Test Case Demographic fields are not available / editable for non-owner', () => {

        //Edit created Test Case
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.readFile('cypress/fixtures/testcaseId').should('exist').then((testcaseid) => {
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
                            'series': "WhenBP<120",
                            'title': TCTitle,
                            'description': "IPP Pass Test BP <120",
                            'json': newTCJson
                        }
                    }).then((response) => {
                        expect(response.status).to.eql(403)
                        expect(response.body.message).to.eql('User ' + harpUser + ' is not authorized for Measure with ID ' + measureId)
                    })
                })
            })
        })
    })
})
describe.skip('Measure Service: Test Case Endpoint: User validation with test case import', () => {
    beforeEach('Create Measure and measure group', () => {
        cy.clearCookies()
        cy.clearLocalStorage()

        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryName, measureScoring, true, booleanPatientBasisQDM_CQL, false, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population')

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
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
    afterEach('Clean up measures', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName, false, true)

    })
    it('Non-owner or non-shared user cannot hit the end point to add test cases to a measure', () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
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
