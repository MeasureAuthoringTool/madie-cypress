import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../../Shared/QDMElements"
import { QdmCql } from "../../../../../Shared/QDMMeasuresCQL"

const now = Date.now()
const measureName = 'RelevantElements' + now
const CqlLibraryName = 'RelevantElementsLib' + now
const firstTestCaseTitle = 'test case 1'
const testCaseDescription = 'tc showing how relevant elements works'
const testCaseSeries = 'RevElements'
// uses same CQL and test case as Proportion_ListQDMPositiveProcedurePerformed.cy.ts
const measureCQL = QdmCql.qdmMeasureCQLPRODCataracts2040BCVAwithin90Days
const measureData: CreateMeasureOptions = {}

describe('QDM Test cases - Checks for CQL Changes', () => {

    measureData.ecqmTitle = measureName
    measureData.cqlLibraryName = CqlLibraryName
    measureData.measureScoring = 'Proportion'
    measureData.patientBasis = 'false'
    measureData.measureCql = measureCQL

    const pops: MeasureGroups = {
        initialPopulation: 'Initial Population',
        denominator: 'Denominator',
        denomExclusion: 'Denominator Exclusions',
        numerator: 'Numerator'
    }

    before('Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.episode, MeasureScoring.Proportion, pops)
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure()
    })

    it('Present Relevant Elements warning & SDE changed warning after major CQL changes that affect test cases', () => {

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

        // //Click on Measure Group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Add Supplemental Data Elements
        MeasureGroupPage.includeSdeData()

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('08/17/1957 12:00 AM', 'Living', 'AMERICAN INDIAN OR ALASKA NATIVE', 'Female', 'Not Hispanic or Latino')

        //Element - Condition:Diagnosis: Uveitis
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Uveitis')
        //add Timing Prevalence Period DateTime
        QDMElements.addTimingPrevalencePeriodDateTime('03/15/2012 07:00 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '4927003')

        //Element - Procedure:Performed: Cataract Surgery
        //add Element
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/15/2012 05:00 PM', '03/15/2012 07:00 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '9137006')

        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Element - Condition:Diagnosis: Optic Atrophy
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Optic Atrophy')
        //add Timing Prevalent Period DateTime
        QDMElements.addTimingPrevalencePeriodDateTime('03/15/2012 07:00 PM')

        //add Code
        QDMElements.addCode('SNOMEDCT', '111527005')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        // change cql to randomly chosen valid QDM cql
        cy.get(EditMeasurePage.cqlEditorTab).click()
        CQLEditorPage.replaceCqlDocument('cypress/fixtures/QDMSDEMeasureAfterChanges.txt')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()

        // set up intercept - this API has the data needed for this specific check
        cy.intercept('/api/qdm/cql/relevant-elements').as('relevantElements')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.wait('@relevantElements')

        // verify 1st warning for SDE changes
        cy.get(TestCasesPage.editTestcaseSDEWarning).last().should('have.attr', 'aria-live', 'polite')
            .and('have.text', 'Your measure\'s Race, Sex, or Ethnicity value set has changed. The value in this test case is no longer valid. Please update the value to successfully match your measure.')

        // verify 2nd warning for changes to relevant elements & what element changed
        cy.get(TestCasesPage.editTestcaseRelevantElementsWarning).last().should('have.attr', 'aria-live', 'polite')
            .and('have.text', 'The following data elements in this test case are no longer relevant to the measure.Procedure, Performed')
    })
})






