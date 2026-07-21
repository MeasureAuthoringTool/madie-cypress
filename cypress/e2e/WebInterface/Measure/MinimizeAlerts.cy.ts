import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { QiCore6Cql } from "../../../Shared/FHIRMeasuresCQL"

const now = Date.now()
const measureName = 'MinimizeAlerts' + now
const CqlLibraryName = 'MinimizeAlertsLib' + now
const errorCql = QiCore6Cql.intentionalErrorCql

describe('Minimize Alerts - Measure with a CQL error', () => {
    beforeEach('Create Measure and Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: errorCql })
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure()
    })

    it('On CQL Editor, user can minimize and then maximize the error list', () => {
        // CQL save successful, orange box shows with 1 issue
        cy.get(CQLEditorPage.orangeWarningBox).should('have.length', 0)

        CQLEditorPage.minimizeAlerts(CQLEditorPage.orangeWarningBox)

        // Alerts tab is gone, orange box no longer shows as warnings are only in-line in the CQL Editor
        CQLEditorPage.reopenMinimizedAlerts({ hiddenAlertSelector: CQLEditorPage.orangeWarningBox })
    })

    it('On CQL Editor, after minimzing errors and navigating away; when user returns, the original error list shows', () => {
        // CQL save successful, orange box shows with 1 issue
        cy.get(CQLEditorPage.orangeWarningBox).should('have.length', 0)

        CQLEditorPage.minimizeAlerts(CQLEditorPage.orangeWarningBox)

        // nav away - go to details tab
        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.get(EditMeasurePage.measurementInformationSaveButton).should('be.visible')

        // come back to cql editor
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('be.visible')

        // Alerts tab is gone, main box now shows as red
        cy.get(CQLEditorPage.errorMsg).should('be.visible')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
    })

    it('On Populations page, user can minimize and then maximize the error list', () => {
        // verify error box
        cy.get(CQLEditorPage.errorMsg).should('have.length', 1)

        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.measureGroupDescriptionBox).should('be.visible')

        CQLEditorPage.minimizeAlerts(MeasureGroupPage.CQLHasErrorMsg)

        // verify label gone & page-level alert re-appears
        CQLEditorPage.reopenMinimizedAlerts({ visibleAlertSelector: MeasureGroupPage.CQLHasErrorMsg })
        cy.get(MeasureGroupPage.CQLHasErrorMsg)
            .should('be.visible')
            .and('contain.text', 'Please complete the CQL Editor process before continuing')
    })
})

describe('Minimize Alerts - Non-owner can also minimize to review the measure', () => {
    beforeEach('Create Measure and Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, { measureCql: errorCql })
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure()
    })

    it('Verify Non Measure owner can perform minimize action', () => {
        // CQL save successful, red box shows with 1 issue
        cy.get(CQLEditorPage.errorMsg).should('have.length', 1)

        CQLEditorPage.minimizeAlerts(CQLEditorPage.errorMsg)

        // Alerts tab is gone, red box shows again
        CQLEditorPage.reopenMinimizedAlerts({ visibleAlertSelector: CQLEditorPage.errorMsg })
    })
})
