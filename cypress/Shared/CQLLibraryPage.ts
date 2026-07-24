import { Header } from './Header'
import { Environment } from './Environment'
import { Utilities } from './Utilities'
import { v4 as uuidv4 } from 'uuid'
import { CQLLibrariesPage } from './CQLLibrariesPage'
import { CQLEditorPage } from './CQLEditorPage'
import { SupportedModels } from './CreateMeasurePage'
import { MeasureRow } from './MeasuresPage'
import { OktaLogin } from './OktaLogin'
import { FixtureOwner, TestData } from './TestData'
import { step } from '../utils/step'

export enum EditLibraryActions {
    delete,
    version,
    draft,
    share,
    transfer,
    viewHistory,
}

export type LibraryLockedModalCloseMethod = 'x' | 'button'

export type CreateLibraryOptions = {
    model?: SupportedModels
    cql?: string
    cqlErrors?: boolean
    description?: string
    altUser?: boolean
    libraryNumber?: number
    publisher?: string
}

export class CQLLibraryPage {
    private static fixtureOwner(altUser?: boolean): FixtureOwner {
        return altUser ? 'selectedAltUser' : 'selectedUser'
    }

    public static readonly ownedLibrariesTab = '[data-testid="owned-libraries-tab"]'
    public static readonly sharedLibrariesTab = '[data-testid="shared-libraries-tab"]'
    public static readonly allLibrariesTab = '[data-testid="all-libraries-tab"]'

    // create library dropdown
    public static readonly fhir = '[data-testid="all-libraries-tab"]'
    public static readonly qiCore6 = '[data-testid="all-libraries-tab"]'
    public static readonly qdm = '[data-testid="all-libraries-tab"]'
    public static readonly usCore6 = '[data-testid="all-libraries-tab"]'
    public static readonly usqc = '[data-testid="all-libraries-tab"]'
    // older versions, in case
    public static readonly cqlLibraryModelQICore = '[data-testid="cql-library-model-option-QI-Core v4.1.1"]'
    public static readonly cqlLibraryModelQDM = '[data-testid="cql-library-model-option-QDM v5.6"]'

    public static readonly measureCQLGenericErrorsList = '[data-testid="generic-errors-text-list"]'
    public static readonly cqlLibraryGreenToast = '[data-testid="cql-library-list-snackBar"]'
    public static readonly applyEditsSavedLibraryBtn = '[data-testid="apply-button"]'
    public static readonly cqlLibraryDeleteDialogCancelBtn = '[data-testid="delete-dialog-cancel-button"]'
    public static readonly cqlLibraryDeleteDialog = '[data-testid="delete-dialog"]'
    public static readonly cqlLibSaveSuccessMessage = '[class="madie-alert success"]'
    public static readonly cqlLibSearchResultsTable = '[data-testid="library-list-tbl"]'
    public static readonly createCQLLibraryBtn = '[data-testid="create-new-cql-library-button"]'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly readOnlyCqlLibraryName = '[data-testid="cql-library-name-text-field"]'
    public static readonly cqlLibraryModelDropdown = '[data-testid="cql-library-model-select"]'
    public static readonly cqlLibraryStickySave = '[data-testid="cql-library-save-button"]'
    public static readonly libraryListTitles = '[data-testid="cqlLibrary-list"]'
    public static readonly LibFilterTextField = '[data-testid="library-list-search-input"]'
    public static readonly filterByDropdown = '[data-testid="filter-by-select"]'
    public static readonly saveCQLLibraryBtn = '[data-testid="continue-button"]'
    public static readonly updateCQLLibraryBtn = '[data-testid="cql-library-save-button"]'
    public static readonly cqlLibraryNameInvalidError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly duplicateCQLLibraryNameError = '[data-testid="create-cql-library-error-text"]'
    public static readonly cqlLibraryModelErrorMsg = '.MuiFormHelperText-root'
    public static readonly genericSuccessMessage = '[data-testid="generic-success-text-header"]'
    public static readonly libraryWarning = '[data-testid="library-warning"]'
    public static readonly newCQLLibName = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly currentCQLLibName = '[id="cql-library-name-text-field-input"]'
    public static readonly discardChanges = '[data-testid="cql-library-cancel-button"]'
    public static readonly headerDetails = '[class="details"]'
    public static readonly cqlLibraryDesc = '[id="cql-library-description"]'
    public static readonly cqlLibraryCreatePublisher = '[data-testid="publisher"]'
    public static readonly cqlLibraryModalField = '[id="model-select"]'
    public static readonly cqlLibraryCreateForm = '[id="menu-model"]'
    public static readonly cqlLibraryEditPublisher = '[data-testid="publisher"]'
    public static readonly cqlLibDescHelperText = '[data-testid="cql-library-description-helper-text"]'
    public static readonly cqlLibPubHelperText = '[data-testid="publisher-helper-text"]'
    public static readonly cqlLibraryExperimentalChkBox = '[id="experimental"]'
    public static readonly editSavedLibraryAlias = '[data-testid="library-alias-input"]'
    public static readonly libraryInfoPanel = '#page-header'
    public static readonly draftBubble = '[data-testid="draft-chip"]'
    public static readonly libraryLockedModalMessage = '[data-testid="library-locked-popup-message"]'
    public static readonly libraryLockedModalCloseButton = '[data-testid="library-locked-popup-close-button"]'
    public static readonly libraryLockedModalCloseIcon = 'button[aria-label="Close"]'
    public static readonly libraryLockedIndicator = '[data-testid^="lock-indicator-"]'
    public static readonly libraryLockedIndicatorChip = '[data-testid$="-inuse-chip"]'
    public static readonly libraryLockedIcon = '[data-testid="locked-icon"]'

