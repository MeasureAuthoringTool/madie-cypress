import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { QDMElements } from "../../../../../Shared/QDMElements";


let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()


describe('MADiE Shift Test Case Dates tests', () => {

    beforeEach('Create Measure, test cases, and set the manifest option for the test case', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, false, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 3500)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()
        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()
        //selecting initial manifest value that will allow test case to pass
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //check / select radio button for manifest
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Manifest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
                cy.get(TestCasesPage.qdmManifestMaySecondOption).click()
                Utilities.waitForElementEnabled(TestCasesPage.qdmManifestSaveBtn, 3500)
                cy.get(TestCasesPage.qdmManifestSaveBtn).click()
                cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')

            })
        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-2024-05-02')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click().wait(3000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit', false)
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2000', 'Living', 'White', 'Male', 'Not Hispanic or Latino')
        //add element - code system to TC
        //Element - Medication:Discharged: Antithrombotic Therapy for Ischemic Stroke
        cy.get('[data-testid="elements-tab-medication"]').click()
        cy.get('[data-testid="data-type-Medication, Discharge: Antithrombotic Therapy for Ischemic Stroke"]').click()
        cy.get(TestCasesPage.authorDateTime).type('06/01/2025 01:00 PM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-RxNORM"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1536498"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click().wait(3000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit', false)
        TestCasesPage.grabElementId(1)
        TestCasesPage.qdmTestCaseElementAction('edit')
        //add negation
        Utilities.waitForElementVisible(TestCasesPage.negationTab, 35000)
        cy.get(TestCasesPage.negationTab).scrollIntoView().click()
        Utilities.waitForElementVisible(TestCasesPage.valueSetDirectRefCode, 35000)
        cy.get(TestCasesPage.valueSetDirectRefCode).scrollIntoView().click()
        Utilities.waitForElementVisible(TestCasesPage.valueSetOptionValue, 35000)
        cy.get(TestCasesPage.valueSetOptionValue).click()
        Utilities.waitForElementVisible('[id="code-system-selector"]', 35000)
        cy.get('[id="code-system-selector"]').click()
        Utilities.waitForElementVisible('[data-testid="option-SNOMEDCT"]', 35000)
        cy.get('[data-testid="option-SNOMEDCT"]').click()
        Utilities.waitForElementVisible('[id="code-selector"]', 35000)
        cy.get('[id="code-selector"]').click()
        Utilities.waitForElementVisible('[data-testid="option-105480006"]', 35000)
        cy.get('[data-testid="option-105480006"]').click()
        Utilities.waitForElementVisible('[data-testid="add-negation-rationale"]', 35000)
        cy.get('[data-testid="add-negation-rationale"]').click()
        //Close the Element
        cy.get('[data-testid="CloseIcon"]').scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible('[data-testid="CloseIcon"]', 35000)
        cy.get('[data-testid="CloseIcon"]').click()
        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(3000)
        //add element - code system to TC
        //Element - Encounter:Performed: Nonelective Inpatient Encounter
        cy.get('[data-testid="elements-tab-encounter"]').scrollIntoView().click()
        cy.get('[data-testid="data-type-Encounter, Performed: Nonelective Inpatient Encounter"]').click()
        QDMElements.addTimingRelevantPeriodDateTime('06/01/2025 01:00 PM', '06/02/2025 01:00 PM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        //navigate to the attribute sub tab and enter value
        cy.get(TestCasesPage.attributesTab).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-Diagnoses"]').click()
        cy.get('[data-testid="value-set-selector"]').scrollIntoView().click()
        cy.get('[data-testid="option-2.16.840.1.113883.3.117.1.7.1.247"]').click() //Select IschemicStroke from dropdown
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-value="111297002"]').click()
        cy.get('[data-testid="integer-input-field-Rank"]').type('1')
        cy.get(TestCasesPage.addAttribute).click()
        //Add Expected value for Test case
        //navigate to the Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click()
        //Initial Population expected box
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        //Denominator expected box
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        //Numerator expected box
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('0')
        //Numerator Exception expected box
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).type('1')
        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        //logout of MADiE
        OktaLogin.UILogout()
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC2', 'QDMManifestTCGroup2', 'QDMManifestTC2', '', true, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click().wait(3000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit', true)
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('02/29/1980', 'Living', 'White', 'Male', 'Not Hispanic or Latino')
        //add element - code system to TC
        //Element - Medication:Discharged: Antithrombotic Therapy for Ischemic Stroke
        cy.get('[data-testid="elements-tab-medication"]').click()
        cy.get('[data-testid="data-type-Medication, Discharge: Antithrombotic Therapy for Ischemic Stroke"]').click()
        cy.get(TestCasesPage.authorDateTime).type('02/28/2024 01:00 PM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-RxNORM"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-1536498"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click().wait(3000)
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit', true)
        TestCasesPage.grabElementId(1)
        TestCasesPage.qdmTestCaseElementAction('edit')
        //add negation
        Utilities.waitForElementVisible(TestCasesPage.negationTab, 35000)
        cy.get(TestCasesPage.negationTab).scrollIntoView().click()
        Utilities.waitForElementVisible(TestCasesPage.valueSetDirectRefCode, 35000)
        cy.get(TestCasesPage.valueSetDirectRefCode).scrollIntoView().click()
        Utilities.waitForElementVisible(TestCasesPage.valueSetOptionValue, 35000)
        cy.get(TestCasesPage.valueSetOptionValue).click()
        Utilities.waitForElementVisible('[id="code-system-selector"]', 35000)
        cy.get('[id="code-system-selector"]').click()
        Utilities.waitForElementVisible('[data-testid="option-SNOMEDCT"]', 35000)
        cy.get('[data-testid="option-SNOMEDCT"]').click()
        Utilities.waitForElementVisible('[id="code-selector"]', 35000)
        cy.get('[id="code-selector"]').click()
        Utilities.waitForElementVisible('[data-testid="option-105480006"]', 35000)
        cy.get('[data-testid="option-105480006"]').click()
        Utilities.waitForElementVisible('[data-testid="add-negation-rationale"]', 35000)
        cy.get('[data-testid="add-negation-rationale"]').click()
        //Close the Element
        cy.get('[data-testid="CloseIcon"]').scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible('[data-testid="CloseIcon"]', 35000)
        cy.get('[data-testid="CloseIcon"]').click()
        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(3000)
        //add element - code system to TC
        //Element - Encounter:Performed: Nonelective Inpatient Encounter
        cy.get('[data-testid="elements-tab-encounter"]').scrollIntoView().click()
        cy.get('[data-testid="data-type-Encounter, Performed: Nonelective Inpatient Encounter"]').click()
        QDMElements.addTimingRelevantPeriodDateTime('02/28/2024 01:00 PM', '02/29/2024 01:00 PM')
        cy.get('[data-testid="sub-navigation-tab-codes"]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="code-system-option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-testid="code-option-183452005"]').click()
        cy.get('[data-testid="add-code-concept-button"]').click()
        //navigate to the attribute sub tab and enter value
        cy.get(TestCasesPage.attributesTab).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-Diagnoses"]').click()
        cy.get('[data-testid="value-set-selector"]').scrollIntoView().click()
        cy.get('[data-testid="option-2.16.840.1.113883.3.117.1.7.1.247"]').click() //Select IschemicStroke from dropdown
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid="option-SNOMEDCT"]').click()
        cy.get('[id="code-selector"]').click()
        cy.get('[data-value="111297002"]').click()
        cy.get('[data-testid="integer-input-field-Rank"]').type('1')
        cy.get(TestCasesPage.addAttribute).click()
        //Add Expected value for Test case
        //navigate to the Expected / Actual tab
        cy.get(TestCasesPage.tctExpectedActualSubTab).scrollIntoView().click()
        //Initial Population expected box
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        //Denominator expected box
        cy.get(TestCasesPage.testCaseDENOMExpected).should('exist')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENOMExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')
        //Numerator expected box
        cy.get(TestCasesPage.testCaseNUMERExpected).should('exist')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseNUMERExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseNUMERExpected).type('0')
        //Numerator Exception expected box
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('exist')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).should('be.visible')
        cy.get(TestCasesPage.testCaseDENEXCEPTxpected).type('1')
        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        OktaLogin.UILogout()
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('MADiE Shift Test Case Dates -> Shift All Test Cases\' dates', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the page to utilize the shift *all* test case feature
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('4')

        //confirm buttons that appear on page to either discard or save the shift dates
        Utilities.waitForElementEnabled(TestCasesPage.shiftAllTestCasesDiscardBtn, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)

        //discard shifting dates
        cy.get(TestCasesPage.shiftAllTestCasesDiscardBtn).click()

        //confirm discarding change on page
        cy.get(TestCasesPage.continueDiscardChangesBtn).click()
        //confirm that shift test case text box is empty
        cy.get(TestCasesPage.shiftAllTestCaseDates).should('be.empty')

        //enter new value in the shift test case text box
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get(TestCasesPage.shiftAllTestCasesSuccessMsg).should('contain.text', 'All Test Case dates successfully shifted.')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', false)
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2003')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2028 1:00 PM - 06/02/2028 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2028 1:00 PMView')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1983')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2027 1:00 PM - 02/28/2027 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2027 1:00 PMView')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the page to utilize the shift *all* test case feature
        cy.get(TestCasesPage.testCaseDataSideLink).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftAllTestCaseDates, 3500)

        //enter new value in the shift test case text box
        cy.get(TestCasesPage.shiftAllTestCaseDates).type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shftAllTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shftAllTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get(TestCasesPage.shiftAllTestCasesSuccessMsg).should('contain.text', 'All Test Case dates successfully shifted.')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', false)
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2000')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2025 1:00 PM - 06/02/2025 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2025 1:00 PMView')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1980')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2024 1:00 PM - 02/28/2024 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2024 1:00 PMView')

    })

    it('MADiE Shift Test Case Dates -> Shift single / specific test case\'s dates', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', false)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).type('3')

        //shiftSpecificTestCasesCancelBtn
        cy.get(TestCasesPage.shiftSpecificTestCasesCancelBtn).click()

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', false)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get(TestCasesPage.shiftSpecificTestCasesSuccessMsg).should('contain.text', 'Test Case Shift Dates for QDMManifestTCGroup1 - QDMManifestTC1 successful.')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', false)
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2003')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2028 1:00 PM - 06/02/2028 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2028 1:00 PMView')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click().wait(3000)

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', true)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get(TestCasesPage.shiftSpecificTestCasesSuccessMsg).should('contain.text', 'Test Case Shift Dates for QDMManifestTCGroup2 - QDMManifestTC2 successful.')

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1983')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2027 1:00 PM - 02/28/2027 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2027 1:00 PMView')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', false)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        cy.get(TestCasesPage.shiftSpecificTestCasesSuccessMsg).should('contain.text', 'Test Case Shift Dates for QDMManifestTCGroup1 - QDMManifestTC1 successful.')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', false)
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2000')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2025 1:00 PM - 06/02/2025 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2025 1:00 PMView')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).wait(1700).click()

        //open the shift modal for the first test case
        TestCasesPage.testCaseAction('shift', true)
        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()
        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 3500)

        //confirm success message
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCasesSuccessMsg, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSuccessMsg).should('contain.text', 'Test Case Shift Dates for QDMManifestTCGroup2 - QDMManifestTC2 successful.')

        //navigate to the edit page for the first test case
        TestCasesPage.testCaseAction('edit', true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1980')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2024 1:00 PM - 02/28/2024 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1ViewMedication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2024 1:00 PMView')
    })
})