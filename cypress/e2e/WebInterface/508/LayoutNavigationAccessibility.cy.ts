import { Header } from '../../../Shared/Header'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Accessibility } from '../../../support/accessibility'
import { step } from '../../../utils/step'

// MAT-10559
describe('layout navigation accessibility', () => {
    beforeEach('Log in and load the shared MADiE navigation', () => {
        OktaLogin.SessionLogin()
        return cy
            .get(Header.measures)
            .should('be.visible')
            .then(() => Accessibility.injectAxe())
    })

    it('uses list items as the only direct children of the main navigation list', () => {
        step('Verify the shared main-navigation list has only list-item children')
        cy.get(Header.mainNavigationList)
            .should('be.visible')
            .children()
            .should('have.length.at.least', 1)
            .each(($child) => {
                expect($child[0].tagName, 'main navigation direct child').to.equal('LI')
            })

        step('Scan the rendered shared navigation for the list-structure violation')
        return Accessibility.check(Header.mainNavigation, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
