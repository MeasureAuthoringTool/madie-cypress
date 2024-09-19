import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { Header } from "../../../../../Shared/Header"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { LandingPage } from "../../../../../Shared/LandingPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Global } from "../../../../../Shared/Global"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { CQLLibrariesPage } from "../../../../../Shared/CQLLibrariesPage"

let testCaseDescription = 'DENOMFail' + Date.now()
let QDMTCJson = TestCaseJson.QDMTestCaseJson
let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseSeries = 'SBTestSeries'
let twoFiftyTwoCharacters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr'
let altMeasureName = ''
let altCqlLibraryName = ''
let measureCQL = MeasureCQL.QDMHighlightingTab_CQL
let measureScoringCohort = 'Cohort'
let qdmMeasureCQL = MeasureCQL.simpleQDM_CQL
let qdmMeasureCQLwInvalidValueset = MeasureCQL.simpleQDM_CQL_invalid_valueset
let qdmMeasureCQLwNonVsacValueset = MeasureCQL.QDMTestCaseCQLNonVsacValueset
let measureQDMCQL = 'library Library5749 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'codesystem "Test": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
    'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": \'urn:oid:2.16.840.1.113883.3.3157.4036\'\n' +
    'valueset "Active Peptic Ulcer": \'urn:oid:2.16.840.1.113883.3.3157.4031\'\n' +
    'valueset "Adverse reaction to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.6\'\n' +
    'valueset "Allergy to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.5\'\n' +
    'valueset "Anticoagulant Medications, Oral": \'urn:oid:2.16.840.1.113883.3.3157.4045\'\n' +
    'valueset "Aortic Dissection and Rupture": \'urn:oid:2.16.840.1.113883.3.3157.4028\'\n' +
    'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\'\n' +
    'valueset "Cardiopulmonary Arrest": \'urn:oid:2.16.840.1.113883.3.3157.4048\'\n' +
    'valueset "Cerebral Vascular Lesion": \'urn:oid:2.16.840.1.113883.3.3157.4025\'\n' +
    'valueset "Closed Head and Facial Trauma": \'urn:oid:2.16.840.1.113883.3.3157.4026\'\n' +
    'valueset "Dementia": \'urn:oid:2.16.840.1.113883.3.3157.4043\'\n' +
    'valueset "Discharge To Acute Care Facility": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.87\'\n' +
    'valueset "ED": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085\'\n' +
    'valueset "Endotracheal Intubation": \'urn:oid:2.16.840.1.113762.1.4.1045.69\'\n' +
    'valueset "Fibrinolytic Therapy": \'urn:oid:2.16.840.1.113883.3.3157.4020\'\n' +
    'valueset "Intracranial or Intraspinal surgery": \'urn:oid:2.16.840.1.113762.1.4.1170.2\'\n' +
    'valueset "Ischemic Stroke": \'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024\'\n' +
    'valueset "Major Surgical Procedure": \'urn:oid:2.16.840.1.113883.3.3157.4056\'  \n' +
    'valueset "Malignant Intracranial Neoplasm Group": \'urn:oid:2.16.840.1.113762.1.4.1170.3\'\n' +
    'valueset "Mechanical Circulatory Assist Device": \'urn:oid:2.16.840.1.113883.3.3157.4052\'\n' +
    'valueset "Neurologic impairment": \'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012\'\n' +
    'valueset "Patient Expired": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.309\'\n' +
    'valueset "Percutaneous Coronary Intervention": \'urn:oid:2.16.840.1.113883.3.3157.2000.5\'\n' +
    'valueset "Pregnancy": \'urn:oid:2.16.840.1.113883.3.3157.4055\'\n' +
    'valueset "STEMI": \'urn:oid:2.16.840.1.113883.3.3157.4017\'\n' +
    'valueset "Thrombolytic medications": \'urn:oid:2.16.840.1.113762.1.4.1170.4\'\n' +
    'valueset "Chlamydia Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1052\'\n' +
    'valueset "Falls Screening": \'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1028\'\n' +
    'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "Initial Population":\n' +
    '  ["Adverse Event": "Encounter Inpatient"] //Adverse Event\n' +
    '      union ["Allergy/Intolerance": "Observation Services"] //Allergy\n' +
    '      union ["Assessment, Order": "Active Bleeding or Bleeding Diathesis (Excluding Menses)"] //Assessment\n' +
    '      union ["Patient Care Experience": "Active Peptic Ulcer"] //Care Experience\n' +
    '      union ["Care Goal": "Adverse reaction to thrombolytics"] //Care Goal - missing from current list\n' +
    '      union ["Patient Characteristic Payer": "Payer"] //Characteristic\n' +
    '      //threw in a patient demographic - should not show up\n' +
    '      union ["Patient Characteristic Race": "Race"]\n' +
    '      union ["Diagnosis": "Allergy to thrombolytics"] //Condition\n' +
    '      union ["Communication, Performed": "Anticoagulant Medications, Oral"] //Communication\n' +
    '      //threw a negation element in to see if it maps correctly\n' +
    '    //   union ["Communication, Not Performed": "Aortic Dissection and Rupture"] //Communication\n' +
    '      union ["Device, Order": "Cardiopulmonary Arrest"] //Device\n' +
    '      union ["Diagnostic Study, Order": "Cerebral Vascular Lesion"] //Diagnostic Study\n' +
    '      union ["Encounter, Performed": "Emergency Department Visit"] //Encounter\n' +
    '      union ["Family History": "Closed Head and Facial Trauma"] //Family History\n' +
    '      union ["Immunization, Order": "Dementia"] //Immunization\n' +
    '      union ["Intervention, Order": "ED"] //Intervention\n' +
    '      union ["Laboratory Test, Order": "Endotracheal Intubation"] //Laboratory\n' +
    '      union ["Laboratory Test, Performed": "Chlamydia Screening"]\n' +
    '      union ["Medication, Active": "Fibrinolytic Therapy"] //Medication\n' +
    '      union ["Participation": "Intracranial or Intraspinal surgery"] //Participation\n' +
    '      union ["Physical Exam, Order": "Ischemic Stroke"] //Physical Exam\n' +
    '      union ["Procedure, Order": "Major Surgical Procedure"] //Procedure\n' +
    '      union ["Related Person": "Malignant Intracranial Neoplasm Group"] //Related Person - mssing from curent list\n' +
    '      union ["Substance, Administered": "Mechanical Circulatory Assist Device"] //Substance\n' +
    '      union ["Symptom": "Neurologic impairment"] //Symptom\n' +
    '      union ["Assessment, Performed": "Falls Screening"] //Assessment '



