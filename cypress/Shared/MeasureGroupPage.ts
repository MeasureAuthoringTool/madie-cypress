import { MeasuresPage } from "./MeasuresPage"
import { EditMeasurePage } from "./EditMeasurePage"
import { CQLEditorPage } from "./CQLEditorPage"
import { Environment } from "./Environment"
import { Utilities } from "./Utilities"
import { v4 as uuidv4 } from 'uuid'

export class MeasureGroupPage {

    public static readonly pcErrorAlertToast = '[data-testid="population-criteria-error"]'

    //mismatch CQL error
    public static readonly CQLPCMismatchError = '[class="madie-alert error"]'

    //CQL has errors message
    public static readonly CQLHasErrorMsg = '[data-testid="error-alerts"]'

    //tabs on Measure Group page
    public static readonly populationTab = '[data-testid="populations-tab"]'
    public static readonly stratificationTab = '[data-testid="stratifications-tab"]'
    public static readonly reportingTab = '[data-testid="reporting-tab"]'

    //stratification fields
    public static readonly stratOne = '[id="Stratification-select-1"]'
    public static readonly stratTwo = '[id="Stratification-select-2"]'
    public static readonly stratThree = '[id="Stratification-select-3"]'
    public static readonly stratFour = '[id="Stratification-select-4"]'

    public static readonly stratAssociationOne = '[id="association-select-1"]'
    public static readonly stratAssociationTwo = '[id="association-select-2"]'
    public static readonly stratAssociationThree = '[id="association-select-3"]'
    public static readonly stratAssociationFour = '[id="association-select-4"]'

    public static readonly stratDescOne = '[name="stratifications[0].description"]'
    public static readonly stratDescTwo = '[name="stratifications[1].description"]'
    public static readonly stratDescThree = '[name="stratifications[2].description"]'
    public static readonly stratDescFour = '[name="stratifications[3].description"]'

    public static readonly addStratButton = '[data-testid="add-strat-button"]'
    public static readonly removeStratButton = '[data-testid="remove-strat-button"]'

    //Ratio specific -- Add and Delete Initial Population(s)
    public static readonly addSecondInitialPopulationLink = '[data-testid="add_populations[0].definition"]'
    public static readonly firstInitialPopulationSelect = '[id="population-select-initial-population-1-select"]'
    public static readonly secondInitialPopulationSelect = '[id="population-select-initial-population-2-select"]'
    public static readonly deleteSecondInitialPopulation = '[data-testid="remove_populations[1].definition"]'
    public static readonly lblSecondInitialPopulation = '[id="population-select-initial-population-2-label"]'
    public static readonly lblFirstIpAssociation = '[data-testid="Initial Population 1"]'
    public static readonly rdioFirstDenom = '[data-testid="Initial Population 1-Denominator"]'
    public static readonly rdioFirstNum = '[data-testid="Initial Population 1-Numerator"]'
    public static readonly lblSecondIpAssociation = '[data-testid="Initial Population 2"]'
    public static readonly rdioSecondNum = '[data-testid="Initial Population 2-Numerator"]'
    public static readonly rdioSecondDenom = '[data-testid="Initial Population 2-Denominator"]'

    //related to delete functionality for groups
    public static readonly deleteGroupbtn = '[data-testid="group-form-delete-btn"]'
    public static readonly deleteMeasureGroupModal = '[data-testid="delete-measure-group-dialog"]'
    public static readonly yesDeleteModalbtn = '[data-testid="delete-measure-group-modal-agree-btn"]'
    public static readonly keepGroupModalbtn = '[data-testid="delete-measure-group-modal-cancel-btn"]'
    public static readonly deleteMeasureGroupConfirmationMsg = '.MuiDialogContent-root > div'
    //Reporting tab fields
    public static readonly rateAggregation = '[data-testid="rateAggregationText"]'
    public static readonly improvementNotationSelect = '[id="improvement-notation-select"]'
    //Measure Group Type
    public static readonly measureGroupTypeSelect = '[data-testid="measure-group-type-dropdown"]'
    public static readonly measureGroupTypeCheckbox = '[id="measure-group-type"]'
    public static readonly measureGroupTypeDropdownBtn = '[class="MuiBackdrop-root MuiBackdrop-invisible css-esi9ax"]'
    public static readonly measureGroupTypeListBox = '[id="mui-component-select-measureGroupTypes"]'

