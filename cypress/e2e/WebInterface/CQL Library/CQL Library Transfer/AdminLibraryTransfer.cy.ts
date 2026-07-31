import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Header } from '../../../../Shared/Header'
import { CQLLibraryPage, EditLibraryActions } from '../../../../Shared/CQLLibraryPage'
import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { TestData } from '../../../../Shared/TestData'

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
        CQLLibrariesPage.selectLibraryByName(CQLLibraryName)
        cy.get(CQLLibrariesPage.actionCenterTransferBtn).should('be.enabled').click()

        Utilities.waitForElementWriteEnabled(MeasuresPage.newOwnerTextbox, 5500)
        cy.get(MeasuresPage.newOwnerTextbox).type(harpUserALT)
        cy.get('[data-testid="retainShareAccess"]').click()
        cy.intercept('PUT', '/api/cql-libraries/transfer*').as('transferLibrary')
        cy.get(MeasuresPage.transferContinueButton).should('be.enabled').click()
        cy.wait('@transferLibrary', { timeout: 30000 }).its('response.statusCode').should('eq', 200)

        // Verify success toast
        cy.get('[data-testid="toast-success"]').should(
            'contain.text',
            'The library(s) were successfully transferred. If you chose to retain share access, you will still be able to edit the libraries.'
        )

        OktaLogin.AltLogin()

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.searchForLibraryByName(CQLLibraryName).within(() => {
            // verify shared = true
            cy.get('[data-testid="CheckCircleOutlineIcon"]').should('be.visible')
            cy.contains('button', 'Edit').click()
        })
        cy.get('[data-testid="CQL Library Details"]').click()

        TestData.getAccountDisplayName(harpUserALT).then((owner) => {
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
