import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage, EditLibraryActions } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

type InitialReviewStatus = 'READY_FOR_REVIEW' | 'IN_PROGRESS'
type DisplayReviewStatus = 'Ready' | 'In Progress' | 'Complete'
type ReviewHistoryEvent = 'READY_FOR_REVIEW' | 'REVIEW_IN_PROGRESS' | 'REVIEW_COMPLETE'

// MAT-10191: Run in DEV, then skip before committing until LibraryReviewStatus
// persistence is available in TEST.
describe.skip('MAT-10191 Manage Review persistence for libraries', () => {
    let libraryName = ''

    const createLibraryInReview = (
        namePrefix: string,
        model: SupportedModels,
        initialStatus: InitialReviewStatus
    ): void => {
        const suffix = Date.now()
        libraryName = `${namePrefix}${suffix}`
        CQLLibraryPage.createLibraryAPI(libraryName, model, { libraryNumber: 0 })
        TestData.requestCqlLibraryReview(initialStatus, '', 0).its('status').should('eq', 201)
    }

    const saveManageReview = (): void => {
        TestData.readCqlLibraryId().then((libraryId) => {
            cy.intercept('PUT', `/api/cql-libraries/${libraryId}/review`).as('updateManageReview')
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

    const openManageReview = (): void => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibraryDetailsById()
        CQLLibraryPage.openReviewDialog()
    }

    const assertSavedStatus = (
        expectedStatus: DisplayReviewStatus,
        historyEvent: ReviewHistoryEvent,
        reviewerUser: string
    ): void => {
        CQLLibrariesPage.openLibraryDetailsById()
        CQLLibraryPage.assertReviewStatus(expectedStatus)
        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        CQLLibraryPage.assertLatestLibraryReviewHistory(historyEvent, reviewerUser)

        OktaLogin.releaseReviewer()
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.assertLibraryReviewStatus(0, expectedStatus)
        CQLLibrariesPage.openLibraryDetailsFromCurrentList()
        CQLLibraryPage.assertReviewStatus(expectedStatus)
    }

    beforeEach(() => {
        libraryName = ''
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()

        if (libraryName) {
            Utilities.deleteLibrary(undefined, false, 0)
        }
    })

    it('saves an assigned reviewer and In Progress status for a FHIR library', () => {
        createLibraryInReview('ManageReviewPersistenceFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        openManageReview()
        cy.then(() => {
            const reviewerUser = OktaLogin.getReviewerUser()
            TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                ManageReviewDialogPage.selectStatus('In Progress')
                saveManageReview()
                assertSavedStatus('In Progress', 'REVIEW_IN_PROGRESS', reviewerUser)
            })
        })
    })

    it('saves an assigned reviewer and Complete status for an In Progress QDM library', () => {
        createLibraryInReview('ManageReviewPersistenceQDM', SupportedModels.QDM, 'IN_PROGRESS')

        openManageReview()
        cy.then(() => {
            const reviewerUser = OktaLogin.getReviewerUser()
            TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                ManageReviewDialogPage.selectStatus('Complete')
                saveManageReview()
                assertSavedStatus('Complete', 'REVIEW_COMPLETE', reviewerUser)
            })
        })
    })

    it('saves an assigned reviewer and Ready status for an In Progress FHIR library', () => {
        createLibraryInReview('ManageReviewPersistenceReadyFHIR', SupportedModels.FHIR, 'IN_PROGRESS')

        openManageReview()
        cy.then(() => {
            const reviewerUser = OktaLogin.getReviewerUser()
            TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                ManageReviewDialogPage.selectStatus('Ready')
                saveManageReview()
                assertSavedStatus('Ready', 'READY_FOR_REVIEW', reviewerUser)
            })
        })
    })

    it('persists an assigned reviewer for a Ready QDM library', () => {
        createLibraryInReview('ManageReviewPersistenceReviewerOnlyQDM', SupportedModels.QDM, 'READY_FOR_REVIEW')

        openManageReview()
        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            saveManageReview()

            CQLLibrariesPage.openLibraryDetailsById()
            CQLLibraryPage.openReviewDialog()
            ManageReviewDialogPage.assertInitialState('-', 'Ready')
            ManageReviewDialogPage.assertReviewerSelected(reviewerDisplayName)
            ManageReviewDialogPage.closeWithX()
        })
    })
})
