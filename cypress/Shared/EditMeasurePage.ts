import { MeasuresPage } from "./MeasuresPage"
import { Utilities } from "./Utilities"

export enum EditMeasureActions {

    export = 'export',
    delete = 'delete',
    version = 'version'

}

export class EditMeasurePage {

    // action center
    public static readonly actionToggle = '[data-testid="action-center-actual-icon"]'
    public static readonly actionExport = '[data-testid="ExportMeasure"]'
    public static readonly actionDelete = '[data-testid="DeleteMeasure"]'
    public static readonly actionVersion = 'data-testid="VersionMeasure"'

    //dirty modal
    public static readonly dirtCheckModal = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-aa4ov7 react-draggable"]'

    //Edit Measure tab menu
    public static readonly measureDetailsTab = '[data-testid=measure-details-tab]'
    public static readonly cqlEditorTab = '[data-testid=cql-editor-tab]'
    public static readonly measureGroupsTab = '[data-testid=groups-tab]'
    public static readonly testCasesTab = '[data-testid=patients-tab]'
    public static readonly reviewInfoTab = '[data-testid=review-tab]'
    public static readonly editMeasureButtonActionBtn = '[data-testid="action-center-actual-icon"]'
    public static readonly editMeasureDeleteActionBtn = '[data-testid="DeleteOutlinedIcon"]'

    //Associate QDM and QI Core measures:
    public static readonly associateCmsIdDialog = '[data-testid="associate-cms-id-dialog-tbl"]'
    public static readonly cpyMetaDataCheckBox = '[data-testid="copy-cms-id-checkbox"]'
    public static readonly associateCmsCancel = '[data-testid="cancel-button"]'
    public static readonly sureDialog = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-aa4ov7 react-draggable"]'
    public static readonly sureDialogCancelBtn = '[data-testid="associate-cms-identifier-confirmation-dialog-cancel-button"]'
    public static readonly sureDialogContinueBtn = '[data-testid="associate-cms-identifier-confirmation-dialog-continue-button"]'
    public static readonly sureDialogBody = '[id="discard-changes-dialog-body"]'
    public static readonly associateCmsAssociateBtn = '[data-testid="associate-cms-id-button"]'
    public static readonly associateCopyMetaData = '[data-testid="copy-cms-id-checkbox"]'

    //Measurement Information
    public static readonly measurementInformationForm = '[data-testid="measure-information-edit"]'
    public static readonly measureNameTextBox = '[data-testid="measure-name-input"]'
    public static readonly cqlLibraryNameTextBox = '[data-testid="cql-library-name-input"]'
    public static readonly measurementInformationSaveButton = '[data-testid="measurement-information-save-button"]'
    public static readonly measureNameFieldLevelError = '[data-testid="measureName-helper-text"]'
    public static readonly measureId = '[data-testid="measure-id-input"]'
    public static readonly versionId = '[data-testid="version-id-input"]'
    public static readonly generateCmsIdButton = '[data-testid="generate-cms-id-button"]'
    public static readonly cmsIDDialogCancel = '[data-testid="cms-identifier-dialog-cancel-button"]'
    public static readonly cmsIDDialogContinue = '[data-testid="cms-identifier-dialog-continue-button"]'
    public static readonly cmsIdInput = '[data-testid="cms-id-input"]'
    public static readonly successfulMeasureSaveMsg = '[data-testid="edit-measure-information-success-text"]'

    //Endorser fields
    public static readonly endorsementNumber = '[data-testid="endorsement-number-input"]'
    public static readonly endorsingOrganizationTextBox = '[id="endorser"]'
    public static readonly endorsingOrganizationOption = '[id="endorser-option-1"]'
    public static readonly endorserFieldsErrorMsg = '[class="toast danger"]'

