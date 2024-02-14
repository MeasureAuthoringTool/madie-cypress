import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Measure Observations', () => {

    beforeEach('Create New Measure and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach(' Clean up and Logout', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()

    })

    it('Add Measure Observations for Ratio Measure', () => {

        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('exist')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('be.visible')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).wait(1000).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.denominatorObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).contains('Count')
        cy.get(MeasureGroupPage.numeratorObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).contains('Maximum')

    })

    it('Add Measure Observations for Continuous Variable Measure', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.measureScoringSelect).click()
        cy.get(MeasureGroupPage.measureScoringCV).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(1).click() //select ipp

        cy.get(MeasureGroupPage.measurePopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(0).click() //select denom

        cy.get(MeasureGroupPage.cvMeasureObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).should('exist')
        cy.get(MeasureGroupPage.measureObservationSelect).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.MOBooleanFunctionValue, 20700)
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('exist')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('be.visible')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).click()

        cy.get(MeasureGroupPage.cvAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Continuous Variable')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.measurePopulationSelect).contains('denom')
        cy.get(MeasureGroupPage.cvMeasureObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.cvAggregateFunction).contains('Count')
    })

    it('Remove Measure Observations from Ratio Measure', () => {

        MeasureGroupPage.createMeasureGroupforRatioMeasure()
        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Denominator Observation
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('exist')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('be.visible')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).wait(1000).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.denominatorObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).contains('Count')
        cy.get(MeasureGroupPage.numeratorObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).contains('Maximum')

        //Remove Denominator Observation and assert
        cy.get(MeasureGroupPage.removeDenominatorObservation).click()
        cy.get(MeasureGroupPage.denominatorObservation).should('not.exist')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).should('not.exist')

        //Remove Numerator Observation and assert
        cy.get(MeasureGroupPage.removeNumeratorObservation).click()
        cy.get(MeasureGroupPage.numeratorObservation).should('not.exist')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).should('not.exist')

    })

    it('Verify drop down values for Measure observation aggregate function', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.setMeasureGroupType()
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        //Verify default value
        cy.get(MeasureGroupPage.cvAggregateFunction).should('contain.text', 'Select Aggregate Function')

        //Verify Aggregate function dropdown values
        cy.get(MeasureGroupPage.cvAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionDropdownList).each(($ele) => {
            expect($ele.text()).to.be.eq('AverageCountMaximumMedianMinimumSum')

        })
    })
})

describe('Measure Observations and Stratification -- non-owner tests', () => {

    beforeEach('Create New Measure and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach(' Clean up and Logout', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        //Log Out
        cy.get('[data-testid="user-profile-select"]').click()
        cy.get('[data-testid="user-profile-logout-option"]').click({ force: true }).wait(1000)
        cy.log('Log out successful')
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Non-owner of measure cannot change measure observation', () => {

        MeasureGroupPage.createMeasureGroupforRatioMeasure()
        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('exist')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('be.visible')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).wait(1000).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.denominatorObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).contains('Count')
        cy.get(MeasureGroupPage.numeratorObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).contains('Maximum')

        //second / non-owner user
        OktaLogin.Logout()
        OktaLogin.AltLogin()

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).should('exist')
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //enter edit page
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that measure observation cannot be changed
        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        cy.get(MeasureGroupPage.denominatorObservation).should('not.be.enabled')

        cy.get(MeasureGroupPage.denominatorAggregateFunction).should('exist')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).should('be.visible')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).should('not.be.enabled')

        cy.get(MeasureGroupPage.numeratorObservation).should('exist')
        cy.get(MeasureGroupPage.numeratorObservation).should('be.visible')
        cy.get(MeasureGroupPage.numeratorObservation).should('not.be.enabled')

        cy.get(MeasureGroupPage.numeratorAggregateFunction).should('exist')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).should('be.visible')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).should('not.be.enabled')
    })

    it('Measure Observations and stratification cannot be changed by non-owner', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.measureScoringSelect).click()
        cy.get(MeasureGroupPage.measureScoringCV).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(1).click() //select ipp

        cy.get(MeasureGroupPage.measurePopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(0).click() //select denom

        cy.get(MeasureGroupPage.cvMeasureObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).should('exist')
        cy.get(MeasureGroupPage.measureObservationSelect).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.MOToCodeValue, 20700)
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('exist')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('be.visible')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).click()
        cy.get(MeasureGroupPage.cvAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Continuous Variable')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.measurePopulationSelect).contains('denom')
        cy.get(MeasureGroupPage.cvMeasureObservation).contains('booleanFunction')
        cy.get(MeasureGroupPage.cvAggregateFunction).contains('Count')

        //second / non-owner user
        OktaLogin.Logout()
        OktaLogin.AltLogin()

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).should('exist')
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //enter edit page
        MeasuresPage.measureAction("edit")

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //verify that measure observation cannot be changed
        cy.get(MeasureGroupPage.cvMeasureObservation).should('exist')
        cy.get(MeasureGroupPage.cvMeasureObservation).should('be.visible')
        cy.get(MeasureGroupPage.cvMeasureObservation).should('not.be.enabled')

        cy.get(MeasureGroupPage.cvAggregateFunction).should('exist')
        cy.get(MeasureGroupPage.cvAggregateFunction).should('be.visible')
        cy.get(MeasureGroupPage.cvAggregateFunction).should('not.be.enabled')

        //navigate to stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //verify that stratification fields cannot be changed / updated
        cy.get(MeasureGroupPage.stratOne).should('not.be.enabled')

        cy.get(MeasureGroupPage.stratAssociationOne).should('not.be.enabled')

        cy.get(MeasureGroupPage.stratTwo).should('not.be.enabled')

        cy.get(MeasureGroupPage.stratAssociationTwo).should('not.be.enabled')
    })
})

