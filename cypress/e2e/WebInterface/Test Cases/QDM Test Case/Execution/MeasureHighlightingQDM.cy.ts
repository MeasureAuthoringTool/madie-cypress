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
import { Header } from "../../../../../Shared/Header"
import { CQLLibraryPage } from "../../../../../Shared/CQLLibraryPage"

let measureCQLPFTests = MeasureCQL.QDMHighlightingTab_CQL
let measureCQLDUTest = MeasureCQL.QDMHightlightingTabDefUsed_CQL
let scoringPropValue = 'Proportion'
let QDMTCJson = TestCaseJson.tcJSON_QDM_Value
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let newMeasureName = ''
let newCqlLibraryName = ''

const measureData: CreateMeasureOptions = {}

describe('QDM: Test Case Highlighting Left navigation panel: Includes validate / verify the Definitions Used section / label', () => {

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLDUTest
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs -- "Definitions Used" is present', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'

        cy.get(Header.measures).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
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

describe('QDM: Test Case Highlighting Left navigation panel: Includes Result sub section as well as Definitions, Functions, and Unused sections', () => {

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLPFTests
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'

        cy.get(Header.measures).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
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
            '  ["Encounter, Performed"] E where (duration in days of E.relevantPeriod) > 10')

    })
})

describe('QDM Measure: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a single PC measure', () => {

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLPFTests
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with a single PC and will show Test case Results', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'

        cy.get(Header.measures).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.denominatorExclusionSelect, "Denominator Exclusion")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")

        //intercept group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible('[data-testid="cql-highlighting"]', 35000)
            cy.get('[data-testid="cql-highlighting"]').should('contain.text', 'define "Initial Population":\n' +
                '      ["Encounter, Performed": "Emergency Department Visit"]\n' +
                '      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n' +
                '      union ["Encounter, Performed": "Dementia"]')
        })


        // verify Results arrow is shown
        cy.contains('Results').should('have.descendants', 'svg')
        //Verify Test case Execution Results
        cy.get('[data-testid="results-section"]').should('contain.text', '[Encounter, Performed: Closed Head and Facial Trauma\n' +
            'START: 01/09/2025 6:00 AM\n' +
            'STOP: 01/17/2025 6:00 AM\n' +
            'CODE: SNOMEDCT 110246003] ')
    })
})

describe('QDM Measure:: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a multiple PC measure', () => {

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = scoringPropValue
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQLPFTests
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('QDM Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measureSecondGroupPath = 'cypress/fixtures/groupId2'
        let measurePath = 'cypress/fixtures/measureId'

        cy.get(Header.measures).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.denominatorExclusionSelect, "Denominator Exclusion")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")

        //intercept group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //
        Utilities.waitForElementVisible(MeasureGroupPage.addMeasureGroupButton, 35000)
        cy.get(MeasureGroupPage.addMeasureGroupButton).scrollIntoView().click({ force: true })

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria2).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")
        Utilities.populationSelect(MeasureGroupPage.denominatorExclusionSelect, "Denominator Exclusion")
        Utilities.populationSelect(MeasureGroupPage.numeratorSelect, "Numerator")

        //intercept group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureSecondGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //Navigate to test case detail / edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(':nth-child(1) > :nth-child(1) > pre', 35000)
            cy.get(':nth-child(1) > :nth-child(1) > pre').should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')
        })

        Utilities.waitForElementVisible(TestCasesPage.highlightingPCTabSelector, 35000)
        cy.get(TestCasesPage.highlightingPCTabSelector).click()
        cy.readFile(measureSecondGroupPath).should('exist').then((secondGroupId) => {
            cy.get('[data-testid="option-' + secondGroupId + '"]').scrollIntoView().click({ force: true })
            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('IP').click()
            Utilities.waitForElementVisible(':nth-child(1) > :nth-child(1) > pre', 35000)
            cy.get(':nth-child(1) > :nth-child(1) > pre').should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')
        })
    })
})
