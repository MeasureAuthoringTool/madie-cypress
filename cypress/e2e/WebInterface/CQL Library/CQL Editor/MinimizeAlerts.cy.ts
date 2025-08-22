import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { QiCore4Cql } from "../../../../Shared/FHIRMeasuresCQL"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"

const now = Date.now()
const libraryName = 'MinimizeAlertsLib' + now
const errorCql = QiCore4Cql.intentionalErrorCql.replace('TestLibrary16969620425371870', libraryName)

describe('Minimize Alerts - Library with a CQL error', () => {

    beforeEach('Create Library and Login', () => {

        CQLLibraryPage.createCQLLibraryAPI(libraryName, 'ICF', false, false, errorCql) 
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Save CQL
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        Utilities.waitForElementDisabled(CQLLibraryPage.updateCQLLibraryBtn, 25000)
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(libraryName)
    })

    it('On CQL Editor, user can minimize and then maximize the error list', () => {

        // CQL save successful, green box shows with 1 issue
        cy.get(CQLEditorPage.greenMessageBox).should('have.length', 1)

        cy.get(CQLEditorPage.minimizeButton).click()

        // Green box is gone, alerts tab shows on right side
        cy.get(CQLEditorPage.greenMessageBox).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // Click on the Alerts tab
        cy.get(CQLEditorPage.minimizedAlertsTab).click()

        // Alerts tab is gone, green box shows again
        cy.get(CQLEditorPage.greenMessageBox).should('be.visible')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
    })

    it('On CQL Editor, after minimzing errors and navigating away; when user returns, the original error list shows', () => {
    
        // CQL save successful, green box shows with 1 issue
        cy.get(CQLEditorPage.greenMessageBox).should('have.length', 1)

        cy.get(CQLEditorPage.minimizeButton).click()

        // Green box is gone, alerts tab shows on right side
        cy.get(CQLEditorPage.greenMessageBox).should('not.exist')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('be.visible')

        // nav away - back to library list
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(500)

        // come back to cql editor
        CQLLibrariesPage.clickEditforCreatedLibrary()

        // Alerts tab is gone, main box now shows as red
        cy.get(CQLEditorPage.errorMsg).should('be.visible')
        cy.get(CQLEditorPage.minimizedAlertsTab).should('not.exist')
    })
})

describe('Minimize Alerts - Non-owner can also minimize to review the Library', () => {

    beforeEach('Create Library and Login', () => {

        CQLLibraryPage.createCQLLibraryAPI(libraryName, 'ICF', false, false, errorCql) 
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Save CQL
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        Utilities.waitForElementDisabled(CQLLibraryPage.updateCQLLibraryBtn, 25000)
        OktaLogin.Logout()

        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesTab).click()
        CQLLibrariesPage.clickViewforCreatedLibrary()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(libraryName)
    })

    it('Verify Non-owner can perform minimize action', () => {

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
