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
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

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
        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved73N/AIPFailNoEncounterPatient is 19 with no Encounter Inpatient' + todaysDate + 'Edit72N/AIPFailTooYoungPatient is 17 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duriShow more' + todaysDate + 'Edit71N/ANUMERFailAntithromboticStartBeforeIPEncPatient received anti thrombotic before and during encounter' + todaysDate + 'Edit70N/AIPFailEncEndsBeforeMPPatient is 18 with Non-Elective Inpatient Encounter ends before MP with principal diagnosis of stroke' + todaysDate + 'Edit69N/ANUMERFailAntithromboticAfterEncIPPatient is 18 with Non-Elective Inpatient Encounter (LOS 120 days) with principal diagnosis of ischemic stroke ends duriShow more' + todaysDate + 'Edit68N/ADENEXPassLeftAMAPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP left agaiShow more' + todaysDate + 'Edit67N/ADENEXPassExpiredPatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP patient eShow more' + todaysDate + 'Edit66N/ADENEXPassDischargeHomeHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP dischargeShow more' + todaysDate + 'Edit65N/ADENEXPassDischargeFacilityHospicePatient is 18 with Non-Elective Inpatient Encounter with principal diagnosis of ischemic stroke ends during MP dischargeShow more' + todaysDate + 'Edit64N/ADENEXCEPFailMedRsnStartTmLTEncInpAdmTmPatient does not get antithrombotic medication due to medical reasons before IP encounter. This case tests the timing boShow more' + todaysDate + 'Edit')


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
        cy.get(TestCasesPage.importTestCaseBtnOnModal).should('be.disabled')
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
        cy.get(TestCasesPage.importTestCaseBtnOnModal).should('be.disabled')
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
            cy.get(TestCasesPage.importTestCaseBtnOnModal).click()
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
            cy.get(TestCasesPage.importTestCaseBtnOnModal).click()
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
