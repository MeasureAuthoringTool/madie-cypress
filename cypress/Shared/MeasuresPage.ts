import { Utilities } from './Utilities'
import { TestCasesPage } from './TestCasesPage'
import { SupportedModels } from './CreateMeasurePage'
import { EditMeasurePage } from './EditMeasurePage'
import { step } from '../utils/step'
import { FixtureOwner, TestData } from './TestData'

export type MeasureActionOptions = {
    exportForPublish?: boolean
    expectExportSuccess?: boolean
    targetVersion?: string
    versionType?: string
    updateModelVersion?: boolean
    altUser?: boolean
    expectCqlEditorTab?: boolean
}

export type MeasureRow = {
    name?: string
    version?: string
    status?: string
    model?: SupportedModels
    shared?: boolean
    cmsId?: string
    updated?: string
}

export type MeasureListAction = 'Edit' | 'View'

export class MeasuresPage {
    public static readonly measureListTitles = '[data-testid="measure-list-tbl"]'
    public static readonly measureListRows = '.measures-list tr'
    public static readonly ownedMeasures = '[data-testid="owned-measures-tab"]'
    public static readonly sharedMeasures = '[data-testid="shared-measures-tab"]'
    public static readonly allMeasuresTab = '[data-testid="all-measures-tab"]'
    public static readonly allReviewsTab = '[data-testid="all-reviews-tab"]'
    public static readonly myReviewsTab = '[data-testid="my-reviews-tab"]'
    public static readonly filterSearchInputBox = '[data-testid="measure-search-input"]'
    public static readonly searchInputBox = '[data-testid="measure-list-search-input"]'
    public static readonly filterByDropdown = '[data-testid="filter-by-select"]'
    public static readonly filterNoOption = '[data-testid="filter-by--"]'
    public static readonly filterMeasureOption = '[data-testid="filter-by-Measure"]'
    public static readonly filterVersionOption = '[data-testid="filter-by-Version"]'
    public static readonly filterModelOption = '[data-testid="filter-by-Model"]'
    public static readonly filterCMSIdOption = '[data-testid="filter-by-CMS ID"]'
    public static readonly filterReviewOption = '[data-testid="filter-by-Review"]'

    //export
    public static readonly exportNonPublishingOption = '[data-testid="executable-export-option"]'
    public static readonly exportPublishingOption = '[data-testid="publishable-export-option"]'
    public static readonly exportingDialog = '[class="MuiBox-root css-1c2c0mn"]'
    public static readonly exportingSpinner = '.spinner'
    public static readonly exportFinishedCheck = '[data-testid="CheckCircleOutlineIcon"]'

    //transfer
    public static readonly newOwnerTextbox = '[data-testid="harp-id-input"]'
    public static readonly newOwnerErrorText = '[data-testid="harp-id-input-helper-text"]'
    public static readonly transferContinueButton = '[data-testid="transfer-save-button"]'

    //history
    public static readonly measureHistoryTable = '[data-testid="measure-history-table"]'
    public static readonly userActionRow = '[data-testid="measure-history-cell-0_actionType"]'
    public static readonly harpIdRow = '[data-testid="measure-history-cell-0_performedBy"]'
    public static readonly additionalActionRow = '[data-testid="measure-history-cell-0_additionalActionMessage"]'
    public static readonly additionalActionContent = '[data-testid="measure-history-additionalInfo_0-content"]'

    //Compare Measure Versions
    public static readonly compareVersionsBtn = '[data-testid="compare-versions-action-btn"]'
    public static readonly compareVersionsPopupTitle = '#draggable-dialog-title'
    public static readonly compareVersionsCqlTab = '[data-testid="cql-tab"]'
    public static readonly compareVersionsHRTab = '[data-testid="human-readable-tab"]'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'

