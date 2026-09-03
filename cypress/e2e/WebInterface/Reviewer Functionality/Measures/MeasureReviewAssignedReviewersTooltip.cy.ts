import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { ManageReviewDialogPage } from '../../../../Shared/ManageReviewDialogPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestData } from '../../../../Shared/TestData'
import { Toasts } from '../../../../Shared/Toasts'
import { Utilities } from '../../../../Shared/Utilities'

// MAT-10194: Proven in DEV. Enable when assigned-reviewer tooltips are available in TEST.
describe.skip('MAT-10194 Measure review assigned-reviewer tooltips', () => {
    let measureName = ''
    let createdMeasure = false

    const createReviewMeasure = (model: SupportedModels, reviewStatus: 'READY_FOR_REVIEW' | 'IN_PROGRESS' | 'COMPLETE') => {
        const suffix = Date.now()
        measureName = `ReviewAssignedReviewersTooltipFHIR${suffix}`
        CreateMeasurePage.CreateMeasureAPI(
            measureName,
            `ReviewAssignedReviewersTooltipFHIRLib${suffix}`,
            model,
            undefined,
            0
        )
        createdMeasure = true
        TestData.requestMeasureReview(reviewStatus, '', 0).its('status').should('eq', 201)
    }

    const assignFirstReviewer = (): void => {
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.openReviewDialog()

        ManageReviewDialogPage.selectFirstReviewerAndStoreName('assignedReviewer')
        TestData.readMeasureId(0).then((measureId) => {
            cy.intercept('PUT', `/api/measures/${measureId}/review`).as('assignReviewer')
            ManageReviewDialogPage.save()
            cy.wait('@assignReviewer').its('response.statusCode').should('eq', 200)
        })

        cy.get(ManageReviewDialogPage.content).should('not.exist')
        Toasts.clearToast(
            ManageReviewDialogPage.successToast,
            'Review information has been saved successfully.',
            ManageReviewDialogPage.successToastCloseButton
        )
    }

    afterEach(() => {
        OktaLogin.releaseReviewer()
        if (createdMeasure) {
            Utilities.deleteMeasure(undefined, undefined, false, false, 0)
        }
        createdMeasure = false
    })

    it('shows the assigned reviewer when hovering over a Review value on All Reviews', () => {
        createReviewMeasure(SupportedModels.qiCore6, 'READY_FOR_REVIEW')
        assignFirstReviewer()

        MeasuresPage.openAllReviewsTab()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.hoverMeasureReviewStatus(0)
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            MeasuresPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
        MeasuresPage.clearMeasureReviewStatusHover(0)
    })

    it('shows the assigned reviewer when hovering over an In Progress Review value on Owned Measures', () => {
        createReviewMeasure(SupportedModels.QDM, 'IN_PROGRESS')
        assignFirstReviewer()

        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.hoverMeasureReviewStatus(0)
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            MeasuresPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
        MeasuresPage.clearMeasureReviewStatusHover(0)
    })

    it('shows the assigned reviewer when hovering over a Complete Review value on Shared Measures', () => {
        createReviewMeasure(SupportedModels.qiCore6, 'COMPLETE')
        TestData.readMeasureId(0).then((measureId) => {
            TestData.requestSharePermissions('measure', 'GRANT', measureId, OktaLogin.getUser(true))
                .its('status')
                .should('eq', 200)
        })
        assignFirstReviewer()

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.sharedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.hoverMeasureReviewStatus(0)
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            MeasuresPage.assertAssignedReviewerTooltip([assignedReviewer])
        })
        MeasuresPage.clearMeasureReviewStatusHover(0)
    })

    it('shows the logged-in reviewer when hovering over a Review value on My Reviews', () => {
        createReviewMeasure(SupportedModels.QDM, 'READY_FOR_REVIEW')
        OktaLogin.ReviewerLogin()
        MeasuresPage.openAllReviewsTab()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.selectMeasureForReview(0)
        MeasuresPage.openReviewDialog()

        cy.then(() => {
            TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                TestData.readMeasureId(0).then((measureId) => {
                    cy.intercept('PUT', `/api/measures/${measureId}/review`).as('assignLoggedInReviewer')
                    ManageReviewDialogPage.save()
                    cy.wait('@assignLoggedInReviewer').its('response.statusCode').should('eq', 200)
                })
                cy.get(ManageReviewDialogPage.content).should('not.exist')
                Toasts.clearToast(
                    ManageReviewDialogPage.successToast,
                    'Review information has been saved successfully.',
                    ManageReviewDialogPage.successToastCloseButton
                )
                MeasuresPage.openMyReviewsTab()
                MeasuresPage.searchForMeasureByName(measureName)
                MeasuresPage.hoverMeasureReviewStatus(0)
                MeasuresPage.assertAssignedReviewerTooltip([reviewerDisplayName])
                MeasuresPage.clearMeasureReviewStatusHover(0)
            })
        })
    })

    it('does not show a reviewer tooltip for an unmarked Review value', () => {
        const suffix = Date.now()
        measureName = `ReviewAssignedReviewersTooltipUnmarked${suffix}`
        CreateMeasurePage.CreateMeasureAPI(
            measureName,
            `ReviewAssignedReviewersTooltipUnmarkedLib${suffix}`,
            SupportedModels.QDM,
            undefined,
            0
        )
        createdMeasure = true

        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.hoverMeasureReviewStatus(0)
        MeasuresPage.assertReviewStatusTooltipAbsent()
        MeasuresPage.clearMeasureReviewStatusHover(0)
    })

    it('shows the assigned reviewer when hovering over Review Status in the Measure Detail header', () => {
        createReviewMeasure(SupportedModels.qiCore6, 'COMPLETE')
        assignFirstReviewer()

        OktaLogin.Login()
        cy.get(MeasuresPage.ownedMeasures).filter(':visible').first().click()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.openMeasureDetailsFromCurrentListInEditOrViewMode(0)
        EditMeasurePage.assertReviewStatus('Complete')
        EditMeasurePage.hoverReviewStatus()
        cy.get<string>('@assignedReviewer').then((assignedReviewer) => {
            EditMeasurePage.assertAssignedReviewerTooltip([assignedReviewer])
        })
    })
})
