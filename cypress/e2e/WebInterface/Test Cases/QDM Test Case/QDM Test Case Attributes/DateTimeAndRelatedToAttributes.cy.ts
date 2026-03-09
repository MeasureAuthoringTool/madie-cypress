import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"

const measureName = 'DateTimeAndRelated' + Date.now()
const CqlLibraryName = 'DateTimeAndRelatedLib' + Date.now()
const measureScoringProportion = 'Proportion'
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'
const measureCQL = 'library Library5749 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
    'valueset "Adverse reaction to thrombolytics": \'urn:oid:2.16.840.1.113762.1.4.1170.6\'\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    'valueset "birth date": \'urn:oid:2.16.840.1.113883.3.560.100.4\'\n' +
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
    '      union ["Care Goal": "Adverse reaction to thrombolytics"] //Care Goal\n' +
    '      union ["Assessment, Performed": "Falls Screening"] //Assessment'

const measureData: CreateMeasureOptions = {}

describe('Test Case Attributes', () => {

    beforeEach('Create measure and login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringProportion
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        // add SDE to test case coverage
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        MeasureGroupPage.includeSdeData()

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the SDE side tab section on the test cases tab
        Utilities.waitForElementVisible(TestCasesPage.qdmSDESidNavLink, 30000)
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.saveSDEOption).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Configuration Updated Successfully')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Add Date Time attribute to the Test case', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        cy.get(TestCasesPage.AssessmentElementTab).click()
        cy.get(TestCasesPage.plusIcon).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.resultAttribute).click()
        cy.get(TestCasesPage.attributeType).click()
        cy.get('[data-testid=option-DateTime]').click() //Select DateTime from dropdown
        cy.get('[data-testid="date-time-input"]').type('12/12/200011:30AM')
        cy.get(TestCasesPage.addAttribute).click()
        cy.get(TestCasesPage.attributeChip).should('contain.text', 'Result -  12/12/2000 11:30 AM')
    })

    it('Add Related To attribute to the Test case', () => {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Add Date Time Attribute
        cy.get(TestCasesPage.AssessmentElementTab).click()
        cy.get(TestCasesPage.plusIcon).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get(TestCasesPage.resultAttribute).click()
        cy.get(TestCasesPage.attributeType).click()
        cy.get('[data-testid=option-DateTime]').click() //Select DateTime from dropdown
        cy.get('[data-testid="date-time-input"]').type('12/12/200011:30AM')
        cy.get(TestCasesPage.addAttribute).click()
        cy.get(TestCasesPage.attributeChip).should('contain.text', 'Result -  12/12/2000 11:30 AM')

        //Add Related To Attribute
        cy.get(TestCasesPage.CareGoalElementTab).click()
        cy.get(TestCasesPage.plusIcon).eq(0).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-Related To"]').click()
        cy.get('[id="data-element-selector"]').click()
        cy.get('[data-testid="Assessment, Performed: Falls Screening-option"]').click() //Select Laboratory Test, Performed: Chlamydia Screening from dropdown
        cy.get(TestCasesPage.addAttribute).click()
        cy.get('tbody > :nth-child(2)').find('.data-type-container').should('contain.text', 'Assessment, PerformedFalls Screening ')
    })
})
