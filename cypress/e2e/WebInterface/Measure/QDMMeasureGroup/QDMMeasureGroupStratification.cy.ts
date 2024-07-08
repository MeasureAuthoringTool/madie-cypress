import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header";

let measureName = 'ProportionPatient' + Date.now()
let CqlLibraryName = 'ProportionPatient' + Date.now()
let measureCQL = 'library BreastCancerScreening version \'12.0.000\'\n' +
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
    '  DateTime((year from start of "Measurement Period" - 2), 10, 1, 0, 0, 0, 0, 0)'

describe('Validating Stratification tabs', () => {

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
        //OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })
    it('Stratification tab includes new fields and those fields have expected values', () => {

        //Click on Edit Measure
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //confirm Base Config alert message appears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //select 'Proportion' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //verify availability of the save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        //Click on Stratification tab
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //confirm stratification related fields are present
        cy.get(MeasureGroupPage.stratOne).should('exist')
        cy.get(MeasureGroupPage.stratTwo).should('exist')
        cy.get(MeasureGroupPage.addStratButton).should('exist')

        //confirm values in stratification 1 related fields -- score type is Proportion
        //stratification 1 -- default value
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'Select Definition')
        cy.get(MeasureGroupPage.stratOne).each(($ele) => {
            expect($ele.text()).to.be.oneOf(['Select Definition', 'Bilateral Mastectomy Diagnosis', 'Bilateral Mastectomy Procedure', 'Denominator Exclusions'])
        })
    })

    it('Add multiple stratifications and stratification description to the measure group', () => {

        //Click on Edit Measure
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //confirm Base Config alert message appears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //select 'Proportion' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //verify availability of the save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 32000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).wait(500).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescOne).type('Stratification One Description')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Numerator')
        cy.get(MeasureGroupPage.stratDescTwo).type('Stratification Two Description')

        //Add Stratification 3
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratThree, 'Denominator')
        cy.get(MeasureGroupPage.stratDescThree).type('Stratification Three Description')

        //Add Stratification 4
        cy.get(MeasureGroupPage.addStratButton).click()
        Utilities.dropdownSelect(MeasureGroupPage.stratFour, 'Initial Population')
        cy.get(MeasureGroupPage.stratDescFour).type('Stratification Four Description')

        Utilities.waitForElementVisible(MeasureGroupPage.saveMeasureGroupDetails, 30700)
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate back to stratification tab and assert the values
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratAssociationOne).length != 0)) {
                Utilities.waitForElementVisible(MeasureGroupPage.stratAssociationOne, 30700)
                cy.get(MeasureGroupPage.stratAssociationOne).should('exist')
                cy.get(MeasureGroupPage.stratAssociationOne).should('be.visible')
            } else {
                Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 30700)
                cy.get(MeasureGroupPage.stratificationTab).should('exist')
                cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
                cy.get(MeasureGroupPage.stratificationTab).click()
            }
        })
        cy.get(MeasureGroupPage.stratOne).should('contain.text', 'Initial Population')
        cy.get(MeasureGroupPage.stratDescOne).should('contain.text', 'Stratification One Description')
        cy.get(MeasureGroupPage.stratTwo).should('contain.text', 'Numerator')
        cy.get(MeasureGroupPage.stratDescTwo).should('contain.text', 'Stratification Two Description')
        cy.get(MeasureGroupPage.stratThree).should('contain.text', 'Denominator')
        cy.get(MeasureGroupPage.stratDescThree).should('contain.text', 'Stratification Three Description')
        cy.get(MeasureGroupPage.stratFour).should('contain.text', 'Initial Population')
        cy.get(MeasureGroupPage.stratDescFour).should('contain.text', 'Stratification Four Description')
    })

    it('Stratification tab is not present / available when the Ratio scoring value is selected', () => {

        //Click on Edit Measure
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //confirm Base Config alert message appears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //select Ratio scoring type
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringRatio)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Ratio')

        //verify availability of the save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        //assert that Stratification is no longer available
        cy.get(MeasureGroupPage.stratificationTab).should('not.exist')

    })

    it('Verify error message when the Stratification return type does not match with population basis', () => {

        //Click on Edit Measure
        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        //Click on Measure Group tab
        Utilities.waitForElementVisible(EditMeasurePage.measureGroupsTab, 30000)
        cy.get(EditMeasurePage.measureGroupsTab).should('exist')
        cy.get(EditMeasurePage.measureGroupsTab).click()

        //navigate to the criteria section of the PC
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        //confirm Base Config alert message appears
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCCriteriaReqAlertMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCCriteriaReqAlertMsg).should('contain.text', 'Please complete the Base Configuration tab before continuing')

        //click on / navigate to the Base Configuration sub-tab
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).should('be.visible')
        cy.get(MeasureGroupPage.leftPanelBaseConfigTab).click()

        //validate that a value can be selected for the Type field
        cy.get(MeasureGroupPage.qdmType).click().type('Appropriate Use Process').click()
        cy.get(MeasureGroupPage.qdmTypeOptionZero).click()
        cy.get(MeasureGroupPage.qdmScoring).click({ force: true })
        cy.get(MeasureGroupPage.qdmTypeValuePill).should('contain.text', 'Appropriate Use Process')

        //select 'Proportion' scoring on measure
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

        //verify availability of the save button
        cy.get(MeasureGroupPage.qdmBCSaveButton).should('be.enabled')
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration Updated Successfully')

        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()
        cy.get(MeasureGroupPage.QDMPopCriteria1Desc).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        //Click on Stratification tab
        Utilities.waitForElementVisible(MeasureGroupPage.stratificationTab, 32000)
        cy.get(MeasureGroupPage.stratificationTab).should('exist')
        cy.get(MeasureGroupPage.stratificationTab).should('be.visible')
        cy.get(MeasureGroupPage.stratificationTab).wait(500).click()

        //create stratification fields if they do not already exist on page
        cy.get('body').then((body) => {
            if ((body.find(MeasureGroupPage.stratOne).length == 0) || (body.find(MeasureGroupPage.stratTwo).length == 0)) {
                cy.get(MeasureGroupPage.addStratButton).should('exist')
                cy.get(MeasureGroupPage.addStratButton).should('be.visible')
                cy.get(MeasureGroupPage.addStratButton).should('be.enabled')
                cy.get(MeasureGroupPage.addStratButton).wait(1000).click().wait(1000).click()
            }
        })

        //Add Stratification 1
        Utilities.dropdownSelect(MeasureGroupPage.stratOne, 'Bilateral Mastectomy Diagnosis')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'For Patient-based Measures, selected definitions must return a Boolean.')

        //Add Stratification 2
        Utilities.dropdownSelect(MeasureGroupPage.stratTwo, 'Bilateral Mastectomy Procedure')
        cy.get(MeasureGroupPage.populationMismatchErrorMsg).should('contain.text', 'For Patient-based Measures, selected definitions must return a Boolean.')

        //Verify save button is disabled
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.disabled')

    })
})
