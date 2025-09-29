import { MeasureActionOptions, MeasuresPage } from "./MeasuresPage"
import { Utilities } from "./Utilities"
import { TestCasesPage } from "./TestCasesPage"

export enum EditMeasureActions {

    export = 'export',
    delete = 'delete',
    version = 'version',
    draft = 'draft',
    viewHR = 'viewHR',
    share = 'share',
    transfer = 'transfer',
    viewHistory = 'viewHistory'
}

export class EditMeasurePage {

    //dirty modal
    public static readonly dirtCheckModal = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-aa4ov7 react-draggable"]'

    //Edit Measure tab menu
    public static readonly readOnlyMPStartDt = '[id="measurement-period-start"]'
    public static readonly readOnlyMPEndDt = '[id="measurement-period-end"]'
    public static readonly readOnlySteward = '[id="steward"]'
    public static readonly readOnlyDevelopers = '[id="developers"]'
    public static readonly measureDetailsTab = '[data-testid=measure-details-tab]'
    public static readonly cqlEditorTab = '[data-testid=cql-editor-tab]'
    public static readonly measureGroupsTab = '[data-testid=groups-tab]'
    public static readonly testCasesTab = '[data-testid=patients-tab]'
    public static readonly editMeasureButtonActionBtn = '[data-testid="action-center-actual-icon"]'
    public static readonly editMeasureDeleteActionBtn = '[data-testid="DeleteOutlinedIcon"]'
    public static readonly editMeasureVersionActionBtn = '[data-testid="VersionMeasure"]'
    public static readonly editMeasureDraftActionBtn = '[data-testid="DraftMeasure"]'
    public static readonly editMeasureExportActionBtn = '[data-testid="ExportMeasure"]'
    public static readonly viewHRActionBtn = '[data-testid="Viewhumanreadable"]'
    public static readonly shareMeasureActionBtn = '[data-testid="Share/Unshare"]'
    public static readonly transferMeasureActionBtn = '[data-testid="transfer-action-btn"]'
    public static readonly viewHistoryActionBtn = '[data-testid="ViewHistory"]'
    public static readonly editPageVersionDraftMsg = '[data-testid="edit-measure-information-success-text"]'
    public static readonly humanReadablePopup = '#draggable-dialog-title'

    //Associate QDM and QI Core measures:
    public static readonly associateCmsIdDialog = '[data-testid="associate-cms-id-dialog-tbl"]'
    public static readonly sureDialog = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-3nccws react-draggable"]'
    public static readonly sureDialogCancelBtn = '[data-testid="associate-cms-identifier-confirmation-dialog-cancel-button"]'
    public static readonly sureDialogContinueBtn = '[data-testid="associate-cms-identifier-confirmation-dialog-continue-button"]'
    public static readonly associateCmsAssociateBtn = '[data-testid="associate-cms-id-button"]'
    public static readonly associateCopyMetaData = '[data-testid="copy-cms-id-checkbox"]'

    //Measurement Information
    public static readonly measureNameTextBox = '[data-testid="measure-name-input"]'
    public static readonly readOnlyMeasureName = '[data-testid="measure-name-text-field"]'
    public static readonly cqlLibraryNameTextBox = '[data-testid="cql-library-name-input"]'
    public static readonly readOnlyLibraryName = '[data-testid="cql-library-name"]'
    public static readonly measurementInformationSaveButton = '[data-testid="measurement-information-save-button"]'
    public static readonly measureNameFieldLevelError = '[data-testid="measureName-helper-text"]'
    public static readonly measureId = '[data-testid="measure-id-input"]'
    public static readonly versionId = '[data-testid="version-id-input"]'
    public static readonly abbreviatedTitleTextBox = '[data-testid="ecqm-input"]'
    public static readonly generateCmsIdButton = '[data-testid="generate-cms-id-button"]'
    public static readonly cmsIDDialogCancel = '[data-testid="cms-identifier-dialog-cancel-button"]'
    public static readonly cmsIDDialogContinue = '[data-testid="cms-identifier-dialog-continue-button"]'
    public static readonly cmsIdInput = '[data-testid="cms-id-text-field"]'
    public static readonly successfulMeasureSaveMsg = '[data-testid="edit-measure-information-success-text"]'

