import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { CreateMeasurePage, SupportedModels } from '../../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { TestCase, TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'
import { Utilities } from '../../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { CQLEditorPage } from '../../../../../Shared/CQLEditorPage'
import { QiCore6Cql } from '../../../../../Shared/FHIRMeasuresCQL'
import { TestData } from '../../../../../Shared/TestData'

const now = Date.now()
const measureName = 'RunExecuteTCButtonValidations' + now
const CqlLibraryName = 'RETCBVLibrary' + now
const testCase: TestCase = {
    title: 'test case title',
    description: 'DENOMFail' + now,
    group: 'SBTestSeries'
}
const failingTestCase: TestCase = {
    title: 'Test Case with errors',
    description: 'TCwE',
    group: 'ICFTCwESeries'
}
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
const warningTestCaseJson = TestCaseJson.TestCaseJson_with_warnings
const errorTestCaseJSON_no_ResourceID = TestCaseJson.TestCaseJson_missingResourceIDs
const measureCQL = QiCore6Cql.reduced_CQL_Multiple_Populations
const measureCQLWithQualifyingEncounters = measureCQL + 'define "Qualifying Encounters":\n[Encounter] E where false\n'
const cqlFixture = 'cypress/fixtures/CQLForTestCaseExecution.txt'

const replaceCqlFixture = (): void => {
    CQLEditorPage.replaceMonacoCqlDocumentFromFile(cqlFixture)
}

const replaceCqlFixtureWithValidationError = (): void => {
    cy.readFile(cqlFixture).then((cql) => {
        CQLEditorPage.replaceMonacoCqlDocument(`${cql}\n\ndefine "Cypress invalid CQL": UnknownIdentifier`)
    })
}

const setInitialPopulationExpected = (): void => {
    TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
    cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')
    TestCasesPage.clickExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)
    cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')
    TestCasesPage.saveTestCaseAndWait()
}

const openMeasureForTestCases = (): void => {
    OktaLogin.Login()
    MeasuresPage.searchForMeasureByName(measureName)
    MeasuresPage.actionCenter('edit')
}

describe('Run / Execute Test Case button validations', () => {
    beforeEach('Login and Create Measure', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6)
        TestData.saveMeasureCql(measureCQL).then(TestData.expectSavedMeasureCql)
        OktaLogin.Login()
        MeasuresPage.searchForMeasureByName(measureName)
        return cy.then(() => undefined)
    })

    afterEach('Logout and Clean up', () => {
        return Utilities.deleteMeasure()
    })

    it('Run Test Case button is disabled  -- CQL Errors', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        replaceCqlFixtureWithValidationError()

        //save CQL on measure
        CQLEditorPage.submitMonacoCqlForValidation()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 8500)
        cy.get(EditMeasurePage.cqlEditorExpandCollapseBtn).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.'
        )

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, validTestCaseJson, true, true)

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runTestButton).should('be.disabled')
    })

    it('Run / Execute Test Case button is disabled  -- Missing group / population selections', () => {
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        replaceCqlFixture()
        CQLEditorPage.saveMonacoCql({ appendNewLine: false, collapseEditor: true, waitForDisabled: true })

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, validTestCaseJson, true, true)
        TestCasesPage.openTestCasesTab(TestCasesPage.executeTestCaseButton)
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.runTestButton).scrollIntoView().should('be.visible').and('be.disabled')
    })

    it('Run / Execute Test Case button is disabled -- Invalid TC Json', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        replaceCqlFixture()

        CQLEditorPage.saveMonacoCql({ collapseEditor: true, waitForDisabled: true })

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.'
        )

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, invalidTestCaseJson, true, true)

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify execution status on Test Case list page
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
    })

    it('Run / Execute Test Case button is disabled -- missing TC Json', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        replaceCqlFixture()

        CQLEditorPage.saveMonacoCql({ collapseEditor: true, waitForDisabled: true })

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.'
        )

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group)

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runTestButton).should('be.disabled')

        //Verify Execute Test cast case button on Test case list page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
    })
})

