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

//Skipping until feature flag for QDM Highlighting tab is removed
describe.skip('QDM Measure: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a single PC measure', () => {

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

    it('QDM Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with a single PC', () => {
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
    })
})

//Skipping until feature flag for QDM Highlighting tab is removed
describe.skip('QDM Measure:: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a multiple PC measure', () => {

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
