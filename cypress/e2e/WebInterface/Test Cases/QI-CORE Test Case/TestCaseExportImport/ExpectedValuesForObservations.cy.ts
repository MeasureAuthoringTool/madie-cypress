import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { CreateMeasurePage, SupportedModels } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage, MeasureGroups, MeasureObservations, MeasureScoring, MeasureType, PopulationBasis } from "../../../../../Shared/MeasureGroupPage"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

const now = Date.now()
const measure = {
    name: 'ObsExpValuesMeasure' + now,
    libName: 'ObsExpValuesLib' + now,
    model: SupportedModels.qiCore4,
    cql: MeasureCQL.measureCQL_5138_test
}
const testCase = {
    title: 'Title for Auto Test',
    description: 'tc1',
    group: 'PASS',
    json: TestCaseJson.TestCaseJson_Valid
}
// all these declared values need to match your CQL definitions and functions
const pops: MeasureGroups = {
    initialPopulation: 'mpopEx',
    numerator: 'mpopEx',
    denominator: 'mpopEx'
}

describe('Ratio based measure with measure observations', () => {

    deleteDownloadsFolderBeforeAll()

    beforeEach('Create Measure, Test Case and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measure.name, measure.libName, measure.model, { measureCql: measure.cql })
       
        // all these declared values need to match your CQL definitions and functions
        const obs1: MeasureObservations = {
            aggregateMethod: 'Count',
            definition: 'daysObs'
        }
        const obs2: MeasureObservations = {
            aggregateMethod: 'Count',
            definition: 'daysObs'
        }
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.encounter, MeasureScoring.Ratio, pops, false, obs1, obs2)

        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measure.name, measure.libName)
    })
    
    it('Test Case Export & Import - Persist expected values through the process', () => {
    
        MeasuresPage.actionCenter('edit')

        // verify populations
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.contains('span', 'Outcome').should('have.class', 'MuiChip-label')
        cy.get('#populationBasis').should('have.value', 'Encounter')
        cy.get('#scoring-select').should('have.text', 'Ratio')

        // got to test case
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        // validate JSON - this value need to be in the initial load, cannot scroll down
        TestCasesPage.ValidateValueAddedToTestCaseJson('http://local/Encounter')

        // set expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')
        cy.get(TestCasesPage.denominatorObservationRow).type('1')
        cy.get(TestCasesPage.numeratorObservationRow).type('1')

        // save - return to list
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)
        cy.get(EditMeasurePage.testCasesTab).click()

        // export tc
        cy.get(TestCasesPage.exportTestCasesBtn).click({force: true})
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 2000)
        cy.get(TestCasesPage.exportCollectionTypeOption).click({force: true})

        const exportPath ='cypress/downloads/AutoTestTitle-v0.0.000-FHIR4-TestCases.zip'
        cy.readFile(exportPath).should('exist')

        // need this for now? - clicks below won't work with invisible elements overlapping screen
        cy.reload()
        Utilities.waitForElementVisible(TestCasesPage.deleteAllTestCasesBtn, 20000)

        // delete all tc
        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // re-import immediately
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 6500)
        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(exportPath, {force: true})
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseBtnOnModal, 15000)
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()
 
        Utilities.waitForElementVisible(TestCasesPage.exportTestCasesBtn, 10000)
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.grabTestCaseId(1)
        TestCasesPage.clickEditforCreatedTestCase()

        // check expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('have.value', '3')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('have.value', '1')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('have.value', '1')
        cy.get(TestCasesPage.denominatorObservationRow).should('have.value', '1')
        cy.get(TestCasesPage.numeratorObservationRow).should('have.value', '1')
    })
})

describe('Proportion based measure with no observations', () => {

    beforeEach('Create Measure, Test Case and login', () => {

        CreateMeasurePage.CreateMeasureAPI(measure.name, measure.libName, measure.model, { measureCql: measure.cql })
       
        MeasureGroupPage.CreateMeasureGroupAPI(MeasureType.outcome, PopulationBasis.encounter, MeasureScoring.Proportion, pops)

        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, testCase.json)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measure.name, measure.libName)
    })
    

    it('Test Case Export & Import - Persist expected values through the process', () => {

        MeasuresPage.actionCenter('edit')

        // verify populations
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.contains('span', 'Outcome').should('have.class', 'MuiChip-label')
        cy.get('#populationBasis').should('have.value', 'Encounter')
        cy.get('#scoring-select').should('have.text', 'Proportion')

        // got to test case
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.clickEditforCreatedTestCase()

        // validate JSON - this value need to be in the initial load, cannot scroll down
        TestCasesPage.ValidateValueAddedToTestCaseJson('http://local/Encounter')

        // set expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).type('3')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('1')

        // save - return to list
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)
        cy.get(EditMeasurePage.testCasesTab).click()

        // export tc
        cy.get(TestCasesPage.exportTestCasesBtn).click({force: true})
        Utilities.waitForElementVisible(TestCasesPage.exportCollectionTypeOption, 2000)
        cy.get(TestCasesPage.exportCollectionTypeOption).click({force: true})

        const exportPath ='cypress/downloads/AutoTestTitle-v0.0.000-FHIR4-TestCases.zip'
        cy.readFile(exportPath).should('exist')

        // need this for now? - clicks below won't work with invisible elements overlapping screen
        cy.reload()
        Utilities.waitForElementVisible(TestCasesPage.deleteAllTestCasesBtn, 20000)

        // delete all tc
        cy.get(TestCasesPage.deleteAllTestCasesBtn).click()
        cy.get(TestCasesPage.deleteTestCaseContinueBtn).click()

        // re-import immediately
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 6500)
        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(exportPath, {force: true})
        Utilities.waitForElementVisible(TestCasesPage.importTestCaseBtnOnModal, 15000)
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()
 
        Utilities.waitForElementVisible(TestCasesPage.exportTestCasesBtn, 10000)
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCase.title, testCase.group)

        TestCasesPage.grabTestCaseId(1)
        TestCasesPage.clickEditforCreatedTestCase()

        // check expected values
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('have.value', '3')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('have.value', '1')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('have.value', '1')
    })
})

