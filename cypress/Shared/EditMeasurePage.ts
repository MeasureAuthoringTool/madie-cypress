export class EditMeasurePage {

    //Main MADiE page
    public static readonly mainMadiePageButton = '.sc-dkPtRN.evWbfP'
        
    //Edit Measure tab menu
    public static readonly measureDetailsTab = '[data-testid=measure-details-tab]'
    public static readonly cqlEditorTab = '[data-testid=cql-editor-tab]'
    public static readonly measureGroupsTab = '[data-testid=measure-groups-tab]'
    public static readonly testCasesTab = '[data-testid=patients-tab]'

    //Measure Details
    public static readonly editMeasurePen = 'path'
    public static readonly editMeasureTextBox = '[data-testid="inline-edit-input"]'
    public static readonly saveEditedMeasureName = '.fa-check-circle > path'
    public static readonly editMeasureFieldLevelError = '[data-testid="edit-measure-name-error-text"]'
    public static readonly editMeasureSaveButton = '[data-testid="save-edit-measure-name"] > path'
    public static readonly editMeasureCancelButton = '.fa-times-circle'
    public static readonly measureStewardLeftNavTab = '[class="sc-jJoQJp sc-gWXbKe cqtDRF fdLXpi"]'

    //Measure CQL Page
    //cql editor box on page
    public static readonly cqlEditorTextBox = '.ace_content'
    //save button on page
    public static readonly cqlEditorSaveButton = '[data-testid="save-cql-btn"]'

    //Measure Groups Page
    //Scoring drop-down box
    public static readonly measureScoringDBox = '[data-testid=scoring-unit-select]'
    public static readonly saveMeasureGroupDetails = '[data-testid=group-form-submit-btn'

    //Measure Steward Page
    public static readonly measureStewardTextBox = '[data-testid="measureStewardInput"]'
    public static readonly measureStewardSaveButton = '[data-testid="measureStewardSave"]'
    public static readonly measureStewardConfirmaionText = '.sc-bqiRlB'

}