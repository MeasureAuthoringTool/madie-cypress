import {EditMeasurePage} from "./EditMeasurePage"
import { Environment } from "./Environment"
import {Utilities} from "./Utilities"

export class TestCasesPage {

    //tabs on the test case page
    public static readonly cqlHasErrorsMsg = '[data-testid="test-case-cql-has-errors-message"]'
    public static readonly detailsTab = '[data-testid="details-tab"]'
    public static readonly tctMeasureCQLSubTab = '[data-testid="measurecql-tab"]'
    public static readonly tctExpectedActualSubTab = '[data-testid="expectoractual-tab"]'

    //CQL area on Test Case page
    public static readonly tcCQLArea = '[data-testid="test-case-cql-editor"]'

    //misc test case page objects
    public static readonly tcHighlightingTab = '[data-testid="highlighting-tab"]'
    public static readonly ippActualCheckBox = '[data-testid="test-population-initialPopulation-actual"]'
    public static readonly numActualCheckBox = '[data-testid="test-population-numerator-actual"]'
    public static readonly numExclusionActuralCheckBox = '[data-testid="test-population-numeratorExclusion-actual"]'
    public static readonly denomActualCheckBox = '[data-testid="test-population-denominator-actual"]'
    public static readonly denomExclusionActualCheckBox = '[data-testid="test-population-denominatorExclusion-actual"]'
    public static readonly newTestCaseButton = '[data-testid="create-new-test-case-button"]'
    public static readonly testCaseDescriptionTextBox = '[data-testid=test-case-description]'
    public static readonly testCaseSeriesTextBox = '[data-testid="test-case-series"] > .MuiOutlinedInput-root'
    public static readonly existingTestCaseSeriesDropdown = '#mui-6'
    public static readonly editTestCaseSaveButton = '[data-testid="edit-test-case-save-button"]'
    public static readonly tcDiscardChangesButton = '[data-testid="edit-test-case-discard-button"]'
    public static readonly confirmationMsg = '[data-testid="create-test-case-alert"]'
    public static readonly testCaseSeriesList = 'tbody > tr > :nth-child(3)'
    public static readonly aceEditor = '[data-testid="test-case-json-editor"]'
    public static readonly testCaseTitle = '[data-testid="test-case-title"]'
    public static readonly executeTestCaseButton = '[data-testid="execute-test-cases-button"]'
    public static readonly testCaseStatus = '[class="MuiBox-root css-0"]'
    public static readonly testCaseTitleInlineError = '[data-testid="title-helper-text"]'
    public static readonly testCaseJsonValidationErrorBtn = '[data-testid="show-json-validation-errors-button"]'
    public static readonly testCaseJsonValidationDisplayList = '[data-testid="json-validation-errors-list"]'
    public static readonly testCaseJsonValidationErrorList = '.EditTestCase__ValidationAlertCard-sc-m537sm-4'
    public static readonly testCasePopulationList = '[data-testid="create-test-case-populations"]'
    public static readonly testCaseExecutionError = '[data-testid="display-tests-error"]'
    public static readonly runTestButton = '[data-testid="run-test-case-button"]'
    public static readonly runTestAlertMsg = '[data-testid="calculation-info-alert"]'
    public static readonly testCalculationResults = '[data-testid=calculation-results]'
    public static readonly testCaseExpected_Actual_table_tbl = '[data-testid="create-test-case-populations"]'
    public static readonly testCalculationResultsLineTwo = '[data-testid="calculation-results"] > div > :nth-child(2)'
    public static readonly testCalculationResultsLineThree = '[data-testid="calculation-results"] > div > :nth-child(3)'
    public static readonly testCalculationResultsLineFour = '[data-testid="calculation-results"] > div > :nth-child(4)'
    public static readonly testCalculationResultsLineFive = '[data-testid="calculation-results"] > div > :nth-child(5)'
    public static readonly testCalculationResultsLineSix = '[data-testid="calculation-results"] > div > :nth-child(6)'
    public static readonly testCalculationResultsLineSeven = '[data-testid="calculation-results"] > div > :nth-child(7)'
    public static readonly testCalculationResultsLineEight = '[data-testid="calculation-results"] > div > :nth-child(8)'
    public static readonly testCalculationResultsLineNine = '[data-testid="calculation-results"] > div > :nth-child(9)'
    public static readonly testCalculationError = '[data-testid="calculation-error-alert"]'
    public static readonly testCaseListPassingPercTab = '[data-testid="passing-tab"]'
    public static readonly testCaseListCoveragePercTab = '[data-testid="coverage-tab"]'
    public static readonly testCaseListCoverageHighlighting = '[data-testid="code-coverage-highlighting"]'
    public static readonly selectTestCaseDropdownBtn = '.chevron-container > [data-testid="ExpandMoreIcon"]'
    public static readonly testCaseListTable = '[data-testid="test-case-tbl"]'

