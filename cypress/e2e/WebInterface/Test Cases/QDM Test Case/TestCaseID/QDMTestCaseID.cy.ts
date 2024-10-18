import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../../Shared/Header";

let singleTestCaseFile = 'patients_42BF391F-38A3-4C0F-9ECE-DCD47E9609D9_QDM_56_1712926664.json'
let testCaseTitle = 'Test Case 1'
let testCaseDescription = 'Description 1'
let testCaseSeries = 'Test Series 1'
let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')
let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()
let versionNumber = '1.0.000'
let newMeasureName = 'Updated' + measureName

describe('QDM Test Case sorting by Test Case number', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure and test case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //logout of MADiE
        OktaLogin.UILogout()

    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('QDM Test Case number and sorting behavior', () => {

        //login
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')
        //thrid click removes sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')
        //sort by case number and then edit some test case that is not at the top -- once user navigates back to the test case list page default sorting should appear
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select')
        Utilities.waitForElementVisible(TestCasesPage.testCaseAction0Btn, 5000)
        cy.get(TestCasesPage.testCaseAction0Btn).find('[class="action-button"]').should('contain.text', 'Select').wait(2500).click()
        cy.get('[class="popover-content"]').find('[class="btn-container"]').find('[aria-label="edit-test-case-Second TC - Title for Auto Test"]').contains('edit').click()
        cy.get(TestCasesPage.QDMRace).scrollIntoView().wait(2500).click()
        cy.get('[data-value="Other Race"]').click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        Utilities.waitForElementToNotExist(TestCasesPage.tcSaveSuccessMsg, 20000)
        //Navigate back to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction2N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test' + testCaseDescription2nd + todaysDate + 'Select1N/AQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

    })
    it('QDM Test Case number appears on cloned test case', () => {

        //login
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((tcId) => {
            cy.get('[data-testid=select-action-' + tcId + ']').click()
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').should('be.visible')
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').should('be.enabled')
            cy.get('[data-testid=clone-test-case-btn-' + tcId + ']').click({ force: true })
        })

        cy.get('[class="toast success"]').should('contain.text', 'Test case cloned successfully')
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('includes.text', 'Case #StatusGroupTitleDescriptionLast SavedAction3N/ASecondTC-SBTestSeriesSecond TC - Title for Auto Test')

    })

})

describe('Import Test cases onto an existing QDM measure via file and ensure test case ID / numbering appears', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure and test case
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.UILogout
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('QDM Test Case number appears on test case import', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.actionCenter('edit')

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get('[data-testid="file-drop-div"]').click()
        cy.get(TestCasesPage.filAttachDropBox).attachFile(singleTestCaseFile)

        //click on the 'Import' button on the modal window
        TestCasesPage.clickQDMImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction75N/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient' + todaysDate + 'Select74N/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select73N/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter' + todaysDate + 'Select72N/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke' + todaysDate + 'Select71N/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select70N/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...more' + todaysDate + 'Select69N/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...more' + todaysDate + 'Select68N/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select67N/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select66N/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...more' + todaysDate + 'Select')

        //test case numbers appear and first click sorts list in ascending order based on test case number / ID
        Utilities.waitForElementVisible(TestCasesPage.testCaseListTable, 5000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction75N/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient' + todaysDate + 'Select74N/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select73N/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter' + todaysDate + 'Select72N/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke' + todaysDate + 'Select71N/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select70N/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...more' + todaysDate + 'Select69N/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...more' + todaysDate + 'Select68N/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select67N/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select66N/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...more' + todaysDate + 'Select')
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnAscendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnAscendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction66N/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...more' + todaysDate + 'Select67N/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select68N/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select69N/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...more' + todaysDate + 'Select70N/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...more' + todaysDate + 'Select71N/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select72N/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke' + todaysDate + 'Select73N/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter' + todaysDate + 'Select74N/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select75N/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient' + todaysDate + 'Select')
        //second click sorts in descending order
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementVisible(TestCasesPage.tcColumnDescendingArrow, 35000)
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').find(TestCasesPage.tcColumnDescendingArrow).should('exist')
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction75N/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient' + todaysDate + 'Select74N/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select73N/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter' + todaysDate + 'Select72N/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke' + todaysDate + 'Select71N/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select70N/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...more' + todaysDate + 'Select69N/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...more' + todaysDate + 'Select68N/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select67N/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select66N/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...more' + todaysDate + 'Select')
        //thrid click removes sorting
        cy.get(TestCasesPage.tcColumnHeading).contains('Case #').click()
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnAscendingArrow, 30000)
        Utilities.waitForElementToNotExist(TestCasesPage.tcColumnDescendingArrow, 30000)
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast SavedAction75N/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient' + todaysDate + 'Select74N/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select73N/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter' + todaysDate + 'Select72N/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke' + todaysDate + 'Select71N/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more' + todaysDate + 'Select70N/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...more' + todaysDate + 'Select69N/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...more' + todaysDate + 'Select68N/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select67N/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more' + todaysDate + 'Select66N/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...more' + todaysDate + 'Select')

    })
})

describe('QDM Measure - Test case number on a Draft Measure', () => {

    beforeEach('Create Measure, Test case & Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateTestCaseAPI(testCaseSeries, testCaseTitle, testCaseDescription)
        OktaLogin.Login()
    })

    afterEach('Delete Measure and Logout', () => {

        Utilities.deleteVersionedMeasure(measureName, CqlLibraryName)
        OktaLogin.Logout()
    })

    it('Test case number assigned to a Draft Measure for QDM Measure', () => {

        //Version the Measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.versionMeasuresConfirmInput).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New version of measure is Successfully created')
        MeasuresPage.validateVersionNumber(newMeasureName, versionNumber)
        cy.log('Version Created Successfully').wait(5000)

        //Draft the Versioned Measure
        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type(newMeasureName)
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.get(MeasuresPage.VersionDraftMsgs).should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        cy.reload()

        cy.get('[data-testid="row-item"]').eq(0).contains('Edit').click()
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist').wait(500)
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle2nd.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription2nd)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries2nd).type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        //Navigate to test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        //Validate Test case ID for Draft Measure
        TestCasesPage.grabValidateTestCaseNumber(2)

    })
})

describe('QDM Test Case - Deleting all test cases resets test case counter', () => {

    beforeEach('Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Test case number resets when test case count equals 0', () => {

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('05/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        // navigate to test case tab
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // verify there are 2 test cases shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 2)

        // delete test case #1
        TestCasesPage.grabTestCaseId(1)
        TestCasesPage.testCaseAction("delete")
        cy.get(TestCasesPage.deleteTestCaseConfirmationText).should('contain.text', 'Are you sure you want to delete QDMManifestTC?')
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // verify test case #1 no longer shown, test case #2 is still shown
        cy.get(TestCasesPage.testCaseListTable).should('not.contain', 'QDMManifestTC')
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle2nd, testCaseSeries2nd)

        // delete test case #2
        TestCasesPage.grabTestCaseId(2)
        TestCasesPage.testCaseAction("delete")
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // verify no test cases associated with this measure
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 0)
        cy.get(EditMeasurePage.testCasesTab).should('contain.text', 'Test Cases (0)')

        // create new case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        // verify one test case shown
        cy.get(TestCasesPage.testCaseCountByCaseNumber).should("have.length", 1)
        cy.get(EditMeasurePage.testCasesTab).should('contain.text', 'Test Cases (1)')

        // verify test case is test case #1
        TestCasesPage.grabValidateTestCaseNumber(1)

    })

})
