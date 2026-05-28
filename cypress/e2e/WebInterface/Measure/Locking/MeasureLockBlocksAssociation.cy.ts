import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, CreateMeasureOptions, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MadieObject, PermissionActions, Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CVGroups, MeasureGroupPage, MeasureGroups, MeasureScoring, MeasureType, PopulationBasis } from "../../../../Shared/MeasureGroupPage"
import { Header } from "../../../../Shared/Header"
import { QdmCql } from "../../../../Shared/QDMMeasuresCQL"
import { QiCore6Cql } from "../../../../Shared/FHIRMeasuresCQL"

const now = Date.now()
const qdmMeasureName = 'LockBlockQDM' + now
const qicoreMeasureName = 'LockBlockQicore' + now
const qdmManifestTestCQL = QdmCql.qdmCQLManifestTest
const qiCoreCql = QiCore6Cql.cqlCMS1272
let harpUserALT = ''

const pops: MeasureGroups = {
    initialPopulation: '',
    numerator: '',
    denominator: ''
}
const cvPops: CVGroups = {
    initialPopulation: 'Initial Population',
    measurePopulation: 'Measure Population',
    observation: {
        aggregateMethod: "Median",
        definition: "Measure Observation"
    }
}

describe('Measure Association is not allowed when QiCore measure is locked', () => {

    beforeEach('Create measures', () => {

        harpUserALT = OktaLogin.getUser(true)

        // need QiCore measure in measureId
        CreateMeasurePage.CreateMeasureAPI(qicoreMeasureName, qicoreMeasureName, SupportedModels.qiCore6, { measureCql: qiCoreCql })
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.process, PopulationBasis.encounter, MeasureScoring.ContinousVariable, pops, false, undefined, undefined, cvPops)

        const qdmMeasure: CreateMeasureOptions = {
            ecqmTitle: qdmMeasureName,
            cqlLibraryName: qdmMeasureName,
            measureScoring: 'Proportion',
            patientBasis: 'false',
            measureCql: qdmManifestTestCQL,
            mpStartDate: '2025-01-01',
            mpEndDate: '2025-12-31',
            measureNumber: 2
        }

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(qdmMeasure)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(2, false, 'Initial Population', '', 'Denominator Exceptions',
            'Numerator', '', 'Denominator')

        // shares QiCore measure to harpUserALT - need this user to lock the measure later
        Utilities.setSharePermissions(MadieObject.Measure, PermissionActions.GRANT, harpUserALT)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('edit', 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 15500)

        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()

        cy.get(Header.mainMadiePageButton).click()
    })

    afterEach('Clean up', () => {

        Utilities.deleteMeasure()
        Utilities.deleteMeasure(undefined, undefined, true, false, 2)
    })

    it('When QiCore measure is locked & lock is visible, the action center button is disabled with message tooltip', () => {

        // sets lock on QiCore measure by altUser
        Utilities.lockControl(MadieObject.Measure, true, true)

        // this ensures we load the list with visibility of the lock & that we reset the tokens correctly
        OktaLogin.Login()

        MeasuresPage.selectMeasure()
        MeasuresPage.selectMeasure(2)

        cy.get('[data-testid="associate-cms-id-action-btn"]').should('be.disabled')
        cy.get('[data-testid="associate-cms-id-tooltip"]').should('have.attr', 'aria-label', 'Unable to associate measures. Locked while being edited by ' + harpUserALT)

        //Delete Measure Locks
        Utilities.verifyAllLocksDeleted(MadieObject.Measure, true)
    })

    // we can't do this scenario right now - we'd need a big refactor or enhancement for handling access tokens
    it.skip('When QiCore measure is locked & lock is NOT visible, the Associate Measure modal fails with error message', () => {

        // sets lock on QiCore measure by altUser
        Utilities.lockControl(MadieObject.Measure, true, true)

        // need to reset tokens here for main user?
        // goal: set lock with alt & continue process with main, no refreshes

        MeasuresPage.actionCenter('associatemeasure')

        // validate modal shows correct error message about block by lock
    })
})