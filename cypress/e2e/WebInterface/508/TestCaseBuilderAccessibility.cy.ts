import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import {
    MeasureGroupPage,
    MeasureGroups,
    MeasureScoring,
    MeasureType,
    PopulationBasis
} from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Profile, TestCaseBuilder } from '../../../Shared/TestCaseBuilder'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

const populations: MeasureGroups = {
    initialPopulation: 'Initial Population',
    numerator: 'Numerator',
    denominator: 'Denominator',
    denomExclusion: 'Denominator Exclusions'
}

const minimalQiCore6Cql = (libraryName: string) => `library ${libraryName} version '0.0.000'
using QICore version '6.0.0'
include FHIRHelpers version '4.4.000' called FHIRHelpers
context Patient
define "Initial Population": true
define "Denominator": true
define "Denominator Exclusions": false
define "Numerator": true
`

const tabbableSelector =
    'input:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), ' +
    'a[href], select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'

const createAndOpenBuilderScenario = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10566${suffix}`
    const libraryName = `${measureName}Library`

    CreateMeasurePage.CreateMeasureAPI(measureName, libraryName, SupportedModels.qiCore6, {
        measureCql: minimalQiCore6Cql(libraryName)
    })
    MeasureGroupPage.CreateMeasureGroupAPI(
        MeasureType.process,
        PopulationBasis.boolean,
        MeasureScoring.Proportion,
        populations
    )
    TestCasesPage.CreateTestCaseAPI(
        'MAT-10566 builder accessibility',
        'MAT-10566',
        'Builder component accessibility scenario'
    )

    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById()
    cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
    TestCasesPage.clickEditforCreatedTestCase()
    cy.get(TestCaseBuilder.availableTab).should('be.visible')
    return Accessibility.injectAxe()
}

const findTextElementsWithoutTabStop = (container: JQuery<HTMLElement>, elements: string) => {
    const findings: string[] = []

    container
        .find(elements)
        .filter(':visible')
        .each((_, element) => {
            const $element = Cypress.$(element)
            const text = $element.text().replace(/\s+/g, ' ').trim()
            const isTabbable = $element.is(tabbableSelector)
            const hasTabbableChild = $element.find(tabbableSelector).filter(':visible').length > 0

            if (text && !isTabbable && !hasTabbableChild) {
                findings.push(`${element.tagName.toLowerCase()} "${text}" has no keyboard focus target`)
            }
        })

    return findings
}

const addPatient = () => {
    TestCaseBuilder.addEditNewResource(Profile.Patient)
    cy.get(TestCaseBuilder.addedTab).should('have.attr', 'aria-selected', 'true')
}

const openPatientIdentifier = () => {
    addPatient()
    cy.get('[data-testid=" *Identifier"]').click().should('have.focus')
    cy.get('[data-testid="string-field-input-Patient.identifier[0].value"]').should('be.visible')
}

// MAT-10566
describe('Test Case Builder component accessibility', () => {
    beforeEach('Create and open an isolated QI-Core 6 Builder scenario', createAndOpenBuilderScenario)

    afterEach('Delete the scenario-owned measure', () => Utilities.deleteMeasure())

    // MAT-10356
    it('gives the selected test-case breadcrumb a dynamic accessible name', () => {
        step('Verify the breadcrumb name identifies the case number, group, and title')
        cy.get(TestCasesPage.testCaseNameDropdown)
            .should('have.attr', 'aria-label')
            .then((ariaLabel) => {
                expect(ariaLabel).to.include('Case #1')
                expect(ariaLabel).to.include('MAT-10566')
                expect(ariaLabel).to.include('MAT-10566 builder accessibility')
            })
    })

    it('names the profile filters and dynamically names each visible Add profile button', () => {
        step('Verify the All Profiles and Measure Relevant Profiles radio names')
        cy.get('input[type="radio"]')
            .should('have.length', 2)
            .then(($radios) => {
                const accessibleNames = [...$radios].map((radio) => radio.getAttribute('aria-label') || '')
                expect(
                    accessibleNames.some((name) => /All Profiles/i.test(name)),
                    'All Profiles radio name'
                ).to.equal(true)
                expect(
                    accessibleNames.some((name) => /Measure[- ]relevant profiles/i.test(name)),
                    'Measure Relevant Profiles radio name'
                ).to.equal(true)
            })

        step('Select All Profiles and verify visible Add buttons name their profile')
        TestCaseBuilder.selectAllProfiles()
        cy.get('[data-testid^="add-element-"]')
            .filter(':visible')
            .should('have.length.greaterThan', 0)
            .each(($button) => {
                expect($button.attr('aria-label'), `${$button.attr('data-testid')} accessible name`).to.match(/^Add \S/)
            })

        step('Verify a known profile uses its full dynamic profile name')
        cy.get(TestCaseBuilder.availableSearch).clear().type('QICore Patient{enter}')
        cy.get('[data-testid="add-element-qicore-patient"]')
            .should('be.visible')
            .should('have.attr', 'aria-label', 'Add QICore Patient')
    })

    it('announces the Apply success message to assistive technology', () => {
        addPatient()
        Utilities.dropdownSelect('[data-testid="code-selector-Patient.gender"]', 'female')

        step('Apply the Patient change and verify its success message is announced')
        cy.get(TestCaseBuilder.applyButton).should('be.enabled').click()
        cy.get('[class="toast success"]')
            .should('be.visible')
            .and(($toast) => {
                const $announcer = $toast
                    .find('[role="alert"], [role="status"], [aria-live]')
                    .addBack('[role="alert"], [role="status"], [aria-live]')
                    .add($toast.parents('[role="alert"], [role="status"], [aria-live]'))
                expect($announcer.length, 'success message live-region semantics').to.be.greaterThan(0)
                expect($toast.text().trim(), 'announced success message').not.to.equal('')
            })
    })

    // MAT-10357
    it('uses div tooltip wrappers for the Added resource actions', () => {
        addPatient()

        TestData.readBuilderResourceId().then((resourceId) => {
            const actions = [
                { name: 'Edit', selector: `[data-testid="action-${resourceId}-Edit"]` },
                { name: 'Delete', selector: `[data-testid="action-${resourceId}-Delete"]` }
            ]

            actions.forEach(({ name, selector }) => {
                step(`Verify the ${name} action tooltip markup and text`)
                cy.get(selector)
                    .should('be.visible')
                    .and('have.attr', 'aria-label', name)
                    .parent()
                    .should('match', 'div')
                    .and('not.match', 'span')
                    .and('have.attr', 'aria-label', name)

                step(`Hover the ${name} action and verify its tooltip remains functional`)
                cy.get(selector).trigger('mouseover')
                cy.get('[role="tooltip"]:visible').should('have.length', 1).and('contain.text', name)
                cy.get(selector).trigger('mouseout')
                cy.get('[role="tooltip"]:visible').should('not.exist')
            })

            step('Document that Clone is not offered for the Patient profile')
            cy.get(`[data-testid="action-${resourceId}-Clone"]`).should('not.exist')
        })
    })

    it('gives the edit-profile close button its required accessible name', () => {
        addPatient()

        step('Verify the upper-right edit-card close button accessible name')
        cy.get('[data-testid="close-resource-editor-button"]')
            .should('be.visible')
            .and('have.attr', 'aria-label', 'Close Edit Profile Card')
    })

    it('keeps Added-row actions keyboard reachable when the edit card opens and closes', () => {
        addPatient()

        TestData.readBuilderResourceId().then((resourceId) => {
            const actionButtons = `[data-testid^="action-${resourceId}-"]`

            step('Verify edit-card actions are tabbable while the card is open')
            cy.get(actionButtons)
                .should('have.length', 2)
                .should(($buttons) => {
                    $buttons.each((_, button) => {
                        const $button = Cypress.$(button)
                        expect($button).not.to.be.disabled
                        expect($button.attr('tabindex'), `${$button.attr('data-testid')} tab order`).to.equal('0')
                    })
                })

            step('Close the edit card and verify the editor is removed')
            cy.get('[data-testid="close-resource-editor-button"]').click()
            cy.get('[data-testid="close-resource-editor-button"]').should('not.exist')

            step('Verify the visible Added-row actions remain keyboard reachable')
            cy.get(actionButtons).should(($buttons) => {
                $buttons.each((_, button) => {
                    const $button = Cypress.$(button)
                    expect($button.attr('tabindex'), `${$button.attr('data-testid')} tab order`).to.equal('0')
                })
            })
        })
    })

    it('makes every visible Available-table descriptor keyboard reachable', () => {
        step('Select All Profiles so the lean CQL setup exposes the complete Available table')
        TestCaseBuilder.selectAllProfiles()

        step('Verify text-bearing Available-table elements expose a keyboard focus target')
        cy.get(TestCaseBuilder.visibleBuilderTables)
            .should('have.length.greaterThan', 0)
            .each(($table) => {
                expect(
                    findTextElementsWithoutTabStop($table, 'th, td'),
                    'Available-table descriptors without a tab stop'
                ).to.deep.equal([])
            })

        step('Scan the Available Builder page for WCAG A and AA violations')
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })

    it('makes every visible Added-table descriptor keyboard reachable', () => {
        addPatient()
        step('Verify every visible Added-table descriptor exposes a keyboard focus target')
        cy.get(TestCaseBuilder.visibleBuilderTables)
            .should('have.length.greaterThan', 0)
            .each(($table) => {
                expect(
                    findTextElementsWithoutTabStop($table, 'th, td'),
                    'Added-table descriptors without a tab stop'
                ).to.deep.equal([])
            })
    })

    it('moves focus from the selected Identifier to another named control with Tab', () => {
        openPatientIdentifier()

        step('Verify Tab moves focus from Identifier to another usable control')
        cy.realPress('Tab')
        cy.focused()
            .should('match', tabbableSelector)
            .and(($focused) => {
                expect($focused.attr('data-testid'), 'focus moved away from Identifier').not.to.equal(' *Identifier')
                const accessibleName =
                    $focused.attr('aria-label') || $focused.attr('title') || $focused.text().replace(/\s+/g, ' ').trim()
                expect(accessibleName, 'next focused control has an accessible name').not.to.equal('')
            })
    })

    it('gives every Identifier expand control an accessible action and target name', () => {
        const findings: string[] = []
        openPatientIdentifier()

        step('Verify visible expand controls name both their action and target')
        cy.get(TestCaseBuilder.expandControls)
            .filter(':visible')
            .should('have.length.greaterThan', 0)
            .then(($controls) => {
                $controls.each((index, control) => {
                    const $control = Cypress.$(control)
                    const ariaLabel = $control.attr('aria-label') || ''

                    if (!/^(Expand|Collapse)\s+\S.+/.test(ariaLabel)) {
                        findings.push(
                            `expand control ${index + 1} does not name its action and target; aria-label="${ariaLabel}"`
                        )
                    }
                })
            })

        cy.then(() => {
            expect(findings, 'Identifier expand-control accessibility findings').to.deep.equal([])
        })
    })

    it('associates every Patient edit-card heading with a named keyboard control', () => {
        const findings: string[] = []
        openPatientIdentifier()

        step('Verify each edit-card heading is represented by a named keyboard control')
        cy.get('[data-testid="close-resource-editor-button"]').then(($closeButton) => {
            const $editor = $closeButton
                .parents()
                .filter((_, element) => Cypress.$(element).find(TestCaseBuilder.applyButton).length > 0)
                .first()

            $editor
                .find(TestCaseBuilder.editorHeadings)
                .filter(':visible')
                .each((_, heading) => {
                    const headingText = Cypress.$(heading).text().replace(/^\*/, '').trim()
                    const $control = Cypress.$('button:visible')
                        .filter((_, element) => {
                            const $element = Cypress.$(element)
                            const accessibleName =
                                $element.attr('aria-label') ||
                                $element.attr('title') ||
                                $element.text().replace(/^\*/, '').trim()
                            return accessibleName.includes(headingText)
                        })
                        .filter(tabbableSelector)
                        .first()

                    if (!$control.length) {
                        findings.push(`heading "${headingText}" has no associated named expand control`)
                    }
                })
        })

        cy.then(() => {
            expect(findings, 'Patient edit-card heading accessibility findings').to.deep.equal([])
        })
    })

    it('uses a boolean aria-invalid value for an invalid Identifier string', () => {
        openPatientIdentifier()

        step('Trigger a string-component error and verify aria-invalid remains boolean')
        cy.get('[data-testid="string-field-input-Patient.identifier[0].value"]')
            .should('be.visible')
            .type('temporary value')
            .clear()
            .blur()
        cy.get('[data-testid="string-field-input-Patient.identifier[0].value"]')
            .invoke('attr', 'aria-invalid')
            .then((ariaInvalid) => {
                expect(ariaInvalid, 'invalid Identifier value aria-invalid state').to.equal('true')
            })
    })

    it('has no WCAG A or AA axe violations in the Patient editor', () => {
        openPatientIdentifier()

        step('Scan the Patient editor page for WCAG A and AA violations')
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
