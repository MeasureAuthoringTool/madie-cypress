import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10183: Enable when MeasureReviewStatus is available in TEST. Clicking Review is intentionally
// not asserted: MAT-10139 already defines that interaction as opening the
// review dialog, while MAT-10183 says it is out of scope and does nothing.
describe.skip('MAT-10183 Reviewer measure Review action', () => {
    beforeEach(() => {
        const suffix = Date.now()
        CreateMeasurePage.CreateMeasureAPI(
            `ReviewerActionReadyFHIR${suffix}`,
            `ReviewerActionReadyFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            `ReviewerActionInProgressQDM${suffix}`,
            `ReviewerActionInProgressQDMLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        CreateMeasurePage.CreateMeasureAPI(
            `ReviewerActionCompleteFHIR${suffix}`,
            `ReviewerActionCompleteFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            2
        )

        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)
        TestData.requestMeasureReview('IN_PROGRESS', '', 1).its('status').should('eq', 201)
        TestData.requestMeasureReview('COMPLETE', '', 2).its('status').should('eq', 201)
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
        Utilities.deleteMeasure(undefined, undefined, false, false, 2)
    })

    it('disables Review on All Reviews when no measure is selected', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()

        MeasuresPage.assertReviewActionDisabled()
    })

    it('disables Review on All Reviews when more than one measure is selected', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.selectMeasureForReview(1)

        MeasuresPage.assertReviewActionDisabled()
    })

    it('enables Review on All Reviews when exactly one measure is selected', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(0)

        MeasuresPage.assertReviewActionEnabled()
    })
    ;[
        ['READY_FOR_REVIEW', 0],
        ['IN_PROGRESS', 1],
        ['COMPLETE', 2]
    ].forEach(([reviewStatus, measureNumber]) => {
        it(`enables Review in Measure Detail for a reviewer without edit access when status is ${reviewStatus}`, () => {
            OktaLogin.ReviewerLogin()
            MeasuresPage.openMeasureDetailsById(measureNumber as number)

            EditMeasurePage.assertReviewActionEnabled()
        })
    })
})