    //Scoring drop-down box
    public static readonly measureScoringSelect = '[data-testid="scoring-select"]'
    public static readonly measureScoringCohort = '[data-testid="group-scoring-option-COHORT"]'
    public static readonly measureScoringProportion = '[data-testid="group-scoring-option-PROPORTION"]'
    public static readonly measureScoringRatio = '[data-testid="group-scoring-option-RATIO"]'
    public static readonly measureScoringCV = '[data-testid="group-scoring-option-CONTINUOUS_VARIABLE"]'
    public static readonly saveMeasureGroupDetails = '[data-testid="group-form-submit-btn"]'

    //Scoring unit
    public static readonly measureScoringUnitField = '[data-testid="measure-group-scoring-unit" ]'

    //Populations
    public static readonly initialPopulationSelect = '[id="population-select-initial-population-select"]'
    public static readonly denominatorSelect = '[id="population-select-denominator-select"]'
    public static readonly denominatorExclusionSelect = '[id="population-select-denominator-exclusion-select"]'
    public static readonly denominatorExceptionSelect = '[id="population-select-denominator-exception-select"]'
    public static readonly numeratorSelect = '[id="population-select-numerator-select"]'
    public static readonly numeratorExclusionSelect = '[id="population-select-numerator-exclusion-select"]'
    public static readonly measurePopulationSelect = '[id="population-select-measure-population-select"]'
    public static readonly measurePopulationExclusionSelect = '[id="population-select-measure-population-exclusion-select"]'
    public static readonly measureObservationPopSelect = '[id="measure-observation-cv-obs"]'
    public static readonly measurePopulationOption = '[data-testid="select-option-measure-group-population"]'
    public static readonly measureObsAggregSelect = '[id="measure-observation-aggregate-cv-obs"]'
    public static readonly populationMismatchErrorMsg = '[data-testid="Stratification-select-1-helper-text"]'
    public static readonly initialPopulationMismatchErrorMsg = '[data-testid="population-select-initial-population-select-helper-text"]'
    public static readonly measurePopulationMismatchErrorMsg = '[data-testid="population-select-measure-population-select-helper-text"]'
    public static readonly measurePopulationExclusionMismatchErrorMsg = '[data-testid="population-select-measure-population-exclusion-select-helper-text"]'

    //UCUM scoring unit
    public static readonly ucumScoringUnitSelect = '[data-testid="measure-scoring-unit-text-input"]'


    public static readonly ucumScoringUnitfullName = '[aria-activedescendant="scoring-unit-dropdown-option-0"]'
    public static readonly ucumScoringUnitDropdownList = '[data-testid="measure-scoring-unit-text-input"]'
    public static readonly ucumScoringUnitCurrentValue = '[id="scoring-unit-dropdown"]'

    //Measure Observations
    public static readonly addDenominatorObservationLink = '[data-testid="add-measure-observation-denominator"]'
    public static readonly denominatorObservation = '[id="measure-observation-denominator"]'
    public static readonly denominatorAggregateFunction = '[id="measure-observation-aggregate-denominator"]'
    public static readonly removeDenominatorObservation = '[data-testid="measure-observation-denominator-remove"]'
    public static readonly measureObservationSelect = '[class="MuiMenuItem-root MuiMenuItem-gutters MuiButtonBase-root css-1km1ehz"]'
    public static readonly aggregateFunctionCount = '[data-value="Count"]'
    public static readonly aggregateFunctionMaximum = '[data-value="Maximum"]'
    public static readonly aggregateFunctionDropdownList = '[class="MuiMenuItem-root MuiMenuItem-gutters MuiButtonBase-root css-1km1ehz"]'
    public static readonly addNumeratorObservationLink = '[data-testid="add-measure-observation-numerator"]'
    public static readonly numeratorObservation = '[id="measure-observation-numerator"]'
    public static readonly numeratorAggregateFunction = '[id="measure-observation-aggregate-numerator"]'
    public static readonly removeNumeratorObservation = '[data-testid="measure-observation-numerator-remove"]'

