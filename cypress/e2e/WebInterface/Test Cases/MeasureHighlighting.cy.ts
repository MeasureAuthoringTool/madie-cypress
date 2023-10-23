import { TestCaseJson } from "../../../Shared/TestCaseJson"
import { CreateMeasurePage } from "../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../Shared/OktaLogin"
import { MeasureGroupPage } from "../../../Shared/MeasureGroupPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../Shared/TestCasesPage"
import { Utilities } from "../../../Shared/Utilities"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { MeasureCQL } from "../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Header } from "../../../Shared/Header"
import { util } from "chai"

let measureCQLPFTests = MeasureCQL.CQL_Populations

let filePath = 'cypress/fixtures/testCaseId'
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
let validFileToUpload = downloadsFolder.toString()

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_Valid
let newMeasureName = ''
let newCqlLibraryName = ''

describe('Measure Highlighting', () => {

    beforeEach('Create measure and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Execute single Test Case and verify Measure highlighting', () => {

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforRatioMeasure()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'Population Criteria 1')

        cy.get(TestCasesPage.testCalculationResults).should('contain', 'define "num":\n' +
            '  exists ["Encounter"] E where E.status ~ \'finished\'')
    })
})
//MAT-6074
describe.skip('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a single PC measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    //MAT-6074
    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with a single PC', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

        //intercept group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('PUT', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        Utilities.waitForElementVisible(MeasureGroupPage.updateMeasureGroupConfirmationBtn, 35000)
        Utilities.waitForElementEnabled(MeasureGroupPage.updateMeasureGroupConfirmationBtn, 35000)
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).wait(4000).click()

        //Navigate to test case detail / edit page
        TestCasesPage.testCaseAction('edit')

        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'No results available')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="31"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="32"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="33"]').should('have.color', '#A63B12')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')
            cy.get('[data-ref-id="34"]').should('have.color', '#20744C')
        })
    })
})
//MAT-6268
describe.skip('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a multiple PC measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        //MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        //Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    //MAT-6268
    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measureSecondGroupPath = 'cypress/fixtures/groupId2'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

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

        //
        Utilities.waitForElementVisible(MeasureGroupPage.addMeasureGroupButton, 35000)
        cy.get(MeasureGroupPage.addMeasureGroupButton).scrollIntoView().click({ force: true })

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        //intercept first group id once update to the measure group is saved
        cy.readFile(measurePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/groups').as('group')
        })
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).wait(4000).click()
        cy.wait('@group', { timeout: 60000 }).then((request) => {
            cy.writeFile(measureSecondGroupPath, request.response.body.id)
        })

        //validation successful update message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
        //

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).wait(4000).click()

        //Navigate to test case detail / edit page
        TestCasesPage.testCaseAction('edit')


        //Navigate to the Expected / Actual sub tab
        Utilities.waitForElementVisible(TestCasesPage.tctExpectedActualSubTab, 35000)
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click({ force: true })

        //check checkboxes to get a passing result from running the test case
        Utilities.waitForElementVisible(TestCasesPage.testCaseIPPExpected, 35000)
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'No results available')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="31"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="32"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="33"]').should('have.color', '#A63B12')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')
            cy.get('[data-ref-id="34"]').should('have.color', '#20744C')
        })
        Utilities.waitForElementVisible(TestCasesPage.highlightingPCTabSelector, 35000)
        cy.get(TestCasesPage.highlightingPCTabSelector).click()
        cy.readFile(measureSecondGroupPath).should('exist').then((secondGroupId) => {
            cy.get('[data-testid="option-' + secondGroupId + '"]').scrollIntoView().click({ force: true })

            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'No results available')

            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')

            cy.get('[data-testid="group-coverage-nav-' + secondGroupId + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="31"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="32"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="33"]').should('have.color', '#A63B12')
        })
        cy.pause()
    })
})
//MAT-6087
describe.skip('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a multiple PC measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        //MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        //Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    //MAT-6268
    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
        let measureGroupPath = 'cypress/fixtures/groupId'
        let measureSecondGroupPath = 'cypress/fixtures/groupId2'
        let measurePath = 'cypress/fixtures/measureId'
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial PopulationOne')

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
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.readFile(measureGroupPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('IP').click()
            Utilities.waitForElementVisible(TestCasesPage.tcIPHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcIPHighlightingDetails).should('contain.text', 'No results available')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('DENOM').click()
            Utilities.waitForElementVisible(TestCasesPage.tcDENOMHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcDENOMHighlightingDetails).should('contain.text', '\ndefine "Initial Population":\nexists "Qualifying Encounters"\n')
            cy.get('[data-ref-id="31"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="32"]').should('have.color', '#A63B12')
            cy.get('[data-ref-id="33"]').should('have.color', '#A63B12')

            cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]').contains('NUMER').click()
            Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
            cy.get(TestCasesPage.tcNUMERHighlightingDetails).should('contain.text', '\ndefine "Initial PopulationOne":\ntrue\n')
            cy.get('[data-ref-id="34"]').should('have.color', '#20744C')
        })
    })
})
