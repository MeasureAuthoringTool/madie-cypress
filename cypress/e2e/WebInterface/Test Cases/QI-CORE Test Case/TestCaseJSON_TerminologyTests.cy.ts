import { OktaLogin } from '../../../../Shared/OktaLogin'
import { CreateMeasurePage } from '../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { Header } from '../../../../Shared/Header'
import { Toasts } from '../../../../Shared/Toasts'

const measureName = 'JSONTerminology'
const CqlLibraryName = 'JSONTerminologyLib'
const testCaseTitle = 'test case title'
const testCaseDescription = 'example test case'
const testCaseSeries = 'SBTestSeries'
const missingResourceIDTCJson = TestCaseJson.TestCaseJson_missingResourceIDs
const missingResourceIDTCJsonButHasFullUrlExt = TestCaseJson.TestCaseJson_missingResourceIDsHasfullUrlExt
const emptyResourceIDTCJson = TestCaseJson.TestCaseJson_emptyResourceIDs
const missingMetaProfile = TestCaseJson.TestCaseJson_missingMetaProfile
const validTestCaseJson = TestCaseJson.TestCaseJson_Valid
const cardInvalidTCJson = TestCaseJson.tcCardErrorJson
const dupResourceIDTCJson = TestCaseJson.TCJsonTerminologyTsts

const measureCQL = MeasureCQL.CQL_Multiple_Populations
const measureCQLPFTests = MeasureCQL.CQL_Populations
const measureCQLCardTests = MeasureCQL.zipfileExportQICore
const CQLForCVMeasure =
    "library SimpleFhirMeasure version '0.0.001'\n" +
    "using FHIR version '4.0.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n" +
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

describe('Warning modal on Test Case JSON Editor', () => {
    beforeEach('Create measure and login', () => {
        const libName = CqlLibraryName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(
            0,
            false,
            'Initial Population',
            '',
            '',
            'Initial Population',
            '',
            'Initial Population',
            'Boolean'
        )
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: false })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Verify warning modal when the Test Case JSON has unsaved changes', () => {
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
        cy.get(TestCasesPage.discardChangesConfirmationBody).should(
            'contain.text',
            'Are you sure you want to discard your changes?'
        )
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
        const libName = CqlLibraryName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libName, measureCQLPFTests)
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
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: false })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('JSON contains empty Resource ID values', () => {
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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details ' + 'for this group updated successfully.'
        )

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
        TestCasesPage.waitForJsonEditorReady()
        cy.editTestCaseJSON(emptyResourceIDTCJson)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get(Toasts.errorToast).should('have.text', 'Test case updated successfully with errors in JSON')

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should(
            'contain.text',
            'HAPI-1821: ' + '[element="id"] Invalid attribute value "": Attribute value must not be empty ("")'
        )
    })

    it(
        'JSON missing Resource IDs; the fullUrl value will automatically update with an ending ' +
            'slash and should result with an update but with errors',
        () => {
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
            cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
                'contain.text',
                'Population details for this group updated successfully.'
            )

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
            TestCasesPage.waitForJsonEditorReady()
            cy.editTestCaseJSON(missingResourceIDTCJsonButHasFullUrlExt)

            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
            cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
            cy.get(TestCasesPage.editTestCaseSaveButton).click()

            cy.get(TestCasesPage.errorToastMsg).should('exist')
            cy.get(TestCasesPage.errorToastMsg).should('be.visible')
            cy.get('.toast').should('have.text', 'Test case updated successfully with errors in JSON')

            cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
            cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should(
                'contain.text',
                'Error: HAPI-1821: [element="id"] Invalid attribute value "": Attribute value must not be empty ("")'
            )
        }
    )

    it('JSON missing Resource IDs', () => {
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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group updated successfully.'
        )

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
        TestCasesPage.waitForJsonEditorReady()
        cy.editTestCaseJSON(missingResourceIDTCJson)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get(Toasts.errorToast).should('have.text', 'Test case updated successfully with errors in JSON')
    })

    it('JSON has Resource IDs duplicated for different resources', () => {
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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group updated successfully.'
        )

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
        TestCasesPage.waitForJsonEditorReady()
        cy.editTestCaseJSON(dupResourceIDTCJson)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.errorToastMsg).should('exist')
        cy.get(TestCasesPage.errorToastMsg).should('be.visible')
        cy.get(Toasts.errorToast).should('have.text', 'Test case updated successfully with errors in JSON')

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should(
            'contain.text',
            'Error: All resources in bundle must have unique ID regardless of type. Multiple resources detected with ID [4989ju789fn93bvy562loe87c]'
        )
    })

    it('Verify warning message for missing Meta.Profile Values on Resources in Test case Json', () => {
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
        TestCasesPage.waitForJsonEditorReady()
        cy.editTestCaseJSON(missingMetaProfile)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        Utilities.waitForElementVisible(TestCasesPage.editTestCaseSaveButton, 27700)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.successMsg).should('exist')
        cy.get(TestCasesPage.successMsg).should('be.visible')
        cy.get('.toast').should('have.text', 'Test case updated successfully with warnings in JSON')

        cy.get(TestCasesPage.detailsTab).scrollIntoView()
        Utilities.waitForElementVisible(TestCasesPage.detailsTab, 27700)
        cy.get(TestCasesPage.detailsTab).click()
        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 27700)

        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('exist')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should('be.visible')
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should(
            'contain.text',
            'Resource of type [Encounter] is missing the Meta.profile. Resource Id: [5c6c61ceb84846536a9a98f9]. Resources missing Meta.profile may cause incorrect results while executing this test case.'
        )
    })
})

describe('JSON Resource ID tests - Proportion Score Type', () => {
    beforeEach('Create measure, login and update CQL, create group, and login', () => {
        const libName = CqlLibraryName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libName, measureCQLPFTests)
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
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: false })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Expect / Actual Labels are correct', () => {
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
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should(
            'contain.text',
            'Population details for this group updated successfully.'
        )

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
        cy.editTestCaseJSON(validTestCaseJson)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        TestCasesPage.openExpectedActualTab()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Initial Population')
    })
})

describe('JSON Resource ID tests -- CV', () => {
    beforeEach('Create measure, login and update CQL, create group, and login', () => {
        const libName = CqlLibraryName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libName, CQLForCVMeasure)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
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
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle)
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
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
        TestCasesPage.openExpectedActualTab()

        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Initial Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Population')
        cy.get(TestCasesPage.testCasePopulationValuesTable).should('contain.text', 'Measure Population Exclusion')
    })
})

describe('Tests around cardinality violations', () => {
    beforeEach('Create New Measure and Login', () => {
        const libName = CqlLibraryName + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, libName, measureCQLCardTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'ipp', '', '', 'num', '', 'denom', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, cardInvalidTCJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: false })

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Log out', () => {
        Utilities.deleteMeasure()
    })

    it('Verify error is returned when there is a model violation -- use an object where expecting an array', () => {
        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to test cases' details page
        TestCasesPage.clickEditforCreatedTestCase()

        //wait for and then click to view the errors
        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationErrorBtn, 30700)
        cy.get(TestCasesPage.testCaseJsonValidationErrorBtn).click()

        //wait for and confirm the correct error appears
        Utilities.waitForElementVisible(TestCasesPage.testCaseJsonValidationDisplayList, 30700)
        cy.get(TestCasesPage.testCaseJsonValidationDisplayList).should(
            'contain.text',
            'HAPI-1820: Found incorrect type for element partOf - Expected ARRAY and found OBJECT'
        )
    })
})
