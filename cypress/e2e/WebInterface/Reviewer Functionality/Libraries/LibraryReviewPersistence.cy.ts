import { CQLLibrariesPage } from '../../../../Shared/CQLLibrariesPage'
import { CQLLibraryPage, EditLibraryActions } from '../../../../Shared/CQLLibraryPage'
import { SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { ReviewDialogPage } from '../../../../Shared/ReviewDialogPage'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10151: Enable when LibraryReviewStatus persistence is available in TEST.
describe.skip('MAT-10151 Library review persistence', () => {
    let ownedFhirLibraryName = ''
    let ownedQdmLibraryName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        ownedFhirLibraryName = `ReviewPersistenceOwnerFHIRLibrary${uniqueSuffix}`
        ownedQdmLibraryName = `ReviewPersistenceOwnerQDMLibrary${uniqueSuffix}`

        CQLLibraryPage.createLibraryAPI(ownedFhirLibraryName, SupportedModels.FHIR, { libraryNumber: 0 })
        CQLLibraryPage.createLibraryAPI(ownedQdmLibraryName, SupportedModels.QDM, { libraryNumber: 1 })
        TestData.readCqlLibraryId(0).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true)).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
        TestData.readCqlLibraryId(1).then((libraryId) => {
            TestData.requestSharePermissions('library', 'GRANT', libraryId, OktaLogin.getUser(true)).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    })

    afterEach(() => {
        Utilities.deleteLibrary(undefined, false, 0)
        Utilities.deleteLibrary(undefined, false, 1)
    })

    it('saves Ready review information and records READY_FOR_REVIEW for a FHIR library', () => {
        const comments = 'FHIR library is ready for review'

        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(ownedFhirLibraryName)

        TestData.readCqlLibraryId(0).then((libraryId) => {
            cy.intercept('POST', `/api/cql-libraries/${libraryId}/review`).as('createLibraryReview')
            CQLLibrariesPage.openLibraryDetailsFromCurrentList(0)
            CQLLibraryPage.openReviewDialog()
            ReviewDialogPage.assertInitialState('Mark Library Ready for Review')
            ReviewDialogPage.enterComments(comments)
            ReviewDialogPage.markAsReady()
            ReviewDialogPage.save()

            cy.wait('@createLibraryReview').then(({ request, response }) => {
                expect(response?.statusCode).to.eq(201)
                expect(request.body).to.include({
                    libraryId,
                    status: 'READY_FOR_REVIEW'
                })
            })
        })
        ReviewDialogPage.assertSaveSuccess()

        CQLLibraryPage.openReviewDialog()
        ReviewDialogPage.assertPersistedState(true, comments)
        ReviewDialogPage.closeWithX()

        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get(CQLLibraryPage.libraryHistoryActionType(0)).should('contain.text', 'READY_FOR_REVIEW')
        cy.get(CQLLibraryPage.libraryHistoryPerformedBy(0)).should('contain.text', OktaLogin.getUser(true))
        cy.get(CQLLibraryPage.libraryHistoryAdditionalInfo(0)).should('have.text', '-')
    })

    it('saves a QDM library as Not Ready and records NOT_READY_FOR_REVIEW', () => {
        const readyComments = 'QDM library was ready'
        const updatedComments = 'QDM library review needs more work'

        OktaLogin.AltLogin()
        CQLLibrariesPage.openLibrariesList()
        cy.get(CQLLibraryPage.sharedLibrariesTab).filter(':visible').first().click()
        CQLLibrariesPage.searchForLibraryByName(ownedQdmLibraryName)

        TestData.readCqlLibraryId(1).then((libraryId) => {
            cy.intercept('POST', `/api/cql-libraries/${libraryId}/review`).as('createLibraryReview')
            CQLLibrariesPage.openLibraryDetailsFromCurrentList(1)
            CQLLibraryPage.openReviewDialog()
            ReviewDialogPage.assertInitialState('Mark Library Ready for Review')
            ReviewDialogPage.enterComments(readyComments)
            ReviewDialogPage.markAsReady()
            ReviewDialogPage.save()
            cy.wait('@createLibraryReview').its('response.statusCode').should('eq', 201)
        })
        ReviewDialogPage.assertSaveSuccess()

        TestData.readCqlLibraryId(1).then((libraryId) => {
            cy.intercept('PUT', `/api/cql-libraries/${libraryId}/review`).as('updateLibraryReview')
        })
        CQLLibraryPage.openReviewDialog()
        ReviewDialogPage.assertPersistedState(true, readyComments)
        ReviewDialogPage.enterComments(updatedComments)
        ReviewDialogPage.markAsNotReady()
        ReviewDialogPage.save()
        cy.wait('@updateLibraryReview').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.body.status).to.eq('NOT_READY_FOR_REVIEW')
            expect(request.body.comment).to.contain(updatedComments)
        })
        ReviewDialogPage.assertSaveSuccess()

        CQLLibraryPage.openReviewDialog()
        ReviewDialogPage.assertPersistedState(false, updatedComments)
        ReviewDialogPage.closeWithX()

        CQLLibraryPage.actionCenter(EditLibraryActions.viewHistory)
        cy.get(CQLLibraryPage.libraryHistoryActionType(0)).should('contain.text', 'NOT_READY_FOR_REVIEW')
        cy.get(CQLLibraryPage.libraryHistoryPerformedBy(0)).should('contain.text', OktaLogin.getUser(true))
        cy.get(CQLLibraryPage.libraryHistoryAdditionalInfo(0)).should('have.text', '-')
        cy.get(CQLLibraryPage.libraryHistoryActionType(1)).should('contain.text', 'READY_FOR_REVIEW')
    })
})