    //Measure Version
    public static readonly versionToastSuccessMsg = '[data-testid="toast-success"]'
    public static readonly versionMeasuresSelectionButton = '[data-testid="version-type"]'
    public static readonly updateDraftedMeasuresTextBox = '[data-testid="measure-name-input"]'
    public static readonly createDraftContinueBtn = '[data-testid="create-draft-continue-button"]'
    public static readonly draftModalSelectionBox = '[data-testid="measure-model-select"]'
    public static readonly draftModalVersionSix = '[data-testid="measure-model-option-QI-Core v6.0.0"]'
    public static readonly draftModalVersionFourOneOne = '[data-testid="measure-model-option-QI-Core v4.1.1"]'
    public static readonly measureVersionTypeDropdown = '[id="version-type"]'
    public static readonly measureVersionMajor = '[data-testid="major-option"]'
    public static readonly measureVersionMinor = '[data-testid="minor-option"]'
    public static readonly measureVersionPatch = '[data-testid="patch-option"]'
    public static readonly confirmMeasureVersionNumber = '[data-testid="confirm-version-input"]'
    public static readonly measureVersionContinueBtn = '[data-testid="create-version-continue-button"]'
    public static readonly measureVersionHelperText = '[data-testid="version-helper-text"]'

    //CQL to ELM version field
    public static readonly measureCQLToElmVersionTxtBox = '[data-testid="translator-version-text-field"]'

    // Review status
    public static readonly actionCenterActionButtons = '[data-testid$="-action-btn"]'
    public static readonly reviewActionButton = '[data-testid="review-action-btn"]'
    public static readonly reviewActionTooltip = '[data-testid="review-action-tooltip"]'

    private static fixtureOwner(options?: MeasureActionOptions): FixtureOwner {
        return options?.altUser ? 'selectedAltUser' : 'selectedUser'
    }

    private static measureActionSelector(measureId: string): string {
        return `[data-testid=measure-action-${measureId}]`
    }

    public static getMeasureActionSelector(measureId: string): string {
        return this.measureActionSelector(measureId)
    }

