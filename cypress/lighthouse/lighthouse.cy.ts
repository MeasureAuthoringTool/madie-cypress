
import { OktaLogin } from "../Shared/OktaLogin"
import { CreateMeasureOptions, CreateMeasurePage } from "../Shared/CreateMeasurePage"
import { MeasuresPage } from "../Shared/MeasuresPage"
import { EditMeasurePage } from "../Shared/EditMeasurePage"
import { Utilities } from "../Shared/Utilities"
import { CQLEditorPage } from "../Shared/CQLEditorPage"
import { Header } from "../Shared/Header"
import { MeasureCQL } from "../Shared/MeasureCQL"
import { TestCasesPage } from "../Shared/TestCasesPage"
import { MeasureGroupPage } from "../Shared/MeasureGroupPage"
import { TestCaseJson } from "../Shared/TestCaseJson"
import { CQLLibraryPage } from "../Shared/CQLLibraryPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Test Case 1'
let testCaseDescription = 'Description 1'
let testCaseSeries = 'Test Series 1'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let QiCoremeasureCQL = MeasureCQL.CQL_Multiple_Populations
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.returnBooleanPatientBasedQDM_CQL

const measureData: CreateMeasureOptions = {}

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
            'total-blocking-time': 13000, //In miliseconds, this measure the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses.
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
            'total-blocking-time': 17000,
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

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

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
        cy.get(Header.cqlLibraryTab).click().wait(3500)
        Utilities.waitForElementVisible(CQLLibraryPage.allLibrariesTab, 5000)
        cy.reload()
        cy.get(CQLLibraryPage.allLibrariesTab).wait(3500).click().wait(3500)
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
