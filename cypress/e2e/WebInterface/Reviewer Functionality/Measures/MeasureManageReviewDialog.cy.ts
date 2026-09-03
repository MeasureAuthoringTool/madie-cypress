import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10184: Proven in DEV; skipped until Manage Review is available in TEST.
// The current Manage Review comment is rendered read-only; this suite verifies
// the developer-supplied comment rather than entering a reviewer comment.
describe.skip('MAT-10184 Manage Review dialog', () => {
    const developerComment = 'Measure developer comment for Manage Review'

    const openManageReviewFromAllReviews = (): void => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.openReviewDialog()
    }

    beforeEach(() => {
        const suffix = Date.now()
        CreateMeasurePage.CreateMeasureAPI(
            `ManageReviewFHIR${suffix}`,
            `ManageReviewFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            `ManageReviewQDM${suffix}`,
            `ManageReviewQDMLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        TestData.requestMeasureReview('READY_FOR_REVIEW', developerComment, 0).its('status').should('eq', 201)
        TestData.requestMeasureReview('IN_PROGRESS', '', 1).its('status').should('eq', 201)
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()

        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('opens Manage Review from All Reviews and shows reviewer and status options', () => {
        openManageReviewFromAllReviews()

        ManageReviewDialogPage.assertInitialState(developerComment)
        ManageReviewDialogPage.assertReviewerOptionsAlphabetical()
        ManageReviewDialogPage.assertStatusOptions()
    })

    it('enables Save after selecting a reviewer', () => {
        openManageReviewFromAllReviews()

        ManageReviewDialogPage.selectFirstReviewer()
    })

    it('enables Save after changing Status', () => {
        openManageReviewFromAllReviews()

        ManageReviewDialogPage.selectStatus('In Progress')
    })

    it('closes Manage Review with the red close X without saving', () => {
        openManageReviewFromAllReviews()

        ManageReviewDialogPage.closeWithX()
    })

    it('closes Manage Review with Cancel without saving', () => {
        openManageReviewFromAllReviews()

        ManageReviewDialogPage.closeWithCancel()
    })

    it('shows - when the measure developer supplied no comment', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openMeasureDetailsById(1)
        EditMeasurePage.openReviewDialog()

        ManageReviewDialogPage.assertInitialState('-', 'In Progress')
        ManageReviewDialogPage.closeWithX()
    })
})
