
import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Header } from "../../../Shared/Header"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CQLLibraryPage } from "../../../Shared/CQLLibraryPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Test Case 1'
let testCaseDescription = 'Description 1'
let testCaseSeries = 'Test Series 1'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let QiCoremeasureCQL = MeasureCQL.CQL_Multiple_Populations
let prodBonneTestCasesFile = 'patients_39E0424A-1727-4629-89E2-C46C2FBB3F5F_QDM_56_1702482074.json'
let measureNamePropListQDM = 'QDMTestMeasure' + Date.now()
let CqlLibraryNamePropListQDM = 'QDMTestLibrary' + Date.now()
let measureCQLPRODCat = MeasureCQL.qdmMeasureCQLPRODCataracts2040BCVAwithin90Days
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

describe('Login and initial "My Measures" page', () => {

    it('Log in and land on "My Measures" page Lighthouse test', () => {

        OktaLogin.Login()

        const thresholds = {
            performance: 24, //This is an overall score given to the overall page performance based on the metrics.
            //The score is calculated based off the following metrics (their respective weights are also listed):
            //'first-contentful-paint' -> 10%
            //'largest-contentful-paint' -> 25%
            //'total-blocking-time' -> 30%
            //'cumulative-layout-shift' -> 25%
            //'speed-index' -> 10%

            accessibility: 76, //The Lighthouse Accessibility score is a weighted average of all accessibility audits. Weighting is based on axe user impact assessments.
            'total-blocking-time': 11000, //In miliseconds, this measure the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses.
            'speed-index': 54000, //In miliseconds, this measures how quickly content is visually displayed during page load.
            'cumulative-layout-shift': 100, //Unexpected page element shifts -- basically, the measurement of shifting page elements

        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality (ie: logging in and navigating to MADiE home page)
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)
        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })


    })

})

