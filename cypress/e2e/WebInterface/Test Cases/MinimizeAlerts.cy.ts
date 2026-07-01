import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { QiCore6Cql } from "../../../Shared/FHIRMeasuresCQL"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"

const now = Date.now()
const measureName = 'MinimizeAlerts' + now
const CqlLibraryName = 'MinimizeAlertsLib' + now
const errorCql = QiCore6Cql.intentionalErrorCql
const tc = TestCaseJson.fromCMS1272Strata1

describe('Minimize Alerts - Measure with a CQL error', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: errorCql })
        OktaLogin.SessionLogin()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Clean up and Logout', () => {
        
        Utilities.deleteMeasure()
    })

    it('Minimize alert when Test Case list throws error for no population criteria', () => {

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // Red error box shows with these 2 error messages
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get('[data-testid="generic-fail-text-list"]').children().eq(0).should('have.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')
        cy.get('[data-testid="generic-fail-text-list"]').children().eq(1).should('have.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')

        cy.get(CQLEditorPage.minimizeButton).click()

        // Red box is gone, alerts tab is shown
        cy.get(TestCasesPage.testCaseExecutionError).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // Click on the Alerts tab
        cy.get(CQLEditorPage.minimizedAlertsTab).click()

        // Back to start - red box shows, alerts tab is gone
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
    })

    it('Minimize alert when Test Case shift dates failure shows error', () => {

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // Red error box shows with these 2 error messages
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get('[data-testid="generic-fail-text-list"]').children().eq(0).should('have.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')
        cy.get('[data-testid="generic-fail-text-list"]').children().eq(1).should('have.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')

        // create empty test case
        TestCasesPage.createTestCase('empty testcase', 'nothing', 'abc')

        // shift dates 2 years
        cy.get(TestCasesPage.leftNavExpand).click()
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('2')
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()
        Utilities.waitForElementDisabled(TestCasesPage.shftAllTestCasesSaveBtn, 9500)

        // hide errors
        cy.get(CQLEditorPage.minimizeButton).click()

        // Both boxes are gone
        cy.get(TestCasesPage.executionContextWarning).should('not.exist')

        //Navigate to Details
        cy.get(EditMeasurePage.measureDetailsTab).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // error would persist - warning gets wiped away
        cy.get(TestCasesPage.executionContextWarning).should('not.exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
    })
})

describe('Minimize Alerts - Non-owner can also minimize to review the test cases', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: errorCql })
        OktaLogin.SessionLogin()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
        
        OktaLogin.SessionAltLogin()
        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        MeasuresPage.actionCenter('edit')
    })

    afterEach('Clean up and Logout', () => {
        
        Utilities.deleteMeasure()
    })

    it('Verify Non Measure owner can perform minimize action', () => {

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // Red error box shows with these 2 error messages
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get('[data-testid="generic-fail-text-list"]').children().eq(0).should('have.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')
        cy.get('[data-testid="generic-fail-text-list"]').children().eq(1).should('have.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')

        cy.get(CQLEditorPage.minimizeButton).click()

        // Red box is gone, alerts tab is shown
        cy.get(TestCasesPage.testCaseExecutionError).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // Click on the Alerts tab
        cy.get(CQLEditorPage.minimizedAlertsTab).click()

        // Back to start - red box shows, alerts tab is gone
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
    })
})
