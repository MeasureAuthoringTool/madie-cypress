import {CreateMeasureOptions, CreateMeasurePage} from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { Header } from "../../../../../Shared/Header"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"

let measureName = 'QDMAttributeTestMeasure' + Date.now()
let CqlLibraryName = 'QDMAttributeTestLibrary' + Date.now()
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
    'valueset "CMS Sex": \'urn:oid:2.16.840.1.113762.1.4.1021.121\'\n' +
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
    '  ["Patient Characteristic Sex": "CMS Sex"]\n' +
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

const measureData: CreateMeasureOptions = {}


describe('QDM Test case Attribute validations', () => {

    beforeEach('Create measure and login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringProportion
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQL

        //Create QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
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

    it('Remove test case attributes', () => {

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        MeasureGroupPage.includeSdeData()

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
        cy.get(TestCasesPage.referenceRangeAttribute).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Interval<Quantity>')
        cy.get('[data-testid=quantity-value-input-low]').type('2')
        cy.get('[id="quantity-unit-input-low"]').click()
        cy.get('[id="quantity-unit-input-low"]').type('m') //Select unit as m meter
        cy.get('[data-testid=quantity-value-input-high]').type('4')
        cy.get('[id="quantity-unit-input-high"]').click()
        cy.get('[id="quantity-unit-input-high"]').type('m') //Select unit as m meter
        cy.get(TestCasesPage.addAttribute).click()
        cy.get(TestCasesPage.attributeChip).should('contain.text', 'Reference Range - referenceRange 2 \'m\' - 4 \'m\'')

        //Delete the attribute from Elements table
        // grab the element id of the first entry in the element table
        TestCasesPage.grabElementId(1)

        // delete that element
        TestCasesPage.qdmTestCaseElementAction('delete')
        cy.get(TestCasesPage.attributeChip).should('not.exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Commenting until feature flag for JSON tab is removed
        //Navigate to JSON tab and verify the attribute is deleted from tc Json
        // cy.get(TestCasesPage.jsonTab).click()
        // cy.get(TestCasesPage.qdmTCJson).should('not.contain.text', '"referenceRange"')
        // cy.get(TestCasesPage.qdmTCJson).should('not.contain.text', '"description": "Laboratory Test, Performed: Chlamydia Screening"')
    })

    it('Check Result attribute for expanded units past UCUM standard', () => {

        // we are skipping non-essential steps here, like no SDE or test case demographics
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()

        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.resultAttribute).click()
        cy.get(TestCasesPage.selectAttributeDropdown).should('contain.text', 'Result')

        cy.get(TestCasesPage.attributeType).click()
        cy.get(TestCasesPage.quantityType).click()
        cy.get(TestCasesPage.attributeType).should('contain.text', 'Quantity')

        // check all units from https://jira.cms.gov/browse/MAT-7631
        const validUnits = [
                'years',
                'year',
                'months',
                'month',
                'weeks',
                'week',
                'days',
                'day',
                'hours',
                'hour',
                'minutes',
                'minute',
                'seconds',
                'second',
                'milliseconds',
                'millisecond'
            ]

        cy.get(TestCasesPage.quantityValueInput).type('5')

        for (let unit of validUnits) {
            cy.get(TestCasesPage.quantityUnitInput).clear().type(unit)
            cy.wait(750)

            cy.get('[data-testid="quantity-unit-input-quantity-helper-text"]').should('not.exist')

        }
        
        cy.get(TestCasesPage.quantityUnitInput).clear().type('problem')

        cy.get('[data-testid="quantity-unit-input-quantity-helper-text"]').should('be.visible')
    })
})
