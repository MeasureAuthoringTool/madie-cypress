import { EditMeasurePage } from "./EditMeasurePage"
import { Utilities } from "./Utilities"
import { CQLLibraryPage } from "./CQLLibraryPage"

export class CQLEditorPage {

    public static readonly mainCqlDocument = '.left-panel'

    //button to save CQL
    public static readonly saveCQLButton = '[data-testid="save-cql-btn"]'

    // discard changes
    public static readonly discardChanges = '[data-testid="reset-cql-btn"]'

    //message that appears for various alerts that occur at successful saving
    public static readonly saveAlertMessage = '[id="status-handler"]'

    //error tooltip container
    public static readonly errorContainer = '#ace-editor-wrapper > div.ace_tooltip'
    public static readonly errorMsg = '[data-testid="generic-errors-text-list"]'
    public static readonly warningMsg = '[data-testid="generic-warnings-text-list"]'
    public static readonly minimizeButton = '[data-testid="minimize-button-0"]'
    public static readonly greenMessageBox = '.madie-alert.success'
    public static readonly orangeWarningBox = '[data-testid="generic-warning-text-header"]'

    public static readonly minimizedAlertsTab = '[data-testid="minimized-alert"]'

    //success save message without errors
    public static readonly successfulCQLSaveNoErrors = '.madie-alert'

    //Error/warning marker in side of the CQL Editor window
    public static readonly errorInCQLEditorWindow = '#ace-editor-wrapper > div.ace_gutter > div > div.ace_gutter-cell.ace_error'
    public static readonly warningInCQLEditorWindow = '.ace_warning'

    //UMLS Not Logged in Error
    public static readonly umlsMessage = '[data-testid="valueset-success"]'

    //Code Search page
    public static readonly codesTab = '[data-testid="codes-tab"]'
    public static readonly savedCodesTab = '[data-testid="savedCodes-tab"]'
    public static readonly codeSystemVersionDropdown = '[id="code-system-version-selector"]'
    public static readonly codeSystemVersionOption = '[data-value="version 1"]'
    public static readonly codeText = '[data-testid="code-text-input"]'
    public static readonly codeSystemOption = '[data-value="Code System 1"]'
    public static readonly codeSystemSearchBtn = '[data-testid="codes-search-btn"]'
    public static readonly codeSystemClearBtn = '[data-testid="clear-codes-btn"]'
    public static readonly codeSystemSearchResultsTbl = '[data-testid="codes-results-tbl"]'
    public static readonly codeSystemOptionListBox = '[id="code-system-selector-listbox"]'
    public static readonly toolTip = 'tr > :nth-child(1) > .MuiButtonBase-root'
    public static readonly toolTipMsg = '.MuiTooltip-tooltip'
    public static readonly clearCodeBtn = '[data-testid="clear-codes-btn"]'
    public static readonly editCodeBtn = '[data-testid="edit-code-0"]'
    public static readonly deleteCodeBtn = '[data-testid="delete-code-0"]'
    public static readonly applyCodeBtn = '[data-testid="apply-code-0"]'
    public static readonly removeCodeBtn = '[data-testid="remove-code-0"]'
    public static readonly selectDropdownBtn = '[data-testid="select-action-0_apply"]'
    public static readonly confirmationMsgRemoveDelete = '[class="dialog-warning-body"]'

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
    public static readonly applyValueSet = '[data-testid="apply-valueset-0"]'
    public static readonly valueSetActionCentreBtn = '[data-testid="action-center-button-0"]'
    public static readonly viewValueSetDetails = '[data-testid="action-center-0_View"]'
    public static readonly editValueSet = '[data-testid="action-center-0_Edit"]'

    //CQL Builder Sub tabs
    public static readonly expandCQLBuilder = '[data-testid="KeyboardTabOutlinedIcon"]'

    //Includes page
    public static readonly editLibraryAliasInput = '[data-testid="library-alias-input"]'
    public static readonly includesTab = '[data-testid="includes-tab"]'
    public static readonly librarySearchTextBox = '[data-testid="searchTerm-text-input"]'
    public static readonly librarySearchBtn = '[data-testid="search-btn"]'
    public static readonly librarySearchTable = '[data-testid="terminology-section-sub-header-content-Library Results"]'//'[data-testid="terminology-section-Library Results-sub-heading"]'
    public static readonly savedLibrariesTab = '[data-testid="saved-libraries-tab"]'
    public static readonly toastMeasureMessage = '[data-testid="measure-editor-toast"]'
    public static readonly savedLibrariesTable = '[data-testid="includes-panel"]'
    public static readonly deleteSavedLibrary = '[data-testid="DeleteOutlineIcon"]'
    public static readonly editSavedLibrary = '[data-testid="BorderColorOutlinedIcon"]'
    public static readonly libraryResultsTable = '[data-testid="library-results-table-body"]'
    public static readonly viewSavedLibrary = '[data-testid="view-button-0"]'
    public static readonly editSavedLibraryBtn = '[data-testid="edit-button-0"]'
    public static readonly aliasName = '[data-testid="library-alias-container"]'
    public static readonly versionNumber = '[data-testid="library-version-container"]'
    public static readonly versionDropdownBtn = '[data-testid="version-select"]'
    public static readonly versionNumberList = '#mui-9'
    public static readonly confirmationModal = '.MuiBox-root'
    public static readonly detailsModal = '#draggable-dialog-title'