    //Continuous Variable Measure Observation
    public static readonly MOToCodeValue = '[data-value="ToCode"]'
    public static readonly MOBooleanFunctionValue = '[data-value="booleanFunction"]'

    public static readonly cvMeasureObservation = '[id="measure-observation-cv-obs"]'
    public static readonly cvAggregateFunction = '[id="measure-observation-aggregate-cv-obs"]'

    //add measure group
    public static readonly addMeasureGroupButton = '[data-testid="add-measure-group-button"]'

    //update measure group
    public static readonly updateMeasureGroupConfirmationMsg = '.MuiDialogContent-root > div'
    public static readonly popUpConfirmationModal = '[class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-mbdu2s"]'
    public static readonly scoreUpdateConfirmModal = '[data-testid="update-measure-group-scoring-dialog"]'
    public static readonly scoreUpdateMGConfirmMsg = '[class="MuiDialogContent-root css-1ty026z"]'
    public static readonly updateMeasureGroupConfirmationUndoWarning = '[class="MuiTypography-root MuiTypography-body1 jss8 css-9l3uo3"]'
    public static readonly updateMeasureGroupConfirmationBtn = '[data-testid="update-measure-group-scoring-modal-agree-btn"]'
    public static readonly updatePopulationBasisConfirmationBtn = '[data-testid="update-measure-group-pop-basis-modal-agree-btn"]'

    //additional measure groups (assuming they exist)
    public static readonly measureGroupOne = '[data-testid="leftPanelMeasureInformation-MeasureGroup1"]'
    public static readonly measureGroupTwo = '[data-testid="leftPanelMeasureInformation-MeasureGroup2"]'
    public static readonly measureGroupThree = '[data-testid="leftPanelMeasureInformation-MeasureGroup3"]'
    public static readonly measureGroupFour = '[data-testid="leftPanelMeasureInformation-MeasureGroup4"]'
    public static readonly measureGroupFive = '[data-testid="leftPanelMeasureInformation-MeasureGroup5"]'

    //population basis
    public static readonly popBasis = '[data-testid="populationBasis"]'
    public static readonly popBasisOption = '#populationBasis-option-0'

    //Measure group description
    public static readonly measureGroupDescriptionBox = '[name="groupDescription"]'

    //Measure score Details
    public static readonly measureScoringUnit = "Ratio"

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = '[data-testid="population-criteria-success"]'

    //update button
    public static readonly confirmScoreUnitValueUpdateBtn = '[data-testid="group-form-update-btn"]'

    //left panel
    public static readonly leftPanelRiskAdjustmentTab = '#sideNavMeasurePopulationsRiskAdjustment'
    public static readonly leftPanelSupplementalDataTab = '[datatestid=leftPanelMeasurePopulationsSupplementalDataTab]'
    public static readonly leftPanelBaseConfigTab = '[datatestid="leftPanelMeasureBaseConfigurationTab"]'

    //QDM Base Configuration fields
    public static readonly qdmScoring = '[data-testid="scoring-select"]'
    public static readonly qdmScoringCohort = '[data-testid="scoring-option-COHORT"]'
    public static readonly qdmScoringRatio = '[data-testid="scoring-option-RATIO"]'
    public static readonly qdmScoringCV = '[data-testid="scoring-option-CONTINUOUS_VARIABLE"]'
    public static readonly qdmScoringProportion = '[data-testid="scoring-option-PROPORTION"]'
    public static readonly qdmType = '[id="base-configuration-types"]'

