import {OktaLogin} from "../../../Shared/OktaLogin"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"
import {Header} from "../../../Shared/Header"
import {Utilities} from "../../../Shared/Utilities"

describe('Create CQL Library', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Navigate to CQL Library Page and create New QI-Core  CQL Library', () => {

        let CQLLibraryName = 'QICoreCQLLibrary' + Date.now()
        let CQLLibraryPublisher = 'SemanticBits'

        CQLLibraryPage.createCQLLibrary(CQLLibraryName, CQLLibraryPublisher)
    })

    it('Navigate to CQL Library Page and create New QDM CQL Library', () => {

        let CQLLibraryName = 'QDMCQLLibrary' + Date.now()
        let CQLLibraryPublisher = 'SemanticBits'

        cy.get(Header.cqlLibraryTab).should('be.visible')

        cy.intercept('GET', '/api/cql-libraries?currentUser=true').as('libraries')

        cy.get(Header.cqlLibraryTab).click()

        cy.wait('@libraries', { timeout: 60000 })

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.newCQLLibName).should('be.visible')
        cy.get(CQLLibraryPage.newCQLLibName).type(CQLLibraryName)
        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, CQLLibraryPage.cqlLibraryModelQDM)
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('description')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type(CQLLibraryPublisher).type('{downArrow}{enter}')

        CQLLibraryPage.clickCreateLibraryButton()
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        CQLLibraryPage.validateCQlLibraryName(CQLLibraryName)
        CQLLibraryPage.validateCQlLibraryModel('QDM v5.6')
        cy.log('QDM CQL Library Created Successfully')
    })
})
