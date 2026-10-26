import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { Utilities } from '../../../../Shared/Utilities'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { MonacoEditor } from '../../../../Shared/MonacoEditor'

const now = Date.now()
const measureName = 'CQLPageObject' + now
const CqlLibraryName = 'CQLPageObjectLib' + now
const validMeasureCQL =
    `library ${measureName} version '0.0.000'\n` +
    "using QICore version '4.1.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n\n" +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient'
const measureCQL =
    "library SimpleFhirLibrary version '0.0.004'\n" +
    "using QICore version '4.1.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers"
const testCaseTitle = 'test case title'
const testCaseSeries = 'SBTestSeries'
const testCaseDescription = 'DENOMFail' + Date.now()
const tcJson = TestCaseJson.TestCaseJson_Valid

describe('Test Case Page CQL page object', () => {
    beforeEach('Create Measure, TestCase and Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, validMeasureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, tcJson)
        OktaLogin.SessionLogin()
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('persists updates applied and saved in the Measure CQL Editor', () => {
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.openMonacoCqlEditor()
        MonacoEditor.append(EditMeasurePage.monacoCqlEditor, 'define "ipp": true', 'center')
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'define "ipp": true')
        cy.intercept('PUT', /\/api\/measures\/[^/?]+(?:\?.*)?$/, (request) => {
            expect(request.body.cql).to.match(/^library /)
            expect(request.body.cql).to.include('\ncontext Patient\ndefine "ipp": true')
        })
        CQLEditorPage.saveMonacoCql({ appendNewLine: false, waitForDisabled: true })

        CQLEditorPage.openMonacoCqlEditor()
        MonacoEditor.assertRenderedText(EditMeasurePage.monacoCqlEditor, 'define "ipp": true')
    })
})

describe('Test Case Page CQL page object', () => {
    beforeEach('Create Measure, TestCase and Login', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, tcJson)
        OktaLogin.SessionLogin()
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('A message is displayed if there are issues with the CQL', () => {
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //edit created test case
        TestCasesPage.clickEditforCreatedTestCase()

        //add section / line to validate message letting user know of error with CQL
        cy.get(TestCasesPage.testCaseSyntaxError)
            .should('be.visible')
            .and('contain.text', 'An error exists with the measure CQL, please review the CQL Editor tab.')
    })
})
