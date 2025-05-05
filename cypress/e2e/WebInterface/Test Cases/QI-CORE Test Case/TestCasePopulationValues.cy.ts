import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let randValue = (Math.floor((Math.random() * 1000) + 1))
const now = Date.now()
const measureName = 'TCPopValues' + now + randValue
const CqlLibraryName = 'TCPopValuesLib' + now + randValue
const testCaseTitle = 'test case title'
const testCaseDescription = 'example'
const testCaseSeries = 'SBTestSeries'
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const measureCQL = MeasureCQL.ICFCleanTest_CQL
const proportionMeasureCQL = MeasureCQL.CQL_Multiple_Populations

describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify the Test Case Populations when Measure group is not added', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testCaseExecutionError).should('contain.text', 'No Population Criteria is associated with this measure. Please review the Population Criteria tab.')
    })

    it('Validate Population Values check boxes are correct based on measure scoring value that is applied, ' +
        'when the measure is initially created (default measure group)', () => {

            cy.log('Continuous Variable')

            //Add Measure Group
            MeasureGroupPage.createMeasureGroupforProportionMeasure()

            //Navigate to Test Cases page and add Test Case details
            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()

            TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

            TestCasesPage.clickEditforCreatedTestCase()

            //click on Expected / Actual tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')

            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).check().should('be.checked')

            cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
            cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
            cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseNUMERExpected).check().should('be.checked')

            cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseDENOMExpected).check().should('be.checked')
        })

    it('Validate notification that a reset of population values, on test cases, will occur once the completed ' +
        'save / update of the scoring value is executed', () => {

            //Click on Edit Measure
            MeasuresPage.actionCenter('edit')
            //navigate to CQL Editor page / tab
            cy.get(EditMeasurePage.cqlEditorTab).click()
            //read and write CQL from flat file
            cy.readFile('cypress/fixtures/QICoreCleanCQL.txt').should('exist').then((fileContents) => {
                cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
            })
            //save CQL on measure
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()
            //Click on the measure group tab

            cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

            cy.get(EditMeasurePage.measureGroupsTab).click()

            Utilities.setMeasureGroupType()

            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Procedure')
            cy.get(MeasureGroupPage.popBasisOption).click()


            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')

            cy.get(MeasureGroupPage.reportingTab).click()
            Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
            Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')

            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            //validation message after attempting to save
            cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('exist')
            cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('contain.text', 'Change Scoring?Your Measure Scoring is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.Are you sure you want to Save Changes?This action cannot be undone.No, Keep WorkingYes, Save changes')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

            cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('not.exist')

        })

    it('Validate Population Values are reset on all test cases that exist under a measure group, after the score ' +
        'unit value is saved / updated', () => {

            //Click on Edit Measure
            MeasuresPage.actionCenter('edit')
            //navigate to CQL Editor page / tab
            cy.get(EditMeasurePage.cqlEditorTab).click()
            //read and write CQL from flat file
            cy.readFile('cypress/fixtures/QICoreCleanCQL.txt').should('exist').then((fileContents) => {
                cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
            })
            //save CQL on measure
            cy.get(EditMeasurePage.cqlEditorSaveButton).click()

            cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
            //Click on the measure group tab
            cy.get(EditMeasurePage.measureGroupsTab).click()
            //log, in cypress, the measure score value
            Utilities.setMeasureGroupType()

            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Procedure')
            cy.get(MeasureGroupPage.popBasisOption).click()


            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
            Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')

            cy.get(MeasureGroupPage.reportingTab).click()
            Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
            Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

            //save measure group
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

            //validation message after attempting to save
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
            //create test case
            TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
            cy.get(EditMeasurePage.testCasesTab).click()
            TestCasesPage.clickEditforCreatedTestCase()

            //click on Expected / Actual tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).type('1')

            cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
            cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
            cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseNUMEXExpected).type('2')


            cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
            cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseDENOMExpected).type('3')

            //navigate to the Details tab to see confirmation message
            cy.get(TestCasesPage.detailsTab).should('exist')
            cy.get(TestCasesPage.detailsTab).should('be.visible')
            cy.get(TestCasesPage.detailsTab).click()

            cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully with warnings in JSON')

            //navigate back to the measure group tab / page and...
            //change score unit value and save / update measure with new value
            cy.get(EditMeasurePage.measureGroupsTab).click()
            //log, in cypress, the measure score value
            cy.log('Cohort')
            //select scoring unit on measure
            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
            //based on the scoring unit value, select a value for all population fields
            Utilities.validationMeasureGroupSaveAll('Cohort')
            //save measure group
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            //validation message after attempting to save
            cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('exist')
            cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('contain.text', 'Change Scoring?Your Measure Scoring is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.Are you sure you want to Save Changes?This action cannot be undone.No, Keep WorkingYes, Save changes')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
            cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population ' +
                'details for this group updated successfully.')


            cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
                cy.intercept('GET', '/api/measures/' + fileContents + '/test-cases').as('testCase')

                //navigate back to the test case tab
                cy.get(EditMeasurePage.testCasesTab).click()

                cy.url({ timeout: 100000 }).should('include', '/edit/test-cases')

                cy.wait('@testCase').then(({ response }) => {
                    expect(response.statusCode).to.eq(200)
                })

            })
            TestCasesPage.clickEditforCreatedTestCase()

            //click on Expected / Actual tab
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
            cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
            cy.get(TestCasesPage.tctExpectedActualSubTab).click()

            //confirm that check boxes that were checked are no longer checked
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
            cy.get(TestCasesPage.testCaseIPPExpected).should('be.empty')

        })

    it('Test Case Population value options are limited to those that are defined from Measure Group -- required populations', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/QICoreCleanCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.log('Proportion')
        Utilities.setMeasureGroupType()

        //select scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        //select scoring unit on measure
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('ml')
        //select correct Population Basis value
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Surgical Absence of Cervix')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Surgical Absence of Cervix')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and verify Populations
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | Procedure')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Expected')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Actual')
        cy.get(TestCasesPage.initialPopulationRow).should('contain.text', 'Initial Population')
        cy.get(TestCasesPage.numeratorRow).should('contain.text', 'Numerator')
        cy.get(TestCasesPage.denominatorRow).should('contain.text', 'Denominator')
        cy.get(TestCasesPage.numeratorExclusionRow).should('contain.text', 'Numerator Exclusion')
        cy.get(TestCasesPage.denominatorExclusionRow).should('contain.text', 'Denominator Exclusion')
        cy.get(TestCasesPage.denominatorExceptionRow).should('contain.text', 'Denominator Exception')
    })
})

