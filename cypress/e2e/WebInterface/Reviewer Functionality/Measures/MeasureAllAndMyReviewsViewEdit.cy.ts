import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

describe('MAT-10162 All Reviews and My Reviews View/Edit actions', () => {
    let createdMeasureCount = 0

    const createReviewMeasure = (namePrefix: string, model: SupportedModels, measureNumber = createdMeasureCount): void => {
        const suffix = Date.now()
        CreateMeasurePage.CreateMeasureAPI(
            `${namePrefix}${suffix}`,
            `${namePrefix}Lib${suffix}`,
            model,
            undefined,
            measureNumber
        )
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', measureNumber).its('status').should('eq', 201)
        createdMeasureCount = Math.max(createdMeasureCount, measureNumber + 1)
    }

    const shareWithConfiguredReviewer = (measureNumber = 0): void => {
        const reviewer = OktaLogin.getConfiguredReviewerUser()
        expect(reviewer, 'configured reviewer username').not.to.be.empty

        TestData.readMeasureId(measureNumber).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, reviewer)
                .its('status')
                .should('eq', 200)
        })
    }

    const saveReviewerAssignment = (measureNumber = 0): void => {
        TestData.readMeasureId(measureNumber).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('assignReviewer')
            ManageReviewDialogPage.save()
            cy.wait('@assignReviewer').its('response.statusCode').should('eq', 200)
        })
        cy.get(ManageReviewDialogPage.content).should('not.exist')
        Toasts.clearToast(
            ManageReviewDialogPage.successToast,
            'Review information has been saved successfully.',
            ManageReviewDialogPage.successToastCloseButton
        )
    }

    const assignToLoggedInReviewer = (measureNumber = 0): void => {
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(measureNumber)
        MeasuresPage.openReviewDialog()
        cy.then(() => {
            TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                saveReviewerAssignment(measureNumber)
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

    it('shows Edit in All Reviews for a reviewer-shared FHIR measure', () => {
        createReviewMeasure('AllReviewsEditFHIR', SupportedModels.qiCore6)
        shareWithConfiguredReviewer()
        OktaLogin.ReviewerLogin()

        MeasuresPage.openAllReviewsTab()
        MeasuresPage.assertMeasureActionLabel('Edit')
    })

    it('shows View in All Reviews for an unshared QDM measure', () => {
        createReviewMeasure('AllReviewsViewQDM', SupportedModels.QDM)
        OktaLogin.ReviewerLogin()

        MeasuresPage.openAllReviewsTab()
        MeasuresPage.assertMeasureActionLabel('View')
    })

    it('shows Edit in My Reviews for a reviewer-shared FHIR measure', () => {
        createReviewMeasure('MyReviewsEditFHIR', SupportedModels.qiCore6)
        shareWithConfiguredReviewer()
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer()

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasureActionLabel('Edit')
    })

    it('shows View in My Reviews for an unshared QDM measure', () => {
        createReviewMeasure('MyReviewsViewQDM', SupportedModels.QDM)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer()

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.assertMeasureActionLabel('View')
    })

    it('opens a reviewer-shared FHIR measure from All Reviews in edit mode', () => {
        createReviewMeasure('AllReviewsEditNavigationFHIR', SupportedModels.qiCore6)
        shareWithConfiguredReviewer()
        OktaLogin.ReviewerLogin()

        MeasuresPage.openAllReviewsTab()
        MeasuresPage.openMeasureFromCurrentListWithExpectedAction('Edit')
        EditMeasurePage.assertMeasureDetailsMode('edit')
    })

    it('opens an assigned unshared QDM measure from My Reviews in view-only mode', () => {
        createReviewMeasure('MyReviewsViewNavigationQDM', SupportedModels.QDM)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer()

        MeasuresPage.openMyReviewsTab()
        MeasuresPage.openMeasureFromCurrentListWithExpectedAction('View')
        EditMeasurePage.assertMeasureDetailsMode('view')
    })
})
