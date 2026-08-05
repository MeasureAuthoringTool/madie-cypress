import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { Environment } from '../../../Shared/Environment'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { LibraryCQL } from '../../../Shared/LibraryCQL'

// MAT-9807: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile Shared Libraries', () => {
    let libraryName = ''
    let libraryOwner = ''
    let libraryOwnerDisplayName = ''
    let loggedInAdmin = ''
    let profileUser = ''
    let createdLibraryCount = 1

    const shareLibraryWithProfileUser = (libraryNumber = 0): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, profileUser).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body[libraryId][0].userId).to.eq(profileUser)
                expect(response.body[libraryId][0].roles).to.include('SHARED_WITH')
            })
        })
    }

    const openSharedLibraries = (): void => {
        OktaLogin.AdminLogin()
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${profileUser}/searches`,
            query: { ownershipType: 'SHARED', limit: '1' }
        }).as('sharedLibrariesCount')
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${profileUser}/searches`,
            query: {
                ownershipType: 'SHARED',
                limit: '10',
                page: '0',
                sortInfo: 'lastModifiedAt,false'
            }
        }).as('sharedLibraries')
        AdminUserProfilePage.openUserProfile(profileUser)
        cy.wait('@sharedLibrariesCount').its('response.statusCode').should('eq', 200)
    }

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        const credentials = Environment.credentials()
        createdLibraryCount = 1
        libraryName = `AdminProfileSharedLibrary${uniqueSuffix}`
        libraryOwner = OktaLogin.getUser(false)
        loggedInAdmin = credentials.adminUser?.toLowerCase() ?? ''
        profileUser = [credentials.harpUser2, credentials.harpUser3, credentials.altHarpUser]
            .map((user) => user?.toLowerCase() ?? '')
            .find((user) => user && user !== loggedInAdmin && user !== libraryOwner) ?? ''
        expect(profileUser, 'selected profile user').not.to.be.empty
        expect(loggedInAdmin, 'configured Admin user').not.to.be.empty
        expect(profileUser, 'selected profile user differs from logged-in Admin').not.to.eq(loggedInAdmin)
        expect(profileUser, 'selected profile user differs from library owner').not.to.eq(libraryOwner)
        TestData.getAccountDisplayName(libraryOwner).then((displayName) => {
            libraryOwnerDisplayName = displayName
        })

        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.qiCore4, {
            cql: LibraryCQL.validCQL4QICORELib
        })
        shareLibraryWithProfileUser()
    })

    afterEach(() => {
        TestData.setupUserScope()
        for (let libraryNumber = createdLibraryCount - 1; libraryNumber >= 0; libraryNumber--) {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestCqlLibraryById('DELETE', libraryId, { failOnStatusCode: false })
            })
        }
    })

    it('displays the Shared Libraries tab count, grid, and shared library data', () => {
        openSharedLibraries()
        cy.get(AdminUserProfilePage.ownedLibrariesTab).should('be.visible')
        cy.get(AdminUserProfilePage.sharedLibrariesTab)
            .should('be.visible')
            .and('contain.text', 'Shared Libraries (')

        cy.get(AdminUserProfilePage.ownedLibrariesTab).then(($ownedTab) => {
            cy.get(AdminUserProfilePage.sharedLibrariesTab).then(($sharedTab) => {
                expect(
                    $ownedTab[0].compareDocumentPosition($sharedTab[0]) & Node.DOCUMENT_POSITION_FOLLOWING,
                    'Shared Libraries follows Owned Libraries'
                ).not.to.eq(0)
            })
        })

        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        cy.wait('@sharedLibraries').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.query).to.include({
                ownershipType: 'SHARED',
                limit: '10',
                page: '0',
                sortInfo: 'lastModifiedAt,false'
            })
            expect(JSON.stringify(response?.body), 'Shared Libraries response').to.include(libraryName)
        })
        cy.get(AdminUserProfilePage.librariesTable).within(() => {
            ;['Library', 'Version', 'Status', 'Model', 'Owner', 'Updated'].forEach((columnName) => {
                cy.contains('th', columnName).should('be.visible')
            })
        })

        AdminUserProfilePage.findLibraryRow(libraryName)
            .should('contain.text', libraryName)
            .and('contain.text', '0.0.000')
            .and('contain.text', 'Draft')
            .and('contain.text', 'QI-Core v4.1.1')
            .and('contain.text', libraryOwnerDisplayName)
            .find('button')
            .should('be.visible')
            .and('have.text', 'View')
    })

    it('displays all versions in the shared library set hierarchy', () => {
        TestData.versionCqlLibrary('1.0.000')
        TestData.draftCqlLibrary((libraryId) => ({
            id: libraryId,
            cqlLibraryName: libraryName,
            model: 'QI-Core v4.1.1'
        })).then((response) => {
            expect(response.status).to.eq(201)
            TestData.writeCqlLibraryId(response.body.id, 1)
            createdLibraryCount = 2
        })
        openSharedLibraries()
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        cy.wait('@sharedLibraries').its('response.statusCode').should('eq', 200)

        AdminUserProfilePage.findLibraryRow(libraryName).should('contain.text', '1.0.000')
        AdminUserProfilePage.expandLibrarySet(libraryName)
            .should('contain.text', libraryName)
            .and('contain.text', '1.0.000')
    })

    it('sorts every data column on the Shared Libraries tab', () => {
        openSharedLibraries()
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        cy.wait('@sharedLibraries').its('response.statusCode').should('eq', 200)

        const sortableColumns = [
            { selector: CQLLibrariesPage.hdrLibrary, sortInfo: 'cqlLibraryName,false' },
            { selector: CQLLibrariesPage.hdrVersion, sortInfo: 'version,false' },
            { selector: CQLLibrariesPage.hdrStatus, sortInfo: 'draft,false' },
            { selector: CQLLibrariesPage.hdrModel, sortInfo: 'model,false' },
            { selector: '[data-testid="header-ownerDisplayName"]', sortInfo: 'ownerDisplayName,false' },
            { selector: CQLLibrariesPage.hdrUpdated, sortInfo: 'lastModifiedAt,false' }
        ]

        sortableColumns.forEach(({ selector, sortInfo }, index) => {
            cy.intercept({
                pathname: `/api/cql-libraries/admin/userProfile/${profileUser}/searches`,
                query: { ownershipType: 'SHARED', limit: '10', page: '0', sortInfo }
            }).as(`sortSharedLibraries${index}`)
            cy.get(selector).should('be.visible').click()
            cy.wait(`@sortSharedLibraries${index}`).its('response.statusCode').should('eq', 200)
        })
    })

    it('paginates shared library sets', () => {
        createdLibraryCount = 11
        for (let libraryNumber = 1; libraryNumber < createdLibraryCount; libraryNumber++) {
            CQLLibraryPage.createLibraryAPI(
                `${libraryName}${libraryNumber}`,
                SupportedModels.qiCore4,
                { libraryNumber }
            )
            shareLibraryWithProfileUser(libraryNumber)
        }

        openSharedLibraries()
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.sharedLibrariesTab)
        cy.wait('@sharedLibraries').its('response.statusCode').should('eq', 200)
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${profileUser}/searches`,
            query: {
                ownershipType: 'SHARED',
                limit: '10',
                page: '1',
                sortInfo: 'lastModifiedAt,false'
            }
        }).as('sharedLibrariesPage2')

        cy.get(MeasuresPage.paginationNextButton)
            .should('be.visible')
            .closest('button')
            .should('not.be.disabled')
            .click()
        cy.wait('@sharedLibrariesPage2').its('response.statusCode').should('eq', 200)
        cy.get('button[aria-current="page"]').should('have.text', '2')
    })
})
