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

let measureName = 'TestMeasure' + Date.now()
let filePath = 'cypress/fixtures/measureId'
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'test case title'
let testCaseDescription = 'DENOMFail' + Date.now()
let measureCQL = MeasureCQL.QDMTestCaseCQLFullElementSection
let testCaseSeries = 'SBTestSeries'
let measureCQLAlt = MeasureCQL.ICFCleanTestQICore
let cqlLibraryName = 'TestLibrary' + Date.now()
let QDMmeasureCQL = MeasureCQL.simpleQDM_CQL
let measureScoring = 'Cohort'
let secondTestCaseTitle = 'Failing Test Case'
let secondTestCaseDescription = 'DENOMFail' + Date.now()
let secondTestCaseSeries = 'SBTestSeriesF'
let validTestCaseJsonLizzy = TestCaseJson.TestCaseJson_Valid
let validTestCaseJsonBobby = TestCaseJson.TestCaseJson_Valid_not_Lizzy_Health
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

// "exportQiCoreBundleType": true
describe('QI Core Test Cases: Ensure / verify that Export QI-Core Bundle type dropdown is present', () => {

    beforeEach('Create measure and login', () => {
        CqlLibraryName = 'TestLibrary6' + Date.now()

        //Create QI Core Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('QI Core Test Cases: Verify that Export QI-Core Bundle type dropdown is present', () => {

        MeasuresPage.measureAction("edit")

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the highlighting tab is present
        Utilities.waitForElementVisible(TestCasesPage.exportTestCasesBtn, 35000)
        Utilities.waitForElementEnabled(TestCasesPage.exportTestCasesBtn, 35000)

        //confirm that the PC sub tab / selector is not present
        Utilities.waitForElementVisible(('[class="export-chevron-container"]'), 35000)
        cy.get('[class="export-chevron-container"]').click({ force: true })
        cy.get('[data-testid=export-transaction-bundle]').should('be.visible')
        cy.get('[data-testid="export-collection-bundle"]').should('be.visible')

    })
})

// "importTestCases": false
describe('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {

    deleteDownloadsFolderBeforeAll()
    deleteDownloadsFolderBeforeEach()

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CqlLibraryName = 'TestLibrary5' + Date.now()

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests, false)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial PopulationOne', 'boolean')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription, validTestCaseJsonLizzy)
        TestCasesPage.CreateTestCaseAPI(secondTestCaseTitle, secondTestCaseSeries, secondTestCaseDescription, validTestCaseJsonBobby, false, true)


        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()
        OktaLogin.Login()

    })

    afterEach('Logout and Clean up Measures', () => {
        OktaLogin.Logout()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Test Case Import button - BONNIE: verify that the BONNIE import button is not available', () => {
        OktaLogin.Login()

        MeasuresPage.measureAction("edit")

        //Navigate to Test Case page
        cy.get(EditMeasurePage.testCasesTab).click()

        //confirm that the import button is disabled / not available
        Utilities.waitForElementToNotExist(TestCasesPage.bonnieImportTestCaseBtn, 35000)


    })

})

// "qdmExport": false
describe('QDM Measure Export: Export option is not available', () => {

    deleteDownloadsFolderBeforeAll()

    before('Create New Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureName, CqlLibraryName, measureScoring, false, measureCQL)
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population',
            'boolean')
        OktaLogin.Login()

    })

    it('QDM Measure Export: Export option for measure is not available', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled').wait(10000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
            Utilities.waitForElementToNotExist('[data-testid=export-measure-' + fileContents + ']', 105000)
        })
        cy.reload()
        OktaLogin.Login()
        MeasuresPage.measureAction('version')

        cy.get(MeasuresPage.measureVersionTypeDropdown).click()
        cy.get(MeasuresPage.measureVersionMajor).click()
        cy.get(MeasuresPage.confirmMeasureVersionNumber).type('1.0.000')

        cy.get(MeasuresPage.measureVersionContinueBtn).should('exist')
        cy.get(MeasuresPage.measureVersionContinueBtn).should('be.visible')
        cy.get(MeasuresPage.measureVersionContinueBtn).click()
        cy.get(MeasuresPage.measureVersionSuccessMsg).should('contain.text', 'New version of measure is Successfully created')

        MeasuresPage.validateVersionNumber(measureName, '1.0.000')
        cy.log('Version Created Successfully')

        //MeasuresPage.measureAction('export')

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 100000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled').wait(10000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()
            cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
            Utilities.waitForElementToNotExist('[data-testid=export-measure-' + fileContents + ']', 105000)
        })

        OktaLogin.Logout()
    })
})

