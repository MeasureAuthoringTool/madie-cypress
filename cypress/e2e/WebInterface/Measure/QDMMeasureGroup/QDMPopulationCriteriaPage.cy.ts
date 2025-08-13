import { OktaLogin } from "../../../../Shared/OktaLogin"
import {CreateMeasureOptions, CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { Header } from "../../../../Shared/Header"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureName = 'QDMPopCriteriaPage' + Date.now()
let CqlLibraryName = 'QDMPopCriteriaPageLib' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureScoring = 'Cohort'
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
let simpleQDMMeasureCQL = MeasureCQL.simpleQDM_CQL

describe('Validate QDM Population Criteria section -- scoring and populations', () => {

    const measureData: CreateMeasureOptions = {}
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = simpleQDMMeasureCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify Population Criteria page is properly populated, per Scoring type.', () => {

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
    })

    it('Confirm that a new Population Criteria can be added', () => {

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.QDMAddPopCriteriaBtn).click()
        Utilities.waitForElementVisible(MeasureGroupPage.QDMPopulationCriteria2, 30000)

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('contain.text', 'Select Initial Population')
    })

    it('Add UCUM Scoring Unit to Population Criteria', () => {

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
        MeasuresPage.actionCenter('edit')
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

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 20700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Navigate to Reporting page
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        //Add Rate Aggregation
        cy.get(MeasureGroupPage.rateAggregation).type('Aggregation')

        //Add Improvement Notation --'Increased score indicates improvement'
        cy.get(MeasureGroupPage.improvementNotationDescText).find('[role="textbox"]').should('have.attr', 'contenteditable', 'false')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescText).find('[role="textbox"]').should('have.attr', 'contenteditable', 'true')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(EditMeasurePage.successMessage).should('exist')
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.text', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')

        //Add Improvement Notation --'Decreased score indicates improvement'
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Decreased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescText).find('[role="textbox"]').should('have.attr', 'contenteditable', 'true')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(EditMeasurePage.successMessage).should('exist')
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.text', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Decreased score indicates improvement')

        //Add Improvement Notation --'Other'
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Other')
        cy.get(MeasureGroupPage.improvementNotationDescText).find('[role="textbox"]').should('have.attr', 'contenteditable', 'true')

        Utilities.waitForElementDisabled(MeasureGroupPage.measureReportingSaveBtn, 30000)

        cy.get(MeasureGroupPage.improvementNotationDescText).type('This is the required text when IN is set to \"Other\"')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(EditMeasurePage.successMessage).should('exist')
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.text', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Other')
        cy.get(MeasureGroupPage.improvementNotationDescText).should('contain.text', 'This is the required text when IN is set to \"Other\"')
    })

    //Reporting tab fields
    it('Add Improvement Notation (Other) to Population Criteria', () => {

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
        cy.get(EditMeasurePage.successMessage).should('exist')
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Reporting Updated Successfully')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Assert Rate Aggregation and Improvement Notation text box
        cy.get(MeasureGroupPage.qdmMeasureReportingTab).click()
        cy.get(MeasureGroupPage.rateAggregation).should('contain.text', 'Aggregation')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Other')
        cy.get(MeasureGroupPage.improvementNotationDescText).should('contain.text', 'Improvement Notation Text')
    })

    it('Add Risk Adjustment Variables and Supplemental Data Elements to Population Criteria', () => {

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
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //click on the Supplemental Data button / link on the left page to populate fields on the right
        cy.get(MeasureGroupPage.QDMSupplementalDataElementsTab).click()
        cy.get(MeasureGroupPage.QDMSupplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.QDMSupplementalDataElementsListBox).contains('ipp').click()
        cy.get(MeasureGroupPage.QDMSupplementalDataDescriptionTextBox).type('Initial Population Description')

        //save Supplemental data Elements
        cy.get(MeasureGroupPage.QDMSaveSupplementalDataElements).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')
    })
})

describe('No values in QDM PC fields, when no CQL', () => {
    
    const measureData: CreateMeasureOptions = {}
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'false'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    //no definitions in CQL -- no values for PC fields
    it('Verify that when there is no CQL or no definitions in the CQL, QDM Population Criteria fields have no values', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).scrollTo
        cy.get(MeasureGroupPage.initialPopulationSelect).click()

        cy.get('[class="MuiList-root MuiList-padding MuiMenu-list css-ubifyk"]').should('be.empty')

        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')
    })
})

describe('Save Population Criteria on QDM measure', () => {
    
    const measureData: CreateMeasureOptions = {}
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'false'
        measureData.measureCql = simpleQDMMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Confirm that initial and new Population Criteria can have values saved', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'SDE Ethnicity')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).wait(2000).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.QDMAddPopCriteriaBtn).click()
        Utilities.waitForElementVisible(MeasureGroupPage.QDMPopulationCriteria2, 30000)

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('contain.text', 'Select Initial Population')

        Utilities.dropdownSelect(MeasureGroupPage.QDMPopCriteria2IP, 'SDE Ethnicity')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group saved successfully.')
    })
})

describe('Validations: Population Criteria: Return Types -- Boolean', () => {

    const measureData: CreateMeasureOptions = {}
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'true'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Validations when the Patient Basis is set to "Yes" and return type should be boolean', () => {
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the PC page
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        //select a value that will return the correct boolean type
        Utilities.waitForElementVisible(MeasureGroupPage.initialPopulationSelect, 30000)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        //no error should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('not.exist')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).wait(2000).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 30000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group saved successfully.')

        Utilities.waitForElementVisible(MeasureGroupPage.initialPopulationSelect, 30000)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Bilateral Mastectomy Diagnosis')

        //helper text / error message should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('be.visible')
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('contain.text', 'For Patient-based Measures, selected definitions must return a Boolean.')
    })
})

describe('Validations: Population Criteria: Return Types -- Non-Boolean', () => {

    const measureData: CreateMeasureOptions = {}
    let randValue = (Math.floor((Math.random() * 1000) + 1))
    newMeasureName = measureName + randValue
    newCqlLibraryName = CqlLibraryName + randValue

    beforeEach('Create Measure and login', () => {

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = measureScoring
        measureData.patientBasis = 'false'
        measureData.measureCql = booleanPatientBasisQDM_CQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Validations when the Patient Basis is set to "No" and return type should be Non-boolean', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the PC page
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        //select a value that will return the correct boolean type
        Utilities.waitForElementVisible(MeasureGroupPage.initialPopulationSelect, 30000)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Numerator')

        //helper text / error message should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('be.visible')
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('contain.text', 'For Episode-based Measures, selected definitions must return a list of the same type (Non-Boolean)')

        //select a value that will return the correct boolean type
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')
    })
})
