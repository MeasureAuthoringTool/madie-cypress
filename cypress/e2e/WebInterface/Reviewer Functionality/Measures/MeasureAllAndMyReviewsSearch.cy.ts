import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10161: Active for initial DEV proof. Change to describe.skip before committing for TEST.
describe.skip('MAT-10161 All Reviews and My Reviews search', () => {
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
        TestData.requestMeasureReview(reviewStatus, '', measureNumber).its('status').should('eq', 201)
        createdMeasureCount = Math.max(createdMeasureCount, measureNumber + 1)
    }

    const saveManageReview = (measureNumber: number): void => {
        TestData.readMeasureId(measureNumber).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('assignMyReviewsSearch')
            ManageReviewDialogPage.save()
            cy.wait('@assignMyReviewsSearch').its('response.statusCode').should('eq', 200)
        })

        cy.get(ManageReviewDialogPage.content).should('not.exist')
        Toasts.clearToast(
            ManageReviewDialogPage.successToast,
            'Review information has been saved successfully.',
            ManageReviewDialogPage.successToastCloseButton
        )
    }

    const assignToLoggedInReviewer = (measureNumber: number): void => {
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(measureNumber)
        MeasuresPage.openReviewDialog()
        cy.then(() => {
            TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                saveManageReview(measureNumber)
            })
        })
    }

    const createAllReviewsSearchRecords = (): void => {
        createReviewMeasure('AllReviewsSearchReadyStatusFHIR', SupportedModels.qiCore6, 'READY_FOR_REVIEW', 0)
        createReviewMeasure('AllReviewsSearchReadyNameInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS', 1)
    }

    const createAssignedMyReviewsSearchRecords = (): void => {
        createAllReviewsSearchRecords()
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)
        assignToLoggedInReviewer(1)
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

    it('shows the required Filter By options and Search field on All Reviews', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()

        MeasuresPage.assertReviewSearchControls()
    })

    it('shows the required Filter By options and Search field on My Reviews', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openMyReviewsTab()

        MeasuresPage.assertReviewSearchControls()
    })

    it('searches All Reviews across Measure and Review when no Filter By value is selected', () => {
        createAllReviewsSearchRecords()
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.clearFilter()
        MeasuresPage.searchMeasures('Ready')

        MeasuresPage.assertMeasureSearchRowContains(0, 'Ready')
        MeasuresPage.assertMeasureSearchRowContains(1, 'In Progress')
    })

    it('searches only the Review column on All Reviews when Review is selected', () => {
        createAllReviewsSearchRecords()
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectReviewFilter()
        MeasuresPage.searchMeasures('Ready')

        MeasuresPage.assertMeasureSearchRowContains(0, 'Ready')
        MeasuresPage.assertMeasureSearchRowAbsent(1)
    })

    it('searches My Reviews across Measure and Review when no Filter By value is selected', () => {
        createAssignedMyReviewsSearchRecords()
        MeasuresPage.clearFilter()
        MeasuresPage.searchMeasures('Ready')

        MeasuresPage.assertMeasureSearchRowContains(0, 'Ready')
        MeasuresPage.assertMeasureSearchRowContains(1, 'In Progress')
    })

    it('searches only the Review column on My Reviews when Review is selected', () => {
        createAssignedMyReviewsSearchRecords()
        MeasuresPage.selectReviewFilter()
        MeasuresPage.searchMeasures('Ready')

        MeasuresPage.assertMeasureSearchRowContains(0, 'Ready')
        MeasuresPage.assertMeasureSearchRowAbsent(1)
    })
})
