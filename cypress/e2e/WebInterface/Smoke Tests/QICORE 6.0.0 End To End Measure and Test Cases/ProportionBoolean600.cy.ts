import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import {EditMeasureActions, EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

const path = require('path')

let measureName = 'ProportionBoolean600' + Date.now()
let CqlLibraryName = 'ProportionBoolean600' + Date.now()
const measureCQL = MeasureCQL.CQL_BoneDensity_Proportion_Boolean

describe('Measure Creation and Testing: Proportion Episode Measure', () => {

    before('Create Measure, Test Case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6,
            { measureCql: measureCQL, mpStartDate: '2026-01-01', mpEndDate: '2026-12-31' })

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Proportion Episode Measure, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

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
        Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 65000)
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile(path.join('cypress/fixtures', 'CMS645FHIR-v1.5.000-FHIR6-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'CMS645FHIR-v1.5.000-FHIR6-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 65000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(49/49)')

        //Verify Coverage percentage
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '99%')


        //after versioning, there should be no change to test results or coverage

        EditMeasurePage.actionCenter(EditMeasureActions.version)

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 65000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 65000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify Passing Tab's text after Versioning
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(49/49)')

        //Verify Coverage percentage after versioning
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '99%')

    })
})
