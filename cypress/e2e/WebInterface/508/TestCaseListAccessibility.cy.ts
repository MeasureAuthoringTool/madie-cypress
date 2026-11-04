import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage, MeasureScoring, MeasureType, PopulationBasis } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestCaseJson } from '../../../Shared/TestCaseJson'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

const testCaseTitle = 'MAT-10565 accessible test case'

const createScenarioMeasure = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10565${suffix}`

    CreateMeasurePage.CreateMeasureAPI(measureName, `${measureName}Library`, SupportedModels.qiCore4, {
        blankMetadata: true
    })
    TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then(TestData.expectSavedMeasureCql)
    MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.boolean, MeasureScoring.Cohort, {
        initialPopulation: 'Initial PopulationOne'
    })
    TestCasesPage.CreateTestCaseAPI(
        testCaseTitle,
        'MAT-10565 accessibility',
        'Test case list accessibility scenario',
        TestCaseJson.TestCaseJson_Valid
    )
    return cy.then(() => undefined)
}

const openScenarioTestCaseList = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById()
    cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
    cy.get(TestCasesPage.testCaseListTable).should('be.visible').and('contain.text', testCaseTitle)
    return Accessibility.injectAxe()
}

// MAT-10565
describe('Test Case List accessibility', () => {
    before('Create a scenario-owned measure and test case', createScenarioMeasure)

    beforeEach('Open the scenario Test Case List', openScenarioTestCaseList)

    after('Delete the scenario-owned measure', () => Utilities.deleteMeasure())

    it('provides an accessible name for the search clear button', () => {
        step('Enter search text so the clear-search control is available')
        cy.get(TestCasesPage.tcSearchInput).should('be.visible').clear().type(testCaseTitle).should('have.focus')

        step('Tab once to the descriptively named clear-search button')
        cy.realPress('Tab')
        cy.get(TestCasesPage.clearIconBtn)
            .should('be.visible')
            .parents('button')
            .first()
            .should('have.focus')
            .should('have.attr', 'aria-label', 'Clear test case search')

        step('Activate the clear-search button with Enter')
        cy.realPress('Enter')
        cy.get(TestCasesPage.tcSearchInput).should('have.value', '')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', testCaseTitle)
    })

    it('associates the header and row checkbox names with their selection targets', () => {
        step('Verify checkbox names describe their selection targets')
        cy.get(TestCasesPage.testCaseListTable).then(($table) => {
            const findings: string[] = []
            const headerLabel = $table.find('thead input[type="checkbox"]').attr('aria-label') || ''

            if (!/test case selection/i.test(headerLabel)) {
                findings.push(`header checkbox has aria-label="${headerLabel}"`)
            }

            $table.find('tbody input[type="checkbox"]').each((_, checkbox) => {
                const $checkbox = Cypress.$(checkbox)
                const rowText = $checkbox.closest('tr').text().replace(/\s+/g, ' ').trim()
                const ariaLabel = $checkbox.attr('aria-label') || ''

                if (!rowText.includes(testCaseTitle)) {
                    findings.push(`test case row does not include "${testCaseTitle}"`)
                }
                if (!ariaLabel.includes(testCaseTitle)) {
                    findings.push(`row checkbox has aria-label="${ariaLabel}"`)
                }
            })

            expect(findings, 'checkbox accessible-name findings').to.deep.equal([])
        })
    })

    it('supports keyboard navigation through every text-bearing table cell', () => {
        const tabbableSelector =
            'input:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), ' +
            'a[href], [tabindex="0"]'

        step('Verify every text-bearing cell is or contains a keyboard focus target')
        cy.get(TestCasesPage.testCaseListCells).then(($cells) => {
            const findings: string[] = []

            $cells.each((_, cell) => {
                const $cell = Cypress.$(cell)
                const text = $cell.text().replace(/\s+/g, ' ').trim()

                const cellIsTabbable = $cell.attr('tabindex') === '0'
                const hasTabbableChild = $cell.find(tabbableSelector).filter(':visible').length > 0

                if ($cell.is(':visible') && text && !cellIsTabbable && !hasTabbableChild) {
                    findings.push(`${cell.tagName.toLowerCase()} "${text}" has no keyboard focus target`)
                }
            })

            expect(findings, 'text-bearing cells without a tab stop').to.deep.equal([])
        })

        step('Select all test cases and Tab through every table focus target in DOM order')
        cy.get(TestCasesPage.testCaseListHeaderCheckbox).click().should('be.checked').and('have.focus')
        cy.get(TestCasesPage.testCaseListTable)
            .find(tabbableSelector)
            .filter(':visible')
            .then(($focusTargets) => {
                expect($focusTargets.length, 'visible table focus targets').to.be.greaterThan(1)
                cy.wrap($focusTargets.eq(0)).should('have.focus')

                for (let index = 1; index < $focusTargets.length; index += 1) {
                    cy.realPress('Tab')
                    cy.wrap($focusTargets.eq(index)).should('have.focus')
                }
            })
    })

    // MAT-10355
    it('exposes only the expand icon as a button and Tab stop when the sidebar is collapsed', () => {
        step('Collapse the Test Case sidebar')
        cy.get(TestCasesPage.leftNavCollapse).should('be.visible').click()

        step('Verify the expand icon is the only button in the collapsed sidebar control')
        cy.get(TestCasesPage.leftNavExpand)
            .should('be.visible')
            .should('have.prop', 'tagName', 'BUTTON')
            .should('have.attr', 'aria-label', 'Expand Test Case Sidebar')
            .parents('button')
            .should('have.length', 0)
        cy.get('[data-testid="test-case-sidebar-collapsed-button"]')
            .should('have.prop', 'tagName', 'DIV')
            .should('not.have.attr', 'tabindex')
        cy.get('[data-testid="test-case-sidebar-collapsed-button"]')
            .find('button')
            .should('have.length', 1)
            .and('match', TestCasesPage.leftNavExpand)

        step('Verify keyboard navigation reaches the expand icon as one Tab stop')
        cy.get(TestCasesPage.leftNavExpand).focus().should('have.focus')
        cy.realPress(['Shift', 'Tab'])
        cy.get(TestCasesPage.leftNavExpand).should('not.have.focus')
        cy.realPress('Tab')
        cy.get(TestCasesPage.leftNavExpand).should('have.focus')
    })

    it('has no WCAG A or AA violations on the populated Test Case List page', () => {
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
