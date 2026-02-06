import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"

let CqlLibraryOne: string
const CQLLibraryPublisher = 'SemanticBits'
const versionNumber = '1.0.000'

describe('CompareLibraryVersions', () => {

    beforeEach('Create CQL Library and Login', () => {

        CqlLibraryOne = 'CompareLibraryVersion' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)
        CQLLibraryPage.versionLibraryAPI(versionNumber)
    })
    afterEach('Logout and Clean up CQL Libraries', () => {

        OktaLogin.UILogout()
        Utilities.deleteLibrary(CqlLibraryOne, false, 2)
    })

    it('Compare two Versions of a CQL Library', () => {
        let currentUser = Cypress.env('selectedUser')
        const filePath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'
        const filePath2 = 'cypress/fixtures/' + currentUser + '/cqlLibraryId2'
        let updatedCqlLibraryName = 'Updated' + CqlLibraryOne + Date.now()
        //Add Draft to Versioned Library
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('draft')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(updatedCqlLibraryName)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')

        //intercept draft id once library is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/cql-libraries/draft/' + fileContents).as('draft')
        })
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()

        cy.wait('@draft', {timeout: 60000}).then((request) => {
            cy.writeFile(filePath2, request.response.body.id)
        })

        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')

        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', '1.0.000')
        cy.get(CQLLibrariesPage.row0_Status).should('contain', 'Draft')

        cy.get(CQLLibrariesPage.row0_ExpandArrow).should('be.visible')
        cy.get(CQLLibrariesPage.row0_ExpandArrow).click()

        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.get('[data-testid="cqlLibrary-expanded-' + fileContents + '"]').should('be.visible')
            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '-version-content"]').should('contain.text', '1.0.000')
            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '-content"]').should('contain.text', CqlLibraryOne)
            cy.get('[data-testid="cql-library-action-' + fileContents + '"]').should('be.visible')
            cy.get('[data-testid="cql-library-action-' + fileContents + '"]').should('be.enabled')
        })

        cy.log('Draft Created Successfully')

        //Check Draft Library
        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()

        //Expand arrow and check Versioned Library
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '_select"] > input').click()
        })

        //Click on Compare Versions button
        cy.get(MeasuresPage.compareVersionsBtn).should('be.enabled')
        cy.get('[data-testid="compare-versions-action-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Compare Library Versions')
        cy.get(MeasuresPage.compareVersionsBtn).click()

        //Verify Popup Screen
        cy.contains('h2', 'Compare Library Versions').should('be.visible')
        cy.get('[data-testid="library-name"]').should('contain.text', '-- ' + CqlLibraryOne + ' ++ ' + updatedCqlLibraryName)
    })
})