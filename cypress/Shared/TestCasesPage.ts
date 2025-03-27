import { EditMeasurePage } from "./EditMeasurePage"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"
import dateTimeISO = CypressCommandLine.dateTimeISO
import { CQLEditorPage } from "./CQLEditorPage"

export type TestCase = {
    title: string,
    description: string,
    group: string,
    json?: string
}

export enum TestCaseAction {
    clone,
    copyToMeasure,
    delete,
    exportCollection,
    exportTransaction,
    shiftDates
}

export class TestCasesPage {
    //observation fields
    public static readonly denom0Observation = '[id="denominatorObservation0-expected-cb"]'
    public static readonly denom1Observation = '[id="denominatorObservation1-expected-cb"]'
    public static readonly denom2Observation = '[id="denominatorObservation2-expected-cb"]'
    public static readonly numer0Observation = '[id="numeratorObservation0-expected-cb"]'
    public static readonly numer1Observation = '[id="numeratorObservation1-expected-cb"]'
    public static readonly numer2Observation = '[id="numeratorObservation2-expected-cb"]'

    //QDM Bread Crumb
    public static readonly testCasesBCLink = '[id="edit-test-case-bread-crumbs"]'
    public static readonly testCasesBCText = '[data-testid="qdm-test-cases-testcase"]'

    //QDM Shift Test Case dates
    public static readonly testCaseDataSideLink = '[data-testid="test-case-data"]'
    public static readonly shiftAllTestCaseDates = '[data-testid="shift-test-case-dates-input"]'
    public static readonly shftAllTestCasesSaveBtn = '[data-testid="test-case-data-save"]'
    public static readonly shiftAllTestCasesSuccessMsg = '[data-testid="shift-all-test-case-dates-success-text"]'
    public static readonly shiftSpecificTestCaseDates = '[data-testid="shift-dates-input"]'
    public static readonly shiftSpecificTestCasesCancelBtn = '[data-testid="shift-dates-cancel-button"]'
    public static readonly shiftSpecificTestCasesSaveBtn = '[data-testid="shift-dates-save-button"]'
    public static readonly TestCasesSuccessMsg = '[data-testid="test-case-list-success"]'
    public static readonly executionContextWarning = '[data-testid="execution_context_loading_warning"]'

    //QDM Test Case Demographics elements
    public static readonly QDMDob = '[data-testid="date-of-birth-input"]'
    public static readonly QDMLivingStatus = '[id="demographics-living-status-select-id"]'
    public static readonly QDMLivingStatusOPtion = '[data-value="Living"]'
    public static readonly QDMRace = '[id="demographics-race-select-id"]'

    // changed label to "sex" - only label text changed, all these selectors are the same 12/30/24
    public static readonly QDMGender = '[id="demographics-gender-select-id"]'
    public static readonly SelectionOptionChoice = '.MuiList-root'
    public static readonly QDMEthnicity = '[id="demographics-ethnicity-select-id"]'

    //QDM Test Case Demographics herlper text elements
    public static readonly QDMDOBHelperTxt = '[id="birth-date-helper-text"]'

    //QDM Test Case Elements elements / objects -- sub tabs sections
    public static readonly ElementsSubTabHeading = '[class="test-case-tab-heading"]'
    public static readonly AssessmentElementTab = '[data-testid="elements-tab-assessment"]'
    public static readonly CareGoalElementTab = '[data-testid="elements-tab-care_goal"]'
    public static readonly ConditionElementTab = '[data-testid="elements-tab-condition"]'
    public static readonly MedicationElementTab = '[data-testid="elements-tab-medication"]'
    public static readonly EncounterElementTab = '[data-testid="elements-tab-encounter"]'
    public static readonly CharacteristicElementTab = '[data-testid="elements-tab-patient_characteristic"]'
    public static readonly qdmTCElementTable = '[class="data-elements-table"]'

    //QDM Test Case Elements elements / objects -- Encounter
    public static readonly ExpandedOSSDetailCard = '[data-testid="data-element-card"]'
    public static readonly ExpandedOSSDetailCardClose = '[data-testid="close-element-card"]'
    public static readonly ExpandedOSSDetailCardTitle = '[class="title"]'
    public static readonly ExpandedOSSDetailCardTitleSubDetail = '[class="sub-text"]'
    public static readonly ExpandedOSSDetailCardTiming = '[class="timing"]'
    public static readonly ExpandedOSSDetailCardTabCodes = '[data-testid="sub-navigation-tab-codes"]'
    public static readonly ExpandedOSSDetailCardTabAttributes = '[data-testid="sub-navigation-tab-attributes"]'
    public static readonly EncounterEDVCard = '[data-testid="data-type-Encounter, Performed: Emergency Department Visit"]'
    public static readonly EncounterEICard = '[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]'
    public static readonly EncounterOSCard = '[data-testid="data-type-Encounter, Performed: Observation Services"]'

    //QDM Test Case Elements elements / objects -- Laboratory
    public static readonly locationPeriodStartDate = '[data-testid="location-period-start-input"]'
    public static readonly locationPeriodEndDate = '[data-testid="location-period-end-input"]'
    public static readonly relevantPeriodStartDate = '[data-testid="relevant-period-start-input"]'
    public static readonly relevantPeriodEndDate = '[data-testid="relevant-period-end-input"]'
    public static readonly authorDateTime = '[data-testid="author-datetime-input"]'
    public static readonly prevalencePeriodStartDate = '[data-testid="prevalence-period-start-input"]'
    public static readonly prevalencePeriodEndDate = '[data-testid="prevalence-period-end-input"]'

