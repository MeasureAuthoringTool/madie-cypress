import {Header} from "./Header"
import {Environment} from "./Environment"
import {Utilities} from "./Utilities";

export class CQLLibraryPage {

    public static readonly createCQLLibraryBtn = '[data-testid="create-new-cql-library-button"]'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly cqlLibraryModelDropdown = '#model-select'
    public static readonly allLibrariesBtn = '[data-testid="all-cql-libraries-tab"]'
    public static readonly cqlLibraryModelQICore = '[data-testid="cql-library-model-option-QI-Core v4.1.1"]'
    public static readonly saveCQLLibraryBtn = '[data-testid="create-new-library-save-button"]'
    public static readonly updateCQLLibraryBtn = '[data-testid="cql-library-save-button"]'
    public static readonly cqlLibraryNameList = ':nth-child(1) > .CqlLibraryList___StyledTd-sc-1rv02q7-10'
    public static readonly cqlLibraryModelList = ':nth-child(1) > .CqlLibraryList___StyledTd2-sc-1rv02q7-11'
    public static readonly cqlLibraryNameInvalidError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly duplicateCQLLibraryNameError = '[data-testid="create-cql-library-error-text"]'
    public static readonly cqlLibraryModelErrorMsg = '.MuiFormHelperText-root'
    public static readonly successfulCQLSaveNoErrors = '[data-testid=cql-library-success-alert]'
    public static readonly warningAlert = '[data-testid="cql-library-warning-alert"]'
    public static readonly newCQLLibName = '[data-testid="cql-library-name-text-field-input"]'
    public static readonly currentCQLLibName = '[id="cql-library-name-text-field-input"]'
    public static readonly discardChanges = '[data-testid="cql-library-cancel-button"]'
    public static readonly currentCQLLibSavebtn = '[data-testid="cql-library-save-button"]'
    public static readonly headerDetails = '[class="details"]'
    public static readonly cqlLibraryDesc = '[id="cql-library-description"]'
    public static readonly cqlLibraryPublisher = '[class="MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2"]'
    public static readonly cqlLibraryPublisherDrpDwn = '#mui-3-option-0'


    //CQL Editor
    public static readonly cqlLibraryEditorTextBox = '.ace_content'
    //UMLS Not Logged in Error
    public static readonly umlsErrorMessage = '[data-testid="valueset-error"]'
    public static readonly umlsSuccessMessage = '[data-testid="valueset-success"]'
    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'


    public static createCQLLibrary (CQLLibraryName: string, CQLLibraryPublisher: string) : void {

        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        cy.get(this.createCQLLibraryBtn).click()
        cy.get(this.newCQLLibName).type(CQLLibraryName)
        cy.get(this.cqlLibraryDesc).type('description')
        cy.get(CQLLibraryPage.cqlLibraryPublisher).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryPublisher).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryPublisher).type(CQLLibraryPublisher)
        cy.get(CQLLibraryPage.cqlLibraryPublisherDrpDwn).should('exist')
        cy.get(CQLLibraryPage.cqlLibraryPublisherDrpDwn).should('be.visible')
        cy.get(CQLLibraryPage.cqlLibraryPublisherDrpDwn).click()

        Utilities.dropdownSelect(CQLLibraryPage.cqlLibraryModelDropdown, CQLLibraryPage.cqlLibraryModelQICore)
        this.clickCreateLibraryButton()
        cy.get(Header.cqlLibraryTab).click()
        cy.wait(1000)
        this.validateCQlLibraryName(CQLLibraryName)
        this.validateCQlLibraryModel('QI-Core')
        cy.log('CQL Library Created Successfully')
    }

    public static validateCQlLibraryName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=cqlLibrary-button-'+ fileContents +']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static validateCQlLibraryModel(expectedValue: string): void {
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=cqlLibrary-button-'+ fileContents + '-model' + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static clickCreateLibraryButton() : void {

        let alias = 'library' + (Date.now().valueOf()+1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/cql-libraries').as(alias)

        cy.get(this.saveCQLLibraryBtn).click()
        //saving measureID to file to use later
        cy.wait('@' + alias).then(({response}) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
        })
    }

    public static createCQLLibraryAPI(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean): string {
        let user = ''

        if (altUser)
        {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else
        {
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
                    "description": "description",
                    "publisher": CQLLibraryPublisher,
                    'cql': ""
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (twoLibraries === true)
                {
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else
                {
                    cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
                }

            })
        })
        return user
    }

    public static createAPICQLLibraryWithValidCQL(CqlLibraryName: string, CQLLibraryPublisher: string, twoLibraries?: boolean, altUser?: boolean): string {
        let user = ''

        if (altUser)
        {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else
        {
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
                        "using QICore version '4.1.0'\n" +
                        "\n" +
                        "valueset \"ONC Administrative Sex\": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1'",
                    "description": "description",
                    "publisher": CQLLibraryPublisher,
                    'createdBy': user
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(CqlLibraryName)
                if (twoLibraries === true)
                {
                    cy.writeFile('cypress/fixtures/cqlLibraryId2', response.body.id)
                }
                else
                {
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

