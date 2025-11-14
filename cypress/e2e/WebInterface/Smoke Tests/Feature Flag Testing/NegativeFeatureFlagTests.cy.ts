import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { CreateMeasurePage, SupportedModels } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { Header } from "../../../../Shared/Header"
import { LandingPage } from "../../../../Shared/LandingPage"
import {CQLLibrariesPage} from "../../../../Shared/CQLLibrariesPage";

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('MM-DD-YYYY')
let mpEndDate = now().format('MM-DD-YYYY')

// "qiCoreElementsTab": false
describe('QI Core: Elements tab is not present', () => {

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

//"qiCore6": true
describe('Qi Core6 option available', () => {

    before('Login', () => {

        OktaLogin.Login()
    })

    it('Qi-Core v6.0.0 option available while creating New Measures', () => {

        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        Utilities.waitForElementVisible(LandingPage.newMeasureButton, 30000)
        Utilities.waitForElementEnabled(LandingPage.newMeasureButton, 30000)
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(CreateMeasurePage.measureNameTextbox).type(measureName)
        Utilities.waitForElementVisible(CreateMeasurePage.measureModelDropdown, 30000)
        cy.get(CreateMeasurePage.measureModelDropdown).click()
        Utilities.waitForElementVisible(CreateMeasurePage.measureModelQICorev6, 30000)
        cy.get(CreateMeasurePage.measureModelQICorev6).click()
        cy.get(CreateMeasurePage.eCQMAbbreviatedTitleTextbox).type('eCQMTitle01')
        cy.get(CreateMeasurePage.cqlLibraryNameTextbox).type(CqlLibraryName)

        cy.get(CreateMeasurePage.measurementPeriodStartDate).type(mpStartDate)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type(mpEndDate)

        cy.get(CreateMeasurePage.createMeasureButton).should('be.enabled')
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

// "QICoreIncludeSDEValues": false
describe('Qi Core Test Case Include SDE sub-tab / feature', () => {

    beforeEach('Create measure, create group, create test case, login and update CQL', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure()
    })

    it('Verify that SDE sub-tab is not available', () => {

        //navigate to the measures list page
        cy.get(Header.measures).click()

        //navigate to measure's detail page
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the SDE sub-tab is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.qdmSDESubTab, 35000)
    })
})

// "CompareLibraryVersions": false
describe('Compare Library versions / feature', () => {

    beforeEach('Login', () => {

        OktaLogin.Login()

    })

    afterEach('Logout', () => {

        OktaLogin.UILogout()
    })

    it('Verify that Compare Libraries Action button is not visible', () => {

        // Navigate to CQL Libraries page to ensure the action center would be present if enabled
        cy.get(Header.cqlLibraryTab).should('exist')
        cy.get(Header.cqlLibraryTab).should('be.visible')
        cy.get(Header.cqlLibraryTab).click()

        // Wait briefly for the page to render action center area (keep this short to avoid flakiness)
        cy.wait(1000)

        const selector = CQLLibrariesPage.actionCenterCompareVersions

        // If the element exists, ensure it's not visible. If it doesn't exist, the check also passes.
        cy.get('body').find(selector).then(($els) => {
            if ($els.length) {
                // Element exists in DOM -> assert it's not visible
                cy.wrap($els).should('not.be.visible')
            } else {
                // Element not present in DOM -> that's acceptable for "not visible"
                expect($els.length).to.equal(0)
            }
        })
    })

})
