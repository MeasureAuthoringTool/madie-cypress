import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

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
        CreateMeasurePage.CreateQICoreMeasureAPI(measureOne, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, null, null, null, null, null, null,
            null, 'Procedure')
        TestCasesPage.CreateTestCaseAPI(title1, series, description, validJsonValue)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureOne, newCqlLibraryName)

    })

    it('Delete button brings up confirmation modal and clicking yes, removes the existing Measure group', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on the second group that was just created
        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()

        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.deleteGroupbtn).click()

        //presence of modal / confirmation modal appears
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('exist')
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('be.visible')

        //modal has messaging asking the user to confirm the deletion
        cy.get(MeasureGroupPage.deleteMeasureGroupConfirmationMsg).should('exist')
        cy.get(MeasureGroupPage.deleteMeasureGroupConfirmationMsg).contains('Measure Group 1 will be deleted. Are you sure you want to delete this measure group?')

        //clicking "yes" to confirm deletion of group
        cy.get(MeasureGroupPage.yesDeleteModalbtn).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.yesDeleteModalbtn).click({ force: true })

        //confirm that the modal has closed
        cy.get(MeasureGroupPage.deleteMeasureGroupModal).should('not.exist')

        cy.get(MeasureGroupPage.measureGroupOne).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.measureGroupOne).click()

        //confirm Scoring value is blank
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Select Scoring')
    })

    it('Confirmation modal has a Keep button and clicking on it will result in the group persisting', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

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

    it('Test Cases still loads after all groups are deleted', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

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
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Select Scoring')

        //navigate to the test case list tab / page
        cy.get(EditMeasurePage.testCasesTab).should('exist').should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        //confirm test case is still present on measure
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=view-edit-test-case-button-' + fileContents + ']', { timeout: 80000 }).should('be.visible')
            cy.get('[data-testid=view-edit-test-case-button-' + fileContents + ']', { timeout: 80000 }).click()
        })
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((mId) => {
            cy.readFile('cypress/fixtures/measureId').should('exist').then((tId) => {
                cy.intercept('GET', 'https://dev-madie.hcqis.org/measures/' + mId + '/edit/test-cases/' + tId, [])
            })
        })
    })
})

describe('Ownership test when deleting groups', () => {
    beforeEach('Create measure(s), group(s), test case(s), and login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName1 + randValue

        //create new measure via temp user
        CreateMeasurePage.CreateQICoreMeasureAPI(measureTwo, newCqlLibraryName + "ALT", measureCQL, 1, true)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(1, true, null, null, null,
            null, null, null, 'Procedure')

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.UILogout()

        Utilities.deleteMeasure(measureTwo, newCqlLibraryName + "ALT", false, true, 1)

    })

    it('User can only delete groups from a measure that they own', () => {

        //Verify the Measure on My Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureTwo)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Verify the Measure on All Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('contain', measureTwo)

        //Click on Edit Measure
        MeasuresPage.actionCenter('view', 1)

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on Delete button for group
        cy.get(MeasureGroupPage.deleteGroupbtn).should('not.exist')
    })
})