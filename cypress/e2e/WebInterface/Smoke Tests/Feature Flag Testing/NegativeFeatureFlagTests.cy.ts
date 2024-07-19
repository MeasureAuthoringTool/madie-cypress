import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage";

let randValue = (Math.floor((Math.random() * 1000) + 1))
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let QiCoreMeasureName0 = ''
let QiCoreCqlLibraryName0 = ''
let QiCoreMeasureName1 = ''
let QiCoreCqlLibraryName1 = ''
let measureQDMManifestName0 = ''
let QDMCqlLibraryName0 = ''
let measureQDMManifestName1 = ''
let QDMCqlLibraryName1 = ''
let measureName = 'TestMeasure' + Date.now()
let filePath = 'cypress/fixtures/measureId'
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let measureCQL = MeasureCQL.QDMTestCaseCQLFullElementSection
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Cohort'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations

// "qiCoreBonnieTestCases": false
describe('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.bonnieImportTestCaseBtn, 35000)


    })
})

// "qdmExport": true
describe('QDM Measure Export: Export option is available', () => {

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, false, measureCQL)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'boolean')
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })


    it('QDM Measure Export: Export option for measure is available', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
            cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
            cy.get('[data-testid="export-measure-' + fileContents + '"]').should('exist')

            cy.reload()
            Utilities.waitForElementVisible(Header.userProfileSelect, 60000)
        })

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
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit')

        //Elements tab should not be visible
        Utilities.waitForElementToNotExist(TestCasesPage.elementsTab, 20000)
    })
})

// "generateCMSID": true
describe('QDM: Generate CMS ID', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('CMS Id generation for QDM Measure', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        cy.get(EditMeasurePage.cmsIdInput).should('exist')

    })
})

// "includeSDEValues": true
describe('QDM: Configuration sub tab', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', false, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.wait(3000)
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie().wait(3000)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie().wait(3000)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Configuration sub tab should be displayed on QDM Test Case list page', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementVisible(TestCasesPage.newTestCaseButton, 60000)
        cy.get(TestCasesPage.configurationSubTab).should('be.visible')

    })
})

// "TestCaseExport" : true
describe('QDM: Test Case Export button and it\s sub-action buttons', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
    let randValueQICore = (Math.floor((Math.random() * 100) + 1))
    let qiCoreTestMeasureName = 'QICoreMeasure' + randValueQICore + Date.now()
    let qiCoreTestCqlLibName = 'QICoreMeasure' + + randValueQICore + Date.now()

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    it('QDM Test case Export button is visible when the feature flag is set to true', () => {

        // edit QDM measure and confirm that the Export button does not exist, at all, for QDM
        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testcaseQRDAExportBtn).should('exist')

        // log out of MADiE UI
        OktaLogin.UILogout()

        // create QI Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(qiCoreTestMeasureName, qiCoreTestCqlLibName, measureCQLAlt)

        // log back into MADiE UI
        OktaLogin.Login()

        //Click on Edit Measure and make insignificant edit to CQL and save
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        // navigate to MADiE's homepage
        cy.get(Header.measures).click()

        // edit QI Core measure
        MeasuresPage.measureAction('edit')

        // navigate to the Test Case list page, for the QI Core Measure
        cy.get(EditMeasurePage.testCasesTab).click()

        // find and click on the export button that appears for the QI Core Measure's test case list page
        cy.get(TestCasesPage.exportTestCasesBtn)
            .find('[class="export-action"]')
            .scrollIntoView()
            .click({ force: true })

        // confirm that only the action buttons that should appear are appearing on page
        Utilities.waitForElementToNotExist(TestCasesPage.exportExcelBtn, 30000)
        Utilities.waitForElementVisible(TestCasesPage.exportTransactionBundleBtn, 30000)
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionBundleBtn, 30000)


    })
})

//“ShiftTestCasesDates”: false
describe('QI Core: Shift test case dates option on Test case list page', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary9' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Shift test case dates option not visible on view Test case dropdown', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        cy.get('[class="btn-container"]').should('not.contain', 'Increment Dates')
        cy.reload()
    })
})

//"associateMeasures": false
describe('QDM - to - QI Core measure association: Button to associate a QDM measure to a QI Core measure is not available, while flag is set to false', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //3
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName0 = 'QDMManifestTestMN0' + Date.now() + randValue + 6 + randValue
        QDMCqlLibraryName0 = 'QDMManifestTestLN0' + Date.now() + randValue + 7 + randValue

        //Create Second QDM Measure
        //2
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName0, QDMCqlLibraryName0, 'Proportion', false, qdmManifestTestCQL, true, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC0', 'QDMManifestTCGroup0', 'QDMManifestTC0', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName1 = 'ProportionPatientMN1' + Date.now() + randValue + 4 + randValue
        QiCoreCqlLibraryName1 = 'ProportionPatientLN1' + Date.now() + randValue + 5 + randValue
        //Create new QI Core measure
        //1
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName1, QiCoreCqlLibraryName1, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName0 = 'ProportionPatientMN0' + Date.now() + randValue + 2 + randValue
        QiCoreCqlLibraryName0 = 'ProportionPatientLN0' + Date.now() + randValue + 3 + randValue
        //Create second QI Core measure
        //0
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName0, QiCoreCqlLibraryName0, measureCQLPFTests, true)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, false, false, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()

    })

    afterEach('Log Out', () => {

        OktaLogin.Logout()

    })

    it('Confirm that the associate measure feature is turned off', () => {

        Utilities.waitForElementToNotExist('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]', 35000)
        Utilities.waitForElementToNotExist('[data-testid="associate_cms_id_tooltip"]', 35000)

    })
})

//"MeasureListCheckboxes": false
describe('Measure list page: Check boxes are not present', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //0
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })
    afterEach('Log Out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureQDMManifestName1, QDMCqlLibraryName1)

    })
    it('Confirm that the measure list check boxes feature is turned off', () => {
        OktaLogin.Login()
        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 35000)
        Utilities.waitForElementVisible('[class="cursor-pointer select-none header-button"]', 35000)

        //check boxes are not present
        Utilities.waitForElementToNotExist('[data-testid="measure-name-0_select"]', 35000)
    })
})

//"CQLBuilderDefinitions": false
describe('CQL Editor Page: Definition sub tab is not present', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //0
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", false, true, true)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })
    afterEach('Log Out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureQDMManifestName1, QDMCqlLibraryName1)

    })
    it('Confirm that the CQL Editor definition sub tab feature is turned off', () => {
        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to the CQL Editor page
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //check boxes are not present
        Utilities.waitForElementToNotExist(CQLEditorPage.cqlEditorPageDefinitionSubTab, 3500)
    })
})