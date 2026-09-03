import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasureActions, EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10294: Proven in DEV. Enable when My Reviews Review is available in TEST.
describe.skip('MAT-10294 My Reviews Review action', () => {
    let createdMeasureCount = 0

    const createReviewMeasure = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS',
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
        TestData.requestMeasureReview(reviewStatus, 'Developer review comment', measureNumber)
            .its('status')
            .should('eq', 201)
        createdMeasureCount = Math.max(createdMeasureCount, measureNumber + 1)
    }

    const openManageReviewFromAllReviews = (measureNumber: number): void => {
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(measureNumber)
        MeasuresPage.openReviewDialog()
    }

    const saveManageReview = (measureNumber: number): void => {
        TestData.readMeasureId(measureNumber).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('updateManageReview')
            ManageReviewDialogPage.save()
            cy.wait('@updateManageReview').its('response.statusCode').should('eq', 200)
        })

        cy.get(ManageReviewDialogPage.content).should('not.exist')
        Toasts.clearToast(
            ManageReviewDialogPage.successToast,
            'Review information has been saved successfully.',
            ManageReviewDialogPage.successToastCloseButton
        )
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

    const createAssignedMyReview = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS',
        measureNumber = createdMeasureCount
    ): void => {
        createReviewMeasure(namePrefix, model, reviewStatus, measureNumber)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(measureNumber)
        MeasuresPage.openMyReviewsTab()
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

    it('disables Review on My Reviews when no measure is selected', () => {
        createAssignedMyReview('MyReviewsActionNoSelectionFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW')

        MeasuresPage.assertReviewActionDisabled()
    })

    it('disables Review on My Reviews when more than one measure is selected', () => {
        createReviewMeasure('MyReviewsActionReadyFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW', 0)
        createReviewMeasure('MyReviewsActionInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS', 1)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)
        assignToLoggedInReviewer(1)
        MeasuresPage.openMyReviewsTab()
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.selectMeasureForReview(1)

        MeasuresPage.assertReviewActionDisabled()
    })

    it('enables Review on My Reviews when exactly one measure is selected', () => {
        createAssignedMyReview('MyReviewsActionOneSelectionFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW')
        MeasuresPage.selectMeasureForReview(0)

        MeasuresPage.assertReviewActionEnabled()
    })

    it('opens Manage Review from the My Reviews Review action', () => {
        createAssignedMyReview('MyReviewsActionDialogQDM', SupportedModels.QDM, 'IN_PROGRESS')
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.openReviewDialog()

        ManageReviewDialogPage.assertInitialState('Developer review comment', 'In Progress')
        ManageReviewDialogPage.closeWithX()
    })

    it('saves reviewer and status changes from My Reviews and records the history event', () => {
        createAssignedMyReview('MyReviewsActionPersistenceFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW')
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.openReviewDialog()

        cy.then(() => {
            TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewerOtherThan(reviewerDisplayName)
                ManageReviewDialogPage.selectStatus('In Progress')
                saveManageReview(0)
            })
        })

        MeasuresPage.assertMeasureReviewStatus(0, 'In Progress')
        MeasuresPage.openReviewMeasureDetailsFromCurrentList(0)
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.then(() => {
            MeasuresPage.assertLatestMeasureReviewHistory('REVIEW_IN_PROGRESS', OktaLogin.getReviewerUser())
        })
    })
})
