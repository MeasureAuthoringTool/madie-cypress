import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"
import { Toasts } from "../../../../Shared/Toasts"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let missingResourceIDTCJson = TestCaseJson.TestCaseJson_missingResourceIDs
let missingResourceIDTCJsonButHasFullUrlExt = TestCaseJson.TestCaseJson_missingResourceIDsHasfullUrlExt
let emptyResourceIDTCJson = TestCaseJson.TestCaseJson_emptyResourceIDs
let missingMetaProfile = TestCaseJson.TestCaseJson_missingMetaProfile
let validTestCaseJson = TestCaseJson.TestCaseJson_Valid
let cardInvalidTCJson = TestCaseJson.tcCardErrorJson
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.CQL_Multiple_Populations
let measureCQLPFTests = MeasureCQL.CQL_Populations
let CQLForCVMeasure = 'library SimpleFhirMeasure version \'0.0.001\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "ipp":\n' +
    '  true\n' +
    'define "denom":\n' +
    '  "ipp"\n' +
    'define "num":\n' +
    '  exists ["Encounter"] E where E.status ~ \'finished\'\n' +
    'define "numeratorExclusion":\n' +
    '    "num"\n' +
    'define "numEnc":\n' +
    '     ["Encounter"] E where E.status ~ \'finished\'\n' +
    'define function ToCode(e Encounter):\n' +
    '              duration in days of e.period\n' +
    'define function fun(notPascalCase Integer ):\n' +
    '  true\n' +
    'define function "isFinishedEncounter"(Enc Encounter):\n' +
    '  true\n' +
    'define function "booleanFunction"():\n' +
    '  true'

let measureCQLCardTests = MeasureCQL.zipfileExportQICore
let dupResourceIDTCJson = TestCaseJson.TCJsonTerminologyTsts

describe('Warning modal on Test Case JSON Editor', () => {

    beforeEach('Create measure and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'Boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, newCqlLibraryName)
    })

    it('Verify warning modal when the Test Case JSON has unsaved changes', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and create Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)

        TestCasesPage.clickCreateTestCaseButton()

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 27700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditor).type('Warning Modal Test')

        //Warning Modal displayed when user navigated to Measure Group tab without saving changes
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(Utilities.discardChangesConfirmationModal).should('contain.text', 'Discard Changes?')
        cy.get(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'Are you sure you want to discard your changes?')
        cy.get(Utilities.keepWorkingCancel).click()

        //Click on details tab & the warning modal should not display
        cy.get(TestCasesPage.detailsTab).click()
        cy.get(Utilities.discardChangesConfirmationModal).should('not.exist')

        //Click on Test Cases tab and discard all changes
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(Utilities.discardChangesContinue).click()
        cy.get(TestCasesPage.newTestCaseButton).should('exist')
    })
})

