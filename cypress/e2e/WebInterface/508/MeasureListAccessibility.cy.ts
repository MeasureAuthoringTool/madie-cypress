import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage, SupportedCompositeModels, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { CompositeMeasureComponentsDialogPage } from '../../../Shared/CompositeMeasureComponentsDialogPage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasureDraftBody, TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

const axeOptions = { runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa'] } }
const proportionComponentCql = `${MeasureCQL.CQL_For_Cohort_Six}\ndefine "Denominator":\n  true\ndefine "Numerator":\n  true\n`

let versionedMeasureName = ''
let draftMeasureName = ''
let compositeMeasureName = ''
let cqlLibraryName = ''

const createScenarioMeasures = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    versionedMeasureName = `MAT10560Versioned${suffix}`
    draftMeasureName = `${versionedMeasureName}Draft`
    compositeMeasureName = `MAT10560Composite${suffix}`
    cqlLibraryName = `${versionedMeasureName}Library`

    OktaLogin.setupUserSession(false)
    CreateMeasurePage.CreateMeasureAPI(versionedMeasureName, cqlLibraryName, SupportedModels.qiCore6)

    return TestData.saveMeasureCql(proportionComponentCql)
        .then(TestData.expectSavedMeasureCql)
        .then(() => {
            MeasureGroupPage.CreateProportionMeasureGroupAPI(
                0,
                false,
                'Initial PopulationOne',
                '',
                '',
                'Numerator',
                '',
                'Denominator',
                'boolean'
            )
            return TestData.readMeasure()
        })
        .then((measureResponse) => {
            const measure = measureResponse.body
            return TestData.versionMeasure().then((versionResponse) => {
                expect(versionResponse.status).to.eq(200)

                const draftBody: MeasureDraftBody = {
                    measureName: draftMeasureName,
                    cqlLibraryName,
                    model: measure.model,
                    createdBy: OktaLogin.getUser(false),
                    cql: measure.cql,
                    elmJson: measure.elmJson,
                    ecqmTitle: measure.ecqmTitle,
                    measurementPeriodStart: measure.measurementPeriodStart,
                    measurementPeriodEnd: measure.measurementPeriodEnd
                }

                return TestData.requestMeasureDraft(draftBody).then((draftResponse) => {
                    expect(draftResponse.status).to.eq(201)
                    TestData.writeMeasureContext(draftResponse.body, 1)

                    return TestData.versionMeasure('minor', 1).then((secondVersionResponse) => {
                        expect(secondVersionResponse.status).to.eq(200)

                        CreateMeasurePage.CreateCompositeMeasureAPI(
                            compositeMeasureName,
                            `${compositeMeasureName}Library`,
                            SupportedCompositeModels.qiCore6,
                            undefined,
                            2
                        )

                        return TestData.requestMeasureGroup(
                            'PUT',
                            {
                                scoring: 'Composite',
                                populations: [],
                                measureGroupTypes: ['Process'],
                                populationBasis: 'Boolean',
                                compositeScoring: 'Opportunity'
                            },
                            2
                        ).then((response) => {
                            expect(response.status).to.eq(200)
                        })
                    })
                })
            })
        })
}

const openScenarioMeasureList = () => {
    OktaLogin.SessionLogin()
    cy.visit('/measures')
    return cy
        .get(MeasuresPage.measureListTitles)
        .should('be.visible')
        .then(() => Accessibility.injectAxe())
}

const associateComponentWithCompositeMeasure = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById(2)
    EditMeasurePage.openPopulationCriteriaTab(CompositeMeasureComponentsDialogPage.selectComponentsButton)
    CompositeMeasureComponentsDialogPage.open()
    CompositeMeasureComponentsDialogPage.assertOpen()
    cy.contains(`${CompositeMeasureComponentsDialogPage.dialog} tr`, versionedMeasureName)
        .find('input[type="checkbox"]')
        .check()
    cy.get('[data-testid="select-composite-measure-components-continue-button"]').should('be.enabled').click()
    cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled').click()
    return cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
}

const searchForScenarioMeasure = (measureName: string) => {
    MeasuresPage.searchForMeasureByName(measureName)
    return cy.get(MeasuresPage.measureListRows).should('have.length', 1)
}

const scenarioRow = (measureName: string) => cy.contains(MeasuresPage.measureListRows, measureName)

