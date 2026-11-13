import { CreateMeasurePage } from '../../../../../Shared/CreateMeasurePage'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { Utilities } from '../../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { TestData } from '../../../../../Shared/TestData'

const now = Date.now()
let measureName = 'TestMeasure' + now
let CqlLibraryName = 'TestLibrary' + now
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + now
let testCaseSeries = 'SBTestSeries'

describe('Test Case Execution with codes', () => {
    before('Create Measure and Test case', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)

        return cy.readFile('cypress/fixtures/CQLWithCodes.txt')
            .should('exist')
            .then((cql) => {
                return TestData.saveMeasureCql(cql)
            })
            .then((response) => {
                TestData.expectSavedMeasureCql(response)
                return cy.readFile('cypress/fixtures/JSONForCQLWithCodes.txt')
            })
            .then((fileContents) => {
                TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, fileContents)
                return OktaLogin.SessionLogin()
            })
    })

    after('Logout', () => {
        return Utilities.deleteMeasure()
    })

    it('Verify Test Case Execution for the CQL that uses codes', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        MeasureGroupPage.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Cohort')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Palliative Care in the Measurement Period')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //Navigate to Test Cases page and add Expected values
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.clickExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        TestCasesPage.openDetailsTab(TestCasesPage.editTestCaseSaveButton)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.executionContextWarning).should(
            'have.text',
            'Test case updated successfully! Timezone offsets have been added when hours are present, otherwise timezone offsets are removed or set to UTC for consistency.',
        )

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})
