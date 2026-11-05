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

const invalidTestCaseTitle = 'MAT-10354 invalid test case'
const validTestCaseTitle = 'MAT-10354 valid test case'

const actionCenterContract = [
    {
        tooltip: '[data-testid="delete-tooltip"]',
        button: TestCasesPage.actionCenterDelete,
        buttonName: 'Delete Test Case',
        noSelection: 'Select a test case to delete',
        invalidSelection: 'Delete test case',
        validSelection: 'Delete test case'
    },
    {
        tooltip: '[data-testid="shift-test-case-dates-tooltip"]',
        button: TestCasesPage.actionCenterShiftDates,
        buttonName: 'Shift test case dates',
        noSelection: 'Select test cases to shift test case dates',
        invalidSelection: 'Shift test case dates',
        validSelection: 'Shift test case dates'
    },
    {
        tooltip: '[data-testid="clone-tooltip"]',
        button: TestCasesPage.actionCenterClone,
        buttonName: 'Clone Test Case',
        noSelection: 'Select a valid test case to clone',
        invalidSelection: 'Select a valid test case to clone',
        validSelection: 'Clone test case'
    },
    {
        tooltip: '[data-testid="make-json-match-ui-tooltip"]',
        button: TestCasesPage.actionCenterMakeJsonMatchUi,
        buttonName: 'Make JSON Match UI',
        noSelection: 'Select a test case to make JSON (family/given) match UI (group/title)',
        invalidSelection: 'Make JSON (family/given) match UI (group/title)',
        validSelection: 'Make JSON (family/given) match UI (group/title)'
    },
    {
        tooltip: '[data-testid="copy-tooltip"]',
        button: TestCasesPage.actionCenterCopyToMeasure,
        buttonName: 'Copy to Icon',
        noSelection: 'Select test cases to copy to another measure',
        invalidSelection: 'Copy to another measure',
        validSelection: 'Copy to another measure'
    },
    {
        tooltip: '[data-testid="export-tooltip"]',
        button: TestCasesPage.actionCenterExport,
        buttonName: 'Export Test case(s)',
        noSelection: 'Select test cases to export',
        invalidSelection: 'Export test cases',
        validSelection: 'Export test cases'
    }
] as const

type TooltipState = 'noSelection' | 'invalidSelection' | 'validSelection'

const createScenario = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10354${suffix}`

    CreateMeasurePage.CreateMeasureAPI(measureName, `${measureName}Library`, SupportedModels.qiCore4, {
        blankMetadata: true
    })
    TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then(TestData.expectSavedMeasureCql)
    MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.boolean, MeasureScoring.Cohort, {
        initialPopulation: 'Initial PopulationOne'
    })
    TestCasesPage.CreateTestCaseAPI(invalidTestCaseTitle, 'MAT-10354 accessibility', 'Invalid action-center state')
    TestCasesPage.CreateTestCaseAPI(
        validTestCaseTitle,
        'MAT-10354 accessibility',
        'Valid action-center state',
        TestCaseJson.TestCaseJson_Valid,
        false,
        true
    )
    return cy.then(() => undefined)
}

const openTestCaseList = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById()
    cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
    cy.get(TestCasesPage.testCaseListTable)
        .should('be.visible')
        .and('contain.text', invalidTestCaseTitle)
        .and('contain.text', validTestCaseTitle)
    cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled')
    return Accessibility.injectAxe()
}

const assertTooltips = (state: TooltipState) => {
    actionCenterContract.forEach(({ tooltip, [state]: expectedTooltip }) => {
        cy.get(tooltip)
            .should('be.visible')
            .should('have.prop', 'tagName', 'DIV')
            .should('have.attr', 'title', expectedTooltip)
    })
}

// MAT-10354
describe('Test Case Action Center accessibility', () => {
    before('Create isolated valid and invalid test cases', createScenario)

    beforeEach('Open the populated Test Case List', openTestCaseList)

    after('Delete the scenario-owned measure', () => Utilities.deleteMeasure())

    it('uses div tooltip wrappers and gives every action button an accessible name', () => {
        step('Verify tooltip wrapper semantics and action-button accessible names')
        actionCenterContract.forEach(({ tooltip, button, buttonName }) => {
            cy.get(tooltip).should('have.prop', 'tagName', 'DIV').should('have.attr', 'aria-label', buttonName)
            cy.get(button)
                .invoke('attr', 'aria-label')
                .then((ariaLabel) => {
                    expect(ariaLabel, `${buttonName} button accessible name`).to.be.a('string').and.not.be.empty
                    expect(ariaLabel?.toLowerCase(), `${buttonName} button names its action`).to.include(
                        buttonName.split(' ')[0].toLowerCase()
                    )
                })
        })
    })

    it('configures selection-guidance tooltips when no test case is selected', () => {
        assertTooltips('noSelection')
    })

    it('configures invalid-selection tooltips when an invalid test case is selected', () => {
        TestCasesPage.checkTestCaseByTitle(invalidTestCaseTitle)
        assertTooltips('invalidSelection')
    })

    it('configures enabled-action tooltips when only a valid test case is selected', () => {
        TestCasesPage.checkTestCaseByTitle(validTestCaseTitle)
        assertTooltips('validSelection')
    })

    it('renders the configured Make JSON Match UI tooltip on hover', () => {
        TestCasesPage.checkTestCaseByTitle(validTestCaseTitle)
        cy.get(TestCasesPage.actionCenterMakeJsonMatchUi).trigger('mouseover')
        cy.get('[role="tooltip"]:visible')
            .should('have.length', 1)
            .and('contain.text', 'Make JSON (family/given) match UI (group/title)')
    })

    it('has no WCAG A or AA axe violations in the Test Case Action Center', () => {
        cy.get('[data-testid="delete-tooltip"]')
            .parent()
            .then(($actionCenter) => {
                Accessibility.check($actionCenter[0], {
                    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
                })
            })
    })
})
