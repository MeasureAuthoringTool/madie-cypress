export class AdminValueSetsPage {
    public static readonly valueSetManagementTab = '[data-testid="value-set-management-tab"]'
    public static readonly valueSetTable = '[data-testid="value-set-table"]'
    public static readonly urlHeader = '[data-testid="header-url"]'
    public static readonly versionHeader = '[data-testid="header-version"]'
    public static readonly lastUpdatedHeader = '[data-testid="header-lastUpdated"]'
    public static readonly manuallyModifiedHeader = '[data-testid="header-manuallyModified"]'
    public static readonly searchInput = '[data-testid="vs-search"]'
    public static readonly clearSearchButton = '[data-testid="vs-clear-search"]'
    public static readonly paginationLimitSelect = '[id="pagination-limit-select"]'
    public static readonly openValueSetButton = '[data-testid^="open-vs-"]'
    public static readonly editValueSetDialog = '[data-testid="dialog-form"]'
    public static readonly closeButton = '[data-testid="close-button"]'

    public static openValueSetManagement(): void {
        cy.visit('/admin')
        cy.location('pathname').should('eq', '/admin')
        cy.get(this.valueSetManagementTab).should('be.visible').click()
        cy.get(this.valueSetTable).should('be.visible')
    }

    public static openFirstValueSetDialog(): void {
        cy.get(this.valueSetTable)
            .find('tbody tr')
            .first()
            .within(() => {
                cy.get(this.openValueSetButton).should('be.enabled').click()
            })
        cy.get(this.editValueSetDialog).should('be.visible')
    }
}
