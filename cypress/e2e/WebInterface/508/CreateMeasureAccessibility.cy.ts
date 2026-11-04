import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { LandingPage } from '../../../Shared/LandingPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { step } from '../../../utils/step'

const measurementPeriods = [
    {
        name: 'Start Date',
        wrapper: CreateMeasurePage.measurementPeriodStart,
        input: CreateMeasurePage.measurementPeriodStartDate
    },
    {
        name: 'End Date',
        wrapper: CreateMeasurePage.measurementPeriodEnd,
        input: CreateMeasurePage.measurementPeriodEndDate
    }
]

const openCreateMeasureDialog = () => {
    OktaLogin.SessionLogin()
    cy.get('[data-testid="measure-list-search-input"]').should('be.visible')
    step('Open the Create Measure dialog')
    cy.get(LandingPage.newMeasureButton).should('be.visible').and('be.enabled')
    cy.get(LandingPage.newMeasureButton).click()
    cy.get(CreateMeasurePage.measureNameTextbox).should('be.visible')
    return Accessibility.injectAxe()
}

describe('MAT-10561 Create Measure dialog accessibility', () => {
    beforeEach('Open the Create Measure dialog', openCreateMeasureDialog)

    it('places the required state on both Measurement Period inputs', () => {
        const requiredStateFindings: string[] = []

        step('Verify required state belongs to each date input, not its presentation wrapper')
        measurementPeriods.forEach(({ name, wrapper, input }) => {
            cy.get(wrapper).then(($wrapper) => {
                if ($wrapper.attr('aria-required') !== undefined) {
                    requiredStateFindings.push(`${name} wrapper has aria-required`)
                }
            })
            cy.get(wrapper)
                .find(input)
                .then(($input) => {
                    if ($input.attr('aria-required') !== 'true') {
                        requiredStateFindings.push(`${name} input lacks aria-required="true"`)
                    }
                })
        })
        cy.then(() => {
            expect(requiredStateFindings.join('; '), 'Measurement Period required-state findings').to.equal('')
        })
    })

    it('has no axe violations with the Create Measure dialog open', () => {
        step('Scan the open Create Measure dialog')
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
