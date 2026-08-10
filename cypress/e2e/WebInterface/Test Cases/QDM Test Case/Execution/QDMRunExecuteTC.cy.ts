import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { CreateMeasureOptions, CreateMeasurePage } from '../../../../../Shared/CreateMeasurePage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import { TestCaseJson } from '../../../../../Shared/TestCaseJson'
import { Utilities } from '../../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../../Shared/MeasureGroupPage'
import { CQLEditorPage } from '../../../../../Shared/CQLEditorPage'
import { MeasureCQL } from '../../../../../Shared/MeasureCQL'

let measureName = 'QDMRunExecuteTC' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
const validTestCaseJson = TestCaseJson.QDMTestCaseJson
const measureCQL = MeasureCQL.QDMCQL4MAT5645
const measureData: CreateMeasureOptions = {}

const completeQDMExecutionSetup = () => {
    OktaLogin.Login()
    MeasuresPage.actionCenter('edit')
    CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

    cy.get(EditMeasurePage.measureGroupsTab).should('be.visible').click()
    cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
    cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()
    cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
    cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
    cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
    cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).scrollIntoView().contains('SDE Sex').click()
    cy.get(MeasureGroupPage.supplementalDataDefinitionDescriptionTextBox).type('This is a description.')
    cy.get(MeasureGroupPage.saveSupplementalDataElements).should('be.visible').and('be.enabled').click()
    cy.get(EditMeasurePage.successMessage).should(
        'contain.text',
        'Measure Supplemental Data have been Saved Successfully'
    )
    Utilities.waitForElementToNotExist(EditMeasurePage.successMessage, 50000)
    Utilities.waitForElementDisabled(MeasureGroupPage.saveSupplementalDataElements, 60000)
}

describe('Run / Execute Test case and verify passing percentage and coverage', () => {
    beforeEach('Create measure and group', () => {
        measureName = 'QDMRunExecuteTC' + Date.now()
        CqlLibraryName = 'QDMExecPercentages' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Run / Execute single passing Test Case', () => {
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        completeQDMExecutionSetup()
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)

        TestCasesPage.clickEditforCreatedTestCase()
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics(
            '07/01/2002 12:00 AM',
            'Living',
            'White',
            'Male',
            'Not Hispanic or Latino'
        )

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.qdmStrata1ExpectedValue)
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.qdmStratifiedInitialPopulationExpectedValue, {
            index: 0
        })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.qdmStrata2ExpectedValue)
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.qdmStratifiedInitialPopulationExpectedValue, {
            index: 1
        })

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 60000)

        TestCasesPage.openTestCasesTab(TestCasesPage.executeTestCaseButton)
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/1)')

        //Verify Coverage percentage
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')
    })

    it('Run / Execute one passing and one failing Test Cases', () => {
        TestCasesPage.CreateQDMTestCaseAPI('FailingTestCase', 'SBTestSeries', 'TestDesc')
        TestCasesPage.CreateQDMTestCaseAPI('Passing Test Case', 'ICFTCSeries', 'PTC', undefined, true)
        completeQDMExecutionSetup()
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.enterPatientDemographics(
            '01/01/2020 12:00 AM',
            'Living',
            'White',
            'Male',
            'Not Hispanic or Latino'
        )

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 15000)

        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 30000)

        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase(true)

        TestCasesPage.enterPatientDemographics(
            '01/01/2020 12:00 AM',
            'Living',
            'White',
            'Male',
            'Not Hispanic or Latino'
        )

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 30000)

        //Click on Execute Test Case button on Edit Test Case page
        TestCasesPage.openTestCasesTab(TestCasesPage.executeTestCaseButton)
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Fail')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '50%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/2)')
    })

    it('Run / Execute single failing Test Cases', () => {
        TestCasesPage.CreateQDMTestCaseAPI('Failing Test Case', 'ICFTCSeries', 'FTC')
        completeQDMExecutionSetup()
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        TestCasesPage.enterPatientDemographics(
            '01/01/2020 12:00 AM',
            'Living',
            'White',
            'Male',
            'Not Hispanic or Latino'
        )

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected)

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 30000)

        //Click on Execute Test Case button on Edit Test Case page
        TestCasesPage.openTestCasesTab(TestCasesPage.executeTestCaseButton)
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible').and('be.enabled').click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')
    })
})

