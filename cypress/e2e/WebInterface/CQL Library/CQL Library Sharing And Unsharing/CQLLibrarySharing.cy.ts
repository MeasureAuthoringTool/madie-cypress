import { Environment } from "../../../../Shared/Environment"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Header } from "../../../../Shared/Header"
import {CQLLibraryPage, EditLibraryActions} from "../../../../Shared/CQLLibraryPage"
import { CQLLibrariesPage } from "../../../../Shared/CQLLibrariesPage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let updatedCQLLibraryName = ''
let randomCQLLibraryName = 'TestCQLLibrary' + randValue + 5
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let versionNumber = '1.0.000'

describe('CQL Library Sharing', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1
        updatedCQLLibraryName = CQLLibraryName + randValue + 'SomeUpdate' + 9

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(newCQLLibraryName)
    })


    it('Verify Shared CQL Library is viewable under My Libraries tab', () => {
        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

    })

    it('Verify CQL Library can be edited by the shared user', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()


        //Edit CQL Library details
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.log('CQL Library Updated Successfully')

    })
})

describe('CQL Library Sharing - Multiple instances', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 5

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()
        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
    })

    it('Verify all instances in the Library set (Version and Draft) are Shared to the new owner', () => {

        //Version the CQL Library
        CQLLibrariesPage.cqlLibraryActionCenter("version")

        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('exist')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('be.enabled')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()

        cy.get(CQLLibrariesPage.createVersionContinueButton).should('exist')
        cy.get(CQLLibrariesPage.createVersionContinueButton).should('be.visible')
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(CQLLibraryName, versionNumber)
        cy.log('Version Created Successfully')

        //Draft the Versioned CQL Library
        CQLLibrariesPage.cqlLibraryActionCenter('draft')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(randomCQLLibraryName)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')

        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()

        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully')

        //Share Library with ALT User
        cy.clearCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
        cy.get('[data-testid="table-body"]').should('contain', randomCQLLibraryName)
    })
})

describe('Remove user\'s share access from a library', () => {

    beforeEach('Create library and Set Access Token', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

        // initial share to harpUserAlt
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteLibrary(newCQLLibraryName)
    })

    it('After removing access, user can no longer edit the library', () => {

        OktaLogin.AltLogin()

        CQLLibrariesPage.clickEditforCreatedLibrary()

        Utilities.waitForElementVisible(CQLLibraryPage.cqlLibraryDesc, 8000)

        // this update proves edit access
        cy.get(CQLLibraryPage.cqlLibraryDesc).clear().type('input from alt user')
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.REVOKE, harpUserALT)

        // refresh to update permissions
        cy.reload()

        // proves that edit access was removed
        //cy.get(TestCasesPage.newTestCaseButton).should('be.disabled')
        cy.get('#content').should('have.text', 'You are not the owner of the CQL Library. Only owner can edit it.')
    })
})

describe('Share CQL Library using Action Center buttons', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1
        updatedCQLLibraryName = CQLLibraryName + randValue + 5

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(newCQLLibraryName)
    })

    it('Verify CQL Library owner can share Library from Action centre share button and shred user is able to edit Library', () => {

        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Share Library with ALT user
        CQLLibrariesPage.cqlLibraryActionCenter('share')
        cy.get(CQLLibrariesPage.shareOption).click({force: true})
        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(harpUserALT)
        cy.get(CQLLibrariesPage.addBtn).click()

        //Verify that the Harp id is added to the table
        cy.get(CQLLibrariesPage.expandArrow).click()
        cy.get(CQLLibrariesPage.sharedUserTable).should('contain.text', harpUserALT)

        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get('.MuiAlert-message').should('contain.text', 'The Library(s) were successfully shared.')

        //Login as ALT User
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)

        //Delete button disabled for shared owner
        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        cy.get('[data-testid="delete-action-tooltip"]').should('not.be.enabled')

        //Edit Library details
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.log('CQL Library Updated Successfully')

    })

    it('Verify CQL Library owner can share Library from Edit Library page Action centre share button', () => {

        //Login as Regular user
        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Share Library with ALT user
        CQLLibraryPage.actionCenter(EditLibraryActions.share)
        cy.get(CQLLibrariesPage.shareOption).click({force: true})
        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(harpUserALT)
        cy.get(CQLLibrariesPage.addBtn).click()

        //Verify that the Harp id is added to the table
        cy.get(CQLLibrariesPage.expandArrow).click()
        cy.get(CQLLibrariesPage.sharedUserTable).should('contain.text', harpUserALT)

        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Library(s) were successfully shared.')

    })

    it('Action centre share button disabled for Non Library Owner', () => {

        //Login as Alt User
        OktaLogin.AltLogin()

        //Navigate to All Libraries tab
        cy.get(Header.cqlLibraryTab).click().wait(2000)
        cy.get(CQLLibraryPage.allLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.allLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesBtn).click()

        Utilities.waitForElementVisible('[data-testid="cqlLibrary-button-0_select"]', 500000)
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()

        cy.get('[data-testid="share-action-btn"]').should('be.visible')
        cy.get('[data-testid="share-action-btn"]').should('be.disabled')
    })


    it('Verify error message when CQL Library is shared with same user multiple times', () => {

        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Share Library with ALT user
        CQLLibrariesPage.cqlLibraryActionCenter('share')
        cy.get(CQLLibrariesPage.shareOption).click({force: true})
        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(harpUserALT)
        cy.get(CQLLibrariesPage.addBtn).click()

        //Verify that the Harp id is added to the table
        cy.get(CQLLibrariesPage.expandArrow).click()
        cy.get(CQLLibrariesPage.sharedUserTable).should('contain.text', harpUserALT)

        //Share the Library with same user again
        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(harpUserALT)
        cy.get(CQLLibrariesPage.addBtn).click()
        cy.get('[data-testid="harp-id-input-helper-text"]').should('contain.text', 'The selected library(s) are already shared with this user.')

    })
})