describe('Test Case Ownership Validations for QDM Measures', () => {

    beforeEach('Create measure and login', () => {

        let altRandValue = (Math.floor((Math.random() * 1000) + 2))
        altMeasureName = measureName + altRandValue
        altCqlLibraryName = CqlLibraryName + altRandValue

        //Create QDM Measure, PC and Test Case with ALT user
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(altMeasureName, altCqlLibraryName, measureScoringCohort, true, measureCQL, null, true)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, true, 'IP2')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, true)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(altMeasureName, altCqlLibraryName, false, true)

    })
    it('Fields on Test Case page are not editable by Non Measure Owner', () => {

        //navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        //click on Edit button to edit measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()


        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMDob).should('be.disabled')
        cy.get(TestCasesPage.QDMLivingStatus).should('not.be.enabled')
        cy.get(TestCasesPage.QDMRace).should('not.be.enabled')
        cy.get(TestCasesPage.QDMGender).should('not.be.enabled')
        cy.get(TestCasesPage.QDMEthnicity).should('not.be.enabled')

        //Navigate to Details tab
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('not.be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('not.be.enabled')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('not.be.enabled')

        //Navigate to Expected/Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.enabled')

    })
})

describe('Create Test Case Validations', () => {

    before('Create Measure', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)
    })

    beforeEach('Login', () => {
        OktaLogin.Login()
    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle).wait(3000)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
    })

    it('Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseTitleInput).should('be.enabled')

        cy.get(TestCasesPage.createTestCaseTitleInput).type(twoFiftyTwoCharacters)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseSaveButton).should('be.disabled')
        cy.get(TestCasesPage.createTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Create Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //save button to save the test case is not available
        cy.get(TestCasesPage.createTestCaseSaveButton).should('not.be.enabled')
    })
})

