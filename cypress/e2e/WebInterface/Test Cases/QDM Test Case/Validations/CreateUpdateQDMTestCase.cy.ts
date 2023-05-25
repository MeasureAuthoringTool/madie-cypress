import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.QDMTestCaseJson
let booleanPatientBasisQDM_CQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
let updatedTestCaseTitle = testCaseTitle + ' ' + 'UpdatedTestCaseTitle'
let updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'ICFTestSeries'

//Skipping until QDM Test Case feature flag is removed
describe.skip('Create and Update QDM Test Case', () => {

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'ipp')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Create and Update Test Case for QDM Measure', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('01/01/2020')
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()

        //Navigate to Details tab and Edit
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear().type(updatedTestCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear().type(updatedTestCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear().type(updatedTestCaseSeries).type('{enter}')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate back to Edit test case page and assert fields
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get('#birth-date').should('contain.value', '01/01/2020')
        cy.get(TestCasesPage.QDMRace).should('contain.text', 'White')
        cy.get(TestCasesPage.QDMGender).should('contain.text', 'Male')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('contain.value', updatedTestCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('contain.value', updatedTestCaseDescription)
    })
})

describe.skip('Attempt to update test case when non-owner', () => {

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, true, booleanPatientBasisQDM_CQL, false, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'Initial Population')
        //create test case
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson, false, true)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName, false, true)

    })

    it('QDM Test Case Demographic fields are not available / editable for non-owner', () => {
        cy.get(MeasuresPage.allMeasuresTab).click()

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).should('be.disabled')
        cy.get(TestCasesPage.QDMRace).should('not.be.enabled')
        cy.get(TestCasesPage.QDMGender).should('not.be.enabled')
    })
})
