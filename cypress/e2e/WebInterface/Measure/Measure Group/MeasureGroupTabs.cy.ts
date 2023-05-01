import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.SBTEST_CQL

describe('Validating Population tabs', () => {
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

    it('Can successfully update / change score value and save on population tab', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //change score and select population value for new score and save
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
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
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'ipp')

    })

    it('Can successfully update / change population value and save on population tab', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //change / update a population value for current scoring
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'num')

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
        MeasuresPage.measureAction("edit")

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
    })

    it('Changes are saved across different tabs', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')


        //navigate to the populations tab
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //change / update a population value for current scoring
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'denom')

        //navigate back to the reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab and their recently updated values
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('contain.value', 'Typed some value for Rate Aggregation text area field')

        //navigate back to the reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Increased score indicates improvement')

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
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
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
        cy.get(MeasureGroupPage.initialPopulationSelect).should('contain.text', 'denom')

    })

    it('Assert indicator on tab with error, until error is removed', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select Ratio scoring type and only indicate a value for one of the required fields
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'denom')

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
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')

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
        MeasuresPage.measureAction("edit")

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

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

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

        //assert that the two fields appear on the reporting tab and are blank / without a selected value
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Select Improvement Notation')

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

describe('Validating Stratification tabs', () => {

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
    it('Stratification tab includes new fields and those fields have expected values', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //confirm stratification related fields are present
        cy.get(MeasureGroupPage.stratOne).should('exist')
        cy.get(MeasureGroupPage.stratTwo).should('exist')
        cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
        cy.get(MeasureGroupPage.stratAssociationTwo).should('exist')
        cy.get(MeasureGroupPage.stratDescOne).should('exist')
        cy.get(MeasureGroupPage.stratDescTwo).should('exist')
        cy.get(MeasureGroupPage.addStratButton).should('exist')

        //confirm values in stratification 1 related fields -- score type is Proportion
        //stratification 1 -- default value
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'Select Definition')
        cy.get(MeasureGroupPage.stratOne).each(($ele) => {
            expect($ele.text()).to.be.oneOf(['Select Definition', 'denom', 'ipp', 'num'])
        })
        //Association -- default value -- score type is Proportion
        cy.get(MeasureGroupPage.stratAssociationOne).should('contain.text', 'Initial Population')
        //Association -- contains these values based off score type -- score type is Proportion
        cy.get(MeasureGroupPage.stratAssociationOne).each(($ele) => {
            expect($ele.text()).to.be.oneOf(['Initial Population', 'Denominator', 'Denominator Exclusion', 'Numerator', 'Numerator Exclusion', 'Denominator Exception'])
        })

        //change score type to Cohort
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()
        //Association -- contains these values based off score type -- score type is Cohort
        cy.get(MeasureGroupPage.stratAssociationOne)
            .should('contain.text', 'Initial Population')
        //change score type to Continuous Variable
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()
        //Association -- default value -- score type is Continuous Variable
        cy.get(MeasureGroupPage.stratAssociationOne)
            .should('contain.text', 'Initial Population')
        //Association -- contains these values based off score type -- score type is Continuous Variable
        cy.get(MeasureGroupPage.stratAssociationOne).each(($ele) => {
            expect($ele.text()).to.be.oneOf(['Initial Population', 'Measure Population', 'Measure Population Exclusion'])
        })

    })

    it('Stratification does not save, if association is the only field that has a value selected', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //enter a value for the required Population Basis field
        cy.get(MeasureGroupPage.popBasis).type('Boolean').type('{enter}')

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()


        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //select a value only for Association
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')

        //save
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })
        //Association -- default value -- score type is Proportion
        cy.get(MeasureGroupPage.stratAssociationOne).should('contain.text', 'Initial Population')
    })

    it('Add multiple stratifications to the measure group', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 32000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).wait(500).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationThree, 'numerator')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        //Add Stratification 4
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratFour, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationFour, 'initialPopulation')
        cy.get(MeasureGroupPage.stratDescFour).type('StratificationFour')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate back to stratification tab and assert the values
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.stratTwo).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.stratThree).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.stratFour).should('contain.text', 'denom')
    })

    it('Removing stratifications from a measure group', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationThree, 'numerator')
        cy.get(MeasureGroupPage.stratDescThree).type('StratificationThree')

        //Add Stratification 4
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratFour, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationFour, 'initialPopulation')
        cy.get(MeasureGroupPage.stratDescFour).type('StratificationFour')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click({ force: true })

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Remove Stratifications
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })

        //Remove Stratification 1 and 2
        cy.get(MeasureGroupPage.removeStratButton).eq(0).click()
        cy.get(MeasureGroupPage.removeStratButton).eq(0).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })

        //Verify Stratifications after removing 1 and 2
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'ipp')
        cy.get(MeasureGroupPage.stratDescOne).should('contain.text', 'StratificationThree')
        cy.get(MeasureGroupPage.stratTwo).should('contain.text', 'denom')
        cy.get(MeasureGroupPage.stratDescTwo).should('contain.text', 'StratificationFour')

    })

    it('Stratification tab is not present / available when the Ratio scoring value is selected', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //select Ratio scoring type
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        //assert that Stratification is no longer available
        cy.get(MeasureGroupPage.stratificationTab).should('not.exist')

    })

    it('Stratification added successfully when population basis match with Stratification return type', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationOne, 'denominator')
        cy.get(MeasureGroupPage.stratDescOne).type('StratificationOne')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.stratAssociationTwo, 'numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('StratificationTwo')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

    })

    it('Verify error message when the Stratification return type does not match with population basis', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.populationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.populationTab, 30000)
        cy.get(MeasureGroupPage.populationTab).should('exist')
        cy.get(MeasureGroupPage.populationTab).click()

        //Set Population basis as Encounter
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'denom')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'denom')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'The selected definition does not align with the Population Basis field selection of Encounter')

        //Verify save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })
})

