import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Global} from "../../../../Shared/Global"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid_w_All_Encounter
let newMeasureName = measureName + randValue
let newCqlLibraryName = CqlLibraryName + randValue
let measureCQL = MeasureCQL.CQL_Multiple_Populations

describe('Stratification Expected values for Boolean Population Basis', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
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
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population', 'Boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Save Stratification Expected Values for Boolean Population basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })        

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Save Stratification Expected Values
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).check()
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('be.checked')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).check()
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('be.checked')

        //save test case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Assert saved stratification values
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('be.checked')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('be.checked')

    })

    it('Run Test Case with Stratification Expected Values for Boolean Population basis', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()
        
        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        
        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')
        
        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')
        
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
        
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        
        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //check the denominator stratification check boxes
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('exist')
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('be.visible')
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).wait(1000).check()

        //check the numerator stratification check boxes
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('exist')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('be.visible')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).wait(1000).check()

        //save test case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Navigate to Test Cases list page and click into / edit test case
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //run test case
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()
    })

    it('Run a failing Test Case with Stratification Expected Values for Boolean Population basis', () =>{
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })        

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')
        
        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //check the denominator stratification check boxes
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('exist')
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('be.visible')
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).wait(1000).check()

        //save test case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Navigate to Test Cases list page and click into / edit test case
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //run test case
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

    })
})

describe('Stratification Expected values for Non Boolean Population Basis', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
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
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Qualifying Encounters', 'Qualifying Encounters', 'Qualifying Encounters', 'Encounter')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Save Stratification Expected Values for Non Boolean Population basis', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })        

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Save Stratification Expected Values
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).type('1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).type('2')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Assert saved stratification values
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('contain.value', '1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('contain.value', '2')

    })

    it('Run a passing Test Case with Stratification Expected Values for Non Boolean Population basis', () =>{
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })        

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Save Stratification Expected Values
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).wait(1000).type('1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).wait(1000).type('1')
        
        //save test case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Assert saved stratification values
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('contain.value', '1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('contain.value', '1')

        //run test case
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()
        
    })

    it('Run a failing Test Case with Stratification Expected Values for Non Boolean Population basis', () =>{
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })        

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Save Stratification Expected Values
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).wait(1000).type('1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).wait(1000).type('2')
        
        //save test case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Assert saved stratification values
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).should('contain.value', '1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).should('contain.value', '2')

        //run test case
        cy.get(TestCasesPage.runTestButton).should('exist')
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()
    })

    it('Verify Expected / Actual page dirty check with Non-Boolean Population Basis', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })        

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Qualifying Encounters')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        //Save Stratification Expected Values
        cy.get(TestCasesPage.denominatorStratificationOneExpectedValue).type('1')
        cy.get(TestCasesPage.numeratorStratificationTwoExpectedValue).type('2')

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that the discard modal appears
        Global.clickOnDiscardChanges()

    })
})