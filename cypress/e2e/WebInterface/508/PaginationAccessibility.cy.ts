import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Accessibility } from '../../../support/accessibility'
import { step } from '../../../utils/step'

const pagination = '.pagination-container'
const paginationButtons = `${pagination} button`

const accessibleName = ($element: JQuery<HTMLElement>) => {
    const ariaLabel = $element.attr('aria-label')?.trim()
    if (ariaLabel) {
        return ariaLabel
    }

    const labelledBy = $element.attr('aria-labelledby')?.trim().split(/\s+/) ?? []
    return labelledBy
        .map((id) =>
            Cypress.$(`#${CSS.escape(id)}`)
                .text()
                .trim()
        )
        .filter(Boolean)
        .join(' ')
}

// MAT-10358
describe('Pagination controls accessibility', () => {
    beforeEach('Open the Measure List pagination', () => {
        OktaLogin.SessionLogin()
        cy.visit('/measures')
        cy.get(MeasuresPage.measureListTitles).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab)
            .filter(':visible')
            .first()
            .click()
            .should('have.attr', 'aria-selected', 'true')
        cy.get(pagination).should('be.visible')
        return Accessibility.injectAxe()
    })

    it('gives the Items Per Page combobox a valid accessible name, role, and state', () => {
        step('Verify the Items Per Page combobox role, state, and accessible name')
        cy.get(MeasuresPage.paginationLimitSelect)
            .should('be.visible')
            .and('have.attr', 'role', 'combobox')
            .and('have.attr', 'aria-expanded', 'false')
            .and(($combobox) => {
                expect(accessibleName($combobox), 'Items Per Page accessible name').to.match(/items per page/i)
            })
    })

    it('operates the Items Per Page combobox using only the keyboard', () => {
        step('Focus the Items Per Page combobox')
        cy.get(MeasuresPage.paginationLimitSelect).should('be.visible').focus().should('have.focus')

        step('Open and close the combobox using only the keyboard')
        cy.realPress('Enter')
        cy.get(MeasuresPage.paginationLimitSelect).should('have.attr', 'aria-expanded', 'true')
        cy.realPress('Escape')
        cy.get(MeasuresPage.paginationLimitSelect).should('have.attr', 'aria-expanded', 'false')
    })

    it('gives every displayed navigation and page-number control a valid name, role, and state', () => {
        step('Verify every displayed pagination button exposes its native role and a meaningful name')
        cy.get(paginationButtons)
            .should('have.length.greaterThan', 0)
            .each(($button) => {
                expect($button.prop('tagName'), 'pagination control native role').to.equal('BUTTON')
                expect(
                    accessibleName($button),
                    `${$button.attr('aria-label') || $button.text()} accessible name`
                ).not.to.equal('')
            })

        step('Verify exactly one page exposes the current-page state')
        cy.get(`${paginationButtons}[aria-current="page"]`)
            .should('have.length', 1)
            .and(($currentPage) => {
                expect(accessibleName($currentPage), 'current-page accessible name').not.to.equal('')
            })
    })

    it('follows logical keyboard order and operates enabled pagination controls', () => {
        const enabledControls = `${MeasuresPage.paginationLimitSelect}, button:not(:disabled)`

        step('Tab through every enabled pagination control in DOM order')
        cy.get(pagination)
            .find(enabledControls)
            .filter(':visible')
            .then(($controls) => {
                expect($controls.length, 'enabled pagination controls').to.be.greaterThan(1)
                cy.wrap($controls.eq(0)).focus().should('have.focus')

                for (let index = 1; index < $controls.length; index += 1) {
                    cy.realPress('Tab')
                    cy.wrap($controls.eq(index)).should('have.focus')
                }
            })

        step('Activate Next with the keyboard and verify the current page changes')
        cy.get(`${paginationButtons}[aria-current="page"]`)
            .invoke('text')
            .then((startingPage) => {
                cy.get(`${paginationButtons}[aria-label*="next" i]`).should('be.enabled').focus().realPress('Enter')
                cy.get(`${paginationButtons}[aria-current="page"]`).should('not.have.text', startingPage.trim())
            })
    })

    it('has no WCAG A or AA violations within the pagination component', () => {
        step('Scan the complete pagination component')
        Accessibility.check(pagination, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        })
    })
})
