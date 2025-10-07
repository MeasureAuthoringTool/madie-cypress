import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MadieObject, Utilities} from "../../../../Shared/Utilities"
import {Header} from "../../../../Shared/Header"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let CQLLibraryPublisher = 'SemanticBits'

//Skipping until Feature flag 'Locking' is removed
describe.skip('CQL Library Locking Validations', () => {

    beforeEach('Create CQL Library', () => {

        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(newCQLLibraryName)
    })

    it('User unable to delete CQL Library, when the Library is locked by a different User', () => {

        //Lock CQL Library with ALT User
        cy.setAccessTokenCookie()
        Utilities.lockControl(MadieObject.Library, true, true)

        //Login as Regular user
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        Utilities.waitForElementDisabled(CQLLibrariesPage.actionCenterDeleteBtn, 50000)

        //Delete Library Locks
        Utilities.verifyAllLocksDeleted(MadieObject.Library, true)
    })
})