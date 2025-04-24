import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"

let randValue = (Math.floor((Math.random() * 1000) + 1))
let measureName = ''
let CqlLibraryName = ''

describe('Edit Measure Validations', () => {
    before('Create Measure', () => {
        measureName = 'TestMeasure' + Date.now() + randValue
        CqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

    })

    beforeEach('Login', () => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify error messages when the edit measure name entered is invalid', () => {

        //Click on Edit Button, Verify error message when the Measure Name field is empty
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.measureNameTextBox).clear()
        cy.get(EditMeasurePage.measureNameTextBox).focus().blur()
        cy.get(EditMeasurePage.measureNameFieldLevelError).should('contain.text', 'A Measure name is required.')

        //Verify error message when the Edit Measure Name doesn't contain alphabets
        cy.get(EditMeasurePage.measureNameTextBox).type('66777')
        cy.get(EditMeasurePage.measureNameFieldLevelError).should('contain.text', 'A Measure name must contain at least one letter.')

        //Verify error message when the Measure Name has '_'
        cy.get(EditMeasurePage.measureNameTextBox).clear().type('Test_Measure')
        cy.get(EditMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name must not contain \'_\' (underscores).')

        //Verify error message when the Measure Name has more than 500 characters
        cy.get(EditMeasurePage.measureNameTextBox).clear().type('This test is for measure name validation.This test ' +
            'is for measure name validation.This test is for measure name validation.This test is for measure name ' +
            'validation.This test is for measure name validation.This test is for measure name validation.This test ' +
            'is for measure name validation.This test is for measure name validation.This test is for measure name ' +
            'validation.This test is for measure name validation.This test is for measure name validation.This test ' +
            'is for measure name validation.This test is')
        cy.get(EditMeasurePage.measureNameFieldLevelError).should('contain.text', 'A Measure name cannot be more than 500 characters.')

    })

    it('Verify error message when the eCQM abbreviated title entered is invalid or empty', () => {

        MeasuresPage.actionCenter('edit')

        //eCQM abbreviated title empty
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).clear().focus().blur()
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleFieldLevelError).should('contain.text', 'eCQM Abbreviated Title is required')

        //Verify if create measure button is disabled
        cy.get(EditMeasurePage.measurementInformationSaveButton).should('be.disabled')

        //eCQM abbreviated title more than 32 characters
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).clear().type('This test is for measure name validation.This test is')
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleFieldLevelError).should('contain.text', 'eCQM Abbreviated Title cannot be more than 32 characters')

        cy.get(EditMeasurePage.measurementInformationSaveButton).should('be.disabled')
    })

    it('Verify error message when the endorsement id is null or invalid', () => {

        MeasuresPage.actionCenter('edit')

        //Add invalid Endorser Number
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).click()
        cy.get(EditMeasurePage.endorsingOrganizationTextBox).type('CMS', { delay: 50 })
        cy.get('#endorser-listbox').contains('CMS Consensus Based Entity').click()
        cy.get(EditMeasurePage.endorsementNumber).type('23!@$')
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Endorser Number must be alpha numeric')

        //Add Endorsing Organization without Endorser Number
        cy.get(EditMeasurePage.endorsementNumber).clear()
        cy.get(EditMeasurePage.measurementInformationSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Endorser Number is Required')

    })
})

describe('Measurement Period Validations', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        measureName = 'TestMeasure' + Date.now() + randValue
        CqlLibraryName = 'MeasurementPeriodTestLibrary' + Date.now() + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpEnd).clear().type('01/01/1999')
        cy.get(EditMeasurePage.mpStart).clear().type('12/01/2022')
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Measurement period ' +
            'end date should be greater than measurement period start date.')

    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpStart).type('{selectall}{backspace}{backspace}{backspace}')
        cy.get(EditMeasurePage.mpStart).focus().blur()
        cy.get(CreateMeasurePage.editMeasurementPeriodStartDateError).should('contain.text', 'Measurement period start date is required')
        cy.get(EditMeasurePage.mpEnd).type('{selectall}{backspace}{backspace}{backspace}')
        cy.get(EditMeasurePage.mpEnd).focus().blur()
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Measurement period end date is required')
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpStart).clear().type('01/01/1800')
        cy.get(EditMeasurePage.mpEnd).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodStartDateError).should('contain.text', 'Start date should be between the years 1900 and 2099.')
        cy.get(EditMeasurePage.mpEnd).clear().type('01/01/1800')
        cy.get(EditMeasurePage.mpStart).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'End date should be between the years 1900 and 2099.')
    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(EditMeasurePage.mpStart).clear().type('2020/01/02')
        cy.get(EditMeasurePage.mpEnd).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodStartDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
        cy.get(EditMeasurePage.mpEnd).clear().type('2021/01/02')
        cy.get(EditMeasurePage.mpStart).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
    })

})
