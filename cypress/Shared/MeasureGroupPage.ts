import {MeasuresPage} from "./MeasuresPage"
import {EditMeasurePage} from "./EditMeasurePage"
import {CQLEditorPage} from "./CQLEditorPage"

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

    //Measure Details
    public static readonly measureScoringUnit = "Ratio"

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = '.MuiAlert-message.css-1w0ym84'

    public static createMeasureGroupforRatioMeasure () : void {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/EXM124v7QICore4Entry.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(this.initialPopulationSelect).select('SDE Ethnicity')
        cy.get(this.denominatorSelect).select('SDE Payer')
        cy.get(this.denominatorExclusionSelect).select('SDE Race')
        cy.get(this.numeratorSelect).select('Initial Population')
        cy.get(this.numeratorExclusionSelect).select('SDE Ethnicity')
        cy.get(this.saveMeasureGroupDetails).click()
        //validation successful save message
        cy.get(this.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(this.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    }

}