import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { Utilities } from '../../../../Shared/Utilities'
import { MeasureGroupPage } from '../../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../../Shared/EditMeasurePage'
import { Header } from '../../../../Shared/Header'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import { CQLEditorPage } from '../../../../Shared/CQLEditorPage'
import { LandingPage } from '../../../../Shared/LandingPage'
import { TestData } from '../../../../Shared/TestData'

const timestamp = Date.now()
let measureName: string
let CqlLibraryName: string
let setupSequence = 0

function useUniqueMeasureNames(): void {
    const suffix = `${timestamp}${++setupSequence}`
    measureName = `QiCoreExportValidations${suffix}`
    CqlLibraryName = `QiCoreExportValidationsLib${suffix}`
}
const now = require('dayjs')
let mpStartDate = now().subtract('1', 'year').format('YYYY-MM-DD')
let mpEndDate = now().format('YYYY-MM-DD')
let measureCQL = MeasureCQL.SBTEST_CQL
let updatedMeasureCQL =
    "library SimpleFhirLibrary version '0.0.004'\n" +
    "using FHIR version '4.0.1'\n" +
    "include FHIRHelpers version '4.1.000' called FHIRHelpers\n" +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n' +
    'parameter "Measurement Period" Interval<DateTime>\n' +
    'context Patient\n' +
    'define "ipp":\n' +
    'true\n' +
    'define "denom":\n' +
    '"ipp"'

const invalidCqlDefinition = 'define "Invalid CQL": MissingExpression'

describe('Error Message on Measure Export when the Measure does not have Description, Steward and Developers', () => {
    before('Create New Measure and Login', () => {
        useUniqueMeasureNames()
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore4, {
            measureCql: measureCQL,
            blankMetadata: true,
            ecqmTitle: 'eCQMTitle',
            mpStartDate,
            mpEndDate
        })
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'ipp', '', '', 'num', '', 'denom')
        TestData.saveMeasureCql(measureCQL).then(TestData.expectSavedMeasureCql)
        OktaLogin.SessionLogin()
        return cy.then(() => undefined)
    })

    after('Cleanup', () => {
        return Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Description, Steward and Developers', () => {
        cy.get(Header.mainMadiePageButton).click()
        MeasuresPage.selectMeasure()
        cy.get('[data-testid="export-action-btn"]').should('be.visible').and('be.enabled').click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Executable Export').click()

        cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
        cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should(
            'contain.text',
            'Missing Measure Developers'
        )
        cy.get('[data-testid="error-message"] > ul > :nth-child(2)').should('contain.text', 'Missing Steward')
        cy.get('[data-testid="error-message"] > ul > :nth-child(3)').should('contain.text', 'Missing Description')
    })
})

describe('Error Message on Measure Export when the Measure has missing/invalid CQL', () => {
    beforeEach('Create New Measure and Login', () => {
        useUniqueMeasureNames()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.SessionLogin()
        return cy.then(() => undefined)
    })

    afterEach('Log out and Cleanup', () => {
        return Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have CQL', () => {
        TestData.readMeasure().then((response) => {
            expect(response.status).to.eq(200)
            TestData.updateMeasure({
                ...response.body,
                cql: '',
                elmJson: '',
                elmXml: '',
                cqlErrors: false
            }).then((updateResponse) => {
                expect(updateResponse.status).to.eq(200)
                expect(updateResponse.body.cql).to.eq('')
            })
        })

        cy.intercept('PUT', '/api/measures/searches?*').as('measureListRefreshForExport')
        cy.get(Header.measures).click()
        MeasuresPage.waitForMeasureListRefresh('@measureListRefreshForExport')
        MeasuresPage.selectMeasure()
        cy.get('[data-testid="export-action-btn"]').should('be.visible').and('be.enabled').click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Executable Export').click()
        cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
    })

    it('Verify error message on Measure Export when the Measure CQL has errors', () => {
        TestData.readMeasure().then((response) => {
            expect(response.status).to.eq(200)
            TestData.updateMeasure({
                ...response.body,
                cql: `${response.body.cql}\n${invalidCqlDefinition}`,
                cqlErrors: true
            }).then((updateResponse) => {
                expect(updateResponse.status).to.eq(200)
                expect(updateResponse.body.cqlErrors).to.eq(true)
            })
        })

        cy.get(Header.measures).click()
        MeasuresPage.actionCenter('export', undefined, { expectExportSuccess: false })
        cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
        cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should('contain.text', 'CQL Contains Errors')
    })
})

