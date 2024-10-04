import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"

let measureOne = ''
let CqlLibraryOne = ''
let measureTwo = ''
let CqlLibraryTwo = ''

describe('Delete Measure', () => {

    beforeEach('Create measure and Login', () => {

        //Create Measure with Regular User
        measureOne = 'TestMeasure1' + Date.now()
        CqlLibraryOne = 'TestLibrary1' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureOne, CqlLibraryOne)
        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Verify Measure Owner can Delete Measure', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.deleteMeasureButton).click()
        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureOne + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()

        cy.get(EditMeasurePage.successfulMeasureDeleteMsg).should('contain.text', 'Measure successfully deleted')

        //Verify the deleted measure on My Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureOne)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        //Verify the deleted measure on All Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureOne)

    })

    //Skipping until feature flag 'MeasureListButtons' is removed
    it.skip('Verify Measure Owner can Delete Measure through Action center', () => {

        MeasuresPage.actionCenter('delete')

        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureOne + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()

        cy.get('[class="toast success"]').should('contain.text', 'Measure successfully deleted')

        //Verify the deleted measure on My Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureOne)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        //Verify the deleted measure on All Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureOne)

    })
})

describe('Delete Measure ownership validation', () => {

    beforeEach('Create measure and Login as ALT User', () => {

        //Create Measure with Regular User
        measureTwo = 'TestMeasure2' + Date.now()
        CqlLibraryTwo = 'TestLibrary2' + Date.now()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureTwo, CqlLibraryTwo)
        OktaLogin.AltLogin()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureTwo, CqlLibraryTwo)
    })

    it('Verify Non Measure Owner can not Delete Measure', () => {

        //Verify the Measure on My Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureTwo)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.actionCenter("edit")

        //Delete Measure Button should not be visible for non owner of the Measure
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.be.enabled')

    })

    //Skipping until feature flag 'MeasureListButtons' is removed
    it.skip('Verify Non Measure Owner can not Delete Measure through Action center', () => {

        //Verify the Measure on My Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureTwo)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        })

        cy.get('[data-testid="delete-action-btn"]').should('not.be.enabled')

    })
})
