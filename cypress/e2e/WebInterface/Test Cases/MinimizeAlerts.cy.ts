import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { QiCore4Cql } from "../../../Shared/FHIRMeasuresCQL"
import { TestCasesPage } from "../../../Shared/TestCasesPage"

const now = Date.now()
const measureName = 'MinimizeAlerts' + now
const CqlLibraryName = 'MinimizeAlertsLib' + now
const errorCql = QiCore4Cql.intentionalErrorCql.replace('TestLibrary16969620425371870', CqlLibraryName)

describe('Minimize Alerts - Measure with a CQL error', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, { measureCql: errorCql })
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 25000)
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Test case list throws error for no population criteria', () => {

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

    it('Test case shift dates failure shows error', () => {

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
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('2')
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()
        Utilities.waitForElementDisabled(TestCasesPage.shftAllTestCasesSaveBtn, 9500)

        // known issue - warning will be in a 2nd box, separate from errors
        cy.get(TestCasesPage.executionContextWarning).should('be.visible')
        cy.get('[data-testid="warn-title"]').should('have.text', 'The following Test Case dates could not be shifted. Please try again. If the issue continues, please contact helpdesk.abc - empty testcase')

        // clear both - don't need qualifier .eq() for 2nd one, it's the only id
        cy.get(CQLEditorPage.minimizeButton).eq(1).click()
        cy.get(CQLEditorPage.minimizeButton).click()

        // Both boxes are gone
        cy.get(TestCasesPage.executionContextWarning).should('not.exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('not.exist')

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

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, { measureCql: errorCql })
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 18500)
        OktaLogin.Logout()

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.get(MeasuresPage.ownedMeasures).wait(1000).click()
        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        MeasuresPage.actionCenter('edit')
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
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
