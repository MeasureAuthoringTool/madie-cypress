import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../Shared/QDMElements"

let measureName = 'MeasureWithNegationRationale' + Date.now()
let CqlLibraryName = 'MeasureWithNegationRationale' + Date.now()
let testCaseTitle = 'BCGNotGivenNormalizeIntervalRelevantDateTimeForCaStaging'
let testCaseDescription = 'DENEXCEPPass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measureCQL = 'library NewCMS646 version \'0.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "ICD10CM": \'urn:oid:2.16.840.1.113883.6.90\'\n' +
    'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\'\n' +
    'codesystem "ActCode": \'urn:oid:2.16.840.1.113883.5.4\'\n' +
    '\n' +
    'valueset "Active Tuberculosis for Urology Care": \'urn:oid:2.16.840.1.113762.1.4.1151.56\'\n' +
    'valueset "BCG Bacillus Calmette Guerin for Urology Care": \'urn:oid:2.16.840.1.113762.1.4.1151.52\'\n' +
    'valueset "Bladder Cancer for Urology Care": \'urn:oid:2.16.840.1.113762.1.4.1151.45\'\n' +
    'valueset "Chemotherapy Agents for Advanced Cancer": \'urn:oid:2.16.840.1.113762.1.4.1151.60\'\n' +
    'valueset "Cystectomy for Urology Care": \'urn:oid:2.16.840.1.113762.1.4.1151.55\'\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "HIV": \'urn:oid:2.16.840.1.113883.3.464.1003.120.12.1003\'\n' +
    'valueset "Immunocompromised Conditions": \'urn:oid:2.16.840.1.113883.3.666.5.1940\'\n' +
    'valueset "Immunosuppressive Drugs for Urology Care": \'urn:oid:2.16.840.1.113762.1.4.1151.32\'\n' +
    'valueset "Mixed histology urothelial cell carcinoma for Urology Care": \'urn:oid:2.16.840.1.113762.1.4.1151.39\'\n' +
    'valueset "Office Visit": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    'valueset "Unavailability of Bacillus Calmette Guerin for urology care": \'urn:oid:2.16.840.1.113762.1.4.1151.44\'\n' +
    '\n' +
    'code "Carcinoma in situ of bladder": \'D09.0\' from "ICD10CM" display \'Carcinoma in situ of bladder\'\n' +
    'code "Combined radiotherapy (procedure)": \'169331000\' from "SNOMEDCT" display \'Combined radiotherapy (procedure)\'\n' +
    'code "T1: Urinary tract tumor invades subepithelial connective tissue (finding)": \'369935001\' from "SNOMEDCT" display \'T1: Urinary tract tumor invades subepithelial connective tissue (finding)\'\n' +
    'code "Ta: Noninvasive papillary carcinoma (urinary tract) (finding)": \'369949005\' from "SNOMEDCT" display \'Ta: Noninvasive papillary carcinoma (urinary tract) (finding)\'\n' +
    'code "Tis: Carcinoma in situ (flat tumor of urinary bladder) (finding)": \'369934002\' from "SNOMEDCT" display \'Tis: Carcinoma in situ (flat tumor of urinary bladder) (finding)\'\n' +
    'code "Tumor staging (tumor staging)": \'254292007\' from "SNOMEDCT" display \'Tumor staging (tumor staging)\'\n' +
    'code "virtual": \'VR\' from "ActCode" display \'virtual\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Denominator Exception":\n' +
    '  exists "BCG Not Available Within 6 Months After Bladder Cancer Staging"\n' +
    '\n' +
    'define "Numerator":\n' +
    '  "First BCG Administered" is not null\n' +
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
    'define "July 1 of Year Prior to the Measurement Period":\n' +
    '  DateTime((year from start of "Measurement Period" - 1), 7, 1, 0, 0, 0, 0, 0)\n' +
    '\n' +
    'define "June 30 of the Measurement Period":\n' +
    '  DateTime((year from start of "Measurement Period"), 6, 30, 23, 59, 59, 0, 0)\n' +
    '\n' +
    '/*Ta High Grade only to be included.  Ta low grade is to be excluded from this measure.*/\n' +
    '\n' +
    'define "Has Most Recent Bladder Cancer Tumor Staging is Ta HG, Tis, T1":\n' +
    '  ( "First Qualifying Bladder Cancer Staging Procedure" FirstBladderCancerStagingMP\n' +
    '      where FirstBladderCancerStagingMP.result ~ "T1: Urinary tract tumor invades subepithelial connective tissue (finding)"\n' +
    '        or FirstBladderCancerStagingMP.result ~ "Ta: Noninvasive papillary carcinoma (urinary tract) (finding)"\n' +
    '        or FirstBladderCancerStagingMP.result ~ "Tis: Carcinoma in situ (flat tumor of urinary bladder) (finding)"\n' +
    '        or FirstBladderCancerStagingMP.result ~ "Carcinoma in situ of bladder"\n' +
    '  ) is not null\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "First Qualifying Bladder Cancer Staging Procedure" is not null\n' +
    '    and "Has Most Recent Bladder Cancer Tumor Staging is Ta HG, Tis, T1"\n' +
    '    and "Has Qualifying Encounter"\n' +
    '\n' +
    'define "Denominator Exclusion":\n' +
    '  exists "Acute Tuberculosis Diagnosis"\n' +
    '    or exists "Immunosuppressive Drugs"\n' +
    '    or exists "Cystectomy Done"\n' +
    '    or "Has Excluding  HIV, Immunocompromised Conditions or Mixed Histology Before Staging"\n' +
    '    or "Has Excluding Chemotherapy or Radiotherapy Procedure Before Staging"\n' +
    '\n' +
    'define "Acute Tuberculosis Diagnosis":\n' +
    '  ["Diagnosis": "Active Tuberculosis for Urology Care"] ActiveTuberculosis\n' +
    '    with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '      such that ActiveTuberculosis.prevalencePeriod overlaps after Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod )\n' +
    '\n' +
    'define "Cystectomy Done":\n' +
    '  ["Procedure, Performed": "Cystectomy for Urology Care"] Cystectomy\n' +
    '    with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '      such that Global.EarliestOf ( Cystectomy.relevantDatetime, Cystectomy.relevantPeriod ) 6 months or less before start of Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod )\n' +
    '\n' +
    'define "Has Excluding  HIV, Immunocompromised Conditions or Mixed Histology Before Staging":\n' +
    '  exists ( ( ["Diagnosis": "HIV"]\n' +
    '      union ["Diagnosis": "Immunocompromised Conditions"]\n' +
    '      union ["Diagnosis": "Mixed histology urothelial cell carcinoma for Urology Care"] ) ExclusionDiagnosis\n' +
    '      with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '        such that ExclusionDiagnosis.prevalencePeriod starts on or before start of Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod )\n' +
    '  )\n' +
    '\n' +
    'define "Has Excluding Chemotherapy or Radiotherapy Procedure Before Staging":\n' +
    '  exists ( ( ["Medication, Active": "Chemotherapy Agents for Advanced Cancer"]\n' +
    '      union ["Procedure, Performed": "Combined radiotherapy (procedure)"] ) ExclusionMedsProcedures\n' +
    '      with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '        such that ExclusionMedsProcedures.relevantPeriod starts 6 months or less before Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod )\n' +
    '  )\n' +
    '\n' +
    'define "First Bladder Cancer Staging Procedure":\n' +
    '  First(["Procedure, Performed": "Tumor staging (tumor staging)"] BladderCancerStaging\n' +
    '      with "Bladder Cancer Diagnosis" BladderCancer\n' +
    '        such that Global."NormalizeInterval"(BladderCancerStaging.relevantDatetime, BladderCancerStaging.relevantPeriod)starts on or before day of start BladderCancer.prevalencePeriod\n' +
    '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
    '  )\n' +
    '\n' +
    'define "Immunosuppressive Drugs":\n' +
    '  ["Medication, Active": "Immunosuppressive Drugs for Urology Care"] ImmunosuppressiveDrugs\n' +
    '    with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '      such that Global."NormalizeInterval" ( ImmunosuppressiveDrugs.relevantDatetime, ImmunosuppressiveDrugs.relevantPeriod ) starts on or before start of Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod )\n' +
    '\n' +
    'define "Has Qualifying Encounter":\n' +
    '  exists ["Encounter, Performed": "Office Visit"] ValidEncounter\n' +
    '    where ValidEncounter.relevantPeriod during day of "Measurement Period"\n' +
    '      and ValidEncounter.class !~ "virtual"\n' +
    '\n' +
    'define "First BCG Administered":\n' +
    '  First(["Medication, Administered": "BCG Bacillus Calmette Guerin for Urology Care"] BCG\n' +
    '      with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '        such that Global."NormalizeInterval"(BCG.relevantDatetime, BCG.relevantPeriod)starts 6 months or less after start of Global."NormalizeInterval"(FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod)\n' +
    '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
    '  )\n' +
    '\n' +
    'define "First Qualifying Bladder Cancer Staging Procedure":\n' +
    '  "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '    where Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod ) during day of Interval["July 1 of Year Prior to the Measurement Period", "June 30 of the Measurement Period"]\n' +
    '\n' +
    'define "Bladder Cancer Diagnosis":\n' +
    '  ["Diagnosis": "Bladder Cancer for Urology Care"] BladderCancer\n' +
    '    where BladderCancer.prevalencePeriod starts before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "BCG Not Available Within 6 Months After Bladder Cancer Staging":\n' +
    '  ( ["Medication, Not Administered": "BCG Bacillus Calmette Guerin for Urology Care"] BCGnotGiven\n' +
    '      with "First Bladder Cancer Staging Procedure" FirstBladderCancerStaging\n' +
    '        such that BCGnotGiven.authorDatetime 6 months or less after start of Global."NormalizeInterval" ( FirstBladderCancerStaging.relevantDatetime, FirstBladderCancerStaging.relevantPeriod )\n' +
    '      where BCGnotGiven.negationRationale in "Unavailability of Bacillus Calmette Guerin for urology care"\n' +
    '  )'

