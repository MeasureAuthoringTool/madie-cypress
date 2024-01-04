import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {Utilities} from "../../../Shared/Utilities"

let measureName = ''
let CqlLibraryName = ''

describe('Create New Measure', () => {

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Cleanup and Logout', () => {

        //Delete Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.deleteMeasureButton).click()
        cy.get(EditMeasurePage.deleteMeasureConfirmationMsg).should('contain.text', 'Are you sure you want to delete ' + measureName + '?')
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()

        cy.get(EditMeasurePage.successfulMeasureDeleteMsg).should('contain.text', 'Measure successfully deleted')

        //Verify the deleted measure on My Measures page list
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        //Verify the deleted measure on All Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        OktaLogin.Logout()
    })

    it('Create QI Core Measure', () => {

        measureName = 'QICoreTestMeasure' + Date.now()
        CqlLibraryName = 'QICoreTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName,CqlLibraryName)

    })

    it('Create QDM Measure', () => {

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'QDMTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasure(measureName,CqlLibraryName)

    })
})