    //Risk Adjustment variables
    public static readonly riskAdjustmentDefinitionSelect = '[data-testid=ArrowDropDownIcon]'
    public static readonly riskAdjustmentDefinitionDropdown = '[id="risk-adjustment-listbox"]'
    public static readonly riskAdjustmentTextBox = '[id="risk-adjustment"]'
    public static readonly cancelIcon = '[data-testid=CancelIcon]'
    public static readonly riskAdjustmentDescriptionTextBox = '[class=risk-description]'
    public static readonly saveRiskAdjustments = '[data-testid="measure-Risk Adjustment-save"]'
    public static readonly riskAdjustmentSaveSuccessMsg = '[class="toast success"]'

    //Supplemental data elements
    public static readonly supplementalDataDefinitionSelect = '[data-testid=supplementalDataElements]'
    public static readonly supplementalDataDefinitionDropdown = '#supplementalDataElements-listbox'
    public static readonly supplementalDataDefinitionDescriptionTextBox = '[class="sc-crXcEl cAFOFV"]'
    public static readonly saveSupplementalDataElements = '[data-testid="supplementalDataElement-save"]'
    public static readonly supplementalDataElementsSaveSuccessMsg = '[data-testid="supplementalDataElement-success"]'
    public static readonly removeCloseDefinitionSelection = '[data-testid="CancelIcon"]'
    public static readonly discardChangesBtn = '[data-testid=cancel-button]'
    public static readonly discardChangesConfirmationMsg = '.MuiDialogContent-root'
    public static readonly discardChangesContinueBtn = '[data-testid="discard-dialog-continue-button"]'
    public static readonly supplementalDataDefinitionTextBox = '#supplementalDataElements'


    public static createMeasureGroupforProportionMeasure(): void {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringProportion)
        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExceptionSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')
        cy.get(this.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(this.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(this.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    }

    public static createMeasureGroupforRatioMeasure(): void {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        Utilities.setMeasureGroupType()

        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringRatio)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.denominatorExclusionSelect, 'denom')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorSelect, 'num')
        Utilities.dropdownSelect(MeasureGroupPage.numeratorExclusionSelect, 'num')
        cy.get(this.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    }

    public static createMeasureGroupforContinuousVariableMeasure(): void {

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('exist')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).should('be.visible')
        cy.get(MeasureGroupPage.measureGroupTypeSelect).click()
        cy.get(MeasureGroupPage.measureGroupTypeCheckbox).each(($ele) => {
            if ($ele.text() == "Text") {
                cy.wrap($ele).should('exist')
                cy.wrap($ele).focus()
                cy.wrap($ele).click()
            }
        })
        cy.get(MeasureGroupPage.measureGroupTypeSelect).type('Process').type('{downArrow}').type('{enter}')
        Utilities.dropdownSelect(MeasureGroupPage.measureScoringSelect, MeasureGroupPage.measureScoringCV)

