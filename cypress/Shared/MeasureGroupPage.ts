import {EditMeasurePage} from "../Shared/EditMeasurePage"

export class MeasureGroupPage {

    //Measure Details
    public static readonly measureScoringUnit = "Ratio"
    public static readonly initialPopulation1 = ""

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = '.MuiAlert-message.css-1w0ym84'
    //div[data-testid=success-alert] 
    //#main > div > div > div > form > div:nth-child(1) > div.sc-jObWnj.knmXkm > div > div.MuiAlert-message.css-1w0ym84
    //<div class="MuiAlert-message css-1w0ym84">Population details for this group saved successfully.</div>

    public static clickMeasureGroupTab(): void {
        let measureGroupTabValue = EditMeasurePage.measureGroupsTab
        cy.get(measureGroupTabValue)
        .invoke('removeAttr', 'target')
        .click()
    }
}