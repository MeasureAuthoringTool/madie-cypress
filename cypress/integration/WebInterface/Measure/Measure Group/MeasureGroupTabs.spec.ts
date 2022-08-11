import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Validating group tabs', () => {
    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'ipp', 'num', 'denom')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Verifying Population tab with Proportion selected', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Proportion')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorExceptionSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('exist').should('be.visible').should('be.enabled')

    })
    it('Verifying Population tab with Ratio selected', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.numeratorSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).should('exist').should('be.visible').should('be.enabled')

    })
    it('Verifying Population tab with Cohort selected', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Cohort')        
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')

    })
    it('Verifying Population tab with Continuous Variable selected', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureScoringSelect).should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Continuous Variable')              
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measurePopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measurePopulationExclusionSelect).should('exist').should('be.visible').should('be.enabled')

    })
    it('Stratification tab includes new fields and those fields have expectedd values', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //save CQL as is
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()     
        
        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')        
        cy.get(MeasureGroupPage.stratificationTab).click()

        //confirm stratification related fields are present
        cy.get(MeasureGroupPage.stratOne).should('exist')
        cy.get(MeasureGroupPage.stratTwo).should('exist')
        cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
        cy.get(MeasureGroupPage.stratAssociationTwo).should('exist')
        cy.get(MeasureGroupPage.stratDescOne).should('exist')
        cy.get(MeasureGroupPage.stratDescTwo).should('exist')
        cy.get(MeasureGroupPage.saveStratButton).should('exist')

        //confirm values in stratification 1 related fields
        //stratification 1 -- default value
        cy.get(MeasureGroupPage.stratOne).find('option:selected').should('have.text', '-')
        //stratification 1 -- contains these values, in this order, based off of CQL
        cy.get(MeasureGroupPage.stratOne)
            .should('include.text', '-')
            .should('include.text', 'denom')
            .should('include.text', 'ipp')
            .should('include.text', 'num')
            
        //Association -- default value
        cy.get(MeasureGroupPage.stratAssociationOne).find('option:selected').should('have.text', 'Initial Population')
        //Association -- contains these values based off score type
        cy.get(MeasureGroupPage.stratAssociationOne)
            .should('contain','Initial Population')
            .should('contain', 'Denominator')
            .should('contain', 'Denominator Exclusion')
            .should('contain', 'Numerator')
            .should('contain', 'Numerator Exclusion')
            .should('contain', 'Denominator Exception')

    })
    it('Reporting tab contains Rate Aggregation text area and Improvement Notation drop-down box', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Select')

    })
    it('Can successfully update / change score value and save on population tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //change score and select population value for new score and save
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Cohort')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 3000)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.popUpConfirmationModal).should('exist')
        cy.get(MeasureGroupPage.popUpConfirmationModal).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.popUpConfirmationModal, 3000)
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('exist')
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.scoreUpdateMGConfirmMsg, 3000)
        cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should('contain.text', 'Your Measure Scoring is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationMsg).should('contain.text', 'Are you sure you want to Save Changes?')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationUndoWarning).should('contain.text', 'This action cannot be undone.')

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')

    })
    it('Can successfully update / change population value and save on population tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //change / update a population value for current scoring
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('num')

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
    })
    it('Can successfully update / change Reporting tab values and save on Reporting tab', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).select('Increased score indicates improvement')

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

    })
    it('Changes are retained while moving across different tabs', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).select('Increased score indicates improvement')

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

        //navigate to the populations tab
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //navigate back to the reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value','Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text','Increased score indicates improvement')

        //navigate to the CQl tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value','Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text','Increased score indicates improvement')        


    })
    it('Changes are saved across different tabs', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')        
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')        
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).select('Increased score indicates improvement')

        //navigate to the populations tab
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //change / update a population value for current scoring
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('denom')        

        //navigate back to the reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')        
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value','Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text','Increased score indicates improvement')

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

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')        
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value','Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text','Increased score indicates improvement')

        //navigate to the populations tab
        cy.get(MeasureGroupPage.populationTab).should('exist')        
        cy.get(MeasureGroupPage.populationTab).click()

        //aeert the change / update to population value for current scoring
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.value', 'denom')

    })
    it('Stratification tab is not present / available when the Ratio scoring value is selected', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')        
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select Ratio scoring type
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Ratio')

        //assert that Stratification is no longer available
        cy.get(MeasureGroupPage.stratificationTab).should('not.exist')

    })
    it('Assert indicator on tab with error, until error is removed', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')        
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select Continuous Variable scoring type and only indicate a value for one of the required fields
        cy.get(MeasureGroupPage.measureScoringSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).select('Continuous Variable')
        cy.get(MeasureGroupPage.initialPopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('denom')

        //make reporting the active tab
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert that error indicator appears on the population tab
        cy.get(MeasureGroupPage.populationTab)
            .then(($message) => {assert($message.text, 'Populations 🚫') })
        //click on the population tab and correct issue
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()
        cy.get(MeasureGroupPage.measurePopulationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.measurePopulationSelect).select('num')

        //make reporting the active tab
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')        
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert that the error indicator no longer appears on the population tab
        cy.get(MeasureGroupPage.populationTab)
        .then(($message) => {assert($message.text, 'Populations') })



    })
    it('Assert all fields, in all tabs, are for the measure group that is selected', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')        
        cy.get(MeasureGroupPage.reportingTab).click()
        
        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).select('Increased score indicates improvement')

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
        for (let i = 1; i <= 4; i++){

            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
            cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.enabled')
            cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        }
        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('exist')        
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert that the two fields appear on the reporting tab and are blank / without a selected value
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Select')

        //Click on Populations tab
        cy.get(MeasureGroupPage.populationTab).should('exixt')
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