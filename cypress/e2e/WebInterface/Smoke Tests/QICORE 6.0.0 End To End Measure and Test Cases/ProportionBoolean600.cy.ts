import { OktaLogin } from "../../../../Shared/OktaLogin"
import {CreateMeasureOptions, CreateMeasurePage, SupportedModels} from "../../../../Shared/CreateMeasurePage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"

const path = require('path')

let measureName = 'ProportionBoolean600' + Date.now()
let CqlLibraryName = 'ProportionBoolean600' + Date.now()
let measureCQL = 'library ChildrenWhoHaveDentalDecayOrCavitiesFHIR version \'0.0.002\'\n' +
    '\n' +
    'using QICore version \'6.0.0\'\n' +
    '\n' +
    'include QICoreCommon version \'3.0.000\' called QICoreCommon\n' +
    'include FHIRHelpers version \'4.4.000\' called FHIRHelpers\n' +
    'include SupplementalDataElements version \'4.1.000\' called SDE\n' +
    'include Hospice version \'7.0.000\' called Hospice\n' +
    'include Status version \'2.0.000\' called Status\n' +
    ' \n' +
    'codesystem "LOINC": \'http://loinc.org\' \n' +
    'codesystem "SNOMEDCT": \'http://snomed.info/sct\' \n' +
    '\n' +
    'valueset "Clinical Oral Evaluation": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.125.12.1003\' \n' +
    'valueset "Dental Caries": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.125.12.1004\' \n' +
    'valueset "Discharged to Health Care Facility for Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.207\' \n' +
    'valueset "Discharged to Home for Hospice Care": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.209\' \n' +
    'valueset "Encounter Inpatient": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.307\' \n' +
    '\n' +
    'code "Discharge to healthcare facility for hospice care (procedure)": \'428371000124100\' from "SNOMEDCT" display \'Discharge to healthcare facility for hospice care (procedure)\'\n' +
    'code "Discharge to home for hospice care (procedure)": \'428361000124107\' from "SNOMEDCT" display \'Discharge to home for hospice care (procedure)\'\n' +
    'code "Hospice care [Minimum Data Set]": \'45755-6\' from "LOINC" display \'Hospice care [Minimum Data Set]\'\n' +
    'code "Yes (qualifier value)": \'373066001\' from "SNOMEDCT" display \'Yes (qualifier value)\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    '\n' +
    'define "Initial Population":\n' +
    '    AgeInYearsAt(date from start of "Measurement Period")in Interval[1, 20]\n' +
    '        and exists ( "Qualifying Encounters" )\n' +
    '         \n' +
    'define "Qualifying Encounters": \n' +
    '    (([Encounter: "Clinical Oral Evaluation"]).isEncounterPerformed()) ValidEncounter\n' +
    '        where ValidEncounter.period.toInterval() during day of "Measurement Period"     \n' +
    '        \n' +
    'define "Denominator":\n' +
    '  "Initial Population"\n' +
    '  \n' +
    'define "Denominator Exclusions":\n' +
    '    Hospice."Has Hospice Services"\n' +
    '\n' +
    'define "Numerator":\n' +
    '   exists ["QICore Condition Problems Health Concerns": "Dental Caries"] DentalCaries\n' +
    '        where DentalCaries.prevalenceInterval() overlaps "Measurement Period"\n' +
    '\n' +
    'define "SDE Ethnicity":\n' +
    '  SDE."SDE Ethnicity"\n' +
    '\n' +
    'define "SDE Payer":\n' +
    '  SDE."SDE Payer"\n' +
    '\n' +
    'define "SDE Race":\n' +
    '  SDE."SDE Race"\n' +
    '\n' +
    'define "SDE Sex":\n' +
    '  SDE."SDE Sex"\n' +
    '  \n' +
    'define "SDE Eth": \n' +
    '  SDE."SDE Eth"'

describe('Measure Creation and Testing: Proportion Episode Measure', () => {

    before('Create Measure, Test Case and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6,
            { measureCql: measureCQL, mpStartDate: '2025-01-01', mpEndDate: '2025-12-31'})

        OktaLogin.Login()
    })

    after('Clean up', () => {

        OktaLogin.Logout()

        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('End to End Proportion Episode Measure, Pass Result', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{end} {enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        cy.get(MeasureGroupPage.popBasis).should('exist')
        cy.get(MeasureGroupPage.popBasis).should('be.visible')
        cy.get(MeasureGroupPage.popBasis).click()
        cy.get(MeasureGroupPage.popBasis).type('boolean')
        cy.get(MeasureGroupPage.popBasisOption).click()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, 'Proportion')
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'Denominator')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'Denominator Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'Numerator')

        cy.get(MeasureGroupPage.reportingTab).click()
        Utilities.dropdownSelect(MeasureGroupPage.improvementNotationSelect, 'Increased score indicates improvement')

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //click on the Import Test Cases button
        Utilities.waitForElementVisible(TestCasesPage.importNonBonnieTestCasesBtn, 65000)
        cy.get(TestCasesPage.importNonBonnieTestCasesBtn).click()

        //wait until select / drag and drop modal window appears
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportModal, 35000)

        //Upload valid Json file via drag and drop
        cy.get(TestCasesPage.testCasesNonBonnieFileImport).selectFile(path.join('cypress/fixtures', 'CMS75FHIR-v0.0.002-FHIR6-TestCases.zip'), { action: 'drag-drop', force: true })

        //verifies the section at the bottom of the modal, after file has been, successfully, dragged and dropped in modal
        Utilities.waitForElementVisible(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile, 35000)
        cy.get(TestCasesPage.testCasesNonBonnieFileImportFileLineAfterSelectingFile).should('contain.text', 'CMS75FHIR-v0.0.002-FHIR6-TestCases.zip')

        //import the tests cases from selected / dragged and dropped .zip file
        cy.get(TestCasesPage.importTestCaseBtnOnModal).click()

        Utilities.waitForElementVisible(TestCasesPage.executeTestCaseButton, 65000)
        cy.get(TestCasesPage.executeTestCaseButton).click()

        //verify Passing Tab's text
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('exist')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '100%')
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('contain.text', '(20/20)')

        //Verify Coverage percentage
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('exist')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('be.visible')
        cy.get(TestCasesPage.testCaseListCoveragePercTab).should('contain.text', '100%')

    })
})
