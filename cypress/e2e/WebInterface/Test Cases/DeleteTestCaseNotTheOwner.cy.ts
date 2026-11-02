import { CreateMeasurePage } from '../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { Utilities } from '../../../Shared/Utilities'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { TestCasesPage } from '../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { LandingPage } from '../../../Shared/LandingPage'
import { TestData } from '../../../Shared/TestData'

let measureName: string
let cqlLibraryName: string
let measureCQL: string
let testCaseTitle: string
const testCaseDescription = 'DENOMFail test case'
const testCaseGroup = 'SBTestSeries'

describe('Delete Test Case', () => {
    beforeEach('Create test data and log in as non-owner', () => {
        const scenarioId = Date.now()
        measureName = `DeleteTC${scenarioId}`
        cqlLibraryName = `DeleteTCLib${scenarioId}`
        measureCQL = MeasureCQL.ICFCleanTest_CQL.replace('SimpleFhirLibrary', cqlLibraryName)
        testCaseTitle = `Title for Auto Test ${scenarioId}`

        CreateMeasurePage.CreateQICoreMeasureAPI(
            measureName,
            cqlLibraryName,
            measureCQL,
            0,
            false,
            '2012-01-02',
            '2013-01-01'
        )
        TestData.saveCurrentMeasureCql().then(TestData.expectSavedMeasureCql)

        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'Procedure'
        )
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseGroup, testCaseDescription)
        return OktaLogin.AltLogin()
    })

    afterEach('Logout and Clean up Measures', () => {
        return Utilities.deleteMeasure()
    })

    it('Verify Non owner of the Measure unable to delete Test Case', () => {
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible').and('be.enabled').click()

        MeasuresPage.actionCenter('edit')
        TestCasesPage.openTestCasesTabAndWaitForList()

        TestCasesPage.checkTestCaseByTitle(testCaseTitle)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).should('be.visible').click()
        cy.get(TestCasesPage.actionCenterDelete).should('not.exist')
        cy.get(TestCasesPage.importTestCaseBtn).should('not.exist')
        cy.get(TestCasesPage.newTestCaseButton).should('not.exist')

        cy.get(TestCasesPage.actionCenterExport).should('be.enabled')
        cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled')

        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.reportsButton).should('be.visible')
        TestData.readTestCaseId().then((testCaseId) => {
            cy.get(TestCasesPage.getViewEditTestCaseButtonSelector(testCaseId)).should('have.text', 'View')
        })
    })
})
