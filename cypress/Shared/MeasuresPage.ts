import {Utilities} from "../Shared/Utilities"


export class MeasuresPage {

    public static readonly measureListTitles = '[data-testid=table-body] > :nth-child(1)'
    public static readonly allMeasuresTab = '[data-testid=all-measures-tab]'
    public static readonly searchInputBox = '[data-testid="searchMeasure-input"]'
    public static readonly viewMeasureButton = '.action'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'


    public static clickEditforCreatedMeasure(secondMeasure?: boolean): void {
        let filePath = 'cypress/fixtures/measureId'

        if (secondMeasure === true)
        {
            filePath = 'cypress/fixtures/measureId2'
        }

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=edit-measure-'+ fileContents +']', 6000)
            cy.get('[data-testid=edit-measure-'+ fileContents +']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=edit-measure-'+ fileContents +']', 6000)
            cy.get('[data-testid=edit-measure-'+ fileContents +']').should('be.enabled')
            cy.get('[data-testid=edit-measure-'+ fileContents +']').click()
        })
    }

    public static validateMeasureName(expectedValue: string): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {

            let element = cy.get('[data-testid=edit-measure-'+ fileContents +']').parent()
            element.parent().should('contain', expectedValue)

        })
    }
}