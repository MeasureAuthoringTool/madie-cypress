import { Utilities } from "./Utilities"

export class MeasuresPage {

    public static readonly measureListTitles = '[data-testid="measure-list-tbl"]'
    public static readonly allMeasuresTab = '[data-testid="all-measures-tab"]'
    public static readonly searchInputBox = '[data-testid="searchMeasure-input"]'

    //export
    public static readonly exportingDialog = '[class="MuiBox-root css-1c2c0mn"]'
    public static readonly exportingSpinner = '[class="MuiCircularProgress-svg css-13o7eu2"]'
    public static readonly exportFinishedCheck = '[data-testid="CheckCircleOutlineIcon"]'
    public static readonly exportFinishedContinueBtn = '[data-testid="ds-btn"]'
    public static readonly exportingDialogContent = '[id="export-dialog-content"]'
    public static readonly exportingDialogXIcon = '[data-testid="CancelOutlinedIcon"]'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'

    //Measure Version
    public static readonly versionMeasuresSelectionButton = '[data-testid="version-type"]'
    public static readonly versionMeasuresConfirmInput = '[data-testid="confirm-version-input"]'
    public static readonly VersionDraftMsgs = '[data-testid="success-toast"]'
    public static readonly VersionDraftErrMsgs = '[data-testid="error-toast"]'
    public static readonly updateDraftedMeasuresTextBox = '[data-testid="measure-name-input"]'
    public static readonly createDraftContinueBtn = '[data-testid="create-draft-continue-button"]'
    public static readonly measureVersionTypeDropdown = '[id="version-type"]'
    public static readonly measureVersionMajor = '[data-testid="major-option"]'
    public static readonly measureVersionMinor = '[data-testid="minor-option"]'
    public static readonly measureVersionPatch = '[data-testid="patch-option"]'
    public static readonly confirmMeasureVersionNumber = '[data-testid="confirm-version-input"]'
    public static readonly measureVersionContinueBtn = '[data-testid="create-version-continue-button"]'
    public static readonly measureVersionSuccessMsg = '[data-testid="success-toast"]'
    public static readonly measureVersioningErrorMsg = '[data-testid="error-toast"]'
    public static readonly measureVersionHelperText = '[data-testid="version-helper-text"]'

    //CQL to ELM version field
    public static readonly measureCQLToElmVersionTxtBox = '[data-testid="translator-version-text-field"]'


    public static validateMeasureName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static validateVersionNumber(expectedValue: string, versionNumber: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            cy.wait(1000)
            cy.reload()
            cy.get('[data-testid="measure-name-0_version"]').should('contain', versionNumber)
            //element.parent().should('contain', expectedValue).children().eq(0).should('contain', versionNumber)
        })
    }

    public static measureAction(action: string, secondMeasure?: boolean, QDMMeasure?: boolean, associationMeasure?: boolean, secondMeasureForAssociation?: boolean): void {
        let filePath = 'cypress/fixtures/measureId'

        if (secondMeasure === true) {
            filePath = 'cypress/fixtures/measureId2'
        }
        //association related checks:
        //is this a QDM measure? if so, use the id for the QDM measure. If not, use the id for the QI Core measure.
        if (QDMMeasure === false) {
            if (associationMeasure === true) {
                filePath = 'cypress/fixtures/QiCoreMeasureId'
                secondMeasureForAssociation = false
            }
            else if (secondMeasureForAssociation === true) {
                filePath = 'cypress/fixtures/QiCoreMeasureId2'
                associationMeasure = false
            }
        }

        if (QDMMeasure === true) {
            if (associationMeasure === true) {
                filePath = 'cypress/fixtures/QDMMeasureId'
                secondMeasureForAssociation = false
            }
            else if (secondMeasureForAssociation === true) {
                filePath = 'cypress/fixtures/QDMMeasureId2'
                associationMeasure = false
            }
        }

        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.reload()
            Utilities.waitForElementVisible('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.enabled')
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {
                    cy.wait(3700)
                    cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
                    Utilities.waitForElementVisible('[data-testid="view-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="view-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').click()

                    break
                }
                case 'export': {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid="export-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="export-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="export-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="export-measure-' + fileContents + '"]').click()

                    cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                    cy.get(MeasuresPage.exportingSpinner).should('exist').should('be.visible')
                    Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                    cy.get('.toast').should('contain.text', 'Measure exported successfully')
                    cy.reload()
                    break
                }
                case 'qdmexport': {
                    cy.wait(3750)
                    cy.get('[data-testid="measure-action-' + fileContents + '"]').scrollIntoView()
                    cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid="export-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="export-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="export-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="export-measure-' + fileContents + '"]').click()

                    cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                    //cy.get(MeasuresPage.exportingSpinner).should('exist').should('be.visible')
                    Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                    cy.get('.toast').should('contain.text', 'Measure exported successfully')
                    break
                }
                case 'version': {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
                    Utilities.waitForElementVisible('[data-testid="create-version-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="create-version-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="create-version-measure-' + fileContents + '"]').click()
                    break
                }
                case 'draft': {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').click().wait(3000)
                    Utilities.waitForElementVisible('[data-testid="draft-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="draft-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="draft-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="draft-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="draft-measure-' + fileContents + '"]').click()
                    break
                }
                default: { }
            }
        })
    }
}
