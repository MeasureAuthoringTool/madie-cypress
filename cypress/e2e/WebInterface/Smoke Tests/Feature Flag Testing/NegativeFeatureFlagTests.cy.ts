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

//"enableQdmRepeatTransfer" : true
describe('QDM: Measure Version option Should not exist', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    beforeEach('Create Measure, add Cohort group and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure Version option should not exist for QDM Draft Measures', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.enabled')
            cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
            cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('not.exist')
        })
        cy.reload()
        Utilities.waitForElementVisible(Header.userProfileSelect, 60000)
    })
})

//"generateCMSID": true
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

//"includeSDEValues": true
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

//"manifestExpansion": false
describe('QDM: Expansion Manifest sub-tab / section is not available when flag is set to false', () => {

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

    it('"Expansion" is not an available side sub-tab option, on the Test Case list page', () => {
        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.qdmExpansionSubTab).should('not.exist')
    })
})

//"TestCaseExport" : false
describe('QDM: Test Case QRDA Export', () => {

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

    it('QRDA Test case Export button not visible when the feature flag is enabled', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testcaseQRDAExportBtn).should('not.exist')
    })
})

//"QDMCodeSearch": false
describe('QDM: Code search on CQL editor tab', () => {

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

    it('QDM Code search page not visible when the feature flag is enabled', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get('[data-testid="codes-tab"]').should('not.exist')
    })
})