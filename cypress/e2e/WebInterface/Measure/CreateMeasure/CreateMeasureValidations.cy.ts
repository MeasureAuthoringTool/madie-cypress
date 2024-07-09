import { OktaLogin } from "../../../../Shared/OktaLogin"
import { LandingPage } from "../../../../Shared/LandingPage"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { LibraryCQL } from "../../../../Shared/LibraryCQL"
import { Global } from "../../../../Shared/Global"
import { Utilities } from "../../../../Shared/Utilities"
import { Environment } from "../../../../Shared/Environment"
import { v4 as uuidv4 } from 'uuid'
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let qdmMeasureNameMOS = 'CVListQDMPositiveEncounterPerformedWithMOAndStratification' + Date.now()
let CqlLibraryName = 'CVListQDMPositiveEncounterPerformedWithMOAndStratification' + Date.now()
let firstTestCaseTitle = 'PDxNotPsych60MinsDepart'
let testCaseDescription = 'IPPStrat1Pass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'Order50AndPriorityAssessment180'
let measureCQL = MeasureCQL.QDMMeasureWithMOandStrat


let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let measureCQLLibName = ''

let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let ratioMeasureCQL = MeasureCQL.ICFCleanTest_CQL
let LibCQLQDMVal = LibraryCQL.validCQL4QDMLib
let LibQICoreVal = LibraryCQL.validCQL4QICORELib

let measureName = ''
let CQLLibraryName = ''
let model = 'QI-Core v4.1.1'
let QICoreModel = 'QI-Core v4.1.1'
let QDMModel = 'QDM v5.6'
let harpUser = Environment.credentials().harpUser
let eCQMTitle = 'eCQMTitle'

describe('Validations on Measure Details page', () => {

    beforeEach('Create New Measure and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, ratioMeasureCQL)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify Steward & Developers section of Measure Details page', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('include.text', 'Steward & Developers')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //confirm Steward field
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('exist')
        cy.get(EditMeasurePage.measureStewardDrpDwn).should('be.visible')

        //confirm Developers field
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist')
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('be.visible')
    })

    it('Verify fields on the Steward & Developers section of Measure Details page are required and the messaging around the requirement', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

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

    it('Validate Save buttons accessibility (Save when both fields have value)', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

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

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type('ACO Health Solutions')
        cy.get(EditMeasurePage.measureDevelopersDrpDwnOption).click()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.enabled')

    })

    it('Validate Discard button accessibility and text / label on button', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

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

        //discard button becomes available
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('exist')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.enabled')

        //discard previous entry
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).click()
        cy.get(Global.discardChangesContinue).click()

        //verify that empty fields
        cy.get(EditMeasurePage.measureStewardDrpDwn).click()
        cy.get(EditMeasurePage.measureStewardDrpDwn).clear()
        cy.get(EditMeasurePage.measureStewardDrpDwn).focused().blur()
        cy.get(EditMeasurePage.measureStewardObjHoldingValue).should('be.empty')
        cy.get(EditMeasurePage.measureDevelopersObjHoldingValue).should('be.empty')

        //select a value for Developers
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).should('exist').should('be.visible').click().type('ACO Health Solutions').click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).click()
        cy.get(EditMeasurePage.measureDeveloperDrpDwn).focused().blur()
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('exist')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.visible')
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).should('be.disabled')

        //discard button becomes available
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('exist')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.enabled')
    })

    it('Validate dirty check on Steward & Developers section of Measure Details page', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

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

        //confirm dirty check window
        cy.get(EditMeasurePage.dirtCheckModal).should('exist')
        cy.get(EditMeasurePage.dirtCheckModal).should('be.visible')

        //select continue working on page
        cy.get(Global.keepWorkingCancel).should('exist')
        cy.get(Global.keepWorkingCancel).should('be.visible')
        cy.get(Global.keepWorkingCancel).should('be.enabled')
        cy.get(Global.keepWorkingCancel).click()

        //discard previous entry
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).click()
        cy.get(Global.discardChangesContinue).click()

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
        cy.get(EditMeasurePage.dirtCheckModal).should('exist')
        cy.get(EditMeasurePage.dirtCheckModal).should('be.visible')

    })

    it('Validate success message once both fields have value and are saved', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //navigate to the Steward & Developers page
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('exist')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).should('be.visible')
        cy.get(EditMeasurePage.leftPanelStewardDevelopers).click()

        //select a value for Steward
        //Utilities.dropdownSelect(EditMeasurePage.measureStewardDrpDwn, 'Able Health')
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
        cy.get(EditMeasurePage.measureStewardDevelopersSaveButton).click({ force: true }).wait(1000)

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
        MeasuresPage.measureAction("edit")

        //navigate to the clinical recommendation page
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('exist')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).should('be.visible')
        cy.get(EditMeasurePage.leftPanelMClinicalGuidanceRecommendation).click()

        //type some value in the text box and, then, clear text box
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).type('Some test value')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).click()
        Global.clickOnDiscardChanges()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('be.empty')

        //type some value in the text box and save it
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).type('Some test value')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('exist')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.enabled')
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationSaveButton).should('be.disabled')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).should('be.disabled')

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

        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('contain.text', 'Some test value')

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
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).type('{selectAll}{del}')

        //enter some new value that will not be saved
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('exist')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('be.visible')
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).click()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).type('Some new test value')
        cy.get(EditMeasurePage.measureDetailsDiscardChangesBtn).click()
        Global.clickOnDiscardChanges()
        cy.get(EditMeasurePage.measureClinicalRecommendationTextBox).should('contain.text', 'Some test value')
    })

})

