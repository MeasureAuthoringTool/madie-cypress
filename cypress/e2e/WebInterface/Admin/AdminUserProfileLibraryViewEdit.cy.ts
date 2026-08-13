import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { Environment } from '../../../Shared/Environment'
import { LibraryCQL } from '../../../Shared/LibraryCQL'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { MadieObject, Utilities } from '../../../Shared/Utilities'

// MAT-9821: AdminUserProfile is not yet available in TEST; prove this coverage in DEV first.
const describeAdminUserProfile = describe.skip

describeAdminUserProfile('Admin user profile library View and Edit navigation', () => {
    let libraryName = ''
    let libraryOwner = ''
    let sharedProfileUser = ''
    let adminUser = ''
    let createdLibraryId = ''
    let libraryCreated = false
    let libraryLocked = false

    const createDraftLibrary = (): void => {
        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.qiCore4, {
            cql: LibraryCQL.validCQL4QICORELib
        })
        libraryCreated = true
    }

    const shareLibraryWith = (user: string): void => {
        TestData.readCqlLibraryId().then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, user).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    }

    const openProfileLibrary = (
        profileUser: string,
        tab = AdminUserProfilePage.ownedLibrariesTab
    ): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)
        AdminUserProfilePage.openLibrariesTab(tab)
        AdminUserProfilePage.submitLibrarySearch(libraryName)
        AdminUserProfilePage.findLibraryRow(libraryName).should('be.visible')
    }

    const findCreatedLibraryAction = (): Cypress.Chainable<JQuery<HTMLElement>> => {
        return cy.then(() => {
            expect(createdLibraryId, 'created library ID').not.to.be.empty
            return AdminUserProfilePage.findLibraryAction(createdLibraryId)
        })
    }

    const assertLibraryDetailMode = (expectedMode: 'view' | 'edit'): void => {
        cy.then(() => {
            expect(createdLibraryId, 'created library ID').not.to.be.empty
            cy.location('pathname').should('contain', `/cql-libraries/${createdLibraryId}/edit/details`)
        })
        cy.get('[data-testid="CQL Library Details"]').should('be.visible').click()

        if (expectedMode === 'view') {
            cy.get(CQLLibraryPage.readOnlyCqlLibraryName).should('be.visible')
        } else {
            cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('be.visible').and('be.enabled')
        }
    }

    beforeEach(() => {
        const suffix = Date.now()
        libraryName = `AdminProfileLibraryViewEdit${suffix}`
        libraryOwner = OktaLogin.getUser(false)
        sharedProfileUser = OktaLogin.getUser(true)
        adminUser = Environment.credentials().adminUser?.toLowerCase() ?? ''
        expect(adminUser, 'configured admin user').not.to.be.empty
        libraryCreated = false
        libraryLocked = false
        createdLibraryId = ''
    })

    afterEach(() => {
        if (libraryLocked) {
            Utilities.releaseAllLocksForCleanup(MadieObject.Library, true)
        }
        if (libraryCreated) {
            Utilities.deleteLibrary()
        }
    })

    it('opens an unshared draft from Owned Libraries in read-only View mode', () => {
        createDraftLibrary()
        TestData.readCqlLibraryId().then((libraryId) => {
            createdLibraryId = libraryId
        })
        openProfileLibrary(libraryOwner)

        findCreatedLibraryAction().should('have.text', 'View').click()
        assertLibraryDetailMode('view')
    })

    it('opens an admin-shared draft from Owned Libraries in Edit mode', () => {
        createDraftLibrary()
        TestData.readCqlLibraryId().then((libraryId) => {
            createdLibraryId = libraryId
        })
        shareLibraryWith(adminUser)
        openProfileLibrary(libraryOwner)

        findCreatedLibraryAction().should('have.text', 'Edit').click()
        assertLibraryDetailMode('edit')
    })

    it('opens an admin-shared draft from Shared Libraries in Edit mode', () => {
        createDraftLibrary()
        TestData.readCqlLibraryId().then((libraryId) => {
            createdLibraryId = libraryId
        })
        shareLibraryWith(adminUser)
        shareLibraryWith(sharedProfileUser)
        openProfileLibrary(sharedProfileUser, AdminUserProfilePage.sharedLibrariesTab)

        findCreatedLibraryAction().should('have.text', 'Edit').click()
        assertLibraryDetailMode('edit')
    })

    it('opens a library locked by another user from Owned Libraries in read-only View mode', () => {
        createDraftLibrary()
        TestData.readCqlLibraryId().then((libraryId) => {
            createdLibraryId = libraryId
        })
        shareLibraryWith(adminUser)
        shareLibraryWith(sharedProfileUser)
        Utilities.lockSharedLibrary(true)
        libraryLocked = true

        openProfileLibrary(libraryOwner)

        findCreatedLibraryAction().should('have.text', 'View')
        cy.then(() => {
            cy.get(`[data-testid="library-lock-icon-${createdLibraryId}"]`).should('be.visible')
        })
        findCreatedLibraryAction().click()
        cy.then(() => {
            cy.location('pathname').should('contain', `/cql-libraries/${createdLibraryId}/edit/details`)
        })
        cy.get(CQLLibraryPage.libraryLockedModalMessage).should('be.visible')
    })

    it('opens a versioned library from Owned Libraries in read-only View mode', () => {
        createDraftLibrary()
        TestData.readCqlLibraryId().then((libraryId) => {
            createdLibraryId = libraryId
        })
        TestData.versionCqlLibrary('1.0.000').then((response) => {
            expect(response.status).to.eq(200)
        })
        openProfileLibrary(libraryOwner)

        findCreatedLibraryAction().should('have.text', 'View').click()
        assertLibraryDetailMode('view')
    })
})
