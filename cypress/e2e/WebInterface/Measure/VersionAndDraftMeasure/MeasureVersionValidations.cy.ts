import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Header} from "../../../../Shared/Header"
import {TestCaseAction, TestCasesPage} from "../../../../Shared/TestCasesPage"
import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {LandingPage} from "../../../../Shared/LandingPage"

const now = Date.now()
let measureName = 'VersionValidations' + now
let cqlLibraryName = 'VersionValidationsLib' + now
let measureCQL = MeasureCQL.SBTEST_CQL
let testCaseTitle = 'TestcaseTitle'
let testCaseDescription = 'Description' + now
let testCaseSeries = 'SBTestSeries'
let invalidTestCaseJson = TestCaseJson.TestCaseJson_Invalid
let cohortMeasureCQL = MeasureCQL.CQL_For_Cohort
let randValue = (Math.floor((Math.random() * 1000) + 1))
let testCaseJson = TestCaseJson.TestCaseJson_Valid

let measureCQL_WithErrors = 'library ' + cqlLibraryName + ' version \'0.0.000\'\n' +
    'using QICore version \'4.1.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' \n' +
    'valueset "ONC Administrative Sex": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Race": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Ethnicity": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.837\'\n' +
    'valueset "Payer": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Female": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.560.100.2\'\n' +
    'valueset "Home Healthcare Services": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1016\'\n' +
    'valueset "Hysterectomy with No Residual Cervix": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1014\'\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "Pap Test": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.108.12.1017\'\n' +
    'valueset "Preventive Care Services - Established Office Visit, 18 and Up": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1025\'\n' +
    'valueset "HPV Test": \'\')'

describe('Measure Versioning validations', () => {

    beforeEach('Create Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    it('User can not version Measure if there is no CQL', () => {

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get('.toast').should('contain.text', 'Requested measure cannot be versioned')
        cy.get(MeasuresPage.measureVersionHelperText).should('contain.text', 'Please include valid CQL in the CQL editor to version before versioning this measure')

    })

    it('User can not Version if the Measure CQL has errors', () => {

        MeasuresPage.actionCenter('edit')

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_WithErrors)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 60000)

        //Navigate to Measures Page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get('.toast').should('contain.text', 'Requested measure cannot be versioned')
        cy.get(MeasuresPage.measureVersionHelperText).should('contain.text', 'Please include valid CQL in the CQL editor to version before versioning this measure')

    })
})

describe('Measure Versioning when the measure has test case with errors', () => {

    let newMeasureName = measureName + randValue
    let newCqlLibraryName = cqlLibraryName + randValue + 4

    beforeEach('Create Measure and Login', () => {

        newMeasureName = 'TestMeasure' + Date.now() + randValue
        newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue
        //Create New Measure and Measure Group
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI()
        OktaLogin.Login()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        cy.get(Header.mainMadiePageButton).click()
        cy.get(LandingPage.newMeasureButton).should('be.visible')
    })

    afterEach('Logout', () => {

        OktaLogin.Logout()
    })

    it('User receives "Version Measures with Invalid Test Cases?" prompt / modal, if measure has test case with errors', () => {
        let versionNumber = '1.0.000'

        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, invalidTestCaseJson)

        //Navigate to Measures Page
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('version', 0)

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.discardChangesConfirmationBody, 20000)

        cy.get(TestCasesPage.discardChangesConfirmationBody).should('contain.text', 'You have test cases that are invalid.')

        cy.get(TestCasesPage.versionMeasurewithTCErrorsCancel).click()

        Utilities.waitForElementToNotExist(TestCasesPage.discardChangesConfirmationBody, 20000)

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
        })
        MeasuresPage.actionCenter('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click().wait(1000)
        Utilities.waitForElementVisible(MeasuresPage.confirmMeasureVersionNumber, 7000)
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()

        Utilities.waitForElementVisible(TestCasesPage.discardChangesConfirmationBody, 20000)

        cy.get(TestCasesPage.versionMeasurewithTCErrorsContinue).click()
        Utilities.waitForElementToNotExist(TestCasesPage.discardChangesConfirmationBody, 20000)

        MeasuresPage.validateVersionNumber(versionNumber)
        cy.log('Version Created Successfully')
    })
})

