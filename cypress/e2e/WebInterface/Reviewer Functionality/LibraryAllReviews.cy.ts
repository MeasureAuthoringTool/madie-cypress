import { CQLLibrariesPage } from '../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage } from '../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'

type ReviewLibrary = {
    id: string
    lastModifiedAt: string
}

// MAT-10186: Reviewer coverage is enabled for DEV validation. Confirm TEST
// availability separately before adding it to the TEST regression collection.
// The current service endpoint returns READY_FOR_REVIEW libraries only. MAT-10186
// also names In Progress and Complete; add those assertions when the endpoint
// returns them.
describe('MAT-10186 Library All Reviews', () => {
    let fhirLibraryName = ''
    let qdmLibraryName = ''

    beforeEach(() => {
        const suffix = Date.now()
        fhirLibraryName = `AllReviewsLibraryFHIR${suffix}`
        qdmLibraryName = `AllReviewsLibraryQDM${suffix}`

        CQLLibraryPage.createLibraryAPI(fhirLibraryName, SupportedModels.FHIR, { libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(qdmLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        TestData.requestCqlLibraryReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)
        TestData.requestCqlLibraryReview('READY_FOR_REVIEW', '', 1).its('status').should('eq', 201)
    })

    afterEach(() => {
        OktaLogin.releaseReviewer()
        Utilities.deleteLibrary(undefined, false, 0)
        Utilities.deleteLibrary(undefined, false, 1)
    })

    it('does not show All Reviews to a non-reviewer', () => {
        OktaLogin.Login()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.allReviewsTab).should('not.exist')
    })

    it('shows Ready QDM and FHIR libraries to a reviewer in Updated descending order', () => {
        cy.intercept('GET', '**/api/cql-libraries/reviews*').as('fetchReviewLibraries')
        OktaLogin.ReviewerLogin()
        CQLLibrariesPage.openLibrariesList()

        CQLLibrariesPage.assertAllReviewsTabCount()
        CQLLibrariesPage.assertAllReviewsTabFollowsAllLibraries()
        CQLLibrariesPage.openAllReviewsTab()

        cy.wait('@fetchReviewLibraries').then(({ response }) => {
            expect(response?.statusCode).to.eq(200)
            const reviewLibraries = response?.body as ReviewLibrary[]
            expect(reviewLibraries, 'review-library response').to.be.an('array')

            TestData.readCqlLibraryId(0).then((fhirLibraryId) => {
                TestData.readCqlLibraryId(1).then((qdmLibraryId) => {
                    const createdReviewLibraries = reviewLibraries.filter(({ id }) =>
                        [fhirLibraryId, qdmLibraryId].includes(id)
                    )
                    expect(createdReviewLibraries.map(({ id }) => id), 'created libraries in response').to.have.members([
                        fhirLibraryId,
                        qdmLibraryId
                    ])

                    const expectedOrder = [...createdReviewLibraries]
                        .sort((first, second) => second.lastModifiedAt.localeCompare(first.lastModifiedAt))
                        .map(({ id }) => id)

                    CQLLibrariesPage.assertLibrariesAppearInUpdatedDescendingOrder(expectedOrder)
                })
            })
        })

        CQLLibrariesPage.assertAllReviewsColumns()
        cy.contains(CQLLibrariesPage.libraryListRows, fhirLibraryName).should('contain.text', 'Ready')
        cy.contains(CQLLibrariesPage.libraryListRows, qdmLibraryName).should('contain.text', 'Ready')
    })
})
