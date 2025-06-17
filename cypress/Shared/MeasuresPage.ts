import { Utilities } from "./Utilities"
import { TestCasesPage } from "./TestCasesPage"
import { EditMeasureActions } from "./EditMeasurePage"
import { SupportedModels } from "./CreateMeasurePage"

export type MeasureActionOptions = {
    exportForPublish?: boolean,
    versionType?: string,
    updateModelVersion?: boolean
}

export type MeasureRow = {
    name?: string,
    version?: string,
    status?: string,
    model?: SupportedModels,
    shared?: boolean,
    cmsId?: string,
    updated?: string
}

export class MeasuresPage {

    public static readonly measureListTitles = '[data-testid="measure-list-tbl"]'
    public static readonly allMeasuresTab = '[data-testid="all-measures-tab"]'
    public static readonly filterSearchInputBox = '[data-testid="measure-search-input"]'
    public static readonly searchInputBox = '[data-testid="searchMeasure-input"]'
    public static readonly measureListTabelBody = '[class="table-body measures-list"]'

    //export
    public static readonly exportNonPublishingOption = '[data-testid="export-option"]'
    public static readonly exportPublishingOption = '[data-testid="export-publishing-option"]'
    public static readonly exportingDialog = '[class="MuiBox-root css-1c2c0mn"]'
    public static readonly exportingSpinner = '.spinner'
    public static readonly exportFinishedCheck = '[data-testid="CheckCircleOutlineIcon"]'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'

    //Measure Version
    public static readonly versionMeasuresSelectionButton = '[data-testid="version-type"]'
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
    public static readonly measureVersionHelperText = '[data-testid="version-helper-text"]'

    //CQL to ELM version field
    public static readonly measureCQLToElmVersionTxtBox = '[data-testid="translator-version-text-field"]'

    public static checkFirstRow(expectedData: MeasureRow) {
        cy.wait(1100)

        cy.get('.measures-list tr').first().then(firstRow => {

            if (expectedData.name) {
                cy.wrap(firstRow.children().eq(1)).should('have.text', expectedData.name)
            }
            if (expectedData.version) {
                cy.wrap(firstRow.children().eq(2)).should('have.text', expectedData.version)
            }
            if (expectedData.status) {
                cy.wrap(firstRow.children().eq(3)).should('have.text', expectedData.status)
            }
            if (expectedData.model) {
                cy.wrap(firstRow.children().eq(4)).should('have.text', expectedData.model)
            }
            if (expectedData.shared) {
                cy.wrap(firstRow.children().eq(5)).find('[data-testid="CheckCircleOutlineIcon"]').should('exist')
            }
            if (expectedData.cmsId) {
                cy.wrap(firstRow.children().eq(6)).should('have.text', expectedData.cmsId)
            }
            if (expectedData.updated) {
                cy.wrap(firstRow.children().eq(7)).should('have.text', expectedData.updated)
            }

        })

    }

    public static validateMeasureName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static validateVersionNumber(versionNumber: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            //cy.reload()
            cy.get('[data-testid="measure-name-' + fileContents + '_version"]').should('contain', versionNumber)
        })
    }

    public static actionCenter(action: string, measureNumber?: number, options?: MeasureActionOptions): void {

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
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
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

                const exportForPublish = options?.exportForPublish

                cy.get('[data-testid="export-action-btn"]').should('be.visible')
                cy.get('[data-testid="export-action-btn"]').should('be.enabled')
                cy.get('[data-testid="export-action-btn"]').click()

                if (exportForPublish) {
                    Utilities.waitForElementVisible(MeasuresPage.exportPublishingOption, 50000)
                    cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Export for Publishing').click()
                } else {
                    Utilities.waitForElementVisible(MeasuresPage.exportNonPublishingOption, 50000)
                    cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()
                }

                cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 125000)
                cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')
                cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

                break
            }

            case 'version': {
                cy.readFile(filePath).should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 500000)
                })

                cy.get('[data-testid="version-action-btn"]').should('be.visible')
                cy.get('[data-testid="version-action-btn"]').click()

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
                    cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
                })

                cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.enabled')
                cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView().click()

                cy.get('[data-testid="associate-cms-id-button"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-button"]').should('be.enabled')

                break
            }
            case 'share': {

                cy.get('[data-testid="share-action-btn"]').should('be.visible')
                cy.get('[data-testid="share-action-btn"]').should('be.enabled')
                cy.get('[data-testid="share-action-btn"]').click()

                break
            }
            case 'viewhr': {

                cy.get('[data-testid="view-hr-action-btn"]').should('be.visible')
                cy.get('[data-testid="view-hr-action-btn"]').should('be.enabled')
                cy.get('[data-testid="view-hr-action-btn"]').click()

                break
            }
            default: { }
        }
    }
}
