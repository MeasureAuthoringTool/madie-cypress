import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { Utilities } from "../../../../Shared/Utilities"

const measureName = 'MeasureOwnerNamesDisplay' + Date.now()
const CqlLibraryName = 'MeasureOwnerNamesDisplayLib' + Date.now()

describe('Measure Owner Names Display', () => {


    before('Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
    })

    after('Logout', () => {

        Utilities.deleteMeasure()
    })

    it('Making a new measure shows the username on All Measures tabs & on the Details screen', () => {
        const currentUser = Cypress.env('selectedUser')
        const harpId = OktaLogin.getUser(false)

        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)

        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((id) => {
            cy.readFile('cypress/fixtures/accountRealNames.json').should('exist').then((nameData) => {

                const expectedName = nameData[harpId] as string

                cy.get('[data-testid="measure-owner-' + id + '-content"]').find('span').should('contain.html', expectedName)

                MeasuresPage.actionCenter('edit')

                cy.get('[data-testid="measure-owner-text-field"]').should('have.text', expectedName)
            })
        })
    })

    it('Viewing an old PROD measure shows the harpId on All Measures tabs & - on the Details screen', () => {

        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)

        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)

        cy.get(MeasuresPage.filterByDropdown).click()
        cy.get(MeasuresPage.filterCMSIdOption).click()
        cy.get(MeasuresPage.filterByDropdown).should('contain', 'CMS ID')
        cy.get(MeasuresPage.searchInputBox).should('be.empty')

        cy.get(MeasuresPage.searchInputBox).type('1290').type('{enter}')

        cy.get('[data-testid*="_ownerDisplayName"]').find('span').should('contain.html', 'gcwinters808')

        cy.contains('View').click()

        cy.get('[data-testid="measure-owner-text-field"]').should('have.text', '-')
    })

})