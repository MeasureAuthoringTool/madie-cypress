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
import { Header } from "../../../../../Shared/Header";

let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'

let testCaseTitle2nd = 'Second TC - Title for Auto Test'
let testCaseDescription2nd = 'SecondTC-DENOMFail' + Date.now()
let testCaseSeries2nd = 'SecondTC-SBTestSeries'
/* let measurePath = 'cypress/fixtures/measureId'
let mCQLForElementsValidation = MeasureCQL.QDMTestCaseCQLFullElementSection */
let CQLSimple_for_QDM = MeasureCQL.QDMSimpleCQL
let qdmManifestTestCQL = MeasureCQL.qdmCQLManifestTest
const now = require('dayjs')
let todaysDate = now().format('MM/DD/YYYY')

let measureName = 'ProportionPatient' + Date.now()
let measureQDMManifestName = 'QDMManifestTest' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()
/* let measureCQL = 'library BreastCancerScreening version \'12.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    'include AdultOutpatientEncountersQDM version \'1.0.000\' called AdultOutpatientEncounters\n' +
    'include HospiceQDM version \'1.0.000\' called Hospice\n' +
    'include PalliativeCareQDM version \'4.0.000\' called PalliativeCare\n' +
    'include AdvancedIllnessandFrailtyQDM version \'9.0.000\' called AIFrailLTCF\n' +
    '\n' +
    'codesystem "AdministrativeGender": \'urn:oid:2.16.840.1.113883.5.1\' \n' +
    'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\' \n' +
    '\n' +
    'valueset "Bilateral Mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1005\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "History of bilateral mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1068\' \n' +
    'valueset "Mammography": \'urn:oid:2.16.840.1.113883.3.464.1003.108.12.1018\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Outpatient": \'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1087\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    'valueset "Status Post Left Mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1069\' \n' +
    'valueset "Status Post Right Mastectomy": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1070\' \n' +
    'valueset "Unilateral Mastectomy Left": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1133\' \n' +
    'valueset "Unilateral Mastectomy Right": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1134\' \n' +
    'valueset "Unilateral Mastectomy, Unspecified Laterality": \'urn:oid:2.16.840.1.113883.3.464.1003.198.12.1071\' \n' +
    '\n' +
    'code "Female": \'F\' from "AdministrativeGender" display \'Female\'\n' +
    'code "Left (qualifier value)": \'7771000\' from "SNOMEDCT" display \'Left (qualifier value)\'\n' +
    'code "Right (qualifier value)": \'24028007\' from "SNOMEDCT" display \'Right (qualifier value)\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
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
    'define "Bilateral Mastectomy Diagnosis":\n' +
    '  ["Diagnosis": "History of bilateral mastectomy"] BilateralMastectomyHistory\n' +
    '    where BilateralMastectomyHistory.prevalencePeriod starts on or before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "Bilateral Mastectomy Procedure":\n' +
    '  ["Procedure, Performed": "Bilateral Mastectomy"] BilateralMastectomyPerformed\n' +
    '    where Global."NormalizeInterval" ( BilateralMastectomyPerformed.relevantDatetime, BilateralMastectomyPerformed.relevantPeriod ) ends on or before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Denominator Exclusions":\n' +
    '  Hospice."Has Hospice Services"\n' +
    '    or ( ( exists ( "Right Mastectomy Diagnosis" )\n' +
    '          or exists ( "Right Mastectomy Procedure" )\n' +
    '      )\n' +
    '        and ( exists ( "Left Mastectomy Diagnosis" )\n' +
    '            or exists ( "Left Mastectomy Procedure" )\n' +
    '        )\n' +
    '    )\n' +
    '    or exists "Bilateral Mastectomy Diagnosis"\n' +
    '    or exists "Bilateral Mastectomy Procedure"\n' +
    '    or AIFrailLTCF."Is Age 66 or Older with Advanced Illness and Frailty"\n' +
    '    or AIFrailLTCF."Is Age 66 or Older Living Long Term in a Nursing Home"\n' +
    '    or PalliativeCare."Has Palliative Care in the Measurement Period"\n' +
    '\n' +
    'define "Left Mastectomy Diagnosis":\n' +
    '  ( ["Diagnosis": "Status Post Left Mastectomy"]\n' +
    '    union ( ["Diagnosis": "Unilateral Mastectomy, Unspecified Laterality"] UnilateralMastectomyDiagnosis\n' +
    '        where UnilateralMastectomyDiagnosis.anatomicalLocationSite ~ "Left (qualifier value)"\n' +
    '    ) ) LeftMastectomy\n' +
    '    where LeftMastectomy.prevalencePeriod starts on or before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "Left Mastectomy Procedure":\n' +
    '  ["Procedure, Performed": "Unilateral Mastectomy Left"] UnilateralMastectomyLeftPerformed\n' +
    '    where Global."NormalizeInterval" ( UnilateralMastectomyLeftPerformed.relevantDatetime, UnilateralMastectomyLeftPerformed.relevantPeriod ) ends on or before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "Right Mastectomy Diagnosis":\n' +
    '  ( ["Diagnosis": "Status Post Right Mastectomy"] RightMastectomyProcedure\n' +
    '    union ( ["Diagnosis": "Unilateral Mastectomy, Unspecified Laterality"] UnilateralMastectomyDiagnosis\n' +
    '        where UnilateralMastectomyDiagnosis.anatomicalLocationSite ~ "Right (qualifier value)"\n' +
    '    ) ) RightMastectomy\n' +
    '    where RightMastectomy.prevalencePeriod starts on or before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "Right Mastectomy Procedure":\n' +
    '  ["Procedure, Performed": "Unilateral Mastectomy Right"] UnilateralMastectomyRightPerformed\n' +
    '    where Global."NormalizeInterval" ( UnilateralMastectomyRightPerformed.relevantDatetime, UnilateralMastectomyRightPerformed.relevantPeriod ) ends on or before \n' +
    '    end of "Measurement Period"\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  exists ( ["Patient Characteristic Sex": "Female"] )\n' +
    '    and AgeInYearsAt(date from \n' +
    '      end of "Measurement Period"\n' +
    '    )in Interval[52, 74]\n' +
    '    and exists AdultOutpatientEncounters."Qualifying Encounters"\n' +
    '\n' +
    'define "Numerator":\n' +
    '  exists ( ["Diagnostic Study, Performed": "Mammography"] Mammogram\n' +
    '      where ( Global."NormalizeInterval" ( Mammogram.relevantDatetime, Mammogram.relevantPeriod ) ends during day of Interval["October 1 Two Years Prior to the Measurement Period", \n' +
    '        end of "Measurement Period"]\n' +
    '      )\n' +
    '  )\n' +
    '\n' +
    'define "October 1 Two Years Prior to the Measurement Period":\n' +
    '  DateTime((year from start of "Measurement Period" - 2), 10, 1, 0, 0, 0, 0, 0)' */



