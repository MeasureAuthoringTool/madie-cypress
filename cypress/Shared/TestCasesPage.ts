import {EditMeasurePage} from "./EditMeasurePage"

export class TestCasesPage {

    public static readonly newTestCaseButton = '[data-testid="create-new-test-case-button"] > .sc-iqseJM'
    public static readonly testCaseDescriptionTextBox = '[data-testid=create-test-case-description]'
    public static readonly testCaseSeriesTextBox = '.MuiOutlinedInput-root'
    public static readonly existingTestCaseSeriesDropdown = '#mui-2-option-0'
    public static readonly createTestCaseButton = '[data-testid=create-test-case-button]'
    public static readonly successMsg = '[data-testid=create-test-case-alert]'
    public static readonly testCaseTitleList = 'tbody > tr > :nth-child(2)'
    public static readonly testCaseSeriesList = 'tbody > tr > :nth-child(3)'
    public static readonly aceEditor = '#ace-editor-wrapper > .ace_scroller > .ace_content'
    public static readonly editTestCase = '[class="TestCaseList__Button-sc-1iefzo5-2 cIVwpR"]'
    public static readonly testCaseTitle = '[data-testid=create-test-case-title]'
    public static readonly cuTestCaseButton = '[data-testid="create-test-case-button"]'
    public static readonly executeTestCaseButton = '[data-testid="execute-test-case-row"]'
    public static readonly testCaseStatus = 'tbody > tr > :nth-child(4)'
    public static readonly testCaseTitleInlineError = '[data-testid="title-helper-text"]'

    public static clickCreateTestCaseButton() : void {

        //setup for grabbing the measure create call
        cy.readFile('cypress/downloads/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/'+ id + '/test-cases').as('testcase')

            cy.get(this.createTestCaseButton).click()

            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/downloads/testCaseId', response.body.id)
            })
        })
    }

    public static createTestCase (testCaseTitle:string, testCaseDescription:string, testCaseSeries:string, testCaseJson:string)  :void{

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(this.newTestCaseButton).click()
        cy.get(this.testCaseTitle).type(testCaseTitle)
        cy.get(this.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(this.testCaseSeriesTextBox).type(testCaseSeries)
        cy.get(this.existingTestCaseSeriesDropdown).click()

        //Add json to the test case
        cy.get(this.aceEditor).type(testCaseJson)

        this.clickCreateTestCaseButton()
        cy.get(this.successMsg).should('contain.text', 'Test case saved successfully!')

        //Verify created test case Title and Series exists on Test Cases Page
        cy.readFile('cypress/downloads/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').should('be.visible')
        })
        cy.get(this.testCaseTitleList).contains(testCaseTitle)
        cy.get(this.testCaseSeriesList).contains(testCaseSeries)

        cy.log('Test Case created successfully')
    }

    public static updateTestCase (updatedTestCaseTitle:string, updatedTestCaseDescription:string, updatedTestCaseSeries)  :void{

        //Edit / Update test case title
        cy.get(this.testCaseTitle).clear().type(updatedTestCaseTitle)
        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear().type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear().type(updatedTestCaseSeries)
        cy.get(TestCasesPage.existingTestCaseSeriesDropdown).click()

        //Save edited / updated to test case
        cy.get(this.cuTestCaseButton).click({force:true})
        cy.get(this.successMsg).should('contain.text', 'Test case updated successfully!')

        //Verify edited / updated test case Title and Series exists on Test Cases Page
        cy.get(this.testCaseTitleList).contains(updatedTestCaseTitle)
        cy.get(this.testCaseSeriesList).contains(updatedTestCaseSeries)

        cy.log('Test Case updated successfully')
    }
    public static clickEditforCreatedTestCase(): void {
        cy.readFile('cypress/downloads/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=edit-test-case-'+ fileContents +']').click()
        })
    }
}