describe('Create Measure validations', () => {

    beforeEach('Create New Measure and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, ratioMeasureCQL)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
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
        cy.get(CreateMeasurePage.measureNameTextbox).type('66777').wait(500)
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name must contain at least one letter.')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name has '_'
        cy.get(CreateMeasurePage.measureNameTextbox).clear().wait(500).type('Test_Measure').wait(500)
        cy.get(CreateMeasurePage.measureNameFieldLevelError).should('contain.text', 'Measure Name must not contain \'_\' (underscores).')
        //Verify if create measure button is disabled
        cy.get(CreateMeasurePage.createMeasureButton).should('be.disabled')

        //Verify error message when the Measure Name has more than 500 characters
        cy.get(CreateMeasurePage.measureNameTextbox).clear().wait(500).type('This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is for measure name validation.This test is').wait(500)
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
        cy.get(CreateMeasurePage.measureModelQICore).click()
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

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 30000)
        //Click on New Measure Button
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
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

    beforeEach('Login', () => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('Verify error message when the Measurement Period end date is after the start date', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/1999')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('12/01/2022')
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period end date ' +
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
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDateError).should('contain.text', 'Measurement period start date is required')
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period end date is required')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

    it('Verify error message when the Measurement Period start and end dates are not in valid range', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 50000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
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

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 30000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
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

    it('Verify error message when the Measurement Period start and end dates are same', () => {

        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 30000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 3000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 3000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        cy.get(CreateMeasurePage.measureModelQICore).click()
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(CreateMeasurePage.measurementPeriodStartDate).type('01/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type('01/01/2020')
        cy.get(CreateMeasurePage.measurementPeriodStartDate).click()
        cy.get(CreateMeasurePage.measurementPeriodEndDateError).should('contain.text', 'Measurement period end date should be greater than measurement period start date.')
        cy.get(CreateMeasurePage.cancelButton).click()
    })

})
describe('Setting time / date value in EST reflects as the same in user time zone', () => {

    beforeEach('Set Access Token', () => {
        cy.setAccessTokenCookie()
    })
    afterEach('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CQLLibraryName)

    })

    it('Create New Measure, successful creation', () => {
        measureName = 'TestMeasure' + Date.now() + randValue
        CQLLibraryName = 'TestCql' + Date.now() + randValue

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CQLLibraryName,
                    "model": model,
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    "ecqmTitle": eCQMTitle,
                    "measurementPeriodStart": '2012-01-01T05:00:00.000+00:00',
                    "measurementPeriodEnd": '2012-12-31T05:00:00.000+00:00'
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.createdBy).to.eql(harpUser)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
            })

        })
        cy.clearCookies()
        cy.clearLocalStorage()
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()

        cy.get(EditMeasurePage.mpStart).should('contain.value', '01/01/2012')
        cy.get(EditMeasurePage.mpEnd).should('contain.value', '12/31/2012')

    })
})

