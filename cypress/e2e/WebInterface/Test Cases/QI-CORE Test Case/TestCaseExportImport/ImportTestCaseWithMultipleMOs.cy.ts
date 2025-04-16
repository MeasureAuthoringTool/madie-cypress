import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { QiCore4Cql } from "../../../../../Shared/FHIRMeasuresCQL"

const measureName = 'ImportTestCaseWithTwoMOs' + Date.now()
const CqlLibraryName = 'ImportTestCaseWithTwoMOsLib' + Date.now()
const measureCQL = QiCore4Cql.ratioEpisodeTwoIPTwoMO

/* 
Note: this is essentially the same measure set-up from 
 .../Smoke Tests/QICORE 4.1.1 End To End Measure and Test Cases/RatioEpisodeTwoIPsWithMOs.cy.ts
 with the only difference being this scenario imports the test case instead of enterring he dataa
 */
describe('Import test case with 2 MOs using QMIG STU5 group name structures', () => {

    before('Create Measure', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2022-01-01', '2022-12-31')

        OktaLogin.Login()

        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Encounter')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        cy.get(MeasureGroupPage.addSecondInitialPopulationLink).click()

        Utilities.populationSelect(MeasureGroupPage.firstInitialPopulationSelect, 'Initial Population 1')
        Utilities.populationSelect(MeasureGroupPage.secondInitialPopulationSelect, 'Initial Population 2')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()
        cy.get(MeasureGroupPage.addNumeratorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).click()
        cy.get('[data-value="Denominator Observation"]').click()
        cy.get(MeasureGroupPage.denominatorAggregateFunction).click()
        cy.get('[data-value="Sum"]').click()
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, 'Numerator')
        cy.get(MeasureGroupPage.numeratorObservation).click()
        cy.get('[data-value="Numerator Observation"]').click()
        cy.get(MeasureGroupPage.numeratorAggregateFunction).click()
        cy.get('[data-value="Sum"]').click()

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

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Import test case zip & execute tests', () => {

        cy.get(EditMeasurePage.testCasesTab).click()

        // import testcase zip
        cy.get(TestCasesPage.importTestCasesBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        // this file was generated post 2.2.0, with the QMIG STU5 naming structure
        cy.get(TestCasesPage.filAttachDropBox).selectFile('cypress/fixtures/Multiple-MO-FHIR4-TestCases.zip', { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'Multiple-MO-FHIR4-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        // execute, check pass
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 11500)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get('[data-testid="passing-tab"]').should('have.text', '100% Passing (1/1)')

        TestCasesPage.grabTestCaseId(1)
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.runTestButton).click()

        // validate pass - checkmark icon at top of table
        cy.get('[data-icon="circle-check"]').should('have.color', '#0e9a5b')
    })
})
