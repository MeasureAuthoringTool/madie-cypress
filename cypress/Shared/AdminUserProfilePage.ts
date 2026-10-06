import { OktaLogin } from './OktaLogin'
import { CQLLibraryPage } from './CQLLibraryPage'
import { MeasuresPage } from './MeasuresPage'

export class AdminUserProfilePage {
    public static readonly userSearchInput = '[data-testid="user-search-input"]'
    public static readonly userSearchButton = '[data-testid="user-trigger-search"]'
    public static readonly userHarpIdCell = '[data-testid$="_harpId"]'
    public static readonly userNameLink = '[data-testid^="user-name-link-"]'
    public static readonly measuresTable = '[data-testid="user-profile-measures-tbl"]'
    public static readonly measureSearchInput = '[data-testid="user-profile-measures-list-search-input"]'
    public static readonly ownedLibrariesTab = CQLLibraryPage.ownedLibrariesTab
    public static readonly sharedLibrariesTab = CQLLibraryPage.sharedLibrariesTab
    public static readonly librariesTable = '[data-testid="user-profile-libraries-tbl"]'
    public static readonly librarySearchInput = '[data-testid="user-profile-measures-list-search-input"]'
    public static readonly libraryClearSearch = '[data-testid="user-profile-measures-clear-search"]'
    public static readonly libraryFilterBy = '[data-testid="filter-by-select"]'
    public static readonly libraryFilterByInput = '[data-testid="filter-by-select-input"]'

    public static readonly exportButton = '[data-testid="export-action-btn"]'
    public static readonly humanReadableButton = '[data-testid="view-hr-action-btn"]'
    public static readonly historyButton = '[data-testid="history-action-btn"]'
    public static readonly compareVersionsButton = MeasuresPage.compareVersionsBtn
    public static readonly changeVersionButton = '[data-testid="change-version-action-btn"]'
    public static readonly changeVersionDialog = '[data-testid="change-version-dialog"]'
    public static readonly changeVersionDialogForm = '[data-testid="dialog-form"]'
    public static readonly changeVersionCancelButton = '[data-testid="change-version-cancel-button"]'
    public static readonly changeVersionSaveButton = '[data-testid="change-version-save-button"]'
    public static readonly selectedMeasureName = '[data-testid="selected-measure-name"]'
    public static readonly selectedLibrary = '[data-testid="selected-library"]'
    public static readonly currentVersionValue = '[data-testid="current-version-value"]'
    public static readonly newVersionNumberInput = '[data-testid="new-version-number-input"]'
    public static readonly newVersionNumberTooltip = '[data-testid="new-version-number-tooltip"]'
    public static readonly versionChangeCriteria = '[data-testid="version-change-criteria"]'
    public static readonly measureVersionsToggle = '[data-testid="measure-versions-toggle"]'
    public static readonly measureVersionsPanel = '[data-testid="measure-versions-panel"]'
    public static readonly libraryVersionsToggle = '[data-testid="library-versions-toggle"]'
    public static readonly libraryVersionsPanel = '[data-testid="library-versions-panel"]'
    public static readonly libraryVersionsTable = '[data-testid="library-versions-table"]'
    public static readonly transferButton = '[data-testid="transfer-action-btn"]'
    public static readonly shareButton = '[data-testid="share-action-btn"]'
    public static readonly deleteButton = '[data-testid="delete-action-btn"]'

    public static readonly exportTooltip = '[data-testid="export-action-tooltip"]'
    public static readonly humanReadableTooltip = '[data-testid="view-hr-action-tooltip"]'
    public static readonly historyTooltip = '[data-testid="history-action-tooltip"]'
    public static readonly compareVersionsTooltip = '[data-testid="compare-versions-action-tooltip"]'
    public static readonly changeVersionTooltip = '[data-testid="change-version-action-tooltip"]'
    public static readonly transferTooltip = '[data-testid="transfer-action-tooltip"]'
    public static readonly shareTooltip = '[data-testid="share-action-tooltip"]'
    public static readonly deleteTooltip = '[data-testid="delete-action-tooltip"]'

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
        cy.contains(this.userHarpIdCell, harpId).closest('tr').find(this.userNameLink).click()

