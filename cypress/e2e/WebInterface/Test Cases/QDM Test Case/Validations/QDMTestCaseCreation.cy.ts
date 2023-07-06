import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measurePath = 'cypress/fixtures/measureId'
let mCQLForElementsValidation = MeasureCQL.QDMTestCaseCQLFullElementSection

let measureName = 'ProportionPatient' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()
let measureCQL = 'library BreastCancerScreening version \'12.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    'include AdultOutpatientEncountersQDM version \'1.0.000\' called AdultOutpatientEncounters\n' +
    'include HospiceQDM version \'1.0.000\' called Hospice\n' +
    'include PalliativeCareExclusionECQMQDM version \'1.0.000\' called PalliativeCare\n' +
    'include AdvancedIllnessandFrailtyExclusionECQMQDM version \'1.0.000\' called AIFrailLTCF\n' +
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
    '  DateTime((year from start of "Measurement Period" - 2), 10, 1, 0, 0, 0, 0, 0)'
//skipping these tests until the QDM test case flag is removed
describe.skip('Validating the creation of QDM Test Case', () => {

    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
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
    it('Verify test case page bread crumb navigation', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob
        cy.get(TestCasesPage.QDMDob).type('01/01/2020')

        //save dob value
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        //click on bread crumb to navigate back to the main test case list page
        cy.get(TestCasesPage.testCasesBCLink).should('contain.text', 'Test Cases').wait(500).click()

        //verify that the user is, now, on the test case list page
        cy.readFile(measurePath).should('exist').then((measureId) => {
            cy.url().should('eq', 'https://dev-madie.hcqis.org/measures/' + measureId + '/edit/test-cases')
        })
    })
})
//skipping these tests until the QDM test case flag is removed
describe.skip('Validating the Elements section on Test Cases', () => {
    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, mCQLForElementsValidation, false, false,
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
    it('Verify elements and their subsections / cards', () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm page and elements tabs / objects have loaded on page
        Utilities.waitForElementVisible(TestCasesPage.ElementsSubTabHeading, 37000)
        Utilities.waitForElementVisible(TestCasesPage.EncounterElementTab, 37000)
        Utilities.waitForElementVisible(TestCasesPage.EncounterOSSCard, 37000)

        //click on Encounter element sub tab
        cy.get(TestCasesPage.EncounterElementTab).click()
        //cards under Encounter appear
        cy.get(TestCasesPage.EncounterOSSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEDVCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .first()
            .should('be.visible')
        cy.get(TestCasesPage.EncounterOSCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .last()
            .should('be.visible')

        //click on Laboratory element sub tab
        cy.get(TestCasesPage.LaboratoryElementTab).click()
        //cards under Laboratory appear
        cy.get(TestCasesPage.LaboratoryHLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratoryGLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratoryBLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratoryWHBCCLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratorySLTCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.LaboratoryPLTCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.LaboratoryCLTCard).scrollIntoView().should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.CharacteristicElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.CharacteristicMAPCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicPayerCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicMFFSPCard).should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.PhysicalExamElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.PhysicalExamOSbyPOCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExameBWCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExamSBPCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExamRRCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExamHRCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.PhysicalExamBTCard).scrollIntoView().should('be.visible')
    })

    it("Verify elements' subsections' edit cards", () => {
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case's edit page
        TestCasesPage.clickEditforCreatedTestCase()

        //confirm page and elements tabs / objects have loaded on page
        Utilities.waitForElementVisible(TestCasesPage.ElementsSubTabHeading, 37000)
        Utilities.waitForElementVisible(TestCasesPage.EncounterElementTab, 37000)
        Utilities.waitForElementVisible(TestCasesPage.EncounterOSSCard, 37000)

        //click on Encounter element sub tab
        cy.get(TestCasesPage.EncounterElementTab).click()

        //subsection -- Outpatient Surgery Service card appears and click on the plus button to open edit card
        cy.get(TestCasesPage.EncounterOSSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterOSSCardExpandBtn).should('be.visible')
        cy.get(TestCasesPage.EncounterOSSCardExpandBtn)
            .first()
            .click()

        //verify elements on edit card
        cy.get(TestCasesPage.ExpandedOSSDetailCard).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardClose).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard)
            .find(TestCasesPage.ExpandedOSSDetailCardTitle)
            .should('exist')
            .should('contain.text', 'Performed')
        cy.get(TestCasesPage.ExpandedOSSDetailCard)
            .find(TestCasesPage.ExpandedOSSDetailCardTitleSubDetail)
            .should('exist')
            .should('contain.text', 'Outpatient Surgery Service')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTiming)
            .should('exist')
            .should('contain.text', 'Timing')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabCodes).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabAttributes).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabNegationRationale).should('exist')

        //close the detail card
        //<span class="MuiTouchRipple-root css-w0pj6f"></span>
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardClose)
            .scrollIntoView()
            .wait(500)
            .click()
        //cards under Encounter appear
        cy.get(TestCasesPage.EncounterOSSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEDVCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .first()
            .should('be.visible')
        cy.get(TestCasesPage.EncounterOSCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .last()
            .should('be.visible')

        //click on Laboratory element sub tab
        cy.get(TestCasesPage.LaboratoryElementTab).click()
        //cards under Laboratory appear
        cy.get(TestCasesPage.LaboratoryHLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratoryGLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratoryBLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratoryWHBCCLTCard).should('be.visible')
        cy.get(TestCasesPage.LaboratorySLTCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.LaboratoryPLTCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.LaboratoryCLTCard).scrollIntoView().should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.CharacteristicElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.CharacteristicMAPCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicPayerCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicMFFSPCard).should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.PhysicalExamElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.PhysicalExamOSbyPOCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExameBWCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExamSBPCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExamRRCard).should('be.visible')
        cy.get(TestCasesPage.PhysicalExamHRCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.PhysicalExamBTCard).scrollIntoView().should('be.visible')
    })
})