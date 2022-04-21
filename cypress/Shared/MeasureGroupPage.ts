import {MeasuresPage} from "./MeasuresPage"
import {EditMeasurePage} from "./EditMeasurePage"
import {CQLEditorPage} from "./CQLEditorPage"
import {Header} from "./Header"

export class MeasureGroupPage {

    //Scoring drop-down box
    public static readonly measureScoringSelect = '[data-testid="scoring-unit-select"]'
    public static readonly saveMeasureGroupDetails = '[data-testid="group-form-submit-btn"]'

    //Populations
    public static readonly initialPopulationSelect = '[name="population.initialPopulation"]'
    public static readonly denominatorSelect = '[name="population.denominator"]'
    public static readonly denominatorExclusionSelect = '[name="population.denominatorExclusion"]'
    public static readonly denominatorExceptionSelect = '[name="population.denominatorException"]'
    public static readonly numeratorSelect = '[name="population.numerator"]'
    public static readonly numeratorExclusionSelect = '[name="population.numeratorExclusion"]'
    public static readonly measurePopulationSelect = '[name="population.measurePopulation"]'
    public static readonly measurePopulationExclusionSelect = '[name="population.measurePopulationExclusion"]'

    //Measure group description
    public static readonly measureGroupDescriptionBox = '[name="groupDescription"]'

    //Measure score Details
    public static readonly measureScoringUnit = "Ratio"

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = '.MuiAlert-message.css-1w0ym84'

    //update button
    public static readonly confirmScoreUnitValueUpdateBtn = '[data-testid="group-form-update-btn"]'

    public static createMeasureGroupforProportionMeasure () : void {

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

        cy.get(this.initialPopulationSelect).select('ipp')
        cy.get(this.denominatorSelect).select('denom')
        cy.get(this.numeratorSelect).select('num')
        cy.get(this.numeratorExclusionSelect).select('num')
        cy.get(this.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(this.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(this.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    }

    public static createMeasureGroupforRatioMeasure () : void {

        cy.get(Header.mainMadiePageButton).click()

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

        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

    }
}
