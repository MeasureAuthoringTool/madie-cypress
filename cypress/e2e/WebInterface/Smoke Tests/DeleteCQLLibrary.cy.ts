import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { CQLLibraryPage, EditLibraryActions } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Header } from "../../../Shared/Header"

const now = Date.now()
const libraryName = 'TestLibrary1' + now
const publisher = 'Mayo Clinic'

describe('Delete Library', () => {

    beforeEach('Create library and Login', () => {

        CQLLibraryPage.createCQLLibraryAPI(libraryName, publisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Verify Library Owner can Delete Library through Library page Action center', () => {

        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        CQLLibraryPage.actionCenter(EditLibraryActions.delete)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Draft CQL Library has been deleted.')

        //Verify the deleted library is not on My Libraries page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', libraryName)

        //Navigate to All Libraries tab
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        //Verify the deleted library is not on All Measures page list
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', libraryName)
    })
})

describe('Delete Library ownership validation', () => {

    beforeEach('Create library and Login as ALT User', () => {

        CQLLibraryPage.createCQLLibraryAPI(libraryName, publisher)
        OktaLogin.AltLogin()
    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteLibrary(libraryName)
    })

    it('Verify Non Owner can not Delete Library through Action center', () => {

        cy.get(Header.cqlLibraryTab).click()

        //Verify the library is not on My Libraries Page List
        cy.get(CQLLibraryPage.myLibrariesBtn).should('not.contain', libraryName)

        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        CQLLibrariesPage.clickViewforCreatedLibrary()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryNameTextbox, 11500)

        cy.get(CQLLibraryPage.actionCenterButton).should('not.exist')
    })
})