describe('CQL Library Validations -- Attempting to use a QDM Library in a QI Core measure CQL', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = "NewCQLLibName" + randValue
        newMeasureName = "NewMeasureName" + randValue
        measureCQLLibName = newCQLLibraryName + 'InMeasure' + Date.now() + randValue

        CQLLibraryPage.createAPILibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher, QDMModel, LibCQLQDMVal, false, false)
        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, measureCQLLibName, null, false, false)
        OktaLogin.Login()


    })
    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, measureCQLLibName)

    })
    it('Proper error appears when attempting to use a QDM Library in a QI Core measure CQL', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //write CQL value into CQL Editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('library ' + measureCQLLibName + ' version \'0.0.004\'\n' +


            'using QICore version \'4.1.1\'\n' +



            'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
            'include PalliativeCareQDM version \'4.0.000\' called Test\n' +

            'codesystem \"SNOMEDCT:2017-09\": \'http://snomed.info/sct/731000124108\' version \'http://snomed.info/sct/731000124108/version/201709\'\n' +

            'valueset \"Hysterectomy with No Residual Cervix\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
            'valueset \"Office Visit\": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +



            'parameter \"Measurement Period\" Interval<DateTime>\n' +



            'context Patient\n' +



            'define \"Surgical Absence of Cervix\":\n' +
            '	[Procedure: \"Hysterectomy with No Residual Cervix\"] NoCervixHysterectomy\n' +
            '		where NoCervixHysterectomy.status = \'completed\'')

        //Save CQL button should be available
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //generic error list appears
        cy.get(CQLLibraryPage.measureCQLGenericErrorsList).should('be.visible')
        cy.get(CQLLibraryPage.measureCQLGenericErrorsList).should('include.text', 'Row: 4, Col:1: ELM: 1:55 | Library model and version does not match the Measure model and version for name: PalliativeCareQDM, version: 4.0.000')
    })
})

describe('CQL Library Validations -- Attempting to use a QI Core Library in a QDM measure CQL', () => {

    beforeEach('Login', () => {
        var randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = "NewCQLLibName" + randValue
        newMeasureName = "NewMeasureName" + randValue
        measureCQLLibName = newCQLLibraryName + 'InMeasure' + Date.now() + randValue
        CQLLibraryPage.createAPILibraryWithValidCQL(newCQLLibraryName, CQLLibraryPublisher, QICoreModel, LibQICoreVal, false, false)

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, measureCQLLibName, null, false, false)
        OktaLogin.Login()

    })
    afterEach('Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, measureCQLLibName)

    })
    it('Proper error appears when attempting to use a QI Core Library in a QDM measure CQL', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //write CQL value into CQL Editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('library ' + measureCQLLibName + ' version \'0.0.004\'\n' +
            '\n' +
            'using QDM version \'5.6\'\n' +
            'include SupplementalDataElements version \'3.4.000\' called Test\n' +
            '\n' +
            'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
            'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
            'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
            'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
            'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
            'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
            'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
            'valueset "Hypoglycemics Treatment Medications": \'urn:oid:2.16.840.1.113762.1.4.1196.394\'\n' +
            '\n' +
            'parameter "Measurement Period" Interval<DateTime>\n' +
            '\n' +
            'context Patient\n' +
            '\n' +
            'define "SDE Ethnicity":\n' +
            '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
            '\n' +
            'define "SDE Payer":\n' +
            '  ["Patient Characteristic Payer": "Payer Type"]\n' +
            '\n' +
            'define "SDE Race":\n' +
            '  ["Patient Characteristic Race": "Race"]\n' +
            '\n' +
            'define "SDE Sex":\n' +
            '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
            '\n' +
            'define "Strat 1":\n' +
            '    ["Encounter, Performed": "Encounter Inpatient"]\n' +
            '\n' +
            'define "Strat 2":\n' +
            '    ["Encounter, Performed": "Emergency Department Visit"]\n' +
            '\n' +
            'define "Denominator":\n' +
            '  "Initial Population"\n' +
            '\n' +
            'define "Initial Population":\n' +
            '  "Qualifying Encounters"\n' +
            '\n' +
            'define "Measure Population":\n' +
            '  "Initial Population"\n' +
            '\n' +
            'define "Measure Population Exclusion":\n' +
            '  ["Encounter, Performed": "Observation Services"] Encounter\n' +
            '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
            '\n' +
            'define "Qualifying Encounters":\n' +
            '  exists ( ["Encounter, Performed": "Encounter Inpatient"]\n' +
            '    union ["Encounter, Performed": "Emergency Department Visit"]\n' +
            '    union ["Encounter, Performed": "Observation Services"] ) Encounter\n' +
            '    where Encounter.relevantPeriod ends during "Measurement Period"\n' +
            '\n' +
            'define function "MeasureObservation"():\n' +
            'true\n' +
            '\n' +
            'define function "Measure Observation hours"():\n' +
            '    8{del}')

        //Save CQL button should be available
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //generic error list appears
        cy.get(CQLLibraryPage.measureCQLGenericErrorsList).should('be.visible')
        cy.get(CQLLibraryPage.measureCQLGenericErrorsList).should('include.text', 'Row: 4, Col:1: ELM: 1:62 | Library model and version does not match the Measure model and version for name: SupplementalDataElements, version: 3.4.000')
    })
})

