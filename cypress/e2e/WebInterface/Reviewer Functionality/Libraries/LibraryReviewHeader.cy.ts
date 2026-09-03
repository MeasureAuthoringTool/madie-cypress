import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10154: Enable when LibraryReviewStatus is available in TEST.
describe.skip('MAT-10154 Library Review Status header', () => {
    let readyFhirLibraryName = ''
    let readySharedQdmLibraryName = ''
    let notReadyQdmLibraryName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        readyFhirLibraryName = `LibraryReviewHeaderFHIR${uniqueSuffix}`
        readySharedQdmLibraryName = `LibraryReviewHeaderSharedQDM${uniqueSuffix}`
        notReadyQdmLibraryName = `LibraryReviewHeaderNotReadyQDM${uniqueSuffix}`

        CQLLibraryPage.createLibraryAPI(readyFhirLibraryName, SupportedModels.FHIR, { libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(readySharedQdmLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        CQLLibraryPage.createLibraryAPI(notReadyQdmLibraryName, SupportedModels.QDM, { libraryNumber: 2 })

        TestData.requestCqlLibraryReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)
        TestData.requestCqlLibraryReview('READY_FOR_REVIEW', '', 1).its('status').should('eq', 201)
        TestData.readCqlLibraryId(1).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
    })

    afterEach(() => {
        Utilities.deleteLibrary(undefined, false, 0)
        Utilities.deleteLibrary(undefined, false, 1)
        Utilities.deleteLibrary(undefined, false, 2)
    })

    it('shows Review Status: Ready for an owned FHIR library marked Ready', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(readyFhirLibraryName)

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(0)
        CQLLibraryPage.assertReviewStatusReady()
    })

    it('shows Review Status: Ready for a shared QDM library editor', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(readySharedQdmLibraryName)

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(1)
        CQLLibraryPage.assertReviewStatusReady()
    })

    it('does not show Review Status for an owned QDM library not marked Ready', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(notReadyQdmLibraryName)

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(2)
        CQLLibraryPage.assertReviewStatusAbsent()
    })

    it('does not show Review Status for a Ready library without edit access', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(readyFhirLibraryName)

        CQLLibrariesPage.openLibraryDetailsFromCurrentList(0)
        CQLLibraryPage.assertReviewStatusAbsent()
    })
})

// MAT-10191: Enable when LibraryReviewStatus persistence is available in TEST.
describe.skip('MAT-10191 Library Review Status header updates', () => {
    let libraryName = ''

    const createLibraryWithReviewStatus = (
        namePrefix: string,
        model: SupportedModels,
        reviewStatus: 'IN_PROGRESS' | 'COMPLETE'
    ): void => {
        const suffix = Date.now()
        libraryName = `${namePrefix}${suffix}`
        CQLLibraryPage.createLibraryAPI(libraryName, model, { libraryNumber: 0 })
        TestData.requestCqlLibraryReview(reviewStatus, '', 0).its('status').should('eq', 201)
    }

    beforeEach(() => {
        libraryName = ''
    })

    afterEach(() => {
        if (libraryName) {
            Utilities.deleteLibrary(undefined, false, 0)
        }
    })

    it('shows Review Status: In Progress for an owned FHIR library', () => {
        createLibraryWithReviewStatus('LibraryReviewHeaderInProgressFHIR', SupportedModels.FHIR, 'IN_PROGRESS')

        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.openLibraryDetailsFromCurrentList()
        CQLLibraryPage.assertReviewStatus('In Progress')
    })

    it('shows Review Status: Complete for an owned QDM library', () => {
        createLibraryWithReviewStatus('LibraryReviewHeaderCompleteQDM', SupportedModels.QDM, 'COMPLETE')

        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.openLibraryDetailsFromCurrentList()
        CQLLibraryPage.assertReviewStatus('Complete')
    })

    it('does not show Review Status: In Progress to a user without edit access or the reviewer role', () => {
        createLibraryWithReviewStatus('LibraryReviewHeaderNonEditorInProgressFHIR', SupportedModels.FHIR, 'IN_PROGRESS')

        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.openLibraryDetailsFromCurrentList()
        CQLLibraryPage.assertReviewStatusAbsent()
    })

    it('does not show Review Status: Complete to a user without edit access or the reviewer role', () => {
        createLibraryWithReviewStatus('LibraryReviewHeaderNonEditorCompleteQDM', SupportedModels.QDM, 'COMPLETE')

        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(libraryName)
        CQLLibrariesPage.openLibraryDetailsFromCurrentList()
        CQLLibraryPage.assertReviewStatusAbsent()
    })
})
