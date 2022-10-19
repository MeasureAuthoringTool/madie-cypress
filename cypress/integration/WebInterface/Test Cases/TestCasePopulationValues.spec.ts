import {CreateMeasurePage} from "../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../Shared/EditMeasurePage"
import {TestCasesPage} from "../../../Shared/TestCasesPage"
import {Utilities} from "../../../Shared/Utilities"
import {MeasureGroupPage} from "../../../Shared/MeasureGroupPage"
import {TestCaseJson} from "../../../Shared/TestCaseJson"
import {MeasureCQL} from "../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + (Date.now())
let CqlLibraryName = 'TestLibrary' + (Date.now())
let measureScoringArray = ['Select', 'Ratio', 'Cohort', 'Continuous Variable', 'Proportion']
let randValue = null

let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let testCaseSeries = 'SBTestSeries'
let newMeasureName = ''
let newCqlLibraryName = ''
let measureCQL = MeasureCQL.ICFCleanTest_CQL
let proportionMeasureCQL = MeasureCQL.CQL_Multiple_Populations

describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {

    beforeEach('Create measure and login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify the Test Case Populations when Measure group is not added', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()
        cy.get(TestCasesPage.testCasePopulationHeaderForNoMeasureGroup).should('contain.text', 'There are no groups associated with this measure. Please review the Groups tab.')
    })
    it('Validate Population Values check boxes are correct based on measure scoring value that is applied, ' +
        'when the measure is initially created (default measure group)', () => {

        cy.log((measureScoringArray[3].valueOf()).toString())

        //Add Measure Group
        MeasureGroupPage.createMeasureGroupforProportionMeasure()

        //Navigate to Test Cases page and verify Populations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | Boolean')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Expected')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Actual')

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
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/QICoreCleanCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        for (let i = 1; i <= 2; i++) {
            //log, in cypress, the measure score value
            cy.log((measureScoringArray[i].valueOf()).toString())
            //select scoring unit on measure
            if (i == 1) {
                Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
            } else if (i == 2) {
                Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
            }
            //based on the scoring unit value, select a value for all population fields
            Utilities.validationMeasureGroupSaveAll((measureScoringArray[i].valueOf()).toString())
            //select correct Population Basis value
            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('Procedure')
            cy.get(MeasureGroupPage.popBasisOption).click()
            //save measure group
            cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
            if (i == 2) {
                //validation message after attempting to save
                cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('exist')
                cy.get(MeasureGroupPage.scoreUpdateConfirmModal).should('contain.text', 'Change Scoring?Your Measure Scoring is about to be saved and updated based on these changes. Any expected values on your test cases will be cleared for this measure.Are you sure you want to Save Changes?This action cannot be undone.No, Keep WorkingYes, Save changes')
                cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('exist')
                cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.visible')
                cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).should('be.enabled')
                cy.get(MeasureGroupPage.updateMeasureGroupConfirmationBtn).click()
            } else if (i == 1) {
                //validation message after attempting to save
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
                cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
            }
        }

    })

    it('Validate Population Values are reset on all test cases that exist under a measure group, after the score ' +
        'unit value is saved / updated', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/QICoreCleanCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //log, in cypress, the measure score value
        cy.log((measureScoringArray[1].valueOf()).toString())
        //select correct Population Basis value
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)
        //based on the scoring unit value, select a value for all population fields
        Utilities.validationMeasureGroupSaveAll((measureScoringArray[1].valueOf()).toString())
        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
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

        cy.get(TestCasesPage.editTestCaseSaveButton).should('exist')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        //navigate to the Details tab to see confirmation message
        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.confirmationMsg).should('contain.text', 'Test case updated successfully!')
        //navigate back to the measure group tab / page and...
        //change score unit value and save / update measure with new value
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //log, in cypress, the measure score value
        cy.log((measureScoringArray[2].valueOf()).toString())
        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        //based on the scoring unit value, select a value for all population fields
        Utilities.validationMeasureGroupSaveAll((measureScoringArray[2].valueOf()).toString())
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

            cy.url({timeout: 100000}).should('include', '/edit/test-cases')

            cy.wait('@testCase').then(({response}) => {
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
        MeasuresPage.clickEditforCreatedMeasure()

        //navigate to CQL Editor page / tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        //read and write CQL from flat file
        cy.readFile('cypress/fixtures/QICoreCleanCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })
        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.log((measureScoringArray[4].valueOf()).toString())
        //select correct Population Basis value
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        //select scoring unit on measure
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)

        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(), 'wOOpt')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait(2000)
        //Navigate to Test Cases page and verify Populations
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | Procedure')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Expected')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Actual')
        cy.get(TestCasesPage.initialPopulationRow).should('contain.text', 'ipp')
        cy.get(TestCasesPage.numeratorRow).should('contain.text', 'numer')
        cy.get(TestCasesPage.denominatorRow).should('contain.text', 'denom')
        cy.get(TestCasesPage.numeratorExclusionRow).should('contain.text', 'numex')
        cy.get(TestCasesPage.denominatorExclusionRow).should('contain.text', 'denex')
        cy.get(TestCasesPage.denominatorExceptionRow).should('contain.text', 'denexcep')
    })
})