describe('Test Case Population dependencies', () => {

    before('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, proportionMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial PopulationOne', '', '', 'Initial PopulationOne', '', 'Initial PopulationOne', 'Boolean')
        OktaLogin.Login()
    })

    after('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify Test Case population dependencies for Proportion Measures', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Initial PopulationOne')
        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text',
            'Population details for this group updated successfully.')

        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.intercept('put', '/api/fhir/cql/callstacks').as('callstacks')
        cy.wait('@callstacks', { timeout: 60000 })

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.log('Select DENOM and verify IPP is checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).check()
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Uncheck IPP and verify DENOM is unchecked')
        cy.get(TestCasesPage.testCaseIPPExpected).uncheck()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')

        //Select DENOM again
        cy.get(TestCasesPage.testCaseDENOMExpected).check()
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Uncheck DENOM and verify IPP is not unchecked')
        cy.get(TestCasesPage.testCaseDENOMExpected).uncheck()
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Select Numerator and verify if DENOM and IPP are checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).check()
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Uncheck DENOM and verify if Numerator is unchecked')
        cy.get(TestCasesPage.testCaseDENOMExpected).uncheck()
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')

        //Check Numerator again
        cy.get(TestCasesPage.testCaseNUMERExpected).check()
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        cy.log('Uncheck Numerator and verify if Denom is not unchecked')
        cy.get(TestCasesPage.testCaseNUMERExpected).uncheck()
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')

        //Check Numerator again
        cy.get(TestCasesPage.testCaseNUMERExpected).check()
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        cy.log('Uncheck IPP and verify if DENOM and Numerator are unchecked')
        cy.get(TestCasesPage.testCaseIPPExpected).uncheck()
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')

        cy.log('Select Numerator Exclusion and verify IPP, Numerator and Denominator are selected')
        cy.get(TestCasesPage.testCaseNUMEXExpected).check()
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
    })
})

describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {

    beforeEach('Create measure and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(null, null, null, null, null, 'Procedure')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Test Case Population value options are limited to those that are defined from Measure Group', () => {
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.setMeasureGroupType()

        //set scoring value
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        //select scoring unit on measure
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).click()
        cy.get(MeasureGroupPage.ucumScoringUnitSelect).type('ml')

        //set Population Basis value
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        //setup measure group so that only the required fields / populations are defined / has values
        Utilities.validationMeasureGroupSaveAll('Ratio')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //confirm change to Population Criteria
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
        cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | Procedure')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Expected')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Actual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Initial Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Numerator')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Denominator')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Numerator Exclusion')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Denominator Exclusion')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Denominator Exception')

    })
})
