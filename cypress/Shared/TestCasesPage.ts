import { EditMeasurePage } from "./EditMeasurePage"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"
import dateTimeISO = CypressCommandLine.dateTimeISO;

export class TestCasesPage {
    //QI Core element tab enabled test case detail page elements
    public static readonly QiCoreEleEnabledJSONTab = '[data-testid="json-tab"]'

    //observation fields
    public static readonly denom0Observation = '[id="denominatorObservation0-expected-cb"]'
    public static readonly denom1Observation = '[id="denominatorObservation1-expected-cb"]'
    public static readonly denom2Observation = '[id="denominatorObservation2-expected-cb"]'
    public static readonly numer0Observation = '[id="numeratorObservation0-expected-cb"]'
    public static readonly numer1Observation = '[id="numeratorObservation1-expected-cb"]'
    public static readonly numer2Observation = '[id="numeratorObservation2-expected-cb"]'

    //QDM Bread Crumb
    public static readonly testCasesBCLink = '[data-testid="qdm-test-cases"]'

    //QDM Shift Test Case dates
    public static readonly testCaseDataSideLink = '[data-testid="test-case-data"]'
    public static readonly shiftAllTestCaseDates = '[data-testid="shift-test-case-dates-input"]'
    public static readonly shiftAllTestCasesDiscardBtn = '[data-testid="cancel-button"]'
    public static readonly shftAllTestCasesSaveBtn = '[data-testid="test-case-data-save"]'
    public static readonly shiftAllTestCasesSuccessMsg = '[data-testid="shift-all-test-case-dates-success-text"]'
    public static readonly incrementDatesOnSpecificTCModal = '[data-testid="dialog-form"]'
    public static readonly incrementDatesOnSpecificTCModalText = '[data-testid="shift-dates-dialog"]'
    public static readonly shiftSpecificTestCaseDates = '[data-testid="shift-dates-input"]'
    public static readonly shiftSpecificTestCasesCancelBtn = '[data-testid="shift-dates-cancel-button"]'
    public static readonly shiftSpecificTestCasesSaveBtn = '[data-testid="shift-dates-save-button"]'
    public static readonly shiftSpecificTestCasesSuccessMsg = '[data-testid="test-case-list-success"]'

    //QDM Test Case Demographics elements
    public static readonly QDMDob = '[data-testid="date-of-birth-input"]'
    public static readonly QDMLivingStatus = '[id="demographics-living-status-select-id"]'
    public static readonly QDMLivingStatusOPtion = '[data-value="Living"]'
    public static readonly QDMRace = '[id="demographics-race-select-id"]'
    public static readonly QDMGender = '[id="demographics-gender-select-id"]'
    public static readonly QDMGenderOption = '.MuiList-root'
    public static readonly QDMEthnicity = '[id="demographics-ethnicity-select-id"]'
    public static readonly QEMEthnicityOptions = '[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiPaper-root MuiMenu-paper MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper css-177ic5c"]'

    //QDM Test Case Demographics herlper text elements
    public static readonly QDMDOBHelperTxt = '[id="birth-date-helper-text"]'

    //QDM Test Case Elements elements / objects -- sub tabs sections
    public static readonly ElementsSubTabHeading = '[class="test-case-tab-heading"]'
    public static readonly AssessmentElementTab = '[data-testid="elements-tab-assessment"]'
    public static readonly CareExperienceElementTab = '[data-testid="elements-tab-care_experience"]'
    public static readonly AllergyElementTab = '[data-testid="elements-tab-allergy"]'
    public static readonly AdverseEventElementTab = '[data-testid="elements-tab-adverse_event"]'
    public static readonly CareGoalElementTab = '[data-testid="elements-tab-care_goal"]'
    public static readonly CommunicationElementTab = '[data-testid="elements-tab-communication"]'
    public static readonly ConditionElementTab = '[data-testid="elements-tab-condition"]'
    public static readonly DeviceElementTab = '[data-testid="elements-tab-device"]'
    public static readonly DiagnosticStudyElementTab = '[data-testid="elements-tab-diagnostic_study"]'
    public static readonly FamilyHistoryElementTab = '[data-testid="elements-tab-family_history"]'
    public static readonly ImmunizationElementTab = '[data-testid="elements-tab-immunization"]'
    public static readonly InterventionElementTab = '[data-testid="elements-tab-intervention"]'
    public static readonly MedicationElementTab = '[data-testid="elements-tab-medication"]'
    public static readonly ParticipationElementTab = '[data-testid="elements-tab-participation"]'
    public static readonly ProcedureElementTab = '[data-testid="elements-tab-procedure"]'
    public static readonly EncounterElementTab = '[data-testid="elements-tab-encounter"]'
    public static readonly LaboratoryElementTab = '[data-testid="elements-tab-laboratory_test"]'
    public static readonly CharacteristicElementTab = '[data-testid="elements-tab-patient_characteristic"]'
    public static readonly PhysicalExamElementTab = '[data-testid="elements-tab-physical_exam"]'
    public static readonly RelatedPersonElementTab = '[data-testid="elements-tab-related_person"]'
    public static readonly SubstanceElementTab = '[data-testid="elements-tab-substance"]'
    public static readonly SymptomElementTab = '[data-testid="elements-tab-symptom"]'
    public static readonly TimingCellContainer = '[class="timing-cell-container"]'
    public static readonly qdmTCElementTable = '[class="data-elements-table"]'
    public static readonly relPStartEnd = '[class="MuiFormControl-root MuiTextField-root css-13t88rf"]'
    public static readonly reldT = '[class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-formControl MuiInputBase-adornedEnd css-1bn53lx"]'
    public static readonly authdT = '[class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-formControl MuiInputBase-adornedEnd css-1bn53lx"]'
    public static readonly resdT = '[class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-formControl MuiInputBase-adornedEnd css-1bn53lx"]'
    public static readonly prevPStart = '[]'
    public static readonly prevPEnd = '[]'
    public static readonly sentdT = '[]'
    public static readonly recdT = '[]'
    public static readonly actdT = '[]'
    public static readonly partPStart = '[]'
    public static readonly partPEnd = '[]'
    public static readonly locPStart = '[]'
    public static readonly locPEnd = '[]'
    public static readonly statD = '[]'

