import { MeasuresPage } from './MeasuresPage'
import { Accessibility } from '../support/accessibility'

export type MeasureAction =
    | 'delete'
    | 'export'
    | 'share'
    | 'transfer'
    | 'associateCmsId'
    | 'version'
    | 'draft'
    | 'viewHumanReadable'
    | 'history'
    | 'compareVersions'

type ActionContract = {
    button: string
    tooltip: string
    accessibleName: string
    buttonName: string
    noSelectionTooltip: string
    oneSelectionName: string
}

export type MeasureActionTooltipMessages = Record<MeasureAction, string>

export class MeasureActionCenter {
    public static readonly actions: Record<MeasureAction, ActionContract> = {
        delete: {
            button: '[data-testid="delete-action-btn"]',
            tooltip: '[data-testid="delete-action-tooltip"]',
            accessibleName: 'Select a measure to delete',
            buttonName: 'Delete measure',
            noSelectionTooltip: 'Select a measure to delete',
            oneSelectionName: 'Delete measure'
        },
        export: {
            button: '[data-testid="export-action-btn"]',
            tooltip: '[data-testid="export-action-tooltip"]',
            accessibleName: 'Select a measure to export',
            buttonName: 'Export measure',
            noSelectionTooltip: 'Select a measure to export',
            oneSelectionName: 'Export measure'
        },
        share: {
            button: '[data-testid="share-action-btn"]',
            tooltip: '[data-testid="share-action-tooltip"]',
            accessibleName: 'Select a measure to share/unshare',
            buttonName: 'Share/unshare measure',
            noSelectionTooltip: 'Select a measure to share/unshare',
            oneSelectionName: 'Share/unshare'
        },
        transfer: {
            button: '[data-testid="transfer-action-btn"]',
            tooltip: '[data-testid="transfer-action-tooltip"]',
            accessibleName: 'Select a measure to transfer',
            buttonName: 'Transfer measure',
            noSelectionTooltip: 'Select a measure to transfer',
            oneSelectionName: 'Transfer'
        },
        associateCmsId: {
            button: '[data-testid="associate-cms-id-action-btn"]',
            tooltip: '[data-testid="associate-cms-id-tooltip"]',
            accessibleName: 'Select two measures',
            buttonName: 'associate CMS ID',
            noSelectionTooltip: 'Select two measures',
            oneSelectionName: 'Select two measures'
        },
        version: {
            button: '[data-testid="version-action-btn"]',
            tooltip: '[data-testid="version-action-tooltip"]',
            accessibleName: 'Select a measure to version',
            buttonName: 'Version Measure',
            noSelectionTooltip: 'Select a measure to version',
            oneSelectionName: 'Version measure'
        },
        draft: {
            button: '[data-testid="draft-action-btn"]',
            tooltip: '[data-testid="draft-action-tooltip"]',
            accessibleName: 'Select a measure to draft',
            buttonName: 'Draft measure',
            noSelectionTooltip: 'Select a measure to draft',
            oneSelectionName: 'Select a measure to draft'
        },
        viewHumanReadable: {
            button: '[data-testid="view-hr-action-btn"]',
            tooltip: '[data-testid="view-hr-action-tooltip"]',
            accessibleName: 'Select a measure to view human readable',
            buttonName: 'View human readable for measure',
            noSelectionTooltip: 'Select a measure to view human readable',
            oneSelectionName: 'View human readable'
        },
        history: {
            button: '[data-testid="history-action-btn"]',
            tooltip: '[data-testid="history-action-tooltip"]',
            accessibleName: 'Select a measure to view history',
            buttonName: 'View measure history',
            noSelectionTooltip: 'Select a measure to view history',
            oneSelectionName: 'View measure history'
        },
        compareVersions: {
            button: '[data-testid="compare-versions-action-btn"]',
            tooltip: '[data-testid="compare-versions-action-tooltip"]',
            accessibleName: 'Select 2 instances within the same measure set to compare measure versions',
            buttonName: 'compare measure versions',
            noSelectionTooltip: 'Select 2 instances within the same measure set to compare measure versions',
            oneSelectionName: 'Select 2 instances within the same measure set to compare measure versions'
        }
    }

