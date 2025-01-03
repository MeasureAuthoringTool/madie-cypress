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
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const path = require('path')
const downloadsFolder = Cypress.config('downloadsFolder')

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMCQLLibrary' + Date.now()
let firstTestCaseTitle = 'Combo2 ThreeEncounter'
let testCaseDescription = 'DENOMFail'
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'SBPFail GT24beforeAndGT2after'
let measureCQL = 'library HybridHospitalWideReadmission version \'4.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "LOINC": \'urn:oid:2.16.840.1.113883.6.1\' \n' +
    '\n' +
    'valueset "Acute care hospital Inpatient Encounter": \'urn:oid:2.16.840.1.113883.3.666.5.2289\' \n' +
    'valueset "Bicarbonate lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.139\' \n' +
    'valueset "Body temperature": \'urn:oid:2.16.840.1.113762.1.4.1045.152\' \n' +
    'valueset "Body weight": \'urn:oid:2.16.840.1.113762.1.4.1045.159\' \n' +
    'valueset "Creatinine lab test": \'urn:oid:2.16.840.1.113883.3.666.5.2363\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Glucose lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.134\' \n' +
    'valueset "Heart Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.149\' \n' +
    'valueset "Hematocrit lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.114\' \n' +
    'valueset "Medicare Advantage payer": \'urn:oid:2.16.840.1.113762.1.4.1104.12\' \n' +
    'valueset "Medicare FFS payer": \'urn:oid:2.16.840.1.113762.1.4.1104.10\' \n' +
    'valueset "Observation Services": \'urn:oid:2.16.840.1.113762.1.4.1111.143\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Oxygen Saturation by Pulse Oximetry": \'urn:oid:2.16.840.1.113762.1.4.1045.151\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Potassium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.117\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    'valueset "Respiratory Rate": \'urn:oid:2.16.840.1.113762.1.4.1045.130\' \n' +
    'valueset "Sodium lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.119\' \n' +
    'valueset "Systolic Blood Pressure": \'urn:oid:2.16.840.1.113762.1.4.1045.163\' \n' +
    'valueset "White blood cells count lab test": \'urn:oid:2.16.840.1.113762.1.4.1045.129\' \n' +
    '\n' +
    'code "Birth date": \'21112-8\' from "LOINC" display \'Birth date\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Inpatient Encounters"\n' +
    '\n' +
    'define "Numerator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    '\n' +
    'define "SDE Results":\n' +
    '  {\n' +
    '  // First physical exams\n' +
    '    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n' +
    '    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n' +
    '    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n' +
    '    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n' +
    '    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n' +
    '  // Weight uses lab test timing\n' +
    '    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n' +
    '  \n' +
    '  // First lab tests\n' +
    '    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n' +
    '    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n' +
    '    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n' +
    '    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n' +
    '    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n' +
    '    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n' +
    '    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n' +
    '  }\n' +
    '\n' +
    'define "Inpatient Encounters":\n' +
    '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
    '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
    '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
    '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
    '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
    '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65\n' +
    '\n' +
    'define function "LengthOfStay"(Stay Interval<DateTime> ):\n' +
    '  difference in days between start of Stay and \n' +
    '  end of Stay\n' +
    '\n' +
    'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
    '  "Inpatient Encounters" Encounter\n' +
    '    let FirstExam: First(ExamList Exam\n' +
    '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n' +
    '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
    '    )\n' +
    '    return {\n' +
    '      EncounterId: Encounter.id,\n' +
    '      FirstResult: FirstExam.result as Quantity,\n' +
    '      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n' +
    '    }\n' +
    '\n' +
    'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n' +
    '  "Inpatient Encounters" Encounter\n' +
    '    let FirstExamWithLabTiming: First(ExamList Exam\n' +
    '        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
    '        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n' +
    '    )\n' +
    '    return {\n' +
    '      EncounterId: Encounter.id,\n' +
    '      FirstResult: FirstExamWithLabTiming.result as Quantity,\n' +
    '      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n' +
    '    }\n' +
    '\n' +
    'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n' +
    '  "Inpatient Encounters" Encounter\n' +
    '    let FirstLab: First(LabList Lab\n' +
    '        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n' +
    '        sort by resultDatetime\n' +
    '    )\n' +
    '    return {\n' +
    '      EncounterId: Encounter.id,\n' +
    '      FirstResult: FirstLab.result as Quantity,\n' +
    '      Timing: FirstLab.resultDatetime\n' +
    '    }'

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

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //adding second group
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Inpatient Encounters')

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

        //Export Test cases and assert the values
        cy.get(TestCasesPage.testcaseQRDAExportBtn).click()
        cy.get('[class="btn-container"]').contains('Excel').click()
        cy.get(TestCasesPage.successMsg).should('contain.text', 'Excel exported successfully')


        const file = path.join(downloadsFolder, 'eCQMTitle-v0.0.000-QDM-TestCases.xlsx')
        cy.readFile(file, { timeout: 15000 }).should('exist')
        cy.log('Successfully verified Excel file export')

        cy.task('readXlsx', {file: file, sheet: '1 - Population Criteria Section'}).then(rows => {
            expect(rows[0]['__EMPTY_3']).to.equal('birthdate')
            expect(rows[0]['__EMPTY_8']).to.equal('sex')
            expect(rows[1]['__EMPTY_1']).to.equal('SBTestSeries')
            expect(rows[2]['Actual']).to.equal(3)
        });
    })
})