    //QDM Test Case Elements elements / objects -- Encounter
    public static readonly EncounterOSSCard = '[data-testid="data-type-Encounter, Performed: Outpatient Surgery Service"]'
    public static readonly EncounterOSSCardExpandBtn = '[data-testid="AddCircleOutlineIcon"]'
    public static readonly ExpandedOSSDetailCard = '[data-testid="data-element-card"]'
    public static readonly ExpandedOSSDetailCardClose = '[data-testid="close-element-card"]'
    public static readonly ExpandedOSSDetailCardTitle = '[class="title"]'
    public static readonly ExpandedOSSDetailCardTitleSubDetail = '[class="sub-text"]'
    public static readonly ExpandedOSSDetailCardTiming = '[class="timing"]'
    public static readonly ExpandedOSSDetailCardTabCodes = '[data-testid="sub-navigation-tab-codes"]'
    public static readonly ExpandedOSSDetailCardTabAttributes = '[data-testid="sub-navigation-tab-attributes"]'
    public static readonly ExpandedOSSDetailCardTabNegationRationale = '[data-testid="sub-navigation-tab-negation_rationale"]'
    public static readonly EncounterEDVCard = '[data-testid="data-type-Encounter, Performed: Emergency Department Visit"]'
    public static readonly EncounterEICard = '[data-testid="data-type-Encounter, Performed: Encounter Inpatient"]'
    public static readonly EncounterOSCard = '[data-testid="data-type-Encounter, Performed: Observation Services"]'

    //QDM Test Case Elements elements / objects -- Laboratory
    public static readonly LaboratoryHLTCard = '[data-testid="data-type-Laboratory Test, Performed: Hematocrit lab test"]'
    public static readonly LaboratoryGLTCard = '[data-testid="data-type-Laboratory Test, Performed: Glucose lab test"]'
    public static readonly LaboratoryBLTCard = '[data-testid="data-type-Laboratory Test, Performed: Bicarbonate lab test"]'
    public static readonly LaboratoryWHBCCLTCard = '[data-testid="data-type-Laboratory Test, Performed: White blood cells count lab test"]'
    public static readonly LaboratorySLTCard = '[data-testid="data-type-Laboratory Test, Performed: Sodium lab test"]'
    public static readonly LaboratoryPLTCard = '[data-testid="data-type-Laboratory Test, Performed: Potassium lab test"]'
    public static readonly LaboratoryCLTCard = '[data-testid="data-type-Laboratory Test, Performed: Creatinine lab test"]'
    public static readonly locationPeriodStartDate = '[data-testid="location-period-start-input"]'
    public static readonly locationPeriodEndDate = '[data-testid="location-period-end-input"]'
    public static readonly relevantPeriodStartDate = '[data-testid="relevant-period-start-input"]'
    public static readonly relevantPeriodEndDate = '[data-testid="relevant-period-end-input"]'
    public static readonly authorDateTime = '[data-testid="author-datetime-input"]'
    public static readonly prevalencePeriodStartDate = '[data-testid="prevalence-period-start-input"]'
    public static readonly prevalencePeriodEndDate = '[data-testid="prevalence-period-end-input"]'

    //QDM Test Case Elements elements / objects -- Characteristic
    public static readonly CharacteristicMAPCard = '[data-testid="data-type-Patient Characteristic Payer: Medicare Advantage payer"]'
    public static readonly CharacteristicPayerCard = '[data-testid="data-type-Patient Characteristic Payer: Payer"]'
    public static readonly CharacteristicMFFSPCard = '[data-testid="data-type-Patient Characteristic Payer: Medicare FFS payer"]'

    //QDM Test Case Elements elements / objects -- Physical Exam
    public static readonly PhysicalExamOSbyPOCard = '[data-testid="data-type-Physical Exam, Performed: Oxygen Saturation by Pulse Oximetry"]'
    public static readonly PhysicalExameBWCard = '[data-testid="data-type-Physical Exam, Performed: Body weight"]'
    public static readonly PhysicalExamSBPCard = '[data-testid="data-type-Physical Exam, Performed: Systolic Blood Pressure"]'
    public static readonly PhysicalExamRRCard = '[data-testid="data-type-Physical Exam, Performed: Respiratory Rate"]'
    public static readonly PhysicalExamHRCard = '[data-testid="data-type-Physical Exam, Performed: Heart Rate"]'
    public static readonly PhysicalExamBTCard = '[data-testid="data-type-Physical Exam, Performed: Body temperature"]'

    //QDM misc test case page objects
    public static readonly QDMDiscardChangesDialog = '[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-mbdu2s"]'
    public static readonly QDMTCSaveBtn = '[data-testid="edit-test-case-save-button"]'
    public static readonly tcSaveSuccessMsg = '[class="toast success"]'
    public static readonly tcSaveAlertDangerMsg = '[class="toast danger"]'
    public static readonly editTestCaseDescriptionInlineError = '[data-testid="test-case-description-helper-text"]'
    public static readonly QDMTcDiscardChangesButton = '[data-testid="ds-btn"]'
    public static readonly QDMRunTestCasefrmTestCaseListPage = '[data-testid="qdm-test-case-run-button"]'
    public static readonly deleteQDMTCAttribute = '[data-testid=delete-chip-button-0]'

