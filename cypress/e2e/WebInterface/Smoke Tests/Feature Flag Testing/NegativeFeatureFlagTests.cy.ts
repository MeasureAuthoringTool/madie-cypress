import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore

// "qiCoreElementsTab": false
describe('QI Core v4: Elements tab is not present', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        CqlLibraryName = 'TestCql' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLAlt)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('QI Core Test Case edit page: Ensure / verify that the Elements tab does not exist on the QI Core Test Case edit page', () => {

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Elements tab should not be visible
        Utilities.waitForElementToNotExist(TestCasesPage.elementsTab, 20000)
    })
})

//"qiCoreElementsTab": false
describe('QI Core v6: UI Elements Builder tab is not shown', () => {

    before('Set up', () => {

        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
    })

    after('Clean up', () => {

        Utilities.deleteMeasure()
    })

    it('UI Elements Builder not shown on test cases for 6.0.0 measures', () => {

        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 30000)
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        // no options show, only default editor
        cy.get(TestCasesPage.jsonTab).should('not.exist')
        cy.get(TestCasesPage.elementsTab).should('not.exist')
        cy.get('.tab-container').should('not.exist')

        // assert that blank editor field is there
        cy.get(TestCasesPage.aceEditorJsonInput).should('be.empty')
    })
})
