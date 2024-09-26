export class Global {

    //dirty modal
    public static readonly dirtCheckModal = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-aa4ov7 react-draggable"]'
    public static readonly discardChangesBtn = '[data-testid="group-form-discard-btn"]'
    public static readonly discardChangesContinue = '[data-testid="discard-dialog-continue-button"]'
    public static readonly discardChangesConfirmationModal = '.MuiBox-root'
    public static readonly discardChangesConfirmationText = '.strong'
    public static readonly keepWorkingCancel = '[data-testid="discard-dialog-cancel-button"]'

    public static clickOnDiscardChanges(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.discardChangesContinue).click()
    }
    public static clickOnCancelChanges(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.keepWorkingCancel).click()
    }

    public static clickOnDirtyCheckDiscardChanges(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.discardChangesContinue).click()
    }
    public static clickOnDirtyCheckCancelChanges(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.keepWorkingCancel).click()
    }
    public static clickDiscardAndKeepWorking(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.discardChangesContinue).click()
    }

}