describe('Run / Execute Test case for multiple Population Criteria', () => {
    beforeEach('Create measure and login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {
            measureCql: measureCQL
        })
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Initial Population',
            '',
            'Initial Population',
            'boolean'
        )
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, validTestCaseJson)
        OktaLogin.Login()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveMonacoCql({ collapseEditor: true, waitForDisabled: true })
        return cy.then(() => undefined)
    })

    afterEach('Logout and Clean up Measures', () => {
        return Utilities.deleteMeasure()
    })

    it('Run and Execute Test case for multiple Population Criteria and validate Population Criteria discernment, on Highlighting page and Test Case list page', () => {
        const currentUser = Cypress.expose('selectedUser')
        const measureGroupPath = 'cypress/fixtures/' + currentUser + '/measureGroupId'

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()
        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial PopulationOne')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group saved successfully.'
        )

        TestCasesPage.createTestCase(
            testCase.title + '2',
            testCase.description + ' 2',
            testCase.group + '2',
            validTestCaseJson,
            true,
            true
        )

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', "To see the logic highlights, click 'Run Test'")

        //Click on Run Test button and verify the text on Highlighting tab
        cy.get(TestCasesPage.runTestButton).click()

        cy.readFile(measureGroupPath)
            .should('exist')
            .then((fileContents) => {
                cy.get('[data-testid="group-coverage-nav-' + fileContents + '"]')
                    .contains('NUMER')
                    .click()
                Utilities.waitForElementVisible(TestCasesPage.tcNUMERHighlightingDetails, 35000)
                cy.get(TestCasesPage.tcNUMERHighlightingDetails).should(
                    'contain.text',
                    '\ndefine "Initial Population":\n   true\nResultstrue Definition(s) Used'
                )
                cy.get('[data-ref-id="260"]').should('have.color', '#20744c')
            })

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()
        Utilities.waitForElementVisible(TestCasesPage.tcDEFINITIONSHighlightingDetails, 35000)
        cy.get('[data-ref-id="260"]').should('have.color', '#20744c')
        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()

        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')

        //Check Test Execution for second Population criteria
        cy.contains('Population Criteria 2').click().wait(3000)
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')
    })
})

describe('Verify that "Run Test" works with warnings but does not with errors', () => {
    beforeEach('Create measure and group', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {
            measureCql: measureCQL
        })
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne')
        TestData.saveMeasureCql(measureCQL).then(TestData.expectSavedMeasureCql)
        return cy.then(() => undefined)
    })

    afterEach('Logout and Clean up Measures', () => {
        return Utilities.deleteMeasure()
    })

    it('Can "Run Test Case" and "Execute Test Case" when a test case has only a warning', () => {
        TestCasesPage.CreateTestCaseAPI(testCase.title, testCase.group, testCase.description, warningTestCaseJson)
        openMeasureForTestCases()
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.clickExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.get(TestCasesPage.editTestCaseSaveButton).scrollIntoView()
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible').click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', "To see the logic highlights, click 'Run Test'")

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 25000)
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //refresh test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //open edit page for test case
        TestCasesPage.clickEditforCreatedTestCase()

        //navigate to the details tab for the test case
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        // Confirm the expected warning remains visible while Run Test stays available.
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList)
            .should('be.visible')
            .and(
                'contain.text',
                "No code provided, and a code should be provided from the value set 'US Core Encounter Type'"
            )
        //attempt to click on 'Run Test Case' to run the test case via the edit page
        cy.get(TestCasesPage.runTestButton).scrollIntoView()
        cy.get(TestCasesPage.runTestButton).should('be.enabled')
        cy.get(TestCasesPage.runTestButton).click()

        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
    })

    it('Cannot "Run Test Case" or "Execute Test Case" when a test case has multiple errors and a warning', () => {
        openMeasureForTestCases()
        TestCasesPage.createTestCase(
            failingTestCase.title,
            failingTestCase.description,
            failingTestCase.group,
            errorTestCaseJSON_no_ResourceID,
            true,
            true
        )

        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.clickExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        TestCasesPage.saveTestCaseAndWait()

        TestCasesPage.openTestCasesTab(TestCasesPage.executeTestCaseButton)
        TestCasesPage.assertTestCaseStatus(failingTestCase.title, 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openDetailsTab()

        //the 'Run Test Case' button, to run the test case, is unavailable
        cy.get(TestCasesPage.runTestButton).should('exist').and('be.disabled')
    })
})

