import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

// MAT-10153: Enable when LibraryReviewStatus is available in TEST.
describe.skip('MAT-10153 Library Review column', () => {
    let fhirLibraryName = ''
    let qdmLibraryName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        fhirLibraryName = `LibraryReviewColumnFHIR${uniqueSuffix}`
        qdmLibraryName = `LibraryReviewColumnQDM${uniqueSuffix}`

        CQLLibraryPage.createLibraryAPI(fhirLibraryName, SupportedModels.FHIR, { libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(qdmLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        TestData.requestCqlLibraryReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)

        const libraryNumbers = [0, 1]
        libraryNumbers.forEach((libraryNumber) => {
            TestData.readCqlLibraryId(libraryNumber).then((libraryId) => {
                TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true))
                    .its('status')
                    .should('eq', 200)
            })
        })
    })

    afterEach(() => {
        Utilities.deleteLibrary(undefined, false, 0)
        Utilities.deleteLibrary(undefined, false, 1)
    })

    it('shows Ready and - in the Review column on Owned Libraries', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.ownedLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewColumnVisible()
        CQLLibrariesPage.assertReviewColumnIsNotSortable()

        CQLLibrariesPage.searchForLibraryByName(fhirLibraryName)
        cy.get(CQLLibrariesPage.reviewStatusCell()).should('have.text', 'Ready')

        CQLLibrariesPage.searchForLibraryByName(qdmLibraryName)
        cy.get(CQLLibrariesPage.reviewStatusCell()).should('have.text', '-')
    })

    it('shows Ready and - in the Review column on Shared Libraries', () => {
        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewColumnVisible()

        CQLLibrariesPage.searchForLibraryByName(fhirLibraryName)
        cy.get(CQLLibrariesPage.reviewStatusCell()).should('have.text', 'Ready')

        CQLLibrariesPage.searchForLibraryByName(qdmLibraryName)
        cy.get(CQLLibrariesPage.reviewStatusCell()).should('have.text', '-')
    })

    it('does not show the Review column on All Libraries', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allLibrariesTab).filter(':visible').first().click()

        CQLLibrariesPage.assertReviewColumnAbsent()
    })
})
