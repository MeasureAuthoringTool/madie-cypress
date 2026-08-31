
export class Toasts {

    public static readonly generalToast = '.toast'
    public static readonly successToast = '[data-testid="toast-success"]'
    public static readonly otherSuccessToast = '[data-testid="success-toast"]'
    public static readonly dangerToast = '[data-testid="toast-danger"]'
    public static readonly errorToast = '[data-testid="error-toast"]'
    public static readonly closeToastButton = '[data-testid="close-error-button"]'

    public static readonly errorOffsetText = 'Test case updated successfully with errors in JSONTimezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.'
    public static readonly warningOffsetText = 'Test case updated successfully with warnings in JSONTimezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.'
    public static readonly successOffsetText = 'Test case updated successfully!Timezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.'

    public static clearToast(toastSelector: string, expectedText: string): void {
        cy.get(toastSelector)
            .should('be.visible')
            .and('contain.text', expectedText)

        cy.get('body').then(($body) => {
            const $toastMessage = $body.find(toastSelector).filter(':visible')

            if (!$toastMessage.length) {
                return
            }

            const $closeButton = $toastMessage.closest(this.generalToast).find(this.closeToastButton).first()

            if ($closeButton.length) {
                cy.wrap($closeButton).click()
            }
        })

        cy.get('body').should(($body) => {
            expect($body.find(toastSelector).filter(':visible')).to.have.length(0)
        })
    }

}
