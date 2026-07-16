import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { CreateMeasurePage, SupportedModels } from '../../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { TestCase, TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'
import { Utilities } from '../../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { CQLEditorPage } from '../../../../../Shared/CQLEditorPage'
import { Toasts } from '../../../../../Shared/Toasts'
import { QiCore4Cql } from '../../../../../Shared/FHIRMeasuresCQL'

const now = Date.now()
const measureName = 'ExecCoverageValidations' + now
const CqlLibraryName = 'ExecCoverageValidationsLib' + now
const testCase: TestCase = {
    title: 'test case title',
    description: 'DENOMFail' + now,
    group: 'SBTestSeries',
}
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQL = QiCore4Cql.reduced_CQL_Multiple_Populations

describe('Run / Execute Test case and verify passing percentage and coverage', () => {
    beforeEach('Create measure, login and update CQL, create group, and login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, { measureCql: measureCQL })
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({
            collapseEditor: true,
            successTimeout: 20700,
        })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Run / Execute single passing Test Case', () => {

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, validTestCaseJson, false)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).scrollIntoView().check({ force: true })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', "To see the logic highlights, click 'Run Test'")

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        //cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/1)')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })

    it('Run / Execute one passing and one failing Test Cases', () => {
        //Navigate to Test Cases page and add Test Case details
        TestCasesPage.createTestCase('PassingTestCase', testCase.description, testCase.group, validTestCaseJson, false)

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).scrollIntoView().check({ force: true })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', "To see the logic highlights, click 'Run Test'")

        //create a test case that will fail:

        //Navigate to Test Cases page and add Test Case details
        TestCasesPage.createTestCase('FailingTestCase', testCase.description, testCase.group, validTestCaseJson, false)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Fail')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '50%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/2)')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })

    it('Run / Execute single failing Test Cases', () => {

        TestCasesPage.createTestCase('FailingTestCase', testCase.description, testCase.group, validTestCaseJson, undefined)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '0%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(0/1)')

        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '0%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })
})
