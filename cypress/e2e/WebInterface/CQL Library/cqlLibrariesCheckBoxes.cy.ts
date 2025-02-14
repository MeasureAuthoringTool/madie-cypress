import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT

//skipping until the LibraryListCheckboxes feature flag is removed
describe.skip('CQL Library Sharing', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })


    it('Verify check box for CQL Libraries appear and can be checked / used', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()

        CQLLibraryPage.checkLibrary(0)
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

    })
})