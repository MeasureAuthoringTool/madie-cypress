import {Utilities} from "../../../Shared/Utilities"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {Environment} from "../../../Shared/Environment"
import {TestCasesPage} from "../../../Shared/TestCasesPage"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let harpUser = Environment.credentials().harpUser
let measureTwo = 'MeasureTwo' + Date.now()
let cqlLibraryTwo = 'LibraryTwo' + Date.now()
let testCaseTitle = 'FAIL'
let testCaseDescription = 'FAIL' + Date.now()
let testCaseSeries = 'SBTestSeries'
let invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid

let measureCQL = 'library '  + cqlLibraryName + ' version \'0.0.000\'\n' +
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

let measureCQL_WithErrors = 'library TestCql1675117344546 version \'0.0.000\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "ipp":\n' +
    ' ["Encounter"] E where E.period.start during "Measurement Period"\n' +
    'define "ipp2":\n' +
    ' ["Encounter"] E where E.period.start during "Measurement Period"\n' +
    'define "ex":\n' +
    ' ["Encounter"] E where E.period.start during "Measurement Period" and E.status = \'finished\'\n' +
    'define "denom":\n' +
    ' "ipp"\n' +
    'define "num":\n' +
    ' "ipp2"\n' +
    'define "boolIpp":\n' +
    ' true\n' +
    'define "boolIpp2":\n' +
    ' true\n' +
    'define "boolDenom":\n' +
    ' "boolIpp"\n' +
    'define "boolNum":\n' +
    ' false\n' +
    'define function fun(notPascalCase Integer ):\n' +
    ' true\n' +
    'define function boolFunc():\n' +
    ' 1\n' +
    'define function numFunc(e Encounter):'

describe.skip('Measure Versioning', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        cy.setAccessTokenCookie()

    })

    before('Create Measure', () => {


        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)

        //Create second Measure with Alt User
        CreateMeasurePage.CreateQICoreMeasureAPI(measureTwo, cqlLibraryTwo, measureCQL, true, true)

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

        //Delete second Measure
        Utilities.deleteMeasure(measureTwo, cqlLibraryTwo, true, true)

    })

    it('Successful Measure Versioning', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql('1.0.000')
                })
            })
        })
    })

    it('Non Measure owner unable to version Measure', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId2').should('exist').then((measureId2) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId2 + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(403)
                    expect(response.body.message).to.eql('User ' +harpUser+ ' is not authorized for Measure with ID ' +measureId2)
                })
            })
        })

    })
})

describe.skip('Version Measure without CQL', () => {

    before('Create Measure and Set Access Token', () => {

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
    })
    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('User can not version Measure if there is no CQL', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' +harpUser+ ' cannot version Measure with ID ' +measureId+ '. Measure has no CQL.')
                })
            })
        })
    })
})

describe.skip('Version Measure with invalid CQL', () => {

    before('Create Measure and Set Access Token', () => {

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL_WithErrors)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('User can not version Measure if the CQL has errors', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(409)
                    expect(response.body.message).to.eql('CQL-ELM translator found errors in the CQL for measure ' +measureName+ '!')
                })
            })
        })
    })
})

describe.skip('Version Measure with invalid test case Json', () => {

    before('Create Measure, Test Case and Set Access Token', () => {

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, invalidTestCaseJson)
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('User can not version Measure if the Test case Json has errors', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version/?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' +harpUser+ ' cannot version Measure with ID ' +measureId+ '. Measure has invalid test cases.')
                })
            })
        })
    })
})
