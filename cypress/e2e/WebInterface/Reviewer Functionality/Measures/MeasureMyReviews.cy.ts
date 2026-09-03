import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10192: Proven in DEV. Enable when My Reviews is available in TEST.
describe.skip('MAT-10192 My Reviews', () => {
    let createdMeasureCount = 0

    const createReviewMeasure = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE',
        measureNumber = createdMeasureCount
    ): void => {
        const suffix = Date.now()
        CreateMeasurePage.CreateMeasureAPI(
            `${namePrefix}${suffix}`,
            `${namePrefix}Lib${suffix}`,
            model,
            undefined,
            measureNumber
        )
        TestData.requestMeasureReview(reviewStatus, '', measureNumber).its('status').should('eq', 201)
        createdMeasureCount = Math.max(createdMeasureCount, measureNumber + 1)
    }

    const saveManageReview = (measureNumber: number): void => {
        TestData.readMeasureId(measureNumber).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('updateManageReview')
            ManageReviewDialogPage.save()
            cy.wait('@updateManageReview').its('response.statusCode').should('eq', 200)
        })

        cy.get(ManageReviewDialogPage.content).should('not.exist')
    }

    const openManageReviewFromAllReviews = (measureNumber: number): void => {
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(measureNumber)
        MeasuresPage.openReviewDialog()
    }

    const assignToLoggedInReviewer = (measureNumber: number): void => {
        openManageReviewFromAllReviews(measureNumber)
        cy.then(() => {
            TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                saveManageReview(measureNumber)
            })
        })
    }

    beforeEach(() => {
        createdMeasureCount = 0
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()
        for (let measureNumber = 0; measureNumber < createdMeasureCount; measureNumber += 1) {
            Utilities.deleteMeasure(undefined, undefined, false, false, measureNumber)
        }
    })

    it('does not show My Reviews to a non-reviewer', () => {
        OktaLogin.Login()

        cy.get(MeasuresPage.myReviewsTab).should('not.exist')
    })

    it('shows My Reviews after All Reviews with its result count to a reviewer', () => {
        OktaLogin.ReviewerLogin()

        MeasuresPage.assertMyReviewsTabCount()
        MeasuresPage.assertMyReviewsTabFollowsAllReviews()
    })

    it('shows the required columns on My Reviews', () => {
        OktaLogin.ReviewerLogin()

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMyReviewsColumns()
    })

    it('shows only the Review action-center icon on My Reviews', () => {
        OktaLogin.ReviewerLogin()

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMyReviewsActionCenterShowsOnlyReview()
    })

    it('shows a Ready FHIR measure assigned to the logged-in reviewer', () => {
        createReviewMeasure('MyReviewsReadyFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW')
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasureReviewStatus(0, 'Ready')
    })

    it('shows an In Progress QDM measure assigned to the logged-in reviewer', () => {
        createReviewMeasure('MyReviewsInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS')
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasureReviewStatus(0, 'In Progress')
    })

    it('sorts assigned Ready and In Progress measures by Updated date descending', () => {
        createReviewMeasure('MyReviewsReadyFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW', 0)
        createReviewMeasure('MyReviewsInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS', 1)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)
        assignToLoggedInReviewer(1)

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasuresAppearInUpdatedDescendingOrder([0, 1])
    })

    it('excludes a Complete measure assigned to the logged-in reviewer', () => {
        createReviewMeasure('MyReviewsCompleteFHIR', SupportedModels.qiCore6, 'COMPLETE')
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasureSearchRowAbsent(0)
    })

    it('excludes a Ready measure assigned to another reviewer', () => {
        createReviewMeasure('MyReviewsOtherReviewerQDM', SupportedModels.QDM, 'READY_FOR_REVIEW')
        OktaLogin.ReviewerLogin()
        openManageReviewFromAllReviews(0)

        cy.then(() => {
            TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewerOtherThan(reviewerDisplayName)
                saveManageReview(0)
            })
        })

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasureSearchRowAbsent(0)
    })
})
