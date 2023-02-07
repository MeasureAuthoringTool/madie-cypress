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


    public static clickEditforCreatedMeasure(secondMeasure?: boolean): void {
        let filePath = 'cypress/fixtures/measureId'

        if (secondMeasure === true) {
            filePath = 'cypress/fixtures/measureId2'
        }

        //block of code that will be used once the measureVersioning flag is removed

        //            cy.readFile(filePath).should('exist').then((fileContents) => {
        //             Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
        //             cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
        //             Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
        //             cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
        //             cy.get('[data-testid=measure-action-' + fileContents + ']').click()
        //             Utilities.waitForElementVisible('[data-testid=view-measure-' + fileContents + ']', 30000)
        //             cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
        //             Utilities.waitForElementEnabled('[data-testid=view-measure-' + fileContents + ']', 30000)
        //             cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.enabled')
        //             cy.get('[data-testid=view-measure-' + fileContents + ']').click()
        //         })

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=edit-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=edit-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=edit-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=edit-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=edit-measure-' + fileContents + ']').click()
        })
    }

    public static validateMeasureName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=edit-measure-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue)

        })
    }

    public static exportMeasure(): void {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()
        })
    }

    public static clickVersionForCreatedMeasure(): void {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.get('[data-testid=create-version-measure-' + fileContents + ']').click()
        })
    }

    public static validateVersionNumber(expectedValue: string, versionNumber: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=measure-action-' + fileContents + ']').parent()
            element.parent().should('contain', expectedValue).children().eq(1).should('contain', versionNumber)
        })
    }

    public static clickDraftforCreatedMeasure(): void {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.get('[data-testid=draft-measure-' + fileContents + ']').click()

        })
    }
    public static measureAction(action: string, flag?: boolean, secondMeasure?: boolean): void {
        if ((flag == undefined) || (flag === null)) { flag = false }
        let filePath = 'cypress/fixtures/measureId'

        if (secondMeasure === true) {
            filePath = 'cypress/fixtures/measureId2'
        }
        switch ((action.valueOf()).toString().toLowerCase()) {
            case "edit": {
                switch ((flag.valueOf()).toString().toLowerCase()) {
                    case "false": {
                        cy.readFile(filePath).should('exist').then((fileContents) => {
                            Utilities.waitForElementVisible('[data-testid=edit-measure-' + fileContents + ']', 30000)
                            cy.get('[data-testid=edit-measure-' + fileContents + ']').should('be.visible')
                            Utilities.waitForElementEnabled('[data-testid=edit-measure-' + fileContents + ']', 30000)
                            cy.get('[data-testid=edit-measure-' + fileContents + ']').should('be.enabled')
                            cy.get('[data-testid=edit-measure-' + fileContents + ']').click()
                        })
                        break
                    }

                    case "true": {
                        cy.readFile(filePath).should('exist').then((fileContents) => {
                            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
                            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
                            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                            Utilities.waitForElementVisible('[data-testid=view-measure-' + fileContents + ']', 30000)
                            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
                            Utilities.waitForElementEnabled('[data-testid=view-measure-' + fileContents + ']', 30000)
                            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.enabled')
                            cy.get('[data-testid=view-measure-' + fileContents + ']').click()
                        })
                        break

                    }
                    default: { }
                }
                break
            }
            case 'export': {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                    cy.get('[data-testid=export-measure-' + fileContents + ']').click()
                })
                break
            }
            case 'version': {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                    cy.get('[data-testid=create-version-measure-' + fileContents + ']').click()
                })
                break
            }
            case 'draft': {
                cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                    Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
                    cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
                    cy.get('[data-testid=measure-action-' + fileContents + ']').click()
                    cy.get('[data-testid=draft-measure-' + fileContents + ']').click()

                })
                break
            }
            default: { }
        }
    }
}