    //SDE Sub tab
    public static readonly qdmSDESubTab = '[data-testid="sde-tab"]'
    public static readonly includeSDERadioBtn = '[class="PrivateSwitchBase-input css-1m9pwf3"]'
    public static readonly saveSDEOption = '[data-testid="sde-save"]'

    //Test case QRDA Export
    public static readonly testcaseQRDAExportBtn = '[data-testid="show-export-test-cases-button"]'
    public static readonly successMsg = '.toast'

    //TC error concerning CQL and PC mismatch
    public static readonly CQLPCTCMismatchError = '[data-testid="execution_context_loading_errors"]'
    public static readonly testCaseResultrow = '[data-testid="test-case-row-0"]'

    //edit test case without knowing test case ID
    public static readonly actionBtnNoId = '[class="action-button"]'
    public static readonly editBtnNoId = '[class="btn-container"]'

    //tabs on the test case page
    public static readonly cqlHasErrorsMsg = '[data-testid="test-case-cql-has-errors-message"]'
    public static readonly detailsTab = '[data-testid="details-tab"]'
    public static readonly tctMeasureCQLSubTab = '[data-testid="measurecql-tab"]'
    public static readonly tctExpectedActualSubTab = '[data-testid="expectoractual-tab"]'
    public static readonly tcJsonTab = '[data-testid=json-tab]'

    //QDM Test Case
    public static readonly qdmCQLFailureErrorList = '[data-testid="execution_context_loading_errors"]'
    public static readonly qdmTCJson = '[class="panel-content"]'
    public static readonly qdmExpansionRadioOptionGroup = '[data-testid="manifest-expansion-radio-buttons-group"]'
    public static readonly qdmExpansionSubTab = '[data-testid="nav-link-expansion"]'
    public static readonly qdmManifestSelectDropDownBox = '[id="manifest-select"]'
    public static readonly qdmManifestFirstOption = '[data-value="ecqm-update-4q2017-eh"]'
    public static readonly qdmManifestMaySecondOption = '[data-value="ecqm-update-2024-05-02"]'
    public static readonly qdmManifestSaveBtn = '[data-testid="manifest-expansion-save-button"]'
    public static readonly qdmManifestDiscardBtn = '[data-testid="manifest-expansion-discard-changes-button"]'
    public static readonly qdmManifestSuccess = '[data-testid="manifest-expansion-success-text"]'

    //CQL area on Test Case page
    public static readonly tcCQLArea = '[data-testid="test-case-cql-editor"]'

    //QDM Configuration subsection
    public static readonly configurationSubTab = '[data-testid="qdm-nav-collapser"]'

