import { CreateMeasurePage, SupportedModels, CreateMeasureOptions } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"
import { MeasureGroupPage } from "../../../../Shared/MeasureGroupPage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { Header } from "../../../../Shared/Header"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { LandingPage } from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let randValue = (Math.floor((Math.random() * 1000) + 1))
let newMeasureName = ''
let newCqlLibraryName = ''
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

const measureData: CreateMeasureOptions = {
    measureCql: qdmMeasureCQL,
    ecqmTitle: measureName,
    cqlLibraryName: CqlLibraryName,
    measureScoring: 'Cohort',
    patientBasis: 'false'
}

    /*
        Tests below all involve failures of the export process.
        EditMeasurePage.actionCenter() assumes success, so we can't use it
    */

describe('Error Message on Measure Export when the Measure does not have Description, Steward and Developers', () => {

    before('Create New Measure and Login', () => {

        newMeasureName = measureName + randValue
        newCqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()

        const measureOptions: CreateMeasureOptions = {
            measureCql: qdmMeasureCQL,
            measureScoring: 'Cohort',
            patientBasis: 'false',
            blankMetadata: true
        }
        CreateMeasurePage.CreateMeasureAPI(newMeasureName, newCqlLibraryName, SupportedModels.QDM, measureOptions)
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
        MeasureGroupPage.CreateCohortMeasureGroupWithoutTypeAPI(false, false, 'Initial Population', 'Encounter')
        OktaLogin.Login()
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have Description, Steward, Developers, and Type', () => {

        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

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

        measureData.ecqmTitle = measureName + randValue
        measureData.cqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Initial Population')

        OktaLogin.Login()
    })

    afterEach('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Measure does not have CQL', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(EditMeasurePage.CQLMessageSuccess).should('contain.text', 'CQL updated successfully')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
        })
    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {

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
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Contains Errors')
        })
    })
})

describe('Error Message on Measure Export when the Measure does not have Population Criteria', () => {

    before('Create New Measure and Login', () => {

        measureData.ecqmTitle = measureName + randValue
        measureData.cqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
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
            cy.get('[data-testid="measure-name-' + fileContents + '_select"]').find('[class="px-1"]').find('[class=" cursor-pointer"]').scrollIntoView().click()
            cy.get('[data-testid="export-action-btn"]').should('be.visible')
            cy.get('[data-testid="export-action-btn"]').should('be.enabled')
            cy.get('[data-testid="export-action-btn"]').click()
            cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Export').click()

            cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
            cy.get('[class="error-message"] > ul > :nth-child(1)').should('contain.text', 'Missing Population Criteria')
        })
    })
})

describe('Error Message on Measure Export when the Population Criteria does not match', () => {

    before('Create New Measure and Login', () => {

        measureData.ecqmTitle = measureName + randValue
        measureData.cqlLibraryName = CqlLibraryName + randValue

        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Numerator')

        OktaLogin.Login()
    })

    after('Cleanup', () => {

        Utilities.deleteMeasure(newMeasureName, newCqlLibraryName)
    })

    it('Verify error message on Measure Export when the Population Criteria does not match with CQL', () => {

        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{selectall}{backspace}{selectall}{backspace}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type(updatedMeasureCQL)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        cy.get(EditMeasurePage.libWarningTopMsg).should('contain.text', 'Library statement was incorrect. MADiE has overwritten it.')

        cy.get(Header.measures).click()
        cy.readFile('cypress/fixtures/measureId').should('exist').then((fileContents) => {
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

describe('Error Message on Measure Export for Publish when measure was versioned before Madie 2.2.0', () => {

    // this test will rely on PROD data being available in the lower environments
    // this measure must have been versioned prior to Madie 2.2.0 (4/9/2025)
    const specialMeasureName = 'Antithrombotic Therapy by End of Hospital Day 2'
    
    it('Verify error message when not able to perform Export for Publish', () => {

        OktaLogin.Login()

        // navigate to the all measures tab
        Utilities.waitForElementVisible(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.visible')
        Utilities.waitForElementEnabled(LandingPage.allMeasuresTab, 30000)
        cy.get(LandingPage.allMeasuresTab).should('be.enabled')
        cy.get(LandingPage.allMeasuresTab).click()

        // search for specific measure - it should be 1st on the search result
        cy.get(MeasuresPage.searchInputBox).clear().type(specialMeasureName).type('{enter}')
        cy.contains('View').click()

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
