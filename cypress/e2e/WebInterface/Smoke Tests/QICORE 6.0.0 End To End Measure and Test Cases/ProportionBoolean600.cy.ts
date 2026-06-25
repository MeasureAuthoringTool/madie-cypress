import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from '../../../../Shared/MeasureGroupPage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'

const path = require('path')

let measureName = 'ProportionBoolean600' + Date.now()
let CqlLibraryName = 'ProportionBoolean600' + Date.now()
const measureCQL = MeasureCQL.CQL_BoneDensity_Proportion_Boolean
const pops: MeasureGroups = {
    initialPopulation: 'Initial Population',
    denominator: 'Denominator',
    numerator: 'Numerator',
    denomException: 'Denominator Exception'
}

describe('Measure Creation and Testing: Proportion Episode Measure', () => {
    before('Create Measure, Test Case and Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {
            measureCql: measureCQL,
            mpStartDate: '2026-01-01',
            mpEndDate: '2026-12-31',
        })
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.boolean, MeasureScoring.Proportion, pops)

        OktaLogin.Login()
    })

    after('Logout', () => {
        Utilities.deleteMeasure()
    })

    it('End to End Proportion Episode Measure, Pass Result', () => {

        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        Utilities.waitForElementVisible(TestCasesPage.importTestCasesBtn, 30000)
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 30000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.filAttachDropBox).selectFile(
            path.join('cypress/fixtures', 'CMS645FHIR-v1.0.000-FHIR-TestCases.zip'),
            { action: 'drag-drop', force: true },
        )

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 30000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should(
            'contain.text',
            'CMS645FHIR-v1.0.000-FHIR-TestCases.zip',
        )

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        waitForValidationToBe100()

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify Passing Tab's text 
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(5/5)')

        //Verify Coverage percentage 
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '85%')

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

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 30000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify Passing Tab's text 
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(5/5)')

        //Verify Coverage percentage 
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '85%')
    })
})

function waitForValidationToBe100(retries = 0) {
    const maxRetries = 24 // 24 retries × 5s wait = ~2 minutes max
    cy.get(TestCasesPage.testCaseListValidationPercTab)
        .invoke('text')
        .then((text: string) => {
            if (!text.includes('100%')) {
                if (retries >= maxRetries) {
                    throw new Error(`Validation did not reach 100% after ${maxRetries} retries. Last value: "${text}"`)
                }
                cy.wait(5000)
                cy.reload()
                waitForValidationToBe100(retries + 1)
            }
        })
}
