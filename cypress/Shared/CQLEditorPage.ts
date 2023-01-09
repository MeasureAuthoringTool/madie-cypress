import { EditMeasurePage } from "./EditMeasurePage"
export class CQLEditorPage {

    //error tooltip container
    public static readonly errorContainer = '#ace-editor-wrapper > div.ace_tooltip'

    //success save message without errors
    public static readonly successfulCQLSaveNoErrors = '[data-testid="generic-success-text-header"]'

    //Error/warning marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = '#ace-editor-wrapper > div.ace_gutter > div > div.ace_gutter-cell.ace_error'
    public static readonly warningInCQLEditorWindow = '.ace_warning'

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

    public static validateSuccessfulCQLSave(): void {

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).each(successMsg => {
            expect(successMsg.text()).to.be.oneOf(['Changes saved successfully but the following errors were found', 'CQL saved successfully'])
        })
    }

    public static validateSuccessfulCQLUpdate(): void {

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).each(msg => {
            expect(msg.text()).to.be.oneOf(['CQL updated successfully! Library Name and/or Version can not be updated in the CQL Editor. MADiE has overwritten the updated Library Name and/or Version.', 'Changes saved successfully but the following errors were found'])
        })
    }
}