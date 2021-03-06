import {MeasuresPage} from "./MeasuresPage"
import {EditMeasurePage} from "./EditMeasurePage"
import {CQLEditorPage} from "./CQLEditorPage"
import { Environment } from "./Environment"

export class MeasureGroupPage {

    //tabs on Measure Group page
    public static readonly populationTab = '[data-testid="populations-tab"]'
    public static readonly stratificationTab = '[data-testid="stratifications-tab"]'
    public static readonly reportingTab = '[data-testid="reporting-tab"]'
    public static readonly deleteGroupbtn = '[data-testid="group-form-delete-btn"]'
    public static readonly deleteMeasureGroupModal = '[data-testid="delete-measure-group-dialog"]'
    
    //Reporting tab fields
    public static readonly rateAggregation = '[data-testid="rateAggregationText"]'
    public static readonly improvementNotationSelect = '[data-testid="improvement-notation-select"]'

    //Measure Group Type
    public static readonly measureGroupTypeSelect = '[data-testid="measure-group-type-dropdown"]'
    public static readonly measureGroupTypeCheckbox = '[class="MuiMenuItem-root MuiMenuItem-gutters MuiButtonBase-root css-1km1ehz"]'
    public static readonly measureGroupTypeDropdownBtn = '[class="MuiBackdrop-root MuiBackdrop-invisible css-esi9ax"]'
    
    //Scoring drop-down box
    public static readonly measureScoringSelect = '[data-testid="scoring-unit-select"]'
    public static readonly saveMeasureGroupDetails = '[data-testid="group-form-submit-btn"]'

    //Populations
    public static readonly initialPopulationSelect = '[id="population-select-initial-population"]'
    public static readonly denominatorSelect = '[id="population-select-denominator"]'
    public static readonly denominatorExclusionSelect = '[id="population-select-denominator-exclusion"]'
    public static readonly denominatorExceptionSelect = '[id="population-select-denominator-exception"]'
    public static readonly numeratorSelect = '[id="population-select-numerator"]'
    public static readonly numeratorExclusionSelect = '[id="population-select-numerator-exclusion"]'
    public static readonly measurePopulationSelect = '[id="population-select-measure-population"]'
    public static readonly measurePopulationExclusionSelect = '[id="population-select-measure-population-exclusion"]'

    //add measure group
    public static readonly addMeasureGroupButton = '[data-testid="add-measure-group-button"]'

    //additional measure groups (assuming thay exist)
    public static readonly measureGroupOne = '[data-testid="leftPanelMeasureInformation-MeasureGroup1"]'
    public static readonly measureGroupTwo = '[data-testid="leftPanelMeasureInformation-MeasureGroup2"]'
    public static readonly measureGroupThree = '[data-testid="leftPanelMeasureInformation-MeasureGroup3"]'
    public static readonly measureGroupFour = '[data-testid="leftPanelMeasureInformation-MeasureGroup4"]'
    public static readonly measureGroupFive = '[data-testid="leftPanelMeasureInformation-MeasureGroup5"]'

    //Measure group description
    public static readonly measureGroupDescriptionBox = '[name="groupDescription"]'

    //Measure score Details
    public static readonly measureScoringUnit = "Ratio"

    //saved message
    public static readonly successfulSaveMeasureGroupMsg = '.MuiAlert-message.css-1w0ym84'

    //update button
    public static readonly confirmScoreUnitValueUpdateBtn = '[data-testid="group-form-update-btn"]'

    public static createMeasureGroupforProportionMeasure () : void {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(this.measureScoringSelect).select('Proportion')
        cy.get(this.initialPopulationSelect).select('ipp')
        cy.get(this.denominatorSelect).select('denom')
        cy.get(this.numeratorSelect).select('num')
        cy.get(this.numeratorExclusionSelect).select('num')
        cy.get(this.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(this.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(this.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')
    }

    public static createMeasureGroupforRatioMeasure () : void {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Add CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.readFile('cypress/fixtures/CQLForTestCaseExecution.txt').should('exist').then((fileContents) => {
            cy.get(EditMeasurePage.cqlEditorTextBox).type(fileContents)
        })

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')

        //Create Measure Group
        cy.get(EditMeasurePage.measureGroupsTab).click()

        cy.get(MeasureGroupPage.measureScoringSelect).select('Ratio')
        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.denominatorExclusionSelect).select('ipp') //related to bug 4497
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('exist')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).should('be.visible')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')

    }

    public static CreateProportionMeasureGroupAPI(twoMeasureGroups?: boolean, altUser?: boolean): string {
        let user = ''
        let measurePath = ''
        let measureGroupPath = ''
        let measureScoring = 'Proportion'
        let PopIniPop = 'SDE Payer'
        let PopNum = 'SDE Race'
        let PopDenom = 'SDE Sex'
        if (altUser)
        {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else
        {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }
        if (twoMeasureGroups === true)
        {
            measurePath = 'cypress/fixtures/measureId2'
            measureGroupPath = 'cypress/fixtures/groupId2'
            //cy.writeFile('cypress/fixtures/measureId2', response.body.id)
        }
        else
        {
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
                        "populations": [
                                {
                                    "name": "initialPopulation",
                                    "definition": PopIniPop
                                },
                                {
                                    "name": "denominator",
                                    "definition": PopDenom
                                },
                                {
                                    "name": "numerator",
                                    "definition": PopNum
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
}
