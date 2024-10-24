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
    public static readonly draftModalSelectionBox = '[data-testid="measure-model-select"]'
    public static readonly draftModalVersionSix = '[data-testid="measure-model-option-QI-Core v6.0.0"]'
    public static readonly draftModalVersionFourOneOne = '[data-testid="measure-model-option-QI-Core v4.1.1"]'
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
            cy.wait(4270)
            cy.reload()
            cy.get('[data-testid="measure-name-' + fileContents + '_version"]').should('contain', versionNumber)
        })
    }

    public static measureAction(action: string, measureNumber?: number): void {

        let filePath = 'cypress/fixtures/measureId'

        if (measureNumber > 0) {
            filePath = 'cypress/fixtures/measureId' + measureNumber
        }

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.enabled')
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').wait(1500).click()
                    Utilities.waitForElementVisible('[data-testid="view-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="view-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').click()

                    break
                }
                case 'export': {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').wait(1500).click()
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

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').wait(1500).scrollIntoView()
                    cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid="export-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="export-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="export-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="export-measure-' + fileContents + '"]').click()
                    cy.wait('@measureExport', { timeout: 60000 })

                    cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                    //cy.get(MeasuresPage.exportingSpinner).should('exist').should('be.visible')
                    Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                    cy.get('.toast').should('contain.text', 'Measure exported successfully')
                    break
                }
                case 'version': {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').wait(1500).click()
                    Utilities.waitForElementVisible('[data-testid="create-version-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="create-version-measure-' + fileContents + '"]', 105000)
                    cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="create-version-measure-' + fileContents + '"]').click()
                    break
                }
                case 'draft': {

                    cy.get('[data-testid="measure-action-' + fileContents + '"]').wait(1500).click()
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

    public static actionCenter(action: string, measureNumber?: number): void {

        //There is a prerequsite that you have a measure created and measure ID stored to a file

        let filePath = 'cypress/fixtures/measureId'

        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }


        if (measureNumber > 0) {
            filePath = 'cypress/fixtures/measureId' + measureNumber
        }

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 500000)
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().wait(3500).click()
        })

        switch ((action.valueOf()).toString().toLowerCase()) {

            case 'edit': {

                cy.readFile(filePath).should('exist').then((fileContents) => {
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                })
                break
            }

            case 'view': {

                cy.readFile(filePath).should('exist').then((fileContents) => {
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                })
                break
            }

            case 'export': {

                cy.get('[data-testid="export-action-btn"]').should('be.visible')
                cy.get('[data-testid="export-action-btn"]').should('be.enabled')
                cy.get('[data-testid="export-action-btn"]').click()

                cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                cy.get(MeasuresPage.exportingSpinner).should('exist').should('be.visible')
                Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                cy.get('.toast').should('contain.text', 'Measure exported successfully')
                cy.get('[data-testid="ds-btn"]').click()

                break
            }

            case 'version': {
                cy.readFile(filePath).should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 500000)
                })

                cy.get('[data-testid="version-action-btn"]').should('be.visible')
                cy.get('[data-testid="version-action-btn"]').wait(2000).click()

                break
            }
            case 'draft': {


                cy.get('[data-testid="draft-action-btn"]').should('be.visible')
                cy.get('[data-testid="draft-action-btn"]').should('be.enabled')
                cy.get('[data-testid="draft-action-btn"]').click()

                break
            }
            case 'delete': {


                cy.get('[data-testid="delete-action-btn"]').should('be.visible')
                cy.get('[data-testid="delete-action-btn"]').should('be.enabled')
                cy.get('[data-testid="delete-action-btn"]').click()

                break
            }
            case 'associatemeasure': {

                //there is a prerequisite that you have a measure created and measure ID stored for 'measureId' and 'measureId2'
                cy.readFile('cypress/fixtures/measureId2').should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 500000)
                    cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().wait(3500).click()
                })

                cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.enabled')
                cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().wait(2000).click()

                cy.get('[data-testid="associate-cms-id-button"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-button"]').should('be.enabled')

                break
            }
            default: { }
        }
    }
}
