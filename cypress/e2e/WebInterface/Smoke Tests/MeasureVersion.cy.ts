import {MeasureCQL} from "../../../Shared/MeasureCQL"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../Shared/CQLEditorPage"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let newMeasureName = ''
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let QDMMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
let versionNumber = '1.0.000'
let testCaseTitle = 'TestcaseTitle'
let testCaseDescription = 'Description' + Date.now()
let testCaseSeries = 'SBTestSeries'
let QiCoreMeasureCQL = MeasureCQL.SBTEST_CQL
let QiCoreTestCaseJson = TestCaseJson.CohortEpisodeEncounter_PASS

describe('QDM Measure Versioning', () => {

    newMeasureName = measureName + randValue + 1
    newCQLLibraryName = cqlLibraryName + randValue + 1

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, cqlLibraryName, 'Cohort', true, QDMMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Logout and delete Measure', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)

    })

    it('Add Major Version to the QDM Measure and verify that the versioned Measure is in read only', () => {

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureName, versionNumber)
        cy.log('Major Version Created Successfully')

        //Verify that the fields on Measure details page, CQL Editor page and Test case page are read only
        MeasuresPage.measureAction('edit')

        //Navigate to Measure details page
        cy.get(EditMeasurePage.measureNameTextBox).should('not.be.enabled')
        cy.get(EditMeasurePage.cqlLibraryNameTextBox).should('not.be.enabled')

        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).should('not.be.enabled')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).should('not.be.enabled')

        //Navigate to CQL Editor page
        CQLEditorPage.clickCQLEditorTab()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('not.be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('not.exist')

        //Navigate to Population Criteria page
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.qdmPatientBasis).should('not.be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).should('not.be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('not.be.enabled')

        //Verify that the Delete Measure button is disabled
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.be.enabled')

    })
})

describe('QI-Core Measure Versioning', () => {

    newMeasureName = measureName + randValue + 2
    newCQLLibraryName = cqlLibraryName + randValue + 2

    before('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, QiCoreMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QiCoreTestCaseJson)
        OktaLogin.Login()
    })

    after('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)

    })

    it('Add Major Version to the Qi-Core Measure and verify that the versioned Measure is in read only', () => {

        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(measureName, versionNumber)
        cy.log('Version Created Successfully')

        //Verify that the fields on Measure details page, CQL Editor page and Test case page are read only
        MeasuresPage.measureAction('edit')

        //Navigate to Measure details page
        cy.get(EditMeasurePage.measureNameTextBox).should('not.be.enabled')
        cy.get(EditMeasurePage.cqlLibraryNameTextBox).should('not.be.enabled')

        cy.get(EditMeasurePage.leftPanelModelAndMeasurementPeriod).click()
        cy.get(CreateMeasurePage.measurementPeriodStartDate).should('not.be.enabled')
        cy.get(CreateMeasurePage.measurementPeriodEndDate).should('not.be.enabled')

        //Navigate to CQL Editor page
        CQLEditorPage.clickCQLEditorTab()
        cy.get(EditMeasurePage.cqlEditorTextBox).should('not.be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('not.exist')

        //Navigate to Population Criteria page
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.popBasis).should('not.be.enabled')
        cy.get(MeasureGroupPage.measureScoringSelect).should('not.be.enabled')
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).should('not.be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('not.exist')

        //Navigate to Test cases page
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.aceEditor).should('not.be.enabled')
        //Navigate to Details tab
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('not.be.enabled')
        cy.get(TestCasesPage.runTestButton).should('not.be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.exist')

        //Verify that the Delete Measure button is disabled
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.be.enabled')

    })
})
