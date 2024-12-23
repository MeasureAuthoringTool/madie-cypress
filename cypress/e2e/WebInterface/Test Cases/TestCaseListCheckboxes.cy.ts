import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { TestCase } from "../../../Shared/types"

const timestamp = Date.now()
let measureName = 'TestCaseCheckboxes' + timestamp
let libraryName = 'TestCaseCheckboxesLibrary' + timestamp

let measureCQL = 'library CohortEpisodeEncounter1699460161402 version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '   Global."Inpatient Encounter"'

describe('Test Case List - Basic Behavior of Checkboxes', () => {

    const testCase1: TestCase = {
        title: 'test 1',
        description: 'first case',
        group: 'pass'
    }
    const testCase2: TestCase = {
        title: 'test 2',
        description: 'second case',
        group: 'fail'
    }

    beforeEach('Create Measure, Test Cases, and Login', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libraryName, measureCQL)

        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description)
        TestCasesPage.CreateTestCaseAPI(testCase2.title, testCase2.group, testCase2.description)

        OktaLogin.Login()
    })

    afterEach('Delete Measure', () => {
        Utilities.deleteMeasure(measureName, libraryName)
    })

    it('Verify each row has a checkbox, plus the top "Select all" checkbox', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        // 1st row
        cy.get('[data-testid="test-case-row-0"]').find('input[type="checkbox"]').should('not.be.checked')

        // 2nd row
        cy.get('[data-testid="test-case-row-1"]').find('input[type="checkbox"]').should('not.be.checked')

        // header - select all
        cy.get('thead').find('input[type="checkbox"]').should('not.be.checked')
    })

    it('Checking the "Select all" checkbox marks all visible checkboxes', () => {

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get('thead').find('input[type="checkbox"]').check()

        cy.get('[data-testid="test-case-row-0"]').find('input[type="checkbox"]').should('be.checked')

        cy.get('[data-testid="test-case-row-1"]').find('input[type="checkbox"]').should('be.checked')

        cy.get('thead').find('input[type="checkbox"]').should('be.checked')
    })


})