//Skipping until Feature flag 'EditTestsOnVersionedMeasures' is enabled
describe.skip('Create Test case for Qi Core Versioned Measure', () => {

    beforeEach('Create Measure and Login', () => {

        let newMeasureName = 'TestMeasure' + Date.now() + randValue
        let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue + 4
        //Create New Measure and Measure Group
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)
    })

    it('Measure owner able to Add, Clone and Import Test cases to Qi Core Versioned Measure', () => {

        //Version the Measure
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        //Add Test case
        MeasuresPage.actionCenter('edit')
        TestCasesPage.createTestCase(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)

        //Clone Test case
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterClone).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test case cloned successfully')

        //Verify that the Import Test case button is enabled
        cy.get(TestCasesPage.importTestCasesBtn).should('be.enabled')

    })
})

//Skipping until Feature flag 'EditTestsOnVersionedMeasures' is enabled
describe.skip('Edit and Delete Test case for Qi Core Versioned Measure', () => {

    beforeEach('Create Measure and Login', () => {

        let newMeasureName = 'TestMeasure' + Date.now() + randValue
        let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue + 4
        //Create New Measure and Measure Group
        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, cohortMeasureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
        OktaLogin.Login()
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteVersionedMeasure(measureName, cqlLibraryName)
    })

    it('Measure owner able to Edit Test case on a Qi Core Versioned Measure, that was created before Versioning', () => {

        //Version the Measure
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        MeasuresPage.actionCenter('edit')

        //Edit Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCasePopulationList).should('be.visible')

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.detailsTab).click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Test case updated successfully ' +
            'with warnings in JSON')
    })

    it('Measure owner unable to Delete Test case on a Qi Core Versioned Measure, that was created before Versioning', () => {

        //Version the Measure
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        MeasuresPage.actionCenter('edit')

        //Edit Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //Select Test case
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterDelete).should('not.be.enabled')
        cy.get('[data-testid="delete-tooltip"]').trigger('mouseover')
        cy.get('.MuiTooltip-tooltip').should('contain.text', 'Test cases added prior to versioning cannot be deleted')
    })

    it('Measure owner able to Delete Test case on a Qi Core Versioned Measure, that was created after Versioning', () => {

        //Version the Measure
        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('version')
        cy.get(MeasuresPage.versionMeasuresSelectionButton).eq(0).type('{enter}')
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(TestCasesPage.importTestCaseSuccessMsg).should('contain.text', 'New version of measure is Successfully created')
        cy.log('Version Created Successfully')

        //Add Test case
        MeasuresPage.actionCenter('edit')
        TestCasesPage.createTestCase('SecondTCTitle', 'SecondTCDescription', 'SecondTCSeries')

        //Select Test case
        TestCasesPage.checkTestCase(2)
        TestCasesPage.actionCenter(TestCaseAction.delete)
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test cases successfully deleted')
    })
})

describe('Non Measure owner unable to create Version', () => {

    before('Create Measure with regular user and Login as Alt user', () => {

        let newMeasureName = measureName + randValue
        let newCqlLibraryName = cqlLibraryName + randValue

        CreateMeasurePage.CreateQICoreMeasureAPI(newMeasureName, newCqlLibraryName, measureCQL)
        OktaLogin.AltLogin()
    })

    after('Logout and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('Verify Version button is not visible for non Measure owner', () => {

        //Navigate to Measures Page
        cy.get(Header.measures).click()

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')

            //Verify version button is not visible
            cy.get('[data-testid=create-version-measure-' + fileContents + ']').should('not.exist')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
        })

    })
})