    //Endorser fields
    public static readonly endorsementNumber = '[data-testid="endorsement-number-input"]'
    public static readonly endorsingOrganizationTextBox = '[id="endorser"]'
    public static readonly endorsingOrganizationOption = '[id="endorser-option-1"]'
    public static readonly errorMessage = '[class="toast danger"]'

    //left panel
    public static readonly leftPanelDescription = '[data-testid="leftPanelMeasureDescription"]'
    public static readonly leftPanelCopyright = '[data-testid="leftPanelMeasureCopyright"]'
    public static readonly leftPanelDisclaimer = '[data-testid="leftPanelMeasureDisclaimer"]'
    public static readonly leftPanelRationale = '[data-testid="leftPanelMeasureRationale"]'
    public static readonly leftPanelStewardDevelopers = '[data-testid="leftPanelMeasureSteward"]'
    public static readonly leftPanelGuidance = '[data-testid="leftPanelMeasureGuidance"]'
    public static readonly leftPanelMClinicalGuidanceRecommendation = '[data-testid="leftPanelMeasureClinicalRecommendation"]'
    public static readonly leftPanelModelAndMeasurementPeriod = '[data-testid="leftPanelModelAndMeasurementPeriod"]'
    public static readonly leftPanelReference = '[data-testid="leftPanelMeasureReferences"]'
    public static readonly leftPanelDefinition = '[data-testid="leftPanelQDMMeasureDefinition"]'
    public static readonly leftPanelTransmissionFormat = '[data-testid="leftPanelMeasureTransmissionFormat"]'
    public static readonly leftPanelMeasureSet = '[data-testid="leftPanelMeasureSet"]'
    public static readonly leftPanelQiCoreDefinition = '[data-testid="leftPanelQiCoreMeasureDefinition"]'
    public static readonly leftPanelPurpose = '[data-testid="leftPanelMeasurePurpose"]'

    //Measure Set
    public static readonly measureSetText = '[data-testid="generic-field-rich-text-editor"]'
    public static readonly measureSetSaveBtn = '[data-testid="measure-measure-set-save"]'

    //References page
    public static readonly addReferenceButton = '[data-testid="create-reference-button"]'
    public static readonly selectMeasureReference = '.chevron-container > [data-testid="ExpandMoreIcon"]'
    public static readonly referenceTypeDropdown = '[id="measure-referenceType"]'
    public static readonly citationOption = '[data-testid="Citation-option"]'
    public static readonly justificationOption = '[data-testid="Justification-option"]'
    public static readonly unknownOption = '[data-testid="Unknown-option"]'
    public static readonly measureReferenceText = '[data-testid="reference-text-rich-text-editor"]'
    public static readonly saveButton = '[data-testid="save-button"]'
    public static readonly successMessage = '[class="toast success"]'
    public static readonly measureReferenceTable = '[data-testid="measure-references-table-body"]'
    public static readonly deleteReference = '[data-testid*="delete-measure-reference"]'
    public static readonly editReference = '[data-testid*="edit-measure-reference"]'
    public static readonly searchReferenceTextBox = '[data-testid="measure-reference-search-input"]'
    public static readonly searchReferenceIcon = '[data-testid="SearchIcon"]'
    public static readonly editQiCoreReference = '[aria-label="Edit"]'
    public static readonly deleteQiCoreReference = '[aria-label="Delete"]'

    //Definition(Terms) page
    public static readonly definitionInputTextbox = '[data-testid="measure-definition-input"]'
    public static readonly saveMeasureDefinition = '[data-testid="measure-definition-save"]'
    public static readonly createDefinitionBtn = '[data-testid="create-definition-button"]'
    public static readonly definitionTermInput = '[data-testid="measure-definition-term-input"]'
    public static readonly definitionInput = '[data-testid="genericField-rich-text-editor-content"]'
    public static readonly definitionMetaTable = '[id="measure-meta-data-table"]'
    public static readonly definitionMetaTableBody = '[data-testid="measure-definitions-table-body"]'
    public static readonly emptyDefinitionVal = '[data-testid="empty-definitions"]'

    //Share/Un share Measure
    public static readonly shareOption = '[data-testid="Share With-option"]'
    public static readonly unshareOption = '[data-testid="Unshare-option"]'
    public static readonly harpIdInputTextBox = '[data-testid="harp-id-input"]'
    public static readonly addBtn = '[id="add-user-btn"]'
    public static readonly expandArrow = '[data-testid="KeyboardArrowRightIcon"]'
    public static readonly sharedUserTable = '[data-testid="row-item"]'
    public static readonly saveUserBtn = '[data-testid="share-save-button"]'
    public static readonly successMsg = '[class="toast success"]'
    public static readonly unshareCheckBox = '.PrivateSwitchBase-input'
    public static readonly acceptBtn = '[data-testid="share-confirmation-dialog-accept-button"]'

