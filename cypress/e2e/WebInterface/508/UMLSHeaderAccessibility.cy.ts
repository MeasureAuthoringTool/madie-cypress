import { Header } from '../../../Shared/Header'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { UmlsConnection } from '../../../Shared/UmlsConnection'
import { UmlsHeader } from '../../../Shared/UmlsHeader'
import { Accessibility } from '../../../support/accessibility'
import { step } from '../../../utils/step'

const assertAndScanUmlsMenu = (connected: boolean) => {
    cy.get(Header.userUmlsMenuList)
        .should('be.visible')
        .and('have.attr', 'role', 'listbox')
        .find('li li')
        .should('not.exist')
    cy.get(Header.userUmlsMenuOptions).should('have.attr', 'role', 'option')

    if (connected) {
        cy.get(Header.userUmlsMenuOptions).should('have.length', 2)
        cy.get(Header.umlsStatusOption)
            .should('have.text', 'UMLS Active')
            .and('have.attr', 'aria-disabled', 'true')
        cy.get(Header.umlsLogOutOption).should('have.text', 'Sign Out')
    } else {
        cy.get(Header.userUmlsMenuOptions)
            .should('have.length', 1)
            .and('have.attr', 'data-value', 'Connect to UMLS')
    }

    return Accessibility.check(Header.userUmlsMenu, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
    })
}

// MAT-10343
describe('UMLS header accessibility', () => {
    beforeEach('Log in and ensure the UMLS API connection is active', () => {
        OktaLogin.SessionLogin()
        return UmlsConnection.ensureConnected().then(() => Accessibility.injectAxe())
    })

    afterEach('Restore the UMLS API connection after any disconnected-state test', () => {
        return UmlsConnection.ensureConnected()
    })

    it('provides accessible names for the UMLS and profile selectors', () => {
        step('Verify both header comboboxes have accessible names')
        cy.get(Header.userUmlsSelect)
            .should('have.attr', 'role', 'combobox')
            .and('have.attr', 'aria-label', 'UMLS Select')
            .and('not.have.attr', 'aria-labelledby')
        Accessibility.check(Header.userUmlsSelect, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })

        cy.get(Header.userProfileSelect)
            .should('have.attr', 'role', 'combobox')
            .and('have.attr', 'aria-label', 'Profile Select')
            .and('not.have.attr', 'aria-labelledby')
        Accessibility.check(Header.userProfileSelect, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })

    it('provides an accessible disconnected UMLS menu', () => {
        step('Disconnect temporarily through the header and scan the disconnected UMLS menu')
        UmlsHeader.openMenu()
        UmlsHeader.disconnect()
        UmlsHeader.openMenu()
        assertAndScanUmlsMenu(false)
    })

    it('provides an accessible active UMLS menu', () => {
        step('Scan the UMLS menu after API setup confirms the active connection')
        UmlsHeader.openMenu()
        assertAndScanUmlsMenu(true)
    })

    it('supports keyboard navigation without trapping focus in the UMLS menu', () => {
        step('Reach the UMLS trigger from the profile selector by reverse Tab')
        cy.get(Header.userProfileSelect).focus().realPress(['Shift', 'Tab'])
        cy.get(Header.userUmlsSelect)
            .should('have.focus')
            .should(($select) => expect($select[0].matches(':focus-visible')).to.be.true)

        step('Advance from the UMLS trigger to the profile selector by Tab')
        cy.realPress('Tab')
        cy.get(Header.userProfileSelect).should('have.focus')

        step('Return to the UMLS trigger by reverse Tab')
        cy.realPress(['Shift', 'Tab'])
        cy.get(Header.userUmlsSelect).should('have.focus')

        step('Open the UMLS menu with Enter')
        cy.get(Header.userUmlsSelect).type('{enter}')
        cy.get(Header.userUmlsSelect).should('have.attr', 'aria-expanded', 'true')

        step('Navigate menu options by Arrow Down without activating an action')
        cy.focused().should('have.attr', 'role', 'option').type('{downarrow}')
        cy.focused().should('have.attr', 'role', 'option')

        step('Close the UMLS menu with Escape and return focus to its trigger')
        cy.get('body').type('{esc}')
        cy.get(Header.userUmlsMenuList).should('not.be.visible')
        cy.get(Header.userUmlsSelect)
            .should('have.focus')
            .and('have.attr', 'aria-expanded', 'false')

        step('Tab away from the closed menu to verify focus is not trapped')
        cy.realPress('Tab')
        cy.get(Header.userProfileSelect).should('have.focus')
        cy.realPress(['Shift', 'Tab'])
        cy.get(Header.userUmlsSelect).should('have.focus')

        step('Open the UMLS menu with Space and close it without a keyboard trap')
        cy.realPress('Space')
        cy.get(Header.userUmlsMenuList).should('be.visible')
        cy.get('body').type('{esc}')
        cy.get(Header.userUmlsSelect).should('have.focus').and('have.attr', 'aria-expanded', 'false')
    })
})
