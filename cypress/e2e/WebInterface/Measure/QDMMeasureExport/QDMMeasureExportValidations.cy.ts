import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
const now = require('dayjs')
let qdmMeasureCQL = MeasureCQL.CQLQDMObservationRun
let updatedMeasureCQL = 'library TestLibrary1685544523170534 version \'0.0.000\'\n' +
    'using QDM version \'5.6\'\n' +
    '\n' +
    'valueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\n' +
    'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\n' +
    'valueset "Payer": \'urn:oid:2.16.840.1.114222.4.11.3591\'\n' +
    'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\n' +
    '\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "SDE Ethnicity":\n' +
    '  ["Patient Characteristic Ethnicity": "Ethnicity"]\n' +
    'define "SDE Payer":\n' +
    '  ["Patient Characteristic Payer": "Payer"]\n' +
    'define "SDE Race":\n' +
    '  ["Patient Characteristic Race": "Race"]\n' +
    'define "SDE Sex":\n' +
    '  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n' +
    'define "ipp":\n' +
    '\ttrue\n' +
    'define "d":\n' +
    '\t true\n' +
    'define "n":\n' +
    '\ttrue'

describe('Error Message on Measure Export when the Measure does not have Description, Steward and Developers', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsWithoutDescriptionStewardsandDevelopersAPI(newMeasureName, newCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupWithoutTypeAPI(false, false, 'Initial Population')
        OktaLogin.Login()
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have Description, Steward, Developers, and Type', () => {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Measure Developers')
            cy.get('[class="error-message"] > ul > :nth-child(2)').should('contain.text', 'Missing Steward')
            cy.get('[class="error-message"] > ul > :nth-child(3)').should('contain.text', 'Missing Description')
            cy.get('[class="error-message"] > ul > :nth-child(4)').should('contain.text', 'Measure Type is required')

        })
    })
})

describe('Error Message on Measure Export when the Measure has missing/invalid CQL', () => {

    beforeEach('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        OktaLogin.Login()
    })

    afterEach('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have CQL', () => {

        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.CQLMessageSuccess).should('contain.text', 'CQL updated successfully')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            //Need to re visit once MAT-6976 is fixed
            //cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing CQL')

        })
    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {

        //Update Measure CQL with errors
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}' +
            '{downArrow}{downArrow}{downArrow}{downArrow}{backspace}{backspace}{backspace}' +
            '{backspace}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            //Need to re visit once MAT-6976 is fixed
            // cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Contains Errors')

        })
    })
})

describe('Error Message on Measure Export when the Measure does not have Population Criteria', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', false, qdmMeasureCQL)

        OktaLogin.Login()
        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have Population Criteria', () => {

        cy.get(Header.measures).click()

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Population Criteria')

        })
    })
})

describe('Error Message on Measure Export when the Population Criteria does not match', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(newMeasureName, newCqlLibraryName, 'Cohort', false, qdmMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Numerator')

        OktaLogin.Login()
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Population Criteria does not match with CQL', () => {

        cy.get(Header.measures).click()

        MeasuresPage.measureAction("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(updatedMeasureCQL)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            Utilities.waitForElementVisible('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=measure-action-' + fileContents + ']', 30000)
            cy.get('[data-testid=measure-action-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=measure-action-' + fileContents + ']').click()

            Utilities.waitForElementVisible('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=view-measure-' + fileContents + ']').should('be.visible')
            Utilities.waitForElementEnabled('[data-testid=export-measure-' + fileContents + ']', 30000)
            cy.get('[data-testid=export-measure-' + fileContents + ']').should('be.enabled')
            cy.get('[data-testid=export-measure-' + fileContents + ']').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Populations Return Types are invalid')

        })
    })
})

