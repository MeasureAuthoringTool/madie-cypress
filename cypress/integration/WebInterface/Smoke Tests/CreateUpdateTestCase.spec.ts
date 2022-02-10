import {OktaLogin} from "../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Ratio'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let updatedTestCaseTitle = testCaseTitle + "some update"
let updatedTestCaseDescription = testCaseDescription + ' '+ 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'CMSTestSeries'
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
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })

    it('Edit and update test case', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //click tab to get to test cases
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit / update Test Case
        TestCasesPage.updateTestCase(updatedTestCaseTitle, updatedTestCaseDescription, updatedTestCaseSeries)
    })
})