describe('Share CQL Library using Action Center buttons - Multiple instances', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1
        updatedCQLLibraryName = CQLLibraryName + randValue + 5

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher)
    })

    afterEach('LogOut', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(updatedCQLLibraryName)

    })

    it('Verify all instances of the CQL Library (Version and Draft) are shared to the user', () => {

        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.cqlLibraryActionCenter('version')

        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('exist')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).should('be.enabled')
        cy.get(CQLLibrariesPage.versionLibraryRadioButton).eq(0).click()

        cy.get(CQLLibrariesPage.createVersionContinueButton).should('exist')
        cy.get(CQLLibrariesPage.createVersionContinueButton).should('be.visible')
        cy.get(CQLLibrariesPage.createVersionContinueButton).click()
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New version of CQL Library is Successfully created')
        CQLLibrariesPage.validateVersionNumber(newCQLLibraryName, versionNumber)
        cy.log('Version Created Successfully')

        //Add Draft to Versioned Library
        CQLLibrariesPage.cqlLibraryActionCenter('draft')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('exist')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.visible')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')
        cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).clear().type(updatedCQLLibraryName)

        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('exist')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
        cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.enabled')

        //intercept draft id once library is drafted
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/cql-libraries/draft/' + fileContents).as('draft')
        })
        cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile('cypress/fixtures/cqlLibraryId', request.response.body.id)
        })
        cy.get(CQLLibrariesPage.VersionDraftMsgs).should('contain.text', 'New Draft of CQL Library is Successfully created')
        cy.get(CQLLibrariesPage.cqlLibraryVersionList).should('contain', 'Draft 1.0.000')
        cy.log('Draft Created Successfully')

        //Select both the instances (Draft and Version) of the Library and verify Library table contains latest instance(Draft) of the Library
        cy.get('[data-testid="cqlLibrary-button-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        cy.get('[data-testid="cqlLibrary-button-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        cy.get(CQLLibrariesPage.actionCenterShareBtn).click()
        cy.get(CQLLibrariesPage.shareOption).click({force: true})
        cy.get('[data-testid="library-landing"]').should('contain.text', updatedCQLLibraryName)

        //Verify information text on share screen
        cy.get('[class="share-unshare-dialog-info-text"]').should('contain.text', 'When sharing a Library, all versions and drafts are shared, so only the most recent library name appears here.')

        //Share Library with ALT user
        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(harpUserALT)
        cy.get(CQLLibrariesPage.addBtn).click()

        //Verify that the Harp id is added to the table
        cy.get(CQLLibrariesPage.expandArrow).click()
        cy.get(CQLLibrariesPage.sharedUserTable).should('contain.text', harpUserALT)

        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get('.MuiAlert-message').should('contain.text', 'The Library(s) were successfully shared.')

        //Login as ALT User and verify both Draft and Versioned Library are shared
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.myLibrariesBtn).should('exist')
        cy.get(CQLLibraryPage.myLibrariesBtn).should('be.visible')
        cy.get(CQLLibraryPage.myLibrariesBtn).click()
        cy.get('[data-testid="cqlLibrary-button-0_cqlLibraryName"]').should('contain.text', updatedCQLLibraryName)
        cy.get('[data-testid="cqlLibrary-button-1_cqlLibraryName"]').should('contain.text', newCQLLibraryName)
    })
})
