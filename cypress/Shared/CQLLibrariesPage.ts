import { Header } from './Header'
import { Utilities } from './Utilities'
import { CQLLibraryPage } from './CQLLibraryPage'
import { FixtureOwner, TestData } from './TestData'

export class CQLLibrariesPage {
    public static readonly librariesList = '[data-testid="library-list-tbl"]'
    public static readonly libraryListRows = '.table-body tr'

    //Version and Draft CQL Library
    public static readonly versionLibraryRadioButton = '[name="type"]'
    public static readonly createVersionContinueButton =
        '[data-testid="create-version-continue-button"] > :nth-child(1)'
    public static readonly VersionDraftMsgs = '.MuiAlert-message'
    public static readonly updateDraftedLibraryTextBox = '[data-testid="cql-library-name-input"]'
    public static readonly createDraftContinueBtn = '[data-testid="create-draft-continue-button"]'
    public static readonly versionErrorMsg = '[data-testid=create-version-error-message]'
    public static readonly versionCancelBtn = '[data-testid="create-version-cancel-button"]'
    public static readonly editCQLLibraryAlertMessage = '.madie-alert'
    public static readonly cqlLibraryDirtyCheck = '.MuiDialogContent-root'

    //Libraries row 0 elements
    public static readonly cqlLibraryVersionList = '[data-testid="measure-name-0_version"]'
    public static readonly row0_Status = '[data-testid="measure-name-0_draft"]'
    public static readonly row0_ExpandArrow = '[data-testid="measure-name-0_expandArrow"]'

    //Action Center buttons
    public static readonly actionCenterDeleteBtn = '[data-testid="delete-action-btn"]'
    public static readonly actionCenterVersionBtn = '[data-testid="version-action-btn"]'
    public static readonly actionCenterDraftBtn = '[data-testid="draft-action-btn"]'
    public static readonly actionCenterShareBtn = '[data-testid="share-action-btn"]'
    public static readonly actionCenterTransferBtn = '[data-testid="transfer-action-btn"]'
    public static readonly actionCenterHistoryBtn = '[data-testid="library-history-action-btn"]'
    public static readonly actionCenterCompareVersions = '[data-testid="compare-versions-action-btn"]'
    public static readonly reviewActionButton = '[data-testid="review-action-btn"]'
    public static readonly reviewActionTooltip = '[data-testid="review-action-tooltip"]'
    public static readonly filterNoOption = '[data-testid="filter-by--"]'
    public static readonly filterReviewOption = '[data-testid="filter-by-Review"]'

    //Share/Un share Library
    public static readonly shareOption = '[data-testid="Share With-option"]'
    public static readonly unshareOption = '[data-testid="Unshare-option"]'
    public static readonly harpIdInputTextBox = '[data-testid="harp-id-input"]'
    public static readonly addBtn = '[id="add-user-btn"]'
    public static readonly expandArrow = '[data-testid="KeyboardArrowRightIcon"]'
    public static readonly sharedUserTable = '[data-testid="row-item"]'
    public static readonly saveUserBtn = '[data-testid="share-save-button"]'
    public static readonly successMsg = '[class="toast success"]'
    public static readonly unshareCheckBox = '.PrivateSwitchBase-input'
    public static readonly acceptBtn = '[data-testid="share-confirmation-dialog-accept-button"]'

    //Library List Columns
    public static readonly hdrLibrary = '[data-testid="header-cqlLibraryName"]'
    public static readonly hdrVersion = '[data-testid="header-version"]'
    public static readonly hdrStatus = '[data-testid="header-draft"]'
    public static readonly hdrModel = '[data-testid="header-model"]'
    public static readonly hdrShared = '[data-testid="header-librarySet.acls"]'
    public static readonly hdrUpdated = '[data-testid="header-lastModifiedAt"]'

    public static readonly reviewStatusCell = (row = 0) => `[data-testid="measure-name-${row}_reviewStatus"]`

    private static fixtureOwner(altUser?: boolean): FixtureOwner {
        return altUser ? 'selectedAltUser' : 'selectedUser'
    }

    private static libraryActionSelector(libraryId: string): string {
        return `[data-testid="cql-library-action-${libraryId}"]`
    }

    public static getLibraryActionSelector(libraryId: string): string {
        return this.libraryActionSelector(libraryId)
    }

