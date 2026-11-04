import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage, MeasureScoring, MeasureType, PopulationBasis } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

const createScenarioMeasure = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10351${suffix}`

    CreateMeasurePage.CreateMeasureAPI(measureName, `${measureName}Library`, SupportedModels.qiCore4, {
        blankMetadata: true
    })
    TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then(TestData.expectSavedMeasureCql)
    MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.boolean, MeasureScoring.Cohort, {
        initialPopulation: 'Initial PopulationOne'
    })
    return cy.then(() => undefined)
}

const openScenarioPopulationCriteria = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById()
    EditMeasurePage.openPopulationCriteriaTab(MeasureGroupPage.measureGroupTypeSelect)
    return Accessibility.injectAxe()
}

// MAT-10351 and MAT-10564
describe('Population Criteria accessibility', () => {
    before('Create a scenario-owned draft measure', createScenarioMeasure)

    beforeEach('Open the scenario measure Population Criteria tab', openScenarioPopulationCriteria)

    after('Delete the scenario-owned draft measure', () => Utilities.deleteMeasure())

    it('places required semantics on the Measure Group Type input, not its Autocomplete wrapper', () => {
        step('Verify the Autocomplete wrapper does not expose an invalid aria-required attribute')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible').and('not.have.attr', 'aria-required')

        step('Verify the actual Measure Group Type input retains its required state')
        cy.get(MeasureGroupPage.measureGroupTypeInput).should('have.attr', 'aria-required', 'true')

        step('Check the corrected control for WCAG A and AA violations')
        Accessibility.check(MeasureGroupPage.measureGroupTypeSelect, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })

    it('exposes the required state on every visibly required Population Criteria control', () => {
        const requiredControls = [
            { name: 'Measure Type', selector: MeasureGroupPage.measureGroupTypeInput },
            { name: 'Population Basis', selector: MeasureGroupPage.popBasisField },
            { name: 'Scoring', selector: MeasureGroupPage.measureScoringSelect },
            { name: 'Initial Population', selector: MeasureGroupPage.initialPopulationSelect }
        ]

        requiredControls.forEach(({ name, selector }) => {
            step(`Verify ${name} exposes its required state`)
            cy.get(selector)
                .should('be.visible')
                .and(($control) => {
                    const isRequired = $control.attr('aria-required') === 'true' || $control.prop('required') === true
                    expect(isRequired, `${name} required state`).to.equal(true)
                })
        })
    })

    it('uses valid aria-invalid and aria-required values throughout the Population Criteria page', () => {
        const validAriaInvalidValues = ['false', 'true', 'grammar', 'spelling']
        const validBooleanValues = ['false', 'true']

        step('Verify the populated form rendered multiple controls with ARIA validation state')
        cy.get('input[aria-invalid], textarea[aria-invalid]').should('have.length.greaterThan', 1)

        step('Verify every rendered aria-invalid and aria-required value is valid')
        cy.get('[aria-invalid], [aria-required]').then(($elements) => {
            const invalidValues: string[] = []

            $elements.each((_, element) => {
                const ariaInvalid = element.getAttribute('aria-invalid')
                const ariaRequired = element.getAttribute('aria-required')
                const selector = element.getAttribute('data-testid') || element.id || element.tagName.toLowerCase()

                if (ariaInvalid !== null && !validAriaInvalidValues.includes(ariaInvalid)) {
                    invalidValues.push(`${selector} has aria-invalid="${ariaInvalid}"`)
                }
                if (ariaRequired !== null && !validBooleanValues.includes(ariaRequired)) {
                    invalidValues.push(`${selector} has aria-required="${ariaRequired}"`)
                }
            })

            expect(invalidValues, 'invalid ARIA attribute values').to.deep.equal([])
        })

        step('Scan the full Population Criteria page for WCAG A and AA violations')
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
