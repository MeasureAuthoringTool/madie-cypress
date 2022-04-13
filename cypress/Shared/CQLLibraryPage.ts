import {Header} from "./Header"

export class CQLLibraryPage {

    public static readonly createCQLLibraryBtn = '[data-testid="create-new-cql-library-button"]'
    public static readonly cqlLibraryNameTextbox = '#cqlLibraryName'
    public static readonly cqlLibraryModelDropdown = '#cqlLibraryModel'
    //cql Library editor box on page
    public static readonly cqlLibraryEditorTextBox = '.ace_content'
    public static readonly cqlLibraryModelQICore = '[data-testid="cql-library-model-option-QI-Core"]'
    public static readonly saveCQLLibraryBtn = '[data-testid="cql-library-save-button"]'//'#saveBtn'
    public static readonly cqlLibraryNameList = '.CqlLibraryList___StyledTd-sc-1rv02q7-9'
    public static readonly cqlLibraryModelList = '.CqlLibraryList___StyledTd2-sc-1rv02q7-10'
    public static readonly cqlLibraryNameInvalidError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly duplicateCQLLibraryNameError = '[data-testid="cql-library-server-error-alerts"]'
    public static readonly cqlLibraryModelErrorMsg = '#cqlLibraryModel-helper-text'
    public static readonly successfulCQLSaveNoErrors = '[data-testid=cql-library-success-alert]'

    //Error marker inside of the CQL Editor window
    public static readonly errorInCQLEditorWindow = 'div.ace_gutter-cell.ace_error'


    public static createCQLLibrary (CQLLibraryName: string) : void {

        cy.get(Header.cqlLibraryTab).click()
        cy.get(this.createCQLLibraryBtn).click()
        cy.get(this.cqlLibraryNameTextbox).type(CQLLibraryName)
        cy.get(this.cqlLibraryModelDropdown).click()
        cy.get(this.cqlLibraryModelQICore).click()
        this.clickCreateLibraryButton()
        cy.get(Header.cqlLibraryTab).click()
        cy.get(this.cqlLibraryNameList).contains(CQLLibraryName)
        cy.get(this.cqlLibraryModelList).contains('QI-Core')

        cy.log('CQL Library Created Successfully')
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

    public static createCQLLibraryAPI (apiCQLLibraryName: string) : void {
        cy.setAccessTokenCookie()

        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/cql-libraries',
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "cqlLibraryName": apiCQLLibraryName,
                    "model": "QI-Core"
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                expect(response.body.cqlLibraryName).to.eql(apiCQLLibraryName)
                cy.writeFile('cypress/fixtures/cqlLibraryId', response.body.id)
            })
        })
    }
    public static clickEditforCreatedLibrary(): void {

        //Navigate to CQL Library Page
        cy.get(Header.cqlLibraryTab).click()
        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            cy.get('[data-testid=edit-cqlLibrary-'+ fileContents +']').click()
        })
    }

    public static validateCQLLibraryName(expectedValue: string): void {

        cy.readFile('cypress/fixtures/cqlLibraryId').should('exist').then((fileContents) => {
            let element = cy.get('[data-testid=edit-cqlLibrary-'+ fileContents +']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

}