describe('Run / Execute QDM Test Case button validations', () => {
    beforeEach('Create Measure', () => {
        measureName = 'QDMRunExecuteTC' + Date.now()
        CqlLibraryName = 'QDMExecButtons' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Run Test Case button is disabled  -- CQL Errors', () => {
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible').click()
        Utilities.waitForElementWriteEnabled(EditMeasurePage.cqlEditorTextBox, 8500)
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{home}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('adjfajsdsdjf{}')

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        Utilities.waitForElementDisabled(EditMeasurePage.cqlEditorSaveButton, 60000)
        cy.get(EditMeasurePage.cqlEditorExpandCollapseBtn).click()

        cy.intercept('GET', /\/api\/measures\/[^/]+\/test-cases(?:\?.*)?$/).as('testCaseList')
        TestCasesPage.openTestCasesTab()
        cy.wait('@testCaseList').its('response.statusCode').should('eq', 200)
        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseSyntaxError, 105000)
        cy.get(TestCasesPage.testCaseSyntaxError).should(
            'contain.text',
            'An error exists with the measure CQL, please review the CQL Editor tab.'
        )
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })

    it('Run / Execute Test Case button is disabled  -- Missing group / population selections', () => {
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })

        cy.get(EditMeasurePage.testCasesTab).scrollIntoView()
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.testCaseSyntaxError, 105000)
        cy.get(TestCasesPage.testCaseSyntaxError).should(
            'contain.text',
            'No Population Criteria is associated with this measure. Please review the Population Criteria tab.'
        )
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('not.be.enabled')
    })

    it('Run / Execute Test Case button is disabled -- missing TC Json', () => {
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')

        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'N/A')
    })
})

describe('Run / Execute Test case for multiple Population Criteria', () => {
    beforeEach('Create Measure, Measure group and login', () => {
        measureName = 'QDMRunExecuteTC' + Date.now()
        CqlLibraryName = 'QDMExecMultiplePC' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout and Clean up Measures', () => {
        Utilities.deleteMeasure()
    })

    it('Run and Execute Test case for multiple Population Criteria', () => {
        TestCasesPage.openTestCasesTab(TestCasesPage.newTestCaseButton)
        TestCasesPage.clickEditforCreatedTestCase()

        //Add Demographics
        cy.get(TestCasesPage.QDMDob).type('01/01/2020 12:00 AM')

        //Add Expected/Actual value to first Population criteria
        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })
        TestCasesPage.checkExpectedActualCheckbox(TestCasesPage.testCaseIPPExpected, { index: 0 })
        //save dob value
        Utilities.waitForElementEnabled(TestCasesPage.editTestCaseSaveButton, 60000)
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#ae1c1c')
        cy.get(TestCasesPage.measureGroup2Label).should('have.color', '#4d7e23')

        //Click on Execute Test Case button on Test Case list page and verify status for multiple populations
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        Utilities.waitForElementVisible(EditMeasurePage.testCasesTab, 60000)
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get('body').then(($body) => {
            if ($body.find(Utilities.discardChangesConfirmationModal).length > 0) {
                Utilities.clickOnDiscardChanges()
            }
        })
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 60000)
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')
    })
})

describe('Run / Execute Test Case by Non Measure Owner', () => {
    beforeEach('Create Measure, Measure group and Test case', () => {
        measureName = 'QDMRunExecuteTC' + Date.now()
        CqlLibraryName = 'QDMExecNonOwner' + Date.now()

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        CQLEditorPage.saveCql({ collapseEditor: true, waitForDisabled: true })
    })

    afterEach('Logout and Clean up', () => {
        Utilities.deleteMeasure()
    })

    it('Non Measure owner should be able to Run/Execute Test case', () => {
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //Add Demographics
        cy.get(TestCasesPage.QDMDob).type('01/01/2020 12:00 AM')

        //save dob value
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        OktaLogin.UILogout()

        //Login as ALT User
        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 30000)

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        TestCasesPage.openExpectedActualTab({ checkboxSelector: TestCasesPage.testCaseIPPExpected })

        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
    })
})
