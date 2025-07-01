import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import {Header} from "../../../../Shared/Header";

let measureName = 'ProportionEpisode' + Date.now()
let CqlLibraryName = 'ProportionEpisode' + Date.now()
let versionNumber = '1.0.000'
let testCaseTitle = 'PASS'
let testCaseDescription = 'PASS' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.ProportionEpisode_PASS
let filePath = 'cypress/fixtures/measureId'
let measureCQL = 'library ProportionEpisodeMeasure version \'0.0.000\'\n' +
    '\n' +
    'using QICore version \'4.1.1\'\n' +
    '\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'include CQMCommon version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "SNOMED": \'http://snomed.info/sct\'\n' +
    '\n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\'\n' +
    '\n' +
    'code "Unscheduled (qualifier value)": \'103390000\' from "SNOMED" display \'Unscheduled (qualifier value)\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '  default Interval[@2022-01-01T00:00:00.0, @2023-01-01T00:00:00.0)\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '   [Encounter: "Encounter Inpatient"] InptEncounter\n' +
    '      where InptEncounter.status = \'finished\' \n' +
    '       \n' +
    'define "Denominator":\n' +
    '    "Initial Population" IP\n' +
    '      where IP.period ends during day of "Measurement Period"\n' +
    '\n' +
    'define "Numerator":\n' +
    '    "Denominator" denom \n' +
    '    where Global."LengthInDays"(denom.period) > 120\n' +
    '\n' +
    'define function "Measure Observation"(Encounter Encounter): \n' +
    '  Count({\n' +
    '        Encounter Enc\n' +
    '          where Enc.priority ~ "Unscheduled (qualifier value)"          \n' +
    '          })'


describe('Test Cases: Versioned Measure: Create, Edit, Delete Test Case', () => {

    beforeEach('Create Measure, Test Case and Login', () => {

        CqlLibraryName = 'ProportionEpisode' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL, null, false,
            '2023-01-01', '2023-12-31')

        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population',
            '', '', 'Numerator', '', 'Denominator', 'Encounter')

        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        OktaLogin.Login()

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()

        //version measure
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get('#draggable-dialog-title').click()

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.discardChangesConfirmationBody, 20000)

        cy.get(TestCasesPage.versionMeasurewithTCErrorsContinue).click()
        Utilities.waitForElementToNotExist(TestCasesPage.discardChangesConfirmationBody, 20000)

        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Versioned Measure: Create New Test Case, delete is enabled', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        testCaseTitle = 'NewTestAfterVersioning'
        testCaseDescription = 'NewTestAfterVersioning' + Date.now()
        testCaseSeries = 'NewTestAfterVersioning'

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')
        cy.wait('@callstacks', { timeout: 60000 })

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify user can delete newly created test case after versioning
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterDelete).should('be.enabled')

        //Draft should keep all changes made to test cases after versioning

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type('DraftedMeasure0001' + Date.now())
        //intercept draft id once measure is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/draft').as('draft')
        })
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get('.toast').should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).scrollIntoView().click()
        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

    })

    it('Versioned Measure: Edit Test Case, delete is disabled', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')
        cy.wait('@callstacks', { timeout: 60000 })

        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully with ' +
            'warnings in JSONMADiE enforces a UTC (offset 0) timestamp format with mandatory millisecond precision. ' +
            'All timestamps with non-zero offsets have been overwritten to UTC, and missing milliseconds have been ' +
            'defaulted to')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify user can't delete edited test case after versioning
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).should('be.disabled')

        //Draft should keep all changes made to test cases after versioning

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).click()

        MeasuresPage.actionCenter('draft')

        cy.get(MeasuresPage.updateDraftedMeasuresTextBox).clear().type('DraftedMeasure0001' + Date.now())
        //intercept draft id once measure is drafted
        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.intercept('POST', '/api/measures/' + fileContents + '/draft').as('draft')
        })
        cy.get(MeasuresPage.createDraftContinueBtn).click()
        cy.wait('@draft', { timeout: 60000 }).then((request) => {
            cy.writeFile(filePath, request.response.body.id)
        })
        cy.get('.toast').should('contain.text', 'New draft created successfully.')
        cy.log('Draft Created Successfully')

        //navigate back to the main MADiE / measure list page
        cy.get(Header.mainMadiePageButton).scrollIntoView().click()
        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

    })

})