    //misc test case page objects
    public static readonly tcColumnAscendingArrow = '[data-testid="KeyboardArrowUpIcon"]'
    public static readonly tcColumnDescendingArrow = '[data-testid="KeyboardArrowDownIcon"]'
    public static readonly tcColumnHeading = '[class="cursor-pointer select-none header-button"]'
    public static readonly tcGroupCoverageHighlighting = '[data-testid="group-coverage-nav-"]'
    public static readonly qdmTCHighlightingDU = '[data-testid="definitions-used-section"]'
    public static readonly tcIPHighlightingDetails = '[data-testid="IP-highlighting"]'
    public static readonly tcHLCollapseResultBtn = '[data-testid="ExpandLessIcon"]'
    public static readonly tcHLExpandResultBtn = '[data-testid="ExpandMoreIcon"]'
    public static readonly tcHLResultsSection = '[data-testid="results-section"]'
    public static readonly tcDENOMHighlightingDetails = '[data-testid="DENOM-highlighting"]'
    public static readonly tcNUMERHighlightingDetails = '[data-testid="NUMER-highlighting"]'
    public static readonly tcDENEXHighlightingDetails = '[data-testid="DENEX-highlighting"]'
    public static readonly tcDENEXCEPHighlightingDetails = '[data-testid="DENEXCEP-highlighting"]'
    public static readonly tcNUMEXHighlightingDetails = '[data-testid="NUMEX-highlighting"]'
    public static readonly tcDEFINITIONSHighlightingDetails = '[data-testid="definitions-highlighting"]'
    public static readonly tcFUNCTIONSHighlightingDetails = '[data-testid="functions-highlighting"]'
    public static readonly definitionsFristResultSection = '[class="GroupCoverageResultsSection___StyledDiv-sc-x9ujt7-0 gKcqGP"]'
    public static readonly tcUNUSEDHightlightingDetails = '[data-testid="unused-highlighting"]'
    public static readonly tcHighlightingTab = '[data-testid="highlighting-tab"]'
    public static readonly ippActualCheckBox = '[data-testid="test-population-initialPopulation-actual"]'
    public static readonly numActualCheckBox = '[data-testid="test-population-numerator-actual"]'
    public static readonly numExclusionActuralCheckBox = '[data-testid="test-population-numeratorExclusion-actual"]'
    public static readonly denomActualCheckBox = '[data-testid="test-population-denominator-actual"]'
    public static readonly denomExclusionActualCheckBox = '[data-testid="test-population-denominatorExclusion-actual"]'
    public static readonly newTestCaseButton = '[data-testid="create-new-test-case-button"]'
    public static readonly testCaseDescriptionTextBox = '[data-testid=test-case-description]'
    public static readonly meassureCQLVOTab = '[data-testid="measurecql-tab"]'
    public static readonly voTCCQLobject = '[id="ace-editor-wrapper"]'
    public static readonly voTCCQLEditor = '[class="ace_text-input"]'
    public static readonly testCaseSeriesTextBox = '[data-testid="test-case-series"] > .MuiOutlinedInput-root'
    public static readonly existingTestCaseSeriesDropdown = '#mui-6'
    public static readonly editTestCaseSaveButton = '[data-testid="edit-test-case-save-button"]'
    public static readonly sdeTestCaseSaveButton = '[data-testid="sde-save"]'
    public static readonly tcDiscardChangesButton = '[data-testid="edit-test-case-discard-button"]'
    public static readonly confirmationMsg = '[data-testid="create-test-case-alert"]'
    public static readonly confirmationMsgWithErrorOrWarning = '#content > div > h3'
    public static readonly testCaseSeriesList = 'tbody > tr > :nth-child(3)'
    public static readonly aceEditor = '[data-testid="test-case-json-editor"]'
    public static readonly aceEditorJsonInput = '[data-testid="test-case-json-editor-input"]'
    public static readonly testCaseTitle = '[data-testid="test-case-title"]'
    public static readonly executeTestCaseButton = '[data-testid="execute-test-cases-button"]'
    public static readonly testCaseStatus = '[class="MuiBox-root css-0"]'
    public static readonly qdmSDESidNavLink = '[data-testid="nav-link-sde"]'
    public static readonly createTestCaseTitleInlineError = '[data-testid="create-test-case-title-helper-text"]'
    public static readonly editTestCaseTitleInlineError = '[data-testid="test-case-title-helper-text"]'
    public static readonly testCaseJsonValidationErrorBtn = '[data-testid="show-json-validation-errors-button"]'
    public static readonly testCaseJsonValidationDisplayList = '[data-testid="json-validation-errors-list"]'
    public static readonly testCaseJsonValidationErrorList = '[data-testid="json-validation-errors-list"]'
    public static readonly testCasePopulationList = '[data-testid="create-test-case-populations"]'
    public static readonly testCaseExecutionError = '[data-testid="execution_context_loading_errors"]'
    public static readonly runTestButton = '[data-testid="run-test-case-button"]'
    public static readonly runTestAlertMsg = '[data-testid="calculation-info-alert"]'
    public static readonly testCalculationResults = '[data-testid=calculation-results]'
    public static readonly testCaseExpected_Actual_table_tbl = '[data-testid="create-test-case-populations"]'
    public static readonly testCalculationResultsLineTwo = '[data-testid="calculation-results"] > div > :nth-child(2)'
    public static readonly testCalculationResultsLineThree = '[data-testid="calculation-results"] > div > :nth-child(3)'
    public static readonly testCalculationResultsLineFour = '[data-testid="calculation-results"] > div > :nth-child(4)'
    public static readonly testCalculationResultsLineFive = '[data-testid="calculation-results"] > div > :nth-child(5)'
    public static readonly testCalculationResultsLineSix = '[data-testid="calculation-results"] > div > :nth-child(6)'
    public static readonly testCalculationResultsLineSeven = '[data-testid="calculation-results"] > div > :nth-child(7)'
    public static readonly testCalculationResultsLineEight = '[data-testid="calculation-results"] > div > :nth-child(8)'
    public static readonly testCalculationResultsLineNine = '[data-testid="calculation-results"] > div > :nth-child(9)'
    public static readonly testCalculationError = '[data-testid="calculation-error-alert"]'
    public static readonly testCaseListPassingPercTab = '[data-testid="passing-tab"]'
    public static readonly testCaseListCoveragePercTab = '[data-testid="coverage-tab"]'
    public static readonly testCaseListCoverageHighlighting = '[data-testid="code-coverage-highlighting"]'
    public static readonly selectTestCaseDropdownBtn = '.chevron-container > [data-testid="ExpandMoreIcon"]'
    public static readonly testCaseListTable = '[data-testid="test-case-tbl"]'
    public static readonly tcPopulationCriteriaNavLink = '[data-testid="test-case-pop-criteria-nav"]'
    public static readonly tcCoverageTabList = '[data-testid="coverage-tab-list"]'
    public static readonly tcCoverageTabIPpop = '[data-testid="Initial Population-population"]'
    public static readonly tcCoverageTabDenompop = '[data-testid="Denominator-population"]'
    public static readonly tcCoverageTabDenomExcludepop = '[data-testid="Denominator Exclusion-population"]'
    public static readonly tcCoverageTabNumpop = '[data-testid="Numerator-population"]'
    public static readonly tcCoverageTabUsedDef = '[data-testid="Definitions-definition"]'
    public static readonly tcCoverageTabFunctsDef = '[data-testid="Functions-definition"]'
    public static readonly tcCoverageTabUnusedDef = '[data-testid="Unused-definition"]'
    public static readonly tcCoverageSections = '[class="accordion-section"]'
    public static readonly tcCoverageContent = '[class="accordion-content"]'

