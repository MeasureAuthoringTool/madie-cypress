import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLLibraryPage, EditLibraryActions } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let CqlLibraryOne: string
const CQLLibraryPublisher = 'SemanticBits'
const versionNumber = '1.0.000'
const filePath = 'cypress/fixtures/cqlLibraryId'

describe('Action Center Buttons - Add Draft to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {

        CqlLibraryOne = 'DraftingLibrary' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(filePath).should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql(versionNumber)

                })
            })
        })
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Add Draft to the versioned Library from My Libraries', () => {

        //Add Draft to Versioned Library
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookie()
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('draft')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(CqlLibraryOne)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')

        //intercept draft id once library is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/cql-libraries/draft/' + fileContents).as('draft')
        })
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully').wait(1000)

        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookie()

        //Delete Draft Library
        Utilities.deleteLibrary(CqlLibraryOne)
    })

    it('Add Draft to the versioned Library from Edit Library screen', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookie()
        //intercept draft id once library is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/cql-libraries/draft/' + fileContents).as('draft')
        })

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.clickViewforCreatedLibrary()
        CQLLibraryPage.actionCenter(EditLibraryActions.draft)

        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibraryPage.draftBubble).should('be.visible')
        cy.log('Draft Created Successfully')
        OktaLogin.UILogout()

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookie()

        //Delete Draft Library
        Utilities.deleteLibrary(CqlLibraryOne)
    })

    it('Non Measure Owner unable to add Draft to the versioned Library using Action Center Buttons', () => {

        //Verify that the Draft button is disabled for Non Measure owner
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookieALT()

        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click().wait(1000)
        cy.get(Header.mainMadiePageButton).click().wait(1000)
        cy.get(Header.cqlLibraryTab).click().wait(1000)
        cy.reload()
        cy.get(CQLLibraryPage.allLibrariesBtn).wait(2000).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 600000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.disabled')

        //Verify that Non Measure owner unable to edit Library
        CQLLibrariesPage.clickViewforCreatedLibrary(null, true)
        cy.get(TestCasesPage.importTestCaseSuccessInfo).should('contain.text', 'You are not the owner of the CQL Library. Only owner can edit it.')
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('have.attr', 'disabled', 'disabled')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('have.attr', 'disabled', 'disabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')

        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })
    })
})
