import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { LibraryCQL } from '../../../Shared/LibraryCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'

// MAT-9806: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile Owned Libraries', () => {
    let libraryName = ''
    let libraryOwner = ''
    let createdLibraryCount = 1

    const openOwnedLibraries = (): void => {
        OktaLogin.AdminLogin()
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${libraryOwner}/searches`,
            query: { ownershipType: 'OWNED', limit: '1' }
        }).as('ownedLibrariesCount')
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${libraryOwner}/searches`,
            query: {
                ownershipType: 'OWNED',
                limit: '10',
                page: '0',
                sortInfo: 'lastModifiedAt,false'
            }
        }).as('ownedLibraries')

        AdminUserProfilePage.openUserProfile(libraryOwner)
    }

    const searchForCreatedLibrary = (): void => {
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${libraryOwner}/searches`,
            query: { ownershipType: 'OWNED' }
        }).as('searchedOwnedLibraries')
        AdminUserProfilePage.submitLibrarySearch(libraryName)
        cy.wait('@searchedOwnedLibraries').then(({ response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(JSON.stringify(response?.body), 'searched Owned Libraries response').to.include(libraryName)
        })
    }

    beforeEach(() => {
        createdLibraryCount = 1
        libraryName = `AdminProfileOwnedLibrary${Date.now()}`
        libraryOwner = OktaLogin.getUser(false)

        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.qiCore4, {
            cql: LibraryCQL.validCQL4QICORELib
        })
    })

    afterEach(() => {
        TestData.setupUserScope()
        for (let libraryNumber = createdLibraryCount - 1; libraryNumber >= 0; libraryNumber--) {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestCqlLibraryById('DELETE', libraryId, { failOnStatusCode: false })
            })
        }
    })

    it('displays the set count, grid, library metadata, and non-functional View action', () => {
        openOwnedLibraries()
        cy.wait('@ownedLibrariesCount').then(({ response }) => {
            expect(response?.statusCode).to.eq(200)
            cy.get(AdminUserProfilePage.ownedLibrariesTab)
                .should('be.visible')
                .and('contain.text', `Owned Libraries (${response?.body.totalElements})`)
        })

        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        cy.wait('@ownedLibraries').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.query).to.include({
                ownershipType: 'OWNED',
                limit: '10',
                page: '0',
                sortInfo: 'lastModifiedAt,false'
            })
        })

        cy.get(AdminUserProfilePage.librariesTable).within(() => {
            ;['Library', 'Version', 'Status', 'Model', 'Shared', 'Updated'].forEach((columnName) => {
                cy.contains('th', columnName).should('be.visible')
            })
        })
        searchForCreatedLibrary()
        AdminUserProfilePage.findLibraryRow(libraryName)
            .should('contain.text', libraryName)
            .and('contain.text', '0.0.000')
            .and('contain.text', 'Draft')
            .and('contain.text', 'QI-Core v4.1.1')
            .find('button')
            .should('be.visible')
            .and('have.text', 'View')
    })

    it('displays every version in the owned library set hierarchy', () => {
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

        openOwnedLibraries()
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        cy.wait('@ownedLibraries').its('response.statusCode').should('eq', 200)

        searchForCreatedLibrary()
        AdminUserProfilePage.findLibraryRow(libraryName)
            .should('contain.text', '1.0.000')
            .and('contain.text', 'Draft')
        AdminUserProfilePage.expandLibrarySet(libraryName)
            .should('contain.text', libraryName)
            .and('contain.text', '1.0.000')
    })

    it('sorts every data column on the Owned Libraries tab', () => {
        openOwnedLibraries()
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        cy.wait('@ownedLibraries').its('response.statusCode').should('eq', 200)

        const sortableColumns = [
            { selector: CQLLibrariesPage.hdrLibrary, sortInfo: 'cqlLibraryName,false' },
            { selector: CQLLibrariesPage.hdrVersion, sortInfo: 'version,false' },
            { selector: CQLLibrariesPage.hdrStatus, sortInfo: 'draft,false' },
            { selector: CQLLibrariesPage.hdrModel, sortInfo: 'model,false' },
            { selector: CQLLibrariesPage.hdrShared, sortInfo: 'librarySet.acls,false' },
            { selector: CQLLibrariesPage.hdrUpdated, sortInfo: 'lastModifiedAt,false' }
        ]

        sortableColumns.forEach(({ selector, sortInfo }, index) => {
            cy.intercept({
                pathname: `/api/cql-libraries/admin/userProfile/${libraryOwner}/searches`,
                query: { ownershipType: 'OWNED', limit: '10', page: '0', sortInfo }
            }).as(`sortOwnedLibraries${index}`)
            cy.get(selector).should('be.visible').click()
            cy.wait(`@sortOwnedLibraries${index}`).its('response.statusCode').should('eq', 200)
        })
    })

    it('paginates owned library sets', () => {
        createdLibraryCount = 11
        for (let libraryNumber = 1; libraryNumber < createdLibraryCount; libraryNumber++) {
            CQLLibraryPage.createLibraryAPI(
                `${libraryName}${libraryNumber}`,
                SupportedModels.qiCore4,
                { libraryNumber }
            )
        }

        openOwnedLibraries()
        AdminUserProfilePage.openLibrariesTab(AdminUserProfilePage.ownedLibrariesTab)
        cy.wait('@ownedLibraries').its('response.statusCode').should('eq', 200)
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${libraryOwner}/searches`,
            query: {
                ownershipType: 'OWNED',
                limit: '10',
                page: '1',
                sortInfo: 'lastModifiedAt,false'
            }
        }).as('ownedLibrariesPage2')

        cy.get(MeasuresPage.paginationNextButton)
            .should('be.visible')
            .closest('button')
            .should('not.be.disabled')
            .click()
        cy.wait('@ownedLibrariesPage2').its('response.statusCode').should('eq', 200)
        cy.get('button[aria-current="page"]').should('have.text', '2')
    })
})
