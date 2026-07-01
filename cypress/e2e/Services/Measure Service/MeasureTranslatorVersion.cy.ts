import { MeasureCQL } from '../../../Shared/MeasureCQL'
import { CreateMeasurePage, CreateMeasureOptions } from '../../../Shared/CreateMeasurePage'
import { Utilities } from '../../../Shared/Utilities'
import { OktaLogin } from '../../../Shared/OktaLogin'
import { MeasuresPage } from '../../../Shared/MeasuresPage'
import { EditMeasurePage } from '../../../Shared/EditMeasurePage'
import { CQLEditorPage } from '../../../Shared/CQLEditorPage'
import { MeasureGroupPage } from '../../../Shared/MeasureGroupPage'
import { TestData } from '../../../Shared/TestData'

const timestamp = Date.now()
const qicoreMeasureName = 'QICoreTranslatorVersion' + timestamp
const qicoreCqlLibraryName = 'QiCoreTranslatorVersionLibrary' + timestamp
const qicoreMeasureCQL = MeasureCQL.SBTEST_CQL
const qdmMeasureName = 'QDMTranslatorVersion' + timestamp
const qdmCqlLibraryName = 'QDMTranslatorVersionLibrary' + timestamp
const qdmMeasureCQL = MeasureCQL.QDMSimpleCQL

const expectedQiCoreVersion = '4.8.0'
const expectedQdmVersion = '4.8.0'
const measureData: CreateMeasureOptions = {}

describe('Measure Service: Translator Version for QI-Core Measure', () => {
    beforeEach('Create QI-Core Measure and Set Access Token', () => {
        CreateMeasurePage.CreateQICoreMeasureAPI(qicoreMeasureName, qicoreCqlLibraryName, qicoreMeasureCQL)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'ipp')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(EditMeasurePage.measureDetailsTab).click()
        cy.log('Updated CQL name, on measure, is ' + qicoreCqlLibraryName)
    })

    after('Delete Versioned Measure', () => {
        Utilities.deleteVersionedMeasure(qicoreCqlLibraryName, qicoreCqlLibraryName)
    })

    it('Get Translator version for QI-Core Measure', () => {
        TestData.requestTranslatorVersion('fhir').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.eql(expectedQiCoreVersion)
        })

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
            // versioned measures read translator version from ELM
            expect(response.body.elmJson).to.include(`"translatorVersion":"${expectedQiCoreVersion}"`)
        })
    })
})

describe('Measure Service: Translator Version for QDM Measure', () => {
    beforeEach('Create QDM Measure and Set Access Token', () => {
        measureData.ecqmTitle = qdmMeasureName
        measureData.cqlLibraryName = qdmCqlLibraryName
        measureData.measureScoring = 'Cohort'
        measureData.patientBasis = 'true'
        measureData.measureCql = qdmMeasureCQL

        CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI(measureData)
        MeasureGroupPage.CreateCohortMeasureGroupAPI(false, false, 'Patient16To23')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 40700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    after('Delete Versioned Measure', () => {
        Utilities.deleteVersionedMeasure(qdmMeasureName, qdmCqlLibraryName)
    })

    it('Get Translator version for QDM Measure', () => {
        TestData.requestTranslatorVersion('qdm').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.eql(expectedQdmVersion)
        })

        TestData.versionMeasure().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.version).to.include('1.0.000')
            // versioned measures read translator version from ELM
            expect(response.body.elmJson).to.include(`translatorVersion":"${expectedQdmVersion}"`)
        })
    })
})
