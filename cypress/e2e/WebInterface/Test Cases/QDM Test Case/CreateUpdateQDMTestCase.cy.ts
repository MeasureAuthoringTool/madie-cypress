import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCQLLibraryName = ''
let measureCQL = MeasureCQL.simpleQDM_CQL
let measureScoring = 'Cohort'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseTitleWithSpecialChar = 'Title for Auto Test!@#$%^&*()_+=-{}|[]'
let testCaseSeriesWithSpecialChar = 'SBTestSeries!@#$%^&*()_+=-{}|[]'
let updatedTestCaseTitle = testCaseTitle + ' ' + 'UpdatedTestCaseTitle'
let updatedTestCaseDescription = testCaseDescription + ' ' + 'UpdatedTestCaseDescription'
let updatedTestCaseSeries = 'ICFTestSeries'
let measureCQLWithElements = 'library QDMTestLibrary1686087138930 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": \'urn:oid:2.16.840.1.113883.3.3157.4036\' \n' +
    'valueset "Active Peptic Ulcer": \'urn:oid:2.16.840.1.113883.3.3157.4031\' \n' +
    'valueset "Adverse reaction to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.6\' \n' +
    'valueset "Allergy to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.5\' \n' +
    'valueset "Anticoagulant Medications, Oral": \'urn:oid:2.16.840.1.113883.3.3157.4045\' \n' +
    'valueset "Aortic Dissection and Rupture": \'urn:oid:2.16.840.1.113883.3.3157.4028\' \n' +
    'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\' \n' +
    'valueset "Cardiopulmonary Arrest": \'urn:oid:2.16.840.1.113883.3.3157.4048\' \n' +
    'valueset "Cerebral Vascular Lesion": \'urn:oid:2.16.840.1.113883.3.3157.4025\' \n' +
    'valueset "Closed Head and Facial Trauma": \'urn:oid:2.16.840.1.113883.3.3157.4026\' \n' +
    'valueset "Dementia": \'urn:oid:2.16.840.1.113883.3.3157.4043\' \n' +
    'valueset "Discharge To Acute Care Facility": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.87\' \n' +
    'valueset "ED": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085\' \n' +
    'valueset "Endotracheal Intubation": \'urn:oid:2.16.840.1.113762.1.4.1045.69\' \n' +
    'valueset "Fibrinolytic Therapy": \'urn:oid:2.16.840.1.113883.3.3157.4020\' \n' +
    'valueset "Intracranial or Intraspinal surgery": \'urn:oid:2.16.840.1.113762.1.4.1170.2\' \n' +
    'valueset "Ischemic Stroke": \'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024\' \n' +
    'valueset "Major Surgical Procedure": \'urn:oid:2.16.840.1.113883.3.3157.4056\' \n' +
    'valueset "Malignant Intracranial Neoplasm Group": \'urn:oid:2.16.840.1.113762.1.4.1170.3\' \n' +
    'valueset "Mechanical Circulatory Assist Device": \'urn:oid:2.16.840.1.113883.3.3157.4052\' \n' +
    'valueset "Neurologic impairment": \'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012\' \n' +
    'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
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
    '      union ["Medication, Active": "Fibrinolytic Therapy"] //Medication\n' +
    '      union ["Participation": "Intracranial or Intraspinal surgery"] //Participation\n' +
    '      union ["Physical Exam, Order": "Ischemic Stroke"] //Physical Exam\n' +
    '      union ["Procedure, Order": "Major Surgical Procedure"] //Procedure\n' +
    '      union ["Related Person": "Malignant Intracranial Neoplasm Group"] //Related Person - mssing from curent list\n' +
    '      union ["Substance, Administered": "Mechanical Circulatory Assist Device"] //Substance\n' +
    '      union ["Symptom": "Neurologic impairment"] //Symptom\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n'


