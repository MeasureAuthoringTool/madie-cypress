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
        MeasuresPage.measureAction("edit")
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
        MeasuresPage.measureAction("edit")

        //click on the test case tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get('[data-testid="file-drop-div"]' /*> p'*/).click()
        cy.get(TestCasesPage.filAttachDropBox).attachFile(singleTestCaseFile)

        //click on the 'Import' button on the modal window
        TestCasesPage.clickQDMImportTestCaseButton()

        //test case list table contains the group name of the test case that was imported
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'StatusGroupTitleDescriptionActionN/AIPFailNoEncounterPatient is 19 with no Encounter InpatientSelectN/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...moreSelectN/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounterSelectN/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of strokeSelectN/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...moreSelectN/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agai...moreSelectN/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient e...moreSelectN/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...moreSelectN/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...moreSelectN/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing bo...moreSelectN/ADENOMPassPrinDxIschemicStkPatient turns 18 day before admission with Non-Elective Inpatient Encounter ends during MP with principal diagnosis of s...moreSelectN/AIPPassLOS119daysPatient is 18 with Non-Elective Inpatient Encounter (LOS 119 days) with principal diagnosis of ischemic stroke ends duri...moreSelectN/AIPPassIPEncDuringMPExpiresAfterIPEncPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...moreSelectN/ANUMERFailCustom CodePatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...moreSelectN/ANUMERPassAntithromboticTMeqIPDischargeTMPatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...moreSelectN/ADENEXCEPFailAntiThrpNotgivenDischargePatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke  and d...moreSelectN/ADENEXCEPPassMedRsnStartTmEQEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...moreSelectN/ADENEXCEPPassMedRsnStartTmEQEncInpDischTmPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...moreSelectN/ADENEXCEPPassPatRefDuringEncIpPatient does not get antithrombotic medication due to patient refusal during IP encounter. This case tests the timing bo...moreSelectN/ADENEXCEPPassMedRsnDuringEncIpPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...moreSelectN/ANUMERPassAntithromboticTMeqIPAdmTM Patient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...moreSelectN/ADENEXCEPPassMedRsnDuringEncIpTestOccurrPatient does not get antithrombotic medication due to medical reasons after IP encounter. Testing multiple IP encounters...moreSelectN/ADENEXPass CMOdurDiffEDTestOccurPatient receives CMO during a different ED encounter.  Testing multiple  Encounter.SelectN/AIPPassNonEleInpEncx2Patient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP contains ...moreSelectN/ADENEXCEPPassMedDscPatRsnDTimeEQEncStartTimePatient does not get antithrombotic medication due to patient refusal during IP encounter. This case tests the timing bo...moreSelectN/ADENEXCEPPassMedDscPatRsnDTimeEQEncStopTimePatient does not get antithrombotic medication due to patient refusal during IP encounter. This case tests the timing bo...moreSelectN/AIPFailPrinDxIsHemoPatient is 18 with Encounter Inpatient (LOS 120 days) with principal diagnosis of hemorrhagic stroke.SelectN/ADENEXCEPFailMedRsnStartTmGTEncInpDischTmPatient does not get antithrombotic medication due to medical reasons after IP encounter. This case tests the timing bou...moreSelectN/AIPPassageeq18Patient is  18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends dur...moreSelectN/AIPFailBadDefSTKEQRank2Patient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no principal diagnosis of stroke,...moreSelectN/AIPFailBadDefNoneSTKPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no principal diagnosis of strokeSelectN/AIPFailAllSTKEncounterFailAllNoSTKPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no diagnosis of strokeSelectN/ADENEXPassCMPdurEncNoEDNoObsBFEncPatient receives CMP during inpatient encounter. No ED. No Observation. Testing day of operator with HospitalizationWith...moreSelectN/ADENEXPassCMOdurObsNoEDObsLT1hrBFEncPatient receives CMO during observation. No ED. Obs ends 1 min before inpatient encounter start. Testing day of operator...moreSelectN/ADENEXPassCMOdurObsEDLT1hrObsLT1hrBFEncPatient receives comfort measures order during ED visit that ends <= 1 hour before IP EncounterSelectN/ADENEXPassCMOdurEncNoEDNoObsBFEncdateTimePatient receives CMO during inpatient encounter. No ED. No Observation. Testing day of operator with HospitalizationWith...moreSelectN/ADENEXPassCMOdurEncNoEDNoObsBFEncRelePerPatient receives CMO during inpatient encounter. No ED. No Observation. Testing day of operator with HospitalizationWith...moreSelectN/ADENEXPassCMOdurEncEDLT1hrObsLT1hrBFEncPatient receives CMO during inpatient encounter. ED ends 1 minute before observation. Obs ends 1 min before inpatient en...moreSelectN/ADENEXPassCMOdurEncEDLT1hrNoObsBFEncPatient receives CMO during inpatient encounter. ED ends 1 minute before inpatient encounter start. No Observation. Test...moreSelectN/ADENEXPassCMOdurEncEDGT1hrObsGT1hrBFEncPatient receives CMO during inpatient encounter. ED ends 61 minute before observation. Obs ends 61 min before inpatient ...moreSelectN/ADENEXPassCMOdurEncEDGT1hrNoObsBFEncPatient receives CMO during inpatient encounter. ED ends 61 minutes before inpatient encounter start. No Observation. Te...moreSelectN/ADENEXPassCMOdurEncEDEQ1hrObsEQ1hrBFEncPatient receives CMO during inpatient encounter. ED ends 60 minutes before observation. Obs ends 60 min before inpatient...moreSelectN/ADENEXPassCMOdurEncTMEDEndTMEQObsTMObsEndTMEQEncTMPatient receives CMO on IP start. ED ends on OBS start and OBS ends on IP start. Testing day of operator with Hospitaliz...moreSelectN/ADENEXPassCMOdurEDEDLT1hrObsLT1hrBFEncPatient receives CMO during ED. ED ends 1 minute before Observation. Obs ends 1 min before IP start. Testing day of oper...moreSelectN/ADENEXPassCMOdurEDEDLT1hrNoObsBFEncPatient receives CMO during ED. ED ends 1 minute before inpatient encounter start. No Observation. Testing day of operat...moreSelectN/ADENEXPassCMOdurEDEDEQ1hrObsEQ1hrBFEncPatient receives CMO during ED. ED ends 60 minute before Observation. Obs ends 60 min before IP start. Testing day of op...moreSelectN/ADENEXPassCMOdurEDEDEQ1hrNoObsBFEncPatient receives CMO during ED. ED ends 60 minute before inpatient encounter start. No Observation. Testing day of opera...moreSelectN/ADENEXPass CMOdurObsEDb41hrObsEQ1hrBFEncPatient receives CMO during observation.ED ends 1 min before Obs. Obs ends 60 min before inpatient encounter start. Test...moreSelectN/ADENEXPass CMOdurEncNoEDObsLT1hrBFEncPatient receives CMO during inpatient encounter. No ED.  Observation ends 1 min before IP start. Testing day of operator...moreSelectN/ADENEXPass CMOdurEncEDEQ1hrNoObsBFEncPatient receives CMO during inpatient encounter. ED ends 60 minutes before inpatient encounter start. No Observation. Te...moreSelectN/ADENEXFailIschSTKwDischgDisposionFailAllPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...moreSelectN/ADENEXFailDenomExclusionsFailAllPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...moreSelectN/ADENEXFailCMOdurObsEDLT1hrObsGT1hrBFEncPatient receives CMO during observation. ED ends 1 minute before observation. Obs ends 61 min before inpatient encounter...moreSelectN/ADENEXFailCMOdurObsEDGT1hrObsGT1hrBFEncPatient receives CMO during observation. ED ends 61 minute before observation. Obs ends 61 min before inpatient encounte...moreSelectN/ADENEXFailCMOdurEDEDLT1hrObsGT1hrBFEncPatient receives CMO during ED. ED ends 1 minute before Obs. Obs ends 61 min before inpatient encounter start.  Testing ...moreSelectN/ADENEXFailCMOdurEDEDGT1hrObsLT1hrBFEncPatient receives CMO during ED. ED ends 61 minute before obs. Obs ends 1 min before inpatient encounter start.Testing da...moreSelectN/ADENEXFailCMOdurEDEDGT1hrObsGT1hrBFEncPatient receives CMO during ED. ED ends 61 minute before Obs. Obs ends 61 min before inpatient encounter start. Testing ...moreSelectN/ADENEXFailCMOBFEncNoEDNoObsBFEncPatient receives CMO before inpatient encounter. No ED. No Obs. Testing HospitalizationWithObservation Function.SelectN/ADENEXFail CMOdurEDEDGT1hrNoObsBFEncPatient receives CMO during ED. ED ends 61 minute before inpatient encounter start. No Observation. Testing day of opera...moreSelectN/ADENEXCEPPassPharmContraDurEncStartNoEDNoObsBFEncPatient receives Ticagrelor during inpatient encounter. No ED. No Observation. Testing medication data type for Hospital...moreSelectN/ADENEXCEPFailPharmContraBeforeEncStartNoEDNoObsBFEncPatient receives Ticagrelor before inpatient encounter. No ED. No Observation. Testing medication data type for Hospital...moreSelectN/ADENEXCEPFailPharmContraAfterEncEndNoEDNoObsBFEncPatient receives Ticagrelor after inpatient encounter. No ED. No Observation. Testing medication data type for Hospitali...moreSelectN/ADENEXCEPFailNoPharmContraDurEncStartNoEDNoObsBFEncPatient receives Ticagrelor during inpatient encounter but that is now acceptable antithrombotic therapy. No ED. No Obse...moreSelectN/ANUMERPassAntithromboticDuringIPTestOccurPatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...moreSelectN/ANUMERPass3Enc2WithAntithrombotic1WithExcep1ExcluPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...moreSelectN/ANUMERPass2Enc3WithAntithromboticPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...moreSelectN/ANUMERPass3Enc2WithAntithrombotic2WithExcepPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...moreSelectN/ANUMERPassDENEXCEPPASS3Enc2WithAntithrombotic1WithExcepPatient is GT 18 with 2 Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends...moreSelectN/AIPPassPrincDxIsIschemicStkPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duri...moreSelectN/AIPFailNoPrincDxPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) ends during MP with no principal diagnosis of strokeSelectN/AIPFailEncEndsAfterMPPatient is 18 with Non-Elective Inpatient Encounter ends after MP with principal diagnosis of strokeSelectN/ANUMERPassAntithromboticDuringIPPatient is GT 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends d...moreSelectN/ADENEXPassDischargeACFPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP discharge...moreSelect')



    })

    it('Verify error message when a Text file is imported', () => {
        //navigate to the main measures page
        cy.get(Header.measures).click()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

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
        MeasuresPage.measureAction("edit")

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
        MeasuresPage.measureAction("edit")
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
        MeasuresPage.measureAction("edit")

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
        MeasuresPage.measureAction("edit")

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
