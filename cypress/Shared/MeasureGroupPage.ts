import {EditMeasurePage} from "../Shared/EditMeasurePage"

export class MeasureGroupPage {

    //Measure Details
    public static readonly measureScoringUnit = "Ratio"
    public static readonly initialPopulation1 = ""

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = 'div[data-testid=success-alert] .MuiAlert-message'

    public static clickMeasureGroupTab(): void {
        let measureGroupTabValue = EditMeasurePage.measureGroupsTab
        cy.get(measureGroupTabValue)
        .invoke('removeAttr', 'target')
        .click()
    }
}