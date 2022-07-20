import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {Utilities} from "../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"

let measureName = 'TestMeasure' + Date.now()
let newMeasureName = ''
let newCqlLibraryName
let CqlLibraryName = 'TestLibrary' + Date.now()
let measurePath = 'cypress/fixtures/measureId'
let measureGroupPath = 'cypress/fixtures/groupId'
let PopIniPop = 'ipp'
let PopNum = 'denom'
let PopDenom = 'num'
let PopDenex = 'ipp'
let PopDenexcep = 'denom'
let PopNumex = 'num'
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTerminologyFHIR_and_QICORETestCaseJson = TestCaseJson.validTestCaseJsonFHIR_and_QICORE
let invalidTerminologyFHIR_and_QICOREEntireEntryBlockTestCaseJson = TestCaseJson.invalidTestCaseJsonFHIR_and_QICORE
let invalidTerminologyFHIR_and_QICOREStatusTestCaseJson = TestCaseJson.invalidTestCaseJsonFHIR_and_QICORE_Status
let invalidTerminologyFHIR_and_QICOREMDatesTestCaseJson = TestCaseJson.invalidTestCaseJsonFHIR_and_QICORE_MDates
let validTerminologyQICoreTestCaseJson = TestCaseJson.validTestCaseJsonQICOre
let invalidTerminologyQICoreEntireEncounterBlockTestCaseJson = TestCaseJson.invalidTestCaseJsonQICore
let invalidTerminologyQICoreStatusTestCaseJson = TestCaseJson.invalidTestCaseJsonQICore_status
let invalidTerminologyQICoreMDatesTestCaseJson = TestCaseJson.invalidTestCaseJsonQICore_MDates
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
let vTCJsonWithOutBundleId = '{{} "resourceType": "Bundle", "meta": {{}   "versionId": "1",' +
' "lastUpdated": "2022-03-30T19:02:32.620+00:00"  },  "type": "collection",  "entry": [ {{}   "fullUrl": "http://local/Encounter",' +
' "resource": {{} "resourceType": "Encounter","meta": {{} "versionId": "1","lastUpdated": "2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},' +
' "text": {{} "status": "generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>\"},' +
' "status": "finished","class": {{} "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode","code": "IMP","display":"inpatient encounter"},' +
' "type": [ {{} "text": "OutPatient"} ],"subject": {{} "reference": "Patient/1"},"participant": [ {{} "individual": {{} "reference": "Practitioner/30164",' +
' "display": "Dr John Doe"}} ],"period": {{} "start": "2023-09-10T03:34:10.054Z"}}}, {{} "fullUrl": "http://local/Patient","resource": {{} "resourceType":'+
' "Patient","text": {{} "status": "generated","div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>\"},"identifier":' +
' [ {{} "system": "http://clinfhir.com/fhir/NamingSystem/identifier","value": "20181011LizzyHealth"} ],"name": [ {{} "use": "official",' +
' "text": "Lizzy Health","family": "Health","given": [ "Lizzy" ]} ],"gender": "female","birthDate": "2000-10-11"}} ]}'
let testCaseXML = TestCaseJson.TestCase_XML
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'

describe('Test Case Validations', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

    })
    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Create Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseButton).should('be.disabled')
    })

    it('Edit Test Case: Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, {delay: 0})
        cy.get(TestCasesPage.cuTestCaseButton).should('be.disabled')
    })

    it('Create Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.wait(2000)

        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')

        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')

    })

    it('Edit Test Case: Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.wait(2000)

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).focus().clear()
        cy.get(TestCasesPage.testCaseTitle).invoke('val', '')
        cy.get(TestCasesPage.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, {delay: 0})
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.cuTestCaseButton).should('be.disabled')
        cy.get(TestCasesPage.testCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })
})

