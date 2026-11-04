import { Accessibility } from '../../../support/accessibility'
import { EditMeasureActionCenter, EditMeasureAction } from '../../../Shared/EditMeasureActionCenter'
import { Header } from '../../../Shared/Header'
import { ManageReviewDialogPage } from '../../../Shared/ManageReviewDialogPage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { Toasts } from '../../../Shared/Toasts'
import { step } from '../../../utils/step'

type MeasureState = 'draft' | 'versioned'

const actionOrder = (measureState: MeasureState, includesReview = false): EditMeasureAction[] => [
    ...(includesReview ? (['review'] as EditMeasureAction[]) : []),
    'history',
    'humanReadable',
    measureState === 'draft' ? 'version' : 'draft',
    'transfer',
    'share',
    'export',
    ...(measureState === 'draft' ? (['delete'] as EditMeasureAction[]) : [])
]

const assertFocusVisible = () => {
    cy.focused().should(($element) => expect($element[0].matches(':focus-visible')).to.be.true)
}

const assertFocusedAction = (action: EditMeasureAction) => {
    cy.focused().should('have.attr', 'aria-label', EditMeasureActionCenter.actions[action].accessibleName)
    assertFocusVisible()
}

const tabToActionCenter = () => {
    cy.get(Header.userProfileSelect).focus()
    cy.realPress('Tab')
    EditMeasureActionCenter.triggerButton().should('have.focus')
    assertFocusVisible()
}

const assertBreadcrumbFocus = (name: 'Measures' | 'Details') => {
    cy.focused().should('contain.text', name)
    assertFocusVisible()
}

const assertExpandedFocusOrder = (
    measureState: MeasureState,
    includesReview = false,
    startAtActionCenterTrigger = true
) => {
    if (startAtActionCenterTrigger) {
        tabToActionCenter()
    }
    const actions = actionOrder(measureState, includesReview)

    actions.forEach((action) => {
        cy.realPress('Tab')
        assertFocusedAction(action)
    })

    cy.realPress('Tab')
    assertBreadcrumbFocus('Measures')
    cy.realPress('Tab')
    assertBreadcrumbFocus('Details')

    cy.realPress(['Shift', 'Tab'])
    assertBreadcrumbFocus('Measures')
    actions
        .slice()
        .reverse()
        .forEach((action) => {
            cy.realPress(['Shift', 'Tab'])
            assertFocusedAction(action)
        })
    cy.realPress(['Shift', 'Tab'])
    EditMeasureActionCenter.triggerButton().should('have.focus')
    cy.realPress(['Shift', 'Tab'])
    cy.get(Header.userProfileSelect).should('have.focus')
}

const assertReviewerExpandedFocusOrder = () => {
    cy.realPress('Tab')
    assertFocusedAction('review')

    actionOrder('draft').forEach((action) => {
        cy.realPress('Tab')
        assertFocusedAction(action)
    })

    cy.realPress('Tab')
    assertBreadcrumbFocus('Measures')
    cy.realPress('Tab')
    assertBreadcrumbFocus('Details')

    cy.realPress(['Shift', 'Tab'])
    assertBreadcrumbFocus('Measures')
    actionOrder('draft')
        .slice()
        .reverse()
        .forEach((action) => {
            cy.realPress(['Shift', 'Tab'])
            assertFocusedAction(action)
        })
    cy.realPress(['Shift', 'Tab'])
    assertFocusedAction('review')
    cy.realPress(['Shift', 'Tab'])
    EditMeasureActionCenter.triggerButton().should('have.focus')
    cy.realPress(['Shift', 'Tab'])
    cy.get(Header.userProfileSelect).should('have.focus')
}

