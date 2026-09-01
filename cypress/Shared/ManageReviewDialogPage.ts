export class ManageReviewDialogPage {
    public static readonly content = '[data-testid="manage-review-dialog-content"]'
    public static readonly closeButton = '[data-testid="close-button"]'
    public static readonly reviewerDropdownIcon = '[data-testid="ArrowDropDownIcon"]'
    public static readonly reviewersInput = '[data-testid="manage-review-reviewers-input"]'
    // The reviewer Autocomplete exposes the popup through the input's
    // aria-controls value, rather than applying a listbox role to its popper.
    public static readonly reviewerOptions = '#manage-review-reviewers-listbox li'
    public static readonly statusInput = '[data-testid="manage-review-status"]'
    public static readonly readyStatusOption = '[data-testid="manage-review-status-option-Ready"]'
    public static readonly inProgressStatusOption = '[data-testid="manage-review-status-option-In Progress"]'
    public static readonly completeStatusOption = '[data-testid="manage-review-status-option-Complete"]'
    public static readonly comment = '[data-testid="manage-review-comment"]'
    public static readonly saveButton = '[data-testid="manage-review-dialog-save-button"]'
    public static readonly cancelButton = '[data-testid="manage-review-dialog-cancel-button"]'
    public static readonly successToast = '[data-testid="manage-review-dialog-success-text"]'
    public static readonly successToastCloseButton = '[data-testid="manage-review-dialog-toast-close-button"]'

    public static assertInitialState(comment: string, status: 'Ready' | 'In Progress' | 'Complete' = 'Ready'): void {
        cy.get(this.content).should('be.visible')
        cy.get(this.content).closest('[role="dialog"]').should('contain.text', 'Manage Review')
        cy.get(this.closeButton).should('be.visible')
        cy.get(this.reviewersInput).should('be.visible')
        cy.get(this.statusInput).should('be.visible').and('contain.text', status)
        cy.get(this.comment).should('be.visible').and('contain.text', comment)
        cy.get(this.cancelButton).should('be.visible').and('be.enabled')
        cy.get(this.saveButton).should('be.visible').and('be.disabled')
    }

    public static openReviewerOptions(): void {
        cy.get(this.reviewersInput).should('be.visible').click()
        cy.get(this.reviewerOptions).should('have.length.at.least', 2)
    }

    public static assertReviewerOptionsAlphabetical(): void {
        this.openReviewerOptions()
        cy.get(this.reviewerOptions).then(($options) => {
            const reviewerNames = [...$options].map((option) => option.textContent?.trim() ?? '')
            const alphabeticalNames = [...reviewerNames].sort((first, second) => first.localeCompare(second))

            expect(reviewerNames, 'reviewer options').to.deep.equal(alphabeticalNames)
        })
    }

    public static selectFirstReviewer(): void {
        this.openReviewerOptions()
        cy.get(this.reviewerOptions).first().click()
        cy.get(this.saveButton).should('be.enabled')
    }

    public static selectReviewer(expectedDisplayName: string): void {
        this.openReviewerOptions()
        this.reviewerOption(expectedDisplayName).click()
        cy.get(this.saveButton).should('be.enabled')
        this.closeReviewerOptions()
    }

    public static assertReviewerSelected(expectedDisplayName: string): void {
        this.openReviewerOptions()
        this.reviewerOption(expectedDisplayName)
            .find('input[type="checkbox"]')
            .should('be.checked')
        this.closeReviewerOptions()
    }

    public static assertStatusOptions(): void {
        cy.get(this.statusInput).should('be.visible').click()
        cy.get(this.readyStatusOption).should('be.visible')
        cy.get(this.inProgressStatusOption).should('be.visible')
        cy.get(this.completeStatusOption).should('be.visible')
    }

    public static selectStatus(status: 'Ready' | 'In Progress' | 'Complete'): void {
        const option = {
            Ready: this.readyStatusOption,
            'In Progress': this.inProgressStatusOption,
            Complete: this.completeStatusOption
        }[status]

        cy.get(this.statusInput).should('be.visible').click()
        cy.get(option).filter(':visible').should('have.length', 1).click()
        cy.get(this.statusInput).should('contain.text', status)
        cy.get(this.saveButton).should('be.enabled')
    }

    public static save(): void {
        cy.get(this.saveButton).should('be.visible').and('be.enabled').click()
    }

    public static closeWithX(): void {
        cy.get(this.closeButton).should('be.visible').click()
        cy.get(this.content).should('not.exist')
    }

    public static closeWithCancel(): void {
        cy.get(this.cancelButton).should('be.visible').click()
        cy.get(this.content).should('not.exist')
    }

    private static reviewerOption(expectedDisplayName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(this.reviewerOptions).filter((_, option) => {
            return option.textContent?.trim() === expectedDisplayName
        }).should('have.length', 1)
    }

    private static closeReviewerOptions(): void {
        cy.get(this.reviewersInput).type('{esc}').should('have.attr', 'aria-expanded', 'false')
    }
}
