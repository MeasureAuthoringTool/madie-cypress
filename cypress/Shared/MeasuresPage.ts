import { Utilities } from "./Utilities"


export class MeasuresPage {

    public static readonly measureListTitles = '[data-testid=table-body] > :nth-child(1)'
    public static readonly allMeasuresTab = '[data-testid=all-measures-tab]'
    public static readonly searchInputBox = '[data-testid="searchMeasure-input"]'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'

    //Measure Version
    public static readonly versionMeasuresRadioButton = '[name="type"]'
    public static readonly VersionDraftMsgs = '[data-testid="success-toast"]'
    public static readonly VersionDraftErrMsgs = '[data-testid="error-toast"]'
    public static readonly updateDraftedMeasuresTextBox = '[data-testid="measure-name-input"]'
    public static readonly createDraftContinueBtn = '[data-testid="create-draft-continue-button"]'
    public static readonly measureVersionMajor = '[data-testid="radio-button-group"] > :nth-child(1)'
    public static readonly measureVersionContinueBtn = '[data-testid="create-version-continue-button"]'
    public static readonly measureVersionSuccessMsg = '[data-testid="success-toast"]'
    public static readonly measureVersioningErrorMsg = '[data-testid="error-toast"]'
    public static readonly measureVersionHelperText = '[data-testid="version-helper-text"]'


    public static validateMeasureName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    /*     public static exportMeasure(): void {
    
            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
                cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
                cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                cy.get('[data-testid=measure-action-' + fileContents + ']').click()
    
                cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
    
                cy.get('[data-testid=export-measure-' + fileContents + ']').click()
    
                cy.wait('@measureExport', { timeout: 60000 }).then(({ response }) => {
                    expect(response.statusCode).to.eq(200)
                })
            })
        } */

    public static validateVersionNumber(expectedValue: string, versionNumber: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue).children().eq(1).should('contain', versionNumber)
        })
    }

    public static measureAction(action: string, secondMeasure?: boolean): void {
        let filePath = 'cypress/fixtures/measureId'

        if (secondMeasure === true) {
            filePath = 'cypress/fixtures/measureId2'
        }
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {
                    Utilities.waitForElementVisible('[data-testid=view-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=view-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=view-measure-' + fileContents + ']').click()

                    break
                }
                case 'export': {
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=export-measure-' + fileContents + ']').click()
                    cy.wait('@measureExport', { timeout: 60000 }).then(({ response }) => {
                        expect(response.statusCode).to.eq(200)
                    })
                    break
                }
                case 'version': {
                    Utilities.waitForElementVisible('[data-testid=create-version-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=create-version-measure-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=create-version-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=create-version-measure-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=create-version-measure-' + fileContents + ']').click()
                    break
                }
                case 'draft': {
                    Utilities.waitForElementVisible('[data-testid=draft-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=draft-measure-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=draft-measure-' + fileContents + ']', 30000)
                    cy.get('[data-testid=draft-measure-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=draft-measure-' + fileContents + ']').click()
                    break
                }
                default: { }
            }
        })
    }
}