import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage, CreateMeasureOptions } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

let newMeasureName = ''
let newCqlLibraryName = ''
const measureName = 'MeasureHighlightQDM'
const CqlLibraryName = 'MeasureHighlightQDMLib'
const scoringPropValue = 'Proportion'
const testCaseTitle = 'test case title'
const testCaseDescription = 'example test case'
const testCaseSeries = 'SBTestSeries'
const measureCQLPFTests = MeasureCQL.QDMHighlightingTab_CQL
const measureCQLDUTest = MeasureCQL.QDMHightlightingTabDefUsed_CQL
const QDMTCJson = TestCaseJson.tcJSON_QDM_Value

const measureData: CreateMeasureOptions = {}

describe('QDM Test Case Highlighting', () => {

    beforeEach('Create measure, measure group, test case and login', () => {

        newMeasureName = measureName + Date.now()
        newCqlLibraryName = CqlLibraryName + Date.now()

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLDUTest
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0, false, 'Initial Population', '', '', 'Numerator', '', 'Denominator', 'boolean'
        )
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure()
    })

    it('Highlighting happens & presents "Definitions used"', () => {
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the highlighting sub tab
        Utilities.waitForElementVisible(TestCasesPage.tcHighlightingTab, 60000)
        cy.get(TestCasesPage.tcHighlightingTab).click()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.qdmTCHighlightingDU).should('be.visible')
    })
})

describe('QDM Test Case Highlighting - Definitions, Functions, and Unused sections', () => {

    beforeEach('Create measure, measure group, test case and login', () => {

        newMeasureName = measureName + Date.now()
        newCqlLibraryName = CqlLibraryName + Date.now()

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLPFTests
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0, false, 'Initial Population', '', '', 'Numerator', '', 'Denominator', 'boolean'
        )
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure()
    })

    it('Secondary tabs in Highlighting section populate after execution', () => {
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()
        Utilities.waitForElementVisible('[data-testid="cql-highlighting"] > :nth-child(2)', 35000)
        cy.get('[data-testid="cql-highlighting"] > :nth-child(2)').should('contain.text', 'Results[Encounter, Performed: Closed Head and Facial Trauma\nSTART: 01/09/2025 6:00 AM\nSTOP: 01/17/2025 6:00 AM\nCODE: SNOMEDCT 110246003] ')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Functions').click()
        Utilities.waitForElementVisible('[data-testid="cql-highlighting"] > :nth-child(1)', 35000)
        cy.get('[data-testid="cql-highlighting"] > :nth-child(1)').should('contain.text', 'define function denomObs(Encounter "Encounter, Performed"):\n  duration in seconds of Encounter.relevantPeriod')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Unused').click()
        Utilities.waitForElementVisible('[data-testid="cql-highlighting"] > :nth-child(1)', 35000)
        cy.get('[data-testid="cql-highlighting"] > :nth-child(1)').should('contain.text', 'define "Denominator Exclusion":\n' +
            '  ["Encounter, Performed": "Ethnicity"] E where (duration in days of E.relevantPeriod) > 10')
    })
})

describe('QDM Test Case Highlighting accurately appears for a single PC measure', () => {

    beforeEach('Create measure, measure group, test case and login', () => {

        newMeasureName = measureName + Date.now()
        newCqlLibraryName = CqlLibraryName + Date.now()

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLPFTests
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0, false, 'Initial Population', 'Denominator Exclusion', '', 'Numerator', '', 'Denominator', 'boolean'
        )
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure()
    })

    it('Hightlighting happens & presents "Results" data', () => {
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        Utilities.waitForElementVisible('[data-testid="cql-highlighting"]', 35000)
        cy.get('[data-testid="cql-highlighting"]').should('contain.text', 'define "Initial Population":\n' +
            '      ["Encounter, Performed": "Emergency Department Visit"]\n' +
            '      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n' +
            '      union ["Encounter, Performed": "Dementia"]')

        // verify Results arrow is shown
        cy.contains('Results').should('have.descendants', 'svg')
        //Verify Test case Execution Results
        cy.get('[data-testid="results-section"]').should('contain.text', '[Encounter, Performed: Closed Head and Facial Trauma\n' +
            'START: 01/09/2025 6:00 AM\n' +
            'STOP: 01/17/2025 6:00 AM\n' +
            'CODE: SNOMEDCT 110246003] ')
    })
})

describe('QDM Test Case Highlighting accurately appears for a multiple PC measure', () => {

    beforeEach('Create measure, measure group, test case and login', () => {

        newMeasureName = measureName + Date.now()
        newCqlLibraryName = CqlLibraryName + Date.now()

        measureData.ecqmTitle = newMeasureName
        measureData.cqlLibraryName = newCqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLPFTests
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0, false, 'Initial Population', 'Denominator Exclusion', '', 'Numerator', '', 'Denominator', 'boolean'
        )
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0, false, 'Initial Population', 'Denominator Exclusion', '', 'Numerator', '', 'Denominator', 'boolean', 2
        )
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout and Clean up Measures', () => {

        Utilities.deleteMeasure()
    })

    it('Both PCs populate highlighting upon execution', () => {
        let currentUser = Cypress.env('selectedUser')
        let measureSecondGroupPath = 'cypress/fixtures/' + currentUser + '/measureGroupId2'
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        Utilities.waitForElementVisible(':nth-child(1) > :nth-child(1) > pre', 35000)
        cy.get(':nth-child(1) > :nth-child(1) > pre').should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')

        Utilities.waitForElementVisible(TestCasesPage.highlightingPCTabSelector, 35000)
        cy.get(TestCasesPage.highlightingPCTabSelector).click()
        cy.readFile(measureSecondGroupPath).should('exist').then((secondGroupId) => {
            cy.get('[data-testid="option-' + secondGroupId + '"]').scrollIntoView().click({ force: true })
            Utilities.waitForElementVisible(':nth-child(1) > :nth-child(1) > pre', 35000)
            cy.get(':nth-child(1) > :nth-child(1) > pre').should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')
        })
    })
})