    // Edit page action center
    public static readonly actionCenterButton = '[data-testid="action-center-actual-icon"]'
    public static readonly actionCenterDelete = '[data-testid="DeleteLibrary"]'
    public static readonly actionCenterVersion = '[data-testid="VersionLibrary"]'
    public static readonly actionCenterDraft = '[data-testid="DraftLibrary"]'
    public static readonly actionCenterShare = '[data-testid="ShareLibrary"]'
    public static readonly actionCenterSecondaryShare = '[data-testid="Share/Unshare"]' // in case we need both
    public static readonly actionCenterTransfer = '[data-testid="Transfer"]'
    public static readonly actionCenterHistory = '[data-testid="History"]'

    //CQL Editor
    public static readonly cqlLibraryEditorTextBox = '.ace_content'

    //UMLS Not Logged in Error
    public static readonly umlsErrorMessage = '[data-testid="valueset-error"]'

    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'

    public static createCQLLibrary(CQLLibraryName: string, options?: CreateLibraryOptions): void {
        let publisher = 'ICF'
        if (options?.publisher) {
            publisher = options.publisher
        }
        let model = SupportedModels.qiCore6
        if (options?.model) {
            model = options.model
        }
        let desc = 'description'
        if (options?.description) {
            desc = options.description
        }

        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibrariesPage.librariesList, 30000)

      //  Utilities.waitForElementEnabled(CQLLibraryPage.createCQLLibraryBtn, 60000)
        cy.get(this.createCQLLibraryBtn).should('be.enabled')
        cy.get(this.createCQLLibraryBtn).click()

