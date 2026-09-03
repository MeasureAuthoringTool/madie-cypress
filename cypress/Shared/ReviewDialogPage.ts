export class ReviewDialogPage {
    public static readonly dialog = '[data-testid$="review-dialog"]'
    public static readonly content = '[data-testid$="review-dialog-content"]'
    public static readonly markReadySwitch = '[data-testid="review-dialog-mark-ready-switch"]'
    public static readonly commentsEditor = '[data-testid="review-comments-rich-text-editor-content"]'
    public static readonly saveButton = '[data-testid="review-dialog-save-button"]'
    public static readonly cancelButton = '[data-testid="review-dialog-cancel-button"]'
    public static readonly closeButton = '[data-testid="close-button"]'
    public static readonly successToast = '[data-testid="review-dialog-success-text"]'
    public static readonly successToastCloseButton = '[data-testid="review-dialog-toast-close-button"]'

    public static assertInitialState(title: string): void {
        cy.get(this.dialog).should('be.visible').and('contain.text', title)
        cy.get(this.content).should('contain.text', 'Mark as Ready').and('contain.text', 'Comments')
        cy.get(this.markReadySwitch).find('input[type="checkbox"]').should('not.be.checked')
        cy.get(this.cancelButton).should('be.visible').and('be.enabled')
        cy.get(this.saveButton).should('be.visible').and('be.disabled')
    }

    public static markAsReady(): void {
        cy.get(this.markReadySwitch).find('input[type="checkbox"]').should('not.be.checked').check()
        cy.get(this.saveButton).should('be.enabled')
    }

    public static markAsNotReady(): void {
        cy.get(this.markReadySwitch).find('input[type="checkbox"]').should('be.checked').uncheck()
        cy.get(this.saveButton).should('be.enabled')
    }

    public static enterComments(comments: string): void {
        cy.get(this.commentsEditor).should('be.visible').type(comments)
    }

    public static assertPersistedState(markedReady: boolean, comments: string): void {
        const stateAssertion = markedReady ? 'be.checked' : 'not.be.checked'
        cy.get(this.markReadySwitch).find('input[type="checkbox"]').should(stateAssertion)
        cy.get(this.commentsEditor).should('contain.text', comments)
    }

    public static save(): void {
        cy.get(this.saveButton).should('be.enabled').click()
    }

    public static assertSaveSuccess(): void {
        cy.get(this.dialog).should('not.exist')
        cy.get(this.successToast)
            .should('be.visible')
            .and('have.text', 'Review information has been saved successfully.')
        cy.get(this.successToastCloseButton).should('be.visible').click()
        cy.get(this.successToast).should('not.exist')
    }

    public static closeWithCancel(): void {
        cy.get(this.cancelButton).should('be.visible').click()
        cy.get(this.dialog).should('not.exist')
    }

    public static closeWithX(): void {
        cy.get(this.closeButton).should('be.visible').click()
        cy.get(this.dialog).should('not.exist')
    }
}
