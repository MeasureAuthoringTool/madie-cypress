import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { CQLLibraryPage, EditLibraryActions } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Header } from "../../../Shared/Header"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"

const libraryName = 'DeleteCQLLibraryTest' + Date.now()
const publisher = 'Mayo Clinic'

describe('Delete CQL Library', () => {

    beforeEach('Create library and Login', () => {

        CQLLibraryPage.createCQLLibraryAPI(libraryName, publisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Verify Library Owner can Delete Library through Action center on Library list Page', () => {

        let ownedCountBefore: number, 
            ownedCountAfter: number, 
            allCountBefore: number, 
            allCountAfter: number

        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibSearchResultsTable, 11500)

        // need this for now - it lets the library counts calculate
        cy.wait(8500)

        // also checks for counts on tabs - https://jira.cms.gov/browse/MAT-8360
        cy.get(CQLLibraryPage.ownedLibrariesTab).invoke('text').then(displayText => {

            expect(displayText).to.contain('Owned Libraries')
            const numberAsString = displayText.toString().split('(')[1].slice(0, -1)
            ownedCountBefore = Number(numberAsString)
        })

        cy.get(CQLLibraryPage.sharedLibrariesTab).invoke('text').then(displayText => {

            expect(displayText).to.contain('Shared Libraries')
        })

        cy.get(CQLLibraryPage.allLibrariesTab).invoke('text').then(displayText => {

            expect(displayText).to.contain('All Libraries')
            const numberAsString = displayText.toString().split('(')[1].slice(0, -1)
            allCountBefore = Number(numberAsString)
        })

        CQLLibrariesPage.cqlLibraryActionCenter('delete')

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        //verify cancel and Library remains
        cy.get(CQLLibraryPage.cqlLibraryDeleteDialogCancelBtn).click()
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        CQLLibrariesPage.cqlLibraryActionCenter('delete')

        //verify deleting Library removes it from library list
        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDeleteDialog, 50000)
        cy.get(CQLEditorPage.deleteContinueButton).click()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox, 50000)
        cy.get(CQLLibraryPage.cqlLibrarySuccessfulDeleteMsgBox).should('contain.text', 'The Draft CQL Library has been deleted.')

        //Verify the deleted library is not on My Libraries page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', libraryName)

        //Navigate to All Libraries tab
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        // verify library counts have changed -1
        cy.get(CQLLibraryPage.ownedLibrariesTab).invoke('text').then(displayText => {

            const numberAsString = displayText.toString().split('(')[1].slice(0, -1)
            ownedCountAfter = Number(numberAsString)
            expect(ownedCountBefore).is.greaterThan(ownedCountAfter)
        })

        cy.get(CQLLibraryPage.allLibrariesTab).invoke('text').then(displayText => {

            const numberAsString = displayText.toString().split('(')[1].slice(0, -1)
            allCountAfter = Number(numberAsString)
            expect(allCountBefore).is.greaterThan(allCountAfter)
        })

        //Verify the deleted library is not on All Measures page list
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
