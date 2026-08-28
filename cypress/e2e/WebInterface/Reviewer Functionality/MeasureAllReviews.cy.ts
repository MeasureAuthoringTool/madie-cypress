import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10160: Reviewer coverage is enabled for DEV validation. Confirm TEST
// availability separately before adding it to the TEST regression collection.
// MAT-10161 tracks a unique all-reviews-tab test ID; until then, the reviewer
// assertion uses the current all-measures-tab ID with its All Reviews label.
describe('MAT-10160 All Reviews', () => {
    beforeEach(() => {
        const suffix = Date.now()
        CreateMeasurePage.CreateMeasureAPI(
            `AllReviewsFHIR${suffix}`,
            `AllReviewsFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            `AllReviewsQDM${suffix}`,
            `AllReviewsQDMLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        CreateMeasurePage.CreateMeasureAPI(
            `AllReviewsComplete${suffix}`,
            `AllReviewsCompleteLib${suffix}`,
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

    it('does not show All Reviews to a non-reviewer', () => {
        OktaLogin.Login()
        cy.contains('All Reviews').should('not.exist')
    })

    it('shows All Reviews to a reviewer', () => {
        OktaLogin.ReviewerLogin()
        cy.get(MeasuresPage.allReviewsTab).should('be.visible').and('contain.text', 'All Reviews')
    })
})
