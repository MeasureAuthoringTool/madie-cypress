import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"

const now = Date.now()
const measureName = 'QICore4TestMeasure with an incredibly long name for no apparent reason \
other than just to test the limits of the system' + now + now
const CqlLibraryName = 'LongNameLib' + now

describe('Create New Measure with very long name', () => {

    beforeEach('Login', () => {
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 11500)
    })

    afterEach('Cleanup and Logout', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Create QI Core 4.1.1 Measure', () => {
        let currentUser = Cypress.env('selectedUser')
        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.qiCore4)
        cy.get(Header.mainMadiePageButton).click()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_measureName"]', 30000)
            cy.get('[data-testid="measure-name-' + fileContents + '_measureName"]').should('have.text', measureName.slice(0, 120) + 'Show more')

            cy.get('[data-testid="measure-name-' + fileContents + '_measureName"]').find('button').click()

            cy.get('[data-testid="measure-name-' + fileContents + '_measureName"]').should('have.text', measureName + 'Show less')
        })

        MeasuresPage.actionCenter('edit')

        cy.get('[data-testid="more-measure-name-button"]').should('have.text', '...' + measureName)
    })
})