    //Test Case Population Values
    public static readonly testCaseIPPExpected = '[data-testid="test-population-initialPopulation-expected"]'
    public static readonly testCaseNUMERExpected = '[data-testid="test-population-numerator-expected"]'
    public static readonly testCaseNUMEXExpected = '[data-testid="test-population-numeratorExclusion-expected"]'
    public static readonly testCaseDENOMExpected = '[data-testid="test-population-denominator-expected"]'
    public static readonly testCaseDENEXExpected = '[data-testid="test-population-denominatorExclusion-expected"]'
    public static readonly testCaseMSRPOPLExpected = '[data-testid="test-population-measurePopulation-expected"]'
    public static readonly testCaseMSRPOPLEXExpected = '[data-testid="test-population-measurePopulationExclusion-expected"]'
    public static readonly testCasePopulationHeaderForNoMeasureGroup = '.MuiAlert-message.css-1w0ym84'
    public static readonly testCasePopulationValuesHeader = '.GroupPopulations___StyledSpan-sc-1752rtp-1'
    public static readonly testCasePopulationValuesTable = '[data-testid="test-case-population-list-tbl"]'
    public static readonly testCasePopulationValues = '.TestCasePopulationList___StyledTr-sc-iww9ze-3'
    public static readonly initialPopulationRow = '[data-testid="test-row-population-id-initialPopulation"]'
    public static readonly numeratorRow = '[data-testid="test-row-population-id-numerator"]'
    public static readonly numeratorExclusionRow = '[data-testid="test-row-population-id-numeratorExclusion"]'
    public static readonly denominatorRow = '[data-testid="test-row-population-id-denominator"]'
    public static readonly denominatorExclusionRow = '[data-testid="test-row-population-id-denominatorExclusion"]'
    public static readonly denominatorExceptionRow = '[data-testid="test-row-population-id-denominatorException"]'
    public static readonly measureObservationRow = '[data-testid="test-population-measurePopulationObservation-expected"]'
    public static readonly denominatorObservationRow = '[data-testid="test-population-denominatorObservation-expected"]'
    public static readonly numeratorObservationRow = '[data-testid="test-population-numeratorObservation-expected"]'
    public static readonly measureGroup1Label ='[data-testid="measure-group-1"]'
    public static readonly denominatorObservationExpectedRow = '[data-testid="test-population-denominatorObservation-expected"]'

    //Stratifications
    public static readonly denominatorStratificationOneExpectedValue = '[data-testid="test-population-Strata-1 Denominator-expected"]'
    public static readonly numeratorStratificationTwoExpectedValue = '[data-testid="test-population-Strata-2 Numerator-expected"]'
    public static readonly initialPopulationStratificationExpectedValue = '[data-testid="test-population-Strata-1 Initial Population-expected"]'
    public static readonly measurePopulationStratificationExpectedValue = '[data-testid="test-population-Strata-2 Measure Population-expected"]'

    //Test Case Expected/Actual Values
    public static readonly nonBooleanExpectedValueError = '[class="qpp-error-message"]'
    public static readonly measureObservationExpectedValueError = '[data-testid="measurePopulationObservation-error-helper-text"]'
    public static readonly denominatorObservationExpectedValueError = '[data-testid="denominatorObservation-error-helper-text"]'
    public static readonly numeratorObservationExpectedValueError = '[data-testid="numeratorObservation-error-helper-text"]'
    public static readonly eaMeasureGroupOneStratification = '[data-testid="measure-group-1-stratifications"]'
    public static readonly cvMeasureObservationActualValue = '[data-testid="test-population-measurePopulationObservation-actual"]'
    public static readonly denominatorMeasureObservationActualValue = '[data-testid="test-population-denominatorObservation-actual"]'
    public static readonly numeratorMeasureObservationActualValue = '[data-testid="test-population-numeratorObservation-actual"]'

    //New Test Case Modal
    public static readonly createTestCaseDialog ='[data-testid="dialog-form"]'
    public static readonly createTestCaseTitleInput ='[data-testid="create-test-case-title-input"]'
    public static readonly createTestCaseDescriptionInput ='[data-testid="create-test-case-description-input"]'
    public static readonly createTestCaseGroupInput ='[id="test-case-series"]'
    public static readonly createTestCaseSaveButton ='[data-testid="create-test-case-save-button"]'

    //Warning Modal
    public static readonly discardChangesConfirmationModal = '[id="mui-1"]'
    public static readonly discardChangesConfirmationText = '[id="discard-changes-dialog-body"]'
    public static readonly discardChangesCancelBtn = '[data-testid="discard-dialog-cancel-button"]'
    public static readonly continueDiscardChangesBtn = '[data-testid="discard-dialog-continue-button"]'

