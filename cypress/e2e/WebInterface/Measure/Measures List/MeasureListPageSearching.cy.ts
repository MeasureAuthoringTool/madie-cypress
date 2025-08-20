import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { Utilities } from "../../../../Shared/Utilities";

let measureName = 'MeasureSearch' + Date.now()
let CqlLibraryName = 'MeasureSearchLib' + Date.now()

// written for MeasureSearch = true, skipping until that ff is enabled in 2.3.0
describe.skip('Measure List Page Searching', () => {

    beforeEach('Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 39500)
    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('Measure search on My Measures and All Measures tab', () => {

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Search for the Measure under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Delete the Measure & search for deleted Measure under Owned Measures tab
        cy.log('Delete Measure')
        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureName + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        cy.get(EditMeasurePage.successfulMeasureDeleteMsg).should('contain.text', 'Measure successfully deleted')

        //Search for Deleted Measure
        cy.log('Search for Deleted Measure')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')

        //Search for deleted Measure under All Measures tab
        cy.log('Search for Deleted Measure under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')

    })

    it('Verify warning message on Measure list page', () => {

        //Warning Message on My Measures page
        cy.get(MeasuresPage.searchInputBox).type('!@#$').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')

        //Warning Message on All Measures page
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type('&%*').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('not.exist')
    })

    it('When searching, page count always resets to 1', () => {

        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.wait(5500)

        cy.get('.pagination-container').contains('button', '6').click()
        cy.url().should('include','page=6')

        cy.get(MeasuresPage.searchInputBox).clear().type('dental{enter}')
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)

        cy.contains('75FHIR').should('be.visible')

        cy.url().should('include','page=1')
        cy.get('.pagination-container').contains('button', '1').should('have.class', 'Mui-selected')
    })
})
