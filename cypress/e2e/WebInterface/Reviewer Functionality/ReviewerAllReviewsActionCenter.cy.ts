import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'

// MAT-10366: Enable when Reviewer functionality is available in TEST.
describe.skip('Reviewer All Reviews action center', () => {
    afterEach(() => {
        return OktaLogin.releaseReviewer()
    })

    it('shows only Review in the Measures All Reviews action center', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()

        MeasuresPage.assertReviewActionCenterShowsOnlyReview()
    })

    it('shows only Review in the Libraries All Reviews action center', () => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()

        CQLLibrariesPage.assertReviewActionCenterShowsOnlyReview()
    })
})
