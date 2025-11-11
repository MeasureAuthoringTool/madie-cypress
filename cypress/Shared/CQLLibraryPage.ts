import { Header } from "./Header"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"
import { v4 as uuidv4 } from 'uuid'
import { CQLLibrariesPage } from "./CQLLibrariesPage"
import { CQLEditorPage } from "./CQLEditorPage"
import { SupportedModels } from "./CreateMeasurePage"
import { MeasureRow } from "./MeasuresPage"
import { OktaLogin } from "./OktaLogin"

export enum EditLibraryActions {
    delete,
    version,
    draft,
    share,
    transfer,
    viewHistory
}

export type CreateLibraryOptions = {
    cql?: string,
    cqlErrors?: boolean,
    description?: string,
    altUser?: boolean,
    libraryNumber?: number,
    publisher?: string
}


export class CQLLibraryPage {
    public static readonly ownedLibrariesTab = '[data-testid="owned-libraries-tab"]'
    public static readonly sharedLibrariesTab = '[data-testid="shared-libraries-tab"]'
    public static readonly allLibrariesTab = '[data-testid="all-libraries-tab"]'

    public static readonly measureCQLGenericErrorsList = '[data-testid="generic-errors-text-list"]'
    public static readonly cqlLibrarySuccessfulDeleteMsgBox = '[data-testid="cql-library-list-snackBar"]'
    public static readonly applyEditsSavedLibraryBtn = '[data-testid="apply-button"]'
    public static readonly cqlLibraryDeleteDialogCancelBtn = '[data-testid="delete-dialog-cancel-button"]'
    public static readonly cqlLibraryDeleteDialog = '[data-testid="delete-dialog"]'
    public static readonly cqlLibSaveSuccessMessage = '[class="madie-alert success"]'
    public static readonly cqlLibSearchResultsTable = '[data-testid="table-body"]'
    public static readonly createCQLLibraryBtn = '[data-testid="create-new-cql-library-button"]'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly readOnlyCqlLibraryName = '[data-testid="cql-library-name-text-field"]'
    public static readonly cqlLibraryModelDropdown = '[data-testid="cql-library-model-select"]'
    public static readonly cqlLibraryStickySave = '[data-testid="cql-library-save-button"]'
    public static readonly libraryListTitles = '[data-testid="cqlLibrary-list"]'
    public static readonly LibFilterTextField = '[data-testid="library-search-input"]'
    public static readonly filterByDropdown = '[data-testid="filter-by"]'
    public static readonly cqlLibraryModelQICore = '[data-testid="cql-library-model-option-QI-Core v4.1.1"]'
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
    public static readonly draftBubble = '[data-testid="draft-bubble"]'

    // Edit page action center
    public static readonly actionCenterButton = '[data-testid="action-center-actual-icon"]'
    public static readonly actionCenterDelete = '[data-testid="DeleteLibrary"]'
    public static readonly actionCenterVersion = '[data-testid="VersionLibrary"]'
    public static readonly actionCenterDraft = '[data-testid="DraftLibrary"]'
    public static readonly actionCenterShare = '[data-testid="ShareLibrary"]'
    public static readonly actionCenterTransfer = '[data-testid="Transfer"]'
    public static readonly actionCenterHistory = '[data-testid="History"]'

    //CQL Editor
    public static readonly cqlLibraryEditorTextBox = '.ace_content'

    //UMLS Not Logged in Error
    public static readonly umlsErrorMessage = '[data-testid="valueset-error"]'

    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'

    //QDM Library
    public static readonly cqlLibraryModelQDM = '[data-testid="cql-library-model-option-QDM v5.6"]'

    public static createCQLLibrary(CQLLibraryName: string, CQLLibraryPublisher: string): void {

        const currentUser = Cypress.env('selectedUser')

        cy.get(Header.cqlLibraryTab).should('be.visible')

        cy.get(Header.cqlLibraryTab).click().wait(1500)

        Utilities.waitForElementEnabled(CQLLibraryPage.createCQLLibraryBtn, 60000)

        cy.get(this.createCQLLibraryBtn).should('be.visible')
        cy.get(this.createCQLLibraryBtn).should('be.enabled')
        cy.get(this.createCQLLibraryBtn).click()

        cy.get(this.newCQLLibName).should('be.visible')
        cy.get(this.newCQLLibName).type(CQLLibraryName)
        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, CQLLibraryPage.cqlLibraryModelQICore)
        cy.get(this.cqlLibraryDesc).type('description')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type(CQLLibraryPublisher).type('{downArrow}{enter}')

