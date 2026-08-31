import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage, EditLibraryActions } from '../../../../Shared/CQLLibraryPage'
import { Header } from '../../../../Shared/Header'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { MadieObject, PermissionActions, Utilities } from '../../../../Shared/Utilities'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { LibraryCQL } from '../../../../Shared/LibraryCQL'
import { TestData } from '../../../../Shared/TestData'

let harpUserALT = ''
let CQLLibraryName = ''
let updatedCQLLibraryName = ''
const validCql = LibraryCQL.validCQL4QICORELib

describe('Unshare CQL Library using Action Center buttons', () => {
    beforeEach('Create CQL Library', () => {
        CQLLibraryName = 'UnshareLibrary' + Date.now()

        OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4)
    })

    afterEach('Clean up CQL Library', () => {
        Utilities.deleteLibrary()
    })

    it('Verify CQL Library owner can unshare Library from Libraries page Action centre share button', () => {
        //Share CQL Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as Regular User
        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Share Library with ALT user
        CQLLibrariesPage.cqlLibraryActionCenter('share')
        cy.get(CQLLibrariesPage.unshareOption).click({ force: true })
        cy.contains(CQLLibrariesPage.sharedUserTable, harpUserALT)
            .find(CQLLibrariesPage.unshareCheckBox)
            .should('be.checked')
            .click()
        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareLibrary')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareLibrary').its('response.statusCode').should('eq', 200)

        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
    })

    it('Verify CQL Library owner can unshare Library from Edit Library page Action centre share button', () => {
        OktaLogin.setupUserSession(false)

        //Share CQL Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as Regular user
        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        CQLLibrariesPage.clickEditforCreatedLibrary()

        //Un share Library
        CQLLibraryPage.actionCenter(EditLibraryActions.share)
        cy.get(CQLLibrariesPage.unshareOption).click({ force: true })
        cy.contains(CQLLibrariesPage.sharedUserTable, harpUserALT)
            .find(CQLLibrariesPage.unshareCheckBox)
            .should('be.checked')
            .click()
        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareLibrary')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareLibrary').its('response.statusCode').should('eq', 200)

        cy.get(CQLLibraryPage.genericSuccessMessage).should(
            'contain.text',
            'The Library(s) were successfully unshared.'
        )

        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
    })

    it('Verify Shared user can Unshare Library from themself on Shared Libraries tab', () => {
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        //Login as ALT user
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.sharedLibrariesTab).click()

        //Add Library name in the filter text box and verify Library is displayed in the list
        //Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)
        cy.get(CQLLibraryPage.LibFilterTextField)
            .click()
            .type(CQLLibraryName)
            .should('have.value', CQLLibraryName)
            .type('{enter}')

        //Unshare Library
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        CQLLibrariesPage.selectLibraryByName(CQLLibraryName)
        cy.get(CQLLibrariesPage.actionCenterShareBtn).should('be.enabled').click()
        cy.get('[data-testid="Unshare-option"]').click()

        //Assert text on the popup screen
        Utilities.waitForElementVisible('.MuiBox-root', 60000)
        cy.get('.confirmation-dialog-content').first().should('contain.text', 'You are about to unshare')
        cy.get('.library-name').should('have.text', CQLLibraryName)
        cy.get('#discard-changes-dialog-body').should('contain.text', 'with the following users:')
        cy.get('#discard-changes-dialog-body li').should(($li) => {
            expect($li.text().trim().toLowerCase()).to.equal(harpUserALT.toLowerCase())
        })

        //Click on Accept button and Un share Library
        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareLibrary')
        cy.get(EditMeasurePage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareLibrary').its('response.statusCode').should('eq', 200)

        //Verify Library is not visible under Shared Libraries tab
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
    })

    it('Verify admin user can perform an unshare action on a library they do not own', () => {
        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        OktaLogin.AdminLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.allLibrariesTab).click()
        CQLLibrariesPage.openLibraryAsNonOwner()

        //Un share Library
        //CQLLibraryPage.actionCenter(EditLibraryActions.share)
        // standard share functions won't work here - data-testid's are generated differently based on the admin permissions
        cy.get(CQLLibraryPage.actionCenterButton).scrollIntoView().click()
        cy.get('[data-testid="Share/Unshare"]').should('be.visible').click()
        cy.get(CQLLibrariesPage.unshareOption).click({ force: true })
        cy.contains(CQLLibrariesPage.sharedUserTable, harpUserALT)
            .find(CQLLibrariesPage.unshareCheckBox)
            .should('be.checked')
            .click()
        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareLibrary')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareLibrary').its('response.statusCode').should('eq', 200)

        cy.get(CQLLibraryPage.genericSuccessMessage).should(
            'contain.text',
            'The Library(s) were successfully unshared.'
        )
        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        //Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
    })
})

describe('Unshare CQL Library using Action Center buttons - Multiple instances', () => {
    beforeEach('Create CQL Library', () => {
        CQLLibraryName = 'UnshareLibrary' + Date.now()
        updatedCQLLibraryName = 'SpecialUnshare' + Date.now()
        OktaLogin.setupUserSession(false)
        harpUserALT = OktaLogin.getUser(true)

        CQLLibraryPage.createLibraryAPI(CQLLibraryName, SupportedModels.qiCore4, { cql: validCql })
    })

    afterEach('Clean up CQL Library', () => {
        Utilities.deleteLibrary()
    })

    it('Verify all instances of the CQL Library (Version and Draft) are unshared from the user', () => {
        const versionNumber = '1.0.000'
        //Version CQL Library
        CQLLibraryPage.versionLibraryAPI(versionNumber)

        //Draft Library
        TestData.readCqlLibraryId().then((cqlLibraryId) => {
            TestData.requestWithAccessToken<{ id: string; draft: boolean }>({
                url: `/api/cql-libraries/draft/${cqlLibraryId}`,
                method: 'POST',
                body: {
                    id: cqlLibraryId,
                    cqlLibraryName: updatedCQLLibraryName,
                    model: 'QI-Core v4.1.1'
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.draft).to.eql(true)
                TestData.writeCqlLibraryId(response.body.id)
            })
        })

        //Share CQL Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        OktaLogin.Login()

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()

        //Select both the instances (Draft and Version) of the Library and verify Library table contains latest instance(Draft) of the Library
        CQLLibrariesPage.cqlLibraryActionCenter('share')
        cy.get(CQLLibrariesPage.unshareOption).scrollIntoView().click({ force: true })
        cy.get('[data-testid="library-landing"]').should('contain.text', updatedCQLLibraryName)

        //Verify information text on share screen
        cy.get('[class="share-unshare-dialog-info-text"]').should(
            'contain.text',
            "Please note: When sharing a library, all versions and drafts are shared, but only the most recent library name appears below.To unshare library(s), deselect the usernames from whom you want to unshare the library(s), then click the 'Unshare' button."
        )
        cy.contains(CQLLibrariesPage.sharedUserTable, harpUserALT)
            .find(CQLLibrariesPage.unshareCheckBox)
            .should('be.checked')
            .click()
        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareLibrary')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareLibrary').its('response.statusCode').should('eq', 200)

        //Login as ALT user and verify CQL Library is not visible on My Libraries page
        OktaLogin.AltLogin()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('exist')
        cy.get(CQLLibraryPage.ownedLibrariesTab).should('be.visible')
        cy.get(CQLLibraryPage.ownedLibrariesTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.libraryListTitles, 60000)
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', CQLLibraryName)
        cy.get(CQLLibraryPage.libraryListTitles).should('not.contain', updatedCQLLibraryName)
    })
})
