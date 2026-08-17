import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { Environment } from '../../../Shared/Environment'
import { LibraryCQL } from '../../../Shared/LibraryCQL'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { TestData } from '../../../Shared/TestData'

// MAT-9817: Proven in DEV; enable when the AdminUserProfile feature is available in TEST.
const describeAdminUserProfile = describe.skip

describeAdminUserProfile('Admin user profile library sharing and unsharing', () => {
    let qicoreLibraryName = ''
    let qdmLibraryName = ''
    let libraryOwner = ''
    let sharedProfileUser = ''

    const createLibraries = (): void => {
        libraryOwner = CQLLibraryPage.createLibraryAPI(qicoreLibraryName, SupportedModels.qiCore4, {
            cql: LibraryCQL.validCQL4QICORELib
        })
        CQLLibraryPage.createLibraryAPI(qdmLibraryName, SupportedModels.QDM, {
            cql: LibraryCQL.validCQL4QDMLib,
            libraryNumber: 1
        })
    }

    const shareLibrariesWithProfileUser = (): void => {
        ;[0, 1].forEach((libraryNumber) => {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestSharePermissions('library', 'GRANT', libraryId, sharedProfileUser).then(
                    (response) => expect(response.status).to.eq(200)
                )
            })
        })
    }

    const openOwnedLibraries = (): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(libraryOwner)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch('MAT9817')
    }

    const selectBothLibraries = (): void => {
        AdminUserProfilePage.selectLibraryByName(qicoreLibraryName)
        AdminUserProfilePage.selectLibraryByName(qdmLibraryName)
    }

    const assertShareDialogControls = (title: 'Share With' | 'Unshare From'): void => {
        cy.get('[role="dialog"]')
            .should('be.visible')
            .within(() => {
                cy.contains('h2', title).should('be.visible')
                cy.contains('Export User List').should('be.visible')
                ;['Library', 'Shared With', 'Date Shared'].forEach((column) => {
                    cy.contains(column).should('be.visible')
                })
                cy.contains(qicoreLibraryName).should('be.visible')
                cy.contains(qdmLibraryName).should('be.visible')
                cy.contains('button', 'Cancel').should('be.enabled')
                cy.get(CQLLibrariesPage.saveUserBtn).should('be.visible')
            })
    }

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        const credentials = Environment.credentials()
        qicoreLibraryName = `MAT9817QiCore${uniqueSuffix}`
        qdmLibraryName = `MAT9817Qdm${uniqueSuffix}`
        sharedProfileUser = [credentials.harpUser2, credentials.harpUser3, credentials.altHarpUser]
            .map((user) => user?.toLowerCase() ?? '')
            .find((user) => user && user !== OktaLogin.getUser(false)) ?? ''

        expect(sharedProfileUser, 'shared profile user').not.to.be.empty
        createLibraries()
        expect(sharedProfileUser, 'shared profile user differs from owner').not.to.eq(libraryOwner)
    })

    afterEach(() => {
        TestData.setupUserScope()
        ;[1, 0].forEach((libraryNumber) => {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestCqlLibraryById('DELETE', libraryId, { failOnStatusCode: false })
            })
        })
    })

    it('shows Owned Libraries Share/Unshare states, menu, and dialogs', () => {
        shareLibrariesWithProfileUser()
        openOwnedLibraries()

        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Select a library to share/unshare'
        )

        selectBothLibraries()
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Share/Unshare'
        )
        cy.get(AdminUserProfilePage.shareButton).click()
        cy.get(CQLLibrariesPage.shareOption).should('be.visible').and('have.text', 'Share With')
        cy.get(CQLLibrariesPage.unshareOption).should('be.visible').and('have.text', 'Unshare')

        cy.get(CQLLibrariesPage.shareOption).click()
        assertShareDialogControls('Share With')
        cy.get('[role="dialog"]')
            .should('contain.text', 'When sharing a Library')
            .and('contain.text', 'all versions and drafts are shared')
            .within(() => {
                cy.get(CQLLibrariesPage.harpIdInputTextBox).should('be.visible')
                cy.get(CQLLibrariesPage.addBtn).should('be.visible')
                cy.contains('button', 'Cancel').click()
            })
        cy.get('[role="dialog"]').should('not.exist')

        cy.get(AdminUserProfilePage.shareButton).click()
        cy.get(CQLLibrariesPage.unshareOption).should('be.visible').click()
        assertShareDialogControls('Unshare From')
        cy.get('[role="dialog"]')
            .should('contain.text', 'When sharing a library')
            .and('contain.text', 'deselect the usernames')
            .within(() => {
                cy.contains(sharedProfileUser).should('be.visible')
                cy.get('input[type="checkbox"]').should('have.length.at.least', 2).and('be.checked')
                cy.contains('button', 'Cancel').click()
            })
        cy.get('[role="dialog"]').should('not.exist')
    })

    it('shares selected Owned QI-Core and QDM Libraries with a user', () => {
        openOwnedLibraries()
        selectBothLibraries()
        cy.get(AdminUserProfilePage.shareButton).should('be.enabled').click()
        cy.get(CQLLibrariesPage.shareOption).should('be.visible').click()

        cy.get(CQLLibrariesPage.harpIdInputTextBox).type(sharedProfileUser)
        cy.get(CQLLibrariesPage.addBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.sharedUserTable).should('contain.text', sharedProfileUser)
        cy.intercept('PUT', '**/api/cql-libraries/share').as('shareLibraries')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.wait('@shareLibraries').its('response.statusCode').should('eq', 200)

        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${sharedProfileUser}/searches`,
            query: { ownershipType: 'SHARED' }
        }).as('sharedLibrariesSearch')
        AdminUserProfilePage.submitLibrarySearch('MAT9817')
        cy.wait('@sharedLibrariesSearch').its('response.statusCode').should('eq', 200)
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qicoreLibraryName).should('be.visible')
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qdmLibraryName).should('be.visible')
    })

    it('unshares selected Owned QI-Core and QDM Libraries from a user', () => {
        shareLibrariesWithProfileUser()
        openOwnedLibraries()
        selectBothLibraries()
        cy.get(AdminUserProfilePage.shareButton).should('be.enabled').click()
        cy.get(CQLLibrariesPage.unshareOption).should('be.visible').click()

        cy.get('[role="dialog"]').within(() => {
            cy.get('input[type="checkbox"]:checked').uncheck()
        })
        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareLibraries')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.acceptBtn).should('be.visible').click()
        cy.wait('@unshareLibraries').its('response.statusCode').should('eq', 200)

        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qicoreLibraryName).should('not.exist')
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qdmLibraryName).should('not.exist')
    })

    it('shows Shared Libraries Unshare states and unshares only from the selected profile user', () => {
        shareLibrariesWithProfileUser()
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(sharedProfileUser)
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        AdminUserProfilePage.submitLibrarySearch('MAT9817')

        AdminUserProfilePage.assertDisabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Select a library to unshare'
        )
        selectBothLibraries()
        AdminUserProfilePage.assertEnabledAction(
            AdminUserProfilePage.shareButton,
            AdminUserProfilePage.shareTooltip,
            'Unshare'
        )
        cy.get(AdminUserProfilePage.shareButton).click()
        cy.get(CQLLibrariesPage.unshareOption).should('be.visible').and('have.text', 'Unshare')
        cy.get(CQLLibrariesPage.shareOption).should('not.exist')
        cy.get(CQLLibrariesPage.unshareOption).click()

        assertShareDialogControls('Unshare From')
        cy.get('[role="dialog"]')
            .within(() => {
                cy.contains(qicoreLibraryName).should('be.visible')
                cy.contains(qdmLibraryName).should('be.visible')
                cy.contains(sharedProfileUser).should('be.visible')
                cy.get('input[type="checkbox"]:checked').uncheck()
            })

        cy.intercept('PUT', '**/api/cql-libraries/unshare').as('unshareSharedLibraries')
        cy.get(CQLLibrariesPage.saveUserBtn).should('be.enabled').click()
        cy.get(CQLLibrariesPage.acceptBtn)
            .should('be.visible')
            .closest('.MuiDialog-paper')
            .within(() => {
                cy.contains('h2', 'Are you sure?').should('be.visible')
                cy.contains('You are about to unshare').should('be.visible')
                cy.contains(qicoreLibraryName).should('be.visible')
                cy.contains(qdmLibraryName).should('be.visible')
                cy.get('li').filter(`:contains("${sharedProfileUser}")`).should('have.length', 2)
                cy.contains('button', 'Cancel').should('be.enabled')
                cy.get(CQLLibrariesPage.acceptBtn).should('be.enabled')
            })
        cy.get(CQLLibrariesPage.acceptBtn).click()
        cy.wait('@unshareSharedLibraries').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            TestData.readCqlLibraryId(0).then((qicoreLibraryId) => {
                expect(request.body[qicoreLibraryId]).to.deep.eq([sharedProfileUser])
            })
            TestData.readCqlLibraryId(1).then((qdmLibraryId) => {
                expect(request.body[qdmLibraryId]).to.deep.eq([sharedProfileUser])
            })
        })
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qicoreLibraryName).should('not.exist')
        cy.contains(`${AdminUserProfilePage.librariesTable} tbody td`, qdmLibraryName).should('not.exist')
    })
})
