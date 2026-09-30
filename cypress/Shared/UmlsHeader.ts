import { Header } from './Header'

export class UmlsHeader {
    public static openMenu(): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.get(Header.userUmlsSelect).then(($select) => {
            if ($select.attr('aria-expanded') !== 'true') {
                cy.wrap($select).click()
            }
        })

        return cy.get(Header.userUmlsMenuList).should('be.visible')
    }

    public static closeMenu(): Cypress.Chainable<JQuery<HTMLBodyElement>> {
        cy.get('body').type('{esc}')
        return cy
            .get('body')
            .should(($body) => expect($body.find(`${Header.userUmlsMenuList}:visible`)).to.have.length(0))
    }

    public static disconnect(): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.get(Header.umlsLogOutOption).should('be.visible').click()
        cy.get(Header.umlsLogOutConfirmDialogMsg).should('be.visible')
        return cy.get(Header.umlsLogOutConfirmContinue).should('be.visible').click()
    }

}