    //Transmission Format page
    public static readonly transmissionFormatDescription = '[data-testid="transmission-format-rich-text-editor"]'
    public static readonly readOnlyTFDesc = '#transmissionFormat'

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

    //Delete Measure
    public static readonly deleteMeasureConfirmationMsg = '.message'
    public static readonly deleteMeasureConfirmationButton = '[data-testid=delete-measure-button-2]'
    public static readonly successfulMeasureDeleteMsg = '[data-testid=edit-measure-information-success-text]'

    //Measure MetaData

    //RTE field button(s)
    public static readonly RTEContentField = '[data-testid="genericField-rich-text-editor-content"]'
    public static readonly RTEFieldToolbar = '[data-testid="genericField-rich-text-editor-toolbar"]'
    public static readonly rteToolBar = '[data-testid="rich-text-editor-toolbar"]'
    public static readonly unDoBtn = '[data-testid="UndoIcon"]'
    public static readonly reDoBtn = '[data-testid="RedoIcon"]'
    public static readonly frmtBoldBtn = '[data-testid="FormatBoldIcon"]'
    public static readonly frmtItalicizeBtn = '[data-testid="FormatItalicIcon"]'
    public static readonly frmtUnderlineBtn = '[data-testid="FormatUnderlinedIcon"]'
    public static readonly frmtStrikeThroughBtn = '[data-testid="StrikethroughSIcon"]'
    public static readonly nmbrdListBtn = '[data-testid="FormatListNumberedIcon"]'
    public static readonly bulletedListBtn = '[data-testid="FormatListBulletedIcon"]'
    public static readonly embdTableBtn = '[data-testid="TableChartIcon"]'

    //RTE Embedded table button(s)
    public static readonly embdTableAddRowAboveBtn = '[data-testid="genericField-add-row-above-tooltip"]'
    public static readonly embdTableAddRowBelowBtn = '[data-testid="genericField-add-row-below-tooltip"]'
    public static readonly embdTableRemoveRowBtn = '[data-testid="genericField-remove-row-tooltip"]'
    public static readonly embdTableAddColLeftBtn = '[data-testid="genericField-add-column-left-tooltip"]'
    public static readonly embdTableAddColRightBtn = '[data-testid="genericField-add-column-right-tooltip"]'
    public static readonly embdTableRemoveColBtn = '[data-testid="genericField-remove-column-tooltip"]'
    public static readonly embdTableRemoveTblBtn = '[data-testid="genericField-remove-table-tooltip"]'

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
    public static readonly measureGenericFieldRTETextBox = '[data-testid="generic-field-rich-text-editor"]'
    public static readonly measureDescriptionSaveButton = '[data-testid="measure-description-save"]'
    public static readonly measureDescriptionSuccessMessage = '[data-testid="measureDescriptionSuccess"]'

    //Copyright Page
    public static readonly measureCopyrightSaveButton = '[data-testid="measure-copyright-save"]'
    public static readonly measureCopyrightSuccessMessage = '[data-testid="measureCopyrightSuccess"]'

    //Disclaimer Page
    public static readonly measureDisclaimerSaveButton = '[data-testid="measure-disclaimer-save"]'
    public static readonly measureDisclaimerSuccessMessage = '[data-testid="measureDisclaimerSuccess"]'

    //Rationale Page
    public static readonly measureRationaleSaveButton = '[data-testid="measure-rationale-save"]'
    public static readonly measureRationaleSuccessMessage = '[data-testid="measureRationaleSuccess"]'

    //Purpose
    public static readonly measurePurposeSaveBtn = '[data-testid="measure-purpose-save"]'
    public static readonly measurePurposeSavedMsg = '[data-testid="measurePurposeSuccess"]'

    //Guidance Page
    public static readonly measureGuidanceSaveButton = '[data-testid="measure-guidance-usage-save"]'
    public static readonly measureGuidanceSuccessMessage = '[data-testid="measureGuidance (Usage)Success"]'

