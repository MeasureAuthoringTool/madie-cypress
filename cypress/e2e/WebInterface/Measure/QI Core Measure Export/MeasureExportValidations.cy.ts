import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { v4 as uuidv4 } from 'uuid'
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"

const timestamp = Date.now()
let measureName = 'QiCoreExportValidations' + timestamp
let CqlLibraryName = 'QiCoreExportValidationsLib' + timestamp
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let measureCQL = MeasureCQL.SBTEST_CQL
let updatedMeasureCQL = 'library SimpleFhirLibrary version \'0.0.004\'\n' +
    'using FHIR version \'4.0.1\'\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "ipp":\n' +
    'true\n' +
    'define "denom":\n' +
    '"ipp"'

/*
   Tests below all involve failures of the export process.
   EditMeasurePage.actionCenter() assumes success, so we can't use it
*/

describe('Error Message on Measure Export when the Measure does not have Description, Steward and Developers', () => {

    before('Create New Measure and Login', () => {

        OktaLogin.setupUserSession(false)

        //Create Measure with out Steward and Developer
        cy.getCookie('accessToken').then((accessToken) => {
            cy.request({
                url: '/api/measure?addDefaultCQL=false',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken.value
                },
                body: {
                    "measureName": measureName,
                    "cqlLibraryName": CqlLibraryName,
                    "model": 'QI-Core v4.1.1',
                    "versionId": uuidv4(),
                    "measureSetId": uuidv4(),
                    'cql': measureCQL,
                    "ecqmTitle": 'eCQMTitle',
                    'measurementPeriodStart': mpStartDate + "T00:00:00.000Z",
                    'measurementPeriodEnd': mpEndDate + "T00:00:00.000Z"
                }
            }).then((response) => {
                let currentUser = Cypress.env('selectedUser')
                expect(response.status).to.eql(201)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureId', response.body.id)
                cy.writeFile('cypress/fixtures/' + currentUser + '/versionId', response.body.versionId)
                cy.writeFile('cypress/fixtures/' + currentUser + '/measureSetId', response.body.measureSetId)
            })
        })
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Description, Steward and Developers', () => {
        let currentUser = Cypress.env('selectedUser')

        cy.get(Header.mainMadiePageButton).click()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {

            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Measure Developers')
            cy.get('[data-testid="error-message"] > ul > :nth-child(2)').should('contain.text', 'Missing Steward')
            cy.get('[data-testid="error-message"] > ul > :nth-child(3)').should('contain.text', 'Missing Description')
        })
    })
})

describe('Error Message on Measure Export when the Measure has missing/invalid CQL', () => {

    beforeEach('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    afterEach('Log out and Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have CQL', () => {
        let currentUser = Cypress.env('selectedUser')
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get('.toast').should('contain.text', 'CQL return types do not match population criteria! Test Cases will not execute until this issue is resolved.')

        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
        })
    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {
        let currentUser = Cypress.env('selectedUser')
        //Update Measure CQL with errors
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView()
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Contains Errors')
        })
    })
})

describe('Error Message on Measure Export when the Measure does not have Population Criteria', () => {

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Log out and Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Population Criteria', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Population Criteria')
        })
    })
})

describe('Error Message on Measure Export when the Population Criteria does not match', () => {

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.Login()
    })

    after('Log out and Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify Error Message on Measure Export when the Population Criteria does not match with CQL', () => {
        let currentUser = Cypress.env('selectedUser')
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(updatedMeasureCQL)
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.errorMessage).should('contain.text', 'CQL return types do not match population criteria! Test Cases will not execute until this issue is resolved.')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Populations Return Types are invalid')
        })
    })
})

describe('Error Message on Measure Export when the PC does not have Improvement Notation set', () => {

    before('Create New Measure and Login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        OktaLogin.UILogout()
    })

    after('Log out and Cleanup', () => {

        Utilities.deleteMeasure()
    })

    it('Verify Error Message on Measure Export when Population Criteria does not have IN set', () => {
        let currentUser = Cypress.env('selectedUser')
        // based on CreateProportionMeasureGroupAPI, but hardcoded values for this test
        cy.getCookie('accessToken').then((accessToken) => {
            cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
                cy.request({
                    url: '/api/measures/' + fileContents + '/groups',
                    method: 'POST',
                    headers: {
                        authorization: 'Bearer ' + accessToken.value
                    },
                    body: {
                        "id": fileContents,
                        "scoring": 'Proportion',
                        "populationBasis": 'boolean',
                        "populations": [
                            {
                                "id": uuidv4(),
                                "name": "initialPopulation",
                                "definition": 'ipp'
                            },
                            {
                                "id": uuidv4(),
                                "name": "denominator",
                                "definition": 'denom'
                            },
                            {
                                "id": uuidv4(),
                                "name": "numerator",
                                "definition": 'num'
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
                        ],
                        "stratifications": [
                        ]
                    }
                }).then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body.id).to.be.exist
                    cy.writeFile('cypress/fixtures/measureGroupId', response.body.id)
                })
            })
        })

        OktaLogin.Login()

        cy.readFile('cypress/fixtures/' + currentUser + '/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'At least one Population Criteria is missing Improvement Notation')
        })
    })
})

describe('Error Message on Measure Export for Publish when measure was versioned before Madie 2.2.0', () => {

    // this test will rely on PROD data being available in the lower environments
    // this measure must have been versioned prior to Madie 2.2.0 (4/9/2025)
    const specialMeasureName = 'Screening for Abnormal Glucose Metabolism in Patients at Risk of Developing Diabetes: FHIR'

    it('Verify error message when not able to perform Export for Publish', () => {

        OktaLogin.Login()

        // navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).click()

        Utilities.waitForElementVisible('.measures-list', 150500)

        // search for specific measure - last on the list
        cy.get(MeasuresPage.searchInputBox).clear().type(specialMeasureName).type('{enter}')
        cy.get('[data-testid="row-item"]').last().contains('View').click()

        // perform export for publish
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        cy.get(EditMeasurePage.editMeasureExportActionBtn).should('be.visible')
        cy.get(EditMeasurePage.editMeasureExportActionBtn).should('be.enabled')
        cy.get(EditMeasurePage.editMeasureExportActionBtn).click()

        Utilities.waitForElementVisible(MeasuresPage.exportPublishingOption, 50000)
        cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Export for Publishing').click()

        // verify error
        cy.get('.loading-title').should('contain.text', 'Your download could not be completed')
        cy.get('.error-message').should('contain.text', 'Measure cannot be exported for publishing because it was versioned prior to MADiE version 2.2.0. Please use a newer version or select "Export" for this measure.')
    })
})
