import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { Global } from "../../../../../Shared/Global"

let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let measurePath = 'cypress/fixtures/measureId'
let mCQLForElementsValidation = MeasureCQL.QDMTestCaseCQLFullElementSection
let CQLSimple_for_QDM = MeasureCQL.QDMSimpleCQL

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

describe('Validating the creation of QDM Test Case', () => {

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
        cy.get(TestCasesPage.QDMDob).type('01/01/2020').wait(1000)

        //save dob value
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        //click on bread crumb to navigate back to the main test case list page
        cy.get(TestCasesPage.testCasesBCLink).should('contain.text', 'Test Cases').wait(500).click()

        //verify that the user is, now, on the test case list page
        cy.readFile(measurePath).should('exist').then((measureId) => {
            cy.url().should('contain', measureId + '/edit/test-cases')
        })
    })
})

describe('Validating the Elements section on Test Cases', () => {
    beforeEach('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', false, mCQLForElementsValidation)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population',
            'boolean')
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

        //click on Encounter element sub tab
        cy.get(TestCasesPage.EncounterElementTab).click()
        //cards under Encounter appear
        cy.get(TestCasesPage.EncounterOSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEDVCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .first()
            .should('be.visible')
        cy.get(TestCasesPage.EncounterOSCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .last()
            .should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.CharacteristicElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.CharacteristicMAPCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicMFFSPCard).should('be.visible')

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

        //click on Encounter element sub tab
        cy.get(TestCasesPage.EncounterElementTab).click()

        //subsection -- Outpatient Surgery Service card appears and click on the plus button to open edit card
        cy.get(TestCasesPage.EncounterOSCard).should('be.visible')
        cy.get(TestCasesPage.plusIcon).should('be.visible')
        cy.get(TestCasesPage.plusIcon)
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
            .should('contain.text', 'Observation Services')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTiming)
            .should('exist')
            .should('contain.text', 'Timing')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabCodes).should('exist')
        cy.get(TestCasesPage.ExpandedOSSDetailCard).find(TestCasesPage.ExpandedOSSDetailCardTabAttributes).should('exist')

        //close the detail card
        cy.get('[data-testid="CloseIcon"]').click()
        //cards under Encounter appear
        cy.get(TestCasesPage.EncounterOSCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEDVCard).should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .first()
            .should('be.visible')
        cy.get(TestCasesPage.EncounterOSCard).scrollIntoView().should('be.visible')
        cy.get(TestCasesPage.EncounterEICard)
            .last()
            .should('be.visible')

        //click on Characteristic element sub tab
        cy.get(TestCasesPage.CharacteristicElementTab).click()
        //cards under Characteristic appear
        cy.get(TestCasesPage.CharacteristicMAPCard).should('be.visible')
        cy.get(TestCasesPage.CharacteristicMFFSPCard).should('be.visible')

    })
})

describe('Run QDM Test Case ', () => {
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
        cy.get(TestCasesPage.QDMDob).click().wait(500)
        cy.get(TestCasesPage.QDMDob).clear().type('1981-05-27')
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Living').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        //save the Test Case
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

    })
})

// skipping until the manifestExpansion is removed / permanently set to true
describe.skip('Validating Expansion -> Manifest selections / navigation functionality', () => {

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
    it('Verify Expansion -> Manifest', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //create test case
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        //validating current / initial selected radio button and selecting the manifest radio button
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //confirm that initial value is set to 'No'
                cy.wrap(radio).eq(0).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Latest');

                //check / select radio button for the value of 'Yes'
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Manifest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
                cy.get(TestCasesPage.qdmManifestFirstOption).click()
                cy.get(TestCasesPage.qdmManifestSaveBtn).click()
                cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')


                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(0).should('not.be.checked');
            });
        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-4q2017-eh')

        //navigate away from the test cases tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        Utilities.waitForElementVisible(MeasureGroupPage.leftPanelBaseConfigTab, 30000)

        //navigate back to test cases page / tab
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-4q2017-eh')

        //validating that manifest is, now, selected and making a change in the selection
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //confirm that initial value is set to 'Manifest'
                cy.wrap(radio).eq(1).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Manifest');

                //check / select radio button for the value of 'Latest'
                cy.wrap(radio).eq(0).check({ force: true }).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Latest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('not.exist')

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            });


        //attempt to navigate away from the test cases tab / page
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //confirm dirty check window
        cy.get(EditMeasurePage.dirtCheckModal).should('exist')
        cy.get(EditMeasurePage.dirtCheckModal).should('be.visible')

        //select continue working on page
        cy.get(Global.keepWorkingCancel).should('exist')
        cy.get(Global.keepWorkingCancel).should('be.visible')
        cy.get(Global.keepWorkingCancel).should('be.enabled')
        cy.get(Global.keepWorkingCancel).click()

        //confirm the edit is still present
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //confirm that initial value is set to 'Latest'
                cy.wrap(radio).eq(0).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Latest');

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(1).should('not.be.checked');
            });
        //discard changes on the test Expansion Test Cases tab / page
        cy.get(TestCasesPage.qdmManifestDiscardBtn).click()
        cy.get(Global.discardChangesContinue).click()

        //verify that 'Manifest' is still checked after discarding changes on the page
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {

                //check / select radio button for the value of 'Manifest'
                cy.wrap(radio).eq(1).should('be.checked');
                cy.contains('[class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3"]', 'Manifest');

                // Verify that first radio button is no longer checked
                cy.wrap(radio).eq(0).should('not.be.checked');
            });
        //confirm that manifest drop down has selected value
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).should('contain.text', 'ecqm-update-4q2017-eh')
    })
})