        Utilities.dropdownSelect(MeasureGroupPage.initialPopulationSelect, 'ipp')
        Utilities.dropdownSelect(MeasureGroupPage.measurePopulationSelect, 'denom')
        cy.get(MeasureGroupPage.cvMeasureObservation).click()
        cy.get(MeasureGroupPage.measureObservationSelect).should('exist')
        cy.get(MeasureGroupPage.measureObservationSelect).should('be.visible')
        Utilities.waitForElementVisible(MeasureGroupPage.MOBooleanFunctionValue, 20700)
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('exist')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).should('be.visible')
        cy.get(MeasureGroupPage.MOBooleanFunctionValue).click()
        cy.get(MeasureGroupPage.cvAggregateFunction).click()
        cy.get(MeasureGroupPage.aggregateFunctionCount).click()
        cy.get(this.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    }

    public static CreateProportionMeasureGroupAPI(twoMeasureGroups?: boolean, altUser?: boolean, PopIniPopP?: string, PopNumP?: string, PopDenomP?: string, popBasis?: string): string {
        let user = ''
        let measurePath = ''
        let measureGroupPath = ''
        let measureScoring = 'Proportion'
        if ((popBasis == undefined) || (popBasis === null) || (popBasis == 'Boolean')) { popBasis = 'boolean' }
        if ((PopIniPopP == undefined) || (PopIniPopP === null)) { PopIniPopP = 'Surgical Absence of Cervix' }
        if ((PopNumP == undefined) || (PopNumP === null)) { PopNumP = 'Surgical Absence of Cervix' }
        if ((PopDenomP == undefined) || (PopDenomP === null)) { PopDenomP = 'Surgical Absence of Cervix' }
        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }
        if (twoMeasureGroups === true) {
            measurePath = 'cypress/fixtures/measureId2'
            measureGroupPath = 'cypress/fixtures/groupId2'
        }
        else {
            measurePath = 'cypress/fixtures/measureId'
            measureGroupPath = 'cypress/fixtures/groupId'
        }

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": popBasis,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPopP
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenomP
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorException",
                                "definition": ""
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNumP
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": ""
                            }
                        ],
                        "scoringUnit": {
                            "label": "ml milliLiters",
                            "value": {
                                "code": "ml",
                                "name": "milliLiters",
                                "guidance": "",
                                "system": "https://clinicaltables.nlm.nih.gov/"
                            }
                        },
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile(measureGroupPath, response.body.id)
                })
            })
        })
        return user
    }

    public static CreateRatioMeasureGroupAPI(twoMeasureGroups?: boolean, altUser?: boolean, PopIniPopP?: string, PopNumP?: string, PopDenomP?: string, popBasis?: string): string {
        let user = ''
        let measurePath = ''
        let measureGroupPath = ''
        let measureScoring = 'Ratio'
        if ((popBasis == undefined) || (popBasis === null) || (popBasis == 'Boolean')) { popBasis = 'boolean' }
        if ((PopIniPopP == undefined) || (PopIniPopP === null)) { PopIniPopP = 'Surgical Absence of Cervix' }
        if ((PopNumP == undefined) || (PopNumP === null)) { PopNumP = 'Surgical Absence of Cervix' }
        if ((PopDenomP == undefined) || (PopDenomP === null)) { PopDenomP = 'Surgical Absence of Cervix' }
        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }
        if (twoMeasureGroups === true) {
            measurePath = 'cypress/fixtures/measureId2'
            measureGroupPath = 'cypress/fixtures/groupId2'
            //cy.writeFile('cypress/fixtures/measureId2', response.body.id)
        }
        else {
            measurePath = 'cypress/fixtures/measureId'
            measureGroupPath = 'cypress/fixtures/groupId'
        }

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": popBasis,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPopP
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenomP
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenomP
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNumP
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumP
                            }
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile(measureGroupPath, response.body.id)
                })
            })
        })
        return user
    }

    public static CreateCohortMeasureGroupAPI(twoMeasureGroups?: boolean, altUser?: boolean, PopIniPopP?: string, popBasis?: string): string {
        let user = ''
        let measurePath = ''
        let measureGroupPath = ''
        let measureScoring = 'Cohort'
        if ((popBasis == undefined) || (popBasis === null) || (popBasis == 'Boolean')) { popBasis = 'boolean' }
        if ((PopIniPopP == undefined) || (PopIniPopP === null)) { PopIniPopP = 'Initial PopulationOne' }
        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }
        if (twoMeasureGroups === true) {
            measurePath = 'cypress/fixtures/measureId2'
            measureGroupPath = 'cypress/fixtures/groupId2'
            //cy.writeFile('cypress/fixtures/measureId2', response.body.id)
        }
        else {
            measurePath = 'cypress/fixtures/measureId'
            measureGroupPath = 'cypress/fixtures/groupId'
        }

        //Add Measure Group to the Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile(measurePath).should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups/',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": measureScoring,
                        "populationBasis": popBasis,
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": PopIniPopP
                            }/* ,
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": PopDenomP
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominatorExclusion",
                                "definition": PopDenomP
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": PopNumP
                            },
                            {
                                "id": uuidv4(),
                                "name": "numeratorExclusion",
                                "definition": PopNumP
                            } */
                        ],
                        "measureGroupTypes": [
                            "Outcome"
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile(measureGroupPath, response.body.id)
                })
            })
        })
        return user
    }
}
