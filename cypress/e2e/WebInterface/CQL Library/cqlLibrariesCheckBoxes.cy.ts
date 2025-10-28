import { Environment } from "../../../Shared/Environment"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = ''

//skipping until the LibraryListCheckboxes feature flag is removed
describe('CQL Library Sharing', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')
        OktaLogin.setupUserSession(false, currentUser, currentAltUser)
        harpUserALT = OktaLogin.getUser(true, currentUser, currentAltUser)
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })


    it('Verify check box for CQL Libraries appear and can be checked / used', () => {

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()

        CQLLibraryPage.checkLibrary(0)
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

    })
})