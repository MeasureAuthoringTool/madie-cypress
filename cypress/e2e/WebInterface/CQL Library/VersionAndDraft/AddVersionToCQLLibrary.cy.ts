import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage"

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

        CQLLibrariesPage.clickVersionforCreatedLibrary()

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
