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
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations

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

        MeasuresPage.measureAction("edit")

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
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit')

        //Elements tab should not be visible
        Utilities.waitForElementToNotExist(TestCasesPage.elementsTab, 20000)
    })
})

//“ShiftTestCasesDates”: true
describe('QI Core: Shift test case dates option on Test case list page', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary9' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Shift test case dates option visible on view Test case dropdown', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.selectTestCaseDropdownBtn).click()
        cy.get('[class="btn-container"]').should('contain', 'Shift Test Case dates')
        cy.reload()
    })
})

//"associateMeasures": true
describe.skip('QDM - to - QI Core measure association: Button to associate a QDM measure to a QI Core measure is available, while flag is set to true', () => {

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureQDMManifestName1 = 'QDMManifestTestMN1' + Date.now() + randValue + 8 + randValue
        QDMCqlLibraryName1 = 'QDMManifestTestLN1' + Date.now() + randValue + 9 + randValue

        //Create New QDM Measure
        //3
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName1, QDMCqlLibraryName1, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
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
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName0, QDMCqlLibraryName0, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC0', 'QDMManifestTCGroup0', 'QDMManifestTC0', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
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
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')


        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        QiCoreMeasureName0 = 'ProportionPatientMN0' + Date.now() + randValue + 2 + randValue
        QiCoreCqlLibraryName0 = 'ProportionPatientLN0' + Date.now() + randValue + 3 + randValue
        //Create second QI Core measure
        //0
        CreateMeasurePage.CreateQICoreMeasureAPI(QiCoreMeasureName0, QiCoreCqlLibraryName0, measureCQLPFTests, 2)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit", 2)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()

    })

    afterEach('Log Out', () => {

        OktaLogin.Logout()

    })

    it('Confirm that the associate measure feature is turned on', () => {

        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogCancel).click()
        cy.get(EditMeasurePage.cmsIdInput).should('not.exist')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        //Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogCancel, 3500)
        Utilities.waitForElementVisible(EditMeasurePage.cmsIDDialogContinue, 3500)
        cy.get(EditMeasurePage.cmsIDDialogContinue).click()
        cy.get(Header.mainMadiePageButton).click()
        cy.get('[data-testid="measure-name-0_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[data-testid="measure-name-1_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
        cy.get('[class="MeasureList___StyledDiv3-sc-pt5u8-5 jILQHN"]').click()
        // Utilities.waitForElementVisible('[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthMd MuiDialog-paperFullWidth css-cwpu7v"]', 37800)
        // cy.get('[data-testid="associate-cms-id-dialog-tbl"]').should('include.text', '0.0.000QI-Core v4.1.1Copy QDM Metadata to QI-Core measure')
        // Utilities.waitForElementVisible('[data-testid="cancel-button"]', 3700)
        Utilities.waitForElementEnabled('[data-testid="associate-cms-id-button"]', 3700)

    })
})

//"MeasureListCheckboxes": true
describe('Measure list page: Check boxes are present', () => {

    let newMeasureName = measureName + randValue + 8 + randValue
    let newCQLLibraryName = cqlLibraryName + randValue + 9 + randValue

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        OktaLogin.Login()

    })
    afterEach('Log Out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })
    it('Confirm that the measure list check boxes feature is turned on', () => {
        Utilities.waitForElementVisible(MeasuresPage.searchInputBox, 35000)
        Utilities.waitForElementVisible('[class="cursor-pointer select-none header-button"]', 35000)

        //check boxes are not present
        Utilities.waitForElementVisible('.header-button > .cursor-pointer', 35000)
    })
})

//"CQLBuilderDefinitions": false
describe('CQL Editor Page: Definition sub tab is not present', () => {

    let newMeasureName = measureName + randValue + 8 + randValue
    let newCQLLibraryName = cqlLibraryName + randValue + 9 + randValue

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        OktaLogin.Login()

    })
    afterEach('Log Out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })
    it('Confirm that the CQL Editor definition sub tab feature is turned off', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to the CQL Editor page
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //check boxes are not present
        Utilities.waitForElementToNotExist(CQLEditorPage.cqlEditorPageDefinitionSubTab, 3500)
    })
})

//"CQLBuilderIncludes": false
describe('CQL Editor Page: Includes sub tab is not present', () => {

    let newMeasureName = measureName + Date.now() + randValue + 8 + randValue
    let newCQLLibraryName = cqlLibraryName + Date.now() + randValue + 9 + randValue

    beforeEach('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        //Create New QDM Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        OktaLogin.Login()

    })
    afterEach('Log Out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })
    it('Confirm that the CQL Editor includes sub tab feature is turned off', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to the CQL Editor page
        cy.get(EditMeasurePage.cqlEditorTab).click()

        //check boxes are not present
        Utilities.waitForElementToNotExist(CQLEditorPage.cqlEditorPageIncludesSubTab, 3500)
    })
})
