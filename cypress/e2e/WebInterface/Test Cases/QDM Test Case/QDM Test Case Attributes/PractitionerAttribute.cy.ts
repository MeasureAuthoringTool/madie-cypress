import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMTestLibrary' + Date.now()
let measureScoringProportion = 'Proportion'
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQL = 'library Library5749 version \'0.0.000\'\n' +
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


describe('Practitioner Attribute', () => {

    beforeEach('Create measure and login', () => {

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoringProportion, false, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Add Practitioner attribute to the Test case', () => {

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid=option-Performer]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid=option-Practitioner]').click()
        cy.get('[data-testid="identifier-input-field-Naming System"]').type('TestIdentifier')
        cy.get('[data-testid="identifier-value-input-field-Value"]').type('TestValue')
        cy.get('[data-testid=string-field-id-input]').type('3')
        //Role
        cy.get(':nth-child(3) > :nth-child(1) > .MuiFormControl-root > [data-testid="value-set-selector"] > #value-set-selector').click()
        Utilities.waitForElementVisible('[data-testid="option-2.16.840.1.113883.3.117.1.7.1.292"]', 734000)
        cy.get('[data-testid="option-2.16.840.1.113883.3.117.1.7.1.292"]').click()//Select Emergency Department Visit
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get('[data-testid=option-SNOMEDCT]').click()
        cy.get(TestCasesPage.codeSelector).click()
        Utilities.waitForElementVisible('[data-testid=option-4525004]', 734000)
        cy.get('[data-testid=option-4525004]').click()//Select Emergency Department Patient visit (Procedure)
        //Speciality
        cy.get(':nth-child(4) > :nth-child(1) > .MuiFormControl-root > [data-testid="value-set-selector"] > #value-set-selector').click()
        Utilities.waitForElementVisible('[data-testid="option-2.16.840.1.113883.3.666.5.307"]', 734000)
        cy.get('[data-testid="option-2.16.840.1.113883.3.666.5.307"]').click()//Select Encounter Inpatient
        cy.get(TestCasesPage.codeSystemSelector).eq(1).click()
        cy.get('[data-testid=option-SNOMEDCT]').click()
        cy.get(TestCasesPage.codeSelector).eq(1).click()
        Utilities.waitForElementVisible('[data-testid=option-183452005]', 734000)
        cy.get('[data-testid=option-183452005]').click()//Select Emergency Hospital Admission
        //Qualification
        cy.get(':nth-child(5) > :nth-child(1) > .MuiFormControl-root > [data-testid="value-set-selector"] > #value-set-selector').click()
        Utilities.waitForElementVisible('[data-testid="option-2.16.840.1.114222.4.11.837"]', 734000)
        cy.get('[data-testid="option-2.16.840.1.114222.4.11.837"]').click()//Select Ethnicity
        cy.get(TestCasesPage.codeSystemSelector).eq(2).click()
        cy.get('[data-testid="option-CDCREC"]').click()
        cy.get(TestCasesPage.codeSelector).eq(2).click()
        cy.get('[data-testid=option-2135-2]').click()//Select Hispanic or Latino
        cy.get(TestCasesPage.addAttribute).click()
        cy.get(TestCasesPage.attributeChip).should('contain.text', 'Performer - Practitioner Identifier: { Naming System: TestIdentifier, Value: TestValue }, Id: 3, Role: SNOMEDCT : 4525004, Specialty: SNOMEDCT : 183452005, Qualification: CDCREC : 2135-2')

    })
})
