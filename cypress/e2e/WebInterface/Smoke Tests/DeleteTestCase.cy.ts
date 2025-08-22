import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { TestCase, TestCasesPage } from "../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

const now = Date.now()
let measureName = 'DeleteTC' + now
let CqlLibraryName = 'DeleteTCLib' + now
let measureCQL = MeasureCQL.ICFCleanTest_CQL.replace('SimpleFhirLibrary', CqlLibraryName)
const testCase1: TestCase = {
    title: 'Title for Auto Test',
    description: 'DENOMFail test case',
    group: 'SBTestSeries',
    json: TestCaseJson.TestCaseJson_Valid_w_All_Encounter
}
const testCase2: TestCase = {
    title: 'Another Title',
    description: 'Successful test case',
    group: 'SBTestSeries'
}

describe('Delete Test Case', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2012-01-02', '2013-01-01')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, null, null, null, null, null,
            null, null, 'Procedure')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Delete single Test Case - Success scenario', () => {

        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group)

        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('not.exist')
        cy.get(TestCasesPage.exportTestCasesBtn).should('not.exist')

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete ' + testCase1.title + '?')
        cy.get(CQLEditorPage.deleteContinueButton).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase1.title)
    })

    it('Delete multiple Test Cases - Success scenario', () => {

        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group)
        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group)

        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(CQLEditorPage.confirmationMsgRemoveDelete).should('contain.text', 'Are you sure you want to delete ' + testCase2.title + ', ' + testCase1.title + '?')
        cy.get(CQLEditorPage.deleteContinueButton).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase1.title)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase2.title)
    })

    it('Verify Non owner of the Measure unable to delete Test Case', () => {

        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group)

        OktaLogin.UILogout()

        //Login as Alt User
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(MeasuresPage.allMeasuresTab).click({ force: true })

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
        cy.get(TestCasesPage.importTestCaseBtn).should('not.exist')
        cy.get(TestCasesPage.newTestCaseButton).should('not.exist')

        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.reportsButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        
        cy.contains('View').should('be.visible')
    })
})
