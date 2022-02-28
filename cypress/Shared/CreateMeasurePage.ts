import {LandingPage} from "./LandingPage"

export class CreateMeasurePage {

    public static readonly createMeasureButton = 'button[data-testid="create-new-measure-save-button"]'
    public static readonly cancelButton = '[data-testid=create-new-measure-cancel-button]'
    public static readonly measureNameTextbox = '[data-testid=measure-name-text-field]'
    public static readonly measureModelDropdown = '#mui-1'
    public static readonly measureModelQICore = '[data-testid="measure-model-option-QI-Core"]'
    public static readonly measureModelFieldLevelError = '#mui-1-helper-text'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name"]'
    public static readonly measureNameFieldLevelError = '[data-testid=measureName-helper-text]'
    public static readonly cqlLibraryNameFieldLevelError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly cqlLibraryNameDuplicateErrorMsg = '[data-testid="server-error-alerts"]'
    public static readonly measureScoringDropdown = '#measureScoring'
    public static readonly measureScoringFieldLevelError = '#measureScoring-helper-text'
    public static readonly measureScoringCohort = '[data-testid=measure-scoring-option-Cohort]'
    public static readonly measureScoringContinuousVariable = '[data-testid="measure-scoring-option-Continuous Variable"]'
    public static readonly measureScoringProportion = '[data-testid=measure-scoring-option-Proportion]'
    public static readonly measureScoringRatio = '[data-testid=measure-scoring-option-Ratio]'


    public static clickCreateMeasureButton() : void {

        let alias = 'measure' + (Date.now()+1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/measure').as(alias)

        cy.get(this.createMeasureButton).click()

        //saving measureID to file to use later
        cy.wait('@' + alias).then(({response}) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/downloads/measureId', response.body.id)
        })
    }

    public static CreateQICoreMeasure(measureName: string,CqlLibraryName: string,measureScoring: string) : void {

        cy.log('Create ' +measureScoring+ ' Measure')
        cy.get(LandingPage.newMeasureButton).click()
        cy.get(this.measureNameTextbox).type(measureName)
        cy.get(this.measureModelDropdown).click()
        cy.get(this.measureModelQICore).click()
        cy.get(this.cqlLibraryNameTextbox).type(CqlLibraryName)
        cy.get(this.measureScoringDropdown).click()
        switch (measureScoring){
            case 'Cohort':
                cy.get(this.measureScoringCohort).click()
                break
            case 'Continuous Variable' :
                cy.get(this.measureScoringContinuousVariable).click()
                break
            case 'Proportion':
                cy.get(this.measureScoringProportion).click()
                break
            case 'Ratio':
                cy.get(this.measureScoringRatio).click()
                break
        }
        cy.wait(5000)
        cy.get(this.createMeasureButton).click()

        this.clickCreateMeasureButton()

        cy.log( measureScoring+ ' Measure created successfully')
    }
}