describe('Navigate to the "All Measures" page', () => {

    it('Navigate to "All Measures"', () => {

        OktaLogin.Login()
        cy.reload()
        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 50000)
        cy.get(MeasuresPage.allMeasuresTab).should('be.visible')
        cy.get(MeasuresPage.allMeasuresTab).scrollIntoView()
        cy.get(MeasuresPage.allMeasuresTab).click()

        const thresholds = {
            performance: 23,
            accessibility: 76,
            'total-blocking-time': 11000,
            'speed-index': 51000,
            'cumulative-layout-shift': 100,
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {

            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)
        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

})

describe('Navigate to the QDM "CQL Editor" page', () => {

    beforeEach('Create Measure, add Cohort group and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)

        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

    it('Navigate to QDM "CQL Editor" tab', () => {

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        const thresholds = {
            performance: 11,
            accessibility: 87,
            'total-blocking-time': 14000,
            'speed-index': 60000,
            'cumulative-layout-shift': 100,
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)
        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

})

describe('Navigate to the QDM "Test Cases" tab / test case list page', () => {
    before('Create Measure, group, and upload several test cases', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureNamePropListQDM, CqlLibraryNamePropListQDM, measureCQLPRODCat, false, false,
            '2012-01-01', '2012-12-31')

        OktaLogin.Login()
        cy.reload()
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully ' +
            'but the following issues were found')

        //Group Creation

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click().wait(2000)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.waitForElementVisible(MeasureGroupPage.denominatorSelect, 50000)
        cy.get(MeasureGroupPage.denominatorSelect).click()
            .get('ul > li[data-value="Denominator"]').wait(2000).click()
        Utilities.waitForElementVisible(MeasureGroupPage.denominatorExclusionSelect, 50000)
        cy.get(MeasureGroupPage.denominatorExclusionSelect).click()
            .get('ul > li[data-value="Denominator Exclusions"]').wait(2000).click()
        Utilities.waitForElementVisible(MeasureGroupPage.numeratorSelect, 50000)
        cy.get(MeasureGroupPage.numeratorSelect).click()
            .get('ul > li[data-value="Numerator"]').wait(2000).click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //import test cases from BONNIE PROD
        //click on the import test case button
        cy.get(TestCasesPage.qdmImportTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(prodBonneTestCasesFile)

        //import modal should contain test case name
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', '[82] Test Cases from File: patients_39E0424A-1727-4629-89E2-C46C2FBB3F5F_QDM_56_1702482074.json')

        //click on the 'Import' button on the modal window
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        cy.get(TestCasesPage.testCaseListTable).should('contain.text', 'Case #StatusGroupTitleDescriptionLast Saved82N/ADENEXPassCertTypeIridOverlapsCatSurgPatient with certain types of iridocyclitis overlapping cataract surgery. ' + todaysDate + 'Edit81N/ADENEXPassChorioretinitis and RetinochoroiditisOverlapsCatSurgPatient with moderate or severe impairment better eye overlapping cataract surgery. ' + todaysDate + 'Edit80N/ADENEXPassChoroidDegenOverlapsCatSurgPatient with choroidal degenerations overlapping cataract surgery. ' + todaysDate + 'Edit79N/ADENEXPassCloudyCorneaOverlapsCatSurgPatient with cloudy cornea overlapping cataract surgery. ' + todaysDate + 'Edit78N/ADENEXPassDegenDisGlobeOverlapsCatSurgPatient with degenerative disorders of globe overlapping cataract surgery. ' + todaysDate + 'Edit77N/ADENEXPassDisVisualCortexOverlapsCatSurgPatient with disorders of visual cortex overlapping cataract surgery. ' + todaysDate + 'Edit76N/ADENEXPassDissChorioretOverlapsCatSurgPatient with disseminated chorioretinitis overlapping cataract surgery. ' + todaysDate + 'Edit75N/ADENEXPassHeredCornDysOverlapsCatSurgPatient with hereditary corneal dystrophies overlapping cataract surgery. ' + todaysDate + 'Edit74N/ADENEXPassHypotonyOverlapsCatSurgPatient with hypotony of eye overlapping cataract surgery. ' + todaysDate + 'Edit73N/ADENEXPassInjOptNrvOverlapsCatSurgPatient with injury to optic nerve overlapping cataract surgery. ' + todaysDate + 'Edit')

        //success message that appears after import
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 10000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', '(82) Test cases imported successfully')
        Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 50000)
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })
    })

    it('Navigate to the QDM "Test Cases" tab after test cases have already been loaded on measure', () => {

        OktaLogin.Login()
        cy.reload()
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        //navigate to the test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        const thresholds = {
            performance: 17,
            accessibility: 78,
            'total-blocking-time': 13000,
            'speed-index': 65000,
            'cumulative-layout-shift': 100,
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)

        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

})

describe('Navigate to the Qi Core "Test Cases" edit page, for a specific test case', () => {
    beforeEach('Create measure, create group, and create test case', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, QiCoremeasureCQL, 0, false,
            '2012-01-02', '2013-01-01')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Qualifying Encounters', '', '', 'Qualifying Encounters', '', 'Qualifying Encounters', 'Encounter')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

    it('Navigate to the Qi Core "Test Cases" edit page, for a specific test case', () => {

        OktaLogin.Login()
        cy.reload()
        //Click on Edit Button
        MeasuresPage.actionCenter('edit')
        //navigate to the test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        const thresholds = {
            performance: 2,
            accessibility: 87,
            'total-blocking-time': 14000,
            'speed-index': 56000,
            'cumulative-layout-shift': 100,
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)

        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

})

describe('Navigate to the "My CQL Libraries" page', () => {
    beforeEach('Clear all cookies and storage', () => {


        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

    it('Navigate to the "My CQL Libraries" page', () => {

        OktaLogin.Login()
        cy.reload()
        cy.get(Header.cqlLibraryTab).click()
        const thresholds = {
            performance: 10,
            accessibility: 72,
            'total-blocking-time': 13000,
            'speed-index': 54000,
            'cumulative-layout-shift': 100,
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)

        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

})
describe('Navigate to the "All CQL Libraries" page', () => {
    beforeEach('Clear all cookies and storage', () => {


        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

    it('Navigate to the "All CQL Libraries" page', () => {

        OktaLogin.Login()
        cy.reload()
        cy.get(Header.cqlLibraryTab).click()
        Utilities.waitForElementVisible(CQLLibraryPage.allLibrariesBtn, 5000)
        cy.get(CQLLibraryPage.allLibrariesBtn).click().wait(2000)
        const thresholds = {
            performance: 10,
            accessibility: 72,
            'total-blocking-time': 20000,
            'speed-index': 50000,
            'cumulative-layout-shift': 100,
        };

        const lighthouseOptions = {
            formFactor: 'desktop', //sets the expected platform to be desktop (as opposed to mobile)
            screenEmulation: { disabled: true }, //because it is not moble, screen emulation is set to disabled
        }

        const lighthouseConfig = {
            settings: { output: "html" }, //output should be formated in HTML
            extends: "lighthouse:default", //the output extends onto lighthouse default settings
        }

        //calling lighthouse after performing some user functionality
        cy.lighthouse(thresholds, lighthouseOptions, lighthouseConfig)

        //adding closing line so the viewable Cypress logs will show that the report has been written
        cy.log("---- Lighthouse report has been written to disk ----")
        //log out of UI
        OktaLogin.UILogout()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
        cy.clearAllSessionStorage({ log: true })

    })

})
