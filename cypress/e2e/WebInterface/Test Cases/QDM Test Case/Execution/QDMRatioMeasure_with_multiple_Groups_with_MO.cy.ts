import { CreateMeasureOptions, CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { QDMElements } from "../../../../../Shared/QDMElements"
import { umlsLoginForm } from "../../../../../Shared/umlsLoginForm"
import { Header } from "../../../../../Shared/Header"

let measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let firstTestCaseTitle = '3Encounters1Exclusion'
let testCaseDescription = 'DENEXPass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureQDMPBCQL = MeasureCQL.qdmCQLPatientBasedTest
let measureQDMNPBCQL = MeasureCQL.qdmCQLNonPatienBasedTest

const measureData: CreateMeasureOptions = {}

describe('Measure Creation: Patient Based: Ratio measure with multiple groups with MOs', () => {

    before('Create Measure', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Ratio'
        measureData.patientBasis = 'true'
        measureData.measureCql = measureQDMPBCQL
        measureData.mpStartDate = '2023-01-01'
        measureData.mpEndDate = '2024-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()

        //adding supplemental data
        MeasuresPage.actionCenter('edit')
        // add SDE to test case coverage
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        MeasureGroupPage.includeSdeData()
        cy.get(Header.mainMadiePageButton).click()
    })

    after('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case execution with patient based groups with MOs', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Group Creation
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Measure Observation hours')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //add second PC / group to measure
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Measure Observation hours')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/31/2003 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //add element - code system to TC
        //Element - Encounter:Performed: Observation Services
        cy.get(TestCasesPage.EncounterElementTab).click()
        cy.get(TestCasesPage.EncounterOSCard).click()
        QDMElements.addTimingRelevantPeriodDateTime('03/07/2023 08:00 AM', '03/08/2023 08:15 AM')
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabCodes).click()
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get(TestCasesPage.codeSelector).click()
        cy.get('[data-testid="code-option-448951000124107"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Close the Element
        cy.get(umlsLoginForm.closeGenericError).click()

        //save changes
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()
        cy.get(TestCasesPage.testCaseDENOMExpected).check()
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('8')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('8')
        cy.get(TestCasesPage.testCaseNUMERExpected).check()

        //save changes
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //run test cases
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('exist')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')
        cy.get(TestCasesPage.measureGroup2Label).should('have.color', '#4d7e23')

    })
})

describe('Measure Creation: Non-patient based: Ratio measure with multiple groups with MOs', () => {

    before('Create Measure', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Ratio'
        measureData.patientBasis = 'false'
        measureData.measureCql = measureQDMNPBCQL
        measureData.mpStartDate = '2023-01-01'
        measureData.mpEndDate = '2024-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()

        //adding supplemental data
        MeasuresPage.actionCenter('edit')
        // add SDE to test case coverage
        cy.get(EditMeasurePage.measureGroupsTab).should('be.visible')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        MeasureGroupPage.includeSdeData()
        cy.get(Header.mainMadiePageButton).click()
    })

    after('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case execution with non-patient based groups with MOs', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Group Creation
        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //Select Type
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()

        //select 'Cohort' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Measure Observation hours')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //add second PC / group to measure
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.populationSelect(MeasureGroupPage.denominatorSelect, "Denominator")

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Measure Observation hours')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')


        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/31/2003 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //add element - code system to TC
        //Element - Encounter:Performed: Observation Services
        cy.get(TestCasesPage.EncounterElementTab).click()
        cy.get(TestCasesPage.EncounterOSCard).click()
        QDMElements.addTimingRelevantPeriodDateTime('03/07/2023 08:00 AM', '03/08/2023 08:15 AM')
        cy.get(TestCasesPage.ExpandedOSSDetailCardTabCodes).click()
        cy.get(TestCasesPage.codeSystemSelector).click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get(TestCasesPage.codeSelector).click()
        cy.get('[data-testid="code-option-448951000124107"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        //Close the Element
        cy.get(umlsLoginForm.closeGenericError).click()

        //save changes
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).clear().type('1')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(1).clear().type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).eq(0).clear().type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).eq(1).clear().type('1')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(0).clear().type('24')
        cy.get(TestCasesPage.denominatorObservationExpectedRow).eq(1).clear().type('24')
        cy.get(TestCasesPage.testCaseNUMERExpected).eq(0).clear().type('1')
        cy.get(TestCasesPage.testCaseNUMERExpected).eq(1).clear().type('1')

        //save changes
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()


        //run test cases
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('exist')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.measureGroup1Label).should('have.color', '#4d7e23')
        cy.get(TestCasesPage.measureGroup2Label).should('have.color', '#4d7e23')
    })
})
