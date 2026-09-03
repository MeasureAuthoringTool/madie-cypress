import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10188: Proven in DEV. Enable when Library All Reviews View/Edit is available in TEST.
describe.skip('MAT-10188 All Reviews library View/Edit actions', () => {
    let createdLibraryCount = 0

    const createReviewLibrary = (namePrefix: string, model: SupportedModels, libraryNumber = createdLibraryCount): void => {
        const suffix = Date.now()
        CQLLibraryPage.createLibraryAPI(`${namePrefix}${suffix}`, model, { libraryNumber })
        TestData.requestCqlLibraryReview('READY_FOR_REVIEW', '', libraryNumber).its('status').should('eq', 201)
        createdLibraryCount = Math.max(createdLibraryCount, libraryNumber + 1)
    }

    const shareWithConfiguredReviewer = (libraryNumber = 0): void => {
        const reviewer = OktaLogin.getConfiguredReviewerUser()
        expect(reviewer, 'configured reviewer username').not.to.be.empty

        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, reviewer).its('status').should('eq', 200)
        })
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

    it('shows Edit in All Reviews for a reviewer-shared FHIR library', () => {
        createReviewLibrary('AllReviewsEditFHIRLibrary', SupportedModels.FHIR)
        shareWithConfiguredReviewer()
        OktaLogin.ReviewerLogin()

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.assertLibraryActionLabel('Edit')
    })

    it('shows View in All Reviews for an unshared QDM library', () => {
        createReviewLibrary('AllReviewsViewQDMLibrary', SupportedModels.QDM)
        OktaLogin.ReviewerLogin()

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.assertLibraryActionLabel('View')
    })

    it('opens a reviewer-shared FHIR library from All Reviews in edit mode', () => {
        createReviewLibrary('AllReviewsEditNavigationFHIRLibrary', SupportedModels.FHIR)
        shareWithConfiguredReviewer()
        OktaLogin.ReviewerLogin()

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.openLibraryFromCurrentListWithExpectedAction('Edit')
        CQLLibraryPage.assertLibraryDetailsMode('edit')
    })

    it('opens an unshared QDM library from All Reviews in view-only mode', () => {
        createReviewLibrary('AllReviewsViewNavigationQDMLibrary', SupportedModels.QDM)
        OktaLogin.ReviewerLogin()

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.openLibraryFromCurrentListWithExpectedAction('View')
        CQLLibraryPage.assertLibraryDetailsMode('view')
    })
})
