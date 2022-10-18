import {EditMeasurePage} from "./EditMeasurePage"
export class CQLEditorPage {

    //success save message without errors
    public static readonly successfulCQLSaveNoErrors = '[data-testid="generic-success-text-header"]'

    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'

    //UMLS Not Logged in Error
    public static readonly umlsMessage = '[data-testid="valueset-success"]'

    //editor message
    public static readonly editorMessage = '.sc-gsDKAQ.cYvjud'

    //click action on the tab to get to the CQL Editor
    public static clickCQLEditorTab(): void {

        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab)
        .invoke('removeAttr', 'target')
        .click()

    }

}