import { Header } from "./Header"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"
import { v4 as uuidv4 } from 'uuid'
import { CQLLibrariesPage } from "./CQLLibrariesPage"
import { CQLEditorPage } from "./CQLEditorPage"

export enum EditLibraryActions {

    delete,
    version,
    draft,
    share
}

const filePath = 'cypress/fixtures/cqlLibraryId'

export class CQLLibraryPage {
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
    public static readonly allLibrariesBtn = '[data-testid="all-cql-libraries-tab"]'
    public static readonly myLibrariesBtn = '[data-testid="my-cql-libraries-tab"]'
    public static readonly LibFilterTextField = '[data-testid="library-search-input"]'//filter
    public static readonly LibFilterSubmitBtn = '[data-testid="library-filter-submit"]'
    public static readonly LibFilterLabel = '[id="mui-2-label"]'
    public static readonly LibTableRows = '[data-testid="row-item"]'
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

    //CQL Editor
    public static readonly cqlLibraryEditorTextBox = '.ace_content'

    //UMLS Not Logged in Error
    public static readonly umlsErrorMessage = '[data-testid="valueset-error"]'

    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'

    //QDM Library
    public static readonly cqlLibraryModelQDM = '[data-testid="cql-library-model-option-QDM v5.6"]'

    public static createCQLLibrary(CQLLibraryName: string, CQLLibraryPublisher: string): void {


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

        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '-content"]').should('contain', CQLLibraryName)
            cy.get('[data-testid="cqlLibrary-button-' + fileContents + '-model-content"]').should('contain', 'QI-Core')
        })
        cy.log('QI-Core CQL Library Created Successfully')
    }

    public static createQDMCQLLibraryAPI(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean): string {
        let user = ''

        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

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
                    'model': 'QDM v5.6',
                    'createdBy': user,
                    "librarySetId": uuidv4(),
                    "description": "description",
                    "publisher": CQLLibraryPublisher,
                    'cql': "",
                    "programUseContext": { "code": "a", "display": "b", "codeSystem": "c" }
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (twoLibraries === true) {
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static clickCreateLibraryButton(): void {

        let alias = 'library' + (Date.now().valueOf() + 1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/cql-libraries').as(alias)

        cy.get(this.saveCQLLibraryBtn).click()
        //saving measureID to file to use later
        cy.wait('@' + alias).then(({ response }) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
        })
    }
    public static createCQLLibraryAPIOptionalCQL(CqlLibraryName: string, CQLLibraryPublisher: string, cQlValue?: string, twoLibraries?: boolean, altUser?: boolean): string {
        let user = ''

        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

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
                    'cql': cQlValue,
                    "programUseContext": { "code": "a", "display": "b", "codeSystem": "c" }
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (twoLibraries === true) {
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static createCQLLibraryAPI(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean, cql?: string): string {
        let user = ''
        if ((cql === undefined) || (cql === null)) {
            cql = ""
        }

        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

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
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (twoLibraries === true) {
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static createAPICQLLibraryWithValidCQL(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean): string {
        let user = ''

        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

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
                        "valueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'",
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
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static createAPILibraryWithValidCQL(CqlLibraryName: string, CQLLibraryPublisher: string, ModelType?: string, LibraryCQLVal?: string, twoLibraries?: boolean, altUser?: boolean): string {
        let user = ''
        let CQLVal = ''
        let model = ''

        if (ModelType == undefined || ModelType == null || ModelType == '') {
            model = 'QI-Core v4.1.1'
        }
        else {
            model = ModelType
        }

        if (LibraryCQLVal == undefined || LibraryCQLVal == null || LibraryCQLVal == '') {
            CQLVal = ""
        }
        else {
            CQLVal = LibraryCQLVal
        }

        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

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
                    'model': model,
                    'cql': CQLVal,
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
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else {
                    cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static createAPICQLLibraryWithInvalidCQL(CqlLibraryName: string, CQLLibraryPublisher: string): void {

        cy.setAccessTokenCookie()

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
                    'cql': "library TESTMEASURE0000000003 version '0.0.000'\nusing FHIR version '4.0.1'\ninclude FHIRHelpers version '4.1.000' called FHIRHelpers\ninclude SupplementalDataElementsFHIR4 version '2.0.000' called SDE\ninclude MATGlobalCommonFunctionsFHIR4 version '6.1.000' called Global\nparameter \"Measurement Period\" Interval<DateTimeTest>\ncontext Patient\ndefine \"SDE Ethnicity\":\nSDE.\"SDE Ethnicity\"\ndefine \"SDE Payer\":\nSDE.\"SDE Payer\"\ndefine \"SDE Race\":\nSDE.\"SDE Race\"\ndefine \"SDE Sex\":\nSDE.\"SDE Sex\"",
                    "description": "description",
                    "librarySetId": uuidv4(),
                    "publisher": CQLLibraryPublisher,
                    'cqlErrors': true
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                expect(response.body.cqlErrors).to.eql(true)

                cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
            })
        })

    }

    //input the library that is on page to check it's checkbos (ie: if it is the first library that we want checked, enter 0)
    public static checkLibrary(libraryOnPage: number): void {

        cy.get('[data-testid*="cqlLibrary-button-' + libraryOnPage + '_select"]')
            .parent('tr')
            .find('input[type="checkbox"]')
            .check()
    }

    public static versionLibraryAPI(expectedVersionNumber: string) {

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
            default: { }
        }
    }

}
