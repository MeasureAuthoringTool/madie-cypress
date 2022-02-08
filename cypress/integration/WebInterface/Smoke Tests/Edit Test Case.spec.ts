import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {LandingPage} from "../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseJson = '{ \n' + 'Encounter: "Office Visit union" \n' + 'Id: "Identifier" \n' + 'value: "Visit out of hours (procedure)" \n' + '}'

describe('Create Test Case', () => {
    beforeEach('Login', () => {
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        OktaLogin.Logout()
    })

    it('Create measure, Edit Measure and Create Test Case', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName, CqlLibraryName, measureScoring)

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases Page and create Test Case
<<<<<<< Updated upstream:cypress/integration/WebInterface/Smoke Tests/Edit Test Case.spec.ts
        TestCasesPage.createTestCase(testCaseDescription, testCaseJson)

        //Click on Edit Test Case Button
        cy.get(TestCasesPage.listOfTestCases).contains(testCaseDescription)
        cy.get(TestCasesPage.editTestCase).click()

        //Verify the json saved on Test Cases page
        cy.get(TestCasesPage.aceEditor).should('not.be.empty')

        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear().type('UpdatedTestCaseDescription')
        cy.get(TestCasesPage.updateTestCaseButton).click()

        //Verify the updated test case description on Test Cases page
        cy.get(TestCasesPage.listOfTestCases).contains('UpdatedTestCaseDescription')
        cy.log('Test Case description updated successfully')
=======
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseJson)

        // Navigate to home page
        cy.get(LandingPage.madieLogo).click()

    })
    it('Edit and update test case', () => {

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit / update Test Case
        TestCasesPage.updateTestCase(testCaseTitle, testCaseDescription, testCaseJson)
>>>>>>> Stashed changes:cypress/integration/WebInterface/Smoke Tests/CreateUpdateTestCase.spec.ts

        // Navigate to home page
        cy.get(LandingPage.madieLogo).click()

    })
})