    //QDM Test Case Elements elements / objects -- Characteristic
    public static readonly CharacteristicMAPCard = '[data-testid="data-type-Patient Characteristic Payer: Medicare Advantage payer"]'
    public static readonly CharacteristicMFFSPCard = '[data-testid="data-type-Patient Characteristic Payer: Medicare FFS payer"]'

    //QDM misc test case page objects
    public static readonly editTestCaseDescriptionInlineError = '[data-testid="test-case-description-helper-text"]'
    public static readonly QDMTcDiscardChangesButton = '[data-testid="ds-btn"]'

    //SDE Sub tab
    public static readonly qdmSDESubTab = '[data-testid="sde-tab"]'
    public static readonly saveSDEOption = '[data-testid="sde-save"]'

    //Test case QRDA Export
    public static readonly testcaseQRDAExportBtn = '[data-testid="export-action-icon"]'
    public static readonly successMsg = '.toast'

    //TC error concerning CQL and PC mismatch
    public static readonly testCaseResultrow = '[data-testid="test-case-row-0"]'
    public static readonly testCaseResultrow2 = '[data-testid="test-case-row-1"]'

    //edit test case without knowing test case ID
    public static readonly actionBtnNoId = '[class="action-button"]'
    public static readonly btnContainer = '[class="btn-container"]'

    //tabs on the test case page
    public static readonly cqlHasErrorsMsg = '[data-testid="test-case-cql-has-errors-message"]'
    public static readonly detailsTab = '[data-testid="details-tab"]'
    public static readonly tctExpectedActualSubTab = '[data-testid="expectoractual-tab"]'

    //QDM Test Case
    public static readonly qdmExpansionRadioOptionGroup = '[data-testid="manifest-expansion-radio-buttons-group"]'
    public static readonly qdmExpansionSubTab = '[data-testid="nav-link-expansion"]'
    public static readonly qdmManifestSelectDropDownBox = '[id="manifest-select"]'
    public static readonly qdmMantifestMayFailTestOption = '[data-testid="manifest-option-ecqm-update-2022-05-05"]'
    public static readonly qdmManifestSaveBtn = '[data-testid="manifest-expansion-save-button"]'
    public static readonly qdmManifestSuccess = '[data-testid="manifest-expansion-success-text"]'

    //CQL area on Test Case page
    public static readonly tcCQLArea = '[data-testid="test-case-cql-editor"]'

    //misc test case page objects
    public static readonly tcColumnAscendingArrow = '[data-testid="KeyboardArrowUpIcon"]'
    public static readonly tcColumnDescendingArrow = '[data-testid="KeyboardArrowDownIcon"]'
    public static readonly tcColumnHeading = '[class="cursor-pointer select-none header-button"]'
    public static readonly tcGroupCoverageHighlighting = '[data-testid="group-coverage-nav-"]'
    public static readonly qdmTCHighlightingDU = '[data-testid="definitions-used-section"]'
    public static readonly tcIPHighlightingDetails = '[data-testid="IP-highlighting"]'
    public static readonly tcHLCollapseResultBtn = '[data-testid="ExpandLessIcon"]'
    public static readonly tcHLResultsSection = '[data-testid="results-section"]'
    public static readonly tcDENOMHighlightingDetails = '[data-testid="DENOM-highlighting"]'
    public static readonly tcNUMERHighlightingDetails = '[data-testid="NUMER-highlighting"]'
    public static readonly tcDEFINITIONSHighlightingDetails = '[data-testid="definitions-highlighting"]'
    public static readonly tcFUNCTIONSHighlightingDetails = '[data-testid="functions-highlighting"]'
    public static readonly tcUNUSEDHightlightingDetails = '[data-testid="unused-highlighting"]'
    public static readonly tcHighlightingTab = '[data-testid="highlighting-tab"]'
    public static readonly ippActualCheckBox = '[data-testid="test-population-initialPopulation-actual"]'
    public static readonly numActualCheckBox = '[data-testid="test-population-numerator-actual"]'
    public static readonly denomActualCheckBox = '[data-testid="test-population-denominator-actual"]'
    public static readonly denomExclusionActualCheckBox = '[data-testid="test-population-denominatorExclusion-actual"]'
    public static readonly newTestCaseButton = '[data-testid="create-new-test-case-button"]'
    public static readonly testCaseDescriptionTextBox = '[data-testid=test-case-description]'
    public static readonly meassureCQLVOTab = '[data-testid="measurecql-tab"]'
    public static readonly voTCCQLobject = '[id="ace-editor-wrapper"]'
    public static readonly voTCCQLEditor = '[class="ace_text-input"]'
    public static readonly testCaseSeriesTextBox = '[data-testid="test-case-series"] > .MuiOutlinedInput-root'
    public static readonly editTestCaseSaveButton = '[data-testid="edit-test-case-save-button"]'
    public static readonly errorToastMsg = '[data-testid="error-toast"]'
    public static readonly aceEditor = '[data-testid="test-case-json-editor"]'
    public static readonly aceEditorJsonInput = '[data-testid="test-case-json-editor-input"]'
    public static readonly testCaseTitle = '[data-testid="test-case-title"]'
    public static readonly executeTestCaseButton = '[data-testid="execute-test-cases-button"]'
    public static readonly tcSearchInput = '[data-testid="test-case-list-search-input"]'
    public static readonly tcTriggerSearch = '[data-testid="test-cases-trigger-search"]'
    public static readonly tcSearchIcone = '[data-testid="SearchIcon"]'
    public static readonly tcClearSearch = '[data-testid="test-cases-clear-search"]'
    public static readonly clearIconBtn = '[data-testid="ClearIcon"]'
    public static readonly tcFilterInput = '[data-testid="filter-by-select"]'
    public static readonly tcFilterByGroup = '[data-testid="filter-by-Group"]'
    public static readonly tcFilterByDeselect = '[data-testid="filter-by--"]'
    public static readonly testCaseStatus = '[class="MuiBox-root css-0"]'
    public static readonly qdmSDESidNavLink = '[data-testid="nav-link-sde"]'
    public static readonly createTestCaseTitleInlineError = '[data-testid="create-test-case-title-helper-text"]'
    public static readonly editTestCaseTitleInlineError = '[data-testid="test-case-title-helper-text"]'
    public static readonly testCaseJsonValidationErrorBtn = '[data-testid="show-json-validation-errors-button"]'
    public static readonly testCaseJsonValidationDisplayList = '[data-testid="json-validation-errors-list"]'
    public static readonly testCasePopulationList = '[data-testid="create-test-case-populations"]'
    public static readonly testCaseExecutionError = '[data-testid="execution_context_loading_errors"]'
    public static readonly runTestButton = '[data-testid="run-test-case-button"]'
    public static readonly runTestAlertMsg = '[data-testid="calculation-info-alert"]'
    public static readonly testCaseListPassingPercTab = '[data-testid="passing-tab"]'
    public static readonly testCaseListCoveragePercTab = '[data-testid="coverage-tab"]'
    public static readonly testCaseListCoverageHighlighting = '[data-testid="code-coverage-highlighting"]'
    public static readonly testCaseListTable = '[data-testid="test-case-tbl"]'
    public static readonly testCaseAction0Btn = '[data-testid="test-case-title-0_action"]'
    public static readonly tcPopulationCriteriaNavLink = '[data-testid="test-case-pop-criteria-nav"]'
    public static readonly tcCoverageTabIPpop = '[data-testid="Initial Population-population"]'
    public static readonly tcCoverageTabDenompop = '[data-testid="Denominator-population"]'
    public static readonly tcCoverageTabDenomExcludepop = '[data-testid="Denominator Exclusion-population"]'
    public static readonly tcCoverageTabNumpop = '[data-testid="Numerator-population"]'
    public static readonly tcCoverageTabUsedDef = '[data-testid="Definitions-definition"]'
    public static readonly tcCoverageTabFunctsDef = '[data-testid="Functions-definition"]'
    public static readonly tcCoverageTabUnusedDef = '[data-testid="Unused-definition"]'
    public static readonly tcCoverageSections = '[class="accordion-section"]'
    public static readonly tcCoverageContent = '[class="accordion-content"]'
    public static readonly testCaseCountByCaseNumber = '[data-testid*="_caseNumber"]'