    //Delete Test Case
    public static readonly deleteTestCaseBtn = '[data-testid="delete-test-case-btn"]'
    public static readonly deleteTestCaseConfirmationText = '[class="dialog-warning-body"]'
    public static readonly deleteTestCaseContinueBtn = '[data-testid="delete-dialog-continue-button"]'


    public static clickCreateTestCaseButton() : void {

        //setup for grabbing the measure create call
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')

            cy.get(this.createTestCaseSaveButton).click()

            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
            cy.get(EditMeasurePage.testCasesTab).click()

        })
    }

    public static grabValidateTestCaseTitleAndSeries(testCaseTitle: string, testCaseSeries: string) : void{
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=test-case-row-'+ fileContents +']').should('be.visible')
            cy.get('[data-testid=test-case-row-'+ fileContents +']').invoke('text').then(
                (text) => {
                    expect(text).to.include(testCaseTitle)
                    expect(text).to.include(testCaseSeries)
                })

        })
    }

    public static createTestCase (testCaseTitle:string, testCaseDescription:string, testCaseSeries:string, testCaseJson:string)  :void{

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(this.newTestCaseButton).should('be.visible')
        cy.get(this.newTestCaseButton).should('be.enabled')
        cy.get(this.newTestCaseButton).click()

        cy.get(this.createTestCaseDialog).should('exist')
        cy.get(this.createTestCaseDialog).should('be.visible')

        cy.get(this.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(this.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(this.createTestCaseTitleInput, 20000)
        cy.get(this.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(this.createTestCaseDescriptionInput).should('exist')
        cy.get(this.createTestCaseDescriptionInput).should('be.visible')
        cy.get(this.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(this.createTestCaseDescriptionInput).focus()
        cy.get(this.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(this.createTestCaseGroupInput).should('exist')
        cy.get(this.createTestCaseGroupInput).should('be.visible')
        cy.get(this.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        this.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        cy.log('Test Case created successfully')

        this.editTestCaseAddJSON(testCaseJson)
    }

    public static editTestCaseAddJSON (testCaseJson:string)  :void{

        this.clickEditforCreatedTestCase()


        //Add json to the test case
        cy.get(this.aceEditor).type(testCaseJson)

        cy.get(this.detailsTab).click()

        //Save edited / updated to test case
        cy.get(this.editTestCaseSaveButton).click()
        cy.get(this.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'An error occurred with the Test Case JSON while updating the test case'])
        })

        cy.get(this.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'An error occurred with the Test Case JSON while updating the test case'])
        })

        cy.log('JSON added to test case successfully')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

    }

    public static updateTestCase (updatedTestCaseTitle:string, updatedTestCaseDescription:string, updatedTestCaseSeries:string)  :void{

        cy.get(this.detailsTab).click()

        //Edit / Update test case title

        cy.get(this.testCaseTitle).should('exist')
        cy.get(this.testCaseTitle).should('be.visible')
        cy.get(this.testCaseTitle).should('be.enabled')
        cy.get(this.testCaseTitle).focus()

        cy.get(this.testCaseTitle).clear()

        cy.get(this.testCaseTitle).invoke('val', '')

        cy.get(this.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //cy.get(this.testCaseTitle).clear()
        cy.get(this.testCaseTitle).type(updatedTestCaseTitle)
        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries).type('{enter}')

        //Save edited / updated to test case
        cy.get(this.editTestCaseSaveButton).click()
        cy.get(this.confirmationMsg).should('contain.text', 'Test case updated successfully!')

        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify edited / updated test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(updatedTestCaseTitle, updatedTestCaseSeries)

        cy.log('Test Case updated successfully')
    }
    public static clickEditforCreatedTestCase(): void {
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=select-action-'+ fileContents +']').click()
            cy.get('[data-testid=view-edit-test-case-'+ fileContents +']').should('be.visible')
            cy.get('[data-testid=view-edit-test-case-'+ fileContents +']').should('be.enabled')
            cy.get('[data-testid=view-edit-test-case-'+ fileContents +']').click()
        })

    }
    public static CreateTestCaseAPI(title: string, series: string, description: string, jsonValue?: string, twoTestCases?: boolean, altUser?: boolean): string {
        let user = ''
        let measurePath = ''
        let testCasePath = ''
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
        if (twoTestCases === true)
        {
            measurePath = 'cypress/fixtures/measureId2'
            testCasePath = 'cypress/fixtures/testCaseId2'
        }
        else
        {
            measurePath = 'cypress/fixtures/measureId'
            testCasePath = 'cypress/fixtures/testCaseId'
        }

        //Add Test Case to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "TEST",
                        'series': series,
                        'title': title,
                        'description': description,
                        'json': jsonValue
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.series).to.eql(series)
                    expect(response.body.title).to.eql(title)
                    expect(response.body.description).to.eql(description)
                    cy.writeFile(testCasePath, response.body.id)
                })
            })
        })
        return user
    }
}