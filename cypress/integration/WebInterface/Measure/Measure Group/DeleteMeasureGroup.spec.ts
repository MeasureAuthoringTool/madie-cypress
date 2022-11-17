import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {Global} from "../../../../Shared/Global";

let measureOne = 'TestMeasure' + Date.now()
let CqlLibraryName1 = 'TestLibrary' + Date.now()
let title1 = 'TCOneForDeleteTests'
let series = 'ICFTestSeries'
let description = 'Some Test Description'
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let validJsonValue = TestCaseJson.API_TestCaseJson_Valid
let measureTwo = measureOne + "Second"
var newCqlLibraryName = null
var randValue = null

describe('Validate Measure Group deletion functionality', () => {

    beforeEach('Create measure(s), group(s), test case(s), and login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName1 + randValue

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(measureOne, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null,null,null,null,
            null,'Procedure')
        TestCasesPage.CreateTestCaseAPI(title1, series, description, validJsonValue)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureOne, newCqlLibraryName)

    })

    it('Delete button brings up confirmation modal', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

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
        cy.get(MeasureGroupPage.deleteMeasureGroupConfirmationMsg).should('exist')
        cy.get(MeasureGroupPage.deleteMeasureGroupConfirmationMsg).contains('Measure Group 1 will be deleted. Are you sure you want to delete this measure group?')
    })

    it('Confirmation modal has Yes button and clicking yes when there is only one group removes group a blank group remains', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

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
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click({force:true})

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()

        //confirm Scoring value is blank
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', '-')
    })

    it('Confirmation modal has a Keep button and clicking on it will result in the group persisting', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

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

        cy.get(MeasureGroupPage.measureScoringSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Proportion')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'Surgical Absence of Cervix')

        cy.get(MeasureGroupPage.denominatorSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.denominatorSelect).should('contain.text', 'Surgical Absence of Cervix')

        cy.get(MeasureGroupPage.numeratorSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.numeratorSelect).should('contain.text', 'Surgical Absence of Cervix')

    })

    //This test  case needs review for validity
    it.skip('Test Cases still loads after a one from multiple groups are deleted', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        for (let i = 0; i <= 3; i++){
            //click on the add measture grop button to create new group
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
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

        //choose Procedure pop basis
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //select scoring type
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

        //select an initial population value
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')

        //save newly created group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //click on the first group
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').focus().should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()

        Global.clickOnDiscardChanges()

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
            cy.get('[data-testid=test-case-row-'+ fileContents +']', { timeout: 80000 }).should('exist')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']', { timeout: 80000 }).should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']', { timeout: 80000 }).click()
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
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', '-')

        //navigate to the test case list tab / page
        cy.get(EditMeasurePage.testCasesTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm test case is still present on measure
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=test-case-row-'+ fileContents +']', { timeout: 80000 }).should('exist')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']', { timeout: 80000 }).should('be.visible')
            cy.get('[data-testid=edit-test-case-'+ fileContents +']', { timeout: 80000 }).click()
        })
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((mId) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((tId)=> {
                cy.intercept('GET', 'https://dev-madie.hcqis.org/measures/' + mId + '/edit/test-cases/'+ tId, [])
            })
        })
    })
})

describe('Ownership test when deleting groups', () => {
    beforeEach('Create measure(s), group(s), test case(s), and login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName1 + randValue

        //create new measure via temp user
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(measureTwo, newCqlLibraryName+"second", measureCQL, true, true )
        OktaLogin.AltLogin()
        MeasuresPage.clickEditforCreatedMeasure(true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(4500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(true, true, null,
            null, null, 'Procedure')
        TestCasesPage.CreateTestCaseAPI(title1+"second", series, description, validJsonValue, true, true)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureTwo, newCqlLibraryName+"second", true, true)

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