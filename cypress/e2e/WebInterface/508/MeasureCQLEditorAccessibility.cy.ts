import { Accessibility } from '../../../support/accessibility'
import { CQLEditorPage } from '../../../Shared/CQLEditorPage'
import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

const howItWorksText =
    "The CQL Editor is where you create and maintain your measure's Clinical Quality Language (CQL). " +
    'Use the editor to write CQL, search and replace text, apply value sets and codes, and manage includes, ' +
    'parameters, definitions, and functions. Keyboard users can press Esc to exit the editor, then Tab or Shift + ' +
    'Tab to continue navigating through the page. Remember to save your changes before leaving the editor.'

const contrastComment = '// MAT-10563 Monaco comment contrast'
const cqlWithContrastComment = MeasureCQL.CQL_For_Cohort.replace(
    "using QICore version '4.1.1'",
    `${contrastComment}\nusing QICore version '4.1.1'`
)

const createScenarioMeasure = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10350${suffix}`

    CreateMeasurePage.CreateMeasureAPI(measureName, `${measureName}Library`, SupportedModels.qiCore4, {
        blankMetadata: true
    })
    return TestData.saveMeasureCql(`${cqlWithContrastComment}\n`).then(TestData.expectSavedMeasureCql)
}

const openScenarioEditor = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openMeasureDetailsById()
    cy.get(EditMeasurePage.cqlEditorTab)
        .should('not.have.attr', 'aria-disabled', 'true')
        .then(($tab) => $tab[0].click())
    return cy
        .get(CQLEditorPage.monacoEditor)
        .should('be.visible')
        .then(() => Accessibility.injectAxe())
}

// MAT-10350 and MAT-10563
describe('measure CQL Editor accessibility', () => {
    before('Create a scenario-owned draft measure', createScenarioMeasure)

    beforeEach('Open the scenario measure CQL Editor', openScenarioEditor)

    after('Delete the scenario-owned draft measure', () => Utilities.deleteMeasure())

    it('provides a keyboard-reachable collapsed How it works control', () => {
        step('Verify the How it works button exposes its collapsed state and controlled content')
        cy.get(CQLEditorPage.howItWorksLink)
            .should('be.visible')
            .and('have.attr', 'type', 'button')
            .and('have.attr', 'aria-expanded', 'false')
            .and('have.attr', 'aria-controls', 'cql-editor-how-it-works')
            .and('have.text', 'How it works')
            .focus()
            .should('have.focus')
    })

    it('opens readable guidance and closes it through its keyboard-focusable close control', () => {
        step('Open the How it works guidance')
        cy.get(CQLEditorPage.howItWorksLink).click()
        cy.get(CQLEditorPage.howItWorksContent)
            .should('be.visible')
            .and('have.attr', 'id', 'cql-editor-how-it-works')
            .and('have.attr', 'role', 'region')
            .and('have.attr', 'aria-label', 'How it works information')
            .and('contain.text', howItWorksText)

        step('Verify the visible guidance is semantically accessible')
        Accessibility.check(CQLEditorPage.howItWorksContent, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })

        step('Tab to and activate the close control')
        cy.realPress('Tab')
        cy.get(CQLEditorPage.howItWorksCloseButton)
            .should('be.visible')
            .and('have.attr', 'aria-label', 'Close how it works')
            .and('have.focus')
        cy.realPress('Enter')

        cy.get(CQLEditorPage.howItWorksContent).should('not.exist')
        cy.get(CQLEditorPage.howItWorksLink).should('be.visible').and('have.attr', 'aria-expanded', 'false')
    })

    it('has sufficient contrast for Monaco line numbers and comments', () => {
        step('Verify Monaco has rendered gutter line numbers and the scenario comment')
        cy.get(CQLEditorPage.monacoLineNumbers).should('contain.text', '1')
        cy.contains(CQLEditorPage.monacoRenderedTokens, contrastComment).should('be.visible')

        step('Scan the full CQL Editor page for WCAG A and AA violations')
        Accessibility.check('body', {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
