import { OktaLogin } from "../../../../Shared/OktaLogin"
import { LandingPage } from "../../../../Shared/LandingPage"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"

let newMeasureName = ''
let newCqlLibraryName = ''
const measureCql = QiCore6Cql.cqlCMS125

describe('Validations on Measure Details page', () => {

    beforeEach('Create New Measure and Login', () => {

        newMeasureName = 'MeasureValidations1' + Date.now()
        newCqlLibraryName = 'MeasureValidations1Lib' + Date.now()
    //    CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, ratioMeasureCQL)
        CreateMeasurePage.CreateMeasureAPI(newMeasureName, newCqlLibraryName, SupportedModels.qiCore6, { measureCql })
        OktaLogin.SessionLogin()
    })

    afterEach('Logout', () => {
        
        Utilities.deleteMeasure()
    })

    it('Verify fields on the Steward & Developers section of Measure Details page are required and the messaging around the requirement', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //give the Steward field focus and then remove focus from it without selecting a value for it
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist')
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDrpDwn).click()
        cy.get(EditMeasurePage.measureStewardDrpDwn).clear()
        cy.get(EditMeasurePage.measureStewardDrpDwn).focused().blur()


        //remove focus from Steward drop down field
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //confirm alert / error message that should appear below the Steward field
        cy.get(EditMeasurePage.measureStewardAlertMsg).should('exist')
        cy.get(EditMeasurePage.measureStewardAlertMsg).should('be.visible')
        cy.get(EditMeasurePage.measureStewardAlertMsg).should('include.text', 'Steward is required')

        //give the Steward field focus and then remove focus from it without selecting a value for it
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist')
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('be.visible')
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).click()
        cy.get(EditMeasurePage.measureDeveloperCancelIcon).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).focused().blur()

        //remove focus from Developers drop down field
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //confirm alert / error message that should appear below the Developers field
        cy.get(EditMeasurePage.measureDevelopersAlertMsg).should('exist')
        cy.get(EditMeasurePage.measureDevelopersAlertMsg).should('be.visible')
        cy.get(EditMeasurePage.measureDevelopersAlertMsg).should('include.text', 'At least one developer is required')
    })

    it('Validate dirty check on Steward & Developers section of Measure Details page', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //select a value for Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().type('Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).click()
        cy.get(EditMeasurePage.measureDeveloperCancelIcon).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).focused().blur()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.disabled')

        //navigate away from the details tab
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        // confirm dirty check window
        Utilities.clickOnKeepWorking()

        //discard previous entry
        cy.get(Utilities.DiscardCancelBtn).click()
        cy.get(Utilities.discardChangesContinue).click()

        //verify that empty fields
        cy.get(EditMeasurePage.measureStewardDrpDwn).click()
        cy.get(EditMeasurePage.measureStewardDrpDwn).clear()
        cy.get(EditMeasurePage.measureStewardDrpDwn).focused().blur()
        cy.get(EditMeasurePage.measureStewardObjHoldingValue).should('be.empty')
        cy.get(EditMeasurePage.measureDevelopersObjHoldingValue).should('be.empty')

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type('ACO Health Solutions').click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).click()
        cy.get(EditMeasurePage.measureDeveloperCancelIcon).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).focused().blur()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.disabled')

        //navigate away from the details tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //confirm dirty check window
        cy.get(MeasureGroupPage.qdmDirtyCheckDiscardModal).should('exist')
        cy.get(MeasureGroupPage.qdmDirtyCheckDiscardModal).should('be.visible')
    })

    it('Validate success message once both fields have value and are saved', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //select a value for Steward
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist').should('be.visible').click().type('Able Health')
        cy.get(EditMeasurePage.measureStewardDrpDwnOption).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).click()
        cy.get(EditMeasurePage.measureDeveloperCancelIcon).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).focused().blur()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should remain disabled because a value has not been placed in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.disabled')

        //select a value for Developers
        cy.get(EditMeasurePage.measureDevelopersObjHoldingValue).should('exist').should('be.visible').click().type("ACO Health Solutions")
        cy.get(EditMeasurePage.measureDevelopersDrpDwnOption).click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        //save button should become available, now, because a value is, now, in both fields
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.enabled')

        //save Steward & Developers
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).click({ force: true })

        //validate success message
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSuccessMessage).should('include.text', 'Steward and Developers Information Saved Successfully')

        //validate values are persisted
        //navigate away from the details tab
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //navigate back to the details tab
        cy.get(EditMeasurePage.measureDetailsTab).should('exist')
        cy.get(EditMeasurePage.measureDetailsTab).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        cy.get(EditMeasurePage.measureStewardObjHoldingValue).should('include.value', 'Able Health')
        cy.get('.MuiChip-label').should('include.text', 'ACO Health Solutions')
    })

    it('Validating the Clinical Recommendation page and the fields, buttons, and messaging for that page', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to the clinical recommendation page
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('exist')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('be.visible')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()

        //type some value in the text box and, then, clear text box
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('exist')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('be.visible')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).type('Some test value')
        cy.get(Utilities.DiscardButton).click()
        Utilities.clickOnDiscardChanges()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('not.contain.text')

        //type some value in the text box and save it
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('exist')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('be.visible')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).type('Some test value')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('be.enabled')
        cy.get(Utilities.DiscardButton).should('exist')
        cy.get(Utilities.DiscardButton).should('be.visible')
        cy.get(Utilities.DiscardButton).should('be.enabled')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('be.disabled')
        cy.get(Utilities.DiscardButton).should('be.disabled')

        //verify save success message
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationSuccessMessage).should('contain.text', 'Measure Clinical Recommendation Statement Information Saved Successfully')

        //ensure that value in text box persists
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(EditMeasurePage.measureDetailsTab).should('exist')
        cy.get(EditMeasurePage.measureDetailsTab).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()

        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('exist')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('be.visible')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()

        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('contain.text', 'Some test value')

        //if new changes are made to Clinical Recommendation but, then, discarded, the previous value appears
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(EditMeasurePage.measureDetailsTab).should('exist')
        cy.get(EditMeasurePage.measureDetailsTab).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()

        //navigate to the clinical recommendation page
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('exist')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('be.visible')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()

        //clear current value
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('exist')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('be.visible')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).type('{selectAll}{del}')

        //enter some new value that will not be saved
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('exist')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('be.visible')
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).click()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).type('Some new test value')
        cy.get(Utilities.DiscardButton).click()
        Utilities.clickOnDiscardChanges()
        cy.get(EditMeasurePage.measureGenericFieldRTETextBox).should('contain.text', 'Some test value')
    })
})

