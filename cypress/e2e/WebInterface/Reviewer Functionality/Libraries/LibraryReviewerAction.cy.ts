import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

type ReviewerLibraryStatus = 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE'

// MAT-10189: Run in DEV, then skip before committing until LibraryReviewStatus
// is enabled in TEST.
describe.skip('MAT-10189 Reviewer library Review action', () => {
    const createdLibraryNumbers: number[] = []

    const createReviewLibrary = (
        namePrefix: string,
        model: SupportedModels,
        status: ReviewerLibraryStatus,
        libraryNumber = 0
    ): void => {
        const suffix = Date.now()
        createdLibraryNumbers.push(libraryNumber)
        CQLLibraryPage.createLibraryAPI(`${namePrefix}${suffix}`, model, { libraryNumber })
        TestData.requestCqlLibraryReview(status, '', libraryNumber).its('status').should('eq', 201)
    }

    beforeEach(() => {
        createdLibraryNumbers.length = 0
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()
        createdLibraryNumbers.forEach((libraryNumber) => {
            Utilities.deleteLibrary(undefined, false, libraryNumber)
        })
    })

    it('disables Review on All Reviews when no library is selected', () => {
        createReviewLibrary('ReviewerLibraryActionReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.assertReviewActionDisabled()
    })

    it('disables Review on All Reviews when more than one library is selected', () => {
        createReviewLibrary('ReviewerLibraryActionReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW', 0)
        createReviewLibrary('ReviewerLibraryActionReadyQDM', SupportedModels.QDM, 'READY_FOR_REVIEW', 1)

        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.selectLibraryRow(1)
        CQLLibrariesPage.assertReviewActionDisabled()
    })

    it('enables Review on All Reviews when exactly one library is selected', () => {
        createReviewLibrary('ReviewerLibraryActionReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')

        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryRow(0)
        CQLLibrariesPage.assertReviewActionEnabled()
    })

    ;[
        ['READY_FOR_REVIEW', SupportedModels.FHIR],
        ['IN_PROGRESS', SupportedModels.QDM],
        ['COMPLETE', SupportedModels.FHIR]
    ].forEach(([reviewStatus, model]) => {
        it(`enables Review in Library Detail for a reviewer without edit access when status is ${reviewStatus}`, () => {
            createReviewLibrary(
                `ReviewerLibraryAction${reviewStatus}`,
                model as SupportedModels,
                reviewStatus as ReviewerLibraryStatus
            )

            OktaLogin.ReviewerLogin()
            CQLLibrariesPage.openLibraryDetailsById()
            CQLLibraryPage.assertReviewActionEnabled()
        })
    })
})
