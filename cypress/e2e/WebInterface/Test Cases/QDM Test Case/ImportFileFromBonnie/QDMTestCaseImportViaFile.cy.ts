import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let singleTestCaseFile = 'patients_42BF391F-38A3-4C0F-9ECE-DCD47E9609D9_QDM_56_1712926664.json'
let testCaseWInvalidGroup = 'TestingWithGroupInvalidCharacters.json'
let testCaseWInvalidTitle = 'TestingWithTitleInvalidCharacters.json'
let genericTextFile = 'GenericCQLBoolean.txt'
let measureCQLPFTests = MeasureCQL.simpleQDM_CQL

describe('Import Test cases onto an existing QDM measure via file', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Import new test case onto an existing measure', () => {
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
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'StatusGroupTitleDescriptionLast SavedActionN/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient09/26/2024SelectN/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more09/26/2024SelectN/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter09/26/2024SelectN/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke09/26/2024SelectN/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more09/26/2024SelectN/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...more09/26/2024SelectN/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...more09/26/2024SelectN/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more09/26/2024SelectN/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more09/26/2024SelectN/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...more09/26/2024SelectN/ADENOMPassPrinDxIschemicStkPatient turns 18 day before admission with Non-Elective Inpatient Encounter ends during MP with principal diagnosis of s...more09/26/2024SelectN/AIPPassLOS119daysPatient is 18 with Non-Elective Inpatient Encounter (LOS 119 days) with principal diagnosis of ischemic stroke ends duri...more09/26/2024SelectN/AIPPassIPEncDuringMPExpiresAfterIPEncPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more09/26/2024SelectN/ANUMERFailCustom CodePatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more09/26/2024SelectN/ANUMERPassAntithromboticTMeqIPDischargeTMPatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...more09/26/2024SelectN/ADENEXCEPFailAntiThrpNotgivenDischargePatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke  and d...more09/26/2024SelectN/ADENEXCEPPassMedRsnStartTmEQEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...more09/26/2024SelectN/ADENEXCEPPassMedRsnStartTmEQEncInpDischTmPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...more09/26/2024SelectN/ADENEXCEPPassPatRefDuringEncIpPatient does not get antithrombotic medication due to patient refusal during IP encounter. This case tests the timing bo...more09/26/2024SelectN/ADENEXCEPPassMedRsnDuringEncIpPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...more09/26/2024SelectN/ANUMERPassAntithromboticTMeqIPAdmTM Patient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...more09/26/2024SelectN/ADENEXCEPPassMedRsnDuringEncIpTestOccurrPatient does not get antithrombotic medication due to medical reasons after IP encounter. Testing multiple IP encounters...more09/26/2024SelectN/ADENEXPass CMOdurDiffEDTestOccurPatient receives CMO during a different ED encounter.  Testing multiple  Encounter.09/26/2024SelectN/AIPPassNonEleInpEncx2Patient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP contains ...more09/26/2024SelectN/ADENEXCEPPassMedDscPatRsnDTimeEQEncStartTimePatient does not get antithrombotic medication due to patient refusal during IP encounter. This case tests the timing bo...more09/26/2024SelectN/ADENEXCEPPassMedDscPatRsnDTimeEQEncStopTimePatient does not get antithrombotic medication due to patient refusal during IP encounter. This case tests the timing bo...more09/26/2024SelectN/AIPFailPrinDxIsHemoPatient is 18 with Encounter Inpatient (LOS 120 days) with principal diagnosis of hemorrhagic stroke.09/26/2024SelectN/ADENEXCEPFailMedRsnStartTmGTEncInpDischTmPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...more09/26/2024SelectN/AIPPassageeq18Patient is  18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends dur...more09/26/2024SelectN/AIPFailBadDefSTKEQRank2Patient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no principal diagnosis of stroke,...more09/26/2024SelectN/AIPFailBadDefNoneSTKPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no principal diagnosis of stroke09/26/2024SelectN/AIPFailAllSTKEncounterFailAllNoSTKPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no diagnosis of stroke09/26/2024SelectN/ADENEXPassCMPdurEncNoEDNoObsBFEncPatient receives CMP during inpatient encounter. No ED. No Observation. Testing day of operator with HospitalizationWith...more09/26/2024SelectN/ADENEXPassCMOdurObsNoEDObsLT1hrBFEncPatient receives CMO during observation. No ED. Obs ends 1 min before inpatient encounter start. Testing day of operator...more09/26/2024SelectN/ADENEXPassCMOdurObsEDLT1hrObsLT1hrBFEncPatient receives comfort measures order during ED visit that ends <= 1 hour before IP Encounter09/26/2024SelectN/ADENEXPassCMOdurEncNoEDNoObsBFEncdateTimePatient receives CMO during inpatient encounter. No ED. No Observation. Testing day of operator with HospitalizationWith...more09/26/2024SelectN/ADENEXPassCMOdurEncNoEDNoObsBFEncRelePerPatient receives CMO during inpatient encounter. No ED. No Observation. Testing day of operator with HospitalizationWith...more09/26/2024SelectN/ADENEXPassCMOdurEncEDLT1hrObsLT1hrBFEncPatient receives CMO during inpatient encounter. ED ends 1 minute before observation. Obs ends 1 min before inpatient en...more09/26/2024SelectN/ADENEXPassCMOdurEncEDLT1hrNoObsBFEncPatient receives CMO during inpatient encounter. ED ends 1 minute before inpatient encounter start. No Observation. Test...more09/26/2024SelectN/ADENEXPassCMOdurEncEDGT1hrObsGT1hrBFEncPatient receives CMO during inpatient encounter. ED ends 61 minute before observation. Obs ends 61 min before inpatient ...more09/26/2024SelectN/ADENEXPassCMOdurEncEDGT1hrNoObsBFEncPatient receives CMO during inpatient encounter. ED ends 61 minutes before inpatient encounter start. No Observation. Te...more09/26/2024SelectN/ADENEXPassCMOdurEncEDEQ1hrObsEQ1hrBFEncPatient receives CMO during inpatient encounter. ED ends 60 minutes before observation. Obs ends 60 min before inpatient...more09/26/2024SelectN/ADENEXPassCMOdurEncTMEDEndTMEQObsTMObsEndTMEQEncTMPatient receives CMO on IP start. ED ends on OBS start and OBS ends on IP start. Testing day of operator with Hospitaliz...more09/26/2024SelectN/ADENEXPassCMOdurEDEDLT1hrObsLT1hrBFEncPatient receives CMO during ED. ED ends 1 minute before Observation. Obs ends 1 min before IP start. Testing day of oper...more09/26/2024SelectN/ADENEXPassCMOdurEDEDLT1hrNoObsBFEncPatient receives CMO during ED. ED ends 1 minute before inpatient encounter start. No Observation. Testing day of operat...more09/26/2024SelectN/ADENEXPassCMOdurEDEDEQ1hrObsEQ1hrBFEncPatient receives CMO during ED. ED ends 60 minute before Observation. Obs ends 60 min before IP start. Testing day of op...more09/26/2024SelectN/ADENEXPassCMOdurEDEDEQ1hrNoObsBFEncPatient receives CMO during ED. ED ends 60 minute before inpatient encounter start. No Observation. Testing day of opera...more09/26/2024SelectN/ADENEXPass CMOdurObsEDb41hrObsEQ1hrBFEncPatient receives CMO during observation.ED ends 1 min before Obs. Obs ends 60 min before inpatient encounter start. Test...more09/26/2024SelectN/ADENEXPass CMOdurEncNoEDObsLT1hrBFEncPatient receives CMO during inpatient encounter. No ED.  Observation ends 1 min before IP start. Testing day of operator...more09/26/2024SelectN/ADENEXPass CMOdurEncEDEQ1hrNoObsBFEncPatient receives CMO during inpatient encounter. ED ends 60 minutes before inpatient encounter start. No Observation. Te...more09/26/2024SelectN/ADENEXFailIschSTKwDischgDisposionFailAllPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more09/26/2024SelectN/ADENEXFailDenomExclusionsFailAllPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more09/26/2024SelectN/ADENEXFailCMOdurObsEDLT1hrObsGT1hrBFEncPatient receives CMO during observation. ED ends 1 minute before observation. Obs ends 61 min before inpatient encounter...more09/26/2024SelectN/ADENEXFailCMOdurObsEDGT1hrObsGT1hrBFEncPatient receives CMO during observation. ED ends 61 minute before observation. Obs ends 61 min before inpatient encounte...more09/26/2024SelectN/ADENEXFailCMOdurEDEDLT1hrObsGT1hrBFEncPatient receives CMO during ED. ED ends 1 minute before Obs. Obs ends 61 min before inpatient encounter start.  Testing ...more09/26/2024SelectN/ADENEXFailCMOdurEDEDGT1hrObsLT1hrBFEncPatient receives CMO during ED. ED ends 61 minute before obs. Obs ends 1 min before inpatient encounter start.Testing da...more09/26/2024SelectN/ADENEXFailCMOdurEDEDGT1hrObsGT1hrBFEncPatient receives CMO during ED. ED ends 61 minute before Obs. Obs ends 61 min before inpatient encounter start. Testing ...more09/26/2024SelectN/ADENEXFailCMOBFEncNoEDNoObsBFEncPatient receives CMO before inpatient encounter. No ED. No Obs. Testing HospitalizationWithObservation Function.09/26/2024SelectN/ADENEXFail CMOdurEDEDGT1hrNoObsBFEncPatient receives CMO during ED. ED ends 61 minute before inpatient encounter start. No Observation. Testing day of opera...more09/26/2024SelectN/ADENEXCEPPassPharmContraDurEncStartNoEDNoObsBFEncPatient receives Ticagrelor during inpatient encounter. No ED. No Observation. Testing medication data type for Hospital...more09/26/2024SelectN/ADENEXCEPFailPharmContraBeforeEncStartNoEDNoObsBFEncPatient receives Ticagrelor before inpatient encounter. No ED. No Observation. Testing medication data type for Hospital...more09/26/2024SelectN/ADENEXCEPFailPharmContraAfterEncEndNoEDNoObsBFEncPatient receives Ticagrelor after inpatient encounter. No ED. No Observation. Testing medication data type for Hospitali...more09/26/2024SelectN/ADENEXCEPFailNoPharmContraDurEncStartNoEDNoObsBFEncPatient receives Ticagrelor during inpatient encounter but that is now acceptable antithrombotic therapy. No ED. No Obse...more09/26/2024SelectN/ANUMERPassAntithromboticDuringIPTestOccurPatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...more09/26/2024SelectN/ANUMERPass3Enc2WithAntithrombotic1WithExcep1ExcluPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...more09/26/2024SelectN/ANUMERPass2Enc3WithAntithromboticPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...more09/26/2024SelectN/ANUMERPass3Enc2WithAntithrombotic2WithExcepPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...more09/26/2024SelectN/ANUMERPassDENEXCEPPASS3Enc2WithAntithrombotic1WithExcepPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...more09/26/2024SelectN/AIPPassPrincDxIsIschemicStkPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...more09/26/2024SelectN/AIPFailNoPrincDxPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no principal diagnosis of stroke09/26/2024SelectN/AIPFailEncEndsAfterMPPatient is 18 with Non-Elective Inpatient Encounter ends after MP with principal diagnosis of stroke09/26/2024SelectN/ANUMERPassAntithromboticDuringIPPatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...more09/26/2024SelectN/ADENEXPassDischargeACFPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...more09/26/2024Select')



    })

    it('Verify error message when a Text file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //Attach Text file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(genericTextFile)

        //error in import modal window
        cy.get('[class="toast danger"]').should('contain.text', 'An error occurred while validating the import file. Please try again or reach out to the Help Desk.')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })

    it('Verify error message when an invalid / empty Json file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //Upload invalid Json file
        cy.get(TestCasesPage.filAttachDropBox).attachFile('example.json')

        //message in import modal window about the file being empty
        cy.get('[class="toast danger"]').should('contain.text', 'No patients were found in the selected import file!')

        //import button becomes unavailable
        cy.get(TestCasesPage.importTestCaseModalBtn).should('be.disabled')
    })
})