describe('Measure Creation: CV ListQDMPositiveEncounterPerformed With MO And Stratification: SDE values / radio button test', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(qdmMeasureNameMOS, CqlLibraryName, measureCQL, false, false,
            '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, null, true)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(qdmMeasureNameMOS, CqlLibraryName)

    })

    it('Creating a measure With MO And Stratification: Selecting SDE values / radio buttons', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //verify that the CQL to ELM version is not empty
        cy.get(MeasuresPage.measureCQLToElmVersionTxtBox).should('not.be.empty')

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Group Creation

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCV)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Continuous Variable')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Measure Population')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Measure Population Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.measureObservationPopSelect, 'MeasureObservation')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Median')

        //Add Stratifications
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).click()
        cy.get('[data-value="Stratification 1"]').click()
        cy.get(MeasureGroupPage.stratTwo).click()
        cy.get('[data-value="Stratification 2"]').click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the SDE side tab section on the test cases tab
        Utilities.waitForElementVisible(TestCasesPage.qdmSDESidNavLink, 30000)
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        cy.get(MeasureGroupPage.qdmSDERadioButtons)
            .find('[type="radio"]')
            .then((radio) => {
                //confirm that initial value is set to 'No'
                cy.wrap(radio).eq(1).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'No');

                //check / select radio button for the value of 'Yes'
                cy.wrap(radio).eq(0).check({ force: true }).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Yes');

                cy.get(TestCasesPage.sdeTestCaseSaveButton).click()
                cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Configuration Updated Successfully')

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            });

        //navigate away from the test cases tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.leftPanelBaseConfigTab, 30000)

        //navigate back to test cases page / tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the SDE side tab section on the test cases tab
        Utilities.waitForElementVisible(TestCasesPage.qdmSDESidNavLink, 30000)
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        //verify that 'yes' is checked
        cy.get(MeasureGroupPage.qdmSDERadioButtons)
            .find('[type="radio"]')
            .then((radio) => {

                //check / select radio button for the value of 'Yes'
                cy.wrap(radio).eq(0).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Yes');

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            });

        //make a change
        cy.get(MeasureGroupPage.qdmSDERadioButtons)
            .find('[type="radio"]')
            .then((radio) => {

                //check / select radio button for the value of 'Yes'
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'No');

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(0).should('not.be.checked');
            });

        //attempt to navigate away from the test cases tab / page
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //confirm dirty check window
        cy.get(EditMeasurePage.dirtCheckModal).should('exist')
        cy.get(EditMeasurePage.dirtCheckModal).should('be.visible')

        //select continue working on page
        cy.get(Global.keepWorkingCancel).should('exist')
        cy.get(Global.keepWorkingCancel).should('be.visible')
        cy.get(Global.keepWorkingCancel).should('be.enabled')
        cy.get(Global.keepWorkingCancel).click()

        //confirm that previous edit is still present
        cy.get(MeasureGroupPage.qdmSDERadioButtons)
            .find('[type="radio"]')
            .then((radio) => {

                //check / select radio button for the value of 'Yes'
                cy.wrap(radio).eq(1).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'No');

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(0).should('not.be.checked');
            });

        //discard changes on the test SDE Test Cases tab / page
        cy.get(MeasureGroupPage.discardChangesBtn).click()
        cy.get(Global.discardChangesContinue).click()

        //verify that 'yes' is still checked after discarding changes on the page
        cy.get(MeasureGroupPage.qdmSDERadioButtons)
            .find('[type="radio"]')
            .then((radio) => {

                //check / select radio button for the value of 'Yes'
                cy.wrap(radio).eq(0).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Yes');

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            });
    })
})

