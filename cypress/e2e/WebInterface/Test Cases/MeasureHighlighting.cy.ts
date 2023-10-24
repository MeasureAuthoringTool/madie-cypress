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
let measureCQLDFUTests = MeasureCQL.CQLDFN_value

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
let tcJson = TestCaseJson.tcJson_value
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
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, testCaseJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

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

    })
})
//MAT-6087
describe.skip('QI-Core: Test Case Highlighting Left navigation panel: Highlighting accurately appears for a multiple PC measure', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create measure, measure group, test case and login', () => {
        let randValue = (Math.floor((Math.random() * 1000) + 2))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLDFUTests, false)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, tcJson)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    //MAT-6087
    it('QI Core Measure: New Highlighting Left Navigation panel is displayed & highlighting is as expected for a measure with multiple PCs', () => {
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
        cy.get(TestCasesPage.testCaseIPPExpected).first().scrollIntoView().check({ force: true })

        //run test case
        cy.get(TestCasesPage.runTestButton).should('be.visible')
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcDEFINITIONSHighlightingDetails, 35000)
        cy.get(TestCasesPage.tcDEFINITIONSHighlightingDetails).should('contain.text', '\ndefine "Encounter to Assess Cognition":\n["Encounter": "Psych Visit Diagnostic Evaluation"]\n    union ["Encounter": "Nursing Facility Visit"]\n    union ["Encounter": "Care Services in Long Term Residential Facility"]\n    union ["Encounter": "Home Healthcare Services"]\n    union ["Encounter": "Psych Visit Psychotherapy"]\n    union ["Encounter": "Behavioral/Neuropsych Assessment"]\n    union ["Encounter": "Occupational Therapy Evaluation"]\n    union ["Encounter": "Office Visit"]\n    union ["Encounter": "Outpatient Consultation"]\nResultsFALSE ([]) \ndefine "Dementia Encounter During Measurement Period":\n"Encounter to Assess Cognition" EncounterAssessCognition\n    with [Condition: "Dementia & Mental Degenerations"] Dementia\n   such that EncounterAssessCognition.period during "Measurement Period"\n           and Dementia.prevalenceInterval() overlaps day of EncounterAssessCognition.period \n        and Dementia.isActive() \n        and not ( Dementia.verificationStatus ~ QICoreCommon."unconfirmed"\n                     or Dementia.verificationStatus ~ QICoreCommon."refuted"\n                     or Dementia.verificationStatus ~ QICoreCommon."entered-in-error" )\nResultsFALSE ([]) \ndefine "Qualifying Encounter During Measurement Period":\n("Encounter to Assess Cognition" union ["Encounter": "Patient Provider Interaction"] ) ValidEncounter\n    where ValidEncounter.period during "Measurement Period"\n    and ValidEncounter.status = \'finished\'\nResultsFALSE ([]) \n/***Population Criteria***/\ndefine "Initial Population":\nexists "Dementia Encounter During Measurement Period"\n    and ( Count("Qualifying Encounter During Measurement Period")>= 2 )\nResultsFALSE (false) \ndefine "Denominator":\n"Initial Population"\nResultsUNHIT \n/***Definitions***/\ndefine "Assessment of Cognition Using Standardized Tools or Alternate Methods":\n( ["Observation": "Standardized Tools Score for Assessment of Cognition"]\n    union ["Observation": "Cognitive Assessment"] ) CognitiveAssessment\n    with "Dementia Encounter During Measurement Period" EncounterDementia\nsuch that CognitiveAssessment.effective.toInterval() starts 12 months or less on or before day of \n    end of EncounterDementia.period\n    where CognitiveAssessment.value is not null\n    and CognitiveAssessment.status in { \'final\', \'amended\', \'corrected\', \'preliminary\' }\nResultsUNHIT \ndefine "Numerator":\nexists "Assessment of Cognition Using Standardized Tools or Alternate Methods"\nResultsUNHIT ')
        cy.get('[data-ref-id="43"]').should('have.color', '#A63B12')
        cy.get('[data-ref-id="44"]').should('have.color', '#A63B12')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Functions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcFUNCTIONSHighlightingDetails, 35000)
        cy.get(TestCasesPage.tcFUNCTIONSHighlightingDetails).should('contain.text', '\n/*\n@description: Converts a UCUM definite duration unit to a CQL calendar duration\nunit using conversions specified in the [quantities](https://cql.hl7.org/02-authorsguide.html#quantities) \ntopic of the CQL specification.\n@comment: Note that for durations above days (or weeks), the conversion is understood to be approximate\n*/\ndefine function ToCalendarUnit(unit System.String):\n    case unit\n        when \'ms\' then \'millisecond\'\n        when \'s\' then \'second\'\n        when \'min\' then \'minute\'\n        when \'h\' then \'hour\'\n        when \'d\' then \'day\'\n        when \'wk\' then \'week\'\n        when \'mo\' then \'month\'\n        when \'a\' then \'year\'\n        else unit\n    end\n\n/*\n@description: Converts the given FHIR [Quantity](https://hl7.org/fhir/datatypes.html#Quantity) \nvalue to a CQL Quantity\n@comment: If the given quantity has a comparator specified, a runtime error is raised. If the given quantity\nhas a system other than UCUM (i.e. `http://unitsofmeasure.org`) or CQL calendar units (i.e. `http://hl7.org/fhirpath/CodeSystem/calendar-units`)\nan error is raised. For UCUM to calendar units, the `ToCalendarUnit` function is used.\n@seealso: ToCalendarUnit\n*/\ndefine function ToQuantity(quantity FHIR.Quantity):\n    case\n        when quantity is null then null\n        when quantity.value is null then null\n        when quantity.comparator is not null then\n            Message(null, true, \'FHIRHelpers.ToQuantity.ComparatorQuantityNotSupported\', \'Error\', \'FHIR Quantity value has a comparator and cannot be converted to a System.Quantity value.\')\n        when quantity.system is null or quantity.system.value = \'http://unitsofmeasure.org\'\n              or quantity.system.value = \'http://hl7.org/fhirpath/CodeSystem/calendar-units\' then\n            System.Quantity { value: quantity.value.value, unit: ToCalendarUnit(Coalesce(quantity.code.value, quantity.unit.value, \'1\')) }\n        else\n            Message(null, true, \'FHIRHelpers.ToQuantity.InvalidFHIRQuantity\', \'Error\', \'Invalid FHIR Quantity code: \' & quantity.unit.value & \' (\' & quantity.system.value & \'|\' & quantity.code.value & \')\')\n    end\n\n/*\n@description: Converts the given FHIR [Ratio](https://hl7.org/fhir/datatypes.html#Ratio) value to a CQL Ratio.\n*/\ndefine function ToRatio(ratio FHIR.Ratio):\n    if ratio is null then\n        null\n    else\n        System.Ratio { numerator: ToQuantity(ratio.numerator), denominator: ToQuantity(ratio.denominator) }\n\n/*\n@description: Converts the given FHIR [Coding](https://hl7.org/fhir/datatypes.html#Coding) value to a CQL Code.\n*/\ndefine function ToCode(coding FHIR.Coding):\n    if coding is null then\n        null\n    else\n        System.Code {\n          code: coding.code.value,\n          system: coding.system.value,\n          version: coding.version.value,\n          display: coding.display.value\n        }\n\n/*\n@description: Converts the given FHIR [CodeableConcept](https://hl7.org/fhir/datatypes.html#CodeableConcept) value to a CQL Concept.\n*/\ndefine function ToConcept(concept FHIR.CodeableConcept):\n    if concept is null then\n        null\n    else\n        System.Concept {\n            codes: concept.coding C return ToCode(C),\n            display: concept.text.value\n        }\n\n/*\n@description: Converts the given value to a CQL value using the appropriate accessor or conversion function.\n@comment: TODO: document conversion\n*/\ndefine function ToValue(value Choice<base64Binary,\n        boolean,\n        canonical,\n        code,\n        date,\n        dateTime,\n        decimal,\n        id,\n        instant,\n        integer,\n        markdown,\n        oid,\n        positiveInt,\n        string,\n        time,\n        unsignedInt,\n        uri,\n        url,\n        uuid,\n        Address,\n        Age,\n        Annotation,\n        Attachment,\n        CodeableConcept,\n        Coding,\n        ContactPoint,\n        Count,\n        Distance,\n        Duration,\n        HumanName,\n        Identifier,\n        Money,\n        Period,\n        Quantity,\n        Range,\n        Ratio,\n        Reference,\n        SampledData,\n        Signature,\n        Timing,\n        ContactDetail,\n        Contributor,\n        DataRequirement,\n        Expression,\n        ParameterDefinition,\n        RelatedArtifact,\n        TriggerDefinition,\n        UsageContext,\n        Dosage,\n        Meta>):\n    case\n      when value is base64Binary then (value as base64Binary).value\n      when value is boolean then (value as boolean).value\n      when value is canonical then (value as canonical).value\n      when value is code then (value as code).value\n      when value is date then (value as date).value\n      when value is dateTime then (value as dateTime).value\n      when value is decimal then (value as decimal).value\n      when value is id then (value as id).value\n      when value is instant then (value as instant).value\n      when value is integer then (value as integer).value\n      when value is markdown then (value as markdown).value\n      when value is oid then (value as oid).value\n      when value is positiveInt then (value as positiveInt).value\n      when value is string then (value as string).value\n      when value is time then (value as time).value\n      when value is unsignedInt then (value as unsignedInt).value\n      when value is uri then (value as uri).value\n      when value is url then (value as url).value\n      when value is uuid then (value as uuid).value\n      when value is Age then ToQuantity(value as Age)\n      when value is CodeableConcept then ToConcept(value as CodeableConcept)\n      when value is Coding then ToCode(value as Coding)\n      when value is Count then ToQuantity(value as Count)\n      when value is Distance then ToQuantity(value as Distance)\n      when value is Duration then ToQuantity(value as Duration)\n      when value is Quantity then ToQuantity(value as Quantity)\n      when value is Range then ToInterval(value as Range)\n      when value is Period then ToInterval(value as Period)\n      when value is Ratio then ToRatio(value as Ratio)\n      else value as Choice<Address,\n        Annotation,\n        Attachment,\n        ContactPoint,\n        HumanName,\n        Identifier,\n        Money,\n        Reference,\n        SampledData,\n        Signature,\n        Timing,\n        ContactDetail,\n        Contributor,\n        DataRequirement,\n        Expression,\n        ParameterDefinition,\n        RelatedArtifact,\n        TriggerDefinition,\n        UsageContext,\n        Dosage,\n        Meta>\n    end\n\n/* Candidates for FHIRCommon */\n\n/*\n@description: Returns true if the given condition has a clinical status of active, recurrence, or relapse\n*/\ndefine fluent function isActive(condition Condition):\n  condition.clinicalStatus ~ "active"\n    or condition.clinicalStatus ~ "recurrence"\n    or condition.clinicalStatus ~ "relapse"\n\n/*\n@description: Normalizes a value that is a choice of timing-valued types to an equivalent interval\n@comment: Normalizes a choice type of DateTime, Quanitty, Interval<DateTime>, or Interval<Quantity> types\nto an equivalent interval. This selection of choice types is a superset of the majority of choice types that are used as possible\nrepresentations for timing-valued elements in QICore, allowing this function to be used across any resource.\nThe input can be provided as a DateTime, Quantity, Interval<DateTime> or Interval<Quantity>.\nThe intent of this function is to provide a clear and concise mechanism to treat single\nelements that have multiple possible representations as intervals so that logic doesn\'t have to account\nfor the variability. More complex calculations (such as medication request period or dispense period\ncalculation) need specific guidance and consideration. That guidance may make use of this function, but\nthe focus of this function is on single element calculations where the semantics are unambiguous.\nIf the input is a DateTime, the result a DateTime Interval beginning and ending on that DateTime.\nIf the input is a Quantity, the quantity is expected to be a calendar-duration interpreted as an Age,\nand the result is a DateTime Interval beginning on the Date the patient turned that age and ending immediately before one year later.\nIf the input is a DateTime Interval, the result is the input.\nIf the input is a Quantity Interval, the quantities are expected to be calendar-durations interpreted as an Age, and the result\nis a DateTime Interval beginning on the date the patient turned the age given as the start of the quantity interval, and ending\nimmediately before one year later than the date the patient turned the age given as the end of the quantity interval.\nAny other input will reslt in a null DateTime Interval\n*/\ndefine fluent function toInterval(choice Choice<DateTime, Quantity, Interval<DateTime>, Interval<Quantity>>):\n  case\n\t  when choice is DateTime then\n    \tInterval[choice as DateTime, choice as DateTime]\n\t\twhen choice is Interval<DateTime> then\n  \t\tchoice as Interval<DateTime>\n\t\twhen choice is Quantity then\n\t\t  Interval[Patient.birthDate + (choice as Quantity),\n\t\t\t  Patient.birthDate + (choice as Quantity) + 1 year)\n\t\twhen choice is Interval<Quantity> then\n\t\t  Interval[Patient.birthDate + (choice.low as Quantity),\n\t\t\t  Patient.birthDate + (choice.high as Quantity) + 1 year)\n\t\telse\n\t\t\tnull as Interval<DateTime>\n\tend\n\n/*\n@description: Returns an interval representing the normalized abatement of a given Condition.\n@comment: If the abatement element of the Condition is represented as a DateTime, the result\nis an interval beginning and ending on that DateTime.\nIf the abatement is represented as a Quantity, the quantity is expected to be a calendar-duration and is interpreted as the age of the patient. The\nresult is an interval from the date the patient turned that age to immediately before one year later.\nIf the abatement is represented as a Quantity Interval, the quantities are expected to be calendar-durations and are interpreted as an age range during\nwhich the abatement occurred. The result is an interval from the date the patient turned the starting age of the quantity interval, and ending immediately\nbefore one year later than the date the patient turned the ending age of the quantity interval.\n*/\ndefine fluent function abatementInterval(condition Condition):\n\tif condition.abatement is DateTime then\n\t  Interval[condition.abatement as DateTime, condition.abatement as DateTime]\n\telse if condition.abatement is Quantity then\n\t\tInterval[Patient.birthDate + (condition.abatement as Quantity),\n\t\t\tPatient.birthDate + (condition.abatement as Quantity) + 1 year)\n\telse if condition.abatement is Interval<Quantity> then\n\t  Interval[Patient.birthDate + (condition.abatement.low as Quantity),\n\t\t  Patient.birthDate + (condition.abatement.high as Quantity) + 1 year)\n\telse if condition.abatement is Interval<DateTime> then\n\t  Interval[condition.abatement.low, condition.abatement.high)\n\telse null as Interval<DateTime>\n\n/*\n@description: Returns an interval representing the normalized prevalence period of a given Condition.\n@comment: Uses the ToInterval and ToAbatementInterval functions to determine the widest potential interval from\nonset to abatement as specified in the given Condition. If the condition is active, the resulting interval will have\na closed ending boundary. If the condition is not active, the resulting interval will have an open ending boundary.\n*/\ndefine fluent function prevalenceInterval(condition Condition):\nif condition.clinicalStatus ~ "active"\n  or condition.clinicalStatus ~ "recurrence"\n  or condition.clinicalStatus ~ "relapse" then\n  Interval[start of condition.onset.toInterval(), end of condition.abatementInterval()]\nelse\n  Interval[start of condition.onset.toInterval(), end of condition.abatementInterval())\n')

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Unused').click()
        Utilities.waitForElementVisible(TestCasesPage.tcUNUSEDHightlightingDetails, 35000)
        cy.get(TestCasesPage.tcUNUSEDHightlightingDetails).should('contain.text', 'define "Patient Reason for Not Performing Assessment of Cognition Using Standardized Tools or Alternate Methods": "unavailable"ResultsNA define "Denominator Exceptions": "unavailable"ResultsNA define "SDE Ethnicity": "unavailable"ResultsNA define "SDE Race": "unavailable"ResultsNA define "SDE Sex": "unavailable"ResultsNA define "SDE Payer": "unavailable"ResultsNA define "track1": "unavailable"ResultsNA ')

    })
})
