import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"

let measureName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let CqlLibraryName = 'RatioListQDMPositiveEncounterPerformedWithMO' + Date.now()
let firstTestCaseTitle = '3Encounters1Exclusion'
let testCaseDescription = 'DENEXPass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureQDMPBCQL = MeasureCQL.qdmCQLPatientBasedTest
let measureQDMNPBCQL = MeasureCQL.qdmCQLNonPatienBasedTest
let testCaseTitle = 'test case title'
let measureCQL = MeasureCQL.SBTEST_CQL
let measureScoring = 'Cohort'
let newMeasureName = ''
let newCqlLibraryName = ''




describe.skip('Clone QDM Test Case', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Ratio', false, measureQDMNPBCQL, false, false,
            '2023-01-01', '2024-12-31')
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()
    })

    after('Logout and Clean up', () => {

        OktaLogin.Logout()
        //Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Clone QDM Test Case Element - Success scenario', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Measure Observation hours')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //add second PC / group to measure
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('exist')
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')

        cy.get(MeasureGroupPage.addDenominatorObservationLink).click()

        cy.get(MeasureGroupPage.denominatorObservation).should('exist')
        cy.get(MeasureGroupPage.denominatorObservation).should('be.visible')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorObservation, 'Measure Observation hours')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorAggregateFunction, 'Count')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Initial Population')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')


        //Add Elements to first Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        cy.get(TestCasesPage.QDMDob).type('07/31/2003').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Living').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        //add element - code system to TC
        //Element - Encounter:Performed: Observation Services
        cy.get('[data-testid="elements-tab-encounter"]').click()
        cy.get('[data-testid="data-type-Encounter, Performed: Observation Services"]').click()
        cy.get('[id="dateTime"]').eq(0).type('03/07/2023 08:00 AM')
        cy.get('[id="dateTime"]').eq(1).type('03/08/2023 08:15 AM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-448951000124107"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()

        cy.pause()

        //Close the Element
        cy.get('[data-testid=CloseIcon]').click()

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        cy.pause()

        cy.get('[class="data-elements-table"]').find('[class="qpp-c-button view-with-dropdown-button"]').find(TestCasesPage.tcHLExpandResultBtn).first().click({ force: true })
        cy.get('[data-testid="popover-content"]').find(TestCasesPage.editBtnNoId).find('Clone').click({ force: true })

        cy.pause()

    })
})