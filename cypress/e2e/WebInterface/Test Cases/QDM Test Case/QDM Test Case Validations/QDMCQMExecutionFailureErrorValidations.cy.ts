import { CreateMeasureOptions, CreateMeasurePage } from '../../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { Utilities } from '../../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'
import { CQLEditorPage } from '../../../../../Shared/CQLEditorPage'
import { QdmCql } from '../../../../../Shared/QDMMeasuresCQL'

const now = Date.now()
let measureName = 'CQMExecutionFEV' + now
let CqlLibraryName = 'CQMExecutionFEVLib' + now
let testCaseDescription = 'DENOMFail' + now
const testCaseTitle = 'test case title'
const testCaseSeries = 'SBTestSeries'
const measureScoringCohort = 'Cohort'
const qdmMeasureCQLwInvalidValueset = QdmCql.simpleQDM_CQL_invalid_valueset
const qdmMeasureCQLwNonVsacValueset = QdmCql.QDMTestCaseCQLNonVsacValueset
const measureQDMCQL = QdmCql.QDM4TestCaseElementsAttributes
const QDMTCJson = TestCaseJson.QDMTestCaseJson

const measureData: CreateMeasureOptions = {}

function generateQDMCQLWithErrors(libraryName: string): string {
    return (
        'library ' +
        libraryName +
        " version '0.0.000'\n" +
        "using QDM version '5.6'\n\n" +
        "include MATGlobalCommonFunctionsQDM version '1.0.000' called Global\n\n" +
        'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\'\n\n' +
        'valueset "Acute care hospital Inpatient Encounter": \'urn:oid:2.16.840.1.113883.3.666.5.2289\'\n' +
        'valueset "Bicarbonate lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.139\'\n' +
        'valueset "Body temperature": \'urn:oid:2.16.840.1.113762.1.4.1045.152\'\n' +
        'valueset "Body weight": \'urn:oid:2.16.840.1.113762.1.4.1045.159\'\n' +
        'valueset "Creatinine lab test": \'urn:oid:2.16.840.1.113883.3.666.5.2363\'\n' +
        'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\'\n' +
        'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\n' +
        'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
        'valueset "Glucose lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.134\'\n' +
        'valueset "Heart Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.149\'\n' +
        'valueset "Hematocrit lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.114\'\n' +
        'valueset "Medicare Advantage payer": \'urn:oid:2.16.840.1.113762.1.4.1104.12\'\n' +
        'valueset "Medicare FFS payer": \'urn:oid:2.16.840.1.113762.1.4.1104.10\'\n' +
        'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\'\n' +
        'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
        'valueset "Oxygen Saturation by Pulse Oximetry": \'urn:oid:2.16.840.1.113762.1.4.1045.151\'\n' +
        'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
        'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\'\n' +
        'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
        'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\'\n' +
        'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\'\n' +
        'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\'\n' +
        'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\'\n\n' +
        'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n\n' +
        'parameter "Measurement Period" Interval<DateTime>\n\n' +
        'context Patient\n\n' +
        'define "Initial Population":\'\'\n' +
        "\t  'Inpatient Encounters'\n"
    )
}

describe('QDM CQM-Execution failure error validations: CQL Errors and missing group', () => {
    beforeEach('Create Measure, and Test Case', () => {
        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('A message is displayed if there are issues with the CQL', () => {
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type(generateQDMCQLWithErrors(CqlLibraryName))
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()
        cy.get(EditMeasurePage.cqlEditorExpandCollapseBtn).click()

        //Navigate to Test Case page
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 50000)
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()
        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseSyntaxError, 105000)
        cy.get(TestCasesPage.testCaseSyntaxError).should(
            'contain.text',
            'An error exists with the measure CQL, please review the CQL Editor tab.'
        )

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })

    it('A message is displayed if the measure is missing a group', () => {
        //log into MADiE
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //navigate to the CQL Editor tab, for the measure
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: false })

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseSyntaxError, 105000)
        cy.get(TestCasesPage.testCaseSyntaxError).should(
            'contain.text',
            'No Population Criteria is associated with this measure. Please review the Population Criteria tab.'
        )

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('QDM CQM-Execution failure error validations: Valueset not found in Vsac', () => {
    beforeEach('Create Measure, and Test Case', () => {
        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQLwInvalidValueset

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseSyntaxError, 105000)
        cy.get(TestCasesPage.testCaseSyntaxError).should(
            'contain.text',
            'An error exists with the measure CQL, please review the CQL Editor tab.'
        )

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})

describe('QDM CQM-Execution failure error validations: Data transformation- MADiE Measure to CQMMeasure', () => {
    beforeEach('Create Measure, and Test Case', () => {
        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringCohort
        measureData.patientBasis = 'false'
        measureData.measureCql = qdmMeasureCQLwNonVsacValueset

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'Encounter')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, QDMTCJson)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    //f
    it("A message is displayed if the measure's CQL Valueset not found in Vsac", () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        Utilities.waitForElementVisible(TestCasesPage.testCaseSyntaxError, 105000)
        cy.get(TestCasesPage.testCaseSyntaxError).should(
            'contain.text',
            'An error exists with the measure CQL, please review the CQL Editor tab.'
        )

        //confirm that the Run Test button is disabled
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })
})