    //left panel
    public static readonly leftPanelMeasureInformation = '[data-testid="leftPanelMeasureInformation"]'
    public static readonly leftPanelDescription = '[data-testid="leftPanelMeasureDescription"]'
    public static readonly leftPanelCopyright = '[data-testid="leftPanelMeasureCopyright"]'
    public static readonly leftPanelDisclaimer = '[data-testid="leftPanelMeasureDisclaimer"]'
    public static readonly leftPanelRationale = '[data-testid="leftPanelMeasureRationale"]'
    public static readonly leftPanelStewardDevelopers = '[data-testid="leftPanelMeasureSteward"]'
    public static readonly leftPanelGuidance = '[data-testid="leftPanelMeasureGuidance"]'
    public static readonly leftPanelMClinicalGuidanceRecommendation = '[data-testid="leftPanelMeasureClinicalRecommendation"]'
    public static readonly leftPanelModelAndMeasurementPeriod = '[data-testid="leftPanelModelAndMeasurementPeriod"]'
    public static readonly leftPanelRiskAdjustment = '[data-testid="leftPanelMeasureRiskAdjustment"]'
    public static readonly leftPanelReference = '[data-testid="leftPanelMeasureReferences"]'
    public static readonly leftPanelDefinition = '[data-testid="leftPanelQDMMeasureDefinition"]'
    public static readonly leftPanelTransmissionFormat = '[data-testid="leftPanelMeasureTransmissionFormat"]'
    public static readonly leftPanelMeasureSet = '[data-testid="leftPanelMeasureSet"]'

    //Measure Set
    public static readonly measureSetText = '[data-testid="measureMeasure SetInput"]'
    public static readonly measureSetSaveBtn = '[data-testid="measureMeasure SetSave"]'

    //References page
    public static readonly addReferenceButton = '[data-testid="create-reference-button"]'
    public static readonly selectMeasureReference = '.chevron-container > [data-testid="ExpandMoreIcon"]'
    public static readonly measureReferenceDropdown = '[class="btn-container"]'
    public static readonly referenceTypeDropdown = '[id="measure-referenceType"]'
    public static readonly editReferenceModal = '[data-testid="dialog-form"]'
    public static readonly editReferenceCloseModalBtn = '[data-testid="close-button"]'
    public static readonly documentationOption = '[data-testid="Documentation-option"]'
    public static readonly citationOption = '[data-testid="Citation-option"]'
    public static readonly justificationOption = '[data-testid="Justification-option"]'
    public static readonly unknownOption = '[data-testid="Unknown-option"]'
    public static readonly measureReferenceText = '[data-testid="measure-referenceText"]'
    public static readonly saveButton = '[data-testid="save-button"]'
    public static readonly successMessage = '[class="toast success"]'
    public static readonly measureReferenceTable = '[data-testid="measure-references-table-body"]'
    public static readonly measureReferenceDiscardChanges = '[data-testid="cancel-button"]'

    //Definition(Terms) page
    public static readonly definitionInputTextbox = '[data-testid="measureDefinitionInput"]'
    public static readonly saveMeasureDefinition = '[data-testid="measureDefinitionSave"]'

    //Transmission Format page
    public static readonly transmissionFormatDescription = '[data-testid="measure-transmission-format"]'

    //Measure CQL Page
    //warnings / errors in CQL that appear at the top of page
    public static readonly libWarningTopMsg = '[data-testid="library-warning"]'
    public static readonly CQLMessageSuccess = '[data-testid="generic-success-text-header"]'

    //cql editor box on page
    public static readonly cqlEditorTextBox = '.ace_content'
    //save button on page
    public static readonly cqlEditorSaveButton = '[data-testid="save-cql-btn"]'
    //discard changes
    public static readonly cqlEditorDiscardButton = '[data-testid="reset-cql-btn"]'
    public static readonly measureDetailsDiscardChangesBtn = '[data-testid="cancel-button"]'

    //Delete Measure
    public static readonly deleteMeasureButton = '[data-testid=delete-measure-button]'
    public static readonly deleteMeasureConfirmationMsg = '.message'
    public static readonly deleteMeasureConfirmationButton = '[data-testid=delete-measure-button-2]'
    public static readonly successfulMeasureDeleteMsg = '[data-testid=edit-measure-information-success-text]'

    //Measure MetaData
    //Model & Measurement Start and End date(s)
    public static readonly mpStart = '[data-testid="measurement-period-start-input"]'
    public static readonly mpEnd = '[data-testid="measurement-period-end-input"]'

