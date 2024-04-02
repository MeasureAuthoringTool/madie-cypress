import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureScoring = 'Cohort'
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
let simpleQDMMeasureCQL = MeasureCQL.simpleQDM_CQL

describe('Validate QDM Population Criteria section -- scoring and populations', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, true, simpleQDMMeasureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })
    it('Verify Population Criteria page is properly populated, per Scoring type.', () => {

        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'd')
        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'n')
        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'SDE Ethnicity')
        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'SDE Payer')
        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'SDE Race')
        cy.get(MeasureGroupPage.measurePopulationOption).should('contain.text', 'SDE Sex')

        cy.get(MeasureGroupPage.QDMPopCriteria1IPDesc).should('be.visible')

    })

    it('Confirm that a new Population Criteria can be added', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.QDMAddPopCriteriaBtn).click()
        Utilities.waitForElementVisible(MeasureGroupPage.QDMPopulationCriteria2, 30000)

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('contain.text', 'Select Initial Population')

    })

    it('Add UCUM Scoring Unit to Population Criteria', () => {

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL')

        //Add Initial Population
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //verify All data persists on Criteria page
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).should('contain.value', 'mL')

        //Navigate to Base Configuration page and verify All data persists on the page
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()
        cy.get(MeasureGroupPage.measureScoringSelect).should('contain.text', 'Cohort')
        cy.get('.MuiChip-label').should('contain.text', 'Process')
    })

    //Reporting tab fields
    it('Add Rate Aggregation and Improvement Notation to Population Criteria', () => {

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Navigate to Reporting page
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        //Add Rate Aggregation
        cy.get(MeasureGroupPage.rateAggregation).type('Aggregation')

        //Add Improvement Notation --'Increased score indicates improvement'
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')
        Utilities.waitForElementEnabled(MeasureGroupPage.improvementNotationDescText, 30000)

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')

        //Add Improvement Notation --'Decreased score indicates improvement'
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Decreased score indicates improvement')
        Utilities.waitForElementEnabled(MeasureGroupPage.improvementNotationDescText, 30000)

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Decreased score indicates improvement')

        //Add Improvement Notation --'Other'
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Other')
        Utilities.waitForElementEnabled(MeasureGroupPage.improvementNotationDescText, 30000)

        Utilities.waitForElementDisabled(MeasureGroupPage.measureReportingSaveBtn, 30000)

        cy.get(MeasureGroupPage.improvementNotationDescText).type('This is the required text when IN is set to \"Other\"')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Other')
        cy.get(MeasureGroupPage.improvementNotationDescText).should('contain.value', 'This is the required text when IN is set to \"Other\"')
    })

    //Reporting tab fields
    it('Add Improvement Notation (Other) to Population Criteria', () => {

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Navigate to Reporting page
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        //Add Rate Aggregation
        cy.get(MeasureGroupPage.rateAggregation).type('Aggregation')
        //Add Improvement Notation
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Other')
        cy.get(MeasureGroupPage.improvementNotationDescText).type('Improvement Notation Text')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Other')
        cy.get(MeasureGroupPage.improvementNotationDescText).should('contain.value', 'Improvement Notation Text')
    })

    it('Add Risk Adjustment Variables and Supplemental Data Elements to Population Criteria', () => {

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on the Risk Adjustment button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.QDMRiskAdjustmentDescriptionTextBox).type('Initial Population Description')

        //save the Risk Adjustment data
        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(MeasureGroupPage.riskAdjustmentSaveSuccessMsg).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //click on the Supplemental Data button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.QDMSupplementalDataElementsTab).click()
        cy.get(MeasureGroupPage.QDMSupplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.QDMSupplementalDataElementsListBox).contains('ipp').click()
        cy.get(MeasureGroupPage.QDMSupplementalDataDescriptionTextBox).type('Initial Population Description')

        //save Supplemental data Elements
        cy.get(MeasureGroupPage.QDMSaveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')
    })
})

describe('No values in QDM PC fields, when no CQL', () => {
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, false)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })

    //no definitions in CQL -- no values for PC fields
    it('Verify that when there is no CQL or no definitions in the CQL, QDM Population Criteria fields have no values', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).scrollTo
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        cy.get('[class="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9"]').should('be.empty')

        cy.get(MeasureGroupPage.QDMPopCriteria1IPDesc).should('be.visible')
    })
})
describe('Save Population Criteria on QDM measure', () => {
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, false, simpleQDMMeasureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })
    it('Confirm that initial and new Population Criteria can have values saved', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'SDE Ethnicity')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.QDMAddPopCriteriaBtn).click()
        Utilities.waitForElementVisible(MeasureGroupPage.QDMPopulationCriteria2, 30000)

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('contain.text', 'Select Initial Population')

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).click()

        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'SDE Ethnicity')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group saved successfully.')

    })
})

describe('Validations: Population Criteria: Return Types -- Boolean', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, true, booleanPatientBasisQDM_CQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })

    it('Validations when the Patient Basis is set to "Yes" and return type should be boolean', () => {
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the PC page
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click().wait(2000)

        //select a value that will return the correct boolean type
        Utilities.waitForElementVisible(MeasureGroupPage.measurePopulationOption, 30000)
        cy.wait(3000)
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'Initial Population')

        //no error should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('not.exist')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMsg, 30000)
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click().wait(2000)
        Utilities.waitForElementVisible(MeasureGroupPage.measurePopulationOption, 30000)
        cy.wait(3000)
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'Bilateral Mastectomy Diagnosis')

        //helper text / error message should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('be.visible')
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('contain.text', 'For Patient-based Measures, selected definitions must return a Boolean.')

    })
})

describe('Validations: Population Criteria: Return Types -- Non-Boolean', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, false, booleanPatientBasisQDM_CQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })

    it('Validations when the Patient Basis is set to "No" and return type should be Non-boolean', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the PC page
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).click().wait(2000)

        //select a value that will return the correct boolean type
        Utilities.waitForElementVisible(MeasureGroupPage.measurePopulationOption, 30000)
        cy.wait(3000)
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationOption, 'Numerator')

        //helper text / error message should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('be.visible')
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('contain.text', 'For Episode-based Measures, selected definitions must return a list of the same type (Non-Boolean)')

        //select a value that will return the correct boolean type
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })
})
