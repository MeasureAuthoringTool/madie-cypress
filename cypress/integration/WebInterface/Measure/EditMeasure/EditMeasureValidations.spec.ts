import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {Utilities} from "../../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''


describe('Edit Measure Validations', () => {
    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

    })

    beforeEach('Login',() => {
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
        MeasuresPage.clickEditforCreatedMeasure()

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

        MeasuresPage.clickEditforCreatedMeasure()

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
})

describe('Measurement Period Validations', () => {

    beforeEach('Create measure and login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDate).clear().type('01/01/1999')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).clear().type('12/01/2022')
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period ' +
            'end date should be greater than measurement period start date.')

    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).clear()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).focus().blur()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Measurement period start date is required')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).clear()
        cy.get(CreateMeasurePage.measurementPeriodEndDate).focus().blur()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period end date is required')
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).clear().type('01/01/1800')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Start date should be between the years 1900 and 2099.')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).clear().type('01/01/1800')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'End date should be between the years 1900 and 2099.')
    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).clear().type('2020/01/02')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).clear().type('2021/01/02')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
    })

})