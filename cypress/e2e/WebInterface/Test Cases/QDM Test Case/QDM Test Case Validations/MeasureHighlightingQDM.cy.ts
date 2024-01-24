import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

let measureCQLPFTests = MeasureCQL.QDMHighlightingTab_CQL
let scoringPropValue = 'Proportion'
let QDMTCJson = TestCaseJson.tcJSON_QDM_Value
let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let newMeasureName = ''
let newCqlLibraryName = ''

describe('QI-Core: Test Case Highlighting Left navigation panel: Includes Result sub section as well as Definitions, Functions, and Unused sections', () => {

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, scoringPropValue, false, measureCQLPFTests, false, false,
            '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')
        OktaLogin.Logout()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

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
        TestCasesPage.testCaseAction('edit')

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().click({ force: true }).type('1')

        Utilities.waitForElementVisible(TestCasesPage.testCaseDENOMExpected, 35000)
        cy.get(TestCasesPage.testCaseDENOMExpected).first().scrollIntoView().click({ force: true }).type('1')

        Utilities.waitForElementVisible(TestCasesPage.testCaseNUMERExpected, 35000)
        cy.get(TestCasesPage.testCaseNUMERExpected).first().scrollIntoView().click({ force: true }).type('1')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcDEFINITIONSHighlightingDetails, 35000)
        cy.get(TestCasesPage.tcDEFINITIONSHighlightingDetails).should('contain.text', 'define "Denominator":\n  "Initial Population"define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]define "Numerator":\n  ["Encounter, Performed"] E where E.relevantPeriod starts during day of "Measurement Period"')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Functions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcFUNCTIONSHighlightingDetails, 35000)
        cy.get(TestCasesPage.tcFUNCTIONSHighlightingDetails).should('contain.text', 'define function denomObs(Encounter "Encounter, Performed"):\n  duration in seconds of Encounter.relevantPerioddefine function numerObs(Encounter "Encounter, Performed"):\n  duration in days of Encounter.relevantPeriod')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Unused').click()
        Utilities.waitForElementVisible(TestCasesPage.tcUNUSEDHightlightingDetails, 35000)
        cy.get(TestCasesPage.tcUNUSEDHightlightingDetails).should('contain.text', 'define "Denominator Exclusion":\n  ["Encounter, Performed"] E where (duration in days of E.relevantPeriod) > 10define "IP2":\n    exists ["Encounter, Performed"] Edefine "SDE Ethnicity":\n  ["Patient Characteristic Ethnicity": "Ethnicity"]define "SDE Payer":\n  ["Patient Characteristic Payer": "Payer"]define "SDE Race":\n  ["Patient Characteristic Race": "Race"]define "SDE Sex":\n  ["Patient Characteristic Sex": "ONC Administrative Sex"]')

    })
})

describe('QDM Measure: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a single PC measure', () => {

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, scoringPropValue, false, measureCQLPFTests, false, false,
            '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')
        OktaLogin.Logout()

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
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusion')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

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
        cy.get(EditMeasurePage.testCasesTab).wait(4000).click()

        //Navigate to test case detail / edit page
        TestCasesPage.testCaseAction('edit')

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).scrollIntoView().type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).scrollIntoView().type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).scrollIntoView().type('1')
        cy.get(TestCasesPage.testCaseDENEXExpected).scrollIntoView().type('0')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        //confirm save message
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 35000)
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //run test case
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('be.visible')
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('be.enabled')
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')
        })

        //Verify Test case Execution Results
        cy.get('[class="GroupCoverageResultsSection___StyledDiv-sc-x9ujt7-0 gKcqGP"]').should('contain.text', 'Results')
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

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, scoringPropValue, false, measureCQLPFTests, false, false,
            '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, QDMTCJson, false, false)
        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')
        OktaLogin.Logout()

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
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusion')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusion')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

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
        cy.get(EditMeasurePage.testCasesTab).wait(4000).click()

        //Navigate to test case detail / edit page
        TestCasesPage.testCaseAction('edit')

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).first().scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).first().scrollIntoView().type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).first().scrollIntoView().type('1')
        cy.get(TestCasesPage.testCaseDENEXExpected).first().scrollIntoView().type('0')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        //confirm save message
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 35000)
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //run test case
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('be.visible')
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).should('be.enabled')
        cy.get(TestCasesPage.QDMRunTestCasefrmTestCaseListPage).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')
        })

        Utilities.waitForElementVisible(TestCasesPage.highlightingPCTabSelector, 35000)
        cy.get(TestCasesPage.highlightingPCTabSelector).click()
        cy.readFile(measureSecondGroupPath).should('exist').then((secondGroupId) => {
            cy.get('[data-testid="option-' + secondGroupId + '"]').scrollIntoView().click({ force: true })
            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'define "Initial Population":\n      ["Encounter, Performed": "Emergency Department Visit"]\n      union ["Encounter, Performed": "Closed Head and Facial Trauma"]\n      union ["Encounter, Performed": "Dementia"]')
        })
    })
})
