import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { CreateMeasurePage } from '../../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { Utilities } from '../../../../../Shared/Utilities'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'
import { CQLEditorPage } from '../../../../../Shared/CQLEditorPage'
import { QiCore4Cql } from '../../../../../Shared/FHIRMeasuresCQL'

const measureName = 'PCCTCList' + Date.now()
const CqlLibraryName = 'PCCTCListLib' + Date.now()
const testCaseTitle = 'Title for Auto Test'
const secondTestCaseTitle = 'Second Test case'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQL = QiCore4Cql.reduced_CQL_Multiple_Populations
const multipleGroupTestTitle = 'Verify Measure highlighting for multiple Measure groups on test case list page'

const makeTestCaseExecutable = (secondTestCase = false): void => {
    TestCasesPage.clickEditforCreatedTestCase(secondTestCase)
    TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
    TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)
    TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseDENOMExpected)
    TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseNUMERExpected)

    cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled').click()
    Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 15000)
    TestCasesPage.openTestCasesTab(TestCasesPage.testCaseListPassingPercTab)
}

describe('Code Coverage Highlighting', () => {
    beforeEach('Create Measure', function () {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Initial Population',
            '',
            'Initial Population',
            'Boolean'
        )

        if (this.currentTest?.title === multipleGroupTestTitle) {
            MeasureGroupPage.CreateProportionMeasureGroupAPI(
                0,
                false,
                'Initial PopulationOne',
                '',
                '',
                'Initial PopulationOne',
                '',
                'Initial PopulationOne',
                'Boolean',
                1
            )
        }

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        TestCasesPage.CreateTestCaseAPI(
            secondTestCaseTitle,
            testCaseSeries,
            testCaseDescription,
            validTestCaseJson,
            false,
            true
        )

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout', () => {
        Utilities.deleteMeasure()
    })

    it('Validate Passing and Code Coverage tabs contain the initial "-" value, and displays a percentage when Test Case is ran', () => {
        //navigate to the test case list page
        TestCasesPage.openTestCasesTab(TestCasesPage.testCaseListPassingPercTab)

        //verify initial "-" value, appears in the passing and code coverage tabs
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '-')

        makeTestCaseExecutable()
        makeTestCaseExecutable(true)

        //click the Execute Test Cases button
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('not.contain.text', '-')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()
        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should(
            'contain.text',
            '\ndefine "Initial Population":\n   true\n'
        )
    })

    it(multipleGroupTestTitle, () => {
        makeTestCaseExecutable()
        makeTestCaseExecutable(true)

        //Navigate to Test Cases page and add Test Case details
        TestCasesPage.openTestCasesTab(TestCasesPage.executeTestCaseButton)

        cy.get(TestCasesPage.leftNavMenuList).should('contain', 'Population Criteria 1')
        cy.get(TestCasesPage.leftNavMenuList).should('contain', 'Population Criteria 2')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100% Coverage')

        //Verify Highlighting for first Measure group
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should(
            'contain.text',
            '\ndefine "Initial Population":\n   true\n'
        )

        //Verify Highlighting for second Measure group
        cy.get(TestCasesPage.leftNavMenuList).contains('Population Criteria 2').click()

        //verify percentage number appears in tabs heading
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100% Coverage')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

        cy.get(TestCasesPage.testCaseListCoverageHighlighting).should(
            'not.contain.text',
            '\ndefine "Initial Population":\n   true\n'
        )
    })
})
