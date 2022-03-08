import {OktaLogin} from "../../../Shared/OktaLogin"
import {Header} from "../../../Shared/Header"

describe('Navigate to CQL Library Page', () => {

    beforeEach('Login', () => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('Click on CQL Library Tab and Navigate to CQL Library Page', () => {

        cy.get(Header.cqlLibraryTab).click()
        cy.url().should('include', '/cql-libraries')
    })
})