    public static assertSelectAllMeasuresCheckbox(): void {
        cy.get(MeasuresPage.selectAllMeasuresCheckbox).should('have.attr', 'aria-label', 'Select All Measures')
    }

    public static searchAndSelectMeasure(measureName: string, measureNumber = 0): void {
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.assertMeasureSearchRowContains(measureNumber, measureName)
        MeasuresPage.selectMeasure(measureNumber)
    }

    public static searchAndSelectMeasures(measureName: string, measureNumbers: number[]): void {
        MeasuresPage.searchForMeasureByName(measureName)
        measureNumbers.forEach((measureNumber) => {
            MeasuresPage.assertMeasureSearchRowContains(measureNumber, measureName)
            MeasuresPage.selectMeasure(measureNumber)
        })
    }

    public static assertActionMarkup(): void {
        Object.values(this.actions).forEach((action) => {
            cy.get(action.tooltip)
                .should('have.prop', 'tagName', 'DIV')
                .find('span[aria-label]')
                .should('not.exist')
            cy.get(action.button).should('have.attr', 'aria-label', action.buttonName)
            Accessibility.check(action.tooltip, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
        })
    }

    public static assertReviewerAction(featureEnabled: boolean): void {
        if (!featureEnabled) {
            cy.get(MeasuresPage.reviewActionTooltip).should('not.exist')
            cy.get(MeasuresPage.reviewActionButton).should('not.exist')
            return
        }

        cy.get(MeasuresPage.reviewActionTooltip)
            .should('have.prop', 'tagName', 'DIV')
            .and('have.attr', 'aria-label', 'Select a measure to update Review status')
            .find('span[aria-label]')
            .should('not.exist')
        cy.get(MeasuresPage.reviewActionButton)
            .should('have.attr', 'aria-label', 'Review a measure')
            .and('be.disabled')
        Accessibility.check(MeasuresPage.reviewActionTooltip, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
        cy.get(MeasuresPage.reviewActionTooltip).scrollIntoView().trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').should('have.text', 'Select a measure to update Review status')
        cy.get(MeasuresPage.reviewActionTooltip).trigger('mouseout')
    }

    public static assertTooltipMessages(selectionState: 'none' | 'one' | 'all'): void {
        Object.values(this.actions).forEach((action) => this.assertActionAccessibility(action, selectionState))
    }

    public static assertTooltipMessagesForScenario(messages: MeasureActionTooltipMessages): void {
        Object.entries(this.actions).forEach(([actionName, action]) => {
            const expectedMessage = messages[actionName]
            expect(expectedMessage, `Tooltip expectation for ${actionName}`).to.be.a('string').and.not.be.empty

            cy.get(action.tooltip).scrollIntoView().trigger('mouseover')
            cy.get('.MuiTooltip-tooltip:visible').should('have.text', expectedMessage)
            cy.get(action.tooltip).trigger('mouseout')
        })
    }

    public static assertActionAccessibility(action: ActionContract, selectionState: 'none' | 'one' | 'all'): void {
        const expectedName = selectionState === 'one' ? action.oneSelectionName : action.accessibleName

        cy.get(action.tooltip)
            .should('have.prop', 'tagName', 'DIV')
            .and('have.attr', 'aria-label', expectedName)
            .find('span[aria-label]')
            .should('not.exist')
        cy.get(action.button).should('have.attr', 'aria-label', action.buttonName)
        Accessibility.check(action.tooltip, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })

        cy.get(action.tooltip).scrollIntoView().trigger('mouseover')
        cy.get('.MuiTooltip-tooltip:visible').should('have.text', expectedName)
        cy.get(action.tooltip).trigger('mouseout')
    }
}