describe('Test Case Json Validations', () => {

    before('Create Measure', () => {
        CqlLibraryName = 'TestLibrary2' + Date.now()
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

    })

    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Enter Valid Test Case Json and Save', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.newTestCaseButton).should('exist')
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)

        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)

        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.enabled')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Nothing to see here!')

        TestCasesPage.clickCreateTestCaseButton(true)
    })

    it('Enter Invalid Test Case Json and Verify Error Message', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(invalidTestCaseJson)

        cy.get(TestCasesPage.createTestCaseButton).click()
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationErrorList).should('contain.text', 'Failed to parse request body as JSON resource. Error was: Incorrect resource type found, expected "Bundle" but found "Account"')

        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'An error occurred with the Test Case JSON while creating the test case')
    })

    it('Enter Patient XML and Verify Error Message ', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(testCaseXML)

        cy.get(TestCasesPage.createTestCaseButton).click()
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationErrorList).should('contain.text', 'Failed to parse request body as JSON resource. Error was: Failed to parse JSON encoded FHIR content: Content does not appear to be FHIR JSON, first non-whitespace character was: \'<\' (must be \'{\')')

        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'An error occurred with the Test Case JSON while creating the test case')
    })
    it('Create test case w/Json missing BundleId ', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, vTCJsonWithOutBundleId, false)
    })
    it('Create test case w/Json not missing BundleId ', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

    })

    it('Update test case w/Json missing BundleId ', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        //setup for grabbing the measure create call
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.createTestCaseButton).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })

            cy.get(EditMeasurePage.testCasesTab).click()

        })
        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(vTCJsonWithOutBundleId)

        cy.get(TestCasesPage.createTestCaseButton).click()

        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully! Bundle ID has been auto generated')
        
        cy.get(EditMeasurePage.testCasesTab).click()

        
        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)
        
        cy.log('Test Case updated successfully')

    })
    it('Update test case w/Json not missing BundleId ', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
                
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
                
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        
        //setup for grabbing the measure create call
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
                
            cy.get(TestCasesPage.createTestCaseButton).click()
                
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
        
            cy.get(EditMeasurePage.testCasesTab).click()
        
        })
        TestCasesPage.clickEditforCreatedTestCase()
        
        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
        
        cy.get(TestCasesPage.createTestCaseButton).click()
        
        cy.get(TestCasesPage.confirmationMsg).should('have.text', 'Test case updated successfully! Bundle IDs are auto generated on save. MADiE has over written the ID provided')
                
        cy.get(EditMeasurePage.testCasesTab).click()
        
                
        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)
                
        cy.log('Test Case updated successfully')
    })
})
describe('Test Case Run Test Case button validations', () => {


    beforeEach('Login and Create Measure', () => {
        CqlLibraryName = 'TestLibrary2' + Date.now()
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Proportion',
                        "population": 
                        {
                            "initialPopulation": PopIniPop,
                            "denominator": PopDenom,
                            "denominatorExclusion": PopDenex,
                            "denominatorException": PopDenexcep,
                            "numerator": PopNum,
                            "numeratorExclusion": PopNumex
                        }
                    }
                }).then((response) => {
                        expect(response.status).to.eql(201)
                        expect(response.body.id).to.be.exist
                        cy.writeFile(measureGroupPath, response.body.id)
                })
            })
        })
        OktaLogin.Login()


    })
    afterEach('Logout and Clean up', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Run Test Case button is disabled  -- CQL Errors', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorTextBox).type('{home}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('adjfajsdfljafja;lsdjf')
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

    })
    //skipping this one until 4497 / 4498 is fixed
    it.skip('Run / Execute Test Case button is disabled  -- Missing group / population selections', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        OktaLogin.Logout()
        cy.setAccessTokenCookie()
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "scoring": 'Proportion', 
                        "population": { 
                            "initialPopulation": PopIniPop,
                            "denominator": PopDenom,
                            "denominatorExclusion": PopDenex,
                            "denominatorException": PopDenexcep,
                            "numerator": PopNum
                        }
                    }
                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.id).to.be.exist

                })
            })
        })
        OktaLogin.Login()
        cy.wait(10000)

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')        
    })
    it('Run Test Case button is disabled -- Invalid TC Json', () =>{
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
                
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

                
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
                
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
        
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        
        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(invalidTestCaseJson)
        
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.createTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.createTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.createTestCaseButton).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })

            cy.get(TestCasesPage.confirmationMsg).should('have.text', 'An error occurred with the Test Case JSON while creating the test case')
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
        
        })
        
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.disabled')
        
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        
    })
    //MAT-4421  -- the execute button is enabled when it shouldn't be
    it.skip('Execute Test Case button is disabled  -- Invalid TC Json', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
                
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

                
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
                
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
        
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        
        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(invalidTestCaseJson)
        
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.createTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.createTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.createTestCaseButton).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })

            cy.get(TestCasesPage.confirmationMsg).should('have.text', 'An error occurred with the Test Case JSON while creating the test case')
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
        
        })
        
        
        //TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTestCaseJson)
        
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.disabled')
        
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
        
    })
    it('Run Test Case button is disabled -- missing TC Json',() =>{
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.createTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.createTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.createTestCaseButton).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })

            cy.get(TestCasesPage.confirmationMsg).should('contains.text', 'Test case created successfully!')
            
            cy.get(EditMeasurePage.testCasesTab).click()
        
        })

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

    })
    //MAT-4421  -- the execute button is enabled when it shouldn't be
    it.skip('Execute Test Case button is disabled  -- missing TC Json', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        
        cy.get(TestCasesPage.testCaseTitle).should('be.visible')
        cy.get(TestCasesPage.testCaseTitle).should('be.enabled')
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.createTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.createTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.createTestCaseButton).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })

            cy.get(TestCasesPage.confirmationMsg).should('contains.text', 'Test case created successfully!')
            
            cy.get(EditMeasurePage.testCasesTab).click()
        
        })

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

    })
    it('Run Test Case actual results in Population Values table', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
                
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
                
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
        
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMCheckBox).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENEXCheckBox).check().should('be.checked')


        cy.get(TestCasesPage.createTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.createTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.ippActualCheckBox).should('be.checked')
        cy.get(TestCasesPage.denomActualCheckBox).should('be.checked')
        cy.get(TestCasesPage.denomExclusionActualCheckBox).should('be.checked')


    })
})
describe('Test Case JSON / terminology tests: Negative tests -- Test Case JSON does not use value set(s)', () => {
    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Test Case JSON improper use of / invalid value set(s) -- missing entire Encounter block -- FHIR', () =>{
        //Click on Edit Button
         MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREEntireEntryBlockTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n')

    })
    it('Test Case JSON improper use of / invalid value set(s) -- Encounter in wrong status -- FHIR', () =>{
        //Click on Edit Button
         MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREStatusTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineFour).should('contain.text', '\ndefine "num":\n\n  exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n')

    })
    it('Test Case JSON improper use of / invalid value set(s) -- Test Case JSON using wrong dates -- FHIR', () =>{
        //Click on Edit Button
         MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREMDatesTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n')

    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON improper use of / invalid value set(s) -- missing entire Encounter block -- FHIR based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRbasedQICoreTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('num')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('num')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREEntireEntryBlockTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')
        
        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n')

    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON improper use of / invalid value set(s) -- Encounter in wrong status -- FHIR based QICore', () =>{
        //Click on Edit Button
         MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRbasedQICoreTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('num')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('num')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREStatusTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n')

    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON improper use of / invalid value set(s) -- missing entire Encounter block -- QICore based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLQICoreTermTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('Initial Population')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('Denominator')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('Numerator')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyQICoreEntireEncounterBlockTestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "Qualifying Encounters":\n  (\n    [Encounter: "Office Visit"]\n          union [Encounter: "Annual Wellness Visit"]\n  ) ValidEncounter\n        where ValidEncounter.period during "Measurement Period"\n            and ValidEncounter.status  = \'finished\'\n')
        cy.get(TestCasesPage.testCalculationResultsLineThree).should('contain.text', '\ndefine "Initial Population":\n  exists "Qualifying Encounters"\n')
    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON improper use of / invalid value set(s) -- Encounter in wrong status -- QICore based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLQICoreTermTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('Initial Population')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('Denominator')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('Numerator')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyQICoreStatusTestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "Qualifying Encounters":\n  (\n    [Encounter: "Office Visit"]\n          union [Encounter: "Annual Wellness Visit"]\n  ) ValidEncounter\n        where ValidEncounter.period during "Measurement Period"\n            and ValidEncounter.status  = \'finished\'\n')
        cy.get(TestCasesPage.testCalculationResultsLineThree).should('contain.text', '\ndefine "Initial Population":\n  exists "Qualifying Encounters"\n')
    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON improper use of / invalid value set(s) -- Test Case JSON using wrong dates -- QICore based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLQICoreTermTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('Initial Population')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('Denominator')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('Numerator')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyQICoreMDatesTestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "Qualifying Encounters":\n  (\n    [Encounter: "Office Visit"]\n          union [Encounter: "Annual Wellness Visit"]\n  ) ValidEncounter\n        where ValidEncounter.period during "Measurement Period"\n            and ValidEncounter.status  = \'finished\'\n')
        cy.get(TestCasesPage.testCalculationResultsLineThree).should('contain.text', '\ndefine "Initial Population":\n  exists "Qualifying Encounters"\n')
    })
})

