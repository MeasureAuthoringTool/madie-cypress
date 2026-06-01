import { CreateMeasureOptions, CreateMeasurePage, SupportedModels } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { QiCore6Cql } from "../../../../../Shared/FHIRMeasuresCQL"

const measureName = 'ImportTestCaseWithTwoMOs' + Date.now()
const CqlLibraryName = 'ImportTestCaseWithTwoMOsLib' + Date.now()
const opts: CreateMeasureOptions = {
    measureCql: QiCore6Cql.cqlCMS1017, // test measure based on CMS1017FHIR
    mpStartDate: '2026-01-01',
    mpEndDate: '2026-12-31'
}

/* 
Note: this is essentially the same measure set-up from 
 .../Smoke Tests/QICORE 6.0.0 End To End Measure and Test Cases/RatioEncounterSingleIPWithMOs600.cy.ts
 with the only difference being this scenario imports the test case instead of enterring the data
 */
describe('Import test case with 2 MOs using QMIG STU5 group name structures', () => {

    before('Create Measure', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, opts)

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.populationSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get('[data-value="Denominator Observation"]').click()
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get('[data-value="Sum"]').click()
        Utilities.populationSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get('[data-value="Numerator Observation"]').click()
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get('[data-value="Count"]').click()
        Utilities.populationSelect(MeasureGroupPage.numeratorExclusionSelect, 'Numerator Exclusions')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('Import test case zip & execute tests', () => {

        cy.get(EditMeasurePage.testCasesTab).click()

        // import testcase zip
        cy.get(TestCasesPage.importTestCasesBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        // this file was generated post 2.2.0, with the QMIG STU5 naming structure
        // MAT-9275 - this export is a transaction bundle & will be transformed to a collection after release of TestCase Builder
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/fixtures/Multiple-MO-FHIR-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'Multiple-MO-FHIR-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        TestCasesPage.grabTestCaseId(1)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.runTestButton).click()

        // validate pass - checkmark icon at top of table
        cy.get('[data-icon="circle-check"]').should('have.color', '#0e9a5b')
    })
})
