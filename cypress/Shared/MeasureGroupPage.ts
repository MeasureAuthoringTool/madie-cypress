import {MeasuresPage} from "./MeasuresPage"
import {EditMeasurePage} from "./EditMeasurePage"
import {CQLEditorPage} from "./CQLEditorPage"
import { Environment } from "./Environment"

export class MeasureGroupPage {

    //Scoring drop-down box
    public static readonly measureScoringSelect = '[data-testid="scoring-unit-select"]'
    public static readonly saveMeasureGroupDetails = '[data-testid="group-form-submit-btn"]'

    //Populations
    public static readonly initialPopulationSelect = '[name="population.initialPopulation"]'
    public static readonly denominatorSelect = '[name="population.denominator"]'
    public static readonly denominatorExclusionSelect = '[name="population.denominatorExclusion"]'
    public static readonly denominatorExceptionSelect = '[name="population.denominatorException"]'
    public static readonly numeratorSelect = '[name="population.numerator"]'
    public static readonly numeratorExclusionSelect = '[name="population.numeratorExclusion"]'
    public static readonly measurePopulationSelect = '[name="population.measurePopulation"]'
    public static readonly measurePopulationExclusionSelect = '[name="population.measurePopulationExclusion"]'

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

        cy.get(MeasureGroupPage.initialPopulationSelect).select('ipp')
        cy.get(MeasureGroupPage.denominatorSelect).select('denom')
        cy.get(MeasureGroupPage.numeratorSelect).select('num')
        cy.get(MeasureGroupPage.numeratorExclusionSelect).select('num')
        cy.get(MeasureGroupPage.saveMeasureGroupDetails).click()

        //validation successful save message
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('exist')
        cy.get(MeasureGroupPage.successfulSaveMeasureGroupMsg).should('contain.text', 'Population details for this group saved successfully.')

    }
    public static CreateProportionMeasureGroupAPI(twoMeasureGroups?: boolean, altUser?: boolean): string {
        let user = ''
        let measurePath = ''
        let measureGroupPath = ''
        let measureScoring = 'Proportion'
        let PopIniPop = 'SDE Payer'
        let PopNum = 'SDE Race'
        let PopDenom = 'SDE Sex'
        let PopDenex = 'Absence of Cervix'
        let PopDenexcep = 'SDE Ethnicity'
        let PopNumex = 'Surgical Absence of Cervix'
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
            //cy.writeFile('cypress/fixtures/measureId', response.body.id)
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
                        "scoring": measureScoring,
                        "population": 
                        {
                            "initialPopulation": PopIniPop,
                            "denominator": PopDenom,
                            "denominatorExclusion": PopDenex,
                            "denominatorException": PopDenexcep,
                            "numerator": PopNum,
                            "numeratorExclusion": PopNumex
                        }
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
