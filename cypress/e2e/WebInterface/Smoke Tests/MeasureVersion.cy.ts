import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
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
let qdmCMSMeasureCQL = 'library CMS1192 version \'1.1.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Global\n' +
    'include SDOH version \'3.0.000\' called SDOH\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Patient Expired": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.309\'\n' +
    'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer Type"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    '\n' +
    'define "Qualifying Encounters":\n' +
    '  SDOH."Qualifying Encounters"\n' +
    '\n' +
    'define "Encounter without Food Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Food Insecurity Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Food Insecurity Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Housing Instability Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Housing Instability Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Housing Instability Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Interpersonal Safety Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Interpersonal Safety Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Interpersonal Safety Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Transportation Needs Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Transportation Needs Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Transportation Needs Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Encounter without Utility Difficulties Screening":\n' +
    '  SDOH."Qualifying Encounters" encounter\n' +
    '    without SDOH."Utility Difficulties Screening" screening\n' +
    '      such that Global.NormalizeInterval ( screening.relevantDatetime, screening.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '    without SDOH."Utility Difficulties Screening Not Done" screeningNotDone\n' +
    '      such that Global.NormalizeInterval ( screeningNotDone.relevantDatetime, screeningNotDone.relevantPeriod ) starts during day of Global.HospitalizationWithObservation ( encounter )\n' +
    '\n' +
    'define "Denominator Exclusions":\n' +
    '  SDOH."Qualifying Encounters" QualifyingEncounter\n' +
    '    where QualifyingEncounter.dischargeDisposition in "Patient Expired"'

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

        //Commenting until 'MeasureListButtons' feature flag is removed
        //MeasuresPage.actionCenter('version')

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        //MeasuresPage.validateVersionNumber(measureName, versionNumber)
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
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.be.enabled')

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

        //Commenting until 'MeasureListButtons' feature flag is removed
        //MeasuresPage.actionCenter('version')

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        //MeasuresPage.validateVersionNumber(measureName, versionNumber)
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
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.be.enabled')

    })
})

describe('QI-Core Measure Versioning', () => {

    newMeasureName = measureName + randValue + 3
    newCQLLibraryName = cqlLibraryName + randValue + 3

    before('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCQLLibraryName, QiCoreMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QiCoreTestCaseJson)
        OktaLogin.Login()
    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteVersionedMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Add Major Version to the Qi-Core Measure and verify that the versioned Measure is in read only', () => {

        //Commenting until 'MeasureListButtons' feature flag is removed
        //MeasuresPage.actionCenter('version')

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('.MuiDialogContent-root').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        //MeasuresPage.validateVersionNumber(measureName, versionNumber)
        cy.log('Version Created Successfully')

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
        cy.get(TestCasesPage.runTestButton).should('not.be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('not.exist')

        //Verify that the Delete Measure button is disabled
        cy.get(EditMeasurePage.deleteMeasureButton).should('not.be.enabled')

    })
})