describe('Edit Test Case Validations', () => {

    beforeEach('Create QDM Measure and Test Case and, then, Login', () => {
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })
    afterEach('Logout', () => {
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Description more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()

        //Update Test Case Description with more than 250 characters
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseDescriptionInlineError).should('contain.text', 'Test Case Description cannot be more than 250 characters.')
    })


    it('Title more than 250 characters', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.wait(1000)

        //Update Test Case Title with more than 250 characters
        cy.get(TestCasesPage.testCaseTitle).type(twoFiftyTwoCharacters, { delay: 0 })
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).contains('Test Case Title cannot be more ' +
            'than 250 characters.')
    })

    it('Edit Test Case without a title', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.detailsTab).click().wait(2000)

        cy.get(TestCasesPage.testCaseTitle).click().focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).click()

        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.disabled')
        cy.get(TestCasesPage.editTestCaseTitleInlineError).should('contain.text', 'Test Case Title is required.')
    })

    //dirty check validation
    it('Validate dirty check when user attempts to navigate away from the QDM Test Case edit page', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.elementsTab).should('exist')
        cy.get(TestCasesPage.elementsTab).should('be.enabled')
        cy.get(TestCasesPage.elementsTab).click()

        //enter a value of the dob
        cy.get(TestCasesPage.QDMDob).type('01/01/2000').click()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)

        //verify that the discard modal appears
        Global.clickOnDirtyCheckCancelChanges()

        //attempt to navigate away from the test case page
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(CQLLibrariesPage.cqlLibraryDirtyCheck, 37000)
        //verify that the discard modal appears
        Global.clickOnDirtyCheckDiscardChanges()

    })
})

describe('Dirty Check Validations', () => {

    beforeEach('Create QDM Measure, Test Case and Login', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Ratio', false, measureQDMCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(false, false, 'Initial Population', 'Initial Population', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
    })

    afterEach('Logout and cleanup', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Validate dirty check on the test case title, in the test case details tab', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details page
        cy.get(TestCasesPage.elementsTab).should('exist')
        cy.get(TestCasesPage.elementsTab).should('be.enabled')
        cy.get(TestCasesPage.elementsTab).click()

        //enter a value of the Ethnicity
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')


        //take focus off of the date field
        cy.get(TestCasesPage.elementsTab).click()

        //verify that the Ethnicity value changes back to it's previous value
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')

        //change a value for the dob, again
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Hispanic or Latino').click()

        //take focus off of the date field
        cy.get(TestCasesPage.elementsTab).click()

        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('exist')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('be.enabled')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

        //verify discard modal and click on keep working
        Global.clickDiscardAndKeepWorking()

        //verify that the Ethnicity value is left unchanged from it's last change
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')
    })

    it('Validate dirty check on Testcase Expected/Actual tab', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Click on Edit for Test Case
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to Expected/Actual tab and enter Expected values
        cy.get(TestCasesPage.expectedOrActualTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('4')

        //Discard the changes
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('exist')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).should('be.enabled')
        cy.get(TestCasesPage.QDMTcDiscardChangesButton).click()

        //verify discard modal and click on keep working
        Global.clickDiscardAndKeepWorking()

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.empty')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.empty')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.empty')
    })
})