        this.clickCreateLibraryButton()
        Utilities.waitForElementToNotExist('[class="toast success"]', 60000)
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        cy.readFile('cypress/fixtures/' + currentUser + '/cqlLibraryId').should('exist').then((fileContents) => {

            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '-content"]').should('contain', CQLLibraryName)
            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '-model-content"]').should('contain', 'QI-Core')
        })
        cy.log('QI-Core CQL Library Created Successfully')
    }

    public static clickCreateLibraryButton(): void {
        const currentUser = Cypress.env('selectedUser')
        let alias = 'library' + (Date.now().valueOf() + 1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/cql-libraries').as(alias)

        cy.get(this.saveCQLLibraryBtn).click()
        //saving measureID to file to use later
        cy.wait('@' + alias).then(({ response }) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId', response.body.id)
        })
    }

    public static createCQLLibraryAPI(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean, cql?: string): string {
        let user = ''
        if ((cql === undefined) || (cql === null)) {
            cql = ""
        }

        user = OktaLogin.setupUserSession(altUser)

        //Create New CQL Library
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'cqlLibraryName': CqlLibraryName,
                    'model': 'QI-Core v4.1.1',
                    'createdBy': user,
                    "librarySetId": uuidv4(),
                    "description": "description",
                    "publisher": CQLLibraryPublisher,
                    'cql': cql//,
                    //"programUseContext": { "code": "a", "display": "b", "codeSystem": "c" }
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (altUser)
                {
                    currentUser = Cypress.env('selectedAltUser')
                }
                if (twoLibraries === true) {
                    cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static createAPICQLLibraryWithValidCQL(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean): string {
        const currentUser = Cypress.env('selectedUser')

        let user = ''

        user = OktaLogin.setupUserSession(altUser)

        //Create New CQL Library
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'cqlLibraryName': CqlLibraryName,
                    'model': 'QI-Core v4.1.1',
                    'cql': "library SupplementalDataElementsQICore4 version '2.0.0'\n" +
                        "\n" +
                        "using QICore version '4.1.1'\n" +
                        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
                        "valueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'\n" +
                        "context Patient",
                    "librarySetId": uuidv4(),
                    "description": "description",
                    "publisher": CQLLibraryPublisher,
                    'createdBy': user
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (twoLibraries === true) {
                    cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    //input the library that is on page to check it's checkbox (ie: if it is the first library that we want checked, enter 0)
    public static checkLibrary(libraryOnPage: number): void {

        cy.get('[data-testid*="cqlLibrary-button-' + libraryOnPage + '_select"]')
            .parent('tr')
            .find('input[type="checkbox"]')
            .check()
    }

    public static versionLibraryAPI(expectedVersionNumber: string) {

        const currentUser = Cypress.env('selectedUser')
        const filePath = 'cypress/fixtures/' + currentUser + '/cqlLibraryId'

        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(filePath).should('exist').then((cqlLibraryId) => {
                cy.request({
                    url: '/api/cql-libraries/version/' + cqlLibraryId + '?isMajor=true',
                    method: 'PUT',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    }

                }).then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.version).to.eql(expectedVersionNumber)

                })
            })
        })
    }

    public static actionCenter(action: EditLibraryActions): void {

        cy.get(this.actionCenterButton).click()

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
            default: { }
        }
    }

    public static createLibraryAPI(libraryName: string, model: SupportedModels, options: CreateLibraryOptions) {

        let user: string, description: string, publisher: string, cql: string, cqlErrors = false

        const currentUser = Cypress.env('selectedUser')

        user = OktaLogin.setupUserSession(options.altUser)

        if (options && options.description) {
            description = options.description
        }
        else {
            description = 'testing library functionality'
        }
        if (options && options.publisher) {
            publisher = options.publisher
        }
        else {
            publisher = 'ICF'
        }
        if (options && options.cql) {
            cql = options.cql
        }
        else {
            cql = ''
        }
        if (options && options.cqlErrors) {
            cqlErrors = true
        }

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'cqlLibraryName': libraryName,
                    'model': model,
                    'createdBy': user,
                    "librarySetId": uuidv4(),
                    "description": description,
                    "publisher": publisher,
                    'cql': cql,
                    'cqlErrors': cqlErrors
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(libraryName)
                if (options && options.libraryNumber) {
                    cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId' + options.libraryNumber, response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/' + currentUser + '/cqlLibraryId', response.body.id)
                }
            })
        })
        return user
    }

    public static checkFirstRow(expectedData: MeasureRow) {
        cy.wait(1100)

        cy.get('.table-body tr').first().then(firstRow => {

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
                cy.wrap(firstRow.children().eq(6)).should('have.text', expectedData.updated)
            }

        })

    }
}