describe('Test Case JSON / terminology tests: positive tests -- Test Case JSON uses value set(s)', () => {
    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON proper use of value set(s) -- QICore based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLQICoreTermTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('Initial Population')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('Denominator')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('Numerator')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyQICoreTestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "Qualifying Encounters":\n  (\n    [Encounter: "Office Visit"]\n          union [Encounter: "Annual Wellness Visit"]\n  ) ValidEncounter\n        where ValidEncounter.period during "Measurement Period"\n            and ValidEncounter.status  = \'finished\'\n')
        cy.get(TestCasesPage.testCalculationResultsLineFour).should('contain.text', '\ndefine "Denominator":\n  "Initial Population"\n')
        cy.get(TestCasesPage.testCalculationResultsLineFive).should('contain.text', '\ndefine "Numerator":\n  Patient.gender = \'female\'\n      and exists "Qualifying Encounters"\n')

    })
    it('Test Case JSON proper use of value set(s) -- FHIR', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyFHIR_and_QICORETestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n')
    })
    //skipping test until resolution of bug MAT-4550
    it.skip('Test Case JSON proper use of value set(s) -- FHIR based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRbasedQICoreTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('num')


        cy.get(MeasureGroupPage.denominatorSelect).should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).select('num')

        cy.get(MeasureGroupPage.numeratorSelect).should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
                
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyFHIR_and_QICORETestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.get(TestCasesPage.testCaseIPPCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check().should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.cuTestCaseButton).should('exist')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.cuTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.cuTestCaseButton).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Group: population-group-1')

        cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n')
    })
})