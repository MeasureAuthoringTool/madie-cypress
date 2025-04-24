import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Header } from "../../../Shared/Header"
import { Utilities } from "../../../Shared/Utilities"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"

let CQLLibraryName = ''
let CQLLibraryPublisher = ''
let model = ''

describe('Create CQL Library', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteLibrary(CQLLibraryName)

    })

    it('Navigate to CQL Library Page and create New QI-Core  CQL Library', () => {

        CQLLibraryName = 'QICoreCQLLibrary' + Date.now()
        CQLLibraryPublisher = 'SemanticBits'

        CQLLibraryPage.createCQLLibrary(CQLLibraryName, CQLLibraryPublisher)
    })

    it('Navigate to CQL Library Page and create New QDM CQL Library', () => {

        CQLLibraryName = 'QDMCQLLibrary' + Date.now()
        CQLLibraryPublisher = 'SemanticBits'
        model = 'QDM v5.6'

        cy.get(Header.cqlLibraryTab).should('be.visible')

        cy.get(Header.cqlLibraryTab).click().wait(1500)

        Utilities.waitForElementEnabled(CQLLibraryPage.createCQLLibraryBtn, 60000)

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
        Utilities.waitForElementToNotExist('[class="toast success"]', 60000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.validateCQLLibraryName(CQLLibraryName)
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            cy.get('[data-testid=cqlLibrary-button-' + fileContents + '-model-content]').should('contain', model)

        })

        cy.log('QDM CQL Library Created Successfully')
    })
})
