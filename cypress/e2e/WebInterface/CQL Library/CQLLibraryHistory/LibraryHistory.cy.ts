import { Environment } from "../../../../Shared/Environment"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import {CQLLibraryPage, EditLibraryActions} from "../../../../Shared/CQLLibraryPage"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage"
import {Header} from "../../../../Shared/Header"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let harpUser = Environment.credentials().harpUser
let updatedCQLLibraryName = CQLLibraryName + randValue + 'SomeUpdate' + 9

describe('Library History - Create, Update, Sharing and Unsharing Actions', () => {

    beforeEach('Create Library and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    afterEach('Log out and Clean up', () => {

        OktaLogin.Logout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        Utilities.deleteLibrary(newCQLLibraryName)
    })

    it('Verify that Library Create and Update actions are recorded in Library History', () => {

        //Update CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
        cy.log('CQL Library Updated Successfully')

        //Go to Library History and verify that Create and Update actions are recorded
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get('[data-testid="library-history-0_actionType"]').should('contain.text', 'CREATED')
        cy.get('[data-testid="library-history-0_performedBy"]').should('contain.text', harpUser)
        cy.get('[data-testid="library-history-1_actionType"]').should('contain.text', 'UPDATED')
        cy.get('[data-testid="library-history-1_performedBy"]').should('contain.text', harpUser)

    })

    it('Verify that Library Sharing and Unsharing actions are recorded in Library History', () => {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Share Library with ALT user
        CQLLibraryPage.actionCenter(EditLibraryActions.share)
        cy.get(CQLLibrariesPage.shareOption).click({ force: true })
        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(harpUserALT)
        cy.get(CQLLibrariesPage.addBtn).click()

        //Verify that the Harp id is added to the table
        cy.get(CQLLibrariesPage.expandArrow).click()
        cy.get(CQLLibrariesPage.sharedUserTable).should('contain.text', harpUserALT)

        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Library(s) were successfully shared.')

        cy.get(CQLLibraryPage.actionCenterButton).click()

        //Go to Library History and verify that Library Sharing is recorded
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get('[data-testid="library-history-1_actionType"]').should('contain.text', 'SHARED')
        cy.get('[data-testid="library-history-1_performedBy"]').should('contain.text', harpUser)

        cy.get('[data-testid="library-history-1_additionalActionMessage"]').should('contain.text', 'Shared with - ' + harpUserALT)

        //Close History popup
        cy.get('[data-testid="measure-history-close-button"]').click().wait(1000)
        cy.get(CQLLibraryPage.actionCenterButton).click()

        //Un Share Library
        CQLLibraryPage.actionCenter(EditLibraryActions.share)
        cy.get(CQLLibrariesPage.unshareOption).click({ force: true })
        cy.get(CQLLibrariesPage.expandArrow).click()

        cy.get(CQLLibrariesPage.unshareCheckBox).eq(1).click()
        cy.get(CQLLibrariesPage.saveUserBtn).click()
        cy.get(CQLLibrariesPage.acceptBtn).click()

        Utilities.waitForElementVisible(CQLLibraryPage.genericSuccessMessage, 60000)
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'The Library(s) were successfully unshared.')
        cy.get(CQLLibraryPage.actionCenterButton).click()

        //Go to Library History and verify that Library Unsharing is recorded
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get('[data-testid="library-history-2_actionType"]').should('contain.text', 'UNSHARED')
        cy.get('[data-testid="library-history-2_performedBy"]').should('contain.text', harpUser)
        cy.get('[data-testid="library-history-2_additionalActionMessage"]').should('contain.text', 'Unshared with - ' + harpUserALT)

    })
})

describe('Library History - Version and Draft actions', () => {

    beforeEach('Create Library and Set Access Token', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 4
        updatedCQLLibraryName = newCQLLibraryName + 'Updated'

        CQLLibraryPage.createAPICQLLibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    it('Verify that Library Version and Draft actions are recorded in Library History', () => {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Version CQL Library
        CQLLibraryPage.actionCenter(EditLibraryActions.version)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'New version of CQL Library is Successfully created')

        cy.get(CQLLibraryPage.actionCenterButton).click()

        //Go to Library History and verify that Library Version action is recorded
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get('[class="header-info"]').should('contain.text', newCQLLibraryName + ' (Version 1.0.000)')
        cy.get('[data-testid="library-history-1_actionType"]').should('contain.text', 'VERSIONED_MAJOR')
        cy.get('[data-testid="library-history-1_performedBy"]').should('contain.text', harpUser)
        cy.get('[data-testid="library-history-1_additionalActionMessage"]').should('contain.text', 'Versioned to 1.0.000')

        //Close History popup
        cy.get('[data-testid="measure-history-close-button"]').click().wait(1000)

        //Draft Library
        cy.get(CQLLibraryPage.actionCenterButton).click()
        CQLLibraryPage.actionCenter(EditLibraryActions.draft)

        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'New Draft of CQL Library is Successfully created')

        //Go to Library History and verify that Library Draft action is recorded
        cy.get(CQLLibraryPage.actionCenterButton).click()
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get('[class="header-info"]').should('contain.text', newCQLLibraryName + ' (Version 1.0.000)Draft')
        cy.get('[data-testid="library-history-0_actionType"]').should('contain.text', 'DRAFTED')
        cy.get('[data-testid="library-history-0_performedBy"]').should('contain.text', harpUser)
        cy.get('[data-testid="library-history-0_additionalActionMessage"]').should('contain.text', 'Draft created from version 1.0.000')

    })
})
