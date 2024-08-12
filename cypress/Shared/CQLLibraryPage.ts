import { Header } from "./Header"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"
import { v4 as uuidv4 } from 'uuid'


export class CQLLibraryPage {
    public static readonly measureCQLGenericErrorsList = '[data-testid="generic-errors-text-list"]'
    public static readonly cqlLibrarySuccessfulDeleteMsgBox = '[data-testid="cql-library-list-snackBar"]'
    public static readonly cqlLibraryDeleteDialogContinueBtn = '[data-testid="delete-dialog-continue-button"]'
    public static readonly cqlLibraryDeleteDialogCancelBtn = '[data-testid="delete-dialog-cancel-button"]'
    public static readonly cqlLibraryDeleteDialog = '[data-testid="delete-dialog"]'
    public static readonly cqlLibSaveSuccessMessage = '[class="madie-alert success"]'
    public static readonly cqlLibSearchResultsTable = '[data-testid="table-body"]'
    public static readonly cqlLibraryProgramUseContext = '[id="programUseContext"]'
    public static readonly createCQLLibraryBtn = '[data-testid="create-new-cql-library-button"]'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly cqlLibraryModelDropdown = '[data-testid="cql-library-model-select"]'
    public static readonly cqlLibraryStickySave = '[data-testid="cql-library-save-button"]'
    public static readonly allLibrariesBtn = '[data-testid="all-cql-libraries-tab"]'
    public static readonly myLibrariesBtn = '[data-testid="my-cql-libraries-tab"]'
    public static readonly LibFilterTextField = '[data-testid="library-filter-input"]'
    public static readonly LibFilterSubmitBtn = '[data-testid="library-filter-submit"]'
    public static readonly LibFilterLabel = '[id="mui-1-label"]'
    public static readonly LibTableRows = '[data-testid="row-item"]'
    public static readonly ClearSearchBox = '[data-testid="ClearIcon"]'
    public static readonly cqlLibraryModelQICore = '[data-testid="cql-library-model-option-QI-Core v4.1.1"]'
    public static readonly saveCQLLibraryBtn = '[data-testid="continue-button"]'
    public static readonly updateCQLLibraryBtn = '[data-testid="cql-library-save-button"]'
    public static readonly cqlLibraryNameList = ':nth-child(1) > .CqlLibraryList___StyledTd-sc-1rv02q7-10'
    public static readonly cqlLibraryModelList = ':nth-child(1) > .CqlLibraryList___StyledTd2-sc-1rv02q7-11'
    public static readonly cqlLibraryNameInvalidError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly duplicateCQLLibraryNameError = '[data-testid="create-cql-library-error-text"]'
    public static readonly cqlLibraryModelErrorMsg = '.MuiFormHelperText-root'
    public static readonly successfulCQLSaveNoErrors = '[data-testid=cql-library-success-alert]'
    public static readonly genericSuccessMessage = '[data-testid="generic-success-text-header"]'
    public static readonly warningAlert = '[data-testid="cql-library-warning-alert"]'
    public static readonly libraryWarning = '[data-testid="library-warning"]'
    public static readonly newCQLLibName = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly currentCQLLibName = '[id="cql-library-name-text-field-input"]'
    public static readonly discardChanges = '[data-testid="cql-library-cancel-button"]'
    public static readonly currentCQLLibSavebtn = '[data-testid="cql-library-save-button"]'
    public static readonly headerDetails = '[class="details"]'
    public static readonly cqlLibraryDesc = '[id="cql-library-description"]'
    public static readonly cqlLibraryCreatePublisher = '[data-testid="publisher"]'
    public static readonly cqlLibraryModalField = '[id="model-select"]'
    public static readonly cqlLibraryCreateForm = '[id="menu-model"]'
    public static readonly cqlLibraryCreateFormSideClickArea = '[class="MuiBox-root css-0"]'
    public static readonly cqlLibraryEditPublisher = '[data-testid="publisher"]'
    public static readonly cqlLibraryEditPublisherCloseIcon = '[data-testid="CloseIcon"]'
    public static readonly cqlLibraryCreatePublisherDrpDwn = '[aria-activedescendant="mui-3-option-0"]'
    public static readonly cqlLibraryEditPublisherDrpDwn = '#mui-4-option-0'
    public static readonly cqlLibDescHelperText = '[data-testid="cql-library-description-helper-text"]'
    public static readonly cqlLibPubHelperText = '[data-testid="publisher-helper-text"]'
    public static readonly cqlLibraryExperimentalChkBox = '[id="experimental"]'
    public static readonly editLibraryOwnershipError = '[id="content"]'

    //CQL Editor
    public static readonly cqlLibraryEditorTextBox = '.ace_content'
    //UMLS Not Logged in Error
    public static readonly umlsErrorMessage = '[data-testid="valueset-error"]'
    public static readonly umlsSuccessMessage = '[data-testid="valueset-success"]'
    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'

    //QDM Library
    public static readonly cqlLibraryModelQDM = '[data-testid="cql-library-model-option-QDM v5.6"]'

    public static createCQLLibrary(CQLLibraryName: string, CQLLibraryPublisher: string): void {


        cy.get(Header.cqlLibraryTab).should('be.visible')

        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementEnabled(CQLLibraryPage.createCQLLibraryBtn, 60000)

        cy.get(this.createCQLLibraryBtn).should('be.visible')
        cy.get(this.createCQLLibraryBtn).should('be.enabled').wait(1500)
        cy.get(this.createCQLLibraryBtn).click()

        cy.get(this.newCQLLibName).should('be.visible')
        cy.get(this.newCQLLibName).type(CQLLibraryName)
        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, CQLLibraryPage.cqlLibraryModelQICore)
        cy.get(this.cqlLibraryDesc).type('description')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryCreatePublisher).type(CQLLibraryPublisher).type('{downArrow}{enter}')

        this.clickCreateLibraryButton()
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).wait(1000).click()

        this.validateCQlLibraryName(CQLLibraryName)
        this.validateCQlLibraryModel('QI-Core')
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

    public static validateCQlLibraryName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=cqlLibrary-button-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static validateCQlLibraryModel(expectedValue: string): void {
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=cqlLibrary-button-' + fileContents + '-model' + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static clickCreateLibraryButton(): void {

        let alias = 'library' + (Date.now().valueOf() + 1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/cql-libraries').as(alias)

        cy.get(this.saveCQLLibraryBtn).wait(1000).click()
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

    public static createCQLLibraryAPI(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean): string {
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
                        'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
                        "using QICore version '4.1.1'\n" +
                        "\n" +
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
}
