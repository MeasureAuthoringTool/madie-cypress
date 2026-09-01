import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasureActions, EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { ReviewDialogPage } from '../../../../Shared/ReviewDialogPage'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10140: Enable when MeasureReviewStatus persistence is available in TEST.
describe.skip('MAT-10140 Measure review persistence', () => {
    let ownedFhirMeasureName = ''
    let ownedQdmMeasureName = ''

    beforeEach(() => {
        const uniqueSuffix = Date.now()
        ownedFhirMeasureName = `ReviewPersistenceOwnerFHIR${uniqueSuffix}`
        ownedQdmMeasureName = `ReviewPersistenceOwnerQDM${uniqueSuffix}`

        CreateMeasurePage.CreateMeasureAPI(
            ownedFhirMeasureName,
            `ReviewPersistenceOwnerFHIRLib${uniqueSuffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            ownedQdmMeasureName,
            `ReviewPersistenceOwnerQDMLib${uniqueSuffix}`,
            SupportedModels.QDM,
            undefined,
            1
        )
        TestData.readMeasureId(0).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true)).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
        TestData.readMeasureId(1).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true)).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    })

    afterEach(() => {
        Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        Utilities.deleteMeasure(undefined, undefined, false, false, 1)
    })

    it('saves Ready review information and records READY_FOR_REVIEW for a FHIR measure', () => {
        const comments = 'FHIR measure is ready for review'

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', ownedFhirMeasureName)

        TestData.readMeasureId(0).then((measureId) => {
            cy.intercept('POST', `/api/measures/${measureId}/review`).as('createMeasureReview')
            MeasuresPage.openMeasureDetailsFromCurrentList(0)
            EditMeasurePage.openReviewDialog()
            ReviewDialogPage.assertInitialState('Mark Measure Ready for Review')
            ReviewDialogPage.enterComments(comments)
            ReviewDialogPage.markAsReady()
            ReviewDialogPage.save()

            cy.wait('@createMeasureReview').then(({ request, response }) => {
                expect(response?.statusCode).to.eq(201)
                expect(request.body).to.include({
                    measureId,
                    status: 'READY_FOR_REVIEW'
                })
            })
        })
        ReviewDialogPage.assertSaveSuccess()

        EditMeasurePage.openReviewDialog()
        ReviewDialogPage.assertPersistedState(true, comments)
        ReviewDialogPage.closeWithX()

        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'READY_FOR_REVIEW')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', OktaLogin.getUser(true))
        cy.get(MeasuresPage.additionalActionContent).should('have.text', '-')
    })

    it('saves a QDM measure as Not Ready and records NOT_READY_FOR_REVIEW', () => {
        const readyComments = 'QDM measure was ready'
        const updatedComments = 'QDM review needs more work'

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        cy.get(MeasuresPage.measureListTitles).should('be.visible').and('contain.text', ownedQdmMeasureName)

        TestData.readMeasureId(1).then((measureId) => {
            cy.intercept('POST', `/api/measures/${measureId}/review`).as('createMeasureReview')
            MeasuresPage.openMeasureDetailsFromCurrentList(1)
            EditMeasurePage.openReviewDialog()
            ReviewDialogPage.assertInitialState('Mark Measure Ready for Review')
            ReviewDialogPage.enterComments(readyComments)
            ReviewDialogPage.markAsReady()
            ReviewDialogPage.save()
            cy.wait('@createMeasureReview').its('response.statusCode').should('eq', 201)
        })
        ReviewDialogPage.assertSaveSuccess()

        TestData.readMeasureId(1).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('updateMeasureReview')
        })
        EditMeasurePage.openReviewDialog()
        ReviewDialogPage.assertPersistedState(true, readyComments)
        ReviewDialogPage.enterComments(updatedComments)
        ReviewDialogPage.markAsNotReady()
        ReviewDialogPage.save()
        cy.wait('@updateMeasureReview').then(({ request, response }) => {
            expect(response?.statusCode).to.eq(200)
            expect(request.body.status).to.eq('NOT_READY_FOR_REVIEW')
            expect(request.body.comment).to.contain(updatedComments)
        })
        ReviewDialogPage.assertSaveSuccess()

        EditMeasurePage.openReviewDialog()
        ReviewDialogPage.assertPersistedState(false, updatedComments)
        ReviewDialogPage.closeWithX()

        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'NOT_READY_FOR_REVIEW')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', OktaLogin.getUser(true))
        cy.get(MeasuresPage.additionalActionContent).should('have.text', '-')
        cy.get('[data-testid="measure-history-cell-1_actionType"]').should('contain.text', 'READY_FOR_REVIEW')
    })
})
