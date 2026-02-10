import { OktaLogin } from "../../../Shared/OktaLogin"
import { Header } from "../../../Shared/Header"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../Shared/Utilities"

let CQLLibraryName = 'LibraryCheckboxes' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = ''

describe('CQL Library Sharing', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)

        OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)
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