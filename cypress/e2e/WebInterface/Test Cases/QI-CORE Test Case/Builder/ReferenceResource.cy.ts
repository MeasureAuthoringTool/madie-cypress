import { CreateMeasurePage, SupportedModels } from '../../../../../Shared/CreateMeasurePage'
import { EditMeasurePage } from '../../../../../Shared/EditMeasurePage'
import {
    MeasureGroupPage,
    MeasureGroups,
    MeasureScoring,
    MeasureType,
    PopulationBasis
} from '../../../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../../Shared/OktaLogin'
import { TestCaseBuilder, Profile } from '../../../../../Shared/TestCaseBuilder'
import { TestCasesPage } from '../../../../../Shared/TestCasesPage'
import { TestData } from '../../../../../Shared/TestData'
import { Utilities } from '../../../../../Shared/Utilities'

const addNewReference = 'ID Not Present (Add New)'
const profileOptions = '[role="listbox"] [role="option"]'
const qiCorePatientProfile = 'http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient'
const usCorePatientProfile = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'
const fhirPatientProfile = 'http://hl7.org/fhir/StructureDefinition/Patient'
const qiCoreOrganizationProfile = 'http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-organization'
const usqcConditionProfile =
    'http://fhir.org/guides/onc/us-quality-core/StructureDefinition/us-quality-core-condition-encounter-diagnosis'
const qiCoreCqlFixture = 'cypress/fixtures/ReferenceResourceQICore.txt'
const usqcCqlFixture = 'cypress/fixtures/ReferenceResourceUSQC.txt'

const populations: MeasureGroups = {
    initialPopulation: 'Initial Population',
    denominator: 'Denominator',
    numerator: 'Numerator'
}

const patientBundle = (id: string, profile: string) =>
    JSON.stringify({
        resourceType: 'Bundle',
        type: 'collection',
        entry: [
            {
                fullUrl: `https://madie.cms.gov/Patient/${id}`,
                resource: {
                    resourceType: 'Patient',
                    id,
                    meta: { profile: [profile] }
                }
            }
        ]
    })

describe('Reference(Resource) test-case builder', () => {
    let measureName = ''
    let cqlLibraryName = ''
    let patientId = ''

    const createMeasureAndOpenBuilder = (
        model: SupportedModels,
        cqlFixturePath: string,
        patientProfile: string,
        suffix: string
    ) => {
        const timestamp = Date.now()
        patientId = `reference-resource-patient-${suffix}-${timestamp}`
        measureName = `ReferenceResource${suffix}${timestamp}`
        cqlLibraryName = `ReferenceResourceLibrary${suffix}${timestamp}`
        const testCaseTitle = `ReferenceResource${suffix}${timestamp}`

        cy.readFile(cqlFixturePath)
            .should('exist')
            .then((cql) => {
                const measureCql = cql.replace(/library [^ ]+ version/, `library ${cqlLibraryName} version`)

                CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, model, { measureCql })
                TestData.saveMeasureCql(measureCql).then((response) => {
                    TestData.expectSavedMeasureCql(response)
                })
                MeasureGroupPage.CreateMeasureGroupAPI(
                    MeasureType.process,
                    PopulationBasis.boolean,
                    MeasureScoring.Proportion,
                    populations
                )
                TestCasesPage.CreateTestCaseAPI(
                    testCaseTitle,
                    'Reference Resource',
                    'Verifies generic FHIR reference selection',
                    patientBundle(patientId, patientProfile)
                )
            })

        OktaLogin.Login()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.assertMeasureSearchRowContains(0, measureName)
        MeasuresPage.openMeasureDetailsFromCurrentList()
        cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
        TestCasesPage.clickEditforCreatedTestCase()
        TestCaseBuilder.addEditNewResource(Profile.Task, 1)
        cy.get(TestCaseBuilder.addAttribute).should('be.visible').click()
        cy.get('#resource-element-selector-autocomplete').should('be.visible').type('focus')
        cy.get('[role="option"]').contains('focus').should('be.visible').click()
        cy.get('[role="dialog"]')
            .find('[data-testid="add-element-button-2"]')
            .should('be.enabled')
            .click()
        cy.get('[role="dialog"]').should('not.exist')
        TestCaseBuilder.selectLeftMenu('Focus')
    }

    const openReferenceTypeOptions = () => {
        cy.get(TestCaseBuilder.referenceTypeSelect()).should('be.visible').click()
        cy.get(profileOptions).should('have.length.greaterThan', 0)
    }

    const profileOption = (profileUrl: string) => `ul > li[data-value="${profileUrl}"]`

    const showBuilderJson = () => {
        cy.get(TestCaseBuilder.jsonTab).should('not.have.attr', 'aria-disabled', 'true').click()
        TestCasesPage.waitForJsonEditorReady()
    }

    afterEach('Clean up measure', () => {
        return Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    describe('QI-Core', () => {
        beforeEach('Create a saved QI-Core measure and open Task Focus in the Builder', () => {
            createMeasureAndOpenBuilder(SupportedModels.qiCore6, qiCoreCqlFixture, qiCorePatientProfile, 'QICore')
        })

        it('lists QI-Core, US-Core, and FHIR profiles for Reference(Resource), without Cross Profile options', () => {
            openReferenceTypeOptions()
            cy.get(profileOption(qiCorePatientProfile)).should('be.visible')
            cy.get(profileOption(usCorePatientProfile)).should('be.visible')
            cy.get(profileOption(fhirPatientProfile)).should('be.visible')
            cy.get(profileOptions).should('not.contain.text', 'Cross-version Profile')
        })

        it('links the selected existing resource when Apply is clicked', () => {
            TestCaseBuilder.selectReferenceType(qiCorePatientProfile)
            TestCaseBuilder.selectReference(`Patient/${patientId}`)
            TestCaseBuilder.applyAndWait()

            showBuilderJson()
            cy.get(TestCasesPage.aceEditor).should('contain.text', `Patient/${patientId}`)
        })

        it('shows only Add New when the selected profile has no resource in the test case', () => {
            TestCaseBuilder.selectReferenceType(qiCoreOrganizationProfile)
            cy.get(TestCaseBuilder.referenceSelect()).click()
            cy.get(profileOptions).should('have.length', 1)
            cy.get('[data-value="add_new_id"]').should('have.text', addNewReference)
        })

        it('links a new Organization with the selected profile when Apply is clicked', () => {
            TestCaseBuilder.selectReferenceType(qiCoreOrganizationProfile)
            TestCaseBuilder.selectReference('add_new_id')

            TestCaseBuilder.applyAndWait()

            showBuilderJson()
            cy.get(TestCasesPage.aceEditor)
                .should('contain.text', 'Organization/')
                .and('contain.text', qiCoreOrganizationProfile)
        })
    })

    describe('USQC', () => {
        beforeEach('Create a saved USQC measure and open Task Focus in the Builder', () => {
            createMeasureAndOpenBuilder(SupportedModels.USQC, usqcCqlFixture, usCorePatientProfile, 'USQC')
        })

        it('lists USQC, US-Core, and FHIR profiles for Reference(Resource), without Cross Profile options', () => {
            openReferenceTypeOptions()
            cy.get(profileOption(qiCorePatientProfile)).should('not.exist')
            cy.get(profileOption(usqcConditionProfile)).should('be.visible')
            cy.get(profileOption(usCorePatientProfile)).should('be.visible')
            cy.get(profileOption(fhirPatientProfile)).should('be.visible')
            cy.get(profileOptions).should('not.contain.text', 'Cross-version Profile')
        })
    })
})
