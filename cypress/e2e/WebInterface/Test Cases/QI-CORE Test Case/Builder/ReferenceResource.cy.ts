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
import { TestCaseBuilder } from '../../../../../Shared/TestCaseBuilder'
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

const referenceBundle = (patientId: string, patientProfile: string, taskId: string) =>
    JSON.stringify({
        resourceType: 'Bundle',
        type: 'collection',
        entry: [
            {
                fullUrl: `https://madie.cms.gov/Patient/${patientId}`,
                resource: {
                    resourceType: 'Patient',
                    id: patientId,
                    meta: { profile: [patientProfile] }
                }
            },
            {
                fullUrl: `https://madie.cms.gov/Task/${taskId}`,
                resource: {
                    resourceType: 'Task',
                    id: taskId,
                    status: 'requested',
                    intent: 'order',
                    focus: { display: 'Select reference' }
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
        const taskId = `reference-resource-task-${suffix}-${timestamp}`
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
                    referenceBundle(patientId, patientProfile, taskId)
                )
            })

        OktaLogin.SessionLogin()
        MeasuresPage.searchForMeasureByName(measureName)
        MeasuresPage.assertMeasureSearchRowContains(0, measureName)
        MeasuresPage.openMeasureDetailsFromCurrentList()
        cy.get(EditMeasurePage.testCasesTab).should('be.visible').click()
        TestCasesPage.clickEditforCreatedTestCase()
        TestCaseBuilder.editAddedResource(taskId)
        TestCaseBuilder.selectLeftMenu('Focus')
        return cy.get(TestCaseBuilder.referenceTypeSelect()).should('be.visible')
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
            return createMeasureAndOpenBuilder(SupportedModels.qiCore6, qiCoreCqlFixture, qiCorePatientProfile, 'QICore')
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
            TestCasesPage.assertJsonEditorText(`Patient/${patientId}`)
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
            TestCasesPage.assertJsonEditorText('Organization/')
            TestCasesPage.saveTestCaseAndWait()
            cy.get('@saveTestCase')
                .its('request.body.json')
                .should((json: string) => {
                    const bundle = JSON.parse(json)
                    const organization = bundle.entry.find(
                        (entry: { resource: { resourceType: string } }) =>
                            entry.resource.resourceType === 'Organization'
                    )

                    expect(organization, 'saved Organization resource').to.exist
                    expect(organization.resource.meta.profile, 'saved Organization profile').to.include(
                        qiCoreOrganizationProfile
                    )
                })
        })
    })

    describe('USQC', () => {
        beforeEach('Create a saved USQC measure and open Task Focus in the Builder', () => {
            return createMeasureAndOpenBuilder(SupportedModels.USQC, usqcCqlFixture, usCorePatientProfile, 'USQC')
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
