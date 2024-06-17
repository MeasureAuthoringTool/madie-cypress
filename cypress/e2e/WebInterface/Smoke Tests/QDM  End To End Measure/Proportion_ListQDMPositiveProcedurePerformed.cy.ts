import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { QDMElements } from "../../../../Shared/QDMElements"

let measureName = 'ProportionListQDMPositiveProcedurePerformed' + Date.now()
let CqlLibraryName = 'ProportionListQDMPositiveProcedurePerformed' + Date.now()
let firstTestCaseTitle = 'DENEXFail UveitisOpticAtrophyAfterCatSurg'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'DENEXPass DisorderVisualCortexAfterOneCatSurg'
let measureCQL = 'library Cataracts2040BCVAwithin90Days version \'12.0.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'codesystem "SNOMEDCT": \'urn:oid:2.16.840.1.113883.6.96\' \n' +
    '\n' +
    'valueset "Acute and Subacute Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1241\' \n' +
    'valueset "Amblyopia": \'urn:oid:2.16.840.1.113883.3.526.3.1448\' \n' +
    'valueset "Best Corrected Visual Acuity Exam Using Snellen Chart": \'urn:oid:2.16.840.1.113883.3.526.3.1560\' \n' +
    'valueset "Burn Confined to Eye and Adnexa": \'urn:oid:2.16.840.1.113883.3.526.3.1409\' \n' +
    'valueset "Cataract Congenital": \'urn:oid:2.16.840.1.113883.3.526.3.1412\' \n' +
    'valueset "Cataract Mature or Hypermature": \'urn:oid:2.16.840.1.113883.3.526.3.1413\' \n' +
    'valueset "Cataract Posterior Polar": \'urn:oid:2.16.840.1.113883.3.526.3.1414\' \n' +
    'valueset "Cataract Secondary to Ocular Disorders": \'urn:oid:2.16.840.1.113883.3.526.3.1410\' \n' +
    'valueset "Cataract Surgery": \'urn:oid:2.16.840.1.113883.3.526.3.1411\' \n' +
    'valueset "Central Corneal Ulcer": \'urn:oid:2.16.840.1.113883.3.526.3.1428\' \n' +
    'valueset "Certain Types of Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1415\' \n' +
    'valueset "Chorioretinal Scars": \'urn:oid:2.16.840.1.113883.3.526.3.1449\' \n' +
    'valueset "Choroidal Degenerations": \'urn:oid:2.16.840.1.113883.3.526.3.1450\' \n' +
    'valueset "Choroidal Detachment": \'urn:oid:2.16.840.1.113883.3.526.3.1451\' \n' +
    'valueset "Choroidal Hemorrhage and Rupture": \'urn:oid:2.16.840.1.113883.3.526.3.1452\' \n' +
    'valueset "Chronic Iridocyclitis": \'urn:oid:2.16.840.1.113883.3.526.3.1416\' \n' +
    'valueset "Cloudy Cornea": \'urn:oid:2.16.840.1.113883.3.526.3.1417\' \n' +
    'valueset "Corneal Edema": \'urn:oid:2.16.840.1.113883.3.526.3.1418\' \n' +
    'valueset "Degeneration of Macula and Posterior Pole": \'urn:oid:2.16.840.1.113883.3.526.3.1453\' \n' +
    'valueset "Degenerative Disorders of Globe": \'urn:oid:2.16.840.1.113883.3.526.3.1454\' \n' +
    'valueset "Diabetic Macular Edema": \'urn:oid:2.16.840.1.113883.3.526.3.1455\' \n' +
    'valueset "Diabetic Retinopathy": \'urn:oid:2.16.840.1.113883.3.526.3.327\' \n' +
    'valueset "Disorders of Cornea Including Corneal Opacity": \'urn:oid:2.16.840.1.113883.3.526.3.1419\' \n' +
    'valueset "Disorders of Optic Chiasm": \'urn:oid:2.16.840.1.113883.3.526.3.1457\' \n' +
    'valueset "Disorders of Visual Cortex": \'urn:oid:2.16.840.1.113883.3.526.3.1458\' \n' +
    'valueset "Disseminated Chorioretinitis and Disseminated Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1459\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Focal Chorioretinitis and Focal Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1460\' \n' +
    'valueset "Glaucoma": \'urn:oid:2.16.840.1.113883.3.526.3.1423\' \n' +
    'valueset "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes": \'urn:oid:2.16.840.1.113883.3.526.3.1461\' \n' +
    'valueset "Hereditary Choroidal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1462\' \n' +
    'valueset "Hereditary Corneal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1424\' \n' +
    'valueset "Hereditary Retinal Dystrophies": \'urn:oid:2.16.840.1.113883.3.526.3.1463\' \n' +
    'valueset "Hypotony of Eye": \'urn:oid:2.16.840.1.113883.3.526.3.1426\' \n' +
    'valueset "Injury to Optic Nerve and Pathways": \'urn:oid:2.16.840.1.113883.3.526.3.1427\' \n' +
    'valueset "Macular Scar of Posterior Polar": \'urn:oid:2.16.840.1.113883.3.526.3.1559\' \n' +
    'valueset "Moderate or Severe Impairment, Better Eye, Profound Impairment Lesser Eye": \'urn:oid:2.16.840.1.113883.3.526.3.1464\' \n' +
    'valueset "Morgagnian Cataract": \'urn:oid:2.16.840.1.113883.3.526.3.1558\' \n' +
    'valueset "Nystagmus and Other Irregular Eye Movements": \'urn:oid:2.16.840.1.113883.3.526.3.1465\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Open Wound of Eyeball": \'urn:oid:2.16.840.1.113883.3.526.3.1430\' \n' +
    'valueset "Optic Atrophy": \'urn:oid:2.16.840.1.113883.3.526.3.1466\' \n' +
    'valueset "Optic Neuritis": \'urn:oid:2.16.840.1.113883.3.526.3.1467\' \n' +
    'valueset "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis": \'urn:oid:2.16.840.1.113883.3.526.3.1468\' \n' +
    'valueset "Other Background Retinopathy and Retinal Vascular Changes": \'urn:oid:2.16.840.1.113883.3.526.3.1469\' \n' +
    'valueset "Other Corneal Deformities": \'urn:oid:2.16.840.1.113883.3.526.3.1470\' \n' +
    'valueset "Other Disorders of Optic Nerve": \'urn:oid:2.16.840.1.113883.3.526.3.1471\' \n' +
    'valueset "Other Disorders of Sclera": \'urn:oid:2.16.840.1.113883.3.526.3.1472\' \n' +
    'valueset "Other Endophthalmitis": \'urn:oid:2.16.840.1.113883.3.526.3.1473\' \n' +
    'valueset "Other Proliferative Retinopathy": \'urn:oid:2.16.840.1.113883.3.526.3.1480\' \n' +
    'valueset "Other Retinal Disorders": \'urn:oid:2.16.840.1.113883.3.526.3.1474\' \n' +
    'valueset "Pathologic Myopia": \'urn:oid:2.16.840.1.113883.3.526.3.1432\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Posterior Lenticonus": \'urn:oid:2.16.840.1.113883.3.526.3.1433\' \n' +
    'valueset "Prior Penetrating Keratoplasty": \'urn:oid:2.16.840.1.113883.3.526.3.1475\' \n' +
    'valueset "Profound Impairment, Both Eyes": \'urn:oid:2.16.840.1.113883.3.526.3.1476\' \n' +
    'valueset "Purulent Endophthalmitis": \'urn:oid:2.16.840.1.113883.3.526.3.1477\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    'valueset "Retinal Detachment with Retinal Defect": \'urn:oid:2.16.840.1.113883.3.526.3.1478\' \n' +
    'valueset "Retinal Vascular Occlusion": \'urn:oid:2.16.840.1.113883.3.526.3.1479\' \n' +
    'valueset "Retrolental Fibroplasias": \'urn:oid:2.16.840.1.113883.3.526.3.1438\' \n' +
    'valueset "Scleritis": \'urn:oid:2.16.840.1.113762.1.4.1226.1\' \n' +
    'valueset "Separation of Retinal Layers": \'urn:oid:2.16.840.1.113883.3.526.3.1482\' \n' +
    'valueset "Traumatic Cataract": \'urn:oid:2.16.840.1.113883.3.526.3.1443\' \n' +
    'valueset "Uveitis": \'urn:oid:2.16.840.1.113883.3.526.3.1444\' \n' +
    'valueset "Vascular Disorders of Iris and Ciliary Body": \'urn:oid:2.16.840.1.113883.3.526.3.1445\' \n' +
    'valueset "Visual Acuity 20/40 or Better": \'urn:oid:2.16.840.1.113883.3.526.3.1483\' \n' +
    'valueset "Visual Field Defects": \'urn:oid:2.16.840.1.113883.3.526.3.1446\' \n' +
    '\n' +
    'code "Best corrected visual acuity (observable entity)": \'419775003\' from "SNOMEDCT" display \'Best corrected visual acuity (observable entity)\'\n' +
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
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '\n' +
    'define "Numerator":\n' +
    '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
    '    with ( ["Physical Exam, Performed": "Best corrected visual acuity (observable entity)"]\n' +
    '      union ["Physical Exam, Performed": "Best Corrected Visual Acuity Exam Using Snellen Chart"] ) VisualAcuityExamPerformed\n' +
    '      such that Global."NormalizeInterval" ( VisualAcuityExamPerformed.relevantDatetime, VisualAcuityExamPerformed.relevantPeriod ) 90 days or less after day of \n' +
    '      end of Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
    '        and VisualAcuityExamPerformed.result in "Visual Acuity 20/40 or Better"\n' +
    '\n' +
    'define "Denominator Exclusions":\n' +
    '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
    '    with ( ["Diagnosis": "Acute and Subacute Iridocyclitis"]\n' +
    '      union ["Diagnosis": "Amblyopia"]\n' +
    '      union ["Diagnosis": "Burn Confined to Eye and Adnexa"]\n' +
    '      union ["Diagnosis": "Cataract Secondary to Ocular Disorders"]\n' +
    '      union ["Diagnosis": "Cataract Congenital"]\n' +
    '      union ["Diagnosis": "Cataract Mature or Hypermature"]\n' +
    '      union ["Diagnosis": "Cataract Posterior Polar"]\n' +
    '      union ["Diagnosis": "Central Corneal Ulcer"]\n' +
    '      union ["Diagnosis": "Certain Types of Iridocyclitis"]\n' +
    '      union ["Diagnosis": "Choroidal Degenerations"]\n' +
    '      union ["Diagnosis": "Choroidal Detachment"]\n' +
    '      union ["Diagnosis": "Choroidal Hemorrhage and Rupture"]\n' +
    '      union ["Diagnosis": "Chronic Iridocyclitis"]\n' +
    '      union ["Diagnosis": "Cloudy Cornea"]\n' +
    '      union ["Diagnosis": "Corneal Edema"]\n' +
    '      union ["Diagnosis": "Disorders of Cornea Including Corneal Opacity"]\n' +
    '      union ["Diagnosis": "Degeneration of Macula and Posterior Pole"]\n' +
    '      union ["Diagnosis": "Degenerative Disorders of Globe"]\n' +
    '      union ["Diagnosis": "Diabetic Macular Edema"]\n' +
    '      union ["Diagnosis": "Diabetic Retinopathy"]\n' +
    '      union ["Diagnosis": "Disorders of Optic Chiasm"]\n' +
    '      union ["Diagnosis": "Disorders of Visual Cortex"]\n' +
    '      union ["Diagnosis": "Disseminated Chorioretinitis and Disseminated Retinochoroiditis"]\n' +
    '      union ["Diagnosis": "Focal Chorioretinitis and Focal Retinochoroiditis"]\n' +
    '      union ["Diagnosis": "Glaucoma"]\n' +
    '      union ["Diagnosis": "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes"]\n' +
    '      union ["Diagnosis": "Hereditary Choroidal Dystrophies"]\n' +
    '      union ["Diagnosis": "Hereditary Corneal Dystrophies"]\n' +
    '      union ["Diagnosis": "Hereditary Retinal Dystrophies"]\n' +
    '      union ["Diagnosis": "Hypotony of Eye"]\n' +
    '      union ["Diagnosis": "Injury to Optic Nerve and Pathways"]\n' +
    '      union ["Diagnosis": "Macular Scar of Posterior Polar"]\n' +
    '      union ["Diagnosis": "Morgagnian Cataract"]\n' +
    '      union ["Diagnosis": "Nystagmus and Other Irregular Eye Movements"]\n' +
    '      union ["Diagnosis": "Open Wound of Eyeball"]\n' +
    '      union ["Diagnosis": "Optic Atrophy"]\n' +
    '      union ["Diagnosis": "Optic Neuritis"]\n' +
    '      union ["Diagnosis": "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis"]\n' +
    '      union ["Diagnosis": "Other Background Retinopathy and Retinal Vascular Changes"]\n' +
    '      union ["Diagnosis": "Other Disorders of Optic Nerve"]\n' +
    '      union ["Diagnosis": "Other Endophthalmitis"]\n' +
    '      union ["Diagnosis": "Other Proliferative Retinopathy"]\n' +
    '      union ["Diagnosis": "Pathologic Myopia"]\n' +
    '      union ["Diagnosis": "Posterior Lenticonus"]\n' +
    '      union ["Diagnosis": "Prior Penetrating Keratoplasty"]\n' +
    '      union ["Diagnosis": "Purulent Endophthalmitis"]\n' +
    '      union ["Diagnosis": "Retinal Detachment with Retinal Defect"]\n' +
    '      union ["Diagnosis": "Retinal Vascular Occlusion"]\n' +
    '      union ["Diagnosis": "Retrolental Fibroplasias"]\n' +
    '      union ["Diagnosis": "Scleritis"]\n' +
    '      union ["Diagnosis": "Separation of Retinal Layers"]\n' +
    '      union ["Diagnosis": "Traumatic Cataract"]\n' +
    '      union ["Diagnosis": "Uveitis"]\n' +
    '      union ["Diagnosis": "Vascular Disorders of Iris and Ciliary Body"]\n' +
    '      union ["Diagnosis": "Visual Field Defects"] ) ComorbidDiagnosis\n' +
    '      such that ComorbidDiagnosis.prevalencePeriod overlaps before Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n' +
    '    where AgeInYearsAt(date from start of "Measurement Period")>= 18\n' +
    '\n' +
    'define "Cataract Surgery Between January and September of Measurement Period":\n' +
    '  ["Procedure, Performed": "Cataract Surgery"] CataractSurgery\n' +
    '    where Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) during "Measurement Period"\n' +
    '      and Global."NormalizeInterval" ( CataractSurgery.relevantDatetime, CataractSurgery.relevantPeriod ) starts 92 days or more before \n' +
    '      end of "Measurement Period"'