describe('Test Case Population dependencies', () => {

    before('Create measure and login', () => {

        randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, proportionMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(13500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial PopulationOne', 'Initial PopulationOne', 'Initial PopulationOne', 'Boolean')
        OktaLogin.Login()
    })

    after('Logout and Clean up Measures', () => {

        randValue = (Math.floor((Math.random() * 1000) + 1))
        newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Verify Test Case population dependencies for Proportion Measures', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'Initial PopulationOne')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'Initial PopulationOne')
        //save measure group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation message after attempting to save
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')
        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.testCaseTitle, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.testCaseTitle, 20000)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).focus()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle.toString())

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
        //setup for grabbing the measure create call
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')

            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.detailsTab).click()

            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })

            cy.get(EditMeasurePage.testCasesTab).click()

        })
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Proportion | Boolean')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Expected')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Actual')

        cy.log('Select DENOM and verify IPP is checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).check()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Uncheck IPP and verify DENOM is unchecked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPExpected).uncheck()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')

        //Select DENOM again
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).check()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Uncheck DENOM and verify IPP is not unchecked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).uncheck()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Select Numerator and verify if DENOM and IPP are checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).check()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')

        cy.log('Uncheck DENOM and verify if Numerator is unchecked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).uncheck()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')

        //Check Numerator again
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).check()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        cy.log('Uncheck Numerator and verify if Denom is not unchecked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).uncheck()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')

        //Check Numerator again
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).check()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')

        cy.log('Uncheck IPP and verify if DENOM and Numerator are unchecked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPExpected).uncheck()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseIPPExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('not.be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('not.be.checked')

        cy.log('Select Numerator Exclusion and verify IPP, Numerator and Denominator are selected')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.enabled')
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMEXExpected).check()
        cy.wait(500)
        cy.get(TestCasesPage.testCaseNUMEXExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.checked')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.checked')
    })

})

describe('TC Pop value options are limited to those that are defined from Measure Group', () => {
    beforeEach('Create measure with and login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(14500)
        OktaLogin.Logout()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Test Case Population value options are limited to those that are defined from Measure Group -- adding optional definitions', () => {

        
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //set scoring value
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        //set Population Basis value
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('Procedure')
        cy.get(MeasureGroupPage.popBasisOption).click()
        //setup measure group so that only the required fields / populations are defined / has values
        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'wOOpt')
        //save group
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait(2000)
        //create test case
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.detailsTab).should('exist')
        cy.get(TestCasesPage.detailsTab).should('be.visible')
        cy.get(TestCasesPage.detailsTab).click()

        cy.get(TestCasesPage.testCaseTitle).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.testCaseTitle, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.testCaseTitle, 20000)
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('exist')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).should('be.enabled')
        cy.get(TestCasesPage.testCaseDescriptionTextBox).focus()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(testCaseDescription)
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('exist')
        cy.get(TestCasesPage.testCaseSeriesTextBox).should('be.visible')
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(testCaseSeries).type('{enter}')
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).clear()
        cy.get(TestCasesPage.testCaseTitle).focus()
        cy.get(TestCasesPage.testCaseTitle).type(testCaseTitle.toString())

        //Add json to the test case
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson)
            //setup for grabbing the measure create call
            cy.readFile('cypress/fixtures/measureId').should('exist').then((id)=> {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')
        
            cy.get(TestCasesPage.editTestCaseSaveButton).click()
            cy.get(TestCasesPage.detailsTab).click()
        
            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({response}) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
        
            cy.get(EditMeasurePage.testCasesTab).click()
        
        })

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
        cy.get(TestCasesPage.initialPopulationRow).should('contain.text', 'ipp')
        cy.get(TestCasesPage.numeratorRow).should('contain.text', 'numer')
        cy.get(TestCasesPage.denominatorRow).should('contain.text', 'denom')
        cy.get(TestCasesPage.numeratorExclusionRow).should('contain.text', 'numex')
        cy.get(TestCasesPage.denominatorExclusionRow).should('contain.text', 'denex')
        cy.get(TestCasesPage.denominatorExceptionRow).should('contain.text', 'denexcep')
        //go back and update measure group to contain values for all of the population fields
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.validateMeasureGroup(measureScoringArray[4].valueOf().toString(),'all')
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
        cy.get(TestCasesPage.initialPopulationRow).should('contain.text', 'ipp')
        cy.get(TestCasesPage.numeratorRow).should('contain.text', 'numer')
        cy.get(TestCasesPage.denominatorRow).should('contain.text', 'denom')
        cy.get(TestCasesPage.numeratorExclusionRow).should('contain.text', 'numex')
        cy.get(TestCasesPage.denominatorExclusionRow).should('contain.text', 'denex')
        cy.get(TestCasesPage.denominatorExceptionRow).should('contain.text', 'denexcep')

    })
})
describe('Test Case Expected Measure Group population values based on initial measure scoring', () => {

    beforeEach('Create measure and login', () => {
        randValue = (Math.floor((Math.random() * 1000) + 1))
        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        //Create New Measure
        CreateMeasurePage.CreateAPIQICoreMeasureWithCQL(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.clickEditforCreatedMeasure()
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.wait(14500)
        OktaLogin.Logout()
        MeasureGroupPage.CreateRatioMeasureGroupAPI(null, null, null, null, null, 'Procedure')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })
    it('Test Case Population value options are limited to those that are defined from Measure Group', () => {
        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()
        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        //setup measure group so that only the required fields / populations are defined / has values
        Utilities.validateMeasureGroup(measureScoringArray[1].valueOf().toString(),'all')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.wait(500)
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        //create test case
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, validTestCaseJson, true)
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
    
        //click on Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
    
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('be.visible')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Group 1 - Ratio | Procedure')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Expected')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Actual')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'ipp')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'numer')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'denom')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'numex')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'denex')

    
    })
    
})