    //Test Case Population Values
    public static readonly testCaseIPPExpected = '[data-testid="test-population-initialPopulation-expected"]'
    public static readonly testCaseNUMERExpected = '[data-testid="test-population-numerator-expected"]'
    public static readonly testCaseNUMEXExpected = '[data-testid="test-population-numeratorExclusion-expected"]'
    public static readonly testCaseDENOMExpected = '[data-testid="test-population-denominator-expected"]'
    public static readonly testCaseDENEXExpected = '[data-testid="test-population-denominatorExclusion-expected"]'
    public static readonly testCaseDENEXCEPTxpected = '[data-testid="test-population-denominatorException-expected"]'
    public static readonly testCaseMSRPOPLExpected = '[data-testid="test-population-measurePopulation-expected"]'
    public static readonly testCaseMSRPOPLEXExpected = '[data-testid="test-population-measurePopulationExclusion-expected"]'
    public static readonly testCasePopulationValuesTable = '[data-testid="test-case-population-list-tbl"]'
    public static readonly initialPopulationRow = '[data-testid="test-row-population-id-initialPopulation"]'
    public static readonly numeratorRow = '[data-testid="test-row-population-id-numerator"]'
    public static readonly numeratorExclusionRow = '[data-testid="test-row-population-id-numeratorExclusion"]'
    public static readonly denominatorRow = '[data-testid="test-row-population-id-denominator"]'
    public static readonly denominatorExclusionRow = '[data-testid="test-row-population-id-denominatorExclusion"]'
    public static readonly denominatorExceptionRow = '[data-testid="test-row-population-id-denominatorException"]'
    public static readonly measureObservationRow = '[data-testid="test-population-measurePopulationObservation-expected"]'
    public static readonly numeratorObservationRow = '[data-testid="test-population-numeratorObservation-expected"]'
    public static readonly measureGroup1Label = '[data-testid="measure-group-1"]'
    public static readonly measureGroup2Label = '[data-testid="measure-group-2"]'
    public static readonly denominatorObservationExpectedRow = '[data-testid="test-population-denominatorObservation-expected"]'

    //QDM Test Case Page
    public static readonly elementsTab = '[data-testid=elements-tab]'
    public static readonly jsonTab = '[data-testid=json-tab]'
    public static readonly runQDMTestCaseBtn = '[data-testid="qdm-test-case-run-button"]'

