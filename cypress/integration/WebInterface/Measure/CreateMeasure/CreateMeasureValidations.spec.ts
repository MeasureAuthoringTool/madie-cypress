import {OktaLogin} from "../../../../Shared/OktaLogin"
import {LandingPage} from "../../../../Shared/LandingPage"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"

describe('Create Measure Validations', () => {

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    //Measure Name Validations
    it('Verify error messages when the measure name entered is invalid or empty', () => {

        //Click on New Measure Button
        cy.get(LandingPage.newMeasureButton).click()

        //Verify error message when the Measure Name field is empty
        cy.get(CreateMeasurePage.measureNameTextbox).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).click()
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'A Measure Name is required.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name doesn't contain alphabets
        cy.get(CreateMeasurePage.measureNameTextbox).type('66777')
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'A Measure Name must contain at least one letter.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name has '_'
        cy.get(CreateMeasurePage.measureNameTextbox).clear().type('Test_Measure')
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name must not contain \'_\' (underscores).')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name has more than 500 characters
        cy.get(CreateMeasurePage.measureNameTextbox).clear().type('This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is')
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'A Measure Name cannot be more than 500 characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Click on cancel button
        cy.get(CreateMeasurePage.cancelButton).click()

    })

    //CQL Library Name Validations
    it('Verify error messages when the CQL Library Name entered is invalid or empty', () => {

        let measureName = 'TestMeasure' + Date.now()

        //Click on New Measure Button
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).type('eCQMTitle')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('12/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/2021')

        //Verify error message when the CQL Library Name field is empty
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).click()
        cy.get(CreateMeasurePage.measureNameTextbox).click()
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Lbrary name is required.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name does not starts with an upper case letter
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).clear().type('test123')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain spaces ' +
            'or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name contains spaces
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).clear().type('Test 123')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain ' +
            'spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name contains under score
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).clear().type('Test_123')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must not contain \'_\' (underscores).')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name contains special characters
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).clear().type('Test!@@#')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain ' +
            'spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name starts with a number
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).clear().type('12Test')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain ' +
            'spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify the error message when the CQL Library Name given already exists
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).clear().type('TestCql1640794914452')
        cy.get(CreateMeasurePage.createMeasureButton).click()
        cy.get(CreateMeasurePage.serverErrorMsg).should('contain.text', 'CQL library with given name already exists')

        cy.get(CreateMeasurePage.serverErrorMsgCloseIcon).click()
        cy.get(CreateMeasurePage.cancelButton).click()

    })

    //Measure Type Validations
    it('Verify error message when the Measure Type field is empty', () => {

        let measureName = 'MeasureTypeTest' + Date.now()
        let CqlLibraryName = 'MeasureTypeTestLibrary' + Date.now()


        //Click on New Measure Button
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).focus().blur()
        cy.get(CreateMeasurePage.measureModelFieldLevelError).should('contain.text', 'A Measure Model is required.')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        cy.get(CreateMeasurePage.cancelButton).click()

    })

    //eCQM Abbreviated title validations
    it('Verify error message when the eCQM title entered is invalid or empty', () => {

        let measureName = 'TestMeasure' + Date.now()
        let CqlLibraryName = 'TestLibrary' + Date.now()

        //Click on New Measure Button
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('12/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/2021')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)

        //eCQM abbreviated title empty
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).focus().blur()
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleFieldLevelError).should('contain.text', 'eCQM Abbreviated Title is required.')

        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //eCQM abbreviated title more than 32 characters
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).type('This test is for measure name validation.This test is')
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleFieldLevelError).should('contain.text', 'eCQM Abbreviated Title cannot be more than 32 characters.')

        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')
        cy.get(CreateMeasurePage.cancelButton).click()
    })
})

describe('Measurement Period Validations', () => {

    let measureName = 'TestMeasure' + Date.now()
    let CqlLibraryName = 'TestLibrary' + Date.now()

    beforeEach('Login',() => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/1999')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('12/01/2022')
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period ' +
            'end date should be greater than or equal to measurement period start date.')
        cy.get(CreateMeasurePage.cancelButton).click()

    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).focus().blur()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Measurement period start date is required')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).focus().blur()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period end date is required')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('01/01/1800')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Start date should be between the years 1900 and 2099.')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/1800')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'End date should be between the years 1900 and 2099.')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('2020/01/02')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('2021/01/02')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
        cy.get(CreateMeasurePage.cancelButton).click()

    })

})