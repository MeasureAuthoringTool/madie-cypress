import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasureActions, EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { ReviewDialogPage } from '../../../../Shared/ReviewDialogPage'
import { TestData } from '../../../../Shared/TestData'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10415: Complete DEV validation before enabling when MeasureReviewStatus is available in TEST.
describe.skip('MAT-10415 Regular user clears measure review status', () => {
    beforeEach(() => {
        const suffix = Date.now()
        CreateMeasurePage.CreateMeasureAPI(
            `RegularReviewReadyFHIR${suffix}`,
            `RegularReviewReadyFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            0
        )
        CreateMeasurePage.CreateMeasureAPI(
            `RegularReviewInProgressFHIR${suffix}`,
            `RegularReviewInProgressFHIRLib${suffix}`,
            SupportedModels.qiCore6,
            undefined,
            1
        )
        CreateMeasurePage.CreateMeasureAPI(
            `RegularReviewCompleteQDM${suffix}`,
            `RegularReviewCompleteQDMLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            2
        )
        TestData.requestMeasureReview('READY_FOR_REVIEW', '', 0).its('status').should('eq', 201)
        TestData.requestMeasureReview('IN_PROGRESS', '', 1).its('status').should('eq', 201)
        TestData.requestMeasureReview('COMPLETE', '', 2).its('status').should('eq', 201)
        return TestData.readMeasureId(2).then((measureId) => {
            return TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
    })

    afterEach(() => {
        return OktaLogin.releaseReviewer()
            .then(() => {
                return Utilities.deleteMeasure(undefined, undefined, false, false, 0)
            })
            .then(() => {
                return Utilities.deleteMeasure(undefined, undefined, false, false, 1)
            })
            .then(() => {
                return Utilities.deleteMeasure(undefined, undefined, false, false, 2)
            })
    })

    it('removes Ready from an owned FHIR measure without confirmation', () => {
        OktaLogin.Login()
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.openReviewDialog()
        ReviewDialogPage.assertExistingReviewState()
        ReviewDialogPage.markAsNotReady()
        TestData.readMeasureId(0).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('clearReadyReview')
            ReviewDialogPage.save()
            cy.wait('@clearReadyReview').its('response.statusCode').should('eq', 200)
        })
        cy.contains('[role="dialog"]', 'Are you sure?').should('not.exist')
        ReviewDialogPage.assertSaveSuccess()
    })

    it('keeps an In Progress owned FHIR measure unchanged when the regular user cancels or closes removal', () => {
        OktaLogin.Login()
        MeasuresPage.selectMeasureForReview(1)
        MeasuresPage.openReviewDialog()
        ReviewDialogPage.assertExistingReviewState()
        ReviewDialogPage.markAsNotReady()
        ReviewDialogPage.save()
        ReviewDialogPage.assertRemovalConfirmation('In Progress')
        ReviewDialogPage.cancelRemovalConfirmation()
        ReviewDialogPage.assertExistingReviewState()
        ReviewDialogPage.save()
        ReviewDialogPage.assertRemovalConfirmation('In Progress')
        ReviewDialogPage.closeRemovalConfirmationWithX()
        ReviewDialogPage.closeWithCancel()
    })

    it('clears a Complete shared QDM measure review while retaining its reviewer assignment', () => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.selectMeasureForReview(2)
        MeasuresPage.openReviewDialog()
        ManageReviewDialogPage.selectFirstReviewerAndStoreName('assignedReviewer')
        ManageReviewDialogPage.save()
        cy.get(ManageReviewDialogPage.content).should('not.exist')

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        MeasuresPage.selectMeasureForReview(2)
        MeasuresPage.openReviewDialog()
        ReviewDialogPage.assertExistingReviewState()
        ReviewDialogPage.markAsNotReady()

        TestData.readMeasureId(2).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('clearReviewStatus')
            ReviewDialogPage.save()
            ReviewDialogPage.assertRemovalConfirmation('Complete')
            ReviewDialogPage.continueRemovalConfirmation()
            cy.wait('@clearReviewStatus').then(({ request, response }) => {
                expect(response?.statusCode).to.eq(200)
                expect(request.body).to.include({ status: 'NOT_READY_FOR_REVIEW' })
            })

            TestData.requestWithAccessToken<{ reviewers: Array<{ displayName: string }> }>({
                method: 'GET',
                url: `/api/measures/${measureId}/review`
            }).then((response) => {
                expect(response.status).to.eq(200)
                cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
                    expect(response.body.reviewers, 'persisted reviewers').to.deep.include({
                        displayName: assignedReviewer
                    })
                })
            })
        })

        MeasuresPage.assertMeasureReviewStatus(2, '-')
        MeasuresPage.openMeasureDetailsFromCurrentList(2)
        EditMeasurePage.actionCenter(EditMeasureActions.viewHistory)
        cy.get(MeasuresPage.userActionRow).should('contain.text', 'NOT_READY_FOR_REVIEW')
        cy.get(MeasuresPage.harpIdRow).should('contain.text', OktaLogin.getUser(true))
        cy.get(MeasuresPage.additionalActionContent).should('have.text', '-')
    })
})
