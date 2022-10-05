import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"

let measureName = 'TestMeasure' + Date.now()
let newMeasureName = ''
let newCqlLibraryName
let CqlLibraryName = 'TestLibrary' + Date.now()

let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let validTerminologyFHIR_and_QICORETestCaseJson = TestCaseJson.validTestCaseJsonFHIR_and_QICORE
let invalidTerminologyFHIR_and_QICOREEntireEntryBlockTestCaseJson = TestCaseJson.invalidTestCaseJsonFHIR_and_QICORE
let invalidTerminologyFHIR_and_QICOREStatusTestCaseJson = TestCaseJson.invalidTestCaseJsonFHIR_and_QICORE_Status
let invalidTerminologyFHIR_and_QICOREMDatesTestCaseJson = TestCaseJson.invalidTestCaseJsonFHIR_and_QICORE_MDates

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
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'denom', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREEntireEntryBlockTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')

        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid + '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n')
        })
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
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'denom', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREStatusTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

         cy.get(TestCasesPage.tcHighlightingTab).should('exist')
         cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
         cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

         //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')
        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid /* + '\ndefine "ipp":\n\n exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n\ndefine function ToDateTime(value dateTime): value.value\n' */)
        })

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
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'denom', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREMDatesTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()        

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')
        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid /* + '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n' */)
        })

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n')

    })
    it('Test Case JSON improper use of / invalid value set(s) -- missing entire Encounter block -- FHIR based QICore', () =>{
        //Click on Edit Button
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRbasedQICoreTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'num', 'num', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREEntireEntryBlockTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()         

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')

        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid /* + '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n' */)
        })
        
        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n')

    })
    it('Test Case JSON improper use of / invalid value set(s) -- Encounter in wrong status -- FHIR based QICore', () =>{
        //Click on Edit Button
         MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        
        cy.readFile('cypress/fixtures/CQLFHIRbasedQICoreTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'num', 'num', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTerminologyFHIR_and_QICOREStatusTestCaseJson, true)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')

        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid /* + '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n' */)
        })
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

    //Skipping until MAT-4909 is fixed
    it.skip('Test Case JSON proper use of value set(s) -- FHIR', () =>{
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
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'denom', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyFHIR_and_QICORETestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()        

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')

        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid /* + '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n' */)
        })

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', '\ndefine "ipp":\n\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n')
    })

    //Skipping until MAT-4909 is fixed
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
        cy.wait(4500)

        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'num', 'num', 'num', 'Boolean')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTerminologyFHIR_and_QICORETestCaseJson, true)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist').should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()         

        cy.get(TestCasesPage.testCaseIPPCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPCheckBox).check()
        cy.get(TestCasesPage.testCaseIPPCheckBox).should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).click()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERCheckBox).check()
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMCheckBox).should('exist')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERCheckBox).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Measure Group 1 - (Proportion)')

        cy.readFile('cypress/fixtures/groupId').should('exist').then((groupid) => {
            cy.get(TestCasesPage.testCalculationResults).should('contain.text', 'Population Group: ' + groupid /* + '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n' */)
        })

        //cy.get(TestCasesPage.testCalculationResultsLineTwo).should('contain.text', '\ndefine "num":\n    exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'\n')
    })
})
