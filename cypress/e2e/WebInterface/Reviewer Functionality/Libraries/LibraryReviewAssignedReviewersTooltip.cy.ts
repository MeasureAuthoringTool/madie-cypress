import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10197: Proven in DEV. Enable when assigned-reviewer tooltips are available in TEST.
describe.skip('MAT-10197 Library review assigned-reviewer tooltips', () => {
    let libraryName = ''
    let createdLibrary = false

    const createReviewLibrary = (
        model: SupportedModels,
        reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE'
    ): void => {
        const suffix = Date.now()
        libraryName = `ReviewAssignedReviewersTooltipLibrary${suffix}`
        CQLLibraryPage.createLibraryAPI(libraryName, model, { libraryNumber: 0 })
        createdLibrary = true
        TestData.requestCqlLibraryReview(reviewStatus, '', 0).its('status').should('eq', 201)
    }

    const saveReviewerAssignment = (): void => {
        TestData.readCqlLibraryId(0).then((libraryId) => {
            cy.intercept('PUT', `/api/cql-libraries/${libraryId}/review`).as('assignLibraryReviewer')
            ManageReviewDialogPage.save()
            cy.wait('@assignLibraryReviewer').its('response.statusCode').should('eq', 200)
        })
        cy.get(ManageReviewDialogPage.content).should('not.exist')
    }

    const assignFirstReviewer = (): void => {
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryByName(libraryName)
        CQLLibrariesPage.openReviewDialog()

        ManageReviewDialogPage.selectFirstReviewerAndStoreName('assignedReviewer')
        saveReviewerAssignment()
    }

    afterEach(() => {
        OktaLogin.releaseReviewer()
        if (createdLibrary) {
            Utilities.deleteLibrary(undefined, false, 0)
        }
        createdLibrary = false
    })

    it('shows the assigned reviewer when hovering over a Review value on All Reviews', () => {
        createReviewLibrary(SupportedModels.FHIR, 'READY_FOR_REVIEW')
        assignFirstReviewer()

        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.hoverLibraryReviewStatus()
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            CQLLibrariesPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
        CQLLibrariesPage.clearLibraryReviewStatusHover()
    })

    it('shows the assigned reviewer when hovering over an In Progress Review value on Owned Libraries', () => {
        createReviewLibrary(SupportedModels.QDM, 'IN_PROGRESS')
        assignFirstReviewer()

        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.hoverLibraryReviewStatus()
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            CQLLibrariesPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
        CQLLibrariesPage.clearLibraryReviewStatusHover()
    })

    it('shows the assigned reviewer when hovering over a Complete Review value on Shared Libraries', () => {
        createReviewLibrary(SupportedModels.FHIR, 'COMPLETE')
        TestData.readCqlLibraryId(0).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
        assignFirstReviewer()

        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.hoverLibraryReviewStatus()
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            CQLLibrariesPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
        CQLLibrariesPage.clearLibraryReviewStatusHover()
    })

    it('shows the logged-in reviewer when hovering over a Review value on My Reviews', () => {
        createReviewLibrary(SupportedModels.QDM, 'READY_FOR_REVIEW')
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.openAllReviewsTab()
        CQLLibrariesPage.selectLibraryByName(libraryName)
        CQLLibrariesPage.openReviewDialog()

        cy.then(() => TestData.getAccountDisplayName(OktaLogin.getReviewerUser())).then((reviewerDisplayName) => {
            ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
            saveReviewerAssignment()
            CQLLibrariesPage.openMyReviewsTab()
            CQLLibrariesPage.searchForLibraryByName(libraryName)
            CQLLibrariesPage.hoverLibraryReviewStatus()
            CQLLibrariesPage.assertAssignedReviewerTooltip([reviewerDisplayName])
            CQLLibrariesPage.clearLibraryReviewStatusHover()
        })
    })

    it('does not show a reviewer tooltip for an unmarked Review value', () => {
        const suffix = Date.now()
        libraryName = `ReviewAssignedReviewersTooltipUnmarked${suffix}`
        CQLLibraryPage.createLibraryAPI(libraryName, SupportedModels.QDM, { libraryNumber: 0 })
        createdLibrary = true

        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.hoverLibraryReviewStatus()
        CQLLibrariesPage.assertReviewStatusTooltipAbsent()
        CQLLibrariesPage.clearLibraryReviewStatusHover()
    })

    it('shows the assigned reviewer when hovering over Review Status in the Library Detail header', () => {
        createReviewLibrary(SupportedModels.FHIR, 'COMPLETE')
        assignFirstReviewer()

        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.openLibraryDetailsFromCurrentList()
        CQLLibraryPage.assertReviewStatus('Complete')
        CQLLibraryPage.hoverReviewStatus()
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            CQLLibraryPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
    })
})
