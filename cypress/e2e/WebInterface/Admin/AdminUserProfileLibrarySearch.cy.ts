import { AdminUserProfilePage } from '../../../Shared/AdminUserProfilePage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { Environment } from '../../../Shared/Environment'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'

type LibraryOwnershipType = 'OWNED' | 'SHARED'

// MAT-9810: Enable when the AdminUserProfile feature is available in TEST.
describe.skip('Admin user profile library search and filtering', () => {
    let targetLibraryName = ''
    let controlLibraryName = ''
    let libraryOwner = ''
    let sharedProfileUser = ''

    const searchInput = AdminUserProfilePage.librarySearchInput
    const filterByDropdown = AdminUserProfilePage.libraryFilterBy

    const interceptProfileLibraries = (
        alias: string,
        profileUser: string,
        ownershipType: LibraryOwnershipType
    ): void => {
        cy.intercept({
            pathname: `/api/cql-libraries/admin/userProfile/${profileUser}/searches`,
            query: { ownershipType }
        }).as(alias)
    }

    const shareLibraryWithProfileUser = (libraryNumber: number): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, sharedProfileUser).then(
                (response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body[libraryId][0].userId).to.eq(sharedProfileUser)
                    expect(response.body[libraryId][0].roles).to.include('SHARED_WITH')
                }
            )
        })
    }

    const openLibrariesForProfile = (
        profileUser: string,
        ownershipType: LibraryOwnershipType
    ): void => {
        OktaLogin.AdminLogin()
        AdminUserProfilePage.openUserProfile(profileUser)

        const tab = ownershipType === 'OWNED'
            ? AdminUserProfilePage.ownedLibrariesTab
            : AdminUserProfilePage.sharedLibrariesTab

        interceptProfileLibraries('profileLibraries', profileUser, ownershipType)

        AdminUserProfilePage.openLibrariesTab(tab)
        cy.wait('@profileLibraries').its('response.statusCode').should('eq', 200)
        AdminUserProfilePage.assertLibrarySearchControls()
        AdminUserProfilePage.assertLibraryFilterOptions()
    }

    const submitSearch = (
        profileUser: string,
        ownershipType: LibraryOwnershipType,
        searchText: string
    ): void => {
        interceptProfileLibraries('searchedProfileLibraries', profileUser, ownershipType)

        AdminUserProfilePage.submitLibrarySearch(searchText)
        cy.wait('@searchedProfileLibraries').its('response.statusCode').should('eq', 200)
    }

    const selectFilter = (option: 'Library' | 'Version' | 'Model'): void => {
        AdminUserProfilePage.selectLibraryFilter(option)
    }

    const clearSearchWithX = (
        profileUser: string,
        ownershipType: LibraryOwnershipType
    ): void => {
        interceptProfileLibraries('clearedProfileLibraries', profileUser, ownershipType)

        AdminUserProfilePage.clearLibrarySearch()
        cy.wait('@clearedProfileLibraries').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.query).not.to.have.property('searchField')
            expect(request.query).not.to.have.property('optionalSearchProperties')
        })
    }

    const assertOnlyTargetLibraryIsDisplayed = (): void => {
        AdminUserProfilePage.findLibraryRow(targetLibraryName).should('be.visible')
        cy.get(AdminUserProfilePage.librariesTable).should('not.contain.text', controlLibraryName)
    }

    const assertNoResults = (): void => {
        cy.get(AdminUserProfilePage.librariesTable).should('contain.text', 'No results were found')
    }

    const assertEveryDisplayedLibraryHasModel = (model: string): void => {
        cy.get(`${AdminUserProfilePage.librariesTable} tbody tr`)
            .should('have.length.greaterThan', 0)
            .should(($rows) => {
                $rows.each((_, row) => {
                    expect(Cypress.$(row).find('td').eq(4).text()).to.include(model)
                })
            })
    }

    const assertEveryDisplayedLibraryVersionContains = (searchText: string): void => {
        cy.get(`${AdminUserProfilePage.librariesTable} tbody tr`)
            .should('have.length.greaterThan', 0)
            .should(($rows) => {
                $rows.each((_, row) => {
                    expect(Cypress.$(row).find('td').eq(2).text()).to.include(searchText)
                })
            })
    }

    const verifySearchBehavior = (
        profileUser: string,
        ownershipType: LibraryOwnershipType
    ): void => {
        openLibrariesForProfile(profileUser, ownershipType)

        // Unfiltered searches cover every verifiable CQL Library field named in the AC.
        submitSearch(profileUser, ownershipType, targetLibraryName.slice(0, -4))
        assertOnlyTargetLibraryIsDisplayed()

        submitSearch(profileUser, ownershipType, '0.0')
        assertEveryDisplayedLibraryVersionContains('0.0')

        submitSearch(profileUser, ownershipType, 'QI-Core v4')
        assertEveryDisplayedLibraryHasModel('QI-Core v4.1.1')

        submitSearch(profileUser, ownershipType, 'MAT9810NoMatchingLibrary')
        assertNoResults()

        selectFilter('Library')
        submitSearch(profileUser, ownershipType, targetLibraryName.slice(0, -4))
        assertOnlyTargetLibraryIsDisplayed()

        selectFilter('Version')
        submitSearch(profileUser, ownershipType, '0.0')
        assertEveryDisplayedLibraryVersionContains('0.0')

        selectFilter('Model')
        submitSearch(profileUser, ownershipType, 'QI-Core v4')
        assertEveryDisplayedLibraryHasModel('QI-Core v4.1.1')

        submitSearch(profileUser, ownershipType, 'MAT9810NoMatchingModel')
        assertNoResults()

        // A matching Library value must not match when the search is restricted to Model.
        submitSearch(profileUser, ownershipType, targetLibraryName)
        assertNoResults()

        clearSearchWithX(profileUser, ownershipType)

        cy.get(searchInput).should('have.value', '')
        cy.get(AdminUserProfilePage.libraryFilterByInput).should('have.value', '')
        cy.get(filterByDropdown).should('contain.text', 'Filter By')
        cy.get(`${AdminUserProfilePage.librariesTable} tbody tr`)
            .should('have.length.greaterThan', 0)
        cy.get(AdminUserProfilePage.librariesTable).should('not.contain.text', 'No results were found')
    }

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        const credentials = Environment.credentials()
        targetLibraryName = `MAT9810Target${uniqueSuffix}`
        controlLibraryName = `MAT9810Control${uniqueSuffix}`

        libraryOwner = CQLLibraryPage.createLibraryAPI(targetLibraryName, SupportedModels.qiCore4)
        CQLLibraryPage.createLibraryAPI(controlLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        sharedProfileUser = [credentials.harpUser2, credentials.harpUser3, credentials.altHarpUser]
            .map((user) => user?.toLowerCase() ?? '')
            .find((user) => user && user !== libraryOwner) ?? ''

        expect(libraryOwner, 'selected library owner').not.to.be.empty
        expect(sharedProfileUser, 'selected shared profile user').not.to.be.empty
        expect(sharedProfileUser, 'shared profile user differs from library owner').not.to.eq(libraryOwner)
        shareLibraryWithProfileUser(0)
        shareLibraryWithProfileUser(1)
    })

    afterEach(() => {
        TestData.setupUserScope()
        ;[1, 0].forEach((libraryNumber) => {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestCqlLibraryById('DELETE', libraryId, { failOnStatusCode: false })
            })
        })
    })

    it('searches and filters the selected user\'s Owned Libraries', () => {
        verifySearchBehavior(libraryOwner, 'OWNED')
    })

    it('searches and filters the selected user\'s Shared Libraries', () => {
        verifySearchBehavior(sharedProfileUser, 'SHARED')
    })
})
