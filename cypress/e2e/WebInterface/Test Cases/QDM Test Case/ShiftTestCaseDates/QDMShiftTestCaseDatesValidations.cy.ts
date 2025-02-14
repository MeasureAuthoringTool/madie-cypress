import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { QDMElements } from "../../../../../Shared/QDMElements"
import { Header } from "../../../../../Shared/Header"
import { LandingPage } from "../../../../../Shared/LandingPage"

let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = Date.now()
let measureName = 'ProportionPatient' + now
let CqlLibraryName = 'ProportionPatient' + now


describe('MADiE Shift Test Case Dates tests for QDM Measure', () => {

    beforeEach('Create Measure, test cases and Login', () => {

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC1', 'QDMManifestTCGroup1', 'QDMManifestTC1', '', false, false)
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC2', 'QDMManifestTCGroup2', 'QDMManifestTC2', '', true, false)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        Utilities.waitForElementEnabled(EditMeasurePage.cqlEditorSaveButton, 3500)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('01/01/2000 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')
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
        Utilities.waitForElementVisible('[data-testid="option-1162745003"]', 35000)
        cy.get('[data-testid="option-1162745003"]').click()
        Utilities.waitForElementVisible('[data-testid="add-negation-rationale"]', 35000)
        cy.get('[data-testid="add-negation-rationale"]').click()
        //Close the Element
        cy.get('[data-testid="CloseIcon"]').scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible('[data-testid="CloseIcon"]', 35000)
        cy.get('[data-testid="CloseIcon"]').click()

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

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.clickEditforCreatedTestCase(true)
        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('02/29/1980 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')
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
        Utilities.waitForElementVisible('[data-testid="option-1162745003"]', 35000)
        cy.get('[data-testid="option-1162745003"]').click()
        Utilities.waitForElementVisible('[data-testid="add-negation-rationale"]', 35000)
        cy.get('[data-testid="add-negation-rationale"]').click()
        //Close the Element
        cy.get('[data-testid="CloseIcon"]').scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible('[data-testid="CloseIcon"]', 35000)
        cy.get('[data-testid="CloseIcon"]').click()

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

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        //navigate away from measure group page
        cy.get(Header.mainMadiePageButton).click()
        //wait until page / tabs loads
        Utilities.waitForElementVisible(LandingPage.myMeasuresTab, 20700)
        cy.get(LandingPage.myMeasuresTab).should('exist')
        cy.get(LandingPage.myMeasuresTab).should('be.visible')
    })

    afterEach('Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Shift all Test Case dates using the tab in left menu', () => {

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2003')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2028 1:00 PM - 06/02/2028 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2028 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the first test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1983')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2027 1:00 PM - 02/28/2027 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2027 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2000')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2025 1:00 PM - 06/02/2025 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2025 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the first test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1980')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2024 1:00 PM - 02/28/2024 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2024 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

    })

    it('Shift single Test Case date using action center option', () => {
        /*
            Note: this title is a little misleading. This test will shift dates
            on a single test case multiple times during the test, always
            using the action center option to initiate the changes.
        */

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // check 1st tc & initiate shift
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).type('3')

        //shiftSpecificTestCasesCancelBtn
        cy.get(TestCasesPage.shiftSpecificTestCasesCancelBtn).click()

        // initiate shift on 1st tc again
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()

        //confirm success message
        cy.get(TestCasesPage.tcSaveSuccessMsg, { timeout: 5500 }).should('contain.text', 'All Test Case dates successfully shifted.')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the first test case
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2003')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2028 1:00 PM - 06/02/2028 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2028 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        // check 2nd tc & initiate shift
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterShiftDates).click()
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()

        //confirm success message
        cy.get(TestCasesPage.tcSaveSuccessMsg, { timeout: 5500 }).should('contain.text', 'All Test Case dates successfully shifted.')
 
        //navigate to the edit page for the 2nd test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1983')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2027 1:00 PM - 02/28/2027 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2027 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // check 1st tc & initiate shift
        TestCasesPage.checkTestCase(1)
        cy.get(TestCasesPage.actionCenterShiftDates).click()

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()

        //confirm success message
        cy.get(TestCasesPage.tcSaveSuccessMsg, { timeout: 5500 }).should('contain.text', 'All Test Case dates successfully shifted.')
 
        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the edit page for the 1st test case
        TestCasesPage.clickEditforCreatedTestCase()
        //confirm that the test case DOB field is visible and enabled
        Utilities.waitForElementVisible(TestCasesPage.QDMDob, 3500)
        Utilities.waitForElementEnabled(TestCasesPage.QDMDob, 3500)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '01/01/2000')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  06/01/2025 1:00 PM - 06/02/2025 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  06/01/2025 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //navigate back to the main test case list page
        cy.get(EditMeasurePage.testCasesTab).click()

        // check 2nd tc & initiate shift
        TestCasesPage.checkTestCase(2)
        cy.get(TestCasesPage.actionCenterShiftDates).click()

        //enter a value to shift test case's dates by
        Utilities.waitForElementVisible(TestCasesPage.shiftSpecificTestCaseDates, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCaseDates).clear().type('-3')

        //save the shift test case
        Utilities.waitForElementEnabled(TestCasesPage.shiftSpecificTestCasesSaveBtn, 3500)
        cy.get(TestCasesPage.shiftSpecificTestCasesSaveBtn).click()

        //confirm success message
        cy.get(TestCasesPage.tcSaveSuccessMsg, { timeout: 5500 }).should('contain.text', 'All Test Case dates successfully shifted.')
 
        //navigate to the edit page for the first test case
        TestCasesPage.clickEditforCreatedTestCase(true)

        //confirm value that is in test case
        cy.get(TestCasesPage.QDMDob).should('contain.value', '02/28/1980')
        Utilities.waitForElementVisible(TestCasesPage.qdmTCElementTable, 3500)
        cy.get(TestCasesPage.qdmTCElementTable).should('contain.text', 'Datatype, Value Set & CodeTimingAttribute 1ActionsEncounter, PerformedNonelective Inpatient EncounterSNOMEDCT: 183452005 relP:  02/28/2024 1:00 PM - 02/28/2024 1:00 PMDiagnoses - DiagnosisComponent Code: SNOMEDCT : 111297002, Present On Admission Indicator: null, Rank: 1•••Medication, DischargeAntithrombotic Therapy for Ischemic StrokeRxNORM: 1536498 authdT:  02/28/2024 1:00 PM•••')

        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        Utilities.waitForElementEnabled(TestCasesPage.QDMTCSaveBtn, 3500)
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
    })
})