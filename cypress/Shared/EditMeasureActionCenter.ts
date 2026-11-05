import { EditMeasurePage } from './EditMeasurePage'
import { Accessibility } from '../support/accessibility'

export type EditMeasureAction =
    | 'review'
    | 'history'
    | 'humanReadable'
    | 'version'
    | 'draft'
    | 'transfer'
    | 'share'
    | 'export'
    | 'delete'

type ActionContract = {
    selector: string
    accessibleName: string
}

export class EditMeasureActionCenter {
    public static readonly trigger = EditMeasurePage.editMeasureButtonActionBtn
    public static readonly actions: Record<EditMeasureAction, ActionContract> = {
        review: { selector: EditMeasurePage.reviewMeasureActionBtn, accessibleName: 'Review Measure' },
        history: { selector: EditMeasurePage.viewHistoryActionBtn, accessibleName: 'View History' },
        humanReadable: { selector: EditMeasurePage.viewHRActionBtn, accessibleName: 'View Human Readable' },
        version: { selector: EditMeasurePage.editMeasureVersionActionBtn, accessibleName: 'Version Measure' },
        draft: { selector: EditMeasurePage.editMeasureDraftActionBtn, accessibleName: 'Draft Measure' },
        transfer: { selector: EditMeasurePage.transferMeasureActionBtn, accessibleName: 'Transfer Measure' },
        share: { selector: EditMeasurePage.shareMeasureActionBtn, accessibleName: 'Share or Unshare Measure' },
        export: { selector: EditMeasurePage.editMeasureExportActionBtn, accessibleName: 'Export Measure' },
        delete: { selector: EditMeasurePage.deleteMeasureBtn, accessibleName: 'Delete Measure' }
    }

    public static open(): void {
        cy.get(this.trigger)
            .scrollIntoView()
            .should('be.visible')
            .closest('button')
            .should('be.enabled')
            .then(($button) => $button[0].click())
    }

    public static triggerButton(): Cypress.Chainable<JQuery<HTMLButtonElement>> {
        return cy.get(this.trigger).closest('button')
    }

    public static actionButton(action: EditMeasureAction): Cypress.Chainable<JQuery<HTMLButtonElement>> {
        return cy.get(this.actions[action].selector).closest('button')
    }

    public static assertAccessibleName(action: EditMeasureAction): void {
        this.actionButton(action).should('have.attr', 'aria-label', this.actions[action].accessibleName)
    }

    public static assertHiddenActionsAreNotTabbable(): void {
        Object.values(this.actions).forEach((action) => {
            cy.get('body').then(($body) => {
                const $action = $body.find(action.selector).closest('button')
                expect($action.length, `${action.accessibleName} action when collapsed`).to.be.at.most(1)
                if ($action.length) {
                    expect($action.prop('tabIndex'), `${action.accessibleName} tab index`).to.be.lessThan(0)
                }
            })
        })
    }

    public static scanTrigger(): void {
        this.checkButton(this.triggerButton())
    }

    public static scanAction(action: EditMeasureAction): void {
        this.checkButton(this.actionButton(action))
    }

    private static checkButton(button: Cypress.Chainable<JQuery<HTMLButtonElement>>): void {
        button.then(($button) =>
            Accessibility.check($button[0], {
                runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
            })
        )
    }
}
