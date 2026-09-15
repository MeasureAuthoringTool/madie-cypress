import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { CQLLibraryPage, EditLibraryActions } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

let libraryName = ''
const publisher = 'Mayo Clinic'

describe('Delete CQL Library', () => {

    beforeEach('Create library and restore session', () => {

        libraryName = 'DeleteCQLLibraryTest' + Date.now()
        CQLLibraryPage.createCQLLibraryAPI(libraryName, publisher)
        OktaLogin.SessionLogin()
    })

    const openDeleteDialogForCreatedLibrary = (): void => {
        CQLLibrariesPage.selectLibraryRow()
        cy.get(CQLLibrariesPage.actionCenterDeleteBtn).should('be.visible').and('be.enabled').click()
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialog, { timeout: 50000 }).should('be.visible')
    }

    it('Verify Library Owner can Delete Library through Action center on Library list Page', () => {
        CQLLibrariesPage.openLibrariesList()

        openDeleteDialogForCreatedLibrary()

        //verify cancel and Library remains
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn).click()
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialog).should('not.exist')
        openDeleteDialogForCreatedLibrary()

        //verify deleting Library removes it from library list
        cy.get(CQLEditorPage.deleteContinueButton).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryGreenToast, 50000)
        cy.get(CQLLibraryPage.cqlLibraryGreenToast).should('contain.text', 'The Draft CQL Library has been deleted.')

        //Verify the deleted library is not on My Libraries page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', libraryName)

    })

    it('Verify Library Owner can Delete Library through Action center on Edit Library Page', () => {

        CQLLibrariesPage.clickEditforCreatedLibrary()

        CQLLibraryPage.actionCenter(EditLibraryActions.delete)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Draft CQL Library has been deleted.')

        //Verify the deleted library is not on My Libraries page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', libraryName)

        //Navigate to All Libraries tab
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        //Verify the deleted library is not on All Measures page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', libraryName)
    })
})
