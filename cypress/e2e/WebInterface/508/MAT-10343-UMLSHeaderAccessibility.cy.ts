import { Environment } from '../../../Shared/Environment'
import { Header } from '../../../Shared/Header'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { umlsLoginForm } from '../../../Shared/umlsLoginForm'
import { step } from '../../../utils/step'

describe('MAT-10343 UMLS header accessibility', () => {
    beforeEach('Log in without automatically connecting to UMLS', () => {
        OktaLogin.SessionLogin()
    })

    it('provides labelled UMLS and profile selectors with flat UMLS menus', () => {
        step('Verify both header comboboxes have accessible names')
        cy.injectAxe()

        cy.get(Header.userUmlsSelect)
            .should('have.attr', 'role', 'combobox')
            .and('have.attr', 'aria-label', 'UMLS Select')
            .and('not.have.attr', 'aria-labelledby')
        cy.checkA11y(Header.userUmlsSelect, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })

        cy.get(Header.userProfileSelect)
            .should('have.attr', 'role', 'combobox')
            .and('have.attr', 'aria-label', 'Profile Select')
            .and('not.have.attr', 'aria-labelledby')
        cy.checkA11y(Header.userProfileSelect, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })

        step('Return UMLS to the disconnected state when the shared test account is connected')
        cy.get(Header.userUmlsSelect).click()
        cy.get('body').then(($body) => {
            if ($body.find(Header.umlsLogOutOption).length) {
                cy.get(Header.umlsLogOutOption).should('be.visible').click()
                cy.get(Header.umlsLogOutConfirmDialogMsg).should('be.visible')
                cy.get(Header.umlsLogOutConfirmContinue).should('be.visible').click()
            }
        })

        step('Verify the disconnected UMLS menu exposes only Connect to UMLS')
        cy.get('body').then(($body) => {
            if (!$body.find(`${Header.userUmlsMenuList}:visible`).length) {
                cy.get(Header.userUmlsSelect).click()
            }
        })
        cy.get(Header.userUmlsMenuList).should('be.visible').find('li li').should('not.exist')
        cy.get(Header.userUmlsMenuOptions).should('have.length', 1).and('have.attr', 'data-value', 'Connect to UMLS')

        step('Open the UMLS connection dialog and authenticate')
        cy.get(Header.umlsConnectOption).should('be.visible').click()
        cy.get(umlsLoginForm.umlsForm).should('be.visible')
        cy.get(umlsLoginForm.apiTextInput)
            .should('be.enabled')
            .type(Environment.credentials().umls_API_KEY, { log: false })
        cy.get(umlsLoginForm.connectToUMLSButton).should('be.enabled').click()
        cy.get(umlsLoginForm.umlsConnectSuccessMsg)
            .should('be.visible')
            .and('contain.text', 'UMLS successfully authenticated')
        cy.get(umlsLoginForm.closeUMLSForm).should('be.visible').click()

        step('Verify the connected UMLS menu exposes status and Sign Out without nested list items')
        cy.get(Header.userUmlsSelect).click()
        cy.get(Header.userUmlsMenuList).should('be.visible').find('li li').should('not.exist')
        cy.get(Header.userUmlsMenuOptions).should('have.length', 2)
        cy.get(Header.umlsStatusOption).should('have.text', 'UMLS Active').click()
        cy.get(umlsLoginForm.umlsForm).should('not.exist')
        cy.get(Header.umlsLogOutOption).should('have.text', 'Sign Out')

        step('Sign out of UMLS through its confirmation dialog')
        cy.get(Header.umlsLogOutOption).click()
        cy.get(Header.umlsLogOutConfirmDialogMsg).should('be.visible')
        cy.get(Header.umlsLogOutConfirmContinue).should('be.visible').click()
        cy.get(Header.userUmlsSelect).click()
        cy.get(Header.userUmlsMenuOptions).should('have.length', 1).and('have.attr', 'data-value', 'Connect to UMLS')
    })
})
