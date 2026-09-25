import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'

const pageSize = 10
const libraryNumbers = Array.from({ length: pageSize + 1 }, (_, index) => index + 1)
const cqlLibraryPublisher = 'SemanticBits'

const createQdmLibraries = (): void => {
    const libraryNamePrefix = `QdmPaginationLibrary${Date.now()}`

    libraryNumbers.forEach((libraryNumber) => {
        CQLLibraryPage.createLibraryAPI(`${libraryNamePrefix}${libraryNumber}`, SupportedModels.QDM, {
            publisher: cqlLibraryPublisher,
            libraryNumber
        })
    })
}

const createQiCoreLibraries = (): void => {
    const libraryNamePrefix = `QiCorePaginationLibrary${Date.now()}`

    libraryNumbers.forEach((libraryNumber) => {
        CQLLibraryPage.createLibraryAPI(`${libraryNamePrefix}${libraryNumber}`, SupportedModels.qiCore4, {
            publisher: `${cqlLibraryPublisher}${libraryNumber}`,
            libraryNumber
        })
    })
}

const cleanUpLibraries = (): Cypress.Chainable<void> => {
    return libraryNumbers.reduce<Cypress.Chainable<void>>(
        (cleanup, libraryNumber) => cleanup.then(() => Utilities.deleteLibrary(undefined, false, libraryNumber)),
        cy.then(() => undefined)
    )
}

const waitForLibraryList = (): void => {
    cy.get(CQLLibrariesPage.librariesList).should('be.visible')
    cy.get(CQLLibrariesPage.libraryListRows).should(($rows) => {
        expect($rows.length, 'library list rows').to.be.greaterThan(0)
    })
}

const openLibraries = (tab?: string): void => {
    CQLLibrariesPage.openLibrariesList()

    if (tab) {
        cy.get(tab).should('be.visible').click()
    }

    waitForLibraryList()
}

const verifyPagination = (): void => {
    cy.url().should('not.include', 'page=2')

    cy.get(MeasuresPage.paginationNextButton)
        .should('be.visible')
        .closest('button')
        .should('not.be.disabled')
        .click()
    cy.url().should('include', 'page=2')
    cy.get('button[aria-current="page"]').should('have.text', '2')
    waitForLibraryList()

    cy.get(MeasuresPage.paginationPreviousButton)
        .should('be.visible')
        .closest('button')
        .should('not.be.disabled')
        .click()
    cy.url().should('include', 'page=1')
    cy.get('button[aria-current="page"]').should('have.text', '1')
    waitForLibraryList()

    cy.get(MeasuresPage.paginationLimitSelect).should('contain', '10').click()
    cy.get('[data-value="25"]:visible').should('be.visible').click()
    cy.get(MeasuresPage.paginationLimitSelect).should('contain', '25')
    waitForLibraryList()
}

describe('CQL Library pagination', () => {
    beforeEach('Login', () => {
        OktaLogin.SessionLogin()
    })

    afterEach('Clean up generated libraries', () => {
        cleanUpLibraries()
    })

    it('paginates All Libraries with QDM libraries', () => {
        createQdmLibraries()
        openLibraries(CQLLibraryPage.allLibrariesTab)
        verifyPagination()
    })

    it('paginates Owned Libraries with QI-Core libraries', () => {
        createQiCoreLibraries()
        openLibraries()
        verifyPagination()
    })
})
