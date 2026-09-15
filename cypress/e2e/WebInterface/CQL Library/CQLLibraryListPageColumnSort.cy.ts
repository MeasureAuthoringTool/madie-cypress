import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'

type CqlLibrarySortField = 'cqlLibraryName' | 'version' | 'draft' | 'model' | 'librarySet.acls' | 'lastModifiedAt'

type CqlLibrarySearchResult = {
    cqlLibraryName?: string
    version?: string
    draft?: boolean
    model?: string
    lastModifiedAt?: string
    librarySet?: { acls?: unknown[] }
}

const openAllLibraries = (): void => {
    cy.intercept({
        method: 'PUT',
        pathname: '/api/cql-libraries/searches',
        query: { ownershipType: 'ALL' }
    }).as('allLibraries')

    CQLLibrariesPage.openLibrariesList()
    cy.get(CQLLibraryPage.allLibrariesTab).should('be.visible').click()
    CQLLibrariesPage.waitForLibraryListRefresh('@allLibraries')
}

const sortBy = (
    headerSelector: string,
    field: CqlLibrarySortField,
    descending: boolean,
    cellIndex: number,
    assertFirstCell: (cellText: string, library: CqlLibrarySearchResult) => void
): void => {
    const alias = `sort-${field.replace('.', '-')}-${descending}`

    cy.intercept({
        method: 'PUT',
        pathname: '/api/cql-libraries/searches',
        query: {
            ownershipType: 'ALL',
            limit: '10',
            page: '0',
            sortInfo: `${field},${descending}`
        }
    }).as(alias)

    cy.get(headerSelector).should('be.visible').click()
    CQLLibrariesPage.waitForLibraryListRefresh(`@${alias}`).then(({ response }) => {
        const library = response?.body?.content?.[0] as CqlLibrarySearchResult | undefined
        expect(library, `first ${field} search result`).to.exist

        cy.get(CQLLibrariesPage.libraryListRows)
            .first()
            .find('td')
            .eq(cellIndex)
            .invoke('text')
            .then((cellText) => assertFirstCell(cellText.trim(), library!))
    })
}

const assertTextCell =
    (expectedValue: string | undefined) =>
    (cellText: string): void => {
        expect(cellText).to.eq(expectedValue ?? '')
    }

describe('CQL Library List Page Sort by Columns', () => {
    beforeEach('Login', () => {
        OktaLogin.SessionLogin()
    })

    it('CQL Library sorting by columns on All Libraries tab', () => {
        openAllLibraries()

        sortBy(CQLLibrariesPage.hdrLibrary, 'cqlLibraryName', false, 1, (cellText, library) => {
            assertTextCell(library.cqlLibraryName)(cellText)
        })
        sortBy(CQLLibrariesPage.hdrLibrary, 'cqlLibraryName', true, 1, (cellText, library) => {
            assertTextCell(library.cqlLibraryName)(cellText)
        })

        sortBy(CQLLibrariesPage.hdrVersion, 'version', false, 2, (cellText, library) => {
            assertTextCell(library.version)(cellText)
        })
        sortBy(CQLLibrariesPage.hdrVersion, 'version', true, 2, (cellText, library) => {
            assertTextCell(library.version)(cellText)
        })

        sortBy(CQLLibrariesPage.hdrStatus, 'draft', false, 3, (cellText, library) => {
            expect(cellText).to.eq(library.draft ? 'Draft' : '')
        })
        sortBy(CQLLibrariesPage.hdrStatus, 'draft', true, 3, (cellText, library) => {
            expect(cellText).to.eq(library.draft ? 'Draft' : '')
        })

        sortBy(CQLLibrariesPage.hdrModel, 'model', false, 4, (cellText, library) => {
            assertTextCell(library.model)(cellText)
        })
        sortBy(CQLLibrariesPage.hdrModel, 'model', true, 4, (cellText, library) => {
            assertTextCell(library.model)(cellText)
        })

        sortBy(CQLLibrariesPage.hdrShared, 'librarySet.acls', false, 5, (_cellText, library) => {
            const hasSharedAccess = Boolean(library.librarySet?.acls?.length)
            cy.get(CQLLibrariesPage.libraryListRows)
                .first()
                .find('td')
                .eq(5)
                .find('[data-testid="CheckCircleOutlineIcon"]')
                .should(hasSharedAccess ? 'exist' : 'not.exist')
        })
        sortBy(CQLLibrariesPage.hdrShared, 'librarySet.acls', true, 5, (_cellText, library) => {
            const hasSharedAccess = Boolean(library.librarySet?.acls?.length)
            cy.get(CQLLibrariesPage.libraryListRows)
                .first()
                .find('td')
                .eq(5)
                .find('[data-testid="CheckCircleOutlineIcon"]')
                .should(hasSharedAccess ? 'exist' : 'not.exist')
        })

        sortBy(CQLLibrariesPage.hdrUpdated, 'lastModifiedAt', false, 7, (cellText, library) => {
            expect(library.lastModifiedAt, 'API last modified date').to.be.a('string').and.not.be.empty
            expect(cellText, 'rendered last modified date').to.not.be.empty
        })
        sortBy(CQLLibrariesPage.hdrUpdated, 'lastModifiedAt', true, 7, (cellText, library) => {
            expect(library.lastModifiedAt, 'API last modified date').to.be.a('string').and.not.be.empty
            expect(cellText, 'rendered last modified date').to.not.be.empty
        })
    })

    it('Column sort resets pagination to page 1', () => {
        openAllLibraries()

        cy.intercept({
            method: 'PUT',
            pathname: '/api/cql-libraries/searches',
            query: { ownershipType: 'ALL', limit: '10', page: '1' }
        }).as('secondPage')
        cy.get(MeasuresPage.paginationNextButton).should('be.visible').click()
        CQLLibrariesPage.waitForLibraryListRefresh('@secondPage')

        sortBy(CQLLibrariesPage.hdrModel, 'model', false, 4, (cellText, library) => {
            assertTextCell(library.model)(cellText)
        })

        cy.url().should('match', /page=1/)
        cy.get('button[aria-current="page"]').should('have.text', '1')
    })

    it('Sort is not allowed on checkbox column and action button column', () => {
        openAllLibraries()

        cy.get(CQLLibrariesPage.librariesList)
            .find('thead tr')
            .first()
            .then((headerRow) => {
                cy.wrap(headerRow.children().eq(0)).find('.header-button').should('not.exist')
                cy.wrap(headerRow.children().last()).find('.header-button').should('not.exist')
            })
    })
})
