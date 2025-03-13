import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"

let measureName = 'TestMeasure' + Date.now()
let cqlLibraryName = 'TestCql' + Date.now()
let newMeasureName = ''
let newCQLLibraryName = ''
let randValue = (Math.floor((Math.random() * 1000) + 1))
let QDMMeasureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL
let testCaseTitle = 'TestcaseTitle'
let testCaseDescription = 'Description' + Date.now()
let testCaseSeries = 'SBTestSeries'
let QiCoreMeasureCQL = MeasureCQL.SBTEST_CQL
let QiCoreTestCaseJson = TestCaseJson.CohortEpisodeEncounter_PASS
let qdmCMSMeasureCQL = MeasureCQL.QDM_CQL_withLargeIncludedLibrary

describe('QDM Measure Versioning', () => {

    newMeasureName = measureName + randValue + 1
    newCQLLibraryName = cqlLibraryName + randValue + 1

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', true, QDMMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
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
        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Add Major Version to the QDM Measure and verify that the versioned Measure is in read only', () => {

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        Utilities.waitForElementVisible('.MuiDialogContent-root', 50000)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Major Version Created Successfully')

        //Verify that the fields on Measure details page, CQL Editor page and Test case page are read only
        MeasuresPage.actionCenter('edit')

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
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).should('not.exist')

    })
})

describe('QDM Measure Version for CMS Measure with huge included Library', () => {

    newMeasureName = measureName + randValue + 2
    newCQLLibraryName = cqlLibraryName + randValue + 2

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Cohort', false, qdmCMSMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Qualifying Encounters')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Logout and delete Measure', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)
    })

    it('Add Major Version to the QDM Measure and verify that the versioned Measure is in read only', () => {

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        Utilities.waitForElementVisible('.MuiDialogContent-root', 50000)

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Major Version Created Successfully')

        //Verify that the fields on Measure details page, CQL Editor page and Test case page are read only
        MeasuresPage.actionCenter('edit')

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
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).should('not.exist')

    })
})

describe('QI-Core Measure Versioning', () => {

    newMeasureName = measureName + randValue + 3
    newCQLLibraryName = cqlLibraryName + randValue + 3

    const populations: MeasureGroups = {
        initialPopulation: 'ipp',
        denominator: 'denom',
        numerator: 'num'
    }

    before('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, QiCoreMeasureCQL)
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.boolean, MeasureScoring.Proportion, populations)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QiCoreTestCaseJson)
        OktaLogin.Login()
    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)

    })

    //Skipping until MAT-8409 is fixed
    it.skip('Add Major Version to the Qi-Core Measure and verify that the versioned Measure is in read only', () => {

        MeasuresPage.actionCenter('version')
        Utilities.waitForElementVisible(MeasuresPage.measureVersionTypeDropdown, 50000)
        cy.get(MeasuresPage.measureVersionTypeDropdown).should('be.visible')
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        Utilities.waitForElementVisible(MeasuresPage.measureVersionMajor, 50000)
        cy.get(MeasuresPage.measureVersionMajor).should('be.visible')
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 50000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).should('be.visible')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber('1.0.000')
        cy.log('Major Version Created Successfully')

        //Verify that the fields on Measure details page, CQL Editor page and Test case page are read only
        MeasuresPage.actionCenter('edit')

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
        Utilities.waitForElementEnabled(TestCasesPage.runTestButton, 50000)
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.exist')

        //Verify that the Delete Measure button is disabled
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).should('not.exist')

    })
})
