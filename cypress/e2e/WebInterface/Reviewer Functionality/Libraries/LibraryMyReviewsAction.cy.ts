import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage, EditLibraryActions } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10295: Proven in DEV. Enable when LibraryReviewStatus is available in TEST.
describe.skip('MAT-10295 My Reviews Review action for libraries', () => {
    let createdLibraryCount = 0

    const createReviewLibrary = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS',
        libraryNumber = createdLibraryCount
    ): void => {
        const suffix = Date.now()
        CQLLibraryPage.createLibraryAPI(`${namePrefix}${suffix}`, model, { libraryNumber })
        TestData.requestCqlLibraryReview(reviewStatus, '', libraryNumber).its('status').should('eq', 201)
        createdLibraryCount = Math.max(createdLibraryCount, libraryNumber + 1)
    }

    const openManageReviewFromAllReviews = (libraryNumber: number): void => {
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryRow(libraryNumber)
        CQLLibrariesPage.openReviewDialog()
        cy.get(ManageReviewDialogPage.content).should('be.visible')
    }

    const saveManageReview = (libraryNumber: number, assertSuccessToast = false): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            cy.intercept('PUT', `/api/cql-libraries/${libraryId}/review`).as('updateManageReview')
            ManageReviewDialogPage.save()
            cy.wait('@updateManageReview').its('response.statusCode').should('eq', 200)
        })

        if (assertSuccessToast) {
            Toasts.clearToast(
                ManageReviewDialogPage.successToast,
                'Review information has been saved successfully.',
                ManageReviewDialogPage.successToastCloseButton
            )
        }

        cy.get(ManageReviewDialogPage.content).should('not.exist')
    }

    const assignToLoggedInReviewer = (libraryNumber: number): void => {
        openManageReviewFromAllReviews(libraryNumber)
        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            saveManageReview(libraryNumber)
        })
    }

    const createAssignedMyReview = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS',
        libraryNumber = createdLibraryCount
    ): void => {
        createReviewLibrary(namePrefix, model, reviewStatus, libraryNumber)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(libraryNumber)
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
    }

    beforeEach(() => {
        createdLibraryCount = 0
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()
        for (let libraryNumber = 0; libraryNumber < createdLibraryCount; libraryNumber += 1) {
            Utilities.deleteLibrary(undefined, false, libraryNumber)
        }
    })

    it('disables Review on My Reviews when no library is selected', () => {
        createAssignedMyReview('MyReviewsActionNoSelectionFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        CQLLibrariesPage.assertReviewActionDisabled()
    })

    it('disables Review on My Reviews when more than one library is selected', () => {
        createReviewLibrary('MyReviewsActionReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW', 0)
        createReviewLibrary('MyReviewsActionInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS', 1)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)
        assignToLoggedInReviewer(1)
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.selectLibraryRow(1)

        CQLLibrariesPage.assertReviewActionDisabled()
    })

    it('enables Review on My Reviews when exactly one library is selected', () => {
        createAssignedMyReview('MyReviewsActionOneSelectionQDM', SupportedModels.QDM, 'READY_FOR_REVIEW')
        CQLLibrariesPage.selectLibraryRow(0)

        CQLLibrariesPage.assertReviewActionEnabled()
    })

    it('opens Manage Review from the My Reviews Review action', () => {
        createAssignedMyReview('MyReviewsActionDialogFHIR', SupportedModels.FHIR, 'IN_PROGRESS')
        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.openReviewDialog()

        ManageReviewDialogPage.assertInitialState('-', 'In Progress')
        ManageReviewDialogPage.closeWithX()
    })

    it('saves reviewer and status changes from My Reviews and records the library history event', () => {
        createAssignedMyReview('MyReviewsActionPersistenceQDM', SupportedModels.QDM, 'READY_FOR_REVIEW')
        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.openReviewDialog()

        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewerOtherThan(reviewerDisplayName)
            ManageReviewDialogPage.selectStatus('In Progress')
            saveManageReview(0, true)
        })

        CQLLibrariesPage.assertLibraryReviewStatus(0, 'In Progress')
        CQLLibrariesPage.openLibraryDetailsFromCurrentList(0)
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.then(() => {
            CQLLibraryPage.assertLatestLibraryReviewHistory('REVIEW_IN_PROGRESS', OktaLogin.getReviewerUser())
        })
    })
})
