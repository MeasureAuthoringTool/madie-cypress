import { OktaLogin } from "../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { TestCasesPage } from "../../../../Shared/TestCasesPage"
import { TestCaseJson } from "../../../../Shared/TestCaseJson"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { Header } from "../../../../Shared/Header"

let measureName = 'TestMeasure' + Date.now()
let filePath = 'cypress/fixtures/measureId'
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let measureCQL = MeasureCQL.QDMTestCaseCQLFullElementSection
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()
let measureScoring = 'Cohort'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let measureCQLPFTests = MeasureCQL.CQL_Populations
let measureCQLWithMOAndStrat = 'library MedianAdmitDecisionTimetoEDDepartureTimeforAdmittedPatients version \'11.1.000\'\n' +
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
    '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
    '      where AdmitOrder.authorDatetime during LastEDVisit.relevantPeriod\n' +
    '        and AdmitOrder.authorDatetime before or on "EDDepartureTime"(LastEDVisit)\n' +
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
    '      let LastEDVisit: "LastEDEncounter"(EncounterInpatient)\n' +
    '      where EDEvaluation.result in "Admit Inpatient"\n' +
    '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts during LastEDVisit.relevantPeriod\n' +
    '        and Global."NormalizeInterval"(EDEvaluation.relevantDatetime, EDEvaluation.relevantPeriod)starts before or on "EDDepartureTime"(LastEDVisit)\n' +
    '      sort by start of Global."NormalizeInterval"(relevantDatetime, relevantPeriod)\n' +
    '  )'

const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder')
const { deleteDownloadsFolderBeforeEach } = require('cypress-delete-downloads-folder')

// "qiCoreBonnieTestCases": false
describe('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)

        OktaLogin.Login()
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.bonnieImportTestCaseBtn, 35000)


    })
})

// "qdmExport": true
describe('QDM Measure Export: Export option is available', () => {

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, false, measureCQL)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population', 'boolean')
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })


    it('QDM Measure Export: Export option for measure is available', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
            cy.get('[data-testid="view-measure-' + fileContents + '"]').should('be.visible')
            cy.get('[data-testid="export-measure-' + fileContents + '"]').should('exist')

            cy.reload()
            Utilities.waitForElementVisible(Header.userProfileSelect, 60000)
        })

    })
})

// "qiCoreElementsTab": false
describe('QI Core: Elements tab is not present', () => {

    before('Create Measure', () => {

        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('QI Core Test Case edit page: Ensure / verify that the Elements tab does not exist on the QI Core Test Case edit page', () => {

        cy.get(Header.measures).click()
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.testCaseAction('edit')

        //Elements tab should not be visible
        Utilities.waitForElementToNotExist(TestCasesPage.elementsTab, 20000)
    })
})

//"disableRunTestCaseWithObservStrat" : false
describe('Run QDM Test cases with Observation and Stratification', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = measureName + randValue
    let newCQLLibraryName = CqlLibraryName + randValue

    before('Create New Measure, Measure group, Test case  and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(newMeasureName, newCQLLibraryName, measureCQLWithMOAndStrat, false, false,
            '2025-01-01', '2025-12-31')
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)

        OktaLogin.Login()

    })

    after('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)

    })

    it('Able to run QDM Test cases with Observation and Stratification', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
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
        Utilities.dropdownSelect(MeasureGroupPage.qdmScoring, MeasureGroupPage.qdmScoringCV)
        cy.get(MeasureGroupPage.qdmScoring).should('contain.text', 'Continuous Variable')

        //Update the Patient Basis to 'No'
        cy.get(MeasureGroupPage.qdmPatientBasis).eq(1).click()

        //click on the save button and confirm save success message Base Config
        cy.get(MeasureGroupPage.qdmBCSaveButton).click()
        Utilities.waitForElementVisible(MeasureGroupPage.qdmBCSaveButtonSuccessMsg, 30000)
        cy.get(MeasureGroupPage.qdmBCSaveButtonSuccessMsg).should('contain.text', 'Measure Base Configuration ' +
            'Updated Successfully')

        //add pop criteria
        cy.get(MeasureGroupPage.QDMPopulationCriteria1).click()

        cy.get(MeasureGroupPage.initialPopulationSelect).should('be.visible')

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'Initial Population')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'Measure Population')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationExclusionSelect, 'Measure Population Exclusions')
        Utilities.dropdownSelect(MeasureGroupPage.measureObservationPopSelect, 'MeasureObservation')
        Utilities.dropdownSelect(MeasureGroupPage.cvAggregateFunction, 'Median')

        //Add Stratifications
        cy.get(MeasureGroupPage.stratificationTab).click()
        cy.get(MeasureGroupPage.stratOne).click()
        cy.get('[data-value="Stratification 1"]').click()
        cy.get(MeasureGroupPage.stratTwo).click()
        cy.get('[data-value="Stratification 2"]').click()

        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()
        cy.get(MeasureGroupPage.successfulSaveMsg).should('contain.text', 'Population details for ' +
            'this group saved successfully.')

        //Navigate to test case list page
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Execute Test cases on Edit Test case page
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('exist')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).focus()
        cy.get(TestCasesPage.runQDMTestCaseBtn).invoke('click')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()
    })
})

