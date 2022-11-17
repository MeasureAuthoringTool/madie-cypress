import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CQLLibraryPage} from "../../../../Shared/CQLLibraryPage"
import {Header} from "../../../../Shared/Header"

let CqlLibraryOne = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Verify non Library owner unable to create Version', () => {

    beforeEach('Create CQL Library with regular user and Login as Alt user', () => {

        CqlLibraryOne = 'TestLibrary' + Date.now()

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

        OktaLogin.AltLogin()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Verify Version button is not visible for non Library owner', () => {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Navigate to All Libraries tab
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            cy.intercept('GET', '/api/cql-libraries/' + fileContents).as('cqlLibrary')

            cy.get('[data-testid="view/edit-cqlLibrary-button-'+ fileContents + '"]').click()
            //Verify version button is not visible
            cy.get('[data-testid="create-new-version-'+ fileContents +'-button"]').should('not.exist')

        })
    })

    it('Verify Non owner of the library unable to edit details', () => {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Navigate to All Libraries tab
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        //Edit CQL Library
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            cy.intercept('GET', '/api/cql-libraries/' + fileContents).as('cqlLibrary')

            cy.get('[data-testid=cqlLibrary-button-'+ fileContents +']').should('exist')
            cy.get('[data-testid=cqlLibrary-button-'+ fileContents +']').should('be.visible')
            cy.get('[data-testid=cqlLibrary-button-'+ fileContents +']').wait(1000).click()

            cy.wait('@cqlLibrary').then(({response}) => {
                expect(response.statusCode).to.eq(200)
            })
        })

        cy.get(CQLLibraryPage.editLibraryOwnershipError).should('contain.text', 'You are not the owner of the CQL Library. Only owner can edit it.')
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('have.attr', 'disabled', 'disabled')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('have.attr', 'disabled', 'disabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

    })
})

