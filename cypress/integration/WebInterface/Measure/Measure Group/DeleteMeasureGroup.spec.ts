import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import { createPublicKey } from "crypto"
let measureOne = 'TestMeasure' + Date.now()
let CqlLibraryName1 = 'TestLibrary' + Date.now()
let title1 = 'TCOneForDeleteTests'
let series = 'ICFTestSeries'
let description = 'Some Test Description'
let validJsonValue = TestCaseJson.API_TestCaseJson_Valid
let measureTwo = measureOne + "Second"

describe('Validate Measure Group deletion functionality', () => {

    before('Create measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureOne, CqlLibraryName1)
        MeasureGroupPage.CreateProportionMeasureGroupAPI()
        TestCasesPage.CreateTestCaseAPI(title1, series, description, validJsonValue)

        //create new measure via temp user
        CreateMeasurePage.CreateQICoreMeasureAPI(measureTwo, CqlLibraryName1+"second", null, true, true )
        MeasureGroupPage.CreateProportionMeasureGroupAPI(true, true)
        TestCasesPage.CreateTestCaseAPI(title1+"second", series, description, validJsonValue, true, true)




    })

    beforeEach('Login', () => {

        OktaLogin.Login()

    })

    afterEach('Login', () => {

        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureOne, CqlLibraryName1)
        Utilities.deleteMeasure(measureTwo, CqlLibraryName1+"second", true, true)


    })
    it('Delete button brings up confirmation modal', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //presence of modal / confirmation modal appears
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('exist')
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('be.visible')

        //modal has messaging asking the user to confirm the deletion
        cy.get('.MuiTypography-root.MuiTypography-body1.jss6.css-9l3uo3').should('exist')
        cy.get('.MuiTypography-root.MuiTypography-body1.jss6.css-9l3uo3').should('contain.text', 'Measure Group 1 will be deleted. Are you sure you want to delete this measure group ?')
        cy.get('.MuiTypography-root.MuiTypography-body1.jss7.css-9l3uo3').should('exist')
        cy.get('.MuiTypography-root.MuiTypography-body1.jss7.css-9l3uo3').should('contain.text', 'This action cannot be undone.')

    })
    it('Confirmation modal has Yes button and clicking yes when there are multiple groups removes group and renumbering occurs', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        for (let i = 0; i <= 3; i++){
            //click on the add measture grop button to create new group
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.enabled')
            cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        }

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupFour).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupFour).click()
        
        //select a group type
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).should('exist').invoke('click')

        //select scoring type
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Cohort')

        //select an initial population value
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('denom')

        //save newly created group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()    
        
        //click on the first group
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').focus().should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()         

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupTwo).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTwo).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click()

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist')
        cy.get(MeasureGroupPage.measureGroupTwo).should('not.exist')
        cy.get(MeasureGroupPage.measureGroupThree).should('not.exist')
        cy.get(MeasureGroupPage.measureGroupFour).should('not.exist')
        cy.get(MeasureGroupPage.measureGroupFive).should('not.exist')        
    })
    it('Confirmation modal has Yes button and clicking yes when there is only one group removes group a blank group remains', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click()

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()
        
        //confirm Scoring value is blank
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Select')
    })
    it('Confirmation modal has a Keep button and clicking on it will result in the group persisting', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "keep" retains group
        cy.get(MeasureGroupPage.keepGroupModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.keepGroupModalbtn).click()

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')        

        //confirm the group still exists
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('contain.text', 'Outcome')

        cy.get(MeasureGroupPage.measureScoringSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Proportion')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')

        cy.get(MeasureGroupPage.denominatorSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'ipp')

        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('contain.text', 'ipp')

        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('contain.text', 'Select')

        cy.get(MeasureGroupPage.numeratorSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Select')

        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('contain.text', 'Select')

    })
    it('Test Case list page still loads after a one from multiple groups are deleted', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        for (let i = 0; i <= 3; i++){
            //click on the add measture grop button to create new group
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.enabled')
            cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        }

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupFour).should('exist')
        cy.get(MeasureGroupPage.measureGroupFour).click()
        

        //select a group type
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).should('exist').invoke('click')

        //select scoring type
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Cohort')

        //select an initial population value
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('denom')

        //save newly created group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //click on the first group
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').focus().should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()        

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupTwo).should('exist').focus().should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTwo).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click()

        //navigate to the test case list tab / page
        cy.get(EditMeasurePage.testCasesTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm test case is still present on measure
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=test-case-row-'+ fileContents +']').should('exist').should('be.visible')
        })  


    })
    it('Test Case list page still loads after all groups are deleted', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click()

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()
        
        //confirm Scoring value is blank
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Select')

        //navigate to the test case list tab / page
        cy.get(EditMeasurePage.testCasesTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm test case is still present on measure
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=test-case-row-'+ fileContents +']').should('exist').should('be.visible')
        })        
    })
    it('Test Cases still loads after a one from multiple groups are deleted', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        for (let i = 0; i <= 3; i++){
            //click on the add measture grop button to create new group
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.enabled')
            cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        }

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupFour).should('exist')
        cy.get(MeasureGroupPage.measureGroupFour).click()
        

        //select a group type
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).should('exist').invoke('click')

        //select scoring type
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Cohort')

        //select an initial population value
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('denom')

        //save newly created group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()  
        
        //click on the first group
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').focus().should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()        

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupTwo).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTwo).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click()

        //navigate to the test case list tab / page
        cy.get(EditMeasurePage.testCasesTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm test case is still present on measure
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=test-case-row-'+ fileContents +']').should('exist').should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('exist').should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').click()
        })
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((mId) => {        
            cy.readFile('cypress/fixtures/measureId').should('exist').then((tId)=> {
                cy.intercept('GET', 'https://dev-madie.hcqis.org/measures/' + mId + '/edit/test-cases/'+ tId, [])

            })
        })
    })
    it('Test Cases still loads after all groups are deleted', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/CQLFHIRTerminologyTest.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).should('exist')
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save Measure CQL
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()
        
        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click()

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()
        
        //confirm Scoring value is blank
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Select')

        //navigate to the test case list tab / page
        cy.get(EditMeasurePage.testCasesTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm test case is still present on measure
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=test-case-row-'+ fileContents +']').should('exist').should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('exist').should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').click()
        })
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((mId) => {        
            cy.readFile('cypress/fixtures/measureId').should('exist').then((tId)=> {
                cy.intercept('GET', 'https://dev-madie.hcqis.org/measures/' + mId + '/edit/test-cases/'+ tId, [])
            })
        })        
    })
    it('User can only delete groups from a measure that they own', () => {
        //Verify the Measure on My Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureTwo)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Verify the Measure on All Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('contain', measureTwo)

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure(true)

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('not.exist')       
    })
})