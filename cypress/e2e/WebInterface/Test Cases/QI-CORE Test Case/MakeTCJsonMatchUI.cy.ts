import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { Utilities } from '../../../../Shared/Utilities'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { TestData } from '../../../../Shared/TestData'

const now = Date.now()
const measureName = 'JSONMatchUI' + now
const CqlLibraryName = 'JSONMatchUILib' + now
const testCaseTitle = 'test case title'
const testCaseDescription = 'DENOMFail' + now
const testCaseSeries = 'SBTestSeries'
const measureCQLPFTests = MeasureCQL.CQL_Populations
const testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Success Scenario - Make Test Case Json match UI', () => {
    beforeEach('Create measure and login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveMonacoCql({ collapseEditor: true, waitForDisabled: false })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Make Family and Given names from Test Case Json match with Test Case UI', () => {
        //Navigate to Test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to Edit Test case page and verify family and given name on Json before match
        TestCasesPage.clickEditforCreatedTestCase()
        TestData.requestMeasureTestCase<{ json: string }>('GET').then(({ body, status }) => {
            expect(status).to.eq(200)
            const json = body.json.replace(/\s/g, '')
            expect(json).to.contain('"family":"Health"')
            expect(json).to.contain('"given":["Lizzy"]')
        })

        //Navigate to Test case List page and make Json match the UI
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get('[data-testid="test-case-title-0_select"]').click()
        cy.get('[data-testid="make-json-match-ui-action-btn"]').click()
        cy.get('.MuiDialog-paper > .MuiBox-root').should('contain.text', 'Are you sure?')
        cy.get('.MuiDialogContent-root').should(
            'have.text',
            'For each of the selected 1 test cases, you are about to:Set all "family" fields in the JSON to the group value that was entered in the UISet all "given" fields in the JSON to the title value that was entered in the UIAre you sure you want to proceed?'
        )
        cy.get('[data-testid="make-json-match-ui-continue-button"]').click()
        cy.get('.toast').should('contain.text', 'All family and given fields have been set for the selected test cases')
        Utilities.waitForElementToNotExist('.toast', 60000)

        //Navigate to Edit Test case page and verify family and given name on Json after match
        TestCasesPage.clickEditforCreatedTestCase()
        TestData.requestMeasureTestCase<{ json: string }>('GET').then(({ body, status }) => {
            expect(status).to.eq(200)
            const json = body.json.replace(/\s/g, '')
            expect(json).to.contain('"family":"SBTestSeries"')
            expect(json).to.contain('"given":["testcasetitle"]')
        })
    })
})

describe('Error message when making Test case match', () => {
    beforeEach('Create measure and login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveMonacoCql({ collapseEditor: true, waitForDisabled: false })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Verify error message when the Test case does not have Json', () => {
        //Navigate to Test case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get('[data-testid="test-case-title-0_select"]').click()
        cy.get('[data-testid="make-json-match-ui-action-btn"]').click()
        cy.get('[data-testid="make-json-match-ui-continue-button"]').click()
        cy.get(EditMeasurePage.errorMessage).should(
            'contain.text',
            'The operation could not be completed on the selected test cases. Review the JSON to make changes manually.'
        )
    })
})
