import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { QiCore4Cql } from "../../../Shared/FHIRMeasuresCQL"

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

    it('On CQL Editor, user can minimize and then maximize the error list', () => {

        // CQL save successful, orange box shows with 1 issue
        cy.get(CQLEditorPage.orangeWarningBox).should('have.length', 0)

        cy.get(CQLEditorPage.minimizeButton).click()

        // Orange box is gone, alerts tab shows on right side
        cy.get(CQLEditorPage.orangeWarningBox).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // Click on the Alerts tab
        cy.get(CQLEditorPage.minimizedAlertsTab).click()

        // Alerts tab is gone, orange box no longer shows as warnings are only in-line in the CQL Editor
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
    })

    it('On CQL Editor, after minimzing errors and navigating away; when user returns, the original error list shows', () => {

        // CQL save successful, orange box shows with 1 issue
        cy.get(CQLEditorPage.orangeWarningBox).should('have.length', 0)

        cy.get(CQLEditorPage.minimizeButton).click()

        // Orange box is gone, alerts tab shows on right side
        cy.get(CQLEditorPage.orangeWarningBox).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // nav away - go to details tab
        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.wait(500)

        // come back to cql editor
        cy.get(EditMeasurePage.cqlEditorTab).click()

        // Alerts tab is gone, main box now shows as red
        cy.get(CQLEditorPage.errorMsg).should('be.visible')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
    })

    it('On Populations page, user can minimize and then maximize the error list', () => {

        // verify error box
        cy.get(CQLEditorPage.errorMsg).should('have.length', 1)

        cy.get(EditMeasurePage.measureGroupsTab).click()

        // click minimize
        cy.get(CQLEditorPage.minimizeButton).click()
        cy.wait(2500) // change to wait for alert to disappear

        // verify box gone & label shows on right side
        cy.get('[data-testid="error-alerts"]').should('not.exist')
        cy.get('[data-testid="minimized-alert"]').should('be.visible')

        // click label
        cy.contains('Display Alerts').click()
        cy.wait(2500)

        // verify label gone & error box re-appears
        cy.get('[data-testid="error-alerts"]').should('be.visible')
            .and('have.text', 'Please complete the CQL Editor process before continuing')
        cy.get('[data-testid="minimized-alert"]').should('not.exist')

        cy.wait(2500)
    })
})

describe('Minimize Alerts - Non-owner can also minimize to review the measure', () => {

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
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Non Measure owner can perform minimize action', () => {

        // CQL save successful, red box shows with 1 issue
        cy.get(CQLEditorPage.errorMsg).should('have.length', 1)

        cy.get(CQLEditorPage.minimizeButton).click()

        // Red box is gone, alerts tab shows on right side
        cy.get(CQLEditorPage.errorMsg).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // Click on the Alerts tab
        cy.get(CQLEditorPage.minimizedAlertsTab).click()

        // Alerts tab is gone, red box shows again
        cy.get(CQLEditorPage.errorMsg).should('be.visible')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
    })
})