    //Definitions page
    public static readonly definitionsTab = '[data-testid="definitions-tab"]'
    public static readonly definitionNameTextBox = '[data-testid="definition-name-text-input"]'
    public static readonly expressionEditorTypeDropdown = '[id="type-selector"]'
    public static readonly definitionOption = '[data-testid="Definitions-option"]'
    public static readonly expressionEditorNameDropdown = '[id="name-selector"]'
    public static readonly expressionEditorNameList = '#name-selector-listbox'
    public static readonly fluentFunctionOption = '[data-testid="Fluent Functions-option"]'
    public static readonly parametersOption = '[data-testid="Parameters-option"]'
    public static readonly expressionInsertBtn = '[data-testid="expression-insert-btn"]'
    public static readonly functionsOption = '[data-testid="Functions-option"]'
    public static readonly timingOption = '[data-testid="Timing-option"]'
    public static readonly preDefinedFunctionsOption = '[data-testid="Pre-Defined Functions-option"]'
    public static readonly savedDefinitionsTab = '[data-testid="saved-definitions-tab"]'
    public static readonly savedDefinitionsTable = '[data-testid="definitions-tbl"]'
    public static readonly editCQLDefinitions = '[data-testid="edit-button-0"]'
    public static readonly deleteCQLDefinitions = '[data-testid="delete-button-0"]'
    public static readonly saveDefinitionBtn = '[data-testid="definition-save-btn"]'
    public static readonly commentTextBox = '[data-testid="definition-comment-text"]'

    //Parameters page
    public static readonly parametersTab = '[data-testid="parameters-tab"]'
    public static readonly parameterEntryTab = '[data-testid="parameter-tab"]'
    public static readonly savedParametersTab = '[data-testid="saved-parameters-tab"]'
    public static readonly parameterNameTextBox = '[data-testid="parameter-name-input"]'
    public static readonly nameTextBoxErrors = '[data-testid="parameter-name-helper-text"]'
    public static readonly clearParametersExpressionButton = '[data-testid="clear-parameter-btn"]'
    public static readonly applyParametersExpressionButton = '[data-testid="apply-parameter-btn"]'
    public static readonly parameterExpressionEditor = '[data-testid="terminology-section-sub-header-content-Expression Editor"]'
    public static readonly editParameterNameTextBox = '[data-testid="parameter-name-text-input"]'
    public static readonly saveParameterBtn = '[data-testid="parameter-save-btn"]'
    public static readonly editSavedCQLParameters = '[data-testid="edit-button-0"]'
    public static readonly deleteSavedCQLParameters = '[data-testid="delete-button-0"]'

    public static readonly modalBody = '.MuiDialog-paper'
    public static readonly modalXButton = '[data-testid="close-button"]'
    public static readonly modalActionWarning = '.dialog-warning-action'
    public static readonly deleteCancelButton = '[data-testid="delete-dialog-cancel-button"]'
    public static readonly deleteContinueButton = '[data-testid="delete-dialog-continue-button"]'

    //Functions page
    public static readonly functionsTab = '[data-testid="functions-tab"]'
    public static readonly savedFunctionsTab = '[data-testid="saved-functions-tab"]'
    public static readonly functionNameTextbox = '[data-testid="function-name-text-input"]'
    public static readonly fluentFunctionCheckbox = '[data-testid="fluentFunction"]'
    public static readonly argumentNameTextbox = '[data-testid="argument-name-input"]'
    public static readonly argumentTypeDropdown = '[id="arg-type-selector"]'
    public static readonly argumentTypeString = '[data-testid="String-option"]'
    public static readonly addArgumentBtn = '[data-testid="function-argument-add-btn"]'
    public static readonly expressionEditorType = '[id="type-selector"]'
    public static readonly expressionEditorDefinitionOption = '[data-testid="Definitions-option"]'
    public static readonly expressionEditorNameDenominatorOption = '#name-selector-option-0'
    public static readonly expressionEditorInsertBtn = '[data-testid="expression-insert-btn"]'
    public static readonly applyFunctionBtn = '[data-testid="function-apply-btn"]'
    public static readonly editSavedFunctions = '[data-testid="edit-button-0"]'
    public static readonly deleteSavedFunctions = '[data-testid="delete-button-0"]'

    //click action on the tab to get to the CQL Editor
    public static clickCQLEditorTab(): void {

        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab)
            .invoke('removeAttr', 'target')
            .click()

    }

    public static validateSuccessfulCQLUpdate(library?: boolean): void {

        if (!library || library == null) {
            library = false
            Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 600000)

        } else {
            Utilities.waitForElementDisabled(CQLLibraryPage.updateCQLLibraryBtn, 600000)
        }

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).each($msg => {
            expect($msg).to.not.contain('Error')
            cy.wrap($msg)
                .invoke('text')
                .then(text => {
                    const trimmedText = text.trim()

                    const validSubstrings = [
                        'CQL updated successfully but the following issues were found',
                        'CQL updated successfully',
                        'CQL updated successfully but the following issues were foundLibrary statement was incorrect. MADiE has overwritten it.'
                    ]

                    const containsMatch = validSubstrings.some(substring =>
                        trimmedText.includes(substring)
                    )
                    expect(containsMatch).to.be.true
                })
        })
    }

    public static applyDefinition(): void {

        cy.get('[data-testid="definition-apply-btn"]').click()
        cy.get('[data-testid="measure-editor-toast"]').should('be.visible')
        cy.get('[data-testid="measure-editor-toast"]').should('contain.text', 'successfully added to the CQL')

    }

    public static replaceCqlDocument(filePath: string) {

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')

        Utilities.typeFileContents(filePath, EditMeasurePage.cqlEditorTextBox)
    }

}
