import { EditMeasurePage } from "./EditMeasurePage"
export class CQLEditorPage {


    //button to save CQL
    public static readonly saveCQLButton = '[data-testid="save-cql-btn"]'

    //message that appears for various alerts that occur at successful saving
    public static readonly saveAlertMessage = '[id="status-handler"]'

    //error toast message when a CQL change has an affect on PC
    public static readonly measureErrorToast = '[class="toast danger"]'

    //error tooltip container
    public static readonly errorContainer = '#ace-editor-wrapper > div.ace_tooltip'

    //success save message without errors
    public static readonly successfulCQLSaveNoErrors = '[data-testid="generic-success-text-header"]'

    //Error/warning marker in side of the CQL Editor window
    public static readonly errorInCQLEditorWindow = '#ace-editor-wrapper > div.ace_gutter > div > div.ace_gutter-cell.ace_error'
    public static readonly warningInCQLEditorWindow = '.ace_warning'

    //UMLS Not Logged in Error
    public static readonly umlsMessage = '[data-testid="valueset-success"]'

    //Code Search page
    public static readonly codesTab = '[data-testid="codes-tab"]'
    public static readonly codeSubTab = '[data-testid="code-tab"]'
    public static readonly savedCodesTab = '[data-testid="savedCodes-tab"]'
    public static readonly codeSystemVersionDropdown = '[id="code-system-version-selector"]'
    public static readonly codeSystemVersionOption = '[data-value="version 1"]'
    public static readonly codeText = '[data-testid="code-text-input"]'
    public static readonly codeSystemDropdown = '[id="code-system-selector"]'
    public static readonly codeSystemOption = '[data-value="Code System 1"]'
    public static readonly codeSystemSearchBtn = '[data-testid="codes-search-btn"]'
    public static readonly codeSystemClearBtn = '[data-testid="clear-codes-btn"]'
    public static readonly codeSystemSearchResultsTbl = '[data-testid="codes-results-tbl"]'
    public static readonly codeSystemOptionListBox = '[id="code-system-selector-listbox"]'
    public static readonly toolTip = 'tr > :nth-child(1) > .MuiButtonBase-root'
    public static readonly toolTipMsg = '.MuiTooltip-tooltip'
    public static readonly clearCodeBtn = '[data-testid="clear-codes-btn"]'
    public static readonly selectDropdownBtn = '[data-testid="select-action-0_apply"]'
    public static readonly selectOptionListBox = '[class="btn-container"]'
    public static readonly removeCodeConfirmationMsg = '[class="dialog-warning-body"]'
    public static readonly removeCodeContinueBtn = '[data-testid="delete-dialog-continue-button"]'
    public static readonly saveSuccessMsg = '[class="toast success"]'

    //Value Sets page / tab
    public static readonly valueSetsTab = '[data-testid="valueSets-tab"]'
    public static readonly valueSetsCategoryDD = '[data-testid="search-by-category-input"]'
    public static readonly valueSetSearchCategoryDropDOwn = '[data-testid="search-by-category-dropdown"]'
    public static readonly valueSetSearchCategoryListBox = '[id="search-by-category-listbox"]'
    public static readonly valueSetSearchOIDURLText = '[data-testid="url-text-input"]'
    public static readonly valueSetSearchDefinitionVersion = '[data-testid="version-text-input"]'
    public static readonly valueSetSearchSrchBtn = '[data-testid="valuesets-search-btn"]'
    public static readonly valueSetSearchResultsTbl = '[data-testid="value-sets-results-tbl"]'
    public static readonly valueSetSearchFilterSubTab = '[data-testid="terminology-section-Filter-sub-heading"]'
    public static readonly valueSetSearchFilterDropDown = '[data-testid="filter-by-category-dropdown"]'
    public static readonly valueSetSearchFilterListBox = '[id="filter-by-category-listbox"]'
    public static readonly valueSetSearchFilterInput = '[data-testid="status-text-input"]'
    public static readonly valueSetSearchFilterApplyBtn = '[data-testid="valuesets-filter-btn"]'
    public static readonly valueSetDetailsScreen = '.MuiPaper-rounded'
    public static readonly valueSetSuffixInput = '[data-testid="suffix-max-length-input"]'
    public static readonly applyValueSetSuffix = '[data-testid="apply-suffix-continue-button"]'

    //Definition
    public static readonly cqlEditorPageDefinitionSubTab = '[data-testid="definitions-tab"]'

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

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
    }
}