        cy.get('@profileMeasures.all').should((interceptions) => {
            expect(
                interceptions.some((interception) => interception.response?.statusCode === 200),
                'successful profile measures response'
            ).to.be.true
        })
        cy.location('pathname').should('eq', `/admin/userProfile/${harpId}`)
        cy.get(MeasuresPage.ownedMeasures).should('be.visible')
        cy.get(MeasuresPage.sharedMeasures).should('be.visible')
        cy.get(this.measuresTable).should('be.visible')
    }

    public static assertDisabledAction(buttonSelector: string, tooltipSelector: string, expectedTooltip: string): void {
        cy.get(buttonSelector).should('be.disabled')
        cy.get(tooltipSelector).trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', expectedTooltip)
        cy.get(tooltipSelector).trigger('mouseout')
    }

    public static assertEnabledAction(buttonSelector: string, tooltipSelector: string, expectedTooltip: string): void {
        cy.get(buttonSelector).should('be.enabled')
        cy.get(tooltipSelector).should('be.visible').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', expectedTooltip)
        cy.get(tooltipSelector).trigger('mouseout')
    }

    public static openChangeVersionDialog(): void {
        cy.get(this.changeVersionButton).should('be.enabled').click()
        cy.get(this.changeVersionDialog).should('be.visible')
    }

    public static assertChangeVersionDialogClosed(): void {
        cy.get(this.changeVersionDialog).should('not.exist')
    }

    public static assertChangeVersionMeasureDetails(measureName: string, version: string): void {
        this.assertChangeVersionDialogDetails(this.selectedMeasureName, measureName, version, 'measure')
    }

    public static assertChangeVersionLibraryDetails(libraryName: string, version: string): void {
        this.assertChangeVersionDialogDetails(this.selectedLibrary, libraryName, version, 'library')
    }

    public static openMeasureVersions(expectedCount: number): void {
        cy.get(this.measureVersionsToggle).should('contain.text', `Measure Versions (${expectedCount})`).click()
        cy.get(this.measureVersionsPanel).should('be.visible')
    }

    public static closeMeasureVersions(): void {
        cy.get(this.measureVersionsToggle).click()
        cy.get(this.measureVersionsPanel).should('not.exist')
    }

    public static openLibraryVersions(expectedCount: number): void {
        cy.get(this.libraryVersionsToggle).should('contain.text', `Library Versions (${expectedCount})`).click()
        cy.get(this.libraryVersionsTable).should('be.visible')
    }

    public static closeLibraryVersions(): void {
        cy.get(this.libraryVersionsToggle).click()
        cy.get(this.libraryVersionsTable).should('not.exist')
    }

    public static cancelChangeVersion(): void {
        cy.get(this.changeVersionCancelButton).click()
        this.assertChangeVersionDialogClosed()
    }

    public static saveChangeVersion(newVersion: string): void {
        cy.get(this.newVersionNumberInput).type(newVersion)
        cy.get(this.changeVersionSaveButton).click()
        cy.get(this.changeVersionDialog).should('be.visible')
    }

    public static assertChangeVersionCurrentVersion(version: string): void {
        cy.get(this.currentVersionValue).should('have.text', version)
    }

    public static assertMeasureVersionsInOrder(versions: string[]): void {
        cy.get(this.measureVersionsPanel).within(() => {
            cy.contains('th', 'Version #').should('be.visible')
            cy.contains('th', 'Measure Name').should('be.visible')
            cy.contains('th', 'Version Date').should('be.visible')
            versions.forEach((version, index) => cy.get('tbody tr').eq(index).should('contain.text', version))
        })
    }

    public static assertMeasureVersionsScrollable(lastVersion: string): void {
        this.assertVersionsScrollable(this.measureVersionsPanel, lastVersion)
    }

    public static assertLibraryVersionsInOrder(versions: string[]): void {
        cy.get(this.libraryVersionsTable).within(() => {
            cy.contains('th', 'Version #').should('be.visible')
            cy.contains('th', 'Library Name').should('be.visible')
            cy.contains('th', 'Version Date').should('be.visible')
            versions.forEach((version, index) => cy.get('tbody tr').eq(index).should('contain.text', version))
        })
    }

    public static assertLibraryVersionsScrollable(lastVersion: string): void {
        this.assertVersionsScrollable(this.libraryVersionsPanel, lastVersion)
    }

    private static assertChangeVersionDialogDetails(
        selectedRecordSelector: string,
        recordName: string,
        version: string,
        recordType: 'measure' | 'library'
    ): void {
        cy.contains(this.changeVersionDialogForm, 'Change Version #').should('be.visible')
        cy.contains(this.changeVersionDialogForm, 'Indicates required field').should('be.visible')
        cy.get(selectedRecordSelector).should('contain.text', recordName)
        cy.contains(this.changeVersionDialogForm, 'Version-change criteria:').should('be.visible')
        cy.get(this.versionChangeCriteria).should('contain.text', 'Enter a version number that comes before your intended final version.')
        cy.get(this.versionChangeCriteria).should(
            'contain.text',
            `The version number you enter must not be one that has been used previously for this ${recordType}.`
        )
        cy.get(this.versionChangeCriteria).should(
            'contain.text',
            `After this version # change is complete, you may version the draft ${recordType} again to produce the intended final version.`
        )
        cy.get(this.newVersionNumberTooltip).should('be.visible')
        cy.get(this.changeVersionDialogForm).contains('Enter a version number that comes before your intended final version.').should(
            'be.visible'
        )
        this.assertChangeVersionCurrentVersion(version)
        cy.get(this.newVersionNumberInput).should('have.value', '')
        cy.get(this.changeVersionCancelButton).should('be.visible')
        cy.get(this.changeVersionSaveButton).should('be.visible')
    }

    private static assertVersionsScrollable(containerSelector: string, lastVersion: string): void {
        cy.get(containerSelector)
            .should('be.visible')
            .scrollTo('bottom')
            .find('tbody tr')
            .last()
            .scrollIntoView()
            .should('contain.text', lastVersion)
    }

    public static openShareMenu(): void {
        cy.get(this.shareButton).scrollIntoView().should('be.visible').and('be.enabled').click()
    }

    public static selectMeasureRow(rowIndex: number): void {
        cy.get(this.measuresTable).find('tbody tr').eq(rowIndex).find('input[type="checkbox"]').check()
    }

    public static selectMeasureByVersion(version: string): void {
        cy.contains(`${this.measuresTable} tbody td`, version).closest('tr').find('input[type="checkbox"]').check()
    }

    public static selectMeasureById(measureId: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`[data-testid="checkbox-${measureId}"]`).should('be.visible').check()
    }

    public static openMeasuresTab(tabSelector: string): void {
        cy.get(tabSelector).should('be.visible').click()
        cy.get(tabSelector).should('have.attr', 'aria-selected', 'true')
        cy.get(this.measuresTable).should('be.visible')
    }

    public static submitMeasureSearch(searchText: string): void {
        cy.get(this.measureSearchInput).should('be.visible').clear().type(`${searchText}{enter}`)
    }

    public static openLibrariesTab(tabSelector: string): void {
        cy.get(tabSelector).should('be.visible').click()
        cy.get(tabSelector).should('have.attr', 'aria-selected', 'true')
        cy.get(this.librariesTable).should('be.visible')
    }

    public static waitForLibraryListRefresh(alias: `@${string}`): Cypress.Chainable<any> {
        return cy.wait(alias).then((interception) => {
            expect(interception.response?.statusCode).to.eq(200)

            return cy
                .get(this.librariesTable)
                .should('be.visible')
                .find('tbody tr')
                .should('have.length.greaterThan', 0)
                .first()
                .find('td')
                .first()
                .should('be.visible')
                .then(() => interception)
        })
    }

    public static assertLibrarySearchControls(): void {
        cy.get(this.librarySearchInput).should('be.visible').and('be.enabled')
        cy.get(this.libraryFilterBy).should('be.visible')
    }

    public static assertLibraryFilterOptions(): void {
        cy.get(this.libraryFilterBy).click()
        cy.get('[role="listbox"]')
            .should('be.visible')
            .find('[role="option"]')
            .then(($options) => {
                const options = [...$options].map((option) => option.textContent?.trim())
                expect(options).to.deep.eq(['-', 'Library', 'Version', 'Model'])
            })
        cy.get('body').type('{esc}')
    }

    public static selectLibraryFilter(option: 'Library' | 'Version' | 'Model'): void {
        cy.get(this.libraryFilterBy).should('be.visible').click()
        cy.get(`li[data-value="${option}"]`).should('be.visible').click()
        cy.get(this.libraryFilterBy).should('contain.text', option)
    }

    public static submitLibrarySearch(searchText: string): void {
        cy.get(this.librarySearchInput).clear().type(`${searchText}{enter}`)
    }

    public static clearLibrarySearch(): void {
        cy.get(this.libraryClearSearch).should('be.visible').find('button').should('be.enabled').click()
    }

    public static findLibraryRow(libraryName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.contains(`${this.librariesTable} td`, libraryName).should('be.visible').closest('tr')
    }

    public static findLibraryRowById(libraryId: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`[data-testid="checkbox-${libraryId}"]`).should('be.visible').closest('tr')
    }

    public static findLibraryAction(libraryId: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`[data-testid="library-action-${libraryId}"]`).should('be.visible')
    }

    public static selectLibraryByName(libraryName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.findLibraryRow(libraryName).find('input[type="checkbox"]').should('be.visible').check()
    }

    public static selectLibraryById(libraryId: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`[data-testid="checkbox-${libraryId}"]`).should('be.visible').check()
    }

    public static expandLibrarySet(libraryName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        this.findLibraryRow(libraryName).find('[data-testid^="expand-library-toggle-"]').should('be.visible').click()

        return cy.get(`${this.librariesTable} tr.expanded-row:visible`).should('have.length.greaterThan', 0)
    }

    public static selectMeasureByName(measureName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.findMeasureRow(measureName)
            .should('be.visible')
            .find('input[type="checkbox"]')
            .should('be.visible')
            .check()
    }

    public static findMeasureRow(measureName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.contains(`${this.measuresTable} tbody td`, measureName).should('be.visible').closest('tr')
    }

    public static findMeasureAction(measureId: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`[data-testid="measure-action-${measureId}"]`).should('be.visible')
    }

    public static expandMeasureSet(
        measureId: string,
        expectedExpandedRows = 1
    ): Cypress.Chainable<JQuery<HTMLElement>> {
        const measureRow = `[data-testid="measure-name-${measureId}_select"]`
        const expandToggle = `[data-testid="expand-toggle-${measureId}"]`

        cy.get(measureRow).should('be.visible')
        cy.get(expandToggle).should('be.visible')
        cy.get(expandToggle).click()

        return cy.get(this.measuresTable).find('tr.expanded-row:visible').should('have.length', expectedExpandedRows)
    }
}