// MAT-10560
describe('Measure List accessibility', () => {
    before('Create scenario-owned versioned, draft, and composite measures', () => {
        return createScenarioMeasures().then(associateComponentWithCompositeMeasure)
    })

    beforeEach('Open the Measures list', openScenarioMeasureList)

    after('Delete all scenario-owned measures', () => {
        return Utilities.deleteMeasure(undefined, undefined, false, false, 2)
            .then(() => Utilities.deleteMeasure(undefined, undefined, false, false, 1))
            .then(() => Utilities.deleteVersionedMeasure(undefined, undefined, false, false, 0))
    })

    it('provides a named, keyboard-operable Measure List search clear button', () => {
        step('Enter a measure name so the clear-search control is available')
        cy.get(MeasuresPage.searchInputBox).should('be.visible').clear().type(compositeMeasureName).should('have.focus')

        step('Tab to and activate the named clear-search button')
        cy.realPress('Tab')
        cy.get('[data-testid="ClearIcon"]')
            .parents('button')
            .first()
            .should('have.focus')
            .invoke('attr', 'aria-label')
            .should('match', /clear/i)
        cy.realPress('Enter')
        cy.get(MeasuresPage.searchInputBox).should('have.value', '')
    })

    it('provides named measure-selection controls and keyboard-focusable status chips', () => {
        searchForScenarioMeasure(compositeMeasureName)

        step('Verify the selection header exposes a labelled checkbox inside a labelled group')
        cy.get('[role="group"][aria-label="Measure Selection"]')
            .find('input[type="checkbox"]')
            .should('have.attr', 'aria-label', 'Select all measures on this page')
            .focus()
            .should('have.focus')

        step('Verify the draft row checkbox and status chip have useful, focusable semantics')
        scenarioRow(compositeMeasureName)
            .find('input[type="checkbox"]')
            .should('have.attr', 'aria-label', `Select measure ${compositeMeasureName}`)

        scenarioRow(compositeMeasureName)
            .find('[role="group"][aria-label="Measure status"]')
            .find('.chip-draft')
            .should('have.attr', 'role', 'status')
            .and('have.attr', 'aria-label', 'Draft')
            .and('have.attr', 'tabindex', '0')
            .focus()
            .should('have.focus')
    })

    it('keeps meaningful table cells in the tab order without duplicate stops for controls', () => {
        searchForScenarioMeasure(compositeMeasureName)

        step('Verify each body cell follows the list tab-stop contract')
        scenarioRow(compositeMeasureName)
            .find('td')
            .each(($cell) => {
                const hasContent = ($cell.text() ?? '').trim().length > 0
                const hasOwnFocusableControl =
                    $cell.find('a[href], button, input, select, textarea, [tabindex]').length > 0

                if (hasContent && !hasOwnFocusableControl) {
                    expect($cell, 'readable non-interactive table cell').to.have.attr('tabindex', '0')
                } else {
                    expect($cell, 'empty or interactive table cell').not.to.have.attr('tabindex')
                }
            })
    })

    it('keeps every meaningful table header in the keyboard order with a useful name', () => {
        searchForScenarioMeasure(compositeMeasureName)

        step('Verify each visible text-bearing header is or contains a named keyboard target')
        cy.get(MeasuresPage.measureListTitles)
            .find('th')
            .filter(':visible')
            .each(($header) => {
                const text = $header.text().replace(/\s+/g, ' ').trim()
                const $targets = $header.find('button, input, [tabindex="0"]').filter(':visible')

                if (!text) {
                    return
                }

                if ($header.attr('tabindex') === '0') {
                    return
                }

                expect($targets.length, `header "${text}" keyboard targets`).to.be.greaterThan(0)
                $targets.each((_, target) => {
                    const $target = Cypress.$(target)
                    const name =
                        $target.attr('aria-label') ||
                        $target.attr('title') ||
                        $target.text().replace(/\s+/g, ' ').trim()
                    expect(name, `header "${text}" target name`).not.to.equal('')
                })
            })
    })

    it('provides expanded-row controls, named checkboxes, and a full-page axe scan', () => {
        searchForScenarioMeasure(versionedMeasureName)

        step('Expand the versioned measure set through its labelled native button')
        scenarioRow(versionedMeasureName)
            .find('button[aria-label^="Expand associated measures for"]')
            .should('have.attr', 'aria-expanded', 'false')
            .click()

        scenarioRow(versionedMeasureName)
            .find('button[aria-label^="Collapse associated measures for"]')
            .should('have.attr', 'aria-expanded', 'true')

        step('Verify the expanded version row is selectable by its accessible name')
        cy.get('.expanded-row')
            .should('have.length', 1)
            .find('input[type="checkbox"]')
            .should('have.attr', 'aria-label', `Select measure ${versionedMeasureName}`)

        step('Run the acceptance-criteria full-page scan with the expanded row active')
        Accessibility.check('body', axeOptions)
    })

    it('makes Composite and In Composite status chips keyboard-focusable', () => {
        searchForScenarioMeasure(compositeMeasureName)

        step('Verify the composite measure status chip is announced and keyboard reachable')
        scenarioRow(compositeMeasureName)
            .find('[role="group"][aria-label="Measure status"] .chip-composite')
            .should('have.attr', 'role', 'status')
            .and('have.attr', 'aria-label', 'Composite')
            .and('have.attr', 'tabindex', '0')
            .focus()
            .should('have.focus')

        step('Verify the component measure status chip is announced and keyboard reachable')
        searchForScenarioMeasure(versionedMeasureName)
        scenarioRow(versionedMeasureName)
            .find('[role="group"][aria-label="Measure status"] .chip-in-composite')
            .should(($chip) => {
                expect($chip.attr('role')).to.eq('status')
                expect($chip.attr('aria-label')).to.match(/^In Composite:/)
                expect($chip.attr('tabindex')).to.eq('0')
            })
            .focus()
            .should('have.focus')
    })
})
