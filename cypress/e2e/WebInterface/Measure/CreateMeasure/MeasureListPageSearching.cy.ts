import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()

describe('Measure List Page Searching', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('Measure search on My Measures and All Measures tab', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName, CqlLibraryName)

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(measureName).wait(1000).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(1)').should('contain', measureName)

        //Search for the Measure under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).wait(1000).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(1)').should('contain', measureName)

        //Search for the Measure using eCQMTitle
        cy.log('Search Measure with eCQM Title')
        cy.get(LandingPage.myMeasuresTab).wait(1000).click()
        cy.get(MeasuresPage.searchInputBox).clear().type('eCQMTitle01').wait(1000).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(1)').should('contain', measureName)
        MeasuresPage.measureAction("edit")
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('have.value', 'eCQMTitle01')

        //Delete the Measure & search for deleted Measure under My Measures tab
        cy.log('Delete Measure')
        cy.get(EditMeasurePage.deleteMeasureButton).click()
        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureName + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).wait(1000).click()
        cy.get(EditMeasurePage.successfulMeasureDeleteMsg).should('contain.text', 'Measure successfully deleted')

        //Search for Deleted Measure
        cy.log('Search for Deleted Measure')
        cy.get(MeasuresPage.searchInputBox).type(measureName).wait(1000).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(1)').should('not.exist')

        //Search for deleted Measure under All Measures tab
        cy.log('Search for Deleted Measure under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.reload()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).wait(1000).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(1)').should('not.exist')

    })

    it('Verify warning message on Measure list page', () => {

        //commenting out until bug MAT-5486 is fixed
        //Warning Message on My Measures page
        /*         cy.get(MeasuresPage.searchInputBox).type('!@#$').wait(2000).type('{enter}')
                cy.get('[data-testid="generic-error-text-header"]').should('contain.text', 'Unable to search measures')
                cy.get('[data-testid="generic-error-text-sub-header"]').should('contain.text', 'Please reach out to MADiE helpdesk for assistance.') */

        //Warning Message on All Measures page
        cy.get(MeasuresPage.allMeasuresTab).wait(1000).click()
        cy.get(MeasuresPage.searchInputBox).clear().type('&%*').wait(2000).type('{enter}')
        cy.get('[data-testid="generic-error-text-header"]').should('contain.text', 'Unable to search measures')
        cy.get('[data-testid="generic-error-text-sub-header"]').should('contain.text', 'Please reach out to MADiE helpdesk for assistance.')

    })
})
