import { OktaLogin } from './OktaLogin'
import { MeasuresPage } from './MeasuresPage'

export class AdminUserProfilePage {
    public static readonly userSearchInput = '[data-testid="user-search-input"]'
    public static readonly userSearchButton = '[data-testid="user-trigger-search"]'
    public static readonly userHarpIdCell = '[data-testid$="_harpId"]'
    public static readonly userNameLink = '[data-testid^="user-name-link-"]'
    public static readonly measuresTable = '[data-testid="user-profile-measures-tbl"]'

    public static readonly exportButton = '[data-testid="export-action-btn"]'
    public static readonly humanReadableButton = '[data-testid="view-hr-action-btn"]'
    public static readonly historyButton = '[data-testid="history-action-btn"]'
    public static readonly compareVersionsButton = MeasuresPage.compareVersionsBtn

    public static readonly exportTooltip = '[data-testid="export-action-tooltip"]'
    public static readonly humanReadableTooltip = '[data-testid="view-hr-action-tooltip"]'
    public static readonly historyTooltip = '[data-testid="history-action-tooltip"]'
    public static readonly compareVersionsTooltip = '[data-testid="compare-versions-action-tooltip"]'

    public static openAdminWorkspace(): void {
        cy.visit('/admin')
        cy.location('pathname').should('eq', '/admin')
        cy.get(this.userSearchInput).should('be.visible').and('be.enabled')
    }

    public static openUserProfile(harpId = OktaLogin.getUser(false)): void {
        this.openAdminWorkspace()

        cy.get(this.userSearchInput).clear().type(harpId)
        cy.get(this.userSearchButton).should('be.visible').click()
        cy.intercept('PUT', '**/api/admin/userProfile/*/measures/searches*').as('profileMeasures')
        cy.contains(this.userHarpIdCell, harpId)
            .closest('tr')
            .find(this.userNameLink)
            .click()

        cy.wait('@profileMeasures').its('response.statusCode').should('eq', 200)
        cy.wait('@profileMeasures').its('response.statusCode').should('eq', 200)
        cy.location('pathname').should('eq', `/admin/userProfile/${harpId}`)
        cy.get(MeasuresPage.ownedMeasures).should('be.visible')
        cy.get(MeasuresPage.sharedMeasures).should('be.visible')
        cy.get(this.measuresTable).should('be.visible')
    }

    public static assertDisabledAction(
        buttonSelector: string,
        tooltipSelector: string,
        expectedTooltip: string
    ): void {
        cy.get(buttonSelector).should('be.disabled')
        cy.get(tooltipSelector).trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', expectedTooltip)
        cy.get(tooltipSelector).trigger('mouseout')
    }

    public static assertEnabledAction(
        buttonSelector: string,
        tooltipSelector: string,
        expectedTooltip: string
    ): void {
        cy.get(buttonSelector).should('be.enabled')
        cy.get(buttonSelector).realHover({ scrollBehavior: false })
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', expectedTooltip)
        cy.get(tooltipSelector).trigger('mouseout')
    }

    public static selectMeasureRow(rowIndex: number): void {
        cy.get(this.measuresTable)
            .find('tbody tr')
            .eq(rowIndex)
            .find('input[type="checkbox"]')
            .check()
    }

    public static selectMeasureByVersion(version: string): void {
        cy.contains(`${this.measuresTable} tbody td`, version)
            .closest('tr')
            .find('input[type="checkbox"]')
            .check()
    }

    public static openMeasuresTab(tabSelector: string): void {
        cy.get(tabSelector).should('be.visible').click()
        cy.get(tabSelector).should('have.attr', 'aria-selected', 'true')
        cy.get(this.measuresTable).should('be.visible')
    }

    public static selectMeasureByName(measureName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.contains(`${this.measuresTable} tbody td`, measureName)
            .should('be.visible')
            .closest('tr')
            .find('input[type="checkbox"]')
            .should('be.visible')
            .check()
    }

    public static expandMeasureSet(
        measureId: string,
        expectedExpandedRows = 1
    ): Cypress.Chainable<JQuery<HTMLElement>> {
        const measureRow = `[data-testid="measure-name-${measureId}_select"]`
        const expandIcon = `[data-testid="measure-name-${measureId}_expandArrow"]`

        cy.get(measureRow).should('be.visible')
        cy.get(expandIcon)
            .should('be.visible')
            .find('svg')
            .should('be.visible')
            .click()

        return cy
            .get(this.measuresTable)
            .find('tr.expanded-row:visible')
            .should('have.length', expectedExpandedRows)
    }

}