    //Test Case Population Values
    public static readonly testCaseIPPExpected = '[data-testid="test-population-initialPopulation-expected"]'
    public static readonly testCaseNUMERExpected = '[data-testid="test-population-numerator-expected"]'
    public static readonly testCaseNUMEXExpected = '[data-testid="test-population-numeratorExclusion-expected"]'
    public static readonly testCaseDENOMExpected = '[data-testid="test-population-denominator-expected"]'
    public static readonly testCaseDENEXExpected = '[data-testid="test-population-denominatorExclusion-expected"]'
    public static readonly testCaseDENEXCEPTxpected = '[data-testid="test-population-denominatorException-expected"]'
    public static readonly testCaseMSRPOPLExpected = '[data-testid="test-population-measurePopulation-expected"]'
    public static readonly testCaseMSRPOPLEXExpected = '[data-testid="test-population-measurePopulationExclusion-expected"]'
    public static readonly testCasePopulationHeaderForNoMeasureGroup = '[data-testid="execution_context_loading_errors"]'
    public static readonly testCasePopulationValuesHeader = '.GroupPopulations___StyledSpan-sc-1752rtp-1'
    public static readonly testCasePopulationValuesTable = '[data-testid="test-case-population-list-tbl"]'
    public static readonly testCasePopulationValues = '.TestCasePopulationList___StyledTr-sc-iww9ze-3'
    public static readonly initialPopulationRow = '[data-testid="test-row-population-id-initialPopulation"]'
    public static readonly numeratorRow = '[data-testid="test-row-population-id-numerator"]'
    public static readonly numeratorExclusionRow = '[data-testid="test-row-population-id-numeratorExclusion"]'
    public static readonly denominatorRow = '[data-testid="test-row-population-id-denominator"]'
    public static readonly denominatorExclusionRow = '[data-testid="test-row-population-id-denominatorExclusion"]'
    public static readonly denominatorExceptionRow = '[data-testid="test-row-population-id-denominatorException"]'
    public static readonly measureObservationRow = '[data-testid="test-population-measurePopulationObservation-expected"]'
    public static readonly denominatorObservationRow = '[data-testid="test-population-denominatorObservation-expected"]'
    public static readonly numeratorObservationRow = '[data-testid="test-population-numeratorObservation-expected"]'
    public static readonly measureGroup1Label = '[data-testid="measure-group-1"]'
    public static readonly measureGroup2Label = '[data-testid="measure-group-2"]'
    public static readonly denominatorObservationExpectedRow = '[data-testid="test-population-denominatorObservation-expected"]'

    //QDM Test Case Page
    public static readonly elementsTab = '[data-testid=elements-tab]'
    public static readonly jsonTab = '[data-testid=json-tab]'
    public static readonly highlightingTab = '[data-testid=highlighting-tab]'
    public static readonly expectedOrActualTab = '[data-testid=expectoractual-tab]'
    public static readonly runQDMTestCaseBtn = '[data-testid=qdm-test-case-run-button]'
    public static readonly qdmComingSoonMsg = '[data-testid="coming-soon"]'

    //Test Case Page
    public static readonly dobSelectValueElementTab = '[class="MuiFormControl-root MuiTextField-root css-1uwaluo"]'
    public static readonly ethnicityDetailedElementTab = '[data-testid="demographics-ethnicity-detailed-input"]'
    public static readonly ethnicityOmbElementTab = '[id="demographics-ethnicity-omb-select-id"]'
    public static readonly raceDetailedElementTab = '[data-testid="demographics-race-detailed-input"]'
    public static readonly raceOmbselectBoxElementTab = '[id="raceOMB"]'
    public static readonly raceOmbElementTab = '[data-testid="demographics-race-omb"]'
    public static readonly genderDdOnElementTab = '[id="gender-selector"]'
    public static readonly genderSelectBoxElementTab = '[id="gender-selector"]'
    public static readonly genderSelectValuesElementTab = '[class="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9"]'
    public static readonly bonnieImportTestCaseBtn = '[data-testid="import-test-cases-from-bonnie-button"]'
    public static readonly highlightingPCTabSelector = '[data-testid="population-criterion-selector"]'
    public static readonly qdmTestCaseViewBtn = '.action'
    public static readonly lastSavedDate = '[data-testid="test-case-title-0_lastSaved"]'

    //Stratifications
    public static readonly denominatorStratificationOneExpectedValue = '[data-testid="test-population-Strata-1 Denominator-expected"]'
    public static readonly numeratorStratificationTwoExpectedValue = '[data-testid="test-population-Strata-2 Numerator-expected"]'
    public static readonly initialPopulationStratificationExpectedValue = '[data-testid="test-population-Strata-1 Initial Population-expected"]'
    public static readonly measurePopulationStratificationExpectedValue = '[data-testid="test-population-Strata-2 Measure Population-expected"]'

    //measure versioning attempt with invalid test case
    public static readonly versionMeasureWithTCErrors = '[class="MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-1uop03p react-draggable"]'
    public static readonly versionMeasurewithTCErrorsModalBody = '[id="discard-changes-dialog-body"]'
    public static readonly versionMeasurewithTCErrorsCancel = '[data-testid="invalid-test-dialog-cancel-button"]'
    public static readonly versionMeasurewithTCErrorsContinue = '[data-testid="invalid-test-dialog-continue-button"]'

    //Test Case Expected/Actual Values
    public static readonly nonBooleanExpectedValueError = '[class="qpp-error-message"]'
    public static readonly measureObservationExpectedValueError = '[data-testid="measurePopulationObservation-error-helper-text"]'
    public static readonly denominatorObservationExpectedValueError = '[data-testid="denominatorObservation-error-helper-text"]'
    public static readonly numeratorObservationExpectedValueError = '[data-testid="numeratorObservation-error-helper-text"]'
    public static readonly eaMeasureGroupOneStratification = '[data-testid="measure-group-1-stratifications"]'
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
    public static readonly importTestCasesBtn = '[data-testid="show-import-test-cases-button"]'
    public static readonly filAttachDropBox = '[data-testid="file-drop-input"]'
    public static readonly importTestCaseModalBtn = '[data-testid="test-case-import-import-btn"]'
    public static readonly importInProgress = '[class="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary css-1mbw3kc"]'
    public static readonly testCaseImportErrorAtValidating = '[data-testid="test-case-import-error-div"]'
    public static readonly importTestCaseModalList = '[data-testid="test-case-preview-list"]'
    public static readonly importTestCaseModalHeader = '[data-testid="test-case-preview-header"]'
    public static readonly importWarningMessages = '[data-testid="import-warning-messages"]'

