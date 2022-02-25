import {EditMeasurePage} from "../Shared/EditMeasurePage"

export class MeasureGroupPage {

    //Measure Details
    public static readonly measureScoringUnit = "Ratio"
    public static readonly initialPopulation1 = ""

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = '#main > div > div > div > form > div:nth-child(1) > div.sc-jObWnj.knmXkm > div > div.MuiAlert-message.css-1w0ym84'

    public static clickMeasureGroupTab(): void {
        let measureGroupTabValue = EditMeasurePage.measureGroupsTab
        cy.get(measureGroupTabValue)
        .invoke('removeAttr', 'target')
        .click()
    }
}