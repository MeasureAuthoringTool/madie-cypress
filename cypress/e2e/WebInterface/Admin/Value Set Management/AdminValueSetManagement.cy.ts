import { AdminValueSetsPage } from '../../../../Shared/AdminValueSetsPage'

const expectValueSetRequest = (alias: `@${string}`, expectedSort?: string): void => {
    cy.wait(alias).then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200)
        expect(request.url).to.contain('page=0')
        expect(request.url).to.contain('limit=25')
        if (expectedSort) {
            expect(request.url).to.contain(`sortInfo=${expectedSort}`)
        } else {
            expect(request.url).to.not.contain('sortInfo=')
        }
    })
}

describe('Admin Value Set Management', () => {
    beforeEach(() => {
        cy.session('admin-value-set-management', () => {
            return cy.setAccessTokenCookieAdmin()
        })
    })

    it('displays a URL column with Value Set URLs in the default alphabetical URL sort', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.valueSetTable)
            .find('thead')
            .should('contain.text', 'URL')
        cy.get(AdminValueSetsPage.valueSetTable).find('tbody tr').should('have.length.greaterThan', 0)
        cy.get(AdminValueSetsPage.valueSetTable).find('tbody tr').first().find('td').first().should('not.be.empty')
    })

    it('displays a Last Update column with a date for each Value Set row', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.valueSetTable).find('thead').should('contain.text', 'Last Update')
        cy.get(AdminValueSetsPage.valueSetTable).find('tbody tr').first().find('td').eq(2).should('not.be.empty')
    })

    it('displays a Version column with a version for each Value Set row', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.versionHeader).should('contain.text', 'Version')
        cy.get(AdminValueSetsPage.valueSetTable).find('tbody tr').first().find('td').eq(1).should('not.be.empty')
    })

    it('displays a Manually Modified column for each Value Set row', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.valueSetTable).find('thead').should('contain.text', 'Manually Modified')
        cy.get(AdminValueSetsPage.valueSetTable).find('tbody tr').first().find('td').eq(3).should('not.be.empty')
    })

    it('displays Action and Delete columns with a View/Edit Value Set action for each Value Set row', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.valueSetTable)
            .find('thead')
            .should('contain.text', 'Action')
            .and('contain.text', 'Delete')
        cy.get(AdminValueSetsPage.valueSetTable)
            .find('tbody tr')
            .first()
            .contains('button', 'View/Edit Value Set')
            .should('be.enabled')
    })

    it('displays pagination with 25 Value Sets per page by default', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.paginationLimitSelect).should('have.text', '25')
    })

    it('cycles URL sorting from the deployed default through reverse and unsorted states', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.urlHeader).click()
        expectValueSetRequest('@valueSets', 'url,true')
        cy.get(AdminValueSetsPage.urlHeader).click()
        expectValueSetRequest('@valueSets')
        cy.get(AdminValueSetsPage.urlHeader).click()
        expectValueSetRequest('@valueSets', 'url,false')
    })

    it('sorts Value Sets by Last Updated ascending, descending, then restores the default sort', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.lastUpdatedHeader).click()
        expectValueSetRequest('@valueSets', 'lastUpdated,false')
        cy.get(AdminValueSetsPage.lastUpdatedHeader).click()
        expectValueSetRequest('@valueSets', 'lastUpdated,true')
        cy.get(AdminValueSetsPage.lastUpdatedHeader).click()
        expectValueSetRequest('@valueSets')
    })

    it('sorts manually modified Value Sets first, then non-manually modified Value Sets first, then restores the default sort', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        cy.get(AdminValueSetsPage.manuallyModifiedHeader).click()
        expectValueSetRequest('@valueSets', 'manuallyModified,false')
        cy.get(AdminValueSetsPage.manuallyModifiedHeader).click()
        expectValueSetRequest('@valueSets', 'manuallyModified,true')
        cy.get(AdminValueSetsPage.manuallyModifiedHeader).click()
        expectValueSetRequest('@valueSets')
    })

    it('opens the Edit Valueset Data dialog from a Value Set row', () => {
        cy.intercept('GET', '**/terminology/admin/valuesets*').as('valueSets')

        AdminValueSetsPage.openValueSetManagement()
        expectValueSetRequest('@valueSets', 'url,false')

        AdminValueSetsPage.openFirstValueSetDialog()
        cy.get(AdminValueSetsPage.editValueSetDialog).should('contain.text', 'Edit Valueset Data')

        cy.get(AdminValueSetsPage.closeButton).click()
        cy.get(AdminValueSetsPage.editValueSetDialog).should('not.exist')
    })
})
