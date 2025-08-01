
export class Toasts {

    public static readonly generalToast = '.toast'
    public static readonly successToast = '[data-testid="toast-success"]'
    public static readonly otherSuccessToast = '[data-testid="success-toast"]'
    public static readonly dangerToast = '[data-testid="toast-danger"]'
    public static readonly errorToast = '[data-testid="error-toast"]'

    public static readonly errorOffsetText = 'Test case updated successfully with errors in JSONTimezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.'
    public static readonly warningOffsetText = 'Test case updated successfully with warnings in JSONTimezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.'

}