import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Header } from "../../../Shared/Header"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"

let CQLLibraryName = 'TestLibrary' + Date.now()
let updatedCQLLibraryName = 'UpdatedTestLibrary' + Date.now()
let CQLLibraryPublisher = 'SemanticBits'

describe('Edit Measure', () => {
    before('Create Measure', () => {

        //Create CQL Library
        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
        cy.reload()

    })

    afterEach('Logout', () => {
        OktaLogin.UILogout()
    })

    it('Edit CQL Library Name and verify the library is updated on CQL Library page', () => {
        cy.reload()
        //Edit CQL Library Name
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get('[id="measures-main-nav-bar-tab"]').click()
        //Edit CQL Library Name
        CQLLibrariesPage.clickEditforCreatedLibrary()
        cy.reload()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).wait(1000).clear()
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')

        cy.log('CQL Library Updated Successfully')

        //Navigate back to CQL Library page and verify if the Library Name is updated
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.validateCQLLibraryName(updatedCQLLibraryName)
    })
})
