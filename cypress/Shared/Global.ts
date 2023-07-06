export class Global {

    //dirty modal
    public static readonly dirtCheckModal = '[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-mbdu2s"]'
    public static readonly discardChangesBtn = '[data-testid="group-form-discard-btn"]'
    public static readonly discardChangesContinue = '[data-testid="discard-dialog-continue-button"]'
    public static readonly discardChangesConfirmationModal = '[class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-1qar6n9"]'
    public static readonly discardChangesConfirmationText = '[class="dialog-warning-body"]'
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

        cy.get(this.dirtCheckModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.discardChangesContinue).click()
    }
    public static clickOnDirtyCheckCancelChanges(): void {

        cy.get(this.dirtCheckModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.keepWorkingCancel).click()
    }
    public static clickDiscardAndKeepWorking(): void {

        cy.get(this.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(this.discardChangesConfirmationText).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(this.keepWorkingCancel).click()
    }

}
