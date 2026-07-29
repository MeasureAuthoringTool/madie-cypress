import { CreateMeasurePage, SupportedModels } from '../../../../../Shared/CreateMeasurePage'
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
import { Utilities } from '../../../../../Shared/Utilities'

const timestamp = Date.now()
const measureName = `HierarchicalValueSet${timestamp}`
const cqlLibraryName = `HierarchicalValueSetLib${timestamp}`
const occupationObservationId = 'occupation-observation'

const measureCql = `library ${cqlLibraryName} version '0.0.000'

using QICore version '6.0.0'

include FHIRHelpers version '4.4.000' called FHIRHelpers

parameter "Measurement Period" Interval<DateTime>

context Patient

define "Initial Population":
  true

define "Denominator":
  "Initial Population"

define "Denominator Exclusions":
  not "Initial Population"

define "Numerator":
  "Initial Population"
`

const populations: MeasureGroups = {
    initialPopulation: 'Initial Population',
    denominator: 'Denominator',
    denomExclusion: 'Denominator Exclusions',
    numerator: 'Numerator'
}

const testCaseJson = JSON.stringify({
    resourceType: 'Bundle',
    type: 'collection',
    entry: [
        {
            fullUrl: 'https://madie.cms.gov/Patient/occupation-patient',
            resource: {
                resourceType: 'Patient',
                id: 'occupation-patient',
                meta: {
                    profile: ['http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient']
                },
                gender: 'female'
            }
        },
        {
            fullUrl: `https://madie.cms.gov/Observation/${occupationObservationId}`,
            resource: {
                resourceType: 'Observation',
                id: occupationObservationId,
                meta: {
                    profile: [
                        'http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-occupation'
                    ]
                },
                code: {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '11341-5',
                            display: 'History of Occupation'
                        }
                    ]
                },
                status: 'corrected',
                subject: {
                    reference: 'Patient/occupation-patient'
                },
                valueCodeableConcept: {
                    coding: [
                        {
                            system: 'http://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets',
                            code: 'G0438',
                            display: 'Annual wellness visit'
                        }
                    ]
                }
            }
        }
    ]
})

const expectedStatusOptions = [
    'Amended',
    'Cancelled',
    'Corrected',
    'Entered in Error',
    'Final',
    'Preliminary',
    'Registered',
    'Unknown'
]

describe('Test Case Builder hierarchical value sets', () => {
    beforeEach('Create measure and occupation test case', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, SupportedModels.qiCore6, {
            measureCql
        })
        MeasureGroupPage.CreateMeasureGroupAPI(
            MeasureType.process,
            PopulationBasis.boolean,
            MeasureScoring.Proportion,
            populations
        )
        TestCasesPage.CreateTestCaseAPI(
            'Observation occupation status',
            'Hierarchical value set',
            'Displays nested observation status concepts',
            testCaseJson
        )

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
    })

    afterEach('Clean up measure', () => {
        Utilities.deleteMeasure()
    })

    it('displays every hierarchical Observation Status option', () => {
        TestCasesPage.clickEditforCreatedTestCase()

        TestCaseBuilder.editAddedResource(occupationObservationId)

        TestCaseBuilder.selectLeftMenu(' *Status')

        cy.get(TestCaseBuilder.observationStatus).should('be.visible').click()

        cy.get(TestCaseBuilder.dropdownListbox)
            .should('be.visible')
            .within(() => {
                expectedStatusOptions.forEach((status) => {
                    cy.contains(TestCaseBuilder.dropdownOption, status).should('be.visible')
                })
                cy.get(TestCaseBuilder.dropdownOption).should('have.length', expectedStatusOptions.length)
            })
    })
})