const createScenarioMeasure = (measureState: MeasureState) => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10348${measureState}${suffix}`

    CreateMeasurePage.CreateQICoreMeasureAPI(measureName, `${measureName}Library`, MeasureCQL.CQL_For_Cohort)
    TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then((response) =>
        TestData.expectSavedMeasureCql(response)
    )
    MeasureGroupPage.CreateCohortMeasureGroupAPI()

    if (measureState === 'versioned') {
        TestData.versionMeasure().its('status').should('eq', 200)
    }
}

const openScenarioMeasure = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById()
    return Accessibility.injectAxe()
}

const openReviewerScenarioMeasure = () => {
    return OktaLogin.reserveReviewer()
        .then(() => {
            createScenarioMeasure('draft')
            TestData.requestMeasureReview('READY_FOR_REVIEW').its('status').should('eq', 201)

            const reviewer = OktaLogin.getReviewerUser()
            expect(reviewer, 'Reserved reviewer username').not.to.be.empty

            return TestData.readMeasureId().then((measureId) => {
                return TestData.requestSharePermissions('measure', 'GRANT', measureId, reviewer)
                    .its('status')
                    .should('eq', 200)
            })
        })
        .then(() => {
            return OktaLogin.ReviewerLogin()
        })
        .then(() => {
            MeasuresPage.openAllReviewsTab()
            MeasuresPage.selectMeasureForReview()
            MeasuresPage.openReviewDialog()

            return TestData.getAccountDisplayName(OktaLogin.getReviewerUser()).then((reviewerDisplayName) => {
                ManageReviewDialogPage.selectReviewer(reviewerDisplayName)
                TestData.readMeasureId().then((measureId) => {
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
            })
        })
        .then(() => {
            MeasuresPage.openMyReviewsTab()
            MeasuresPage.openMeasureFromCurrentListWithExpectedAction('Edit')
            return Accessibility.injectAxe()
        })
}

const testActionCenterAccessibility = (measureState: MeasureState) => {
    describe(`${measureState} edit-measure action center accessibility`, () => {
        before(`Create a scenario-owned ${measureState} measure`, () => createScenarioMeasure(measureState))

        beforeEach(`Open the ${measureState} measure on the edit page`, () => openScenarioMeasure())

        after('Delete the scenario-owned measure', () =>
            measureState === 'versioned' ? Utilities.deleteVersionedMeasure() : Utilities.deleteMeasure()
        )

        it('skips collapsed action buttons during forward and reverse keyboard navigation', () => {
            step('Verify the collapsed action center does not leave hidden actions in the tab order')
            EditMeasureActionCenter.assertHiddenActionsAreNotTabbable()
            EditMeasureActionCenter.scanTrigger()

            tabToActionCenter()
            cy.realPress('Tab')
            assertBreadcrumbFocus('Measures')
            cy.realPress('Tab')
            assertBreadcrumbFocus('Details')
            cy.realPress(['Shift', 'Tab'])
            assertBreadcrumbFocus('Measures')
            cy.realPress(['Shift', 'Tab'])
            EditMeasureActionCenter.triggerButton().should('have.focus')
            cy.realPress(['Shift', 'Tab'])
            cy.get(Header.userProfileSelect).should('have.focus')
        })

        actionOrder(measureState).forEach((action) => {
            it(`provides an accessible ${EditMeasureActionCenter.actions[action].accessibleName} action`, () => {
                step(`Open the action center and verify ${EditMeasureActionCenter.actions[action].accessibleName}`)
                EditMeasureActionCenter.open()
                EditMeasureActionCenter.assertAccessibleName(action)

                step('Run axe only on the visible action button')
                EditMeasureActionCenter.scanAction(action)
            })
        })

        it('supports forward and reverse keyboard navigation through the expanded action center', () => {
            step('Open the action center from its keyboard-reachable trigger')
            tabToActionCenter()
            cy.realPress('Enter')
            EditMeasureActionCenter.actionButton(actionOrder(measureState)[0]).should('be.visible')

            step('Verify the complete forward and reverse focus sequence')
            cy.get('body').then(($body) => {
                const includesReview = $body
                    .find(EditMeasureActionCenter.actions.review.selector)
                    .closest('button')
                    .is(':visible')
                assertExpandedFocusOrder(measureState, includesReview, false)
            })
        })
    })
}

// Reviewer functionality is not available in TEST.
describe.skip('reviewer edit-measure action center accessibility', () => {
    beforeEach('Create, assign, and open a reviewer-owned draft measure', () => openReviewerScenarioMeasure())

    afterEach('Delete the reviewer-assigned measure and release the reviewer user', () => {
        return Utilities.deleteMeasure().then(() => {
            return OktaLogin.releaseReviewer()
        })
    })

    it('includes Review as the first expanded action for a reviewer', () => {
        step('Open the action center and verify the Review action accessible name')
        EditMeasureActionCenter.open()
        EditMeasureActionCenter.assertAccessibleName('review')
        EditMeasureActionCenter.scanAction('review')
    })

    it('supports the reviewer forward and reverse focus order', () => {
        step('Focus the action center trigger and open it with Space')
        EditMeasureActionCenter.triggerButton().focus().should('have.focus')
        assertFocusVisible()
        cy.realPress('Space')
        EditMeasureActionCenter.actionButton('review').should('be.visible')

        step('Verify Tab moves focus to Review, followed by the remaining action controls')
        assertReviewerExpandedFocusOrder()
    })
})

testActionCenterAccessibility('draft')
testActionCenterAccessibility('versioned')