    private static libraryContentSelector(libraryId: string): string {
        return `[data-testid="cqlLibrary-button-${libraryId}-content"]`
    }

    private static goToLibrariesList(): void {
        cy.visit('/cql-libraries')
        cy.location('pathname').should('eq', '/cql-libraries')
        cy.get(CQLLibraryPage.ownedLibrariesTab, { timeout: 35000 }).should('be.visible')
        cy.get(CQLLibraryPage.sharedLibrariesTab, { timeout: 35000 }).should('be.visible')
        cy.get(CQLLibraryPage.allLibrariesTab, { timeout: 35000 }).should('be.visible')
        Utilities.waitForElementVisible(this.librariesList, 35000)
    }

    public static openLibrariesList(): void {
        this.goToLibrariesList()
    }

    private static openLibraryAction(libraryNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            const actionSelector = this.libraryActionSelector(libraryId)
            cy.intercept('GET', `/api/cql-libraries/${libraryId}`).as('cqlLibrary')

            cy.get(actionSelector).should('exist').should('be.visible')
            Utilities.waitForElementEnabled(actionSelector, 4500)
            cy.get(actionSelector).click()

            cy.wait('@cqlLibrary', { timeout: 10000 }).then(({ response }) => {
                expect(response?.statusCode).to.eq(200)
            })
        })
    }

    public static openLibraryDetailsFromCurrentList(libraryNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        this.openLibraryAction(libraryNumber, owner)
        cy.get('[data-testid="CQL Library Details"]').should('be.visible').click()
        TestData.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            cy.location('pathname').should('contain', `/cql-libraries/${libraryId}/edit/details`)
        })
        cy.get(CQLLibraryPage.actionCenterButton).should('be.visible')
    }

    public static selectLibraryRow(libraryNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            cy.get(this.libraryContentSelector(libraryId))
                .closest('tr')
                .find('input[type="checkbox"]')
                .should('be.visible')
                .check()
        })
    }

    public static assertReviewActionEnabled(): void {
        cy.get(this.reviewActionButton).should('be.visible').and('be.enabled')
        cy.get(this.reviewActionTooltip).realHover({ scrollBehavior: false })
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', 'Review')
        cy.get(this.reviewActionTooltip).trigger('mouseout')
    }

    public static assertReviewActionDisabled(): void {
        cy.get(this.reviewActionButton).should('be.visible').and('be.disabled')
        cy.get(this.reviewActionTooltip).trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', 'Select a library to update Review status')
        cy.get(this.reviewActionTooltip).trigger('mouseout')
    }

    public static openReviewDialog(): void {
        cy.get(this.reviewActionButton).scrollIntoView().should('be.visible').and('be.enabled').click()
    }

    public static waitForLibraryListRefresh(alias: `@${string}`): Cypress.Chainable<any> {
        return cy.wait(alias).then((interception) => {
            expect(interception.response?.statusCode).to.eq(200)
            return cy
                .get(this.librariesList, { timeout: 30000 })
                .should('be.visible')
                .then(() => {
                    return cy.get(this.libraryListRows, { timeout: 30000 }).should(($rows) => {
                        expect($rows.length, 'library list rows').to.be.greaterThan(0)
                    })
                })
                .then(() => {
                    return cy.get(this.libraryListRows).first().find('td').eq(1).should('be.visible')
                })
                .then(() => interception)
        })
    }

    public static clickEditforCreatedLibrary(libraryNumber?: number, altUser?: boolean): void {
        this.goToLibrariesList()
        this.openLibraryAction(libraryNumber ?? 0, this.fixtureOwner(altUser))
        cy.get('[data-testid="CQL Library Details"]').click()
    }

    public static clickViewforCreatedLibrary(libraryNumber?: number, altUserAction?: boolean): void {
        if (altUserAction) {
            cy.get(Header.cqlLibraryTab).should('exist').should('be.visible').click()
            Utilities.waitForElementVisible(CQLLibraryPage.allLibrariesTab, 35000)
            cy.get(CQLLibraryPage.allLibrariesTab).wait(2000).click()
        } else {
            cy.get(Header.cqlLibraryTab).should('exist').should('be.visible').click()
        }
        Utilities.waitForElementVisible(this.librariesList, 35000)
        this.openLibraryAction(libraryNumber ?? 0)
    }

    public static validateCQLLibraryName(expectedValue: string): void {
        TestData.readCqlLibraryId().then((libraryId) => {
            cy.get(this.libraryContentSelector(libraryId)).should('contain', expectedValue)
        })
    }

    public static searchForLibraryByName(libraryName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        Utilities.dropdownSelect(CQLLibraryPage.filterByDropdown, 'Library')
        cy.get(CQLLibraryPage.LibFilterTextField)
            .should('be.visible')
            .clear()
            .type(`${libraryName}{enter}`)

        return cy.get(this.libraryListRows, { timeout: 30000 })
            .contains('td', libraryName)
            .closest('tr')
            .should('be.visible')
    }

    public static selectReviewFilter(): void {
        this.clickFilterByElement(CQLLibraryPage.filterByDropdown)
        this.clickFilterByElement(this.filterReviewOption)
        cy.get(CQLLibraryPage.filterByDropdown).should('contain.text', 'Review')
    }

    public static assertReviewFilterIsLastOption(): void {
        this.clickFilterByElement(CQLLibraryPage.filterByDropdown)
        cy.get(this.filterReviewOption).should('be.visible')
        cy.get('[role="option"]:visible').last().should('have.attr', 'data-testid', 'filter-by-Review')
    }

    public static clearFilter(): void {
        cy.get('body').then(($body) => {
            if ($body.find(`${this.filterNoOption}:visible`).length) {
                return
            }

            this.clickFilterByElement(CQLLibraryPage.filterByDropdown)
        })
        this.clickFilterByElement(this.filterNoOption)
    }

    public static searchLibraries(searchText: string): void {
        cy.get(CQLLibraryPage.LibFilterTextField).should('be.visible').clear().type(`${searchText}{enter}`)
    }

    public static assertLibrarySearchRowContains(
        libraryNumber: number,
        expectedText: string,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            cy.get(this.libraryActionSelector(libraryId)).closest('tr').should('contain.text', expectedText)
        })
    }

    public static assertLibrarySearchRowAbsent(
        libraryNumber: number,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            cy.get(this.libraryActionSelector(libraryId)).should('not.exist')
        })
    }

    public static assertReviewColumnVisible(): void {
        cy.get(this.librariesList).contains('th', 'Review').should('be.visible')
    }

    public static assertReviewFilterAbsent(): void {
        this.clickFilterByElement(CQLLibraryPage.filterByDropdown)
        cy.get(this.filterReviewOption).should('not.exist')
    }

    public static assertReviewColumnAbsent(): void {
        cy.get(this.librariesList).contains('th', 'Review').should('not.exist')
    }

    public static assertReviewColumnIsNotSortable(): void {
        cy.get(this.librariesList)
            .contains('th', 'Review')
            .should('not.have.attr', 'aria-sort')
        cy.get(this.librariesList).contains('th', 'Review').click()
        cy.get(this.librariesList).contains('th', 'Review').should('not.have.attr', 'aria-sort')
    }

    public static assertAllReviewsTabCount(): void {
        cy.get(CQLLibraryPage.allReviewsTab)
            .should('be.visible')
            .invoke('text')
            .should('match', /^All Reviews \(\d+\)$/)
    }

    public static assertAllReviewsTabFollowsAllLibraries(): void {
        cy.get(CQLLibraryPage.allLibrariesTab)
            .should('be.visible')
            .next()
            .should('have.attr', 'data-testid', 'all-reviews-tab')
    }

    public static openAllReviewsTab(): void {
        cy.get(CQLLibraryPage.allReviewsTab).should('be.visible').click()
        cy.get(this.librariesList).should('be.visible')
    }

    public static assertAllReviewsColumns(): void {
        cy.get(this.librariesList).within(() => {
            cy.get('thead th').first().should('exist')
            cy.get(this.hdrLibrary).should('have.text', 'Library')
            cy.get(this.hdrVersion).should('have.text', 'Version')
            cy.get(this.hdrStatus).should('have.text', 'Status')
            cy.get(this.hdrModel).should('have.text', 'Model')
            cy.get(this.hdrShared).should('have.text', 'Shared')
            cy.get(this.hdrUpdated).should('have.text', 'Updated')
            cy.contains('th', 'Review').should('be.visible')
            cy.contains('th', 'Action').should('be.visible')
            cy.contains('th', 'Owner').should('not.exist')
        })
    }

    public static assertLibrariesAppearInUpdatedDescendingOrder(libraryIds: string[]): void {
        cy.get(this.libraryListRows).then(($rows) => {
            const rowOrder = [...$rows]
                .map((row) => row.querySelector('[data-testid^="cql-library-action-"]')?.getAttribute('data-testid'))
                .filter((testId): testId is string => Boolean(testId))
                .map((testId) => testId.replace('cql-library-action-', ''))
                .filter((libraryId) => libraryIds.includes(libraryId))

            expect(rowOrder, 'created review-library order').to.deep.equal(libraryIds)
        })
    }

    private static clickFilterByElement(selector: string): void {
        cy.get(selector).should('be.visible').click()
    }

    public static selectLibraryByName(libraryName: string): void {
        this.searchForLibraryByName(libraryName)
            .find('input[type="checkbox"]')
            .check()
    }

    public static selectCreatedLibraryRow(libraryNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        this.goToLibrariesList()

        TestData.readCqlLibraryId(libraryNumber, owner).then((libraryId) => {
            cy.get(this.libraryContentSelector(libraryId), { timeout: 30000 }).should('be.visible')
            cy.get(this.libraryContentSelector(libraryId))
                .closest('tr')
                .find('[data-testid$="_select"]', { timeout: 30000 })
                .scrollIntoView()
                .click()
        })
    }

    public static validateVersionNumber(expectedValue: string, versionNumber: string): void {
        TestData.readCqlLibraryId().then((libraryId) => {
            cy.get(this.libraryContentSelector(libraryId))
                .should('contain.text', expectedValue)
                .parent()
                .invoke('data', 'testid')
                .then((testId) => {
                    const value: string = testId.split('_')[0].slice(-1) // extract row index value
                    cy.get('[data-testid="measure-name-' + value + '_version"]').should('contain.text', versionNumber)
                })
        })
    }

    public static cqlLibraryActionCenter(action: string, libraryNumber?: number): void {
        if (libraryNumber === undefined || libraryNumber === null) {
            Utilities.waitForElementVisible('[data-testid="measure-name-0_select"]', 60000)
            cy.get('[data-testid="measure-name-0_select"]')
                .find('[class="px-1"]')
                .find('[class=" cursor-pointer"]')
                .scrollIntoView()
            cy.get('[data-testid="measure-name-0_select"]')
                .find('[class="px-1"]')
                .find('[class=" cursor-pointer"]')
                .click()
        }

        if (libraryNumber && libraryNumber > 0) {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + libraryNumber + '_select"]', 60000)
            cy.get('[data-testid="measure-name-' + libraryNumber + '_select"]')
                .find('[class="px-1"]')
                .find('[class=" cursor-pointer"]')
                .scrollIntoView()
            cy.get('[data-testid="measure-name-0_select"]')
                .find('[class="px-1"]')
                .find('[class=" cursor-pointer"]')
                .click()
        }

        switch (action.valueOf().toString().toLowerCase()) {
            case 'delete': {
                cy.get(this.actionCenterDeleteBtn).should('be.visible')
                cy.get(this.actionCenterDeleteBtn).should('be.enabled')
                cy.get(this.actionCenterDeleteBtn).click()

                break
            }
            case 'version': {
                cy.get(this.actionCenterVersionBtn).should('be.visible')
                cy.get(this.actionCenterVersionBtn).should('be.enabled')
                cy.get(this.actionCenterVersionBtn).click()

                break
            }
            case 'draft': {
                cy.get(this.actionCenterDraftBtn).should('be.visible')
                cy.get(this.actionCenterDraftBtn).should('be.enabled')
                cy.get(this.actionCenterDraftBtn).click()

                break
            }
            case 'share': {
                cy.get(this.actionCenterShareBtn).should('be.visible')
                cy.get(this.actionCenterShareBtn).should('be.enabled')
                cy.get(this.actionCenterShareBtn).click()

                break
            }
            case 'transfer': {
                cy.get(this.actionCenterTransferBtn).should('be.visible')
                cy.get(this.actionCenterTransferBtn).should('be.enabled')
                cy.get(this.actionCenterTransferBtn).click()

                break
            }
            case 'viewhistory': {
                cy.get(this.actionCenterHistoryBtn).should('be.visible')
                cy.get(this.actionCenterHistoryBtn).should('be.enabled')
                cy.get(this.actionCenterHistoryBtn).click()

                break
            }
            default: {
            }
        }
    }
}
