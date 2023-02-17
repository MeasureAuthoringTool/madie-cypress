import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {Utilities} from "../../../Shared/Utilities"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../Shared/CQLEditorPage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {MeasureCQL} from "../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid_w_All_Encounter
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Delete Test Case', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-02', '2013-01-01')
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null,null,null,null,
            null,'Procedure')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Delete Test Case - Success scenario', () => {

        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        TestCasesPage.clickDeleteTestCaseButton()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete ' + testCaseTitle + '?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCaseTitle)

    })

    it('Verify Non owner of the Measure unable to delete Test Case', () => {

        MeasuresPage.clickEditforCreatedMeasure()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Logout()

        //Login as Alt User
        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=delete-test-case-btn-'+ fileContents +']').should('not.exist')
        })

    })
})
