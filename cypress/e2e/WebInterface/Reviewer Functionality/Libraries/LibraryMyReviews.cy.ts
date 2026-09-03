import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10196: Proven in DEV. Enable when My Reviews is available in TEST.
describe.skip('MAT-10196 My Reviews libraries', () => {
    let createdLibraryCount = 0
    type DisplayReviewStatus = 'Ready' | 'In Progress' | 'Complete'

    const createLibraryInReview = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE',
        libraryNumber = createdLibraryCount
    ): void => {
        const suffix = Date.now()
        CQLLibraryPage.createLibraryAPI(`${namePrefix}${suffix}`, model, { libraryNumber })
        TestData.requestCqlLibraryReview(reviewStatus, '', libraryNumber).its('status').should('eq', 201)
        createdLibraryCount = Math.max(createdLibraryCount, libraryNumber + 1)
    }

    const saveReviewerAssignment = (libraryNumber: number): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            cy.intercept('PUT', `/api/cql-libraries/${libraryId}/review`).as('assignLibraryReviewer')
            ManageReviewDialogPage.save()
            cy.wait('@assignLibraryReviewer').its('response.statusCode').should('eq', 200)
        })
        cy.get(ManageReviewDialogPage.content).should('not.exist')
        Toasts.clearToast(
            ManageReviewDialogPage.successToast,
            'Review information has been saved successfully.',
            ManageReviewDialogPage.successToastCloseButton
        )
    }

    const getLoggedInReviewerDisplayName = (): Cypress.Chainable<string> => {
        // MAT-10191 uses this configured reviewer display name successfully in
        // the Manage Review multi-select. The login HARP ID is not the option text.
        return TestData.getAccountDisplayName('madietestuser1')
    }

    const openManageReviewForLibrary = (libraryNumber: number): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            cy.intercept('GET', `/api/cql-libraries/${libraryId}/review`).as('getLibraryReview')
            CQLLibrariesPage.openLibraryDetailsById(libraryNumber)
            cy.wait('@getLibraryReview').its('response.statusCode').should('eq', 200)
            CQLLibraryPage.openReviewDialog()
            cy.get(ManageReviewDialogPage.content).should('be.visible')
        })
    }

    const assignToLoggedInReviewer = (libraryNumber: number, status: DisplayReviewStatus): void => {
        openManageReviewForLibrary(libraryNumber)
        cy.then(() => {
            getLoggedInReviewerDisplayName().then((reviewerDisplayName) => {
                ManageReviewDialogPage.assertInitialState('-', status)
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                saveReviewerAssignment(libraryNumber)
            })
        })
    }

    const assignToAnotherReviewer = (libraryNumber: number, status: DisplayReviewStatus): void => {
        openManageReviewForLibrary(libraryNumber)
        cy.then(() => {
            getLoggedInReviewerDisplayName().then((reviewerDisplayName) => {
                ManageReviewDialogPage.assertInitialState('-', status)
                ManageReviewDialogPage.selectReviewerOtherThan(reviewerDisplayName)
                saveReviewerAssignment(libraryNumber)
            })
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

    it('does not show My Reviews to a non-reviewer', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()

        cy.get(CQLLibraryPage.myReviewsTab).should('not.exist')
    })

    it('shows My Reviews after All Reviews with its result count to a reviewer', () => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()

        CQLLibrariesPage.assertMyReviewsTabCount()
        CQLLibrariesPage.assertMyReviewsTabFollowsAllReviews()
    })

    it('shows the required columns on My Reviews', () => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()

        CQLLibrariesPage.assertMyReviewsColumns()
    })

    it('shows only the Review action-center icon on My Reviews', () => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()

        CQLLibrariesPage.assertMyReviewsActionCenterShowsOnlyReview()
    })

    it('shows an assigned Ready FHIR library on My Reviews', () => {
        createLibraryInReview('MyReviewsReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0, 'Ready')

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
        CQLLibrariesPage.assertLibraryReviewStatusById(0, 'Ready')
    })

    it('shows an assigned In Progress QDM library on My Reviews', () => {
        createLibraryInReview('MyReviewsInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS')
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0, 'In Progress')

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
        CQLLibrariesPage.assertLibraryReviewStatusById(0, 'In Progress')
    })

    it('excludes an assigned Complete FHIR library from My Reviews', () => {
        createLibraryInReview('MyReviewsCompleteFHIR', SupportedModels.FHIR, 'COMPLETE')
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0, 'Complete')

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
        CQLLibrariesPage.assertLibraryAbsentById(0)
    })

    it('excludes a Ready QDM library assigned to another reviewer from My Reviews', () => {
        createLibraryInReview('MyReviewsOtherReviewerQDM', SupportedModels.QDM, 'READY_FOR_REVIEW')
        OktaLogin.ReviewerLogin()
        assignToAnotherReviewer(0, 'Ready')

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
        CQLLibrariesPage.assertLibraryAbsentById(0)
    })

    it('sorts assigned Ready and In Progress libraries by Updated date descending', () => {
        createLibraryInReview('MyReviewsReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW', 0)
        createLibraryInReview('MyReviewsInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS', 1)
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0, 'Ready')
        assignToLoggedInReviewer(1, 'In Progress')

        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()
        TestData.readCqlLibraryId(0).then((readyLibraryId) => {
            TestData.readCqlLibraryId(1).then((inProgressLibraryId) => {
                CQLLibrariesPage.assertLibrariesAppearInUpdatedDescendingOrder([inProgressLibraryId, readyLibraryId])
            })
        })
    })
})