describe('Create and Update QDM Test Case', () => {

    newMeasureName = measureName + randValue
    newCQLLibraryName = CqlLibraryName + randValue

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, measureScoring, true, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Create and Update Test Case for QDM Measure', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        // check sex (formaly called gender) dropdown for all new options - MAT-7798
        cy.contains('Sex').should('be.visible')

        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.SelectionOptionChoice).find('li').should('contain.text', 'Asked But DeclinedFemaleFemale (finding)MaleMale (finding)Patient sex unknown (finding)')

        // need this to dismiss the dropdown
        cy.get(TestCasesPage.SelectionOptionChoice).contains('Asked But Declined').click()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Navigate to Details tab and Edit
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear().type(updatedTestCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear().type(updatedTestCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear().type(updatedTestCaseSeries).type('{enter}')

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Navigate to Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate back to Edit test case page and assert fields
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.QDMDob/*'#birth-date'*/).should('contain.value', '01/01/2020')
        cy.get(TestCasesPage.QDMLivingStatus).should('contain.text', 'Living')
        cy.get(TestCasesPage.QDMRace).should('contain.text', 'White')
        cy.get(TestCasesPage.QDMGender).should('contain.text', 'Male')
        cy.get(TestCasesPage.QDMEthnicity).should('contain.text', 'Not Hispanic or Latino')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).should('contain.value', updatedTestCaseTitle)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('contain.value', updatedTestCaseDescription)

        //verify the view only CQL tab is present as well as the object that contains the CQL
        cy.get(TestCasesPage.meassureCQLVOTab).scrollIntoView()
        Utilities.waitForElementVisible(TestCasesPage.meassureCQLVOTab, 3000)
        cy.get(TestCasesPage.meassureCQLVOTab).click()

        cy.get(TestCasesPage.voTCCQLobject).scrollIntoView()
        Utilities.waitForElementVisible(TestCasesPage.voTCCQLobject, 3000)
        cy.get(TestCasesPage.voTCCQLobject).click()

        cy.get(TestCasesPage.voTCCQLEditor).should('have.attr', 'readonly', 'readonly')
    })

    it('Add Test Case Expected values for Boolean Measure', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('01/01/2000').click()

        //Navigate to Expected/Actual tab and add Expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

    })
})

describe('Non Boolean Test case Expected Values', () => {

    newMeasureName = measureName + randValue + 1
    newCQLLibraryName = CqlLibraryName + randValue + 1

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, measureScoring, false, measureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'SDE Ethnicity')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Add Test Case Expected values for Non Boolean Measure', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('01/01/2000').click()

        //Navigate to Expected/Actual tab and add Expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')

        //save the Test Case
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

    })
})


describe('QDM element tabs', () => {

    newMeasureName = measureName + randValue + 2
    newCQLLibraryName = CqlLibraryName + randValue + 2

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, measureScoring, false, measureCQLWithElements)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Verify QDM Element tabs relevant to the Measure CQL', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMElementsTab).scrollIntoView()
            .should('contain', 'Adverse Event')
            .should('contain', 'Allergy')
            .should('contain', 'Assessment')
            .should('contain', 'Care Experience')

        //Navigate to CQL Editor tab and verify the same Elements are present in the Measure CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
            .should('contain', 'Adverse Event')
            .should('contain', 'Allergy')
            .should('contain', 'Assessment')
            .should('contain', 'Care Experience')
    })
})

describe('Create and update QDM Test case validations', () => {

    newMeasureName = measureName + randValue + 5
    newCQLLibraryName = CqlLibraryName + randValue + 5

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCQLLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Create Test case Validation: Test case Title has special characters', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitleWithSpecialChar.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Test Case Title can not contain special characters: /[`!@#$%^&*()_\\+=\\[\\]{};\':"\\\\|,.<>\\/?~]/')

    })

    it('Create Test case Validation: Test Case Group has special characters', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeriesWithSpecialChar).type('{enter}')

        cy.get(TestCasesPage.createTestCaseSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Test Case Group can not contain special characters: /[`!@#$%^&*()_\\+=\\[\\]{};\':"\\\\|,.<>\\/?~]/')

    })

    it('Edit Test case Validation: Test case Title has special characters', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to Details tab and Edit
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseTitle).clear().type(testCaseTitleWithSpecialChar)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Test Case Title can not contain special characters: /[`!@#$%^&*()_\\+=\\[\\]{};\':"\\\\|,.<>\\/?~]/')

    })

    it('Edit Test case Validation: Test case Group has special characters', () => {

        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //Navigate to Details tab and Edit
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear().type(testCaseSeriesWithSpecialChar).type('{enter}')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'Test Case Group can not contain special characters: /[`!@#$%^&*()_\\+=\\[\\]{};\':"\\\\|,.<>\\/?~]/')

    })
})