    //Clinical Guidance / Recommendation Page
    public static readonly measureClinicalRecommendationSaveButton = '[data-testid="measure-clinical-recommendation-statement-save"]'
    public static readonly measureClinicalRecommendationSuccessMessage = '[data-testid="measureClinical Recommendation StatementSuccess"]'

    public static actionCenter(action: EditMeasureActions, options?: MeasureActionOptions): void {

        cy.get(this.editMeasureButtonActionBtn).click()

        switch (action) {

            case EditMeasureActions.export: {

                const exportForPublish = options?.exportForPublish

                cy.get(this.editMeasureExportActionBtn).should('be.visible')
                cy.get(this.editMeasureExportActionBtn).should('be.enabled')
                cy.get(this.editMeasureExportActionBtn).click()

                if (exportForPublish) {
                    Utilities.waitForElementVisible(MeasuresPage.exportPublishingOption, 50000)
                    cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Export for Publishing').click()
                } else {
                    Utilities.waitForElementVisible(MeasuresPage.exportNonPublishingOption, 50000)
                    cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()
                }

                cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                cy.get(MeasuresPage.exportingSpinner).should('exist').should('be.visible')
                Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')
                cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()
                break
            }

            case EditMeasureActions.version: {

                cy.get(this.editMeasureVersionActionBtn).should('be.visible')
                cy.get(this.editMeasureVersionActionBtn).should('be.enabled')
                cy.get(this.editMeasureVersionActionBtn).click()

                // version modal
                cy.get('#draggable-dialog-title').find('h2').should('have.text', 'Create Version')

                cy.get(MeasuresPage.versionMeasuresSelectionButton).click()
                cy.get(MeasuresPage.measureVersionMajor).click()
                // please leave this in place. it needs a short pause here for the modal to present new fields
                cy.wait(1000)

                cy.get('#new-version').invoke('val').then(value => {
                    cy.get(MeasuresPage.confirmMeasureVersionNumber).type(value.toString())
                })

                cy.get(MeasuresPage.measureVersionContinueBtn).click()

                Utilities.validateToastMessage('New version of measure is Successfully created')
                break
            }
            case EditMeasureActions.draft: {

                cy.get(this.editMeasureDraftActionBtn).should('be.visible')
                cy.get(this.editMeasureDraftActionBtn).should('be.enabled')
                cy.get(this.editMeasureDraftActionBtn).click()

                // ToDo: provide way to upgrade model here 4.1.1 -> 6.0.0

                cy.get(MeasuresPage.createDraftContinueBtn).click()

                Utilities.validateToastMessage('New draft created successfully.')
                break
            }
            case EditMeasureActions.delete: {

                cy.get(this.editMeasureDeleteActionBtn).should('be.visible')
                cy.get(this.editMeasureDeleteActionBtn).should('be.enabled')
                cy.get(this.editMeasureDeleteActionBtn).click()

                cy.get(this.deleteMeasureConfirmationButton).click()

                Utilities.validateToastMessage('Measure successfully deleted')
                break
            }
            case EditMeasureActions.viewHR: {

                cy.get(this.viewHRActionBtn).should('be.visible')
                cy.get(this.viewHRActionBtn).should('be.enabled')
                cy.get(this.viewHRActionBtn).click()

                break
            }

            case EditMeasureActions.share: {
                cy.get(this.shareMeasureActionBtn).should('be.visible')
                cy.get(this.shareMeasureActionBtn).should('be.enabled')
                cy.get(this.shareMeasureActionBtn).click()

                break
            }

            case EditMeasureActions.transfer: {
                cy.get(this.transferMeasureActionBtn).should('be.visible')
                cy.get(this.transferMeasureActionBtn).should('be.enabled')
                cy.get(this.transferMeasureActionBtn).click()

                break
            }

            case EditMeasureActions.viewHistory: {
                cy.get(this.viewHistoryActionBtn).should('be.visible')
                cy.get(this.viewHistoryActionBtn).should('be.enabled')
                cy.get(this.viewHistoryActionBtn).click()

                break
            }

            default: { }
        }
    }

    public static addMeasureDefinition(term: string, definitionText: string) {

        cy.get(this.createDefinitionBtn).click()

        cy.get(this.definitionTermInput).clear().type(term)

        cy.get(this.definitionInput).clear().type(definitionText)

        cy.get(this.saveButton).click()

        cy.contains('td', term).should('be.visible')
    }

}
