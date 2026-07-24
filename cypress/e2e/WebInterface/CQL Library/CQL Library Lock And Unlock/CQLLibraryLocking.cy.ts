import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MadieObject, Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { LockedEntityValidation } from "../../../../Shared/LockedEntityValidation"

let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserAlt = ''

describe('CQL Library Locking Validations', () => {

    beforeEach('Create CQL Library', () => {
        newCQLLibraryName = `LibraryLocking${Date.now()}${Math.floor((Math.random() * 1000) + 1)}`

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut', () => {

        Utilities.deleteLibrary()
    })

    it('User unable to delete CQL Library, when the Library is locked by a different User', () => {

        //Lock CQL Library with ALT User
        cy.setAccessTokenCookie()
        Utilities.lockSharedLibrary(true)

        //Login as Regular user
        OktaLogin.SessionLogin()
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible('[data-testid="main-nav-bar-cql-library"]', 30000)
        Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 30000)
        cy.get('[data-testid="measure-name-0_select"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)

        //Delete Library Locks
        Utilities.verifyAllLocksDeleted(MadieObject.Library, true)
    })

    it('Pop up on Edit CQL Library screen, when the Library is locked by a different User', () => {

        harpUserAlt = OktaLogin.getUser(true)

        //Lock CQL Library with ALT User
        cy.setAccessTokenCookie()
        Utilities.lockSharedLibrary(true)

        //Login as Regular user
        OktaLogin.SessionLogin()
        cy.get(Header.cqlLibraryTab).click()

        //Click View CQL Library
        CQLLibrariesPage.clickViewforCreatedLibrary()

        //Assert text on the popup screen
        LockedEntityValidation.getDisplayName(harpUserAlt).then((displayName) => {
            const expectedMessage = LockedEntityValidation.lockedModalMessageText('library', displayName, harpUserAlt)
            const legacyMessage = LockedEntityValidation.legacyLockedModalMessageText('library', harpUserAlt)

            cy.get('.MuiBox-root').should('contain.text', 'Library currently In-Use')
            cy.get('.MuiTypography-root > div').should(($message) => {
                LockedEntityValidation.assertTextContainsExpectedOption($message.text(), expectedMessage, legacyMessage)
            })
        })

        //Delete Library Locks
        Utilities.verifyAllLocksDeleted(MadieObject.Library, true)
    })
})
