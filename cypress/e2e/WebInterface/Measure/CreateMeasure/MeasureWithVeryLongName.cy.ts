import { OktaLogin } from "../../../../Shared/OktaLogin"
import {CreateMeasurePage, SupportedModels} from "../../../../Shared/CreateMeasurePage"
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

        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.deleteMeasureConfirmationButton, 5000)
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 5000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', "Measure successfully deleted")

        //Verify the deleted measure on My Measures page list
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        OktaLogin.Logout()
    })

    it('Create QI Core 4.1.1 Measure', () => {

        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.qiCore4)
        cy.get(Header.mainMadiePageButton).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_measureName"]', 5000)
            cy.get('[data-testid="measure-name-' + fileContents + '_measureName"]').should('have.text', measureName.slice(0,120) + 'Show more')
            
            cy.get('[data-testid="measure-name-' + fileContents + '_measureName"]').find('button').click()
     
            cy.get('[data-testid="measure-name-' + fileContents + '_measureName"]').should('have.text', measureName + 'Show less')
        })

        MeasuresPage.actionCenter('edit')

        cy.get('[data-testid="more-measure-name-button"]').should('have.text', '...' + measureName)
    })
})
