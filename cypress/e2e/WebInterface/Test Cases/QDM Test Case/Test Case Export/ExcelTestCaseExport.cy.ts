import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { QDMElements } from "../../../../../Shared/QDMElements"
import { CQLLibraryPage } from "../../../../../Shared/CQLLibraryPage"
import { QdmCql } from "../../../../../Shared/QDMMeasuresCQL"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMCQLLibrary' + Date.now()
let firstTestCaseTitle = 'Combo2 ThreeEncounter'
let testCaseDescription = 'DENOMFail'
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'SBPFail GT24beforeAndGT2after'
const measureCQL = QdmCql.QDMTestCaseCQLFullElementSection

describe('QDM Test Case Excel Export', () => {

    deleteDownloadsFolderBeforeAll()

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

    it('Successful Excel Export for QDM Test Cases', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

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

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //adding second group
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Inpatient Encounters')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Population details for ' +
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
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // include sde in coverage
        //navigate to the SDE side tab section on the test cases tab
        Utilities.waitForElementVisible(TestCasesPage.qdmSDESidNavLink, 30000)
        cy.get(TestCasesPage.qdmSDESidNavLink).click()

        cy.get(MeasureGroupPage.qdmPatientBasis).eq(0).click()
        cy.get(TestCasesPage.saveSDEOption).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Configuration Updated Successfully')

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('06/15/1935 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Element - Encounter:Performed: Encounter Inpatient
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        QDMElements.addTimingRelevantPeriodDateTime('06/21/2012 12:02 PM', '07/18/2012 12:15 PM')
        QDMElements.addCode('SNOMEDCT', '183452005')
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        QDMElements.enterQuantity('27', 'd')
        QDMElements.addAttribute()

        //Element - Laboratory Test:Performed: Sodium lab test
        QDMElements.addElement('laboratory', 'Performed: Sodium lab test')
        cy.get(TestCasesPage.relevantPeriodEndDate).type('06/20/2012 12:01 PM')
        QDMElements.addCode('LOINC', '2947-0')
        QDMElements.enterAttribute('Result', 'Quantity')
        QDMElements.enterQuantity('34', 'mmol/L')
        QDMElements.addAttribute()
        QDMElements.closeElement()

        //Element - Laboratory Test:Performed: Sodium lab test
        QDMElements.addElement('laboratory', 'Performed: Sodium lab test')
        cy.get(TestCasesPage.relevantPeriodEndDate).type('06/21/2012 12:03 PM')
        QDMElements.addCode('LOINC', '2947-0')
        QDMElements.enterAttribute('Result', 'Quantity')
        QDMElements.enterQuantity('120', 'mmol/L')
        QDMElements.addAttribute()

        //Element - Encounter:Performed: Encounter Inpatient
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        QDMElements.addTimingRelevantPeriodDateTime('06/20/2012 12:00 PM', '06/20/2012 12:15 PM')
        QDMElements.addCode('SNOMEDCT', '183452005')
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        QDMElements.enterQuantity('1', 'd')
        QDMElements.addAttribute()
        QDMElements.closeElement()

        //Element - Encounter:Performed: Encounter Inpatient
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        QDMElements.addTimingRelevantPeriodDateTime('06/19/2012 12:00 PM', '06/19/2012 12:15 PM')
        QDMElements.addCode('SNOMEDCT', '8715000')
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        QDMElements.enterQuantity('1', 'd')
        QDMElements.addAttribute()

        //Element - Laboratory Test:Performed: Sodium lab test
        QDMElements.addElement('laboratory', 'Performed: Sodium lab test')
        cy.get(TestCasesPage.relevantPeriodEndDate).type('06/19/2012 12:01 PM')
        QDMElements.addCode('LOINC', '2947-0')
        QDMElements.enterAttribute('Result', 'Quantity')
        QDMElements.enterQuantity('50', 'mmol/L')
        QDMElements.addAttribute()

        //Element - Patient Characteristic:Patient Characteristic Payer: Medicare FFS payer
        QDMElements.addElement('patientcharacteristic', 'Payer: Medicare FFS payer')
        QDMElements.addCode('SOP', '1')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).type('3')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Add Elements to the second Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('06/15/1935 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

        //Element - Physical Exam:Performed: Systolic blood pressure
        QDMElements.addElement('physicalexam', 'Performed: Systolic Blood Pressure')
        QDMElements.addTimingRelevantPeriodDateTime('06/20/2012 12:01 PM', '06/20/2012 03:01 PM')
        QDMElements.addCode('LOINC', '8480-6')
        QDMElements.enterAttribute('Result', 'Quantity')
        QDMElements.enterQuantity('120', 'mm[Hg]')
        QDMElements.addAttribute()
        QDMElements.closeElement()

        //Element - Physical Exam:Performed: Systolic blood pressure
        QDMElements.addElement('physicalexam', 'Performed: Systolic Blood Pressure')
        QDMElements.addTimingRelevantPeriodDateTime('06/20/2012 2:01 PM', '06/20/2012 03:01 PM')
        QDMElements.addCode('LOINC', '8480-6')
        QDMElements.enterAttribute('Result', 'Quantity')
        QDMElements.enterQuantity('115', 'mm[Hg]')
        QDMElements.addAttribute()

        //Element - Encounter:Performed: Encounter Inpatient
        QDMElements.addElement('encounter', 'Performed: Encounter Inpatient')
        QDMElements.addTimingRelevantPeriodDateTime('06/21/2012 12:00 PM', '06/22/2012 12:15 PM')
        QDMElements.addCode('SNOMEDCT', '183452005')
        QDMElements.enterAttribute('Length Of Stay', 'Quantity')
        QDMElements.enterQuantity('1', 'd')
        QDMElements.addAttribute()

        //Element -  Patient Characteristic:Patient Characteristic Payer: Medicare payer
        QDMElements.addElement('patientcharacteristic', 'Payer: Payer')
        QDMElements.addCode('SOP', '1')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Test Case Updated Successfully')

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

        //Export Test cases and assert the values
        cy.get(TestCasesPage.actionCenterExport).click()
        cy.get(TestCasesPage.btnContainer).contains('Excel').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Excel exported successfully')

        const file = 'cypress/downloads/eCQMTitle-v0.0.000-QDM-TestCases.xlsx'
        cy.readFile(file, { timeout: 15000 }).should('exist')
        cy.log('Successfully verified Excel file export')

        cy.task('readXlsx', { file: file, sheet: '1 - Population Criteria Section' }).then(rows => {
            expect(rows[0]['__EMPTY_3']).to.equal('birthdate')
            expect(rows[0]['__EMPTY_8']).to.equal('sex')
            expect(rows[1]['__EMPTY_1']).to.equal('SBTestSeries')
            expect(rows[2]['Actual']).to.equal(3)

            // dynamic SDE - https://jira.cms.gov/browse/MAT-8336
            expect(rows[1]['__EMPTY_11']).to.equal('[Patient Characteristic Ethnicity: Ethnicity\nCODE: CDCREC 2186-5]')
            expect(rows[1]['__EMPTY_13']).to.equal('[Patient Characteristic Race: Race\nCODE: CDCREC 2106-3]')
            expect(rows[1]['__EMPTY_15']).to.equal('[Patient Characteristic Sex: ONCAdministrativeSex\nCODE: AdministrativeGender M]')
        });
    })
})
