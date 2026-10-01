import { Accessibility } from '../../../support/accessibility'
import { EditMeasureActionCenter, EditMeasureAction } from '../../../Shared/EditMeasureActionCenter'
import { Header } from '../../../Shared/Header'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

type MeasureState = 'draft' | 'versioned'

const MAT_10348_DEFECT = 'MAT-10348 defect: see bugs/MAT-10348-defect-report.md'

const actionOrder = (measureState: MeasureState, includesReview = false): EditMeasureAction[] => [
    ...(includesReview ? (['review'] as EditMeasureAction[]) : []),
    'history',
    'humanReadable',
    measureState === 'draft' ? 'version' : 'draft',
    'transfer',
    'share',
    'export',
    'delete'
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
    return OktaLogin.ReviewerLogin().then(() => {
        const primaryUser = Cypress.expose('selectedUser')
        const reviewerUser = Cypress.expose('reviewerUser')

        expect(primaryUser, 'Primary user allocation').to.be.a('string').and.not.be.empty
        expect(reviewerUser, 'Reviewer user allocation').to.be.a('string').and.not.be.empty
        Cypress.expose('mat10348PrimaryUser', primaryUser)
        Cypress.expose('selectedUser', reviewerUser)

        createScenarioMeasure('draft')
        MeasuresPage.openMeasureDetailsById()
        return Accessibility.injectAxe()
    })
}

const restorePrimaryUserAfterReviewerScenario = () => {
    const primaryUser = Cypress.expose('mat10348PrimaryUser')

    expect(primaryUser, 'Primary user allocation to restore').to.be.a('string').and.not.be.empty
    Cypress.expose('selectedUser', primaryUser)
    Cypress.expose('mat10348PrimaryUser', null)
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
            const isBlockedByDefect =
                action === 'humanReadable' ||
                action === 'share' ||
                (measureState === 'versioned' && action === 'delete')
            const actionTest = isBlockedByDefect ? it.skip : it

            actionTest(`provides an accessible ${EditMeasureActionCenter.actions[action].accessibleName} action`, () => {
                step(`Open the action center and verify ${EditMeasureActionCenter.actions[action].accessibleName}`)
                EditMeasureActionCenter.open()
                EditMeasureActionCenter.assertAccessibleName(action)

                step('Run axe only on the visible action button')
                EditMeasureActionCenter.scanAction(action)
            })
        })

        it.skip(`supports forward and reverse keyboard navigation through the expanded action center (${MAT_10348_DEFECT})`, () => {
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

describe('reviewer edit-measure action center accessibility', () => {
    beforeEach('Create and open a reviewer-owned draft measure', () => openReviewerScenarioMeasure())

    afterEach('Delete the reviewer-owned measure, restore the primary user, and release the reviewer user', () => {
        return Utilities.deleteMeasure().then(() => {
            restorePrimaryUserAfterReviewerScenario()
            return OktaLogin.releaseReviewer()
        })
    })

    it.skip(`includes Review as the first expanded action for a reviewer (${MAT_10348_DEFECT})`, () => {
        step('Open the action center and verify the Review action accessible name')
        EditMeasureActionCenter.open()
        EditMeasureActionCenter.assertAccessibleName('review')
        EditMeasureActionCenter.scanAction('review')
    })

    it.skip(`supports the reviewer forward and reverse focus order (${MAT_10348_DEFECT})`, () => {
        step('Open the action center with Space from the keyboard-reachable trigger')
        tabToActionCenter()
        cy.realPress('Space')
        EditMeasureActionCenter.actionButton('review').should('be.visible')

        step('Verify Tab moves focus to Review, followed by the remaining action controls')
        assertReviewerExpandedFocusOrder()
    })
})

// MAT-10348. Run in DEV while the Review action remains unavailable in TEST.
testActionCenterAccessibility('draft')
testActionCenterAccessibility('versioned')