describe('JSON Resource ID tests', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorTab, 27700)
        cy.get(EditMeasurePage.cqlEditorTab).click()
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorTextBox, 27700)
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{enter}')
        Utilities.waitForElementVisible(EditMeasurePage.cqlEditorSaveButton, 27700)
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName)
    })

    it('JSON contains empty Resource ID values', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details ' +
            'for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
        cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.wait(2000)
        cy.get(TestCasesPage.aceEditor).type(emptyResourceIDTCJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get(Toasts.errorToast).should('have.text', Toasts.errorOffsetText)

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'HAPI-1821: ' +
            '[element="id"] Invalid attribute value "": Attribute value must not be empty ("")')
    })

    it('JSON missing Resource IDs; the fullUrl value will automatically update with an ending ' +
        'slash and should result with an update but with errors', () => {

            //Click on Edit Measure
            MeasuresPage.actionCenter('edit')

            //Add second Measure Group with return type as Boolean
            cy.get(EditMeasurePage.measureGroupsTab).click()

            Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
            cy.get(MeasureGroupPage.popBasis).should('exist')
            cy.get(MeasureGroupPage.popBasis).should('be.visible')
            cy.get(MeasureGroupPage.popBasis).click()
            cy.get(MeasureGroupPage.popBasis).type('boolean')
            cy.get(MeasureGroupPage.popBasisOption).click()

            Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

            //Navigate to Test Cases page and add Test Case details
            cy.get(EditMeasurePage.testCasesTab).click()
            cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
            cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
            cy.get(TestCasesPage.newTestCaseButton).click()

            cy.get(TestCasesPage.createTestCaseDialog).should('exist')
            cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

            cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
            Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
            Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
            cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
            cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
            cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
            cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
            cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
            cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
            cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
            cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
            cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
            cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')
            TestCasesPage.clickCreateTestCaseButton()

            //Verify created test case Title and Series exists on Test Cases Page
            TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

            TestCasesPage.clickEditforCreatedTestCase()

            //Add json to the test case
            Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.wait(2000)
            cy.get(TestCasesPage.aceEditor).type(missingResourceIDTCJsonButHasFullUrlExt, { parseSpecialCharSequences: false })

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()

            cy.get(TestCasesPage.errorToastMsg).should('exist')
            cy.get(TestCasesPage.errorToastMsg).should('be.visible')
            cy.get(Toasts.errorToast).should('have.text', Toasts.errorOffsetText)

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Error: HAPI-1821: [element="id"] Invalid attribute value "": Attribute value must not be empty ("")')
    })

    it('JSON missing Resource IDs', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
        cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')
        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.wait(2000)
        cy.get(TestCasesPage.aceEditor).type(missingResourceIDTCJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get(Toasts.errorToast).should('have.text', Toasts.errorOffsetText)
    })

    it('JSON has Resource IDs duplicated for different resources', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
        cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')
        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).click()
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 3500)
        cy.get(TestCasesPage.aceEditor).wait(1500).type(dupResourceIDTCJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get(Toasts.errorToast).should('have.text', Toasts.errorOffsetText)

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Error: All resources in bundle must have unique ID regardless of type. Multiple resources detected with ID [4989ju789fn93bvy562loe87c]')
    })

    it('Verify warning message for missing Meta.Profile Values on Resources in Test case Json', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 27700)
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        Utilities.waitForElementVisible(TestCasesPage.newTestCaseButton, 27700)
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
        cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')
        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.wait(2000)
        cy.get(TestCasesPage.aceEditor).type(missingMetaProfile, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        Utilities.waitForElementVisible(TestCasesPage.editTestCaseSaveButton, 27700)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.successMsg).should('exist')
        cy.get(TestCasesPage.successMsg).should('be.visible')
        cy.get(Toasts.otherSuccessToast).should('have.text', Toasts.warningOffsetText)     

        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        Utilities.waitForElementVisible(TestCasesPage.detailsTab, 27700)
        cy.get(TestCasesPage.detailsTab).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 27700)

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'Resource of type [Encounter] is missing the Meta.profile. Resource Id: [5c6c61ceb84846536a9a98f9]. Resources missing Meta.profile may cause incorrect results while executing this test case.')
    })
})

describe('JSON Resource ID tests - Proportion Score Type', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / succesful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName)
    })

    it('Expect / Actual Labels are correct', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Add second Measure Group with return type as Boolean
        cy.get(EditMeasurePage.measureGroupsTab).click()

        MeasureGroupPage.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCohort)
        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')

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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group updated successfully.')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
        cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')
        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 30700)
        cy.get(TestCasesPage.aceEditor).click()
        cy.get(TestCasesPage.aceEditor).type(validTestCaseJson, { parseSpecialCharSequences: false })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Initial Population')
    })
})

describe('JSON Resource ID tests -- CV', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, CQLForCVMeasure)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName)
    })

    it('Measure bundle end point returns stratifications for Continuous Variable Measure', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()
        MeasureGroupPage.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.cvMeasureObservation, 'booleanFunction')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Maximum')

        cy.get(MeasureGroupPage.reportingTab).click()

        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationSelect, 5000)

        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        Utilities.waitForElementVisible(MeasureGroupPage.improvementNotationDescQiCore, 5000)

        cy.get(MeasureGroupPage.improvementNotationDescQiCore).type('some imporvement notation description')

        //save Population Criteria
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        Utilities.waitForElementVisible(MeasureGroupPage.successfulSaveMeasureGroupMsg, 27700)
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('be.visible')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries)
        cy.get(TestCasesPage.createTestCaseGroupInput).type('{upArrow}{enter}')
        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Initial Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Population Exclusion')
    })
})

describe('Tests around cardinality violations', () => {

    beforeEach('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLCardTests)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, cardInvalidTCJson)
        OktaLogin.Login()
    })

    afterEach('Log out', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Verify error is returned when there is a model violation -- use an object where expecting an array', () => {
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test cases' details page
        TestCasesPage.clickEditforCreatedTestCase()

        //wait for and then click to view the errors
        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30700)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //wait for and confirm the correct error appears
        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationDisplayList, 30700)
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('contain.text', 'HAPI-1820: Found incorrect type for element partOf - Expected ARRAY and found OBJECT')
    })
})