//work in progress for MAT-5974
describe.skip('QDM Measure / Test Case: Dirty Check on attribute: Quantity Attribute', () => {

    beforeEach('Create measure, group and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoringCohort, false, measureQDMCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Validate dirty check on the test case attributes', () => {
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('01/01/2020').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Expired').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        //select element and begin to add attribute
        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.attributesTab).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')
        cy.get('[data-testid=quantity-value-input-low]').type('2')
        cy.get('[id="quantity-unit-dropdown-low"]').click()
        cy.get('#quantity-unit-dropdown-low-option-0').click() //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-dropdown-high"]').click()
        cy.get('#quantity-unit-dropdown-high-option-0').click() //Select unit as m meter

        //attempt to navigate away without clicking on the add button (for the attribute)
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(TestCasesPage.QDMDiscardChangesDialog, 35000)
        Global.clickOnDirtyCheckCancelChanges()
        //user stays on current page
        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureid) => {
            cy.readFile('cypress/fixtures/testCaseId').should('exist').then((testCaseId) => {
                cy.location('pathname', { timeout: 60000 }).should('include', 'measures/' + measureid + '/edit/test-cases/' + testCaseId)
            })
        })
        //confirm that attribute is still on page and has not been discarded**
        cy.get('[data-testid=quantity-value-input-low]').should('include.value', 2)
        cy.get('[id="quantity-unit-dropdown-low"]').should('contain.value', "m meter")
        cy.get('[data-testid=quantity-value-input-high]').should('include.value', 4)
        cy.get('[id="quantity-unit-dropdown-high"]').should('contain.value', "m meter")

        //another attempt to navigate away from current page after clicking on the add button
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(TestCasesPage.QDMDiscardChangesDialog, 35000)
        Global.clickOnDirtyCheckDiscardChanges()

        //user is navigated away from test case page
        cy.location('pathname', { timeout: 60000 }).should('include', '/measures')

        //when the user navigates back to the test case details page the attribute details are not present**
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Internal<Quantity> values are no longer present
        Utilities.waitForElementToNotExist('[data-testid=quantity-value-field-low]', 35000)
        Utilities.waitForElementToNotExist('[id="quantity-unit-dropdown-low"]', 35000)
        Utilities.waitForElementToNotExist('[data-testid=quantity-value-field-high]', 35000)
        Utilities.waitForElementToNotExist('[id="quantity-unit-dropdown-high"]', 35000)
    })
})


describe('QDM CQM-Execution failure error validations: CQL Errors and missing group', () => {

    beforeEach('Create Measure, and Test Case', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoringCohort, true, qdmMeasureCQL)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)

    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('A message is displayed if there are issues with the CQL', () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //type in an additional value to the already existing value in the editor
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}Additional erroneous line')

        //saving new CQL value
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.qdmCQLFailureErrorList, 105000)
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('exist')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('be.visible')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')
    })
    it('A message is displayed if the measure is missing a group', () => {

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
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

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')

    })

})


describe('QDM CQM-Execution failure error validations: Valueset not found in Vsac', () => {

    beforeEach('Create Measure, and Test Case', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoringCohort, true, qdmMeasureCQLwInvalidValueset)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)


    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
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

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.qdmCQLFailureErrorList, 105000)
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('exist')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('be.visible')
        cy.get(TestCasesPage.qdmCQLFailureErrorList).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')

    })
})


describe('QDM CQM-Execution failure error validations: Data transformation- MADiE Measure to CQMMeasure', () => {

    beforeEach('Create Measure, and Test Case', () => {
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoringCohort, false, qdmMeasureCQLwNonVsacValueset)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)


    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {

        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //navigate to the CQL Editor tab, for the measure
        cy.get(EditMeasurePage.cqlEditorTab).should('exist')
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

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseExecutionError, 105000)
        cy.get(TestCasesPage.testCaseExecutionError).should('exist')
        cy.get(TestCasesPage.testCaseExecutionError).should('be.visible')
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('not.be.enabled')

    })
})

