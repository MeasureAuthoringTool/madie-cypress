import { Header } from "../../../Shared/Header"
import { Utilities } from "../../../Shared/Utilities"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"

let CQLLibraryName = 'TestLibrary' + Date.now()
let CQLLibraryPublisher = 'ICF'
let CQLLibraryNameWithUnderscore = 'Test_Library' + Date.now()
let updatedCQLLibraryName = 'Updated_TestLibrary' + Date.now()

describe('QDM CQL Library Validations', () => {

    before('Create QDM Library', () => {

        CQLLibraryPage.createQDMCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)

    })

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Verify _ is allowed while creating QDM CQL Library', () => {

        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementVisible(CQLLibraryPage.LibFilterTextField, 60000)

        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.visible')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).should('be.enabled')
        cy.get(CQLLibraryPage.createCQLLibraryBtn).click()

        //Add CQL Library name with _
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(CQLLibraryNameWithUnderscore)
        cy.get(CQLLibraryPage.cqlLibraryModelDropdown).wait(1000).click()
        cy.get(CQLLibraryPage.cqlLibraryModelQDM).click()

        //enter description detail
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryDesc).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryDesc).type('Some random data')

        //enter / select a publisher value
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type('SemanticBits')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type('{downArrow}').type('{enter}')

        CQLLibraryPage.clickCreateLibraryButton()
        cy.get('[class="toast success"]').should('contain.text', 'Cql Library successfully created')
    })

    it('Verify _ is allowed while editing QDM CQL Library name', () => {

        cy.get(Header.cqlLibraryTab).wait(1000).click()

        //Click Edit CQL Library
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.currentCQLLibName).clear().type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()
        cy.get(CQLLibraryPage.genericSuccessMessage).should('contain.text', 'CQL updated successfully')

    })

})
