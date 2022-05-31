import { Environment } from "./Environment"
import {LandingPage} from "./LandingPage"
import {MeasuresPage} from "./MeasuresPage"

export class CreateMeasurePage {

    public static readonly createMeasureButton = 'button[data-testid="create-new-measure-save-button"]'
    public static readonly cancelButton = '[data-testid=create-new-measure-cancel-button]'
    public static readonly measureNameTextbox = '[data-testid=measure-name-text-field]'
    public static readonly measureModelDropdown = '#model-select'
    public static readonly measureModelQICore = '[data-testid="measure-model-option-QI-Core"]'
    public static readonly measureModelFieldLevelError = '.MuiFormHelperText-root'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name"]'
    public static readonly measureNameFieldLevelError = '[data-testid=measureName-helper-text]'
    public static readonly cqlLibraryNameFieldLevelError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly serverErrorMsg = '[data-testid="server-error-alerts"]'
    public static readonly serverErrorMsgCloseIcon = '[data-testid="server-error-alerts"] [data-testid="CloseIcon"]'
    public static readonly serverErrorMsgMeasureCreation = '[data-testid="server-error-msg"]'
    public static readonly measureScoringDropdown = '#measureScoring'
    public static readonly measureScoringFieldLevelError = '.MuiFormHelperText-root'
    public static readonly measureScoringCohort = '[data-testid=measure-scoring-option-Cohort]'
    public static readonly measureScoringContinuousVariable = '[data-testid="measure-scoring-option-Continuous Variable"]'
    public static readonly measureScoringProportion = '[data-testid=measure-scoring-option-Proportion]'
    public static readonly measureScoringRatio = '[data-testid=measure-scoring-option-Ratio]'
    public static readonly measurementPeriodStartDate = '[name=measurementPeriodStart]'
    public static readonly measurementPeriodEndDate = '[name=measurementPeriodEnd]'
    public static readonly measurementPeriodStartDateError = '[data-testid=measurementPeriodStart-helper-text]'
    public static readonly measurementPeriodEndDateError = '[data-testid=measurementPeriodEnd-helper-text]'
    //body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.css-ekeie0 > div > div > div.alert-text > p
    //<p class="MuiTypography-root MuiTypography-body2 css-68o8xu" data-testid="server-error-msg">Measurement period end date should be greater than measurement period start date.</p>


    public static clickCreateMeasureButton() : void {

        let alias = 'measure' + (Date.now()+1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/measure').as(alias)

        cy.get(this.createMeasureButton).click()

        //saving measureID to file to use later
        cy.wait('@' + alias).then(({response}) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/fixtures/measureId', response.body.id)
        })
    }

    public static CreateQICoreMeasure(measureName: string,CqlLibraryName: string,measureScoring: string) : void {

        const now = require('dayjs')
        let mpStartDate = now().subtract('1', 'year').format('MM/DD/YYYY')
        let mpEndDate = now().format('MM/DD/YYYY')

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

        cy.get(CreateMeasurePage.measurementPeriodStartDate).type(mpStartDate)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type(mpEndDate)

        this.clickCreateMeasureButton()

        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        cy.log( measureScoring+ ' Measure created successfully')
    }

    public static CreateQICoreMeasureAPI(measureName: string, CqlLibraryName: string, measureScoring: string, measureCQL?: string, twoMeasures?: boolean, altUser?: boolean): string {

        let user = ''
        const now = require('dayjs')
        let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
        let mpEndDate = now().format('YYYY-MM-DD')

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

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': measureName,
                    'cqlLibraryName': CqlLibraryName,
                    'model': 'QI-Core',
                    'measureScoring': measureScoring,
                    'createdBy': user,
                    'cql': measureCQL,
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                }
            }).then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                if (twoMeasures === true)
                {
                    cy.writeFile('cypress/fixtures/measureId2', response.body.id)
                }
                else
                {
                    cy.writeFile('cypress/fixtures/measureId', response.body.id)
                }

            })
        })
        return user
    }
}