describe('Measure with Negation Rationale', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2012-01-01', '2012-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('End to End Measure with Negation Rationale', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

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

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'BCG Not Available Within 6 Months After Bladder Cancer Staging')

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

        //Save Supplemental data
        cy.get('[data-testid="measure-Supplemental Data-save"]').click({ force: true })
        cy.get(MeasureGroupPage.supplementalDataElementsSaveSuccessMsg).should('contain.text', 'Measure Supplemental Data have been Saved Successfully')

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('04/10/1942', 'Living', 'White', 'Female', 'Not Hispanic or Latino')

        //Element - Condition, Diagnosis: Bladder Cancer for Urology Care
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Bladder Cancer for Urology Care')
        //add Timing Relevant Period DateTime
        cy.get('[id="dateTime"]').eq(0).type('09/30/2011 08:00 AM')
        //add Code
        QDMElements.addCode('ICD10CM', 'C67.3')

        //Element - Medication, Administered: BCG Bacillus Calmette Guerin for Urology Care
        //add Element
        QDMElements.addElement('medication', 'Administered: BCG Bacillus Calmette Guerin for Urology Care')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/01/2012 08:00 AM', '03/01/2012 10:15 AM')
        //add Code
        QDMElements.addCode('RXNORM', '1653579')

        //Element - Procedure, Performed: Tumor staging (tumor staging)
        //add Element
        QDMElements.addElement('procedure', 'Performed: Tumor staging (tumor staging)')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('09/30/2011 08:00 AM', '09/30/2011 08:15 AM')
        //add Code
        QDMElements.addCode('SNOMEDCT', '254292007')
        // Enter attribute and its type
        cy.get(TestCasesPage.attributesTab).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Code"]').click()
        cy.get('[id="value-set-selector"]').click()
        cy.get('[data-testid="custom-vs"]').click()
        cy.get('[data-testid="custom-code-system-input"]').type('SNOMEDCT')
        cy.get('[data-testid="custom-code-input"]').type('369935001')
        cy.get(TestCasesPage.addAttribute).click()

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
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

    })
})
