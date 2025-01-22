import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { TestCase, TestCasesPage } from "../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"

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
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, null, null, null, null, null,
            null, null, 'Procedure')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Delete single Test Case - Success scenario', () => {

        MeasuresPage.actionCenter("edit")

        cy.get(TestCasesPage.deleteAllTestCasesBtn).should('not.exist')
        cy.get(TestCasesPage.exportTestCasesBtn).should('not.exist')

        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group)

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete ?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase1.title)
    })

    it('Delete multiple Test Cases - Success scenario', () => {

        MeasuresPage.actionCenter("edit")

        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group)
        TestCasesPage.createTestCase(testCase2.title, testCase2.description, testCase2.group)

        TestCasesPage.checkTestCase(1)
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).click()

        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete ?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase1.title)
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', testCase2.title)
    })

    it('Verify Non owner of the Measure unable to delete Test Case', () => {

        MeasuresPage.actionCenter("edit")

        TestCasesPage.createTestCase(testCase1.title, testCase1.description, testCase1.group, testCase1.json)

        OktaLogin.Logout()

        //Login as Alt User
        OktaLogin.AltLogin()
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 20700)
        cy.get(MeasuresPage.allMeasuresTab).click({ force: true })

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
        cy.get(TestCasesPage.importTestCaseBtn).should('not.exist')
        cy.get(TestCasesPage.newTestCaseButton).should('not.exist')

        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.contains('View').should('be.visible')
    })
})