// "qiCoreElementsTab": false
describe('QI Core: Elements tab is not present', () => {

    before('Create Measure', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

        measureName = 'TestMeasure' + Date.now()
        cqlLibraryName = 'TestCql' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, cqlLibraryName, measureCQLAlt)
        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.Logout()

    })

    beforeEach('Set Access Token', () => {

        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setAccessTokenCookie()

    })

    after('Clean up', () => {

        Utilities.deleteMeasure(measureName, cqlLibraryName)

    })

    it('QI Core Test Case edit page: Ensure / verify that the Elements tab does not exist on the QI Core Test Case edit page', () => {

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.testCasesTab).click()

        //Create test case
        cy.get(TestCasesPage.newTestCaseButton).scrollIntoView()
        cy.get(TestCasesPage.newTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.newTestCaseButton).should('be.enabled')
        cy.get(TestCasesPage.newTestCaseButton).click({ force: true })

        cy.get(TestCasesPage.createTestCaseDialog).should('exist')
        cy.get(TestCasesPage.createTestCaseDialog).should('be.visible')

        cy.get(TestCasesPage.createTestCaseTitleInput).should('exist').wait(500)
        Utilities.waitForElementVisible(TestCasesPage.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(TestCasesPage.createTestCaseTitleInput, 30000)
        cy.get(TestCasesPage.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('exist')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(TestCasesPage.createTestCaseDescriptionInput).focus()
        cy.get(TestCasesPage.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(TestCasesPage.createTestCaseGroupInput).should('exist')
        cy.get(TestCasesPage.createTestCaseGroupInput).should('be.visible')
        cy.get(TestCasesPage.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        TestCasesPage.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        TestCasesPage.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        TestCasesPage.testCaseAction('edit')

        //add json value to measure's test case
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

    after('Clean up', () => {

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
        OktaLogin.Logout()
        //create Measure Group
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')
        //create test case
        TestCasesPage.CreateQDMTestCaseAPI(testCaseTitle, testCaseSeries, testCaseDescription)
        OktaLogin.Login()
    })

    after('Clean up', () => {

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

//"qdmMeasureReferences" : false
describe('QDM: Measure Reference Should not exist', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    beforeEach('Create Measure, add Cohort group and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Measure Reference button should not exist', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.leftPanelReference).should('not.exist')

    })
})

//"qdmMeasureDefinitions" : true
describe('QDM: Measure Definition (Terms) Should not exist', () => {

    let randValue = (Math.floor((Math.random() * 1000) + 1))
    let newMeasureName = 'TestMeasure' + Date.now() + randValue
    let newCqlLibraryName = 'MeasureTypeTestLibrary' + Date.now() + randValue

    beforeEach('Create Measure, add Cohort group and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', true, measureCQL)
        OktaLogin.Login()

    })

    afterEach('Logout and cleanup', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('QDM Measure Definition (Terms) button should not exist', () => {

        MeasuresPage.measureAction('edit')
        cy.get(EditMeasurePage.leftPanelDefinition).click()
        cy.get(EditMeasurePage.addDefinitionButton).should('be.enabled')

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

        OktaLogin.Logout()
        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)

    })

    it('Measure Version option should not exist for QDM Draft Measures', () => {

        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="measure-action-' + fileContents + '"]', 100000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').should('be.enabled').wait(10000)
            cy.get('[data-testid="measure-action-' + fileContents + '"]').click()
            cy.get('[data-testid="create-version-measure-' + fileContents + '"]').should('not.exist')
        })

    })
})
