import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLLibraryPage, EditLibraryActions } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"

let CqlLibraryOne: string
let CQLLibraryPublisher = 'SemanticBits'
let versionNumber = '1.0.000'

describe('Action Center Buttons - Add Version to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {

        CqlLibraryOne = 'VersioningLib' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Add Version to the CQL Library from My Libraries', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('version')

        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('exist')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('be.enabled')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()

        cy.get(CQLLibrariesPage.createVersionContinueButton).should('exist')
        cy.get(CQLLibrariesPage.createVersionContinueButton).should('be.visible')
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(CqlLibraryOne, versionNumber)
        cy.log('Version Created Successfully')
    })

    it('Add Version to the CQL Library from the Edit Library screen', () => {

        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.libraryInfoPanel).contains('0.0.000').should('be.visible')

        CQLLibraryPage.actionCenter(EditLibraryActions.version)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'New version of CQL Library is Successfully created.')

        cy.get(CQLLibraryPage.libraryInfoPanel).contains(versionNumber).should('be.visible')
    })

    it('Non Measure owner unable to Version CQL Library using Action Center buttons', () => {

        OktaLogin.AltLogin()

        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 600000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        //Verify that the Version button is disabled for Non Measure owner
        cy.get(CQLLibrariesPage.actionCenterVersionBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterVersionBtn).should('be.disabled')

        CQLLibrariesPage.clickViewforCreatedLibrary()

        cy.get(CQLLibraryPage.actionCenterButton).should('not.exist')

        Utilities.deleteLibrary(CqlLibraryOne)
    })
})
