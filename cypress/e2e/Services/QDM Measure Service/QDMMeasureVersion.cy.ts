import { Utilities } from "../../../Shared/Utilities"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let harpUser = Environment.credentials().harpUser
let harpUserALT = Environment.credentials().harpUserALT
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCQLLibraryName = ''

let measureCQL = 'library ' + cqlLibraryName + ' version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue'

let measureCQL_WithParsingAndVSACErrors = 'library APICQLLibrary35455 version \'0.0.000\'\n' +

    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
    '\n' +
    'valueset "Acute care hospital Inpatient Encounter": \'urn:oid:2.16.840.1.113883.3.666.5.2289\' \n' +
    'valueset "Bicarbonate lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.139\' \n' +
    'valueset "Body temperature": \'urn:oid:2.16.840.1.113762.1.4.1045.152\' \n' +
    'valueset "Body weight": \'urn:oid:2.16.840.1.113762.1.4.1045.159\' \n' +
    'valueset "Creatinine lab test": \'urn:oid:2.16.840.1.113883.3.666.5.2363\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Glucose lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.134\' \n' +
    'valueset "Heart Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.149\' \n' +
    'valueset "Hematocrit lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.114\' \n' +
    'valueset "Medicare Advantage payer": \'urn:oid:2.16.840.1.113762.1.4.1104.12\' \n' +
    'valueset "Medicare FFS payer": \'urn:oid:2.16.840.1.113762.1.4.1104.10\' \n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Oxygen Saturation by Pulse Oximetry": \'urn:oid:2.16.840.1.113762.1.4.1045.151\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    '\n' +
    'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
    'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
    'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
    'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\' \n' +
    '\n' +
    'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Denominator": \'\'\n' +
    '\t  "Initial Population"'

describe('Measure Versioning', () => {

    newMeasureName = measureName + 1 + randValue
    newCQLLibraryName = cqlLibraryName + 1 + randValue

    before('Create Measure', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    after('Clean up', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()

        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)
    })



    it('UnSuccessful Measure Versioning when measure does not have population criteria', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    //'User' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure does not have at least one Population Criteria.'
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure does not have at least one Population Criteria.')
                })
            })
        })
    })
    it('Successful Measure Versioning', () => {
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'd')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout
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
                    expect(response.body.version).to.eql('1.0.000')
                })
            })
        })
    })
})

describe('Measure Version : Non Measure owner validation', () => {

    before('Create Measure', () => {

        newMeasureName = measureName + 5 + randValue
        newCQLLibraryName = cqlLibraryName + 5 + randValue

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', true, measureCQL)

    })

    it('Non Measure owner unable to version Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookieALT()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(403)
                    expect(response.body.message).to.eql('User ' + harpUserALT + ' is not authorized for Measure with ID ' + measureId)
                })
            })
        })

    })
})

describe('Version Measure without CQL', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        newMeasureName = measureName + 2 + randValue
        newCQLLibraryName = cqlLibraryName + 2 + randValue

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', true)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })
    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('User can not version Measure if there is no CQL', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure has no CQL.')
                })
            })
        })
    })
})


describe('Version Measure with invalid CQL', () => {

    beforeEach('Create Measure and Set Access Token', () => {

        newMeasureName = measureName + 3 + randValue
        newCQLLibraryName = cqlLibraryName + 3 + randValue

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', true, measureCQL_WithParsingAndVSACErrors)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('User can not version Measure if the CQL has errors', () => {

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((measureId) => {
                cy.request({
                    failOnStatusCode: false,
                    url: '/api/measures/' + measureId + '/version?versionType=major',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'PUT'
                }).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.message).to.eql('User ' + harpUser + ' cannot version Measure with ID ' + measureId + '. Measure has CQL errors.')
                })
            })
        })
    })
})



