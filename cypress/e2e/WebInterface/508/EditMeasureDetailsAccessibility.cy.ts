import { Accessibility } from '../../../support/accessibility'
import { CreateMeasurePage, SupportedModels } from '../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { Header } from '../../../Shared/Header'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { TestData } from '../../../Shared/TestData'
import { Utilities } from '../../../Shared/Utilities'
import { step } from '../../../utils/step'

const createScenarioMeasure = () => {
    const suffix = `${Date.now()}${Cypress._.random(1000, 9999)}`
    const measureName = `MAT10349${suffix}`

    CreateMeasurePage.CreateMeasureAPI(measureName, `${measureName}Library`, SupportedModels.qiCore4, {
        blankMetadata: true
    })
    TestData.saveMeasureCql(`${MeasureCQL.CQL_For_Cohort}\n`).then(TestData.expectSavedMeasureCql)
    MeasureGroupPage.CreateCohortMeasureGroupAPI()
    return cy.then(() => undefined)
}

const openScenarioMeasure = () => {
    OktaLogin.SessionLogin()
    MeasuresPage.openEditMeasureDetailsById()
    return Accessibility.injectAxe()
}

const assertFocusVisible = () => {
    cy.focused().should(($element) => expect($element[0].matches(':focus-visible')).to.be.true)
}

const saveMeasurementInformation = () => {
    const updatedMeasureName = `MAT10349 ${Date.now()}`

    cy.intercept('PUT', '/api/measures/**').as('saveMeasureInformation')
    cy.get(EditMeasurePage.measureNameTextBox).clear().type(updatedMeasureName)
    cy.get(EditMeasurePage.measurementInformationSaveButton).should('be.enabled').focus().should('have.focus')
    cy.realPress('Enter')
    return cy.wait('@saveMeasureInformation').then(({ request, response }) => {
        expect(request.body.measureName, 'measure name submitted by the Save button').to.eq(updatedMeasureName)
        expect(response?.statusCode, JSON.stringify(response?.body)).to.eq(200)
    })
}

const assertCmsIdHelpKeyboardOrder = () => {
    step('Verify CMS ID help has a named, focusable image role')
    cy.get(EditMeasurePage.cmsIdHelp)
        .should('have.attr', 'role', 'img')
        .and('have.attr', 'tabindex', '0')
        .and(
            'have.attr',
            'aria-label',
            'Once a CMS Identifier has been generated it may not be modified or removed for any draft or version of a measure.'
        )

    step('Verify the forward and reverse focus sequence between CMS ID help and Generate ID')
    cy.get(EditMeasurePage.cmsIdHelp).focus()
    cy.get(EditMeasurePage.cmsIdHelp).should('have.focus')
    cy.realPress('Tab')
    cy.get(EditMeasurePage.generateCmsIdButton).should('have.focus')
    assertFocusVisible()
    cy.realPress(['Shift', 'Tab'])
    cy.get(EditMeasurePage.cmsIdHelp).should('have.focus')
}

describe('MAT-10349 draft measure details read-only accessibility', () => {
    before('Create an owner draft measure with no CMS ID', () => createScenarioMeasure())

    beforeEach('Open the draft measure details page', openScenarioMeasure)

    after('Delete the scenario-owned draft measure', () => Utilities.deleteMeasure())

    it('has no axe violations on the CMS ID help control', () => {
        cy.get(EditMeasurePage.cmsIdHelp).then(($help) =>
            Accessibility.check($help[0], {
                runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
            })
        )
    })

    it('places the CMS ID help control before Generate ID in the tab order', () => {
        assertCmsIdHelpKeyboardOrder()
    })

    it('announces Completed for Name, Version & ID', () => {
        EditMeasurePage.leftPanelTabStatusIcon('Name, Version & ID').should('exist')
        EditMeasurePage.leftPanelTabScreenReaderStatus('Name, Version & ID').should('have.text', ', Completed')
    })

    it('announces Completed for Model & Measurement Period', () => {
        EditMeasurePage.leftPanelStatusIcon(EditMeasurePage.leftPanelModelAndMeasurementPeriod).should('exist')
        EditMeasurePage.leftPanelScreenReaderStatus(EditMeasurePage.leftPanelModelAndMeasurementPeriod).should(
            'have.text',
            ', Completed'
        )
    })

    it('announces Not completed for Steward & Developers', () => {
        EditMeasurePage.leftPanelStatusIcon(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        EditMeasurePage.leftPanelScreenReaderStatus(EditMeasurePage.leftPanelStewardDevelopers).should(
            'have.text',
            ', Not completed'
        )
    })

    it('announces Not completed for Description', () => {
        EditMeasurePage.leftPanelStatusIcon(EditMeasurePage.leftPanelDescription).should('exist')
        EditMeasurePage.leftPanelScreenReaderStatus(EditMeasurePage.leftPanelDescription).should(
            'have.text',
            ', Not completed'
        )
    })

    it('announces only the tab name when Rationale has no status icon', () => {
        cy.get(EditMeasurePage.leftPanelRationale).should('have.text', 'Rationale')
        EditMeasurePage.leftPanelStatusIcon(EditMeasurePage.leftPanelRationale).should('not.exist')
        EditMeasurePage.leftPanelScreenReaderStatus(EditMeasurePage.leftPanelRationale).should('not.exist')
    })
})

describe('MAT-10349 draft measure save accessibility', () => {
    beforeEach('Create and open an owner draft measure with no CMS ID', () => {
        createScenarioMeasure()
        return openScenarioMeasure()
    })

    afterEach('Delete the scenario-owned draft measure', () => Utilities.deleteMeasure())

    it('tabs to the successful save message Close control and closes it by keyboard', () => {
        saveMeasurementInformation()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg)
            .should('be.visible')
            .and('have.text', 'Measurement Information Updated Successfully')

        step('Tab to the successful save message Close control and activate it')
        cy.realPress('Tab')
        cy.get(EditMeasurePage.successfulMeasureSaveCloseButton)
            .should('be.enabled')
            .then(($closeButton) =>
                cy.focused().then(($focused) =>
                    expect($focused[0], 'focused element after Tab from the successful save message').to.equal(
                        $closeButton[0]
                    )
                )
            )
        cy.realPress('Enter')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('not.exist')
    })

    it('returns keyboard focus to Skip to main content after a successful save message is closed', () => {
        saveMeasurementInformation()
        cy.get(EditMeasurePage.successfulMeasureSaveMsg)
            .should('be.visible')
            .and('have.text', 'Measurement Information Updated Successfully')

        step('Tab to the successful save message Close control and activate it')
        cy.realPress('Tab')
        cy.get(EditMeasurePage.successfulMeasureSaveCloseButton)
            .should('be.enabled')
            .then(($closeButton) =>
                cy.focused().then(($focused) =>
                    expect($focused[0], 'focused element after Tab from the successful save message').to.equal(
                        $closeButton[0]
                    )
                )
            )
        cy.realPress('Enter')
        cy.get(EditMeasurePage.successfulMeasureSaveMsg).should('not.exist')

        step('Tab from the closed save message to Skip to main content')
        cy.realPress('Tab')
        cy.get(Header.skipToMainContent, { timeout: 5000 })
            .should('have.focus')
            .and('contain.text', 'Skip to main content')
    })
})
