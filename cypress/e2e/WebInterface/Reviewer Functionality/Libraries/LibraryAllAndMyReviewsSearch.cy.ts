import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10187: Proven in DEV. Enable when Library Reviews search is available in TEST.
describe.skip('MAT-10187 All Reviews and My Reviews library search', () => {
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

    const createAllReviewsSearchRecords = (): void => {
        createReviewLibrary('AllReviewsSearchStatusFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW', 0)
        createReviewLibrary('AllReviewsSearchLibraryReadyQDM', SupportedModels.QDM, 'IN_PROGRESS', 1)
    }

    const openAllReviewsAsReviewer = (): void => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
    }

    const saveReviewerAssignment = (libraryNumber: number): void => {
        TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
            cy.intercept('PUT', `/api/cql-libraries/${libraryId}/review`).as('assignMyReviewsSearch')
            ManageReviewDialogPage.save()
            cy.wait('@assignMyReviewsSearch').its('response.statusCode').should('eq', 200)
        })
        cy.get(ManageReviewDialogPage.content).should('not.exist')
    }

    const assignToLoggedInReviewer = (libraryNumber: number): void => {
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryRow(libraryNumber)
        CQLLibrariesPage.openReviewDialog()

        TestData.getAccountDisplayName('madietestuser1').then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            saveReviewerAssignment(libraryNumber)
        })
    }

    const createAssignedMyReviewsSearchRecords = (): void => {
        createAllReviewsSearchRecords()
        OktaLogin.ReviewerLogin()
        assignToLoggedInReviewer(0)
        assignToLoggedInReviewer(1)
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

    it('shows the required Filter By options and Search field on All Reviews', () => {
        openAllReviewsAsReviewer()

        CQLLibrariesPage.assertReviewSearchControls()
    })

    it('shows the required Filter By options and Search field on My Reviews', () => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openMyReviewsTab()

        CQLLibrariesPage.assertReviewSearchControls()
    })

    it('searches All Reviews across Library and Review when no Filter By value is selected', () => {
        createAllReviewsSearchRecords()
        openAllReviewsAsReviewer()
        CQLLibrariesPage.clearFilter()
        CQLLibrariesPage.searchLibraries('Ready')

        CQLLibrariesPage.assertLibrarySearchRowContains(0, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(1, 'In Progress')
    })

    it('searches only the Review column on All Reviews when Review is selected', () => {
        createAllReviewsSearchRecords()
        openAllReviewsAsReviewer()
        CQLLibrariesPage.selectReviewFilter()
        CQLLibrariesPage.searchLibraries('Ready')

        CQLLibrariesPage.assertLibrarySearchRowContains(0, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowAbsent(1)
    })

    it('searches My Reviews across Library and Review when no Filter By value is selected', () => {
        createAssignedMyReviewsSearchRecords()
        CQLLibrariesPage.clearFilter()
        CQLLibrariesPage.searchLibraries('Ready')

        CQLLibrariesPage.assertLibrarySearchRowContains(0, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(1, 'In Progress')
    })

    it('searches only the Review column on My Reviews when Review is selected', () => {
        createAssignedMyReviewsSearchRecords()
        CQLLibrariesPage.selectReviewFilter()
        CQLLibrariesPage.searchLibraries('Ready')

        CQLLibrariesPage.assertLibrarySearchRowContains(0, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowAbsent(1)
    })
})