describe('Import Test cases onto an existing QDM measure via file -- Message that appears when invalid characters are using in the Title or Group', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'TestLibrary2' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })


    it('Import new test case onto an existing measure -- when group has special characters', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.actionCenter('edit')

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(testCaseWInvalidGroup)

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalHeader).should('contain.text', 'TestingWithGroupInvalidCharacters.json')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('POST', '/api/measures/' + measureID + '/test-cases/list').as('testCaseList')
            //click import button on modal window
            cy.get(TestCasesPage.importTestCaseModalBtn).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(TestCasesPage.importInProgress).should('be.visible')
            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 50000)
        })
        Utilities.waitForElementVisible(TestCasesPage.importWarningMessages, 30000)
        cy.get(TestCasesPage.importWarningMessages).should('include.text', '(0) test case(s) were imported. The following (1) test case(s) could not be imported. Please ensure that your formatting is correct and try again.')
        cy.get(TestCasesPage.importWarningMessages).should('include.text', ' Reason: Test Cases Group or Title cannot contain special characters.')
    })

    it('Import new test case onto an existing measure -- when title has special characters', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //click on created measure
        MeasuresPage.actionCenter('edit')

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(testCaseWInvalidTitle)

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalHeader).should('contain.text', 'TestingWithTitleInvalidCharacters.json')

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('POST', '/api/measures/' + measureID + '/test-cases/list').as('testCaseList')
            //click import button on modal window
            cy.get(TestCasesPage.importTestCaseModalBtn).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(TestCasesPage.importInProgress).should('be.visible')
            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 50000)
        })
        Utilities.waitForElementVisible(TestCasesPage.importWarningMessages, 30000)
        cy.get(TestCasesPage.importWarningMessages).should('include.text', '(0) test case(s) were imported. The following (1) test case(s) could not be imported. Please ensure that your formatting is correct and try again.')
        cy.get(TestCasesPage.importWarningMessages).should('include.text', ' Reason: Test Cases Group or Title cannot contain special characters.')
    })
})
