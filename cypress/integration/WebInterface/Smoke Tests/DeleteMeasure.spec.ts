import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"

let measureName = ''
let CqlLibraryName = ''

describe('Delete Measure', () => {

    beforeEach('Create Measure', () => {

        measureName = 'TestMeasure' + Date.now()
        CqlLibraryName = 'TestLibrary' + Date.now()
        let measureScoringArray = ['Ratio', 'Cohort', 'Continuous Variable', 'Proportion']

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoringArray[3])
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()

    })

    it('Verify Measure Owner can Delete Measure', () => {

        OktaLogin.Login()

        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.deleteMeasureButton).click()
        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureName + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()

        cy.get(EditMeasurePage.successfulMeasureDeleteMsg).should('contain.text', 'Measure successfully deleted')

        //Verify the deleted measure doesn't exists on My Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        //Verify the deleted measure doesn't exists on All Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

    })

    it('Verify Non Measure Owner can not Delete Measure', () => {

        //Log in as a different User
        OktaLogin.AltUserLogin()

        //Verify the Measure on My Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        //Verify the Measure on All Measures Page List
        cy.get(MeasuresPage.measureListTitles).should('contain', measureName)

        MeasuresPage.clickEditforCreatedMeasure()

        //Delete Measure Button should not be visible for non owner of the Measure
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.exist')

    })
})