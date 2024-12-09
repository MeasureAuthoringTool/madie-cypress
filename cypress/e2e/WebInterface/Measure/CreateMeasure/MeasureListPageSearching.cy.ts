import { OktaLogin } from "../../../../Shared/OktaLogin"
import {CreateMeasurePage, SupportedModels} from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { Utilities } from "../../../../Shared/Utilities";

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
        CreateMeasurePage.CreateQICoreMeasure(measureName, CqlLibraryName, SupportedModels.qiCore4)

        //Search for the Measure using Measure name
        cy.log('Search Measure with measure name')
        cy.get(MeasuresPage.searchInputBox).type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Search for the Measure under All Measures tab
        cy.log('Search Measure with measure name under All Measures tab')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type(measureName).type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)

        //Search for the Measure using eCQMTitle
        cy.log('Search Measure with eCQM Title')
        cy.get(LandingPage.myMeasuresTab).click()
        cy.get(MeasuresPage.searchInputBox).clear().type('eCQMTitle01').type('{enter}')
        cy.get('[data-testid="row-item"] > :nth-child(2)').should('contain', measureName)
        MeasuresPage.actionCenter('edit')
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).should('have.value', 'eCQMTitle01')

        //Delete the Measure & search for deleted Measure under My Measures tab
        cy.log('Delete Measure')
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
})