    public static openMeasureDetailsFromCurrentList(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId)).should('be.visible').and('have.text', 'Edit').click()
            cy.location('pathname').should('contain', `/measures/${measureId}/edit`)
            cy.get(EditMeasurePage.editMeasureButtonActionBtn).should('be.visible')
        })
    }

    public static openMeasureDetailsFromCurrentListInEditOrViewMode(
        measureNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId))
                .should('be.visible')
                .should(($action) => {
                    expect($action.text().trim()).to.be.oneOf(['Edit', 'View'])
                })
                .click()
            cy.location('pathname').should('contain', `/measures/${measureId}/edit`)
            EditMeasurePage.dismissMeasureLockedModalIfPresent()
        })
    }

    public static assertMeasureActionLabel(
        expectedAction: MeasureListAction,
        measureNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId)).should('be.visible').and('have.text', expectedAction)
        })
    }

    public static openMeasureFromCurrentListWithExpectedAction(
        expectedAction: MeasureListAction,
        measureNumber = 0,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId))
                .should('be.visible')
                .and('have.text', expectedAction)
                .click()
            cy.location('pathname').should('contain', `/measures/${measureId}/edit`)
            EditMeasurePage.dismissMeasureLockedModalIfPresent()
        })
    }

    public static openReviewMeasureDetailsFromCurrentList(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId)).should('be.visible').and('have.text', 'View').click()
            cy.location('pathname').should('contain', `/measures/${measureId}/edit/details`)
            cy.get(EditMeasurePage.reviewAndHistoryActionCenterButton).should('be.visible')
        })
    }

    public static openMeasureDetailsById(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.visit(`/measures/${measureId}/edit/details`)
            cy.location('pathname').should('contain', `/measures/${measureId}/edit/details`)
            cy.get(EditMeasurePage.reviewAndHistoryActionCenterButton).should('be.visible')
        })
    }

    private static measureRowSelectSelector(measureId: string): string {
        return `[data-testid="measure-name-${measureId}_select"]`
    }

    private static measureReviewStatusSelector(measureId: string): string {
        return `[data-testid="measure-name-${measureId}_reviewStatus"]`
    }

    private static selectMeasureRow(measureNumber = 0, options?: MeasureActionOptions): void {
        TestData.readMeasureId(measureNumber, this.fixtureOwner(options)).then((measureId) => {
            const rowSelector = this.measureRowSelectSelector(measureId)
            cy.log('Measure ID: ' + measureId)
            Utilities.waitForElementVisible(`${rowSelector} > [class="px-1"] > [type="checkbox"]`, 60000)
            Utilities.waitForElementVisible(`${rowSelector} > [class="px-1"] > [class=" cursor-pointer"]`, 60000)
            cy.get(rowSelector).find('[type="checkbox"]').scrollIntoView().check()
        })
    }

    private static selectVersionedMeasureRow(
        targetVersion: string,
        measureNumber = 0,
        options?: MeasureActionOptions
    ): void {
        TestData.readMeasureId(measureNumber, this.fixtureOwner(options)).then((measureId) => {
            cy.get(this.measureActionSelector(measureId))
                .closest('tr')
                .find('td')
                .eq(1)
                .invoke('text')
                .then((measureName) => {
                    cy.get(this.measureListRows)
                        .filter((_, row) => {
                            const cells = Cypress.$(row).find('td')
                            return (
                                cells.eq(1).text().trim() === measureName.trim() &&
                                cells.eq(2).text().trim() === targetVersion
                            )
                        })
                        .should('have.length', 1)
                        .find('[type="checkbox"]')
                        .scrollIntoView()
                        .check()
                })
        })
    }

    private static clickEnabledAction(actionSelector: string): void {
        cy.get(actionSelector).scrollIntoView().should('be.enabled').click()
    }

    public static assertReviewActionEnabled(): void {
        cy.get(this.reviewActionButton).scrollIntoView().should('be.visible').and('be.enabled')
        cy.get(this.reviewActionTooltip).realHover({ scrollBehavior: false })
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', 'Review')
        cy.get(this.reviewActionTooltip).trigger('mouseout')
    }

    public static assertReviewActionDisabled(): void {
        cy.get(this.reviewActionButton).scrollIntoView().should('be.visible').and('be.disabled')
        cy.get(this.reviewActionTooltip).trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').last().should('have.text', 'Select a measure to update Review status')
        cy.get(this.reviewActionTooltip).trigger('mouseout')
    }

    public static openReviewDialog(): void {
        cy.get(this.reviewActionButton).scrollIntoView().should('be.visible').and('be.enabled').click()
    }

    public static openAllReviewsTab(): void {
        cy.get(this.allReviewsTab).scrollIntoView().should('be.visible').click()
        cy.get(this.measureListTitles).should('be.visible')
    }

    public static assertMyReviewsTabCount(): void {
        cy.get(this.myReviewsTab)
            .should('be.visible')
            .invoke('text')
            .should('match', /^My Reviews \(\d+\)$/)
    }

    public static assertMyReviewsTabFollowsAllReviews(): void {
        cy.get(this.allReviewsTab)
            .should('be.visible')
            .next()
            .should('have.attr', 'data-testid', 'my-reviews-tab')
    }

    public static openMyReviewsTab(): void {
        cy.get(this.myReviewsTab).scrollIntoView().should('be.visible').click()
        cy.get(this.measureListTitles).should('be.visible')
    }

    public static assertMyReviewsColumns(): void {
        const expectedColumns = ['Measure', 'Version', 'Status', 'Model', 'Shared', 'CMS ID', 'Updated', 'Review', 'Action']

        cy.get(this.measureListTitles).within(() => {
            cy.get('thead th').first().should('exist')
            expectedColumns.forEach((column) => cy.contains('th', column).should('be.visible'))
        })
    }

    public static assertMyReviewsActionCenterShowsOnlyReview(): void {
        cy.get(this.actionCenterActionButtons)
            .should('have.length', 1)
            .and('have.attr', 'data-testid', 'review-action-btn')
    }

    public static assertMeasuresAppearInUpdatedDescendingOrder(measureNumbers: number[]): void {
        const measureIds: string[] = []

        measureNumbers.forEach((measureNumber) => {
            TestData.readMeasureId(measureNumber).then((measureId) => measureIds.push(measureId))
        })

        cy.then(() => {
            cy.get(this.measureListRows).then(($rows) => {
                const displayedMeasureIds = [...$rows]
                    .map((row) => row.querySelector('[data-testid^="measure-action-"]')?.getAttribute('data-testid'))
                    .filter((testId): testId is string => Boolean(testId))
                    .map((testId) => testId.replace('measure-action-', ''))
                    .filter((measureId) => measureIds.includes(measureId))

                expect(displayedMeasureIds, 'created review-measure order').to.deep.equal([...measureIds].reverse())
            })
        })
    }

    public static selectReviewFilter(): void {
        this.clickFilterByElement(this.filterByDropdown)
        this.clickFilterByElement(this.filterReviewOption)
        cy.get(this.filterByDropdown).should('contain.text', 'Review')
    }

    public static assertReviewFilterIsLastOption(): void {
        this.clickFilterByElement(this.filterByDropdown)
        cy.get(this.filterReviewOption).should('be.visible')
        cy.get('[role="option"]:visible').last().should('have.attr', 'data-testid', 'filter-by-Review')
    }

    public static assertReviewSearchControls(): void {
        cy.get(this.searchInputBox).scrollIntoView().should('be.visible')
        this.clickFilterByElement(this.filterByDropdown)
        cy.get(this.filterMeasureOption).should('be.visible')
        cy.get(this.filterModelOption).should('be.visible')
        cy.get(this.filterVersionOption).should('be.visible')
        cy.get(this.filterCMSIdOption).should('be.visible')
        cy.get(this.filterReviewOption).should('be.visible')
        cy.get('[role="option"]:visible').last().should('have.attr', 'data-testid', 'filter-by-Review')
    }

    public static clearFilter(): void {
        cy.get('body').then(($body) => {
            if ($body.find(`${this.filterNoOption}:visible`).length) {
                return
            }

            this.clickFilterByElement(this.filterByDropdown)
        })
        this.clickFilterByElement(this.filterNoOption)
    }

    public static searchMeasures(searchText: string): void {
        this.enterSearchText(searchText)
    }

    public static searchForMeasureByName(measureName: string): void {
        this.clickFilterByElement(this.filterByDropdown)
        this.clickFilterByElement(this.filterMeasureOption)
        cy.get(this.filterByDropdown).should('contain.text', 'Measure')
        this.enterSearchText(measureName)
    }

    private static enterSearchText(searchText: string): void {
        cy.get(this.searchInputBox).scrollIntoView()
        cy.get(this.searchInputBox).should('be.visible').clear().type(`${searchText}{enter}`)
    }

    public static assertMeasureSearchRowContains(
        measureNumber: number,
        expectedText: string,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId)).closest('tr').should('contain.text', expectedText)
        })
    }

    public static assertMeasureSearchRowAbsent(
        measureNumber: number,
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureActionSelector(measureId)).should('not.exist')
        })
    }

    public static assertReviewColumnVisible(): void {
        cy.get(this.measureListTitles).contains('th', 'Review').should('be.visible')
    }

    public static assertReviewColumnAbsent(): void {
        cy.get(this.measureListTitles).contains('th', 'Review').should('not.exist')
    }

    public static assertReviewColumnIsNotSortable(): void {
        cy.get(this.measureListTitles).contains('th', 'Review').should('not.have.attr', 'aria-sort')
        cy.get(this.measureListTitles).contains('th', 'Review').click()
        cy.get(this.measureListTitles).contains('th', 'Review').should('not.have.attr', 'aria-sort')
    }

    public static assertMeasureReviewStatus(
        measureNumber: number,
        expectedStatus: 'Ready' | 'In Progress' | 'Complete' | '-',
        owner: FixtureOwner = 'selectedUser'
    ): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureReviewStatusSelector(measureId)).should('have.text', expectedStatus)
        })
    }

    public static hoverMeasureReviewStatus(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureReviewStatusSelector(measureId))
                .scrollIntoView()
                .should('be.visible')
                .then(($reviewStatus) => {
                    const tooltipTarget = $reviewStatus.find('span')
                    cy.wrap(tooltipTarget.length ? tooltipTarget : $reviewStatus).trigger('mouseover')
                })
        })
    }

    public static assertAssignedReviewerTooltip(expectedReviewerNames: string[]): void {
        cy.get('.MuiTooltip-tooltip:visible')
            .last()
            .should(($tooltip) => {
                const reviewerNames = $tooltip
                    .text()
                    .split(/\r?\n/)
                    .map((reviewerName) => reviewerName.trim())
                    .filter(Boolean)

                expect(reviewerNames, 'assigned reviewer tooltip').to.deep.equal(expectedReviewerNames)
            })
    }

    public static assertReviewStatusTooltipAbsent(): void {
        cy.get('body').find('.MuiTooltip-tooltip:visible').should('have.length', 0)
    }

    public static clearMeasureReviewStatusHover(measureNumber = 0, owner: FixtureOwner = 'selectedUser'): void {
        TestData.readMeasureId(measureNumber, owner).then((measureId) => {
            cy.get(this.measureReviewStatusSelector(measureId)).then(($reviewStatus) => {
                const tooltipTarget = $reviewStatus.find('span')
                cy.wrap(tooltipTarget.length ? tooltipTarget : $reviewStatus).trigger('mouseout')
            })
        })
    }

    public static assertLatestMeasureReviewHistory(
        action: 'READY_FOR_REVIEW' | 'REVIEW_IN_PROGRESS' | 'REVIEW_COMPLETE',
        performedBy: string
    ): void {
        cy.get(this.userActionRow).should('contain.text', action)
        cy.get(this.harpIdRow).should('contain.text', performedBy)
        cy.get(this.additionalActionContent).should('have.text', '-')
        cy.get(this.measureHistoryTable).should('not.contain.text', 'UPDATED')
    }

    public static waitForMeasureListRefresh(alias: `@${string}`): Cypress.Chainable<any> {
        return cy.wait(alias).then((interception) => {
            expect(interception.response?.statusCode).to.eq(200)
            return cy
                .get(this.measureListTitles, { timeout: 30000 })
                .should('be.visible')
                .then(() => {
                    return cy.get(this.measureListRows, { timeout: 30000 }).should(($rows) => {
                        expect($rows.length, 'measure list rows').to.be.greaterThan(0)
                    })
                })
                .then(() => {
                    return cy.get(this.measureListRows).first().find('td').eq(1).should('be.visible')
                })
                .then(() => interception)
        })
    }

    private static clickFilterByElement(selector: string): void {
        cy.get(selector).scrollIntoView()
        cy.get(selector).should('be.visible')
        cy.get(selector).click()
    }

    public static checkFirstRow(expectedData: MeasureRow) {
        cy.get(this.measureListRows, { timeout: 30000 })
            .first()
            .then((firstRow) => {
                if (expectedData.name) {
                    cy.wrap(firstRow.children().eq(1)).should('have.text', expectedData.name)
                }
                if (expectedData.version) {
                    cy.wrap(firstRow.children().eq(2)).should('have.text', expectedData.version)
                }
                if (expectedData.status) {
                    cy.wrap(firstRow.children().eq(3)).should('have.text', expectedData.status)
                }
                if (expectedData.model) {
                    cy.wrap(firstRow.children().eq(4)).should('have.text', expectedData.model)
                }
                if (expectedData.shared) {
                    cy.wrap(firstRow.children().eq(5)).find('[data-testid="CheckCircleOutlineIcon"]').should('exist')
                }
                if (expectedData.cmsId) {
                    cy.wrap(firstRow.children().eq(6)).should('have.text', expectedData.cmsId)
                }
                if (expectedData.updated) {
                    cy.wrap(firstRow.children().eq(8)).should('have.text', expectedData.updated)
                }
            })
    }

    public static validateMeasureName(expectedValue: string): void {
        TestData.readMeasureId().then((measureId) => {
            cy.get(this.measureActionSelector(measureId)).parent().parent().should('contain', expectedValue)
        })
    }

    public static validateVersionNumber(versionNumber: string, measureNumber?: number): void {
        TestData.readMeasureId(measureNumber ?? 0).then((measureId) => {
            Utilities.waitForElementVisible(this.measureActionSelector(measureId), 60000)
            cy.get(this.measureActionSelector(measureId)).parent()
            cy.get(`[data-testid="measure-name-${measureId}_version"]`).should('contain', versionNumber)
        })
    }

    public static actionCenter(action: string, measureNumber?: number, options?: MeasureActionOptions): void {
        const selectedMeasureNumber = measureNumber ?? 0
        const fixtureOwner = this.fixtureOwner(options)
        const normalizedAction = action.valueOf().toString().toLowerCase()
        cy.log('Current User: ' + TestData.selectedUser(fixtureOwner))

        if (normalizedAction === 'edit') {
            step('Select Edit from Action Center')
            const expectCqlEditor = options?.expectCqlEditorTab ?? true

            TestData.readMeasureId(selectedMeasureNumber, fixtureOwner).then((measureId) => {
                const rowSelector = this.measureRowSelectSelector(measureId)
                const actionSelector = this.measureActionSelector(measureId)

                cy.get('body', { timeout: 60000 })
                    .should(($body) => {
                        const editTabExists = $body.find(EditMeasurePage.cqlEditorTab).length
                        const measureRowExists = $body.find(rowSelector).length
                        expect(editTabExists + measureRowExists, 'edit tab or measure list row').to.be.greaterThan(0)
                    })
                    .then(($body) => {
                        if ($body.find(EditMeasurePage.cqlEditorTab).length) {
                            if (expectCqlEditor) {
                                Utilities.waitForElementVisible(EditMeasurePage.cqlEditorTab, 60000)
                            }
                            return
                        }

                        this.selectMeasureRow(selectedMeasureNumber, options)
                        Utilities.waitForElementVisible(actionSelector, 60000)
                        cy.get(actionSelector)
                            .should('be.visible')
                            .should('be.enabled')
                            .scrollIntoView()
                            .click({ force: true })

                        if (expectCqlEditor) {
                            Utilities.waitForElementVisible(EditMeasurePage.cqlEditorTab, 60000)
                        }
                    })
            })

            return
        }

        if (options?.targetVersion) {
            this.selectVersionedMeasureRow(options.targetVersion, selectedMeasureNumber, options)
        } else {
            this.selectMeasureRow(selectedMeasureNumber, options)
        }

        switch (normalizedAction) {
            case 'view': {
                step('Select View from Action Center')
                TestData.readMeasureId(selectedMeasureNumber, fixtureOwner).then((measureId) => {
                    const actionSelector = this.measureActionSelector(measureId)
                    Utilities.waitForElementVisible(actionSelector, 60000)
                    cy.get(actionSelector)
                        .should('be.visible')
                        .should('be.enabled')
                        .scrollIntoView()
                        .click({ force: true })
                })
                break
            }

            case 'export': {
                step('Select Export from Action Center')
                const exportForPublish = options?.exportForPublish
                const expectExportSuccess = options?.expectExportSuccess ?? true
                cy.get('[data-testid="export-action-btn"]').scrollIntoView()
                cy.get('[data-testid="export-action-btn"]').should('be.enabled')
                cy.get('[data-testid="export-action-btn"]').click()

                if (exportForPublish) {
                    Utilities.waitForElementVisible(MeasuresPage.exportPublishingOption, 15000)
                    cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Publishable Export')
                    cy.get(MeasuresPage.exportPublishingOption).click()
                } else {
                    Utilities.waitForElementVisible(MeasuresPage.exportNonPublishingOption, 15000)
                    cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Executable Export')
                    cy.get(MeasuresPage.exportNonPublishingOption).click()
                }

                if (!expectExportSuccess) {
                    break
                }

                cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 60000)
                cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')
                cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

                break
            }

            case 'version': {
                step('Select Version from Action Center')
                TestData.readMeasureId(selectedMeasureNumber, fixtureOwner).then((measureId) => {
                    Utilities.waitForElementVisible(this.measureRowSelectSelector(measureId), 60000)
                })
                this.clickEnabledAction('[data-testid="version-action-btn"]')
                Utilities.waitForElementVisible(MeasuresPage.measureVersionTypeDropdown, 60000)

                break
            }
            case 'draft': {
                step('Select Create Draft from Action Center')
                this.clickEnabledAction('[data-testid="draft-action-btn"]')

                break
            }
            case 'delete': {
                step('Select Delete from Action Center')
                this.clickEnabledAction('[data-testid="delete-action-btn"]')

                break
            }
            case 'associatemeasure': {
                step('Select Associate Measure from Action Center')
                //there is a prerequisite that you have a measure created and measure ID stored for 'measureId' and 'measureId2'
                TestData.readMeasureId(2, fixtureOwner).then((measureId) => {
                    const rowSelector = this.measureRowSelectSelector(measureId)
                    Utilities.waitForElementVisible(rowSelector, 60000)
                    Utilities.waitForElementVisible(`${rowSelector} > [class="px-1"] > [type="checkbox"]`, 60000)
                    Utilities.waitForElementVisible(
                        `${rowSelector} > [class="px-1"] > [class=" cursor-pointer"]`,
                        60000
                    )
                    cy.get(rowSelector)
                        .find('[class="px-1"]')
                        .find('[class=" cursor-pointer"]')
                        .scrollIntoView()
                        .click()
                })
                this.clickEnabledAction('[data-testid="associate-cms-id-action-btn"]')

                Utilities.waitForElementVisible('[data-testid="associate-cms-id-button"]', 60000)
                cy.get('[data-testid="associate-cms-id-button"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-button"]').should('be.enabled')

                break
            }
            case 'share': {
                step('Select Share from Action Center')
                this.clickEnabledAction('[data-testid="share-action-btn"]')

                break
            }

            case 'transfer': {
                step('Select Transfer from Action Center')
                this.clickEnabledAction('[data-testid="transfer-action-btn"]')

                break
            }
            case 'viewhr': {
                step('Select View Human Readable from Action Center')
                this.clickEnabledAction('[data-testid="view-hr-action-btn"]')

                break
            }
            case 'viewhistory': {
                step('Select View History from Action Center')
                this.clickEnabledAction('[data-testid="history-action-btn"]')

                break
            }
            default: {
            }
        }
    }

    // in sequences where we have back-to-back actions in the action center, this function is needed to re-check after the 1st action
    // as of 5/20/26 we seem to be carrying the visual of the 1st check forward, but Madie does not actually register the check as real
    public static selectMeasure(measureNumber?: number): void {
        TestData.readMeasureId(measureNumber ?? 0).then((measureId) => {
            cy.get(this.measureRowSelectSelector(measureId))
                .find('[class="px-1"]')
                .find('[class=" cursor-pointer"]')
                .scrollIntoView()
                .click()
        })
    }

    public static selectMeasureForReview(measureNumber = 0): void {
        this.selectMeasureRow(measureNumber)
    }
}