describe('Validating Reporting tabs', () => {

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

    it('Reporting tab contains Rate Aggregation text area and Improvement Notation drop-down box', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).should('be.empty')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('exist').should('be.visible')
        cy.get(MeasureGroupPage.improvementNotationSelect).should('contain.text', 'Select Improvement Notation')

    })

    it('Can successfully update / change Reporting tab values and save on Reporting tab', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Reporting tab
        cy.get(MeasureGroupPage.reportingTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.reportingTab, 30000)
        cy.get(MeasureGroupPage.reportingTab).should('exist')
        cy.get(MeasureGroupPage.reportingTab).click()

        //assert the two fields that should appear in the Reporting tab
        cy.get(MeasureGroupPage.rateAggregation).should('exist').should('be.visible').should('be.enabled')
        cy.get(MeasureGroupPage.rateAggregation).type('Typed some value for Rate Aggregation text area field')
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 30700)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).focus()
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 30700)

        //assert save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

    })
})

describe('Supplemental data elements and Risk Adjustment variables on Measure group page', () => {

    beforeEach('Create measure, Measure Group and login', () => {

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

    it('Add Risk adjustment variables to the Measure group', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Risk Adjustment tab
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).type('Initial Population Description')

        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(MeasureGroupPage.riskAdjustmentSaveSuccessMsg).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

        //Click on clear Icon and verify description field is removed
        cy.get(MeasureGroupPage.cancelIcon).click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('not.exist')

        cy.get(MeasureGroupPage.saveRiskAdjustments).click()
        cy.get(MeasureGroupPage.riskAdjustmentSaveSuccessMsg).should('contain.text', 'Measure Risk Adjustments have been Saved Successfully')

    })

    it('Clicking on Discard changes button on Risk Adjustment page will revert the changes made before save', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Risk Adjustment tab
        cy.get(MeasureGroupPage.leftPanelRiskAdjustmentTab).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionSelect).click()
        cy.get(MeasureGroupPage.riskAdjustmentDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).type('Initial Population Description')

        //Click on Discard changes button
        cy.get(MeasureGroupPage.discardChangesBtn).click()
        cy.get(MeasureGroupPage.discardChangesConfirmationMsg).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(MeasureGroupPage.discardChangesContinueBtn).click()
        cy.get(MeasureGroupPage.riskAdjustmentTextBox).should('be.empty')
        cy.get(MeasureGroupPage.riskAdjustmentDescriptionTextBox).should('not.exist')
    })

    it('Add Supplemental data elements to the Measure group', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('Initial Population Description')

        //Save Supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')

        //Click on clear Icon and verify description field is removed
        cy.get(MeasureGroupPage.cancelIcon).click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('not.exist')

        //Save Supplemental data
        cy.get(MeasureGroupPage.saveSupplementalDataElements).click()
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Supplement Data Element Information Saved Successfully')

    })

    it('Clicking on Discard changes button on Supplemental data elements page will revert the changes made before save', () => {

        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on Supplemental data tab
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('ipp').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('exist')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('Initial Population Description')

        //Click on Discard changes button
        cy.get(MeasureGroupPage.discardChangesBtn).click()
        cy.get(MeasureGroupPage.discardChangesConfirmationMsg).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(MeasureGroupPage.discardChangesContinueBtn).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionTextBox).should('be.empty')
        cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).should('not.exist')
    })
})


