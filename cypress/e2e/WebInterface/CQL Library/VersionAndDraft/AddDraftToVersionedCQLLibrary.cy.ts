import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { Header } from "../../../../Shared/Header"
import { Utilities } from "../../../../Shared/Utilities"

let CqlLibraryOne = ''
let updatedCqlLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Add Draft to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {
        //Create CQL Library with Regular User
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Add Draft to the versioned Library', () => {

        let versionNumber = '1.0.000'
        updatedCqlLibraryName = 'UpdatedTestLibrary1' + Date.now()
        let filePath = 'cypress/fixtures/cqlLibraryId'

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

        CQLLibrariesPage.cqlLibraryActionCenter("draft")
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
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully')

        //navigate into the Library's detail / edit page
        cy.get(Header.cqlLibraryTab).click()
        //<a tabindex="0" role="tab" aria-selected="true" name="cql-libraries" aria-label="CQL Library" id="cql-library-main-nav-bar-tab" data-testid="main-nav-bar-cql-library" class="MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary Mui-selected css-1q7l0ib active" href="/cql-libraries" aria-current="page" data-cypress-el="true">Libraries<span class="MuiTouchRipple-root css-w0pj6f"></span></a>
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //confirm that CQL Editor window is not empty
        cy.get(CQLLibraryPage.cqlLibraryEditorTextBox)
            .find('[class="ace_layer ace_text-layer"]')
            .find('[class="ace_line_group"]')
            .find('[class=ace_line]')
            .find('[class="ace_identifier"]')
            .should('exist')
    })

})


describe('Action Center Buttons - Add Draft to CQL Library', () => {

    beforeEach('Create CQL Library and Login', () => {
        //Create CQL Library with Regular User
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CQLLibraryPage.createAPICQLLibraryWithValidCQL(CqlLibraryOne, CQLLibraryPublisher)

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Add Draft to the versioned Library using Action Center Buttons', () => {

        let versionNumber = '1.0.000'
        updatedCqlLibraryName = 'UpdatedTestLibrary1' + Date.now()
        let filePath = 'cypress/fixtures/cqlLibraryId'

        cy.clearCookies()
        cy.clearLocalStorage()
        //Version CQL Library
        cy.setAccessTokenCookie()
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
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully')

        //Delete Draft Library
        Utilities.deleteLibrary(updatedCqlLibraryName)
    })

    it('Non Measure Owner unable to add Draft to the versioned Library using Action Center Buttons', () => {

        let versionNumber = '1.0.000'
        updatedCqlLibraryName = 'UpdatedTestLibrary1' + Date.now()
        let filePath = 'cypress/fixtures/cqlLibraryId'

        cy.clearCookies()
        cy.clearLocalStorage()
        //Version CQL Library
        cy.setAccessTokenCookie()
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

        //Verify that the Draft button is disabled for Non Measure owner
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 600000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.visible')
        cy.get(CQLLibrariesPage.actionCenterDraftBtn).should('be.disabled')

        //Verify that Non Measure owner unable to edit Library
        CQLLibrariesPage.clickViewforCreatedLibrary()
        cy.get(CQLLibraryPage.editLibraryOwnershipError).should('contain.text', 'You are not the owner of the CQL Library. Only owner can edit it.')
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('have.attr', 'disabled', 'disabled')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('have.attr', 'disabled', 'disabled')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).should('be.disabled')
    })
})
