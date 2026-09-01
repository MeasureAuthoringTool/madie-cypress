import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

type ReviewStatus = 'READY_FOR_REVIEW' | 'IN_PROGRESS'

// MAT-10190: Run in DEV, then skip before committing until LibraryReviewStatus
// is enabled in TEST. The Manage Review comment is read-only, so this suite
// verifies its developer-supplied value rather than attempting to edit it.
describe.skip('MAT-10190 Manage Review dialog for libraries', () => {
    const developerComment = 'Library developer comment for Manage Review'
    let createdLibraryNumber: number | undefined

    const createLibraryInReview = (
        namePrefix: string,
        model: SupportedModels,
        status: ReviewStatus,
        comment = developerComment
    ): void => {
        const suffix = Date.now()
        createdLibraryNumber = 0
        CQLLibraryPage.createLibraryAPI(`${namePrefix}${suffix}`, model, { libraryNumber: createdLibraryNumber })
        TestData.requestCqlLibraryReview(status, comment, createdLibraryNumber).its('status').should('eq', 201)
    }

    const openManageReviewFromAllReviews = (): void => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryRow()
        CQLLibrariesPage.openReviewDialog()
    }

    beforeEach(() => {
        createdLibraryNumber = undefined
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()

        if (createdLibraryNumber !== undefined) {
            Utilities.deleteLibrary(undefined, false, createdLibraryNumber)
        }
    })

    it('opens Manage Review from All Reviews and shows reviewer and status options', () => {
        createLibraryInReview('ManageReviewLibraryFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        openManageReviewFromAllReviews()

        ManageReviewDialogPage.assertInitialState(developerComment)
        ManageReviewDialogPage.assertReviewerOptionsAlphabetical()
        ManageReviewDialogPage.assertStatusOptions()
    })

    it('enables Save after selecting a reviewer', () => {
        createLibraryInReview('ManageReviewLibraryFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        openManageReviewFromAllReviews()

        ManageReviewDialogPage.selectFirstReviewer()
    })

    it('enables Save after changing Status', () => {
        createLibraryInReview('ManageReviewLibraryFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        openManageReviewFromAllReviews()

        ManageReviewDialogPage.selectStatus('In Progress')
    })

    it('closes Manage Review with the red close X without saving', () => {
        createLibraryInReview('ManageReviewLibraryFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        openManageReviewFromAllReviews()

        ManageReviewDialogPage.closeWithX()
    })

    it('closes Manage Review with Cancel without saving', () => {
        createLibraryInReview('ManageReviewLibraryFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        openManageReviewFromAllReviews()

        ManageReviewDialogPage.closeWithCancel()
    })

    it('shows - when the library developer supplied no comment', () => {
        createLibraryInReview('ManageReviewLibraryQDM', SupportedModels.QDM, 'IN_PROGRESS', '')

        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibraryDetailsById()
        CQLLibraryPage.openReviewDialog()

        ManageReviewDialogPage.assertInitialState('-', 'In Progress')
        ManageReviewDialogPage.closeWithX()
    })
})
