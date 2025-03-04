import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"

let CqlLibraryOne = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Add Version to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {
        //Create CQL Library with Regular User
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Add Version to the CQL Library', () => {

        let versionNumber = '1.0.000'
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter("version")

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
})


describe('Action Center Buttons - Add Version to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {

        //Create CQL Library with Regular User
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Add Version to the CQL Library using Action Center Buttons', () => {

        let versionNumber = '1.0.000'

        OktaLogin.Login()
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

    it('Non Measure owner unable to Version CQL Library using Action Center buttons', () => {

        OktaLogin.AltLogin()

        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 600000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        //Verify that the Version button is disabled for Non Measure owner
        cy.get(CQLLibrariesPage.actionCenterVersionBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterVersionBtn).should('be.disabled')

        Utilities.deleteLibrary(CqlLibraryOne)

    })
})
