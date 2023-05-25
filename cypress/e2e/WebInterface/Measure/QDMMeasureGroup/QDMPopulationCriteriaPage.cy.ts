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
let nonbooleanListOfSameTypeQDM_CQL = MeasureCQL.returnNonBooleanListOfSameTypeQDM_CQL
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

        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()

        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'd')
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'n')
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'SDE Ethnicity')
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'SDE Payer')
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'SDE Race')
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('contain.text', 'SDE Sex')

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

        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()

        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('d').click()

        cy.get(MeasureGroupPage.QDMPopCriteria1SaveBtn).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaSaveSuccessMsg).should('contain.text', 'Population details for this group saved successfully.')

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

        //Add UCUM scoring unit
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitDropdownList).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('mL millil')
        //Select mL milliliters from the dropdown
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('{downArrow}').type('{enter}')

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

        //verify All data persists on Criteria page
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.ucumScoringUnitCurrentValue).should('contain.value', 'mL milliliter')

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
        //Add Improvement Notation
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save population definition with scoring unit
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.visible')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).should('be.enabled')
        cy.get(MeasureGroupPage.measureReportingSaveBtn).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureReportingMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureReportingMsg).should('contain.text', 'Measure Reporting Updated Successfully')

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

        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()

        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).should('be.empty')

        cy.get(MeasureGroupPage.QDMPopCriteria1IPDesc).should('be.visible')
    })
})
describe('Save Population Criteria on QDM measure', () => {
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
    it('Confirm that initial and new Population Criteria can have values saved', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()

        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('d').click()

        cy.get(MeasureGroupPage.QDMPopCriteria1SaveBtn).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaSaveSuccessMsg).should('contain.text', 'Population details for this group saved successfully.')

        cy.get(MeasureGroupPage.QDMAddPopCriteriaBtn).click()
        Utilities.waitForElementVisible(MeasureGroupPage.QDMPopulationCriteria2, 30000)

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria2IP).should('contain.text', 'Select Initial Population')

        cy.get(MeasureGroupPage.QDMPopCriteria2IP).click()

        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('d').click()

        cy.get(MeasureGroupPage.QDMPopCriteria1SaveBtn).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaSaveSuccessMsg).should('contain.text', 'Population details for this group saved successfully.')

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

        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()

        //select a value that will return the correct boolean type
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('Initial Population').click()
        //no error should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('not.exist')

        cy.get(MeasureGroupPage.QDMPopCriteria1SaveBtn).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaSaveSuccessMsg).should('contain.text', 'Population details for this group saved successfully.')

        //select a value that will return the correct boolean type
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('Bilateral Mastectomy Diagnosis').click()
        //no error should appear
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
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, measureScoring, false, nonbooleanListOfSameTypeQDM_CQL)
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

        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()

        //select a value that will return the correct boolean type
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('Initial Population').click()
        //no error should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('not.exist')

        cy.get(MeasureGroupPage.QDMPopCriteria1SaveBtn).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaSaveSuccessMsg).should('contain.text', 'Population details for this group saved successfully.')

        //select a value that will return the correct boolean type
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).should('be.visible')
        cy.get(MeasureGroupPage.QDMPopCriteria1IP).click()
        cy.get(MeasureGroupPage.QDMPopCriteriaIPOptions).contains('IPPBoolean').click()
        //no error should appear
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('be.visible')
        cy.get(MeasureGroupPage.QDMIPPCHelperText).should('contain.text', 'For Episode-based Measures, selected definitions must return a list of the same type (Non-Boolean).')

    })
})
