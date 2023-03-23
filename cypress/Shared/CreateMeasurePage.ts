import { Environment } from "./Environment"
import { LandingPage } from "./LandingPage"
import { MeasuresPage } from "./MeasuresPage"
import { v4 as uuidv4 } from 'uuid'

export class CreateMeasurePage {

    public static readonly createMeasureButton = 'button[data-testid="continue-button"]'
    public static readonly cancelButton = '[data-testid=create-new-measure-cancel-button]'
    public static readonly measureNameTextbox = '[data-testid=measure-name-text-field]'
    public static readonly measureModelDropdown = '#model-select'
    public static readonly measureModelQICore = '[data-testid="measure-model-option-QI-Core v4.1.1"]'
    public static readonly measureModelFieldLevelError = '.MuiFormHelperText-root'
    public static readonly eCQMAbbreviatedTitleTextbox = '[data-testid="ecqm-input"]'
    public static readonly eCQMAbbreviatedTitleFieldLevelError = '[data-testid="ecqmTitle-helper-text"]'
    public static readonly cqlLibraryNameTextbox = '[data-testid="cql-library-name"]'
    public static readonly measureNameFieldLevelError = '[data-testid=measureName-helper-text]'
    public static readonly cqlLibraryNameFieldLevelError = '[data-testid="cqlLibraryName-helper-text"]'
    public static readonly serverErrorMsg = '[data-testid="server-error-alerts"]'
    public static readonly serverErrorMsgCloseIcon = '[data-testid="server-error-alerts"]'
    public static readonly measurementPeriodStartDate = '[name=measurementPeriodStart]'
    public static readonly measurementPeriodEndDate = '[name=measurementPeriodEnd]'
    public static readonly measurementPeriodStartDateError = '[data-testid=create-measure-period-start-helper-text]'
    public static readonly measurementPeriodEndDateError = '[data-testid=create-measure-period-end-helper-text]'
    public static readonly editMeasurementPeriodEndDateError = '[data-testid=measurementPeriodEndDate-helper-text]'
    public static readonly editMeasurementPeriodStartDateError = '[data-testid=undefined-helper-text]'


    public static clickCreateMeasureButton(): void {

        let alias = 'measure' + (Date.now() + 1).toString()
        //setup for grabbing the measure create call
        cy.intercept('POST', '/api/measure').as(alias)

        cy.get(this.createMeasureButton).click()

        //saving measureID to file to use later
        cy.wait('@' + alias).then(({ response }) => {
            expect(response.statusCode).to.eq(201)
            cy.writeFile('cypress/fixtures/measureId', response.body.id)
            cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
        })
    }
    public static clickCreateDraftButton(): void {
        cy.readFile('cypress/fixtures/measureId').should('exist').then((measureID) => {


            let alias = 'draft' + (Date.now() + 1).toString()
            //setup for grabbing the measure create call
            cy.intercept('POST', '/api/measures/' + measureID + '/draft').as(alias)

            cy.get(MeasuresPage.createDraftContinueBtn).click()

            //saving measureID to file to use later
            cy.wait('@' + alias).then(({ response }) => {
                expect(response.statusCode).to.eq(201)
                cy.writeFile('cypress/fixtures/measureId', response.body.id)
            })
        })

    }

    public static CreateQICoreMeasure(measureName: string, CqlLibraryName: string, mpStartDate?: string, mpEndDate?: string): void {

        const now = require('dayjs')

        if (mpStartDate === undefined) {
            mpStartDate = now().subtract('1', 'year').format('MM/DD/YYYY')
        }

        if (mpEndDate === undefined) {
            mpEndDate = now().format('MM/DD/YYYY')
        }

        cy.get(LandingPage.newMeasureButton).click()
        cy.get(this.measureNameTextbox).type(measureName)
        cy.get(this.measureModelDropdown).click()
        cy.get(this.measureModelQICore).click()
        cy.get(this.eCQMAbbreviatedTitleTextbox).type('eCQMTitle01')
        cy.get(this.cqlLibraryNameTextbox).type(CqlLibraryName)

        cy.get(CreateMeasurePage.measurementPeriodStartDate).type(mpStartDate)
        cy.get(CreateMeasurePage.measurementPeriodEndDate).type(mpEndDate)

        this.clickCreateMeasureButton()

        cy.get(MeasuresPage.measureListTitles).should('be.visible')

        cy.log('Measure created successfully')
    }

    public static CreateQICoreMeasureAPI(measureName: string, CqlLibraryName: string, measureCQL?: string,
        twoMeasures?: boolean, altUser?: boolean, mpStartDate?: string, mpEndDate?: string): string {

        let user = ''
        const now = require('dayjs')
        let ecqmTitle = 'eCQMTitle'

        if (mpStartDate === undefined) {
            mpStartDate = now().subtract('2', 'year').format('YYYY-MM-DD')
        }

        if (mpEndDate === undefined) {
            mpEndDate = now().format('YYYY-MM-DD')
        }

        if (altUser) {
            cy.setAccessTokenCookieALT()
            user = Environment.credentials().harpUserALT
        }
        else {
            cy.setAccessTokenCookie()
            user = Environment.credentials().harpUser
        }

        //Create New Measure
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                failOnStatusCode: false,
                url: '/api/measure',
                headers: {
                    authorization: 'Bearer ' + accessToken.value
                },
                method: 'POST',
                body: {
                    'measureName': measureName,
                    'cqlLibraryName': CqlLibraryName,
                    'model': 'QI-Core v4.1.1',
                    'createdBy': user,
                    "ecqmTitle": ecqmTitle,
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z",
                    'versionId': uuidv4(),
                    'measureSetId': uuidv4(),
                    'cql': measureCQL,
                    'measureMetaData': {"steward": {"name": "SemanticBits",
                            "id": "64120f265de35122e68dac40",
                            "oid": "02c84f54-919b-4464-bf51-a1438f2710e2",
                            "url": "https://semanticbits.com/"}},
                    'programUseContext': {"code": "mips",
                        "display": "MIPS",
                        "codeSystem": "http://hl7.org/fhir/us/cqfmeasures/CodeSystem/quality-programs"}
                }
            }).then((response) => {
                console.log(response)
                expect(response.status).to.eql(201)
                expect(response.body.id).to.be.exist
                if (twoMeasures === true) {
                    cy.writeFile('cypress/fixtures/measureId2', response.body.id)
                    cy.writeFile('cypress/fixtures/versionId2', response.body.versionId)
                    cy.writeFile('cypress/fixtures/measureSetId2', response.body.measureSetId)
                }
                else {
                    cy.writeFile('cypress/fixtures/measureId', response.body.id)
                    cy.writeFile('cypress/fixtures/versionId', response.body.versionId)
                    cy.writeFile('cypress/fixtures/measureSetId', response.body.measureSetId)
                }

            })
        })
        return user
    }
}
