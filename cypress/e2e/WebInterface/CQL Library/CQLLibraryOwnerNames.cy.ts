import { CQLLibrariesPage } from "../../../Shared/CQLLibrariesPage"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"
import { SupportedModels } from "../../../Shared/CreateMeasurePage"
import { Header } from "../../../Shared/Header"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { Utilities } from "../../../Shared/Utilities"

const CqlLibraryName = 'LibraryOwnerNamesDisplay' + Date.now()

describe('Library Owner Names Display', () => {


    before('Login', () => {

        CQLLibraryPage.createLibraryAPI(CqlLibraryName, SupportedModels.qiCore6, null)
    })

    it('Making a new CQL Library shows the username on All Libraries tabs & on the Details screen', () => {
        const harpId = OktaLogin.getUser(false)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        cy.get(CQLLibraryPage.allLibrariesTab).click()

        cy.readFile('cypress/fixtures/accountRealNames.json').should('exist').then((nameData) => {

            const expectedName = nameData[harpId] as string

            cy.get('[data-testid="cqlLibrary-button-0_Owner"]').should('contain.text', expectedName)

            CQLLibrariesPage.clickEditforCreatedLibrary()

            cy.get('[data-testid="library-owner-text-field"]').should('have.text', expectedName)
        })
    })

    it('Viewing an old PROD Library shows the harpId on All Libraries tabs & - on the Details screen', () => {

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        cy.get(CQLLibraryPage.allLibrariesTab).click()

        Utilities.dropdownSelect(CQLLibraryPage.filterByDropdown, 'Library')
        cy.get(CQLLibraryPage.LibFilterTextField).clear().type('PBDHospiceQDM{enter}')

        cy.get('[data-testid="cqlLibrary-button-0_Owner"]').should('contain.text', 'pauld@mitre.org')

        cy.contains('View').click()

        cy.get('[data-testid="library-owner-text-field"]').should('have.text', '-')
    })

})