describe('Create Measure validations', () => {

    beforeEach('Create New Measure and Login', () => {

        newMeasureName = 'MeasureValidations2' + Date.now()
        newCqlLibraryName = 'MeasureValidations2Lib' + Date.now()
        CreateMeasurePage.CreateMeasureAPI(newMeasureName, newCqlLibraryName, SupportedModels.qiCore6, { measureCql })
        OktaLogin.SessionLogin()
    })

    afterEach('Logout', () => {
        
        Utilities.deleteMeasure()
    })

    //Measure Name Validations
    it('Verify error messages when the measure name entered is invalid or empty', () => {

        //Click on New Measure Button
        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        //Click on New Measure Button
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        Utilities.waitForElementVisible(CreateMeasurePage.measureNameTextbox, 30000)

        //Verify error message when the Measure Name field is empty
        cy.get(CreateMeasurePage.measureNameTextbox).focus().blur()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).focus().blur()
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name is required.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name doesn't contain alphabets
        cy.get(CreateMeasurePage.measureNameTextbox).type('66777')
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name must contain at least one letter.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name has '_'
        cy.get(CreateMeasurePage.measureNameTextbox).clear().type('Test_Measure')
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name must not contain \'_\' (underscores).')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name has more than 500 characters
        cy.get(CreateMeasurePage.measureNameTextbox).clear().type('This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is')
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name cannot be more than 500 characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Click on cancel button
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    //CQL Library Name Validations
    it('Verify error messages when the CQL Library Name entered is invalid or empty', () => {

        let measureName = 'TestMeasure' + Date.now()

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        //Click on New Measure Button
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        Utilities.waitForElementVisible(CreateMeasurePage.measureNameTextbox, 30000)
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).type('eCQMTitle')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('12/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/2021')

        //Verify error message when the CQL Library Name field is empty
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).click()
        cy.get(CreateMeasurePage.measureNameTextbox).click()
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library name must start with ' +
            'an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
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
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('{selectall}{backspace}')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('Test 123')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain ' +
            'spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name contains under score
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('{selectall}{backspace}')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('Test_123')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library name must start with ' +
            'an upper case letter, followed by alpha-numeric character(s) and must not contain spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name contains special characters
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('{selectall}{backspace}')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('Test!@@#')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain ' +
            'spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the CQL Library Name starts with a number
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('{selectall}{backspace}')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('12Test')
        cy.get(CreateMeasurePage.cqlLibraryNameFieldLevelError).should('contain.text', 'Measure Library ' +
            'name must start with an upper case letter, followed by alpha-numeric character(s) and must not contain ' +
            'spaces or other special characters.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify the error message when the CQL Library Name given already exists
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type('{selectall}{backspace}')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(newCqlLibraryName)
        cy.get(CreateMeasurePage.createMeasureButton).click()
        cy.get(CreateMeasurePage.serverErrorMsg).should('contain.text', 'CQL library with given name already exists')

        cy.get(CreateMeasurePage.serverErrorMsgCloseIcon).click()
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    //Measure Model Validations
    it('Verify error message when the Measure Model field is empty', () => {

        let measureName = 'MeasureTypeTest' + Date.now()
        let CqlLibraryName = 'MeasureTypeTestLibrary' + Date.now()

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        //Click on New Measure Button
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).focus().blur()
        cy.get(CreateMeasurePage.measureModelFieldLevelError).should('contain.text', 'Measure Model is required.')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        cy.get(CreateMeasurePage.cancelButton).click()
    })

    //eCQM Abbreviated title validations
    it('Verify error message when the eCQM title entered is invalid or empty', () => {

        let measureName = 'TestMeasure' + Date.now()
        let CqlLibraryName = 'TestLibrary' + Date.now()

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 60000)
        //Click on New Measure Button
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
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

    let measureName = 'CreateValidationsMP' + Date.now()
    let CqlLibraryName = 'CreateValidationsMPLib' + Date.now()

    beforeEach('Login', () => {
        OktaLogin.SessionLogin()
    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/1999')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('12/01/2022')
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Measurement period end date ' +
            'should be greater than measurement period start date.')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end dates are empty', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodStartDateError).should('contain.text', 'Measurement period start date is required')
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Measurement period end date is required')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('01/01/1800')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodStartDateError).should('contain.text', 'Start date should be between the years 1900 and 2099.')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/1800')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'End date should be between the years 1900 and 2099.')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end date format is not valid', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 60000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('2020/01/02')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodStartDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('2021/01/02')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Invalid date format. (mm/dd/yyyy)')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end dates are same', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 60000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('01/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.editMeasurementPeriodEndDateError).should('contain.text', 'Measurement period end date should be greater than measurement period start date.')
        cy.get(CreateMeasurePage.cancelButton).click()
    })
})