    //Warning Modal
    public static readonly discardChangesConfirmationModal = '[id="mui-4"]'
    public static readonly discardChangesConfirmationText = '[id="discard-changes-dialog-body"]'
    public static readonly discardChangesCancelBtn = '[data-testid="discard-dialog-cancel-button"]'
    public static readonly continueDiscardChangesBtn = '[data-testid="discard-dialog-continue-button"]'

    //Delete Test Case
    public static readonly deleteTestCaseConfirmationText = '[class="dialog-warning-body"]'
    public static readonly deleteTestCaseContinueBtn = '[data-testid="delete-dialog-continue-button"]'
    public static readonly deleteAllTestCasesBtn = '[data-testid=delete-all-test-cases-button]'

    //Import Test cases
    public static readonly importTestCaseBtnOnModal = '[data-testid="test-case-import-import-btn"]'
    public static readonly importTestCaseCancelBtnOnModal = '[data-testid="test-case-import-cancel-btn"]'
    public static readonly importTestCaseSuccessMessage = '[data-testid="population-criteria-success"]'
    public static readonly importTestCaseAlertMessage = '[class="madie-alert warning"]'
    public static readonly importTestCaseDetailedAlertMessage = '[class="StatusHandler___StyledSpan-sc-1tujbo9-0 dBOLeU"]'
    public static readonly importTestCaseBtn = '[data-testid="import-test-case-btn"]'
    public static readonly testCaseFileImport = '[data-testid="import-file-input"]'
    public static readonly tcFileDropInput = '[data-testid="file-drop-input"]'
    public static readonly tcFileDrop = '[data-testid="file-drop-div"]'
    public static readonly tcImportButton = '[data-testid="select-file-button"]'
    public static readonly tcImportError = '[data-testid="test-case-import-error-div"]'
    public static readonly testCasesNonBonnieFileImportModal = '[data-testid="test-case-import-content-div"]'
    public static readonly testCasesNonBonnieFileImport = '[data-testid="file-drop-input"]'
    public static readonly testCasesNonBonnieFileImportFileLineAfterSelectingFile = '[data-testid="test-case-preview-header"]'
    public static readonly testCasesNonBonnieFileImportFileUploadStatusDetails = '[class="TestCaseImportDialog___StyledSmall2-sc-v92oci-6 gpyrWs"]'
    public static readonly testCasesNonBonnieFileImportErrorOnImport = '[data-testid="test-case-import-error-div"]'
    public static readonly importTestCaseSuccessMsg = '[data-testid=success-toast]'
    public static readonly importTestCaseErrorMsg = '[data-testid=error-toast]'
    public static readonly importTestCaseSuccessInfo = '[id="content"]'
    public static readonly importNonBonnieTestCasesBtn = '[data-testid="import-test-cases-button"]'

    //Export Test Cases
    public static readonly exportTestCasesBtn = '[data-testid="export-test-cases-button"]'
    public static readonly exportExcelBtn = '[data-testid="export-excel"]'
    public static readonly exportTransactionBundleBtn = '[data-testid="export-transaction-bundle"]'
    public static readonly exportCollectionBundleBtn = '[data-testid="export-collection-bundle"]'
    public static readonly exportTransactionTypeOption = '[data-testid="export-transaction-bundle"]'
    public static readonly exportCollectionTypeOption = '[data-testid="export-collection-bundle"]'

    //QDM Test Case Elements Tab
    public static readonly QDMElementsTab = '[data-testid="elements-section"]'

    //QDM Test Case Attributes
    public static readonly laboratoryElement = '[data-testid="elements-tab-laboratory_test"]'
    public static readonly plusIcon = '[data-testid=AddCircleOutlineIcon]'
    public static readonly addAttribute = '[data-testid="add-attribute-button"]'
    public static readonly attributesTab = '[data-testid="sub-navigation-tab-attributes"]'
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

