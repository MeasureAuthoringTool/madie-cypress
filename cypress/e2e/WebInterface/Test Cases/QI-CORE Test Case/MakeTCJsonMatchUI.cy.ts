import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {Utilities} from "../../../../Shared/Utilities"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"

const now = Date.now()
let measureName = 'TestMeasure' + now
let CqlLibraryName = 'TestLibrary' + now
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + now
let testCaseSeries = 'SBTestSeries'
const measureCQLPFTests = MeasureCQL.CQL_Populations
const testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Success Scenario - Make Test Case Json match UI', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, null)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Make Family and Given names from Test Case Json match with Test Case UI', () => {

        //Navigate to Test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test case page and verify family and given name on Json before match
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tcSearchIcone).click()
        cy.get('.ace_search_form > .ace_search_field').type('family').type('{enter}')
        cy.get(TestCasesPage.testCaseJson).should('contain.text', '"family": "Health"')
        cy.get(TestCasesPage.testCaseJson)
            .invoke('text')
            .then((text: string) => {
                const jsonText = text.replace(/\s+/g, ' ').trim()
                expect(jsonText).to.contain('"given": [ "Lizzy" ]')
            })

        //Navigate to Test case List page and make Json match the UI
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get('[data-testid="test-case-title-0_select"]').click()
        cy.get('[data-testid="make-json-match-ui-action-btn"]').click()
        cy.get('.MuiDialog-paper > .MuiBox-root').should('contain.text', 'Are you sure?')
        cy.get('.MuiDialogContent-root').should('have.text', 'For each of the selected 1 test cases, you are about to:Set all "family" fields in the JSON to the group value that was entered in the UISet all "given" fields in the JSON to the title value that was entered in the UIAre you sure you want to proceed?')
        cy.get('[data-testid="make-json-match-ui-continue-button"]').click()
        cy.get('.toast').should('contain.text', 'All family and given fields have been set for the selected test cases')
        Utilities.waitForElementToNotExist('.toast', 60000)

        //Navigate to Edit Test case page and verify family and given name on Json after match
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tcSearchIcone).click()
        cy.get('.ace_search_form > .ace_search_field').type('family').type('{enter}')
        cy.get(TestCasesPage.testCaseJson).should('contain.text', '"family": "SBTestSeries"')
        cy.get(TestCasesPage.testCaseJson)
            .invoke('text')
            .then((text: string) => {
                const jsonText = text.replace(/\s+/g, ' ').trim()
                expect(jsonText).to.contain('"given": [ "test case title" ]')
            })
    })
})

describe('Error message when making Test case match', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, null)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Verify error message when the Test case does not have Json', () => {

        //Navigate to Test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get('[data-testid="test-case-title-0_select"]').click()
        cy.get('[data-testid="make-json-match-ui-action-btn"]').click()
        cy.get('[data-testid="make-json-match-ui-continue-button"]').click()
        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'The operation could not be completed on the selected test cases. Review the JSON to make changes manually.')
    })
})