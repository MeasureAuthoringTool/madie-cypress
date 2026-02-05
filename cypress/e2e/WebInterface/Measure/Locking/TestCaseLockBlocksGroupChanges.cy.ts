import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { TestCase, TestCasesPage } from "../../../../Shared/TestCasesPage"

const now = Date.now()
const qicoreMeasureName = 'TCLockBlockGroup' + now
const measureCQLPFTests = QiCore4Cql.CQL_Populations
const tc: TestCase = {
    title: 'Example test case',
    group: 'PASS',
    description: 'this will be locked by altUser'
}
let harpUserALT = ''

// https://jira.cms.gov/browse/MAT-9511
describe('Changes to groups are not allowed when a test case is locked by another user', () => {

    beforeEach('Create measures', () => {

        harpUserALT = OktaLogin.getUser(true)

        CreateMeasurePage.CreateQICoreMeasureAPI(qicoreMeasureName, qicoreMeasureName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '',
            'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI(tc.title, tc.group, tc.description)

        // shares QiCore measure to harpUserALT - need this user to lock the measure later
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        // sets lock on test case by altUser
        Utilities.lockControl(MadieObject.TestCase, true, true)
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Population Criteria tab is read-only & shows a message when users are prevented from making group changes', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        // demonstrates that groups page loads in read-only mode
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).should('have.attr', 'readonly')

        // user message
        cy.get('[data-testid="success-alerts"]').should('have.text', 'The Population Criteria cannot be edited because changes to the Population Criteria will update test cases and one or more test cases are locked by another user.')
    })
})
