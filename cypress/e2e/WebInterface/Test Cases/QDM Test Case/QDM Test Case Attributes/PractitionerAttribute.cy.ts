import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

const measureName = 'PracticionerAttribute' + Date.now()
const CqlLibraryName = 'PracticionerAttribute' + Date.now()
const measureScoringProportion = 'Proportion'
const testCaseTitle = 'Title for Auto Test'
const testCaseDescription = 'DENOMFail' + Date.now()
const testCaseSeries = 'SBTestSeries'
const measureCQL = MeasureCQL.QDM4TestCaseElementsAttributes

const measureData: CreateMeasureOptions = {}

describe('Practitioner Attribute', () => {

    beforeEach('Create measure and login', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = measureScoringProportion
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Add Practitioner attribute to the Test case', () => {

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        MeasureGroupPage.includeSdeData()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test Case page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2020 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        cy.get(TestCasesPage.laboratoryElement).click()
        cy.get(TestCasesPage.plusIcon).eq(1).click()
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabAttributes).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid=option-Performer]').click()
        cy.get(TestCasesPage.attributeType).click()
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
