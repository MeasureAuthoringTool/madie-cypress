import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage, EditLibraryActions } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"

const CQLLibraryName = 'AdminTransferLibrary' + Date.now()
const CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = ''

describe('CQL Library Transfer performed by Admin user', () => {

    beforeEach('Create CQL Library', () => {

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

        harpUserALT = OktaLogin.getUser(true)
    })

    it('Admin user can transfer CQL Library of other users', () => {

        OktaLogin.AdminLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesTab).click()

        // initiate transfer to altUser, with retain
        CQLLibrariesPage.cqlLibraryActionCenter('transfer')

        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get('[data-testid="retainShareAccess"]').click()
        cy.get(MeasuresPage.transferContinueButton).click()
        
        // Verify success toast
        cy.get('[data-testid="toast-success"]').should('contain.text', 'The library(s) were successfully transferred. If you chose to retain share access, you will still be able to edit the libraries.')

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
        // verify shared = true
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('be.visible')

        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.readFile('cypress/fixtures/accountRealNames.json').should('exist').then((nameData) => {

            // verify altUser name as owner
            const owner = nameData[harpUserALT]
            cy.get('[data-testid="library-owner-text-field"]').should('contain.text', owner)
        })

        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)

         // show history, verify event messages
        cy.get('[data-testid="library-history-0_actionType"]').should('contain.text', 'SHARED')
        cy.get('[data-testid="library-history-0_additionalActionMessage"]').should('contain.text', 'by MADiE Admin')
        cy.get('[data-testid="library-history-1_actionType"]').should('contain.text', 'OWNERSHIP_TRANSFER')
        cy.get('[data-testid="library-history-1_additionalActionMessage"]').should('contain.text', 'by MADiE Admin')
    })
})