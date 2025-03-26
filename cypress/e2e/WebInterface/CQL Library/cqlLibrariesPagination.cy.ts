import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"
import { Header } from "../../../Shared/Header"
import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasuresPage } from "../../../Shared/MeasuresPage";

let apiCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'

describe('Validate QDM CQL on CQL Library page', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'QdmValidationsLib' + Date.now()

        CQLLibraryPage.createQDMCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })
    it('Verify Pagination for "All CQL Libraries"', () => {

        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.allLibrariesBtn, 5000)
        cy.get(CQLLibraryPage.allLibrariesBtn).click().wait(2000)
        //Verify URL before clicking on Next button
        cy.url().should('not.include', 'page=2')
        //Click on Next Button
        cy.get(MeasuresPage.paginationNextButton).click({ force: true })
        //Verify if Next Page loaded
        cy.url().should('include', 'page=2')

        //Click on Previous Button
        cy.get(MeasuresPage.paginationPreviousButton).click()
        //Verify if Previous Page loaded
        cy.url().should('include', 'page=1')

        //Verify pagination limit before change
        cy.get(MeasuresPage.paginationLimitSelect).should('contain', '10')
        cy.get(MeasuresPage.paginationLimitSelect).click()
        Utilities.waitForElementVisible('[data-value="10"]', 50000)
        Utilities.waitForElementVisible('[data-value="25"]', 50000)
        Utilities.waitForElementVisible('[data-value="50"]', 50000)
        //Change pagination limit to 25
        cy.get(MeasuresPage.paginationLimitEquals25).click({ force: true })
        //Verify pagination limit after change
        cy.get(MeasuresPage.paginationLimitSelect).should('contain', '25')
    })
})

describe('Validate Qi-Core CQL on CQL Library page', () => {

    beforeEach('Create CQL library', () => {

        apiCQLLibraryName = 'CqlValidationsLib' + Date.now()

        CQLLibraryPage.createCQLLibraryAPI(apiCQLLibraryName, CQLLibraryPublisher)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Verify Pagination for the "My CQL Libraries"', () => {

        cy.get(Header.cqlLibraryTab).click()
        //Verify URL before clicking on Next button
        cy.url().should('not.include', 'page=2')
        //Click on Next Button
        cy.get(MeasuresPage.paginationNextButton).click({ force: true })
        //Verify if Next Page loaded
        cy.url().should('include', 'page=2')

        //Click on Previous Button
        cy.get(MeasuresPage.paginationPreviousButton).click()
        //Verify if Previous Page loaded
        cy.url().should('include', 'page=1')

        //Verify pagination limit before change
        cy.get(MeasuresPage.paginationLimitSelect).should('contain', '10')
        cy.get(MeasuresPage.paginationLimitSelect).click()
        Utilities.waitForElementVisible('[data-value="10"]', 50000)
        Utilities.waitForElementVisible('[data-value="25"]', 50000)
        Utilities.waitForElementVisible('[data-value="50"]', 50000)
        //Change pagination limit to 25
        cy.get(MeasuresPage.paginationLimitEquals25).click({ force: true })
        //Verify pagination limit after change
        cy.get(MeasuresPage.paginationLimitSelect).should('contain', '25')
    })
})