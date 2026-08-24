import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10153: Enable when LibraryReviewStatus is available in TEST.
describe.skip('MAT-10153 Library Review search', () => {
    let fhirReadyLibraryName = ''
    let qdmReadyLibraryName = ''
    let draftLibraryName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        fhirReadyLibraryName = `LibraryReviewSearchFHIR${uniqueSuffix}`
        qdmReadyLibraryName = `LibraryReviewSearchQDM${uniqueSuffix}`
        draftLibraryName = `LibraryReviewSearchDraft${uniqueSuffix}`

        CQLLibraryPage.createLibraryAPI(fhirReadyLibraryName, SupportedModels.FHIR, { libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(qdmReadyLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        CQLLibraryPage.createLibraryAPI(draftLibraryName, SupportedModels.FHIR, { libraryNumber: 2 })
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

    it('searches Ready across all columns and with the Review filter on Owned Libraries', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewFilterIsLastOption()
        CQLLibrariesPage.clearFilter()

        CQLLibrariesPage.searchLibraries('Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(0, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(1, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowAbsent(2)

        CQLLibrariesPage.selectReviewFilter()
        CQLLibrariesPage.searchLibraries('Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(0, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(1, 'Ready')
        CQLLibrariesPage.assertLibrarySearchRowAbsent(2)
    })

    it('searches Ready with the Review filter on Shared Libraries', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.selectReviewFilter()
        CQLLibrariesPage.searchLibraries('Ready')
        CQLLibrariesPage.assertLibrarySearchRowContains(1, 'Ready')
    })

    it('does not offer the Review filter on All Libraries', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewFilterAbsent()
    })
})
