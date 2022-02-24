import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TopNav} from "../../../Shared/TopNav"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'
let updatedMeasureName = 'UpdatedTestMeasure' + Date.now()

describe('Edit Measure', () => {
    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('Edit Measure Name and verify the measure name is updated on Measures page', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName,CqlLibraryName,measureScoring)

        //Edit Measure Name
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.editMeasurePen).click()
        cy.get(EditMeasurePage.editMeasureTextBox).clear()
        cy.wait(100)
        cy.get(EditMeasurePage.editMeasureTextBox).type(updatedMeasureName)
        cy.get(EditMeasurePage.saveEditedMeasureName).click()

        //Add Measure Steward
        cy.get(EditMeasurePage.measureStewardLeftNavTab).contains('Steward/Author').click()
        cy.get(EditMeasurePage.measureStewardTextBox).clear().type('SB')
        cy.get(EditMeasurePage.measureStewardSaveButton).click()
        cy.get(EditMeasurePage.measureStewardConfirmaionText).should('contain.text', 'Measure Steward Information Saved Successfully')

        //Navigate back to Measures page and verify if the Measure Name is updated
        cy.get(TopNav.measureTab).click()
        MeasuresPage.validateMeasureName(updatedMeasureName)

    })
})