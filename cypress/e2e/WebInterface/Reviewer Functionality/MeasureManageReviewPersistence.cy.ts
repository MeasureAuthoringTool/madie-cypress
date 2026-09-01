import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasureActions, EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { ManageReviewDialogPage } from '../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Toasts } from '../../../Shared/Toasts'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10185: Proven in DEV. Enable when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10185 Manage Review persistence', () => {
    let fhirMeasureName = ''
    let qdmMeasureName = ''
    let readyMeasureName = ''
    let reviewerOnlyMeasureName = ''

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

    const openAllReviewsManageReview = (measureNumber: number): void => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(measureNumber)
        MeasuresPage.openReviewDialog()
    }

    const assertSavedStatus = (
        measureNumber: number,
        measureName: string,
        status: 'Ready' | 'In Progress' | 'Complete',
        historyEvent: 'READY_FOR_REVIEW' | 'REVIEW_IN_PROGRESS' | 'REVIEW_COMPLETE'
    ): void => {
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.assertMeasureReviewStatus(measureNumber, status)
        MeasuresPage.openReviewMeasureDetailsFromCurrentList(measureNumber)
        EditMeasurePage.assertReviewStatus(status)
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.then(() => {
            MeasuresPage.assertLatestMeasureReviewHistory(historyEvent, OktaLogin.getReviewerUser())
        })
    }

    beforeEach(() => {
        const suffix = Date.now()
        fhirMeasureName = `ManageReviewPersistenceFHIR${suffix}`
        qdmMeasureName = `ManageReviewPersistenceQDM${suffix}`
        readyMeasureName = `ManageReviewPersistenceReadyFHIR${suffix}`
        reviewerOnlyMeasureName = `ManageReviewPersistenceReviewerOnlyQDM${suffix}`
        CreateMeasurePage.CreateMeasureAPI(
            fhirMeasureName,
            `ManageReviewPersistenceFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            qdmMeasureName,
            `ManageReviewPersistenceQDMLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        CreateMeasurePage.CreateMeasureAPI(
            readyMeasureName,
            `ManageReviewPersistenceReadyFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            2
        )
        CreateMeasurePage.CreateMeasureAPI(
            reviewerOnlyMeasureName,
            `ManageReviewPersistenceReviewerOnlyQDMLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            3
        )
        TestData.requestMeasureReview('READY_FOR_REVIEW', 'Developer review comment', 0).its('status').should('eq', 201)
        TestData.requestMeasureReview('IN_PROGRESS', '', 1).its('status').should('eq', 201)
        TestData.requestMeasureReview('IN_PROGRESS', '', 2).its('status').should('eq', 201)
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 3).its('status').should('eq', 201)
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
        Utilities.deleteMeasure(undefined, undefined, false, false, 2)
        Utilities.deleteMeasure(undefined, undefined, false, false, 3)
    })

    it('saves an assigned reviewer and In Progress status for a FHIR measure', () => {
        openAllReviewsManageReview(0)
        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            ManageReviewDialogPage.selectStatus('In Progress')
            saveManageReview(0)
        })

        assertSavedStatus(0, fhirMeasureName, 'In Progress', 'REVIEW_IN_PROGRESS')
    })

    it('saves an assigned reviewer and Complete for an In Progress QDM measure and records REVIEW_COMPLETE', () => {
        openAllReviewsManageReview(1)
        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            ManageReviewDialogPage.selectStatus('Complete')
            saveManageReview(1)
        })

        assertSavedStatus(1, qdmMeasureName, 'Complete', 'REVIEW_COMPLETE')
    })

    it('saves an assigned reviewer and Ready for an In Progress FHIR measure and records READY_FOR_REVIEW', () => {
        openAllReviewsManageReview(2)
        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            ManageReviewDialogPage.selectStatus('Ready')
            saveManageReview(2)
        })

        assertSavedStatus(2, readyMeasureName, 'Ready', 'READY_FOR_REVIEW')
    })

    it('persists an assigned reviewer for a Ready QDM measure', () => {
        openAllReviewsManageReview(3)
        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            saveManageReview(3)
            MeasuresPage.searchForMeasureByName(reviewerOnlyMeasureName)
            MeasuresPage.openReviewMeasureDetailsFromCurrentList(3)
            EditMeasurePage.openReviewDialog()
            ManageReviewDialogPage.assertInitialState('-', 'Ready')
            ManageReviewDialogPage.assertReviewerSelected(reviewerDisplayName)
            ManageReviewDialogPage.closeWithX()
        })
    })
})
