import { Utilities } from "./Utilities"
import { TestCasesPage } from "./TestCasesPage"
import { SupportedModels } from "./CreateMeasurePage"
import { EditMeasurePage } from "./EditMeasurePage"

export type MeasureActionOptions = {
    exportForPublish?: boolean,
    versionType?: string,
    updateModelVersion?: boolean,
    altUser?: boolean
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
    public static readonly ownedMeasures = '[data-testid="owned-measures-tab"]'
    public static readonly sharedMeasures = '[data-testid="shared-measures-tab"]'
    public static readonly allMeasuresTab = '[data-testid="all-measures-tab"]'
    public static readonly filterSearchInputBox = '[data-testid="measure-search-input"]'
    public static readonly searchInputBox = '[data-testid="measure-search-input"]'
    public static readonly filterByDropdown = '[data-testid="filter-by"]'
    public static readonly filterNoOption = '[data-testid="--option"]'
    public static readonly filterMeasureOption = '[data-testid="Measure-option"]'
    public static readonly filterVersionOption = '[data-testid="Version-option"]'
    public static readonly filterModelOption = '[data-testid="Model-option"]'
    public static readonly filterCMSIdOption = '[data-testid="CMS ID-option"]'

    //export
    public static readonly exportNonPublishingOption = '[data-testid="export-option"]'
    public static readonly exportPublishingOption = '[data-testid="export-publishing-option"]'
    public static readonly exportingDialog = '[class="MuiBox-root css-1c2c0mn"]'
    public static readonly exportingSpinner = '.spinner'
    public static readonly exportFinishedCheck = '[data-testid="CheckCircleOutlineIcon"]'

    //transfer
    public static readonly newOwnerTextbox = '[data-testid="harp-id-input"]'
    public static readonly transferContinueButton = '[data-testid="transfer-save-button"]'

    //history
    public static readonly userActionRow = '[data-testid="measure-history-cell-0_actionType"]'
    public static readonly harpIdRow = '[data-testid="measure-history-cell-0_performedBy"]'
    public static readonly additionalActionRow = '[data-testid="measure-history-cell-0_additionalActionMessage"]'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'

    //Measure Version
    public static readonly versionToastSuccessMsg = '[data-testid="toast-success"]'
    public static readonly versionMeasuresSelectionButton = '[data-testid="version-type"]'
    public static readonly updateDraftedMeasuresTextBox = '[data-testid="measure-name-input"]'
    public static readonly createDraftContinueBtn = '[data-testid="create-draft-continue-button"]'
    public static readonly draftModalSelectionBox = '[data-testid="measure-model-select"]'
    public static readonly draftModalVersionSix = '[data-testid="measure-model-option-QI-Core v6.0.0"]'
    public static readonly draftModalVersionSeven = '[data-testid="measure-model-option-QI-Core v7.0.0"]'
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
        let currentUser = Cypress.env('selectedUser')
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static validateVersionNumber(versionNumber: string): void {
        let currentUser = Cypress.env('selectedUser')
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            cy.get('[data-testid="measure-name-' + fileContents + '_version"]').should('contain', versionNumber)
        })
    }

    public static actionCenter(action: string, measureNumber?: number, options?: MeasureActionOptions): void {

        let currentUser = ''
        if (options && options.altUser) {
            currentUser = Cypress.env('selectedAltUser')
        } else {
            currentUser = Cypress.env('selectedUser')
        }
        cy.log('Current User: ' + currentUser)

        //There is a prerequsite that you have a measure created and measure ID stored to a file
        let filePath = 'cypress/fixtures/' + currentUser + '/measureId'

        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
        }

        if (measureNumber > 0) {
            filePath = 'cypress/fixtures/' + currentUser + '/measureId' + measureNumber
        }
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"] > [class="px-1"] > [type="checkbox"]', 90000)
            Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"] > [class="px-1"] > [class=" cursor-pointer"]', 90000)
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[type="checkbox"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[type="checkbox"]').check()
        })

        switch ((action.valueOf()).toString().toLowerCase()) {

            case 'edit': {

                cy.readFile(filePath).should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 90000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click().wait(2000)
                    Utilities.waitForElementVisible(EditMeasurePage.cqlEditorTab, 90000)

                })
                break
            }

            case 'view': {

                cy.readFile(filePath).should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 90000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                })
                break
            }

            case 'export': {

                const exportForPublish = options?.exportForPublish
                Utilities.waitForElementVisible('[data-testid="export-action-btn"]', 90000)
                cy.get('[data-testid="export-action-btn"]').should('be.visible')
                cy.get('[data-testid="export-action-btn"]').should('be.enabled')
                cy.get('[data-testid="export-action-btn"]').click()

                if (exportForPublish) {
                    Utilities.waitForElementVisible(MeasuresPage.exportPublishingOption, 90000)
                    cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Export for Publishing').click()
                } else {
                    Utilities.waitForElementVisible(MeasuresPage.exportNonPublishingOption, 90000)
                    cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()
                }

                cy.get(MeasuresPage.exportingDialog).should('exist').should('be.visible')
                Utilities.waitForElementVisible(MeasuresPage.exportFinishedCheck, 90000)
                cy.get(TestCasesPage.successMsg).should('contain.text', 'Measure exported successfully')
                cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

                break
            }

            case 'version': {
                cy.readFile(filePath).should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 900000)
                })
                Utilities.waitForElementVisible('[data-testid="version-action-btn"]', 90000)
                cy.get('[data-testid="version-action-btn"]').should('be.visible')
                cy.get('[data-testid="version-action-btn"]').click()
                Utilities.waitForElementVisible(MeasuresPage.measureVersionTypeDropdown, 90000)

                break
            }
            case 'draft': {
                Utilities.waitForElementVisible('[data-testid="draft-action-btn"]', 90000)
                cy.get('[data-testid="draft-action-btn"]').should('be.visible')
                cy.get('[data-testid="draft-action-btn"]').should('be.enabled')
                cy.get('[data-testid="draft-action-btn"]').click()

                break
            }
            case 'delete': {
                Utilities.waitForElementVisible('[data-testid="delete-action-btn"]', 90000)
                cy.get('[data-testid="delete-action-btn"]').should('be.visible')
                cy.get('[data-testid="delete-action-btn"]').should('be.enabled')
                cy.get('[data-testid="delete-action-btn"]').click()

                break
            }
            case 'associatemeasure': {

                //there is a prerequisite that you have a measure created and measure ID stored for 'measureId' and 'measureId2'
                cy.readFile('cypress/fixtures/' + currentUser + '/measureId2').should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"]', 1200000)
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"] > [class="px-1"] > [type="checkbox"]', 90000)
                    Utilities.waitForElementVisible('[data-testid="measure-name-' + fileContents + '_select"] > [class="px-1"] > [class=" cursor-pointer"]', 90000)
                    cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
                    cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
                })
                Utilities.waitForElementVisible('[data-testid="associate-cms-id-action-btn"]', 90000)
                cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.enabled')
                cy.get('[data-testid="associate-cms-id-action-btn"]').scrollIntoView()
                cy.get('[data-testid="associate-cms-id-action-btn"]').click()

                Utilities.waitForElementVisible('[data-testid="associate-cms-id-button"]', 90000)
                cy.get('[data-testid="associate-cms-id-button"]').should('be.visible')
                cy.get('[data-testid="associate-cms-id-button"]').should('be.enabled')

                break
            }
            case 'share': {
                Utilities.waitForElementVisible('[data-testid="share-action-btn"]', 90000)
                cy.get('[data-testid="share-action-btn"]').should('be.visible')
                cy.get('[data-testid="share-action-btn"]').should('be.enabled')
                cy.get('[data-testid="share-action-btn"]').click()

                break
            }

            case 'transfer': {
                Utilities.waitForElementVisible('[data-testid="transfer-action-btn"]', 90000)
                cy.get('[data-testid="transfer-action-btn"]').should('be.visible')
                cy.get('[data-testid="transfer-action-btn"]').should('be.enabled')
                cy.get('[data-testid="transfer-action-btn"]').click()

                break
            }
            case 'viewhr': {
                Utilities.waitForElementVisible('[data-testid="view-hr-action-btn"]', 90000)
                cy.get('[data-testid="view-hr-action-btn"]').should('be.visible')
                cy.get('[data-testid="view-hr-action-btn"]').should('be.enabled')
                cy.get('[data-testid="view-hr-action-btn"]').click()

                break
            }
            case 'viewhistory': {
                Utilities.waitForElementVisible('[data-testid="history-action-btn"]', 90000)
                cy.get('[data-testid="history-action-btn"]').should('be.visible')
                cy.get('[data-testid="history-action-btn"]').should('be.enabled')
                cy.get('[data-testid="history-action-btn"]').click()

                break
            }
            default: { }
        }
    }

    public static selectMeasure(measureNumber?: number): void {
        const currentUser = Cypress.env('selectedUser')

        if (!measureNumber) {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').then(measureId => {

                cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
                cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
            })
        }
        else {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId' + measureNumber).then(measureId => {

                cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
                cy.get('[data-testid="measure-name-' + measureId + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
            })
        }
    }
}
