import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'
let userToken = 'default'

describe('Edit Measure Name Validations', () => {
    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring, userToken)

    })

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('Verify error messages when the edit measure name entered is invalid', () => {

        //Click on Edit Button, Verify error message when the Measure Name field is empty
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.editMeasurePen).click()
        cy.get(EditMeasurePage.editMeasureTextBox).clear()
        cy.get(EditMeasurePage.editMeasureSaveButton).click()
        cy.get(EditMeasurePage.editMeasureFieldLevelError).should('contain.text', 'A measure name is required.')

        //Verify error message when the Edit Measure Name doesn't contain alphabets
        cy.get(EditMeasurePage.editMeasureCancelButton).click()
        cy.get(EditMeasurePage.editMeasurePen).click()
        cy.get(EditMeasurePage.editMeasureTextBox).clear().type('66777')
        cy.get(EditMeasurePage.editMeasureSaveButton).click()
        cy.get(EditMeasurePage.editMeasureFieldLevelError).should('contain.text', 'A measure name must contain at least one letter.')

        //Verify error message when the Measure Name has '_'
        cy.get(EditMeasurePage.editMeasureCancelButton).click()
        cy.get(EditMeasurePage.editMeasurePen).click()
        cy.get(EditMeasurePage.editMeasureTextBox).clear().type('Test_Measure')
        cy.get(EditMeasurePage.editMeasureSaveButton).click()
        cy.get(EditMeasurePage.editMeasureFieldLevelError).should('contain.text', 'Measure Name must not contain \'_\' (underscores).')

        //Verify error message when the Measure Name has more than 500 characters
        cy.get(EditMeasurePage.editMeasureCancelButton).click()
        cy.get(EditMeasurePage.editMeasurePen).click()
        cy.get(EditMeasurePage.editMeasureTextBox).clear().type('This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is')
        cy.get(EditMeasurePage.editMeasureSaveButton).click()
        cy.get(EditMeasurePage.editMeasureFieldLevelError).should('contain.text', 'A measure name cannot be more than 500 characters.')

    })
})