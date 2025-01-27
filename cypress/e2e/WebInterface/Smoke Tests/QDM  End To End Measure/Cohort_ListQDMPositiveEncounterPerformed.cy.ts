import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../Shared/QDMElements"
import { CQLLibraryPage } from "../../../../Shared/CQLLibraryPage";
import { QdmCql } from "../../../../Shared/QDMMeasuresCQL"

let measureName = 'CohortListQDMPositiveEncounterPerformed' + Date.now()
let CqlLibraryName = 'CohortListQDMPositiveEncounterPerformed' + Date.now()
let firstTestCaseTitle = 'Combo2 ThreeEncounter'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'SBPFail GT24beforeAndGT2after'
let measureCQL = QdmCql.QDMTestCaseCQLFullElementSection

describe('Measure Creation: Cohort ListQDMPositiveEncounterPerformed', () => {

    before('Create Measure', () => {

        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-01', '2012-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, null, true)
        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Cohort ListQDMPositiveEncounterPerformed', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter("edit")

        //save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully but the following issues were found')
        cy.get(CQLLibraryPage.libraryWarning).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

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
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCohort)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Cohort')

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

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Supplemental Data Elements
        cy.get(MeasureGroupPage.leftPanelSupplementalDataTab).click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionSelect).click()

        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Ethnicity').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Payer').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Race').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Sex').click()
        cy.get(MeasureGroupPage.supplementalDataDefinitionDropdown).contains('SDE Results').click()

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('06/15/1935 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')


        //Element - Encounter:Performed: Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('06/21/2012 12:02 PM', '07/18/2012 12:15 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')
        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('27', 'd')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Laboratory Test:Performed: Sodium lab test
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Sodium lab test')
        cy.get(TestCasesPage.relevantPeriodEndDate).type('06/20/2012 12:01 PM')
        //add Code
        QDMElements.addCode('LOINC', '2947-0')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('34', 'mmol/L')
        //add attribute to test case action
        QDMElements.addAttribute()
        //Close the Element
        QDMElements.closeElement()

        //Element - Laboratory Test:Performed: Sodium lab test
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Sodium lab test')
        cy.get(TestCasesPage.relevantPeriodEndDate).type('06/21/2012 12:03 PM')
        //add Code
        QDMElements.addCode('LOINC', '2947-0')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('120', 'mmol/L')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Encounter:Performed: Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('06/20/2012 12:00 PM', '06/20/2012 12:15 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')
        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1', 'd')
        //add attribute to test case action
        QDMElements.addAttribute()
        //Close the Element
        QDMElements.closeElement()

        //Element - Encounter:Performed: Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('06/19/2012 12:00 PM', '06/19/2012 12:15 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '8715000')
        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1', 'd')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Laboratory Test:Performed: Sodium lab test
        //add Element
        QDMElements.addElement('laboratory', 'Performed: Sodium lab test')
        cy.get(TestCasesPage.relevantPeriodEndDate).type('06/19/2012 12:01 PM')
        //add Code
        QDMElements.addCode('LOINC', '2947-0')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('50', 'mmol/L')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Patient Characteristic:Patient Characteristic Payer: Medicare FFS payer
        //add Element
        QDMElements.addElement('patientcharacteristic', 'Payer: Medicare FFS payer')
        //add Code
        QDMElements.addCode('SOP', '1')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('3')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Add Elements to the second Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('06/15/1935 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Element - Physical Exam:Performed: Systolic blood pressure
        //add Element
        QDMElements.addElement('physicalexam', 'Performed: Systolic Blood Pressure')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('06/20/2012 12:01 PM', '06/20/2012 03:01 PM')
        //add Code
        QDMElements.addCode('LOINC', '8480-6')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('120', 'mm[Hg]')
        //add attribute to test case action
        QDMElements.addAttribute()
        //Close the Element
        QDMElements.closeElement()

        //Element - Physical Exam:Performed: Systolic blood pressure
        //add Element
        QDMElements.addElement('physicalexam', 'Performed: Systolic Blood Pressure')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('06/20/2012 2:01 PM', '06/20/2012 03:01 PM')
        //add Code
        QDMElements.addCode('LOINC', '8480-6')
        // Enter attribute and its type
        QDMElements.enterAttribute('Result', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('115', 'mm[Hg]')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element - Encounter:Performed: Encounter Inpatient
        //add Element
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('06/21/2012 12:00 PM', '06/22/2012 12:15 PM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '183452005')
        // Enter attribute and its type
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        //enter quantity type
        QDMElements.enterQuantity('1', 'd')
        //add attribute to test case action
        QDMElements.addAttribute()

        //Element -  Patient Characteristic:Patient Characteristic Payer: Medicare payer
        //add Element
        QDMElements.addElement('patientcharacteristic', 'Payer: Payer')
        //add Code
        QDMElements.addCode('SOP', '1')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Execute Test case on Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Pass')
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')

    })
})
