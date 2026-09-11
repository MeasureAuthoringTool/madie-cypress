export class CompositeMeasureComponentsDialogPage {
    public static readonly selectComponentsButton = '[data-testid="select-components-btn"]'
    public static readonly dialog = '[data-testid="dialog-form"]'
    public static readonly table = '[data-testid="measure-list-tbl"]'
    public static readonly pagination = 'nav[aria-label="pagination navigation"]'

    public static open(): void {
        cy.get(this.selectComponentsButton).should('be.visible').and('be.enabled').click()
    }

    public static assertOpen(): void {
        cy.get(this.dialog)
            .should('be.visible')
            .and('contain.text', 'Select Composite Measure Components')
            .find(this.table)
            .should('be.visible')
    }

    public static clickSortHeader(header: string): void {
        cy.get(this.dialog)
            .find(this.table)
            .contains('th', header)
            .find('button')
            .should('be.visible')
            .click()
    }

    public static assertSortHeaderAction(header: string, expectedAction: string): void {
        cy.get(this.dialog)
            .find(this.table)
            .contains('th', header)
            .find('button')
            .should('have.attr', 'title', expectedAction)
    }

    public static goToPage(pageNumber: number): void {
        // The dialog body has its own scroll container, which can clip pagination controls.
        cy.get(this.dialog)
            .find(`${this.pagination} button[aria-label="Go to page ${pageNumber}"]`)
            .scrollIntoView()
            .should('be.visible')
            .click()
    }

    public static assertCurrentPage(pageNumber: number): void {
        cy.get(this.dialog)
            .find(`${this.pagination} button[aria-current="page"]`)
            .should('have.text', String(pageNumber))
    }

    public static assertHasRows(): void {
        cy.get(this.dialog).find(this.table).find('tbody tr').should('have.length.greaterThan', 0)
    }

    public static measureNames(): Cypress.Chainable<string[]> {
        return cy.get(this.dialog).find(`${this.table} tbody tr td:nth-child(2)`).then(($cells) => {
            return [...$cells].map((cell) => cell.textContent?.trim() ?? '')
        })
    }
}
