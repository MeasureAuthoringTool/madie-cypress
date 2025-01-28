import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { TestCase } from "../../../Shared/TestCasesPage"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import {CQLEditorPage} from "../../../Shared/CQLEditorPage"
import {CQLLibraryPage} from "../../../Shared/CQLLibraryPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"

const timestamp = Date.now()
let measureName = 'TestCaseCheckboxes' + timestamp
let libraryName = 'TestCaseCheckboxesLibrary' + timestamp
let qdmMeasureCQL = MeasureCQL.QDMCQL4MAT5645
let testCaseJson = TestCaseJson.CohortEpisodeEncounter_PASS
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

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

let qiCoreMeasureCQL = 'library CohortEpisodeEncounter1699460161402 version \'0.0.000\'\n' +
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

    beforeEach('Create Measure, Test Cases, and Login', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        const pops: MeasureGroups = {
            initialPopulation: 'Initial Population',
            numerator: 'Initial Population',
            denominator: 'Initial Population'
        }

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libraryName, qiCoreMeasureCQL)
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.encounter, MeasureScoring.Proportion, pops)

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


describe('QDM - Test case list Check box Actions', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create QDM Measure, Test case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, libraryName, 'Cohort', true, qdmMeasureCQL)
        TestCasesPage.CreateQDMTestCaseAPI(testCase1.title, testCase1.group, testCase1.description)
        OktaLogin.Login()
    })

    afterEach('Delete Measure and Logout', () => {

        Utilities.deleteMeasure(measureName, libraryName)
        OktaLogin.Logout()

    })

    it('Clone QDM Test Case using Test Case List Check Box', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Select Test case and Clone
        cy.get(TestCasesPage.testCaseListCheckBox).click()
        cy.get(TestCasesPage.cloneBtn).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case cloned successfully')

    })

    it('Export QDM Test Case using Test Case List Check Box', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        //Group Creation

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

        //Update the Patient Basis to 'Yes'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Patient16To23')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Execute Test Case
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click().wait(1500)

        //Select Test case and Export
        cy.get('thead').find('input[type="checkbox"]').check()
        cy.get('[data-testid="test-case-row-0"]').find('input[type="checkbox"]').should('be.checked')
        Utilities.waitForElementEnabled(TestCasesPage.exportBtn, 60000)
        cy.get(TestCasesPage.exportBtn).click()
        cy.get('[data-testid="popover-content"]').contains('QRDA').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'QRDA exported successfully')

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QDM-v0.0.000-QDM-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')
    })
})


describe('Qi Core - Test case list Check box Actions', () => {

    const pops: MeasureGroups = {
        initialPopulation: 'Initial Population',
        numerator: 'Initial Population',
        denominator: 'Initial Population'
    }

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create Qi Core Measure, Test case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libraryName, qiCoreMeasureCQL)
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.encounter, MeasureScoring.Proportion, pops)
        TestCasesPage.CreateTestCaseAPI(testCase1.title, testCase1.group, testCase1.description, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Delete Measure and Logout', () => {

        Utilities.deleteMeasure(measureName, libraryName)
        OktaLogin.Logout()

    })

    it('Clone Qi Core Test Case using Test Case List Check Box', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Select Test case and Clone
        cy.get(TestCasesPage.testCaseListCheckBox).click()
        cy.get(TestCasesPage.cloneBtn).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case cloned successfully')

    })

    it('Export Qi Core Test Case using Test Case List Check Box', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Execute Test Case
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click().wait(1500)

        //Select Test case and Export
        cy.get('thead').find('input[type="checkbox"]').check()
        cy.get('[data-testid="test-case-row-0"]').find('input[type="checkbox"]').should('be.checked')
        Utilities.waitForElementEnabled(TestCasesPage.exportBtn, 60000)
        cy.get(TestCasesPage.exportBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.exportTransactionTypeOption, 35000)
        cy.get(TestCasesPage.exportTransactionTypeOption).scrollIntoView().click({ force: true })

        //verify that the export occurred
        cy.readFile(path.join(downloadsFolder, 'eCQMTitle4QICore-v0.0.000-FHIR4-TestCases.zip')).should('exist')
        cy.log('Successfully verified zip file export')
    })
})