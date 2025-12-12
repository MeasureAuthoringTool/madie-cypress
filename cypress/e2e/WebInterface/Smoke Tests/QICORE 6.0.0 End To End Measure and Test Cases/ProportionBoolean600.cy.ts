import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

const path = require('path')

let measureName = 'ProportionBoolean600' + Date.now()
let CqlLibraryName = 'ProportionBoolean600' + Date.now()
const measureCQL = MeasureCQL.CQL_BoneDensity_Proportion_Boolean

describe('Measure Creation and Testing: Proportion Episode Measure', () => {

    before('Create Measure, Test Case and Login', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6,
            { measureCql: measureCQL, mpStartDate: '2026-01-01', mpEndDate: '2026-12-31' })

        OktaLogin.Login()
    })

    after('Logout', () => {

        OktaLogin.UILogout()
    })

    it('End to End Proportion Episode Measure, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).wait(1000).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Proportion')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Denominator Exception')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 90000)
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 90000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile(path.join('cypress/fixtures', 'CMS645FHIR-v1.0.000-FHIR6-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 90000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'CMS645FHIR-v1.0.000-FHIR6-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        waitForValidationToBe100()

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 90000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 90000)
        cy.get(TestCasesPage.executeTestCaseButton).click()


        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(51/51)')

        //Verify Coverage percentage
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')


        //after versioning, there should be no change to test results or coverage

        //EditMeasurePage.actionCenter(EditMeasureActions.version)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).should('be.visible')
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).should('be.enabled')
        cy.get(EditMeasurePage.editMeasureVersionActionBtn).click()

        // version modal
        cy.get('#draggable-dialog-title').find('h2').should('have.text', 'Create Version')

        cy.get(MeasuresPage.versionMeasuresSelectionButton).click()
        cy.get(MeasuresPage.measureVersionMajor).click()

        // please leave this in place. it needs a short pause here for the modal to present new fields
        cy.wait(1000)

        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 90000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 90000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify Passing Tab's text after Versioning
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(51/51)')

        //Verify Coverage percentage after versioning
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
    })
})

function waitForValidationToBe100() {
    cy.get(TestCasesPage.testCaseListValidationPercTab)
        .invoke('text')
        .then((text: string) => {
            if (!text.includes('100%')) {
                cy.wait(5000)
                cy.reload()
                waitForValidationToBe100()
            }
        })
}