    //Measure Steward & Developers Page
    public static readonly measureStewardDrpDwn = '[data-testid="steward"]'
    public static readonly measureStewardDrpDwnOption = '#steward-option-0'
    public static readonly measureStewardObjHoldingValue = '#steward'
    public static readonly measureDeveloperDrpDwn = '[data-testid="developers"]'
    public static readonly measureDevelopersDrpDwnOption = '#developers-option-0'
    public static readonly measureDevelopersObjHoldingValue = '#developers'
    public static readonly measureDeveloperCancelIcon = '[data-testid="CancelIcon"]'
    public static readonly measureStewardDevelopersSaveButton = '[data-testid="steward-and-developers-save"]'
    public static readonly measureStewardDevelopersSuccessMessage = '[data-testid="steward-and-developers-success"]'
    public static readonly measureStewardAlertMsg = '[data-testid="steward-helper-text"]'
    public static readonly measureDevelopersAlertMsg = '[data-testid="developers-helper-text"]'

    //Description Page
    public static readonly measureDescriptionTextBox = '[data-testid="measureDescriptionInput"]'
    public static readonly measureDescriptionSaveButton = '[data-testid="measureDescriptionSave"]'
    public static readonly measureDescriptionSuccessMessage = '[data-testid="measureDescriptionSuccess"]'

    //Copyright Page
    public static readonly measureCopyrightTextBox = '[data-testid="measureCopyrightInput"]'
    public static readonly measureCopyrightSaveButton = '[data-testid="measureCopyrightSave"]'
    public static readonly measureCopyrightSuccessMessage = '[data-testid="measureCopyrightSuccess"]'

    //Disclaimer Page
    public static readonly measureDisclaimerTextBox = '[data-testid="measureDisclaimerInput"]'
    public static readonly measureDisclaimerSaveButton = '[data-testid="measureDisclaimerSave"]'
    public static readonly measureDisclaimerSuccessMessage = '[data-testid="measureDisclaimerSuccess"]'

    //Rationale Page
    public static readonly measureRationaleTextBox = '[data-testid="measureRationaleInput"]'
    public static readonly measureRationaleSaveButton = '[data-testid="measureRationaleSave"]'
    public static readonly measureRationaleSuccessMessage = '[data-testid="measureRationaleSuccess"]'

    //Guidance Page
    public static readonly measureGuidanceTextBox = '[data-testid="measureGuidance (Usage)Input"]'
    public static readonly measureGuidanceSaveButton = '[data-testid="measureGuidance (Usage)Save"]'
    public static readonly measureGuidanceSuccessMessage = '[data-testid="measureGuidance (Usage)Success"]'

    //Clinical Guidance / Recommendation Page
    public static readonly measureClinicalRecommendationTextBox = '[data-testid="measureClinical Recommendation StatementInput"]'
    public static readonly measureClinicalRecommendationSaveButton = '[data-testid="measureClinical Recommendation StatementSave"]'
    public static readonly measureClinicalRecommendationSuccessMessage = '[data-testid="measureClinical Recommendation StatementSuccess"]'

    //Risk Adjustment Page
    public static readonly measureRiskAdjustmentTextBox = '[data-testid="measureRisk AdjustmentInput"]'
    public static readonly measureRiskAdjustmentSaveButton = '[data-testid="measureRisk AdjustmentSave"]'
    public static readonly measureRiskAdjustmentSuccessMessage = '[data-testid="measureRisk AdjustmentSuccess"]'

    //Review Info Page
    public static readonly reviewInfoFields = '.help-image'
    public static readonly approvalDate = '[data-testid="approval-date-input"]'
    public static readonly lastReviewDate = '[data-testid="review-date-input"]'

    public static actionCenter(action: EditMeasureActions): void {

        cy.get(this.actionToggle).click()
        cy.wait(500)

        switch (action.valueOf()) {

            case 'export': {

                cy.get(this.actionExport).should('be.visible')
                cy.get(this.actionExport).should('be.enabled')
                cy.get(this.actionExport).click()

                cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                cy.get(MeasuresPage.exportingSpinner).should('exist').should('be.visible')
                Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                cy.get('.toast').should('contain.text', 'Measure exported successfully')
                cy.get('[data-testid="ds-btn"]').click()

                break
            }

            case 'version': {

                break
            }
            case 'draft': {

                break
            }
            case 'delete': {

                break
            }
            default: { }

            cy.wait(2500)
        }
    }
}
