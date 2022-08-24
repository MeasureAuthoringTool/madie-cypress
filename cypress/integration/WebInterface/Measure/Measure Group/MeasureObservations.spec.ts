import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Header} from "../../../../Shared/Header"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"

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

        //Add Denominator Observation
        cy.log('Adding Measure Observations')
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(0).click() //select ToCode
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(2).click() //select isFinishedEncounter
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
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.denominatorObservation).contains('ToCode')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).contains('Count')
        cy.get(MeasureGroupPage.numeratorObservation).contains('isFinishedEncounter')
        cy.get(MeasureGroupPage.numeratorAggregateFunction).contains('Maximum')

    })

    it('Add Measure Observations for Continuous Variable Measure', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Process") {
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeDropdownBtn).click({force: true})

        cy.get(MeasureGroupPage.measureScoringSelect).click()
        cy.get(MeasureGroupPage.measureScoringCV).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(1).click() //select ipp

        cy.get(MeasureGroupPage.measurePopulationSelect).click()
        cy.get(MeasureGroupPage.measurePopulationOption).eq(0).click() //select denom

        cy.get(MeasureGroupPage.cvMeasureObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(1).click() //select isFinishedEncounter
        cy.get(MeasureGroupPage.cvAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Continuous Variable')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.measurePopulationSelect).contains('denom')
        cy.get(MeasureGroupPage.cvMeasureObservation).contains('isFinishedEncounter')
        cy.get(MeasureGroupPage.cvAggregateFunction).contains('Count')
    })

    it('Remove Measure Observations from Ratio Measure', () => {

        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Add Denominator Observation
        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(0).click() //select ToCode
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()

        //Add Numerator Observation
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).eq(2).click() //select isFinishedEncounter
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
        //navigate back to the measure group page
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //verify the saved Measure Observations
        cy.get(MeasureGroupPage.measureScoringSelect).contains('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).contains('ipp')
        cy.get(MeasureGroupPage.denominatorObservation).contains('ToCode')
        cy.get(MeasureGroupPage.denominatorAggregateFunction).contains('Count')
        cy.get(MeasureGroupPage.numeratorObservation).contains('isFinishedEncounter')
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
})