    //QDM Test Case Negation tab and associated fields
    public static readonly negationTab = '[data-testid="sub-navigation-tab-negation_rationale"]'
    public static readonly valueSetDirectRefCode = '[id="value-set-selector"]'
    public static readonly valueSetOptionValue = '[data-testid="option-2.16.840.1.113883.3.117.1.7.1.93"]'

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
        cy.get('[class="data-elements-table"]').find('tr').eq(eleTableEntry).find('[class="qpp-c-button view-with-dropdown-button"]').then(($element) => {
            attrData = $element.attr('data-testid').toString().valueOf()
            return attrData
        }).then((attrData) => {
            elementId = attrData.split('-', 4)
            console.log('The data-testid value is ' + attrData)
            cy.log(attrData)
            console.log('The element id value is ' + elementId[3])
            cy.log(elementId[3])
            elemid = (elementId[3]).toString().valueOf()
            cy.writeFile(elementIdPath, elemid)
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

    public static clickImportTestCaseButton(): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('POST', '/api/measures/' + measureID + '/test-cases/list').as('testCaseList')
            //click import button on modal window
            cy.get(this.importTestCaseModalBtn).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(this.importInProgress).should('be.visible')
            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(this.importTestCasesBtn, 50000)

            //list is returned
            cy.wait('@testCaseList').then(({ response }) => {
                expect(response.statusCode).to.eq(201)
            })
        })
    }

    public static clickQDMImportTestCaseButton(): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {
            cy.intercept('PUT', '/api/measures/' + measureID + '/test-cases/imports/qdm').as('testCaseList')
            //click import button on modal window
            cy.get(this.importTestCaseModalBtn).click()
            //spinner indicating that import progress is busy is shown / is visible
            cy.get(this.importInProgress).should('be.visible')
            //wait until the import buttong appears on the page, again
            Utilities.waitForElementVisible(this.importTestCasesBtn, 50000)

            //list is returned
            cy.wait('@testCaseList').then(({ response }) => {
                expect(response.statusCode).to.eq(200)
            })
        })

    }

    public static grabValidateTestCaseTitleAndSeries(testCaseTitle: string, testCaseSeries: string): void {

        cy.get('[data-testid="test-case-title-0_group"]').should('be.visible')
        cy.get('[data-testid="test-case-title-0_group"]').invoke('text').then(
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
            Utilities.waitForElementEnabled('[data-testid="view-element-btn-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view-element-btn-' + fileContents + '"]').should('be.enabled')
            cy.wait(6000)
            cy.get('[data-testid="view-element-btn-' + fileContents + '"]').scrollIntoView()
            cy.scrollTo(0, 500)
            Utilities.waitForElementVisible('[data-testid="view-element-btn-' + fileContents + '"]', 50000)
            cy.get('[data-testid="view-element-btn-' + fileContents + '"]').should('be.visible')
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {
                    cy.get('[data-testid="view-element-btn-' + fileContents + '"]').scrollIntoView()
                    cy.scrollTo(0, 500)
                    cy.get('[data-testid="view-element-btn-' + fileContents + '"]').click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="edit-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').scrollIntoView()
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="edit-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="edit-element-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                case 'clone': {
                    cy.get('[data-testid="view-element-btn-' + fileContents + '"]').scrollIntoView()
                    cy.scrollTo(0, 500)
                    cy.get('[data-testid="view-element-btn-' + fileContents + '"]').click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="clone-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').scrollIntoView()
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="clone-element-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="clone-element-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                case 'delete': {
                    cy.get('[data-testid="view-element-btn-' + fileContents + '"]').scrollIntoView()
                    cy.scrollTo(0, 500)
                    cy.get('[data-testid="view-element-btn-' + fileContents + '"]').click({ force: true })
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
    public static testCaseAction(action: string, secondTestCase?: boolean): void {
        let filePath = 'cypress/fixtures/testCaseId'

        if (secondTestCase === true) {
            filePath = 'cypress/fixtures/testCaseId2'
        }
        cy.readFile(filePath).should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid="select-action-' + fileContents + '"]', 50000)
            cy.get('[data-testid="select-action-' + fileContents + '"]').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid="select-action-' + fileContents + '"]', 50000)
            cy.get('[data-testid="select-action-' + fileContents + '"]').should('be.enabled').wait(1000)
            switch ((action.valueOf()).toString().toLowerCase()) {
                case "edit": {
                    cy.get('[data-testid="select-action-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="view-edit-test-case-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="view-edit-test-case-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="view-edit-test-case-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="view-edit-test-case-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="view-edit-test-case-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                case 'export': {
                    cy.scrollTo('top')
                    cy.get('[data-testid="select-action-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid="export-test-case-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="export-test-case-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="export-test-case-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="export-test-case-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="export-test-case-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    cy.get(this.tcSaveSuccessMsg).should('contain.text', 'Test case exported successfully')
                    break
                }
                case 'exporttransaction': {
                    cy.get('[data-testid="select-action-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid="export-transaction-bundle-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="export-transaction-bundle-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="export-transaction-bundle-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="export-transaction-bundle-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="export-transaction-bundle-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    cy.get(this.tcSaveSuccessMsg).should('contain.text', 'Test case exported successfully')
                    break
                }
                case 'exportcollection': {
                    cy.get('[data-testid="select-action-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    cy.intercept('GET', '/api/measures/' + fileContents + '/exports').as('measureExport')
                    Utilities.waitForElementVisible('[data-testid="export-collection-bundle-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="export-collection-bundle-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="export-collection-bundle-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="export-collection-bundle-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="export-collection-bundle-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    cy.get(this.tcSaveSuccessMsg).should('contain.text', 'Test case exported successfully')
                    break
                }
                case 'shift': {
                    cy.get('[data-testid="select-action-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="shift-dates-btn-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="shift-dates-btn-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="shift-dates-btn-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="shift-dates-btn-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="shift-dates-btn-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                case 'delete': {
                    cy.get('[data-testid="select-action-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    Utilities.waitForElementVisible('[data-testid="delete-test-case-btn-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="delete-test-case-btn-' + fileContents + '"]').should('be.visible')
                    Utilities.waitForElementEnabled('[data-testid="delete-test-case-btn-' + fileContents + '"]', 55000)
                    cy.get('[data-testid="delete-test-case-btn-' + fileContents + '"]').should('be.enabled')
                    cy.get('[data-testid="delete-test-case-btn-' + fileContents + '"]').scrollIntoView().click({ force: true })
                    break
                }
                default: { }
            }
        })
    }

    public static createQDMTestCase(testCaseTitle: string, testCaseDescription: string, testCaseSeries: string): void {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click().wait(3500)
        cy.get(this.newTestCaseButton).should('be.visible')
        cy.get(this.newTestCaseButton).should('be.enabled')
        cy.get(this.newTestCaseButton).click()

        cy.get(this.createTestCaseDialog).should('exist')
        cy.get(this.createTestCaseDialog).should('be.visible')

        cy.get(this.createTestCaseTitleInput).should('exist').wait(500)
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

        cy.log('Test Case created successfully')

    }

    public static createTestCase(testCaseTitle: string, testCaseDescription: string, testCaseSeries: string, testCaseJson: string): void {

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()
        cy.get(this.newTestCaseButton).should('be.visible')
        cy.get(this.newTestCaseButton).should('be.enabled')
        cy.get(this.newTestCaseButton).click()

        cy.get(this.createTestCaseDialog).should('exist')
        cy.get(this.createTestCaseDialog).should('be.visible')

        cy.get(this.createTestCaseTitleInput).should('exist').wait(500)
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

        this.editTestCaseAddJSON(testCaseJson)
    }
    public static enterErroneousJson(err_TestCaseJson: string): void {

        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)
        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist')
        cy.get(TestCasesPage.aceEditor).wait(500).type(err_TestCaseJson, { parseSpecialCharSequences: false })

        cy.log('Erroneous JSON added to test case successfully')
    }

    public static editTestCaseAddJSON(testCaseJson: string): void {

        this.clickEditforCreatedTestCase()

        //Add json to the test case
        Utilities.waitForElementVisible(TestCasesPage.aceEditor, 37700)

        Utilities.waitForElementWriteEnabled(TestCasesPage.aceEditor, 37700)
        cy.get(TestCasesPage.aceEditor).should('exist')
        cy.get(TestCasesPage.aceEditor).should('be.visible')
        cy.get(TestCasesPage.aceEditorJsonInput).should('exist').wait(800)

        cy.get(this.aceEditor).type(testCaseJson, { parseSpecialCharSequences: false })

        cy.get(this.detailsTab).click()

        //Save edited / updated to test case
        cy.get(this.editTestCaseSaveButton).click()
        cy.get(this.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(this.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.log('JSON added to test case successfully')

        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

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
        cy.get(this.confirmationMsg).each(msg => {
            expect(msg.text()).to.be.oneOf(['Test case updated successfully!', 'Test case updated successfully with errors in JSON', 'Test case updated successfully with warnings in JSON'])
        })

        cy.get(EditMeasurePage.testCasesTab).click()

        //Verify edited / updated test case Title and Series exists on Test Cases Page
        this.grabValidateTestCaseTitleAndSeries(updatedTestCaseTitle, updatedTestCaseSeries)

        cy.log('Test Case updated successfully')
    }
    public static clickEditforCreatedTestCase(secondTestCase?: boolean): void {
        let testCasePIdPath = ''
        if (secondTestCase === true) {
            testCasePIdPath = 'cypress/fixtures/testCaseId2'
        }
        else {
            testCasePIdPath = 'cypress/fixtures/testCaseId'
        }
        cy.readFile(testCasePIdPath).should('exist').then((tcId) => {
            cy.get('[data-testid=select-action-' + tcId + ']').click()
            cy.get('[data-testid=view-edit-test-case-' + tcId + ']').should('be.visible')
            cy.get('[data-testid=view-edit-test-case-' + tcId + ']').should('be.enabled')
            cy.get('[data-testid=view-edit-test-case-' + tcId + ']').scrollIntoView()
            cy.get('[data-testid=view-edit-test-case-' + tcId + ']').click()
        })

    }

    public static clickDeleteTestCaseButton(): void {
        cy.readFile('cypress/fixtures/testCaseId').should('exist').then((fileContents) => {
            cy.get('[data-testid=delete-test-case-btn-' + fileContents + ']').should('be.visible')
            cy.get('[data-testid=delete-test-case-btn-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=delete-test-case-btn-' + fileContents + ']').click()
        })

    }
    public static CreateTestCaseAPI(title: string, series: string, description: string, jsonValue?: string, secondMeasure?: boolean, twoTestCases?: boolean, altUser?: boolean): string {
        let user = ''
        let measurePath = 'cypress/fixtures/measureId'
        let measureGroupPath = 'cypress/fixtures/groupId'
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
        if (secondMeasure === true) {
            measurePath = 'cypress/fixtures/measureId2'
            //testCasePIdPath = 'cypress/fixtures/measureId2'
        }
        else {
            measurePath = 'cypress/fixtures/measureId'
            //testCasePIdPath = 'cypress/fixtures/measureId'
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
                cy.readFile(measureGroupPath).should('exist').then((groupIdFc) => {
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
                            "hapiOperationOutcome": {
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

    public static ImportTestCaseFile(TestCaseFile: string | string[]): void {

        //Upload valid Json file
        cy.get(this.testCaseFileImport).attachFile(TestCaseFile).wait(1000)

        cy.get(this.importTestCaseSuccessMsg).should('contain.text', 'Test Case JSON copied into editor. QI-Core Defaults have been added. Please review and save your Test Case.')

        //Save uploaded Test case
        cy.get(this.editTestCaseSaveButton).click({ force: true })
    }

    public static ValidateValueAddedToTestCaseJson(ValueToBeAdded: string | string[]): void {

        cy.get(this.aceEditor).should('exist')
        cy.get(this.aceEditor).should('be.visible').wait(1000)
        //cy.get(this.aceEditorJsonInput).should('exist')
        cy.get(this.aceEditor).invoke('text').then(
            (text) => {
                expect(text).to.contain(ValueToBeAdded)
            })
    }



    public static enterPatientDemographics(dob?: dateTimeISO, livingStatus?: string, race?: string, gender?: string, ethnicity?: string): void {

        cy.get(TestCasesPage.QDMDob).clear().wait(1700).click().wait(1000)
        cy.get(TestCasesPage.QDMDob).type(dob).click()
        cy.get(TestCasesPage.QDMLivingStatus).click()
        cy.get(TestCasesPage.QDMLivingStatusOPtion).contains(livingStatus).click()
        cy.get(TestCasesPage.QDMRace).click()
        cy.get('[data-value="'+ race +'"]').click()
        cy.get(TestCasesPage.QDMGender).click()
        cy.get(TestCasesPage.QDMGenderOption).contains(gender).click()
        cy.get(TestCasesPage.QDMEthnicity).click()
        cy.get('[data-value="'+ ethnicity +'"]').click()
    }
}