//"qdmHighlightingTabs" : true
describe('QDM Test case Highlighting tab: Should show pass/Fail Highlighting', () => {
    let randValue = (Math.floor((Math.random() * 2000) + 3))
    let newMeasureName = measureName + randValue
    let newCQLLibraryName = cqlLibraryName + randValue + 2

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCQLLibraryName, measureScoring, false, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')
        OktaLogin.UILogout()
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        //create test case
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Log out and Clean up', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCQLLibraryName)
    })

    it('QDM Test case Highlighting tab: Should show pass/Fail Highlighting', () => {

        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

        TestCasesPage.clickEditforCreatedTestCase()
        //navigate to the highlighting sub tab
        cy.get(TestCasesPage.tcHighlightingTab).should('exist')
        cy.get(TestCasesPage.tcHighlightingTab).should('be.visible')
        cy.get(TestCasesPage.tcHighlightingTab).click()

        //run test case
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.visible')
        cy.get(TestCasesPage.runQDMTestCaseBtn).should('be.enabled')
        cy.get(TestCasesPage.runQDMTestCaseBtn).click()

        cy.get(TestCasesPage.tcGroupCoverageHighlighting).contains('Definitions').click()

        Utilities.waitForElementVisible(':nth-child(3) > :nth-child(1) > pre', 35000)
        cy.get(':nth-child(3) > :nth-child(1) > pre').should('contain.text', 'define "Inpatient Encounters":\n' +
            '  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n' +
            '    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n' +
            '      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n' +
            '      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n' +
            '        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n' +
            '        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65')
    })
})

//"qdmMeasureReferences" : true
describe('QDM: Measure Reference Should exist', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    beforeEach('Create Measure, add Cohort group and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Measure Reference button should exist', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.leftPanelReference).should('be.visible')

    })
})

//"qdmMeasureDefinitions" : true
describe('QDM: Measure Definition (Terms) Should exist', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    beforeEach('Create Measure, add Cohort group and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Measure Definition (Terms) button should exist', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.leftPanelDefinition).should('be.visible')

    })
})

//"enableQdmRepeatTransfer" : true
describe('QDM: Measure Version option Should not exist', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    beforeEach('Create Measure, add Cohort group and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure Version option should not exist for QDM Draft Measures', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.enabled')
            cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
            cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('not.exist')
        })
        cy.reload()
        Utilities.waitForElementVisible(Header.userProfileSelect, 60000)
    })
})

//"generateCMSID": true
describe('QDM: Generate CMS ID', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('CMS Id generation for QDM Measure', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.generateCmsIdButton).click()
        cy.get(EditMeasurePage.cmsIdInput).should('exist')

    })
})

//"includeSDEValues": true
describe('QDM: Configuration sub tab', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', false, measureCQL)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.wait(3000)
        OktaLogin.UILogout()
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie().wait(3000)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie().wait(3000)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Configuration sub tab should be displayed on QDM Test Case list page', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        Utilities.waitForElementVisible(TestCasesPage.newTestCaseButton, 60000)
        cy.get(TestCasesPage.configurationSubTab).should('be.visible')

    })
})

//"manifestExpansion": false
describe('QDM: Expansion Manifest sub-tab / section is not available when flag is set to false', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('"Expansion" is not an available side sub-tab option, on the Test Case list page', () => {
        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.qdmExpansionSubTab).should('not.exist')
    })
})

//"TestCaseExport" : false
describe('QDM: Test Case QRDA Export', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QRDA Test case Export button not visible when the feature flag is enabled', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(TestCasesPage.testcaseQRDAExportBtn).should('not.exist')
    })
})

//"QDMCodeSearch": false
describe('QDM: Code search on CQL editor tab', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    after('Logout and cleanup', () => {

        OktaLogin.UILogout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Code search page not visible when the feature flag is enabled', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get('[data-testid="codes-tab"]').should('not.exist')
    })
})