    //Test Case Page
    public static readonly dobSelectValueElementTab = '[class="MuiFormControl-root MuiTextField-root css-1uwaluo"]'
    public static readonly ethnicityDetailedElementTab = '[data-testid="demographics-ethnicity-detailed-input"]'
    public static readonly ethnicityOmbElementTab = '[id="demographics-ethnicity-omb-select-id"]'
    public static readonly raceDetailedElementTab = '[data-testid="demographics-race-detailed-input"]'
    public static readonly raceOmbselectBoxElementTab = '[id="raceOMB"]'
    public static readonly raceOmbElementTab = '[data-testid="demographics-race-omb"]'
    public static readonly genderDdOnElementTab = '[id="gender-selector"]'
    public static readonly genderSelectValuesElementTab = '[class="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9"]'
    public static readonly bonnieImportTestCaseBtn = '[data-testid="import-test-cases-from-bonnie-button"]'
    public static readonly highlightingPCTabSelector = '[data-testid="population-criterion-selector"]'
    public static readonly lastSavedDate = '[data-testid="test-case-title-0_lastModifiedAt"]'
    public static readonly testCaseNameDropdown = '#edit-test-case-bread-crumbs > .MuiInputBase-root > .MuiSelect-select'
    public static readonly testCaseListCheckBox = '.px-1 > input'

    //Stratifications
    public static readonly initialPopulationStratificationExpectedValue = '[data-testid="Strata 1-initialPopulation-expected"]'
    public static readonly measurePopulationStratificationExpectedValue = '[data-testid="Strata 1-measurePopulation-expected"]'
    public static readonly initialPopulationStrata2ExpectedValue = '[data-testid="Strata 2-initialPopulation-expected"]'
    public static readonly measurePopulationStrata2ExpectedValue = '[data-testid="Strata 2-measurePopulation-expected"]'

    //measure versioning attempt with invalid test case
    public static readonly versionMeasureWithTCErrors = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-1uop03p react-draggable"]'
    public static readonly versionMeasurewithTCErrorsCancel = '[data-testid="invalid-test-dialog-cancel-button"]'
    public static readonly versionMeasurewithTCErrorsContinue = '[data-testid="invalid-test-dialog-continue-button"]'

    //Test Case Expected/Actual Values
    public static readonly nonBooleanExpectedValueError = '[class="qpp-error-message"]'
    public static readonly measureObservationExpectedValueError = '[data-testid="measurePopulationObservation-error-helper-text"]'
    public static readonly denominatorObservationExpectedValueError = '[data-testid="denominatorObservation-error-helper-text"]'
    public static readonly numeratorObservationExpectedValueError = '[data-testid="numeratorObservation-error-helper-text"]'
    public static readonly cvMeasureObservationActualValue = '[data-testid="test-population-measurePopulationObservation-actual"]'
    public static readonly denominatorMeasureObservationActualValue = '[data-testid="test-population-denominatorObservation-actual"]'
    public static readonly numeratorMeasureObservationActualValue = '[data-testid="test-population-numeratorObservation-actual"]'
    public static readonly measureActualCheckbox = '[class="madie-check actual"]'

    //New Test Case Modal
    public static readonly createTestCaseDialog = '[data-testid="dialog-form"]'
    public static readonly createTestCaseTitleInput = '[data-testid="create-test-case-title-input"]'
    public static readonly createTestCaseDescriptionInput = '[data-testid="create-test-case-description"]'
    public static readonly createTestCaseGroupInput = '[id="test-case-series"]'
    public static readonly createTestCaseSaveButton = '[data-testid="create-test-case-save-button"]'

    //import test case
    public static readonly importTestCasesBtn = '[data-testid="import-test-cases-button"]'
    public static readonly qdmImportTestCasesBtn = '[data-testid="show-import-test-cases-button"]'

    public static readonly filAttachDropBox = '[data-testid="file-drop-input"]'
    public static readonly importInProgress = '[data-testid = "testcase-list-loading-spinner"]'
    public static readonly importWarningMessages = '[data-testid="import-warning-messages"]'

    //Warning Modal
    public static readonly discardChangesConfirmationBody = '[id="discard-changes-dialog-body"]'

    //Delete Test Case
    public static readonly deleteAllTestCasesBtn = '[data-testid=delete-all-test-cases-button]'

    //Import Test cases
    public static readonly importTestCaseBtnOnModal = '[data-testid="test-case-import-import-btn"]'
    public static readonly importTestCaseCancelBtnOnModal = '[data-testid="test-case-import-cancel-btn"]'
    public static readonly importTestCaseAlertMessage = '[class="madie-alert warning"]'
    public static readonly importTestCaseBtn = '[data-testid="import-test-case-btn"]'
    public static readonly testCaseFileImport = '[data-testid="import-file-input"]'
    public static readonly tcFileDrop = '[data-testid="file-drop-div"]'
    public static readonly tcImportButton = '[data-testid="select-file-button"]'
    public static readonly tcImportError = '[data-testid="test-case-import-error-div"]'
    public static readonly testCasesNonBonnieFileImportModal = '[data-testid="test-case-import-content-div"]'
    public static readonly testCasesNonBonnieFileImportFileLineAfterSelectingFile = '[data-testid="test-case-preview-header"]'
    public static readonly importTestCaseSuccessMsg = '[data-testid="success-toast"]'
    public static readonly importTestCaseSuccessInfo = '[id="content"]'

    //Export Test Cases
    public static readonly exportTestCasesBtn = '[data-testid="export-test-cases-button"]'
    public static readonly exportTransactionTypeOption = '[data-testid="export-transaction-bundle"]'
    public static readonly exportCollectionTypeOption = '[data-testid="export-collection-bundle"]'

    //QDM Test Case Elements Tab
    public static readonly QDMElementsTab = '[data-testid="elements-section"]'

    //QDM Test Case Attributes
    public static readonly laboratoryElement = '[data-testid="elements-tab-laboratory_test"]'
    public static readonly plusIcon = '[data-testid=AddCircleOutlineIcon]'
    public static readonly addAttribute = '[data-testid="add-attribute-button"]'
    public static readonly selectAttributeDropdown = '[id="attribute-select"]'
    public static readonly referenceRangeAttribute = '[data-testid="option-Reference Range"]'
    public static readonly interpretationAttribute = '[data-testid="option-Interpretation"]'
    public static readonly valueSetSelector = '[data-testid="value-set-selector"]'
    public static readonly ABEMBDiathesisValue = '[data-testid="option-2.16.840.1.113883.3.3157.4036"]'
    public static readonly attributeType = '[id="type-select"]'
    public static readonly attributeChip = 'tbody > tr > :nth-child(3)'
    public static readonly codeSystemSelector = '[id="code-system-selector"]'
    public static readonly codeSNOMEDCTValue = '[data-testid="option-SNOMEDCT"]'
    public static readonly codeLOINCValue = '[data-testid="code-system-option-LOINC"]'
    public static readonly codeSystemValueSelector = '[data-testid="code-selector"]'
    public static readonly codeSystemOptionValue = '[data-testid="option-112648003"]'
    public static readonly codeSelector = '[id="code-selector"]'

    //Pagination
    public static readonly paginationNextButton = '[data-testid="NavigateNextIcon"]'
    public static readonly paginationPreviousButton = '[data-testid=NavigateBeforeIcon]'
    public static readonly paginationLimitSelect = '#pagination-limit-select'
    public static readonly paginationLimitEquals25 = '[data-value="25"]'
    public static readonly paginationLimitAll = '[data-value="All"]'
    public static readonly countVisibleTestCases = 'tr[data-testid*="test-case-row-"]'

    //QDM Test Case Negation tab and associated fields
    public static readonly negationTab = '[data-testid="sub-navigation-tab-negation_rationale"]'
    public static readonly valueSetDirectRefCode = '[id="value-set-selector"]'
    public static readonly valueSetOptionValue = '[data-testid="option-2.16.840.1.113883.3.117.1.7.1.93"]'

    // test case list Action Center
    public static readonly actionCenterDelete = '[data-testid="delete-action-btn"]'
    public static readonly actionCenterClone = '[data-testid="clone-action-btn"]'
    public static readonly actionCenterCopyToMeasure = '[data-testid="copy-action-btn"]'
    public static readonly actionCenterExport = 'form [data-testid="export-action-btn"]'
    public static readonly actionCenterShiftDates = '[data-testid="shift-test-case-dates-action-btn"]'

    // copy to modal
    public static readonly copyToSave = '[data-testid="copy-test-cases-continue-button"]'

    //This function grabs the data-testid value off of the view button and extracts the id out of it.
    //Then, it puts that id in a file. For added control, the optional "eleTableEntry" parameter can be
    //used to specify which entry we are wanting to grab the id off of. For example, if you have two entries
    //on the element table and you want to grab the id off of the second entry, then you would pass a simple 2
    //digit into the function call. If no value is given for this optional parameter, then it will assume the
    //value needs to be 1 -- the first entry in the table.
    public static grabElementId(eleTableEntry?: number): void {
        let attrData = ''
        let elemid = ''
        let elementId = []
        let elementIdPath = 'cypress/fixtures/elementId'
        if (eleTableEntry === null || eleTableEntry === undefined) {
            eleTableEntry = 1
        }
        cy.get(TestCasesPage.qdmTCElementTable).find('tr').eq(eleTableEntry).find('[class="MuiSpeedDial-root MuiSpeedDial-directionRight css-19yoayi"]').then(($element) => {
            attrData = $element.attr('data-testid').toString().valueOf()
            return attrData
        }).then((attrData) => {
            elementId = attrData.split('-', 4)
            cy.log('The data-testid value is ' + attrData)
            console.log('The data-testid value is ' + attrData)
            cy.log(attrData)
            cy.log('The data-testid value is ' + attrData)
            console.log('The element id value is ' + elementId[2])
            cy.log(elementId[2])
            elemid = (elementId[2]).toString().valueOf()
            cy.writeFile(elementIdPath, elemid)
        })


    }

    /*
        this is functionally similar to the above grabElementId, but works with testCaseId
        the primary use-case for grabTestCaseId would be to prep for using testCaseAction()
    */
    public static grabTestCaseId(testCaseNumber: number): void {
        // ToDo: expand to allow option for testCaseId2

        let testCaseId: string
        const testCaseIdPath = 'cypress/fixtures/testCaseId'

        cy.contains('td[data-testid*="caseNumber"]', testCaseNumber)
            .parent('tr')
            .find('button.qpp-c-button')
            .invoke('attr', 'data-testid')
            .then(idValue => {
                testCaseId = idValue.split('-')[5].toString().valueOf()
                cy.writeFile(testCaseIdPath, testCaseId)
            })
    }

    public static clickCreateTestCaseButton(): void {

        //setup for grabbing the measure create call
        cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
            cy.intercept('POST', '/api/measures/' + id + '/test-cases').as('testcase')

            cy.get(this.createTestCaseSaveButton).click()

            //saving testCaseId to file to use later
            cy.wait('@testcase').then(({ response }) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/testCaseId', response.body.id)
            })
            cy.get(EditMeasurePage.testCasesTab).click()

        })
    }

    public static clickQDMImportTestCaseButton(): void {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('PUT', '/api/measures/' + measureID + '/test-cases/imports/qdm').as('testCaseList')
            //click import button on modal window

            cy.get(this.importTestCaseBtnOnModal).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(this.importInProgress).should('be.visible')

            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(this.qdmImportTestCasesBtn, 50000)

            //list is returned
            cy.wait('@testCaseList').then(({ response }) => {
                expect(response.statusCode).to.eq(200)
            })
        })


    }

    public static grabValidateTestCaseNumber(testCaseNumber: number): void {

        cy.get('[data-testid="test-case-title-0_caseNumber"]').should('be.visible')
        cy.get('[data-testid="test-case-title-0_caseNumber"]').invoke('text').then(
            (visibleNumber) => {
                expect(visibleNumber).to.include(testCaseNumber)
            })
    }

    public static grabValidateTestCaseTitleAndSeries(testCaseTitle: string, testCaseSeries: string): void {

        cy.get('[data-testid="test-case-title-0_series"]').should('be.visible')
        cy.get('[data-testid="test-case-title-0_series"]').invoke('text').then(
            (seriesText) => {
                expect(seriesText).to.include(testCaseSeries)
            })

        cy.get('[data-testid="test-case-title-0_title"]').should('be.visible')
        cy.get('[data-testid="test-case-title-0_title"]').invoke('text').then(
            (titleText) => {
                expect(titleText).to.include(testCaseTitle)

            })
    }
    //Similar to our other action functions for test cases and measures,
    //this function gives it's user the ability to pass a required text that
    //indicates one of the available actions that can be done on an element(ie: Edit, Clone, Delete)
    //**NOTE**: Before this function can be called, the grabElementId(eleTableEntry) function must be called, first.
    public static qdmTestCaseElementAction(action: string): void {
        let elementIdPath = 'cypress/fixtures/elementId'
        cy.readFile(elementIdPath).should('exist').then((fileContents) => {
            cy.get('[data-testid="action-center-' + fileContents + '"]').scrollIntoView()
            cy.scrollTo(0, 500)
            Utilities.waitForElementVisible('[data-testid="action-center-' + fileContents + '"]', 50000)
            cy.get('[data-testid="action-center-' + fileContents + '"]').should('be.visible')
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {
                    cy.get('[data-testid="action-center-' + fileContents + '"]').scrollIntoView()
                    cy.scrollTo(0, 500)
                    cy.get('[data-testid="action-center-' + fileContents + '"]').scrollIntoView()
                    Utilities.waitForElementVisible('[data-testid="action-center-' + fileContents + '"]', 50000)
                    cy.get('[data-testid="action-center-' + fileContents + '"]').should('be.visible')
                    cy.get('[data-testid="action-center-' + fileContents + '"]').click()
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').scrollIntoView()
                    Utilities.waitForElementVisible('[data-testid="edit-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="edit-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                case 'clone': {
                    cy.get('[data-testid="action-center-' + fileContents + '"]').scrollIntoView()
                    cy.scrollTo(0, 500)
                    cy.get('[data-testid="action-center-' + fileContents + '"]').click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="clone-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').scrollIntoView()
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="clone-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                case 'delete': {
                    cy.get('[data-testid="action-center-' + fileContents + '"]').scrollIntoView()
                    cy.scrollTo(0, 500)
                    cy.get('[data-testid="action-center-' + fileContents + '"]').click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="delete-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="delete-element-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="delete-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="delete-element-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="delete-element-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                default: { }
            }
        })

    }

    public static createTestCase(testCaseTitle: string, testCaseDescription: string, testCaseSeries: string, testCaseJson?: string): void {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(this.newTestCaseButton).should('be.visible')
        cy.get(this.newTestCaseButton).should('be.enabled')
        cy.get(this.newTestCaseButton).click()

        cy.get(this.createTestCaseDialog).should('exist')
        cy.get(this.createTestCaseDialog).should('be.visible')

        cy.get(this.createTestCaseTitleInput).should('exist')
        Utilities.waitForElementVisible(this.createTestCaseTitleInput, 30000)
        Utilities.waitForElementEnabled(this.createTestCaseTitleInput, 30000)
        cy.get(this.createTestCaseTitleInput).type(testCaseTitle.toString())
        cy.get(this.createTestCaseDescriptionInput).should('exist')
        cy.get(this.createTestCaseDescriptionInput).should('be.visible')
        cy.get(this.createTestCaseDescriptionInput).should('be.enabled')
        cy.get(this.createTestCaseDescriptionInput).focus()
        cy.get(this.createTestCaseDescriptionInput).type(testCaseDescription)
        cy.get(this.createTestCaseGroupInput).should('exist')
        cy.get(this.createTestCaseGroupInput).should('be.visible')
        cy.get(this.createTestCaseGroupInput).type(testCaseSeries).type('{enter}')

        this.clickCreateTestCaseButton()

        //Verify created test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(testCaseTitle, testCaseSeries)

        cy.log('Test Case created successfully')

        if (testCaseJson) {
            //edit test test case
            this.clickEditforCreatedTestCase()
            //Add json to the test case
            Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
            Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
            cy.get(TestCasesPage.aceEditor).should('exist')
            cy.get(TestCasesPage.aceEditor).should('be.visible')
            cy.get(TestCasesPage.aceEditorJsonInput).should('exist')

            cy.wait(1500)
            cy.get(this.aceEditor).type(testCaseJson, { parseSpecialCharSequences: false })

            cy.get(this.detailsTab).click()

            //Save edited / updated to test case
            cy.get(this.editTestCaseSaveButton).click()
            Utilities.waitForElementDisabled(this.editTestCaseSaveButton, 9500)
            cy.log('JSON added to test case successfully')

            cy.get(EditMeasurePage.testCasesTab).should('be.visible')
            cy.get(EditMeasurePage.testCasesTab).click()
        }
    }

    public static enterErroneousJson(err_TestCaseJson: string): void {

        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')
        cy.get(TestCasesPage.aceEditor).type(err_TestCaseJson, { parseSpecialCharSequences: false })

        cy.log('Erroneous JSON added to test case successfully')
    }

    public static updateTestCase(updatedTestCaseTitle: string, updatedTestCaseDescription: string, updatedTestCaseSeries: string): void {

        cy.get(this.detailsTab).click()

        //Edit / Update test case title

        cy.get(this.testCaseTitle).should('exist')
        cy.get(this.testCaseTitle).should('be.visible')
        cy.get(this.testCaseTitle).should('be.enabled')
        cy.get(this.testCaseTitle).focus()

        cy.get(this.testCaseTitle).clear()

        cy.get(this.testCaseTitle).invoke('val', '')

        cy.get(this.testCaseTitle).type('{selectall}{backspace}{selectall}{backspace}')

        //cy.get(this.testCaseTitle).clear()
        cy.get(this.testCaseTitle).type(updatedTestCaseTitle)
        //Update Test Case Description
        cy.get(TestCasesPage.testCaseDescriptionTextBox).clear()
        cy.get(TestCasesPage.testCaseDescriptionTextBox).type(updatedTestCaseDescription)
        //Update Test Case Series
        cy.get(TestCasesPage.testCaseSeriesTextBox).clear()
        cy.get(TestCasesPage.testCaseSeriesTextBox).type(updatedTestCaseSeries).type('{enter}')

        //Save edited / updated to test case
        cy.get(this.editTestCaseSaveButton).click()
        Utilities.waitForElementDisabled(TestCasesPage.editTestCaseSaveButton, 6500)

        cy.get(this.successMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify edited / updated test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(updatedTestCaseTitle, updatedTestCaseSeries)

        cy.log('Test Case updated successfully')
    }

    public static clickEditforCreatedTestCase(secondTestCase?: boolean): void {
        let testCasePIdPath = ''
        if (secondTestCase) {
            testCasePIdPath = 'cypress/fixtures/testCaseId2'
        }
        else {
            testCasePIdPath = 'cypress/fixtures/testCaseId'
        }

        cy.readFile(testCasePIdPath).should('exist').then((tcId) => {
            cy.get('[data-testid=view-edit-test-case-button-' + tcId + ']').should('be.visible')
            cy.get('[data-testid=view-edit-test-case-button-' + tcId + ']').should('be.enabled')
            Utilities.waitForElementVisible('[data-testid=view-edit-test-case-button-' + tcId + ']', 35000)
            cy.get('[data-testid=view-edit-test-case-button-' + tcId + ']').scrollIntoView()
            cy.get('[data-testid=view-edit-test-case-button-' + tcId + ']').click()
        })

    }

    public static CreateTestCaseAPI(title: string, series: string, description: string, jsonValue?: string, secondMeasure?: boolean, twoTestCases?: boolean, altUser?: boolean, measureNumber?: number): string {
        let user = ''
        let measurePath = 'cypress/fixtures/measureId'
        let testCasePath = ''
        let testCasePIdPath = ''
        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }
        if ((measureNumber === undefined) || (measureNumber === null)) {
            measureNumber = 0
            measurePath = 'cypress/fixtures/measureId'
        }
        if (measureNumber > 0) {
            measurePath = 'cypress/fixtures/measureId' + measureNumber
        }
        if (secondMeasure === true) {
            measurePath = 'cypress/fixtures/measureId2'
            //testCasePIdPath = 'cypress/fixtures/measureId2'
        }
        else {
            measurePath = measurePath
        }
        if (twoTestCases === true) {
            testCasePath = 'cypress/fixtures/testCaseId2'
            testCasePIdPath = 'cypress/fixtures/testCasePId2'
        }
        else {
            testCasePath = 'cypress/fixtures/testCaseId'
            testCasePIdPath = 'cypress/fixtures/testCasePId'
        }

        //Add Test Case to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "TEST",
                        'series': series,
                        'title': title,
                        'description': description,
                        'json': jsonValue,
                        'hapiOperationOutcome': {
                            "code": 201,
                            "message": null,
                            "outcomeResponse": null
                        }
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.series).to.eql(series)
                    expect(response.body.title).to.eql(title)
                    expect(response.body.description).to.eql(description)
                    cy.writeFile(testCasePath, response.body.id)
                    cy.writeFile(testCasePIdPath, response.body.patientId)
                })

            })
        })
        return user
    }

    public static CreateQDMTestCaseAPI(title: string, series: string, description: string, jsonValue?: string, twoTestCases?: boolean, altUser?: boolean): string {
        let user = ''
        let measurePath = 'cypress/fixtures/measureId'
        let testCasePath = ''
        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }
        if (twoTestCases === true) {
            testCasePath = 'cypress/fixtures/testCaseId2'
        }
        else {
            testCasePath = 'cypress/fixtures/testCaseId'
        }

        //Add Test Case to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((id) => {
                cy.request({
                    url: '/api/measures/' + id + '/test-cases',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    method: 'POST',
                    body: {
                        'name': "TEST",
                        'series': series,
                        'title': title,
                        'description': description,
                        'json': jsonValue
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    expect(response.body.series).to.eql(series)
                    //expect(response.body.json).to.eql(jsonValue)
                    expect(response.body.title).to.eql(title)
                    expect(response.body.description).to.eql(description)
                    cy.writeFile(testCasePath, response.body.id)
                })
            })
        })
        return user
    }

    public static ImportTestCaseFile(TestCaseFile: string): void {

        //Upload valid Json file
        cy.get(this.testCaseFileImport).attachFile(TestCaseFile)

        cy.get(this.importTestCaseSuccessMsg).should('contain.text', 'Test Case JSON copied into editor. QI-Core Defaults have been added. Please review and save your Test Case.')

        //Save uploaded Test case
        cy.get(this.editTestCaseSaveButton).click({ force: true })
        Utilities.waitForElementDisabled(this.editTestCaseSaveButton, 6500)
    }

    public static ValidateValueAddedToTestCaseJson(ValueToBeAdded: string): void {

        cy.get(this.aceEditor).type('{command}f')
        cy.get('input.ace_search_field').first().type(ValueToBeAdded)

        cy.get(this.aceEditor).invoke('text').then(
            (text) => {
                expect(text).to.contain(ValueToBeAdded)
            })
    }

    public static enterPatientDemographics(dob?: dateTimeISO, livingStatus?: string, race?: string, gender?: string, ethnicity?: string): void {

        if (livingStatus) {
            Utilities.waitForElementVisible(TestCasesPage.QDMLivingStatus, 50000)
            cy.get(TestCasesPage.QDMLivingStatus).click()
            cy.get(TestCasesPage.QDMLivingStatusOPtion).contains(livingStatus).click()
        }

        if (race) {
            cy.get(TestCasesPage.QDMRace).click()
            cy.get('[data-value="' + race + '"]').click()
            cy.get(TestCasesPage.editTestCaseSaveButton).click().wait(2000)
        }

        if (gender) {
            cy.get(TestCasesPage.QDMGender).click()
            Utilities.waitForElementVisible(TestCasesPage.SelectionOptionChoice, 100000)
            cy.get(TestCasesPage.SelectionOptionChoice).contains(gender).click()
        }

        if (ethnicity) {
            cy.get(TestCasesPage.QDMEthnicity).click()
            Utilities.waitForElementVisible('[data-value="' + ethnicity + '"]', 100000)
            cy.get('[data-value="' + ethnicity + '"]').click()
        }

        if (dob) {
            cy.get(TestCasesPage.QDMDob).clear().click()
            cy.get(TestCasesPage.QDMDob).type(dob).click()
        }
    }

    // input the visible "Case #" value to have that test case's checkbox toggled from its current status
    public static checkTestCase(testCaseNumber: number): void {

        cy.contains('td[data-testid*="caseNumber"]', testCaseNumber)
            .parent('tr')
            .find('input[type="checkbox"]')
            .check()
    }

    /*
        actionCenter() assumes that you have already applied the correct 
        set of checkmarks for your test scenario
    */
    public static actionCenter(action: TestCaseAction) {

        switch (action) {

            case TestCaseAction.clone:
                let originalCount: number

                cy.get('[data-testid="test-case-title-0_caseNumber"]')
                    .invoke('text').then(maxCaseNumber => {
                        originalCount = Number(maxCaseNumber)
                    })

                cy.get(TestCasesPage.actionCenterClone).should('be.enabled').click()
                Utilities.waitForElementVisible(EditMeasurePage.successMessage, 2500)

                cy.get('[data-testid="test-case-title-0_caseNumber"]')
                    .invoke('text').then(newMaxNumber => {
                        expect(originalCount + 1).eq(Number(newMaxNumber))
                    })
                break

            case TestCaseAction.copyToMeasure:

                cy.get(TestCasesPage.actionCenterCopyToMeasure).should('be.enabled').click()

                cy.readFile('cypress/fixtures/measureId').should('exist').then((id) => {
                    cy.get('[data-testid="measure-name-' + id + '_select"]').find('input').check()
                })
                cy.get(TestCasesPage.copyToSave).scrollIntoView().click()
                break

            case TestCaseAction.delete:

                cy.get(TestCasesPage.actionCenterDelete).should('be.enabled').click()
                cy.get(CQLEditorPage.deleteContinueButton).click()
                Utilities.waitForElementVisible(EditMeasurePage.successMessage, 2500)
                break

            case TestCaseAction.exportCollection:

                cy.get(TestCasesPage.actionCenterExport).should('be.enabled').click()
                cy.get(TestCasesPage.exportCollectionTypeOption).should('be.visible').click()
                Utilities.waitForElementVisible(EditMeasurePage.successMessage, 7500)
                break

            case TestCaseAction.exportTransaction:

                cy.get(TestCasesPage.actionCenterExport).should('be.enabled').click()
                cy.get(TestCasesPage.exportTransactionTypeOption).should('be.visible').click()
                Utilities.waitForElementVisible(EditMeasurePage.successMessage, 7500)
                break

            case TestCaseAction.shiftDates:
                // still coming, tbd
                break

        }

    }
}
