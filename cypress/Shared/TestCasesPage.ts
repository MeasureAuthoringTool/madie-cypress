import {EditMeasurePage} from "./EditMeasurePage"

export class TestCasesPage {

    public static readonly newTestCaseButton = '[data-testid="create-new-test-case-button"] > .sc-iqseJM'
    public static readonly testCaseDescriptionTextBox = '[data-testid=create-test-case-description]'
    public static readonly testCaseSeriesTextBox = '.MuiOutlinedInput-root'
    public static readonly existingTestCaseSeriesDropdown = '#mui-2-option-0'
    public static readonly createTestCaseButton = '[data-testid=create-test-case-button]'
    public static readonly successMsg = '[data-testid="create-test-case-alert"]'
    public static readonly testCaseSeriesList = 'tbody > tr > :nth-child(3)'
    public static readonly aceEditor = '#ace-editor-wrapper > .ace_scroller > .ace_content'
    public static readonly testCaseTitle = '[data-testid=create-test-case-title]'
    public static readonly cuTestCaseButton = '[data-testid="create-test-case-button"]'
    public static readonly executeTestCaseButton = '[data-testid="execute-test-case-row"]'
    public static readonly testCaseStatus = 'tbody > tr > :nth-child(4)'
    public static readonly testCaseTitleInlineError = '[data-testid="title-helper-text"]'
    public static readonly testCaseJsonValidationErrorBtn = '[data-testid="show-json-validation-errors-button"]'
    public static readonly testCaseJsonValidationDisplayList = '[data-testid="json-validation-errors-list"] > span'
    public static readonly testCaseJsonValidationErrorList = '.CreateTestCase__ValidationErrorCard-sc-z6rmnc-6'
    public static readonly testCasePopulationList = '[data-testid="create-test-case-populations"]'

    public static clickCreateTestCaseButton() : void {

        //setup for grabbing the measure create call
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/'+ id + '/test-cases').as('testcase')

            cy.get(this.createTestCaseButton).click()

            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
        })
    }

    public static grabValidateTestCaseTitleAndSeries(testCaseTitle: string, testCaseSeries: string) : void{
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {

            cy.get('[data-testid=test-case-row-'+ fileContents +']').invoke('text').then(
                (text) => {
                expect(text).to.include(testCaseTitle)
                expect(text).to.include(testCaseSeries)
            })

        })
    }

    public static createTestCase (testCaseTitle:string, testCaseDescription:string, testCaseSeries:string, testCaseJson:string)  :void{

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(this.newTestCaseButton).should('be.visible')
        cy.get(this.newTestCaseButton).should('be.enabled')
        cy.get(this.newTestCaseButton).click()

        cy.get(this.testCasePopulationList).should('be.visible')

        cy.wait(2000)

        cy.get(this.testCaseTitle).should('be.visible')
        cy.get(this.testCaseTitle).should('be.enabled')
        cy.get(this.testCaseTitle).type(testCaseTitle, { force: true })
        cy.get(this.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(this.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(this.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(this.aceEditor).type(testCaseJson)

        this.clickCreateTestCaseButton()
        cy.get(this.successMsg).should('contain.text', 'Test case created successfully! Redirecting back to Test Cases...')

        //Verify created test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        cy.log('Test Case created successfully')
    }

    public static updateTestCase (updatedTestCaseTitle:string, updatedTestCaseDescription:string, updatedTestCaseSeries:string)  :void{
        cy.get(this.testCasePopulationList).should('be.visible')

        cy.wait(2000)
        //Edit / Update test case title
        cy.get(this.testCaseTitle).should('be.visible')
        cy.get(this.testCaseTitle).should('be.enabled')
        cy.get(this.testCaseTitle).clear()
        cy.get(this.testCaseTitle).type(updatedTestCaseTitle)
        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Save edited / updated to test case
        cy.get(this.cuTestCaseButton).click()
        cy.get(this.successMsg).should('contain.text', 'Test case updated successfully!')

        //Verify edited / updated test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(updatedTestCaseTitle, updatedTestCaseSeries)

        cy.log('Test Case updated successfully')
    }
    public static clickEditforCreatedTestCase(): void {
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').click()
        })
    }
}