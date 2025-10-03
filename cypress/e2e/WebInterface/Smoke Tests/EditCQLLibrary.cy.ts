import { OktaLogin } from "../../../Shared/OktaLogin"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { Header } from "../../../Shared/Header"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"

const CQLLibraryName = 'SmokeEditLibrary' + Date.now()
const updatedCQLLibraryName = 'UpdatedSELibrary' + Date.now()
const CQLLibraryPublisher = 'SemanticBits'

describe('Smoke test - Edit CQL Library', () => {

    before('Create Library', () => {

        CQLLibraryPage.createCQLLibraryAPI(CQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)
    })

    afterEach('Logout', () => {
        OktaLogin.UILogout()
    })

    it('Edit CQL Library Name and verify the library is updated on CQL Library page', () => {

        //Edit CQL Library Name
        CQLLibrariesPage.clickEditforCreatedLibrary()

        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).should('have.value', CQLLibraryName)
        cy.get(CQLLibraryPage.cqlLibraryNameTextbox).clear().type(updatedCQLLibraryName)
        cy.get(CQLLibraryPage.updateCQLLibraryBtn).click()

        cy.get(CQLLibraryPage.genericSuccessMessage).should('be.visible')
            .and('have.text', 'CQL updated successfully')

        cy.log('CQL Library Updated Successfully')

        //Navigate back to CQL Library page and verify if the Library Name is updated
        cy.get(Header.cqlLibraryTab).click()

        CQLLibrariesPage.validateCQLLibraryName(updatedCQLLibraryName)
    })
})