describe('Measure Observation - Expected Values', () => {

    beforeEach('Create New Measure and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach(' Clean up and Logout', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify Expected values for Boolean Type Continuous Variable Measure Observations', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')


        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'num')

        cy.get(MeasureGroupPage.cvMeasureObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).should('exist')
        cy.get(MeasureGroupPage.measureObservationSelect).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.MOBooleanFunctionValue, 20700)
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('exist')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('be.visible')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).click()
        cy.get(MeasureGroupPage.cvAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and verify Measure Observations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('TestCase001')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('testCaseDescription')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('testCaseSeries').type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).wait(1000).check()
        cy.get(TestCasesPage.testCaseMSRPOPLExpected).wait(1000).should('be.checked')

        //Verify Measure Observation row is added
        cy.get(TestCasesPage.measureObservationRow).should('exist')

        //Check Measure Population Exclusion and verify Observation row goes away
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.measureObservationRow).should('not.exist')

        //Uncheck Measure Population Exclusion and verify Observation row re appears
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseMSRPOPLEXExpected).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.measureObservationRow).should('exist')
    })

    it('Verify Expected values for Boolean Type Ratio Measure Observations', () => {

        MeasureGroupPage.createMeasureGroupforRatioMeasure()
        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
        //navigate back to the measure group page
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('exist')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).should('be.visible')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).wait(1000).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        Utilities.dropdownSelect(MeasureGroupPage.numeratorObservation, 'booleanFunction') // select booleanFunction
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionMaximum).click()

        //save Measure Group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and verify Measure Observations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('TestCase002')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('testCaseDescription')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('testCaseSeries').type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        TestCasesPage.clickEditforCreatedTestCase()
        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseDENOMExpected).wait(1000).check()
        cy.get(TestCasesPage.testCaseDENOMExpected).wait(1000).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).wait(1000).check()
        cy.get(TestCasesPage.testCaseNUMERExpected).wait(1000).should('be.checked')

        //Verify Numerator and Denominator Observation rows are added
        cy.get(TestCasesPage.denominatorObservationRow).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).should('exist')

        //Check Denominator Exclusion and verify Denominator Observation row goes away
        cy.get(TestCasesPage.testCaseDENEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.denominatorObservationRow).should('not.exist')

        //Uncheck Denominator Exclusion and verify Denominator Observation row re appears
        cy.get(TestCasesPage.testCaseDENEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXExpected).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.denominatorObservationRow).should('exist')

        //Check Numerator Exclusion and verify Numerator Observation row goes away
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.numeratorObservationRow).should('not.exist')

        //Uncheck Numerator Exclusion and verify Numerator Observation row re appears
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXExpected).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.numeratorObservationRow).should('exist')

        //Check Numerator & Denominator Exclusion and verify Numerator & Denominator Observation rows goes away
        cy.get(TestCasesPage.testCaseNUMEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.testCaseDENEXExpected).check().should('be.checked')
        cy.get(TestCasesPage.denominatorObservationRow).should('not.exist')
        cy.get(TestCasesPage.numeratorObservationRow).should('not.exist')

        //Uncheck Numerator & Denominator Exclusion and verify Numerator & Denominator Observation rows re appear
        cy.get(TestCasesPage.testCaseNUMEXExpected).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENEXExpected).uncheck().should('not.be.checked')
        cy.get(TestCasesPage.denominatorObservationRow).should('exist')
        cy.get(TestCasesPage.numeratorObservationRow).should('exist')
    })
})

describe('Validate Measure Observation Parameters', () => {

    beforeEach('Create New Measure and Login', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()
    })

    afterEach(' Clean up and Logout', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
        OktaLogin.Logout()
    })

    it('Verify error message when the population basis does not match with the function selected for Measure Observation', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 11700)
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 11700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 20700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 11700)
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        //Verify error message when the function selected for Measure Observation has parameters for Boolean population basis type
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'isFinishedEncounter') //select isFinishedEncounter
        cy.get('[data-testid="measure-observation-cv-obs-helper-text"]').should('contain.text', 'Selected function can not have parameters')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

        //Change population basis to Encounter
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        //Verify error message when the parameter used in function selected for Measure Observation does not match with population basis type

        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'fun') //select fun
        cy.get('[data-testid="measure-observation-cv-obs-helper-text"]').should('contain.text', 'Selected function must have exactly one parameter of type Encounter')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })
})