describe('Measure Creation: Proportion ListQDMPositiveProcedurePerformed', () => {

    before('Create Measure', () => {

        //Create New Measure
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

    it('End to End Proportion ListQDMPositiveProcedurePerformed', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

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
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringProportion)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Proportion')

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
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Add Elements to the Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('08/17/1957', 'Living', 'American Indian or Alaska Native', 'Female', 'Not Hispanic or Latino')

        //Element - Condition:Diagnosis: Uveitis
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Uveitis')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/15/2012 07:00 PM', '03/15/2012 07:00 PM')
        cy.wait(3000)
        //add Code
        QDMElements.addCode('SNOMEDCT', '4927003')

        //Element - Procedure:Performed: Cataract Surgery
        //add Element
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/15/2012 05:00 PM', '03/15/2012 07:00 PM')
        cy.wait(3000)
        //add Code
        QDMElements.addCode('SNOMEDCT', '9137006')

        //Element - Condition:Diagnosis: Optic Atrophy
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Optic Atrophy')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('03/15/2012 07:00 PM', '03/15/2012 07:00 PM')
        cy.wait(3000)
        //add Code
        QDMElements.addCode('SNOMEDCT', '111527005')

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('1')

        //Save Test case
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', 'Test Case Updated Successfully')

        //Add Elements to the second Test case
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase(true)

        //enter a value of the dob, Race and gender
        TestCasesPage.enterPatientDemographics('07/28/1977', 'Living', 'American Indian or Alaska Native', 'Female', 'Not Hispanic or Latino')

        //Element - Condition:Diagnosis: Disorders of Visual Cortex
        //add Element
        QDMElements.addElement('condition', 'Diagnosis: Disorders of Visual Cortex')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('01/01/2012 01:15 PM', '01/02/2012 01:15 PM')
        //add Code
        QDMElements.addCode('Icd10CM', 'H47.611')

        //Element - Procedure:Performed: Cataract Surgery
        //add Element
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('01/02/2012 10:15 PM', '01/02/2012 01:15 PM')
        cy.wait(3000)
        //add Code
        QDMElements.addCode('SNOMEDCT', '10178000')
        //Close the Element
        QDMElements.closeElement()

        //Element - Procedure:Performed: Cataract Surgery
        //add Element
        QDMElements.addElement('procedure', 'Performed: Cataract Surgery')
        //add Timing Relevant Period DateTime
        QDMElements.addTimingRelevantPeriodDateTime('02/02/2012 01:15 PM', '02/02/2012 04:15 PM')
        cy.wait(3000)
        //add Code
        QDMElements.addCode('SNOMEDCT', '446548003')

        //Element - Physical Exam:Performed: Best Corrected Visual Acuity Exam Using Snellen Chart
        //add Element
        QDMElements.addElement('physicalexam', 'Performed: Best Corrected Visual Acuity Exam Using Snellen Chart')
        cy.get('[id="dateTime"]').eq(2).type('02/02/2012 01:15 PM')
        cy.get(TestCasesPage.attributesTab).click()
        cy.get(TestCasesPage.selectAttributeDropdown).click()
        cy.get('[data-testid="option-Result"]').click()
        cy.get('[id="type-select"]').click()
        cy.get('[data-testid="option-Code"]').click()
        cy.get('[id="value-set-selector"]').click()
        cy.get('[data-testid="custom-vs"]').click()
        cy.wait(3000)
        cy.get('[data-testid=custom-code-system-input]').type('SNOMEDCT')
        cy.get('[data-testid=custom-code-input]').type('422497000')
        cy.get('[data-testid="add-attribute-button"]').click()
        cy.get('[data-testid=sub-navigation-tab-codes]').click()
        cy.get('[id="code-system-selector"]').click()
        cy.get('[data-testid=code-system-option-custom]').click()
        cy.wait(3000)
        cy.get('[data-testid=custom-code-system-input]').type('SNOMEDCT')
        cy.get('[data-testid=custom-code-input]').type('419775003')
        cy.get('[data-testid=add-code-concept-button]').click()

        //Add Expected value for Test case
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.enabled')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('2')
        cy.get(TestCasesPage.testCaseDENOMExpected).type('2')
        cy.get(TestCasesPage.testCaseDENEXExpected).type('1')

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