describe('Verify "Run Test Cases" results based on missing/empty group populations are treated as zeroes', () => {
    beforeEach('Create measure, login and update CQL, create group, and login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6, {
            measureCql: measureCQLWithQualifyingEncounters
        })
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Initial Population',
            '',
            'Initial Population',
            'boolean'
        )
        TestData.saveMeasureCql(measureCQLWithQualifyingEncounters).then(TestData.expectSavedMeasureCql)
        OktaLogin.Login()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.actionCenter('edit')
        return cy.then(() => undefined)
    })

    afterEach('Logout and Clean up Measures', () => {
        return Utilities.deleteMeasure()
    })

    it('Can "Run Test Cases" on test case list page after when created after pristine groups', () => {
        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group updated successfully.'
        )

        TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, validTestCaseJson, true, true)

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        setInitialPopulationExpected()

        //Verify Highlighting tab before clicking on Run Test button
        cy.get(TestCasesPage.tcHighlightingTab).click()
        cy.get(TestCasesPage.runTestAlertMsg).should('contain.text', "To see the logic highlights, click 'Run Test'")

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })

    it(
        'Can "Run Test Cases" on test case list page after a group has its population basis or scoring value changed' +
            ' (displays pass / fail) and results are the same for individual run on edit page',
        () => {
            //Add second Measure Group with return type as Boolean
            cy.get(EditMeasurePage.measureGroupsTab).click()

            Utilities.setMeasureGroupType()

            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('boolean')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

            cy.get(MeasureGroupPage.reportingTab).click()
            Utilities.dropdownSelect(
                MeasureGroupPage.improvementNotationSelect,
                'Increased score indicates improvement'
            )

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
                'contain.text',
                'Population details for this group updated successfully.'
            )

            TestCasesPage.createTestCase(testCase.title, testCase.description, testCase.group, warningTestCaseJson, true, true)

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            setInitialPopulationExpected()

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should(
                'contain.text',
                "To see the logic highlights, click 'Run Test'"
            )

            //Click on Execute Test Case button on Edit Test Case page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.executeTestCaseButton).should('exist')
            Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 60000)
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            //refresh test case list page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            //open edit page for test case
            TestCasesPage.clickEditforCreatedTestCase()

            //navigate to the details tab for the test case
            cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

            //confirm warning message
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')

            //change population basis
            //navigate to measure group / Population Criteria page / tab
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //set new value for population basis
            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Encounter')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')

            cy.get(MeasureGroupPage.reportingTab).click()
            Utilities.dropdownSelect(
                MeasureGroupPage.improvementNotationSelect,
                'Increased score indicates improvement'
            )

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            cy.get(MeasureGroupPage.scoreUpdateMGConfirmMsg).should(
                'contain.text',
                'Your Measure Population Basis is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure group.'
            )
            cy.get(MeasureGroupPage.updatePopulationBasisConfirmationBtn).click()

            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
                'contain.text',
                'Population details for this group updated successfully.'
            )

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            TestCasesPage.openExpectedActualTab()

            // Cohort expected values remain boolean after the population basis changes.
            cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should(
                'contain.text',
                "To see the logic highlights, click 'Run Test'"
            )

            //Click on Execute Test Case button on Edit Test Case page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            //change scoring
            //navigate to measure group / Population Criteria page / tab
            cy.get(EditMeasurePage.measureGroupsTab).click()

            //set new value for population basis
            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Qualifying Encounters')
            Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Qualifying Encounters')
            Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Qualifying Encounters')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

            //validation successful save message
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
                'contain.text',
                'Population details for this group updated successfully.'
            )

            // Refresh the test-case editor's population input types after scoring changes.
            cy.reload()
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            TestCasesPage.openExpectedActualTab()

            //enter values for the expected populations
            TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseIPPExpected, '0')

            TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseDENOMExpected, '0')

            TestCasesPage.typeExpectedActualValue(TestCasesPage.testCaseNUMERExpected, '0')

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 8500)

            //Verify Highlighting tab before clicking on Run Test button
            cy.get(TestCasesPage.tcHighlightingTab).click()
            cy.get(TestCasesPage.runTestAlertMsg).should(
                'contain.text',
                "To see the logic highlights, click 'Run Test'"
            )

            //Click on Execute Test Case button on Edit Test Case page
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.executeTestCaseButton).click()
            cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.clickEditforCreatedTestCase()

            TestCasesPage.openExpectedActualTab()

            //attempt to click on 'Run Test Case' to run the test case via the edit page
            cy.get(TestCasesPage.runTestButton).scrollIntoView()
            cy.get(TestCasesPage.runTestButton).should('be.enabled')
            cy.get(TestCasesPage.runTestButton).click()

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

            //confirm no message
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        }
    )
})
