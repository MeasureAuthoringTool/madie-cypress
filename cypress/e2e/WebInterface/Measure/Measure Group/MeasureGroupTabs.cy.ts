import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Header } from "../../../../Shared/Header"
import { Global } from "../../../../Shared/Global"

const now = Date.now()
let measureName = 'MeasureGroupTabs' + now
let CqlLibraryName = 'MeasureGroupTabsLib' + now
let measureCQL = MeasureCQL.SBTEST_CQL.replace('SimpleFhirLibrary', measureName)

describe('Validating Population tabs', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Can successfully update / change score and population value and save on population tab', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //change score and select population value for new score and save
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get('[data-value="num"]').click()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 30000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.popUpConfirmationModal).should('exist')
        cy.get(MeasureGroupPage.popUpConfirmationModal).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.popUpConfirmationModal, 30000)
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('exist')
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.scoreUpdateMGConfirmMsg, 30000)
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Scoring is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.')
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Are you sure you want to Save Changes?')
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'This action cannot be undone.')

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'num')
    })

    it('Changes are retained and saved while moving across different tabs', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30700)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 30000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 30000)

        //assert save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //navigate to the populations tab
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //navigate back to the reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')

        //navigate to the CQl tab
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorTab, 30000)
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('be.enabled')
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')

        //navigate to the populations tab
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //assert the change / update to population value for current scoring
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')
    })

    it('Assert indicator on tab with error, until error is removed', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select Ratio scoring type and only indicate a value for one of the required fields
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get('[data-value="denom"]').click()

        //make reporting the active tab
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert that error indicator appears on the population tab
        cy.get(MeasureGroupPage.populationTab)
            .then(($message) => { assert($message.text, 'Populations 🚫') })
        //click on the population tab and correct issue
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()
        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get('[data-value="num"]').click()
        cy.get(MeasureGroupPage.denominatorSelect).click()
        cy.get('[data-value="denom"]').click()
        cy.get(MeasureGroupPage.numeratorSelect).click()
        cy.get('[data-value="num"]').click()

        //make reporting the active tab
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert that the error indicator no longer appears on the population tab
        cy.get(MeasureGroupPage.populationTab)
            .then(($message) => { assert($message.text, 'Populations') })

        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).focus()
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        //assert save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
    })

    it('Assert all fields, in all tabs, are for the measure group that is selected', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the 3 fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).type('Extra description for Improvement Notation')

        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 3000)

        //assert save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //add multiple groups
        for (let i = 1; i <= 4; i++) {

            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
            cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        }
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert that all fields appear on the reporting tab and are blank / without a selected value
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Select Improvement Notation')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('be.empty')

        cy.get(MeasureGroupPage.measureGroupOne).click()
        //Click on Populations tab
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //assert score-specific population fields appear in the population tab
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist')
        cy.get(MeasureGroupPage.denominatorSelect).should('exist')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('exist')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('exist')
        cy.get(MeasureGroupPage.numeratorSelect).should('exist')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('exist')
    })
})

describe('Validating Reporting tabs', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Reporting tab contains Rate Aggregation and Improvement Notation info', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert expected fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('be.empty')
    })

    it('Changes to Reporting tab fields are saved & persisted', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the three fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('be.empty')

        //change and save a new value to the Improvement Notation field
        cy.get(MeasureGroupPage.improvementNotationSelect).click()
        cy.get(MeasureGroupPage.improvementNotationValues)
            //Increased score indicates improvement
            .should('contain.text', 'Increased score indicates improvement')
            .click()
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).type('Score doubling indicates great success.')

        //save selected IN value
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirm message
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group updated successfully.')

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        // IN should contain previously saved selected value
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('contain.text', 'Score doubling indicates great success.')

        //change and save a new value to the Improvement Notation field
        cy.get(MeasureGroupPage.improvementNotationSelect).click()
        cy.get(MeasureGroupPage.improvementNotationValues)
            .type('{downArrow}{enter}')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore)
            .clear()
            .type('Loss of points is actually good.')

        //save selected IN value
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirm message
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group updated successfully.')

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        // IN should contain previously saved selected value
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Decreased score indicates improvement')
        cy.get(MeasureGroupPage.improvementNotationDescQiCore).should('contain.text', 'Loss of points is actually good.')

        //change and save a new value to the Improvement Notation field
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save selected IN value
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirm message
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for this group updated successfully.')

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        // IN should contain previously saved selected value
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')

        // and here?

    })
})

describe('Supplemental data elements and Risk Adjustment variables on Measure group page', () => {

    beforeEach('Create measure, Measure Group and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify that description entered for each RA Definition is accurate', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Risk Adjustment tab
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        //select a definition and enter a description for ipp
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).eq(0).contains('ipp').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')
        //select a definition and enter a description for denom
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).eq(0).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('denom').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')

        //'Include in Report Type' field added for Initial Population when Risk adjustment variable is added
        cy.get(MeasureGroupPage.ippIncludeInReportTypeField).should('exist')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Individual')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Subject List')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Summary')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Data Collection')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()

        //'Include in Report Type' field added for Denominator when Risk adjustment variable is added
        cy.get(MeasureGroupPage.denomIncludeInReportTypeField).should('exist')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(2).click()
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Individual')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Subject List')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Summary')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Data Collection')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(2).click()

        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')
    })

    it('Verify that description entered for each SDE Definition is accurate', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
            .first() // select the last element
            .type('Denominator Description')
        //Save Supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //navigate to the main MADiE page
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
            .first() // select the last element
            .should('contain.text', 'Denominator Description')
    })

    it('Clicking on Discard changes button on Risk Adjustment page will revert the changes made before save', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Risk Adjustment tab
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')

        //Click on Discard changes button
        cy.get(MeasureGroupPage.discardChangesBtn).click()
        cy.get(MeasureGroupPage.discardChangesConfirmationMsg).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(Global.discardChangesContinue).click()
    })

    it('Add Supplemental data elements to the Measure group', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')

        //'Include in Report Type' field added when Supplemental data element is added
        cy.get(MeasureGroupPage.ippIncludeInReportTypeField).should('exist')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Individual')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Subject List')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Summary')
        cy.get(MeasureGroupPage.ippIncludeInReportTypeDropdownList).should('contain.text', 'Data Collection')
        cy.get('[data-testid=ArrowDropDownIcon]').eq(1).click()

        //Save Supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')
    })

    it('Clicking on Discard changes button on Supplemental data elements page will revert the changes made before save', () => {

        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox)
            .first() // select the first element
            .type('Initial Population Description')

        //Click on Discard changes button
        cy.get(MeasureGroupPage.discardChangesBtn).click()
        cy.get(MeasureGroupPage.discardChangesConfirmationMsg).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(Global.discardChangesContinue).click()
    })
})


