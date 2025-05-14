import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import {CQLLibraryPage, EditLibraryActions} from "../../../../Shared/CQLLibraryPage"
import {Environment} from "../../../../Shared/Environment"
import { Header } from "../../../../Shared/Header"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import {MadieObject, PermissionActions, Utilities} from "../../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let updatedCQLLibraryName = ''

describe('Un Share CQL Library using Action Center buttons', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut and Clean up', () => {

        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteLibrary(newCQLLibraryName)
    })

    it('Verify CQL Library owner can un share Library from Libraries page Action centre share button', () => {

        //Share CQL Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as Regular User
        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Share Library with ALT user
        CQLLibrariesPage.cqlLibraryActionCenter('share')
        cy.get(CQLLibrariesPage.unshareOption).click({force: true})
        cy.get(CQLLibrariesPage.expandArrow).click()

        cy.get(CQLLibrariesPage.unshareCheckBox).click()
        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get(CQLLibrariesPage.acceptBtn).click()

        Utilities.waitForElementVisible('[class="MuiAlert-message css-127h8j3"]', 60000)
        cy.get('[class="MuiAlert-message css-127h8j3"]').should('contain.text', 'The Library(s) were successfully unshared.')

        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        cy.get('[class="cql-library-table"]').should('not.contain', CQLLibraryName)
    })

    it('Verify CQL Library owner can un share Library from Edit Library page Action centre share button', () => {

        //Share CQL Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as Regular user
        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Un share Library
        CQLLibraryPage.actionCenter(EditLibraryActions.share)
        cy.get(CQLLibrariesPage.unshareOption).click({force: true})
        cy.get(CQLLibrariesPage.expandArrow).click()

        cy.get(CQLLibrariesPage.unshareCheckBox).eq(1).click()
        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get(CQLLibrariesPage.acceptBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Library(s) were successfully unshared.')

        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        cy.get('[class="cql-library-table"]').should('not.contain', CQLLibraryName)

    })
})

describe('Un Share CQL Library using Action Center buttons - Multiple instances', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1
        updatedCQLLibraryName = CQLLibraryName + randValue + 5

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })

    it('Verify all instances of the CQL Library (Version and Draft) are shared to the user', () => {

        const versionNumber = '1.0.000'
        //Version CQL Library
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Draft Library
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/draft/' + cqlLibraryId,
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": cqlLibraryId,
                        "cqlLibraryName": updatedCQLLibraryName,
                        "model": 'QI-Core v4.1.1'
                    }

                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.draft).to.eql(true)

                })
            })
        })
        //Share CQL Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Select both the instances (Draft and Version) of the Library and verify Library table contains latest instance(Draft) of the Library
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        cy.get('[data-testid="cqlLibrary-button-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        cy.get(CQLLibrariesPage.actionCenterShareBtn).click()
        cy.get(CQLLibrariesPage.unshareOption).click({force: true})
        cy.get('[data-testid="library-landing"]').should('contain.text', updatedCQLLibraryName)
        //Verify information text on share screen
        cy.get('[class="share-unshare-dialog-info-text"]').should('contain.text', 'When sharing a Library, all versions and drafts are shared, so only the most recent library name appears here.Deselect the users with whom you want to unshare the library(s).')
        cy.get(CQLLibrariesPage.expandArrow).click()

        cy.get(CQLLibrariesPage.unshareCheckBox).click()
        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get(CQLLibrariesPage.acceptBtn).click()

        Utilities.waitForElementVisible('[class="MuiAlert-message css-127h8j3"]', 60000)
        cy.get('[class="MuiAlert-message css-127h8j3"]').should('contain.text', 'The Library(s) were successfully unshared.')

        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        Utilities.waitForElementVisible('[class="cql-library-table"]', 60000)
        cy.get('[class="cql-library-table"]').should('not.contain', CQLLibraryName)
        cy.get('[class="cql-library-table"]').should('not.contain', updatedCQLLibraryName)
    })
})