describe.skip('Run QDM Test Case ', () => {
    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, CQLSimple_for_QDM, false, false,
            '2023-01-01', '2024-01-01')

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Run a simple QDM test case and verify message that indicates that test case was ran', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('085/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

    })
})


describe.skip('QDM Test Case Search, Filter, and sorting by Test Case number', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureQDMManifestName, CqlLibraryName, 'Proportion', false, qdmManifestTestCQL, null, false,
            '2025-01-01', '2025-12-31')
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', 'Denominator Exceptions', 'Numerator', '', 'Denominator')
        TestCasesPage.CreateQDMTestCaseAPI('QDMManifestTC', 'QDMManifestTCGroup', 'QDMManifestTC', '', false, false)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()
        //selecting initial manifest value that will allow test case to pass
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //check / select radio button for manifest
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[id="manifest-select-label"]', 'Manifest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
                cy.get(TestCasesPage.qdmManifestMaySecondOption).click()
                cy.get(TestCasesPage.qdmManifestSaveBtn).click()
                cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')

            })
        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-2024-05-02')
        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit')
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
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(4000)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit')
        TestCasesPage.grabElementId()
        TestCasesPage.qdmTestCaseElementAction('edit')
        //add negation
        Utilities.waitForElementVisible(TestCasesPage.negationTab, 35000)
        cy.get(TestCasesPage.negationTab).click()
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
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(4000)
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 50000)
        TestCasesPage.testCaseAction('edit')
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
        //Close the Element
        cy.get('[data-testid="CloseIcon"]').scrollIntoView()
        cy.scrollTo(100, 0)
        Utilities.waitForElementVisible('[data-testid="CloseIcon"]', 35000)
        cy.get('[data-testid="CloseIcon"]').click()
        //save changes
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.visible')
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
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
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        //logout of MADiE
        OktaLogin.UILogout()
        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        //Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('QDM Test Case search and filter functionality', () => {

        //
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('085/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        //

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.pause()

        //start of work on MAT-7601


        //search for something that is in the description field
        //search for soemthing that is in the status field
        //search for something that is in the group field
        //search for something that is in the title field

        //the filter by field

        //search result should have no results

        //clear search by clicking on "x"

        //clear the Filter By by selecting the "-" option

        //running test cases on the test case list page runs all test wheither they are in the search results or not



        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        //validating that manifest is, now, selected and make a change in the selection
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //confirm that initial value is set to 'Manifest'
                cy.wrap(radio).eq(1).should('be.checked');
                cy.contains('[id="manifest-select-label"]', 'Manifest');

                //check / select radio button for the value of 'Latest'
                cy.wrap(radio).eq(0).check({ force: true }).should('be.checked');
                cy.contains('[data-testid="manifest-expansion-radio-buttons-group"] > :nth-child(1) > .MuiTypography-root', 'Latest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('not.exist')

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            })
        cy.get(TestCasesPage.qdmManifestSaveBtn).click()
        cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')
        cy.reload()
        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'FailQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

    })
    it('QDM Test Case number and sorting behavior', () => {

        //
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle2nd, testCaseDescription2nd, testCaseSeries2nd)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('085/27/1981 12:00 AM', 'Living', 'White', 'Male', 'Not Hispanic or Latino')

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')
        //

        //navigate back to main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //start of work on MAT-7604

        //test case numbers appear


        //first click sorts ascending order
        //second click sorts in descending order
        //thrid click removes sorting

        //sort by case number and then edit some test case that is not at the top



        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'PassQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        //validating that manifest is, now, selected and make a change in the selection
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //confirm that initial value is set to 'Manifest'
                cy.wrap(radio).eq(1).should('be.checked');
                cy.contains('[id="manifest-select-label"]', 'Manifest');

                //check / select radio button for the value of 'Latest'
                cy.wrap(radio).eq(0).check({ force: true }).should('be.checked');
                cy.contains('[data-testid="manifest-expansion-radio-buttons-group"] > :nth-child(1) > .MuiTypography-root', 'Latest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('not.exist')

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            })
        cy.get(TestCasesPage.qdmManifestSaveBtn).click()
        cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')
        cy.reload()
        //Navigate to Test Cases page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //clicking on running the test case
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify the results row
        cy.get(TestCasesPage.testCaseResultrow).should('contain.text', 'FailQDMManifestTCGroupQDMManifestTCQDMManifestTC' + todaysDate + 'Select')

    })

})