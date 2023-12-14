import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let validTestCaseJson = TestCaseJson.QDMTestCaseJson
let testCaseSeries = 'SBTestSeries'
let measureCQL = MeasureCQL.QDMCQL4MAT5645
let prodBonneTestCasesFile = 'patients_39E0424A-1727-4629-89E2-C46C2FBB3F5F_QDM_56_1702482074.json'
let measureNamePropListQDM = 'ProportionListQDMPositiveProcedurePerformed' + Date.now()
let CqlLibraryNamePropListQDM = 'ProportionListQDMPositiveProcedurePerformed' + Date.now()
let measureCQLPRODCat = MeasureCQL.qdmMeasureCQLPRODCataracts2040BCVAwithin90Days

describe('Measure Creation: Proportion ListQDMPositiveProcedurePerformed', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureNamePropListQDM, CqlLibraryNamePropListQDM, measureCQLPRODCat, false, false,
            '2012-01-01', '2012-12-31')

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureNamePropListQDM, CqlLibraryNamePropListQDM)

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

        //import test cases from BONNIE PROD
        //click on the import test case button
        cy.get(TestCasesPage.importTestCasesBtn).click()

        //select file
        cy.get(TestCasesPage.filAttachDropBox).attachFile(prodBonneTestCasesFile)

        //import modal should contain test case name
        cy.get(TestCasesPage.importTestCaseModalHeader).should('contain.text', '[82] Test Cases from File: patients_39E0424A-1727-4629-89E2-C46C2FBB3F5F_QDM_56_1702482074.json')

        //click on the 'Import' button on the modal window
        cy.get(TestCasesPage.importTestCaseModalBtn).click()

        //success message that appears after import
        cy.get(TestCasesPage.tcSaveSuccessMsg).should('contain.text', '(82) Test cases imported successfully')

        //run test cases
        cy.get(TestCasesPage.executeTestCaseButton).click().wait(3000)

        //click on coverage tab
        cy.get(TestCasesPage.testCaseListCoveragePercTab).click()

        //validate PC sections
        cy.get(TestCasesPage.tcCoverageTabList).should('include.text', 'initialPopulation')
        cy.get(TestCasesPage.tcCoverageTabList).should('include.text', 'denominator')
        cy.get(TestCasesPage.tcCoverageTabList).should('include.text', 'denominatorExclusion')
        cy.get(TestCasesPage.tcCoverageTabList).should('include.text', 'numerator')

        //validate that contents are, initially, viewable of a section
        cy.get(TestCasesPage.tcCoverageContent).should('have.attr', 'style', 'max-height: 113px;')
        cy.get(TestCasesPage.tcCoverageTabList).should('include.text', 'initialPopulationdefine "Initial Population":\n  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n    where AgeInYearsAt(date from start of "Measurement Period")>= 18denominatordefine "Denominator":\n  "Initial Population"denominatorExclusiondefine "Denominator Exclusions":\n  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n    with ( ["Diagnosis": "Acute and Subacute Iridocyclitis"]\n      union ["Diagnosis": "Amblyopia"]\n      union ["Diagnosis": "Burn Confined to Eye and Adnexa"]\n      union ["Diagnosis": "Cataract Secondary to Ocular Disorders"]\n      union ["Diagnosis": "Cataract Congenital"]\n      union ["Diagnosis": "Cataract Mature or Hypermature"]\n      union ["Diagnosis": "Cataract Posterior Polar"]\n      union ["Diagnosis": "Central Corneal Ulcer"]\n      union ["Diagnosis": "Certain Types of Iridocyclitis"]\n      union ["Diagnosis": "Choroidal Degenerations"]\n      union ["Diagnosis": "Choroidal Detachment"]\n      union ["Diagnosis": "Choroidal Hemorrhage and Rupture"]\n      union ["Diagnosis": "Chronic Iridocyclitis"]\n      union ["Diagnosis": "Cloudy Cornea"]\n      union ["Diagnosis": "Corneal Edema"]\n      union ["Diagnosis": "Disorders of Cornea Including Corneal Opacity"]\n      union ["Diagnosis": "Degeneration of Macula and Posterior Pole"]\n      union ["Diagnosis": "Degenerative Disorders of Globe"]\n      union ["Diagnosis": "Diabetic Macular Edema"]\n      union ["Diagnosis": "Diabetic Retinopathy"]\n      union ["Diagnosis": "Disorders of Optic Chiasm"]\n      union ["Diagnosis": "Disorders of Visual Cortex"]\n      union ["Diagnosis": "Disseminated Chorioretinitis and Disseminated Retinochoroiditis"]\n      union ["Diagnosis": "Focal Chorioretinitis and Focal Retinochoroiditis"]\n      union ["Diagnosis": "Glaucoma"]\n      union ["Diagnosis": "Glaucoma Associated with Congenital Anomalies and Dystrophies and Systemic Syndromes"]\n      union ["Diagnosis": "Hereditary Choroidal Dystrophies"]\n      union ["Diagnosis": "Hereditary Corneal Dystrophies"]\n      union ["Diagnosis": "Hereditary Retinal Dystrophies"]\n      union ["Diagnosis": "Hypotony of Eye"]\n      union ["Diagnosis": "Injury to Optic Nerve and Pathways"]\n      union ["Diagnosis": "Macular Scar of Posterior Polar"]\n      union ["Diagnosis": "Morgagnian Cataract"]\n      union ["Diagnosis": "Nystagmus and Other Irregular Eye Movements"]\n      union ["Diagnosis": "Open Wound of Eyeball"]\n      union ["Diagnosis": "Optic Atrophy"]\n      union ["Diagnosis": "Optic Neuritis"]\n      union ["Diagnosis": "Other and Unspecified Forms of Chorioretinitis and Retinochoroiditis"]\n      union ["Diagnosis": "Other Background Retinopathy and Retinal Vascular Changes"]\n      union ["Diagnosis": "Other Disorders of Optic Nerve"]\n      union ["Diagnosis": "Other Endophthalmitis"]\n      union ["Diagnosis": "Other Proliferative Retinopathy"]\n      union ["Diagnosis": "Pathologic Myopia"]\n      union ["Diagnosis": "Posterior Lenticonus"]\n      union ["Diagnosis": "Prior Penetrating Keratoplasty"]\n      union ["Diagnosis": "Purulent Endophthalmitis"]\n      union ["Diagnosis": "Retinal Detachment with Retinal Defect"]\n      union ["Diagnosis": "Retinal Vascular Occlusion"]\n      union ["Diagnosis": "Retrolental Fibroplasias"]\n      union ["Diagnosis": "Scleritis"]\n      union ["Diagnosis": "Separation of Retinal Layers"]\n      union ["Diagnosis": "Traumatic Cataract"]\n      union ["Diagnosis": "Uveitis"]\n      union ["Diagnosis": "Vascular Disorders of Iris and Ciliary Body"]\n      union ["Diagnosis": "Visual Field Defects"] ) ComorbidDiagnosis\n      such that ComorbidDiagnosis.prevalencePeriod overlaps before Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )numeratordefine "Numerator":\n  "Cataract Surgery Between January and September of Measurement Period" CataractSurgeryPerformed\n    with ( ["Physical Exam, Performed": "Best corrected visual acuity (observable entity)"]\n      union ["Physical Exam, Performed": "Best Corrected Visual Acuity Exam Using Snellen Chart"] ) VisualAcuityExamPerformed\n      such that Global."NormalizeInterval" ( VisualAcuityExamPerformed.relevantDatetime, VisualAcuityExamPerformed.relevantPeriod ) 90 days or less after day of \n      end of Global."NormalizeInterval" ( CataractSurgeryPerformed.relevantDatetime, CataractSurgeryPerformed.relevantPeriod )\n        and VisualAcuityExamPerformed.result in "Visual Acuity 20/40 or Better"')
        cy.get(TestCasesPage.tcCoverageSections).wait(2500).first().wait(2500).find('[class="accordion-title"]').should('include.text', 'initialPopulation').wait(2500).click()
        cy.get(TestCasesPage.tcCoverageContent).should('have.attr', 'style', 'max-height: 0px;')
    })
})

//skipping these tests until user story MAT-5645 is fixed
describe('Run / Execute Test case and verify passing percentage and coverage', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23'/*'Initial Population'*/)

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()

        let randValue = (Math.floor((Math.random() * 1000) + 1))
        let newCqlLibraryName = CqlLibraryName + randValue

        Utilities.deleteMeasure(measureName, newCqlLibraryName)
    })

    it('Run / Execute single passing Test Case', () => {

        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJson)
        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.testCaseAction('edit')

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click().wait(3000)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/1)')

        //Skipping until MAT-5657 is finished
        // cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        // cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        // cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')
        // cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', 'Coverage')

    })

    it('Run / Execute one passing and one failing Test Cases', () => {

        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('PassingTestCase')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('TestDesc')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('SBTestSeries').type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries('PassingTestCase', 'SBTestSeries')

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMDob).type('01/01/2020').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Expired').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click()

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).type('1')

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).click().wait(7000)

        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 30000)

        //create a test case that will fail:

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('Failing Test Case')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('FTC')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('ICFTCSeries').type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries('Failing Test Case', 'ICFTCSeries')

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMDob).type('01/01/2020').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Expired').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).wait(7000).click()

        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 30000)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).eq(0).should('contain.text', 'Fail')
        cy.get(TestCasesPage.testCaseStatus).eq(1).should('contain.text', 'Pass')

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '50%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', 'Passing')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(1/2)')

    })
    it('Run / Execute single failing Test Cases', () => {

        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //create a test case that will fail:

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click()

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 20000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 20000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type('Failing Test Case')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type('FTC')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type('ICFTCSeries').type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries('Failing Test Case', 'ICFTCSeries')

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.QDMDob).type('01/01/2020').click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains('Expired').click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get(TestCasesPage.QDMRaceOption).contains('White').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains('Male').click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get(TestCasesPage.QEMEthnicityOptions).contains('Not Hispanic or Latino').click()

        cy.get(TestCasesPage.tctExpectedActualSubTab).should('exist')
        cy.get(TestCasesPage.tctExpectedActualSubTab).should('be.visible')
        cy.get(TestCasesPage.tctExpectedActualSubTab).click()

        cy.get(TestCasesPage.testCaseIPPExpected).should('exist')
        cy.get(TestCasesPage.testCaseIPPExpected).should('be.visible')
        cy.get(TestCasesPage.testCaseIPPExpected).check()

        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.visible')
        cy.get(TestCasesPage.editTestCaseSaveButton).should('be.enabled')
        cy.get(TestCasesPage.editTestCaseSaveButton).wait(7000).click()

        Utilities.waitForElementVisible(TestCasesPage.tcSaveSuccessMsg, 30000)

        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')
    })
})


describe('Run / Execute QDM Test Case button validations', () => {

    beforeEach('Login and Create Measure', () => {

        CqlLibraryName = 'QDMTestLibrary2' + Date.now()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true)
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Run Test Case button is disabled  -- CQL Errors', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/QDMMeasureCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorTextBox).type('{home}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('adjfajsdsdjf{}')

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click().wait(3000)

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()

        //click on details tab
        cy.get(TestCasesPage.detailsTab).scrollIntoView().click()


    })

    it('Run / Execute Test Case button is disabled  -- Missing group / population selections', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/QDMMeasureCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorSaveButton).wait(1000).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')

        TestCasesPage.clickEditforCreatedTestCase()

        Utilities.waitForElementVisible(TestCasesPage.runQDMTestCaseBtn, 37700)
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.disabled')

    })

    it('Run / Execute Test Case button is disabled -- missing TC Json', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/QDMMeasureCQL.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        //save CQL on measure
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('exist')
        cy.get(EditMeasurePage.cqlEditorSaveButton).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Click on the measure group tab
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click().wait(3000)

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        //Commented until MAT-6151 is fixed

        // cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        // cy.get(EditMeasurePage.testCasesTab).click()

        // TestCasesPage.clickEditforCreatedTestCase()
        //
        // cy.get(TestCasesPage.runTestButton).should('be.disabled')
        //
        // //Verify Execute Test cast case button on Test case list page
        // cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Invalid')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.disabled')
    })
})

describe('Run / Execute Test case for multiple Population Criteria', () => {

    beforeEach('Create Measure, Measure group and login', () => {

        CqlLibraryName = 'QDMTestLibrary5' + Date.now()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Run and Execute Test case for multiple Population Criteria', () => {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add second Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()
        cy.get(MeasureGroupPage.addMeasureGroupButton).should('be.visible')
        cy.get(MeasureGroupPage.addMeasureGroupButton).click()

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Patient16To23')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.enabled')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

        //Navigate to Test Cases page and add Test Case details
        TestCasesPage.createQDMTestCase(testCaseTitle, testCaseDescription, testCaseSeries)

        TestCasesPage.clickEditforCreatedTestCase()

        //Add Demographics
        cy.get(TestCasesPage.QDMDob).type('01/01/2020')

        //Add Expected/Actual value to first Population criteria
        cy.get(TestCasesPage.expectedOrActualTab).click()
        cy.get(TestCasesPage.testCaseIPPExpected).eq(0).click()
        //save dob value
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click().wait(3000)

        //Click on Execute Test Case button on Edit Test Case page
        cy.get(EditMeasurePage.testCasesTab).should('exist')
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).wait(7000).click()
        cy.get(TestCasesPage.executeTestCaseButton).should('exist')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).focus()
        cy.get(TestCasesPage.executeTestCaseButton).invoke('click')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Fail')

        //Check Test Execution for second Population criteria
        cy.get('[class="MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-151p887"]').click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')
    })
})

describe('Run / Execute Test Case by Non Measure Owner', () => {

    beforeEach('Create Measure, Measure group and Test case', () => {

        CqlLibraryName = 'QDMTestLibrary2' + Date.now()

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries)
    })

    afterEach('Logout and Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Non Measure owner should be able to Run/Execute Test case', () => {

        OktaLogin.Login()
        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()

        //Add Demographics
        cy.get(TestCasesPage.QDMDob).type('01/01/2020')

        //save dob value
        cy.get(TestCasesPage.QDMTCSaveBtn).should('be.enabled')
        cy.get(TestCasesPage.QDMTCSaveBtn).click()

        OktaLogin.Logout()

        //Login as ALT User
        OktaLogin.AltLogin()

        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()

        cy.get(TestCasesPage.executeTestCaseButton).click()
        cy.get(TestCasesPage.testCaseStatus).should('contain.text', 'Pass')

        TestCasesPage.clickEditforCreatedTestCase()

        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled').wait(1000)
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()
        cy.get('[class="toast success"]').should('contain.text', 'Calculation was successful, output is printed in the console')

    })
})