describe('Error Message on Measure Export when the Measure does not have Population Criteria', () => {
    before('Create New Measure and Login', () => {
        useUniqueMeasureNames()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestData.saveMeasureCql(measureCQL).then(TestData.expectSavedMeasureCql)
        OktaLogin.SessionLogin()
        return cy.then(() => undefined)
    })

    after('Cleanup', () => {
        return Utilities.deleteMeasure()
    })

    it('Verify error message on Measure Export when the Measure does not have Population Criteria', () => {
        cy.get(Header.measures).click()
        MeasuresPage.selectMeasure()
        cy.get('[data-testid="export-action-btn"]').should('be.visible').and('be.enabled').click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Executable Export').click()

        cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
        cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should(
            'contain.text',
            'Missing Population Criteria'
        )
    })
})

describe('Error Message on Measure Export when the Population Criteria does not match', () => {
    before('Create New Measure and Login', () => {
        useUniqueMeasureNames()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(0, false, 'ipp', '', '', 'num', '', 'denom')

        OktaLogin.SessionLogin()
        return cy.then(() => undefined)
    })

    // after('Cleanup', () => {
    //     return Utilities.deleteMeasure()
    // })

    it('Verify Error Message on Measure Export when the Population Criteria does not match with CQL', () => {
        cy.get(Header.measures).click()

        MeasuresPage.actionCenter('edit')
        CQLEditorPage.openMonacoCqlEditor()
        CQLEditorPage.replaceMonacoCqlDocument(updatedMeasureCQL.replace('SimpleFhirLibrary', CqlLibraryName))
        cy.intercept('PUT', '/api/measures/**').as('saveMismatchedCql')
        CQLEditorPage.saveMonacoCql({ appendNewLine: true, waitForDisabled: true })
        cy.wait('@saveMismatchedCql').its('response.statusCode').should('eq', 200)

        cy.intercept('PUT', '/api/measures/searches?*').as('measureListRefreshForMismatchedExport')
        cy.get(Header.measures).click()
        MeasuresPage.waitForMeasureListRefresh('@measureListRefreshForMismatchedExport')
        MeasuresPage.actionCenter('export', undefined, { expectExportSuccess: false })
        cy.get('[data-testid="error-message"]').should('contain.text', 'Unable to Export measure.')
        cy.get('[data-testid="error-message"] > ul > :nth-child(1)').should(
            'contain.text',
            'CQL Populations Return Types are invalid'
        )
    })
})

describe('Error Message on Measure Export when the PC does not have Improvement Notation set', () => {
    before('Create New Measure and Login', () => {
        useUniqueMeasureNames()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        TestData.saveMeasureCql(measureCQL).then(TestData.expectSavedMeasureCql)
        MeasureGroupPage.CreateProportionMeasureGroupWithoutImprovementNotationAPI()
        OktaLogin.SessionLogin()
        return cy.then(() => undefined)
    })

    after('Cleanup', () => {
        return Utilities.deleteMeasure()
    })

    it('Verify Error Message on Measure Export when Population Criteria does not have IN set', () => {
        cy.intercept('PUT', '/api/measures/searches?*').as('measureListRefreshForImprovementNotationExport')
        cy.get(Header.measures).click()
        MeasuresPage.waitForMeasureListRefresh('@measureListRefreshForImprovementNotationExport')
        MeasuresPage.selectMeasure()
        cy.get('[data-testid="export-action-btn"]').should('be.visible').and('be.enabled').click()
        cy.get(MeasuresPage.exportNonPublishingOption).should('contain.text', 'Executable Export').click()

        cy.get('[class="error-message"]').should('contain.text', 'Unable to Export measure.')
        cy.get('[class="error-message"] > ul > :nth-child(1)').should(
            'contain.text',
            'At least one Population Criteria is missing Improvement Notation'
        )
    })
})

describe('Error Message on Measure Export for Publish when measure was versioned before Madie 2.2.0', () => {
    // this test will rely on PROD data being available in the lower environments
    // this measure must have been versioned prior to Madie 2.2.0 (4/9/2025)
    const specialMeasureName =
        'Screening for Abnormal Glucose Metabolism in Patients at Risk of Developing Diabetes: FHIR'

    it('Verify error message when not able to perform Export for Publish', () => {
        OktaLogin.SessionLogin()

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
        cy.get(MeasuresPage.exportPublishingOption).should('contain.text', 'Publishable Export').click()

        // verify error
        cy.get('.loading-title').should('contain.text', 'Your download could not be completed')
        cy.get('.error-message').should(
            'contain.text',
            'Measure cannot be exported for publishing because it was versioned prior to MADiE version 2.2.0. Please use a newer version or select "Executable Export" for this measure.'
        )
    })
})
