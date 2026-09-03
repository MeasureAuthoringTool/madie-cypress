import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10152: Enable when LibraryReviewStatus is available in TEST.
describe.skip('MAT-10152 Library Review column', () => {
    let libraryName = ''

    const createAndShareLibrary = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus?: 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE'
    ): void => {
        const suffix = Date.now()
        libraryName = `${namePrefix}${suffix}`
        CQLLibraryPage.createLibraryAPI(libraryName, model, { libraryNumber: 0 })

        if (reviewStatus) {
            TestData.requestCqlLibraryReview(reviewStatus, '', 0).its('status').should('eq', 201)
        }

        TestData.readCqlLibraryId().then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
    }

    beforeEach(() => {
        libraryName = ''
    })

    afterEach(() => {
        if (libraryName) {
            Utilities.deleteLibrary(undefined, false, 0)
        }
    })

    const assertReviewStatusOnOwnedLibraries = (status: 'Ready' | 'In Progress' | 'Complete' | '-') => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewColumnVisible()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.assertLibraryReviewStatus(0, status)
    }

    const assertReviewStatusOnSharedLibraries = (status: 'Ready' | 'In Progress' | 'Complete' | '-') => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewColumnVisible()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.assertLibraryReviewStatus(0, status)
    }

    it('shows Ready in the Review column on Owned Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')
        assertReviewStatusOnOwnedLibraries('Ready')
    })

    it('shows In Progress in the Review column on Owned Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS')
        assertReviewStatusOnOwnedLibraries('In Progress')
    })

    it('shows Complete in the Review column on Owned Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnCompleteFHIR', SupportedModels.FHIR, 'COMPLETE')
        assertReviewStatusOnOwnedLibraries('Complete')
    })

    it('shows - for an unmarked library in the Review column on Owned Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnUnmarkedQDM', SupportedModels.QDM)
        assertReviewStatusOnOwnedLibraries('-')
    })

    it('does not sort the Review column on Owned Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnNotSortableFHIR', SupportedModels.FHIR)
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.assertReviewColumnVisible()
        CQLLibrariesPage.assertReviewColumnIsNotSortable()
    })

    it('shows Ready in the Review column on Shared Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnReadyFHIR', SupportedModels.FHIR, 'READY_FOR_REVIEW')
        assertReviewStatusOnSharedLibraries('Ready')
    })

    it('shows In Progress in the Review column on Shared Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnInProgressQDM', SupportedModels.QDM, 'IN_PROGRESS')
        assertReviewStatusOnSharedLibraries('In Progress')
    })

    it('shows Complete in the Review column on Shared Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnCompleteFHIR', SupportedModels.FHIR, 'COMPLETE')
        assertReviewStatusOnSharedLibraries('Complete')
    })

    it('shows - for an unmarked library in the Review column on Shared Libraries', () => {
        createAndShareLibrary('LibraryReviewColumnUnmarkedQDM', SupportedModels.QDM)
        assertReviewStatusOnSharedLibraries('-')
    })

    it('does not show the Review column on All Libraries', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewColumnAbsent()
    })
})