        Utilities.waitForElementVisible(this.newCQLLibName, 7500)
        cy.get(this.newCQLLibName).type(CQLLibraryName)

        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, model)

        cy.get(this.cqlLibraryDesc).type(desc)
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type(publisher).type('{downArrow}{enter}')

        this.clickCreateLibraryButton()
        Utilities.waitForElementToNotExist('[class="toast success"]', 60000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        TestData.readCqlLibraryId().then((libraryId) => {
            cy.get(`[data-testid="cqlLibrary-button-${libraryId}-content"]`).should('contain', CQLLibraryName)
            // ToDo?: add a check here for model
        })
        cy.log('CQL Library Created Successfully')
    }

    public static clickCreateLibraryButton(): void {
        let alias = 'library' + (Date.now().valueOf() + 1).toString()
        const libraryAlias: `@${string}` = `@${alias}`
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/cql-libraries').as(alias)

        cy.get(this.saveCQLLibraryBtn).click()
        //saving measureID to file to use later
        cy.wait(libraryAlias).then(({ response }) => {
            expect(response?.statusCode).to.eq(201)
            TestData.writeCqlLibraryId(response?.body.id)
        })
    }

    public static createCQLLibraryAPI(
        CqlLibraryName: string,
        CQLLibraryPublisher: string,
        twoLibraries?: boolean,
        altUser?: boolean,
        cql?: string,
    ): string {
        const owner = this.fixtureOwner(altUser)
        const user = TestData.setupUserScope(owner)

        TestData.requestCqlLibrary({
            cqlLibraryName: CqlLibraryName,
            model: 'QI-Core v4.1.1',
            createdBy: user,
            description: 'description',
            publisher: CQLLibraryPublisher,
            cql: cql ?? ''
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
            TestData.writeCqlLibraryId(response.body.id, twoLibraries === true ? 2 : 0, owner)
        })

        return user
    }

    //input the library that is on page to check it's checkbox (ie: if it is the first library that we want checked, enter 0)
    public static checkLibrary(libraryOnPage: number): void {
        cy.get('[data-testid*="measure-name-' + libraryOnPage + '_select"]')
            .parent('tr')
            .find('input[type="checkbox"]')
            .check()
    }

    public static versionLibraryAPI(expectedVersionNumber: string) {
        TestData.versionCqlLibrary(expectedVersionNumber).then((response) => {
            expect(response.status).to.eql(200)
        })
    }

    public static actionCenter(action: EditLibraryActions): void {
        cy.get(this.actionCenterButton).should('be.visible').click()

        switch (action) {
            case EditLibraryActions.delete: {
                cy.get(this.actionCenterDelete).should('be.visible')
                cy.get(this.actionCenterDelete).should('be.enabled')
                cy.get(this.actionCenterDelete).click()

                // confirm we are on deletion modal
                cy.get('.dialog-warning-action').should('have.text', 'This Action cannot be undone.')

                // click "yes delete"
                cy.get(CQLEditorPage.deleteContinueButton).should('be.visible')
                cy.get(CQLEditorPage.deleteContinueButton).should('be.enabled')
                cy.get(CQLEditorPage.deleteContinueButton).click()
                break
            }
            case EditLibraryActions.version: {
                cy.get(this.actionCenterVersion).should('be.visible')
                cy.get(this.actionCenterVersion).should('be.enabled')
                cy.get(this.actionCenterVersion).click()

                // click major & continue
                cy.get('input[value="major"]').check()
                cy.get(CQLLibrariesPage.createVersionContinueButton).should('be.visible')
                cy.get(CQLLibrariesPage.createVersionContinueButton).click()
                break
            }
            case EditLibraryActions.draft: {
                cy.get(this.actionCenterDraft).should('be.visible')
                cy.get(this.actionCenterDraft).should('be.enabled')
                cy.get(this.actionCenterDraft).click()

                cy.get(CQLLibrariesPage.updateDraftedLibraryTextBox).should('be.enabled')

                cy.get(CQLLibrariesPage.createDraftContinueBtn).should('be.visible')
                cy.get(CQLLibrariesPage.createDraftContinueBtn).click()
                break
            }
            case EditLibraryActions.share: {
                cy.get(this.actionCenterShare).should('be.visible')
                cy.get(this.actionCenterShare).should('be.enabled')
                cy.get(this.actionCenterShare).click()

                break
            }
            case EditLibraryActions.transfer: {
                cy.get(this.actionCenterTransfer).should('be.visible')
                cy.get(this.actionCenterTransfer).should('be.enabled')
                cy.get(this.actionCenterTransfer).click()

                break
            }
            case EditLibraryActions.viewHistory: {
                cy.get(this.actionCenterHistory).should('be.visible')
                cy.get(this.actionCenterHistory).should('be.enabled')
                cy.get(this.actionCenterHistory).click()

                break
            }
            default: {
            }
        }
    }

    public static createLibraryAPI(libraryName: string, model: SupportedModels, options?: CreateLibraryOptions) {
        const owner = this.fixtureOwner(options?.altUser)
        const user = TestData.setupUserScope(owner)

        TestData.requestCqlLibrary({
            cqlLibraryName: libraryName,
            model,
            createdBy: user,
            description: options?.description ?? 'testing library functionality',
            publisher: options?.publisher ?? 'ICF',
            cql: options?.cql ?? '',
            cqlErrors: options?.cqlErrors ?? false
        }).then((response) => {
            expect(response.status).to.eql(201)
            expect(response.body.id).to.be.exist
            expect(response.body.cqlLibraryName).to.eql(libraryName)
            TestData.writeCqlLibraryId(response.body.id, options?.libraryNumber ?? 0, owner)
        })

        return user
    }

    public static checkFirstRow(expectedData: MeasureRow) {
        cy.get(this.cqlLibSearchResultsTable, { timeout: 30000 }).should('be.visible')
        cy.get(CQLLibrariesPage.libraryListRows, { timeout: 30000 })
            .first()
            .find('td')
            .eq(1)
            .should('be.visible')
        cy.get(CQLLibrariesPage.libraryListRows)
            .first()
            .then((firstRow) => {
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
                if (expectedData.updated) {
                    cy.wrap(firstRow.children().eq(7)).should('have.text', expectedData.updated)
                }
            })
    }

    private static normalizeOverlayText(text: string): string {
        return text.replace(/\s+/g, ' ').trim()
    }

    public static assertLibraryLockedModalMessage(expectedText: string): void {
        step('Assert locked library modal message')
        cy.get(this.libraryLockedModalMessage).should('be.visible')
        cy.get(this.libraryLockedModalMessage).should(($message) => {
            const actualText = this.normalizeOverlayText($message.text())
            expect(actualText).to.contain(expectedText)
        })
    }

    public static closeLibraryLockedModalByX(): void {
        step('Close locked library modal with X')
        cy.get(this.libraryLockedModalCloseIcon).should('be.visible').click()
        cy.get(this.libraryLockedModalMessage).should('not.exist')
    }

    public static closeLibraryLockedModalByButton(): void {
        step('Close locked library modal with Close button')
        cy.get(this.libraryLockedModalCloseButton).should('be.visible').click()
        cy.get(this.libraryLockedModalMessage).should('not.exist')
    }

    public static dismissLibraryLockedModal(
        expectedText: string,
        closeMethod: LibraryLockedModalCloseMethod = 'button',
    ): void {
        this.assertLibraryLockedModalMessage(expectedText)

        if (closeMethod === 'x') {
            this.closeLibraryLockedModalByX()
            return
        }

        this.closeLibraryLockedModalByButton()
    }

    public static assertLockedLibraryIndicatorTooltip(expectedTooltip: string): void {
        step('Assert locked library header In-Use tooltip')
        cy.get(this.libraryLockedIndicatorChip).should('be.visible').trigger('mouseover', { force: true })
        cy.get('body').then(($body) => {
            const tooltip = $body.find('.MuiTooltip-tooltip')

            if (tooltip.length > 0) {
                const actualTooltip = this.normalizeOverlayText(tooltip.text())
                expect(actualTooltip).to.contain(expectedTooltip)
                return
            }

            cy.get(this.libraryLockedIcon)
                .should('be.visible')
                .invoke('attr', 'aria-label')
                .then((ariaLabel) => {
                    const actualTooltip = this.normalizeOverlayText(ariaLabel ?? '')
                    expect(actualTooltip).to.contain(expectedTooltip)
                })
        })
    }
}
