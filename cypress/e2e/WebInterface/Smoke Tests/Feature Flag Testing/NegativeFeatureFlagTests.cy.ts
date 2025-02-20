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
import { Environment } from "../../../../Shared/Environment"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage"
import { MadieObject, PermissionActions } from "../../../../Shared/Utilities"

let CQLLibraryName = 'TestLibrary' + Date.now()
let newCQLLibraryName = ''
let CQLLibraryPublisher = 'SemanticBits'
let harpUserALT = Environment.credentials().harpUserALT
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations
const now = require('dayjs')
let mpStartDate = now().subtract('2', 'year').format('MM-DD-YYYY')
let mpEndDate = now().format('MM-DD-YYYY')

// "qiCoreBonnieTestCases": false
describe('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

        MeasuresPage.actionCenter("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.bonnieImportTestCaseBtn, 35000)


    })
})

// "qiCoreElementsTab": false
describe('QI Core: Elements tab is not present', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)

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

    afterEach('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('UI Elements Builder not shown on test cases for 6.0.0 measures', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore6)

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()

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

//"LibraryListCheckboxes": false
describe('Confirm that check boxes for CQL Libraries do not appear', () => {

    beforeEach('Create CQL Library', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newCQLLibraryName = CQLLibraryName + randValue + randValue + 1

        CQLLibraryPage.createCQLLibraryAPI(newCQLLibraryName, CQLLibraryPublisher)
        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()
    })

    after('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Confirm that check boxes do not exist, for CQL Libraries, while the feature flag is set to false', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        //set local user that does not own the Library
        cy.setAccessTokenCookie()

        //Share Library with ALT User
        Utilities.setSharePermissions(MadieObject.Library, PermissionActions.GRANT, harpUserALT)

        OktaLogin.Login()
        cy.get(Header.cqlLibraryTab).click()

        Utilities.waitForElementToNotExist('[data-testid*="cqlLibrary-button-0_select"]', 50000)
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
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Verify that SDE sub-tab is not available', () => {

        MeasuresPage.actionCenter("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.qdmSDESubTab, 35000)


    })
})
