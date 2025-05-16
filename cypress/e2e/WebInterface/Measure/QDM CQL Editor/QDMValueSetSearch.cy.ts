import { CreateMeasurePage, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let firstTestCaseTitle = 'PDxNotPsych60MinsDepart'
let testCaseDescription = 'IPPStrat1Pass' + Date.now()
let testCaseSeries = 'SBTestSeries'
let secondTestCaseTitle = 'Order50AndPriorityAssessment180'
let measureCQL = 'library MedianAdmitDecisionTimetoEDDepartureTimeforAdmittedPatients version \'11.1.000\'\n' +
    '\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'include MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n' +
    '\n' +
    'valueset "Admit Inpatient": \'urn:oid:2.16.840.1.113762.1.4.1111.164\' \n' +
    'valueset "Decision to Admit to Hospital Inpatient": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.295\' \n' +
    'valueset "Emergency Department Evaluation": \'urn:oid:2.16.840.1.113762.1.4.1111.163\' \n' +
    'valueset "Emergency Department Visit": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.292\' \n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\' \n' +
    'valueset "Hospital Settings": \'urn:oid:2.16.840.1.113762.1.4.1111.126\' \n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\' \n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\' \n' +
    'valueset "Psychiatric/Mental Health Diagnosis": \'urn:oid:2.16.840.1.113883.3.117.1.7.1.299\' \n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\' \n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    '\n' +
    'context Patient\n' +
    '\n' +
    'define "Initial Population":\n' +
    '  "ED Encounter with Decision to Admit"\n' +
    '\n' +
    'define "Measure Population":\n' +
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
    'define "Stratification 2":\n' +
    '  /*Patient encounters with a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    where exists ( EncounterInpatient.diagnoses Diagnosis\n' +
    '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
    '          and Diagnosis.rank = 1\n' +
    '    )\n' +
    '\n' +
    'define "Stratification 1":\n' +
    '  /*Patient encounters without a principal diagnosis (rank=1) of "Psychiatric/Mental Health Diagnosis"*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    where not exists ( EncounterInpatient.diagnoses Diagnosis\n' +
    '        where Diagnosis.code in "Psychiatric/Mental Health Diagnosis"\n' +
    '          and Diagnosis.rank = 1\n' +
    '    )\n' +
    '\n' +
    'define "Measure Population Exclusions":\n' +
    '  /*Exclude the most recent ED encounter (LastEDVisit) that occurred within an hour of the inpatient admission with ED admission source in "Hospital Setting" (any different facility- by location or CCN )*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    where "LastEDEncounter"(EncounterInpatient).admissionSource in "Hospital Settings"\n' +
    '\n' +
    'define "ED Encounter with Decision to Admit":\n' +
    '  /*Constrains the inpatient encounter to having an ED visit with a decision to admit (assessment or order) to inpatient and ED facility location period is not null*/\n' +
    '  Global."Inpatient Encounter" EncounterInpatient\n' +
    '    let LastEDVisit: LastEDEncounter(EncounterInpatient),\n' +
    '    AdmitAssessment: "AdmitDecisionUsingAssessment"(EncounterInpatient)\n' +
    '    where ( Global."NormalizeInterval" ( AdmitAssessment.relevantDatetime, AdmitAssessment.relevantPeriod ) starts during LastEDVisit.relevantPeriod\n' +
    '        or ( "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime during LastEDVisit.relevantPeriod )\n' +
    '    )\n' +
    '      and exists ( LastEDVisit.facilityLocations Location\n' +
    '          where Location.code in "Emergency Department Visit"\n' +
    '            and Global."HasEnd" ( Location.locationPeriod )\n' +
    '      )\n' +
    '\n' +
    'define function "EDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  Global."ED Encounter" EDVisit\n' +
    '    where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
    '    sort by \n' +
    '    end of relevantPeriod ascending\n' +
    '\n' +
    'define function "LastEDEncounter"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*The most recent (last) ED encounter that is within an hour of an inpatient encounter*/\n' +
    '  Last(Global."ED Encounter" EDVisit\n' +
    '      where EDVisit.relevantPeriod ends 1 hour or less before or on start of EncounterInpatient.relevantPeriod\n' +
    '      sort by \n' +
    '      end of relevantPeriod ascending\n' +
    '  )\n' +
    '\n' +
    'define function "EDDepartureTime"(Encounter "Encounter, Performed" ):\n' +
    '  /*The time the patient physically departed the Emergency Department*/\n' +
    '  Last(Encounter.facilityLocations Location\n' +
    '      where Location.code in "Emergency Department Visit"\n' +
    '        and Global."HasEnd"(Location.locationPeriod)\n' +
    '      return \n' +
    '      end of Location.locationPeriod\n' +
    '      sort ascending\n' +
    '  )\n' +
    '\n' +
    'define function "AdmitDecisionUsingEncounterOrder"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*Captures the decision to admit order and time that occurred during the last ED visit*/\n' +
    '  Last(["Encounter, Order": "Decision to Admit to Hospital Inpatient"] AdmitOrder\n' +
    '      let LastED: "LastEDEncounter"(EncounterInpatient)\n' +
    '      where AdmitOrder.authorDatetime during LastED.relevantPeriod\n' +
    '        and AdmitOrder.authorDatetime before or on "EDDepartureTime"(LastED)\n' +
    '      sort by authorDatetime\n' +
    '  )\n' +
    '\n' +
    'define function "MeasureObservation"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*The duration from the Decision to Admit (order or assessment) to the departure from the Emergency Department*/\n' +
    '  duration in minutes of Interval[Coalesce(start of Global."NormalizeInterval"("AdmitDecisionUsingAssessment"(EncounterInpatient).relevantDatetime, "AdmitDecisionUsingAssessment"(EncounterInpatient).relevantPeriod), "AdmitDecisionUsingEncounterOrder"(EncounterInpatient).authorDatetime), "EDDepartureTime"("LastEDEncounter"(EncounterInpatient))]\n' +
    '\n' +
    'define function "AdmitDecisionUsingAssessment"(EncounterInpatient "Encounter, Performed" ):\n' +
    '  /*Captures the decision to admit assessment, time, and result that was performed during the last ED visit*/\n' +
    '  Last(["Assessment, Performed": "Emergency Department Evaluation"] EDEvaluation\n' +
    '      let LastED: "LastEDEncounter"(EncounterInpatient)\n' +
    '      where EDEvaluation.result in "Admit Inpatient"\n' +
    '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts during LastED.relevantPeriod\n' +
    '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts before or on "EDDepartureTime"(LastED)\n' +
    '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
    '  )'

const measureData: CreateMeasureOptions = {}

describe('QDM Value Set Search fields, filter and apply the filter to CQL', () => {

    beforeEach('Create Measure', () => {

        measureData.ecqmTitle = measureName
        measureData.cqlLibraryName = CqlLibraryName
        measureData.measureScoring = 'Proportion'
        measureData.patientBasis = 'false'
        measureData.measureCql = measureCQL
        measureData.mpStartDate = '2025-01-01'
        measureData.mpEndDate = '2025-12-31'

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Measure Population', '', 'Measure Population Exclusions')

        TestCasesPage.CreateQDMTestCaseAPI(firstTestCaseTitle, testCaseSeries, testCaseDescription)
        TestCasesPage.CreateQDMTestCaseAPI(secondTestCaseTitle, testCaseSeries, testCaseDescription, null, true)

        OktaLogin.Login()
    })

    afterEach('Clean up', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })

    it('Search, filter and apply Value Set to CQL', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Value Set tab
        cy.get(CQLEditorPage.valueSetsTab).click()

        //Search for the Value Set
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.464.1003.101.12.1001')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatusOffice VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001ACTIVE•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••' +
            'Office VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001RETIRED•••')

        //click on the filter tab to access filter field(s)
        cy.get(CQLEditorPage.valueSetSearchFilterSubTab).click()

        //enter / select filter type
        cy.get(CQLEditorPage.valueSetSearchFilterDropDown).type('Status')
        cy.get(CQLEditorPage.valueSetSearchFilterListBox).contains('Status').click()
        cy.get(CQLEditorPage.valueSetSearchFilterInput).type('Active')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchFilterApplyBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchFilterApplyBtn).click()

        //results grid is updated to only show one entry, now, after filter
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatusOffice VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001ACTIVE•••')

        //Apply Value Set to the Measure
        cy.get(CQLEditorPage.applyValueSet).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Value Set Office Visit has been successfully added to the CQL.')

        //Save and Discard changes button should be enabled after applying the Value Set
        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        CQLEditorPage.validateSuccessfulCQLUpdate()
    })

    it('Verify that Definition Version is disabled until OID/URL field is selected', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Verify that the Search Definition Version field is disabled before selecting OID/URL field
        cy.get(CQLEditorPage.valueSetsTab).click()
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('Definition Version')
        cy.get('#search-by-category-option-0').should('not.be.enabled')
        cy.get('#search-by-category-option-0').trigger('mouseover').invoke('show')
        cy.contains('OID/URL must be selected first')
        cy.get(CQLEditorPage.valueSetSearchDefinitionVersion).should('not.exist')

        //Verify that the Search Definition Version field is enabled after selecting OID/URL field
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).clear().type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.464.1003.101.12.1001')
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).click()
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('Definition Version').click()
        cy.get(CQLEditorPage.valueSetSearchDefinitionVersion).should('exist')

        //Enter value in to Search Definition Version field
        cy.get(CQLEditorPage.valueSetSearchDefinitionVersion).type('20180310')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatusOffice VisitNCQA PHEMURurn:oid:2.16.840.1.113883.3.464.1003.101.12.1001ACTIVE•••')
    })

    it('Value set Details screen', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Value Set tab
        cy.get(CQLEditorPage.valueSetsTab).click()

        //Search for the Value Set
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.1444.3.217')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatus' +
            'Cancer Stage IAmerican Society of Clinical Oncology Stewardurn:oid:2.16.840.1.113883.3.1444.3.217ACTIVE' +
            '•••')

        //click on the filter tab to access filter field(s)
        cy.get(CQLEditorPage.valueSetSearchFilterSubTab).click()

        //Click on Value Set Details
        cy.get(CQLEditorPage.valueSetActionCentreBtn).click()
        cy.get(CQLEditorPage.viewValueSetDetails).click()

        cy.get(CQLEditorPage.valueSetDetailsScreen).should('contain.text', '"url": "http://cts.nlm.nih.gov' +
            '/fhir/ValueSet/2.16.840.1.113883.3.1444.3.217"')
        cy.get(CQLEditorPage.valueSetDetailsScreen).should('contain.text', '"name": "American Society of Clinical Oncology Author"')
    })

    it('Edit Value Set with suffix and apply to CQL', () => {

        //Click on Edit Button
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Value Set tab
        cy.get(CQLEditorPage.valueSetsTab).click()

        //Search for the Value Set
        cy.get(CQLEditorPage.valueSetSearchCategoryDropDOwn).type('OID/URL')
        cy.get(CQLEditorPage.valueSetSearchCategoryListBox).contains('OID/URL').click()
        cy.get(CQLEditorPage.valueSetSearchOIDURLText).type('2.16.840.1.113883.3.1444.3.217')
        Utilities.waitForElementEnabled(CQLEditorPage.valueSetSearchSrchBtn, 30000)
        cy.get(CQLEditorPage.valueSetSearchSrchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.valueSetSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.valueSetSearchResultsTbl).should('contain.text', 'TitleStewardOIDStatus' +
            'Cancer Stage IAmerican Society of Clinical Oncology Stewardurn:oid:2.16.840.1.113883.3.1444.3.217ACTIVE' +
            '•••')

        //click on the filter tab to access filter field(s)
        cy.get(CQLEditorPage.valueSetSearchFilterSubTab).click()

        //Click on Edit Value Set
        cy.get(CQLEditorPage.valueSetActionCentreBtn).click()
        cy.get(CQLEditorPage.editValueSet).click()

        //Add suffix
        cy.get(CQLEditorPage.valueSetSuffixInput).type('1234')
        cy.get(CQLEditorPage.applyValueSetSuffix).click()
        cy.get(EditMeasurePage.successMessage).should('contain.text', 'Value Set Cancer Stage I (1234) has been successfully added to the CQL.')

        //Save and Discard changes button should be enabled after applying the Value Set
        cy.get(CQLEditorPage.saveCQLButton).should('be.enabled')
        cy.get(EditMeasurePage.cqlEditorDiscardButton).should('be.enabled')

        //Save CQL
        cy.get(CQLEditorPage.saveCQLButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()
    })
})
