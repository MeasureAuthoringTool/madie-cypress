import { CreateMeasurePage, SupportedModels } from '../../../../Shared/CreateMeasurePage'
import { MeasureCQL } from '../../../../Shared/MeasureCQL'
import {
    MeasureGroupPage,
    MeasureGroups,
    MeasureScoring,
    MeasureType,
    PopulationBasis
} from '../../../../Shared/MeasureGroupPage'
import { MeasuresPage } from '../../../../Shared/MeasuresPage'
import { OktaLogin } from '../../../../Shared/OktaLogin'
import { TestCaseJson } from '../../../../Shared/TestCaseJson'
import { TestCasesPage } from '../../../../Shared/TestCasesPage'
import { Utilities } from '../../../../Shared/Utilities'

const validationStatus = '[data-testid$="_testCaseValidationStatus"]'
const timestamp = Date.now()
const usqcCql = `library DWTestUSQC version '0.0.000'

using USQualityCore version '0.5.0'

using C4BB version '2.1.1-derived'

include hl7.fhir.uv.cql.FHIRHelpers version '4.0.1' called FHIRHelpers
include hl7.fhir.uv.cql.FHIRCommon version '2.0.0' called FHIRCommon
include hl7.fhir.us.cql.USCoreCommon version '2.0.0' called USCoreCommon
include hl7.fhir.us.cql.USCoreElements version '2.0.0' called USCoreElements

context Patient

define "ip":
  true`

type ValidationDisplayScenario = {
    model: SupportedModels
    measureCql: string
    testCaseJson: string
    validationVisible: boolean
    measureType?: MeasureType
    populationBasis?: PopulationBasis
    scoring?: MeasureScoring
    populations?: MeasureGroups
}

const scenarios: Record<string, ValidationDisplayScenario> = {
    qdm: {
        model: SupportedModels.QDM,
        measureCql: MeasureCQL.QDMHightlightingTabDefUsed_CQL,
        testCaseJson: TestCaseJson.tcJSON_QDM_Value,
        validationVisible: false
    },
    qiCore411: {
        model: SupportedModels.qiCore4,
        measureCql: MeasureCQL.ICFCleanTest_CQL,
        testCaseJson: TestCaseJson.TestCaseJson_Valid,
        validationVisible: false,
        measureType: MeasureType.outcome,
        populationBasis: PopulationBasis.procedure,
        scoring: MeasureScoring.Proportion,
        populations: {
            initialPopulation: 'Surgical Absence of Cervix',
            denominator: 'Surgical Absence of Cervix',
            numerator: 'Surgical Absence of Cervix'
        }
    },
    qiCore600: {
        model: SupportedModels.qiCore6,
        measureCql: MeasureCQL.CQL_BoneDensity_Proportion_Boolean,
        testCaseJson: TestCaseJson.TestCaseJson_Valid,
        validationVisible: true,
        measureType: MeasureType.process,
        populationBasis: PopulationBasis.boolean,
        scoring: MeasureScoring.Proportion,
        populations: {
            initialPopulation: 'Initial Population',
            denominator: 'Denominator',
            numerator: 'Numerator',
            denomException: 'Denominator Exception'
        }
    },
    usqc: {
        model: SupportedModels.USQC,
        measureCql: usqcCql,
        testCaseJson: JSON.stringify(require('../../../../fixtures/usqc-validation-display-test-case.json')),
        validationVisible: true,
        measureType: MeasureType.outcome,
        populationBasis: PopulationBasis.boolean,
        scoring: MeasureScoring.Proportion,
        populations: {
            initialPopulation: 'ip',
            denominator: 'ip',
            numerator: 'ip'
        }
    }
}

describe('Test case list validation display by measure model', () => {
    let measureName = ''
    let cqlLibraryName = ''

    const createMeasureAndOpenTestCases = (scenario: ValidationDisplayScenario, name: string) => {
        const scenarioName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`
        measureName = `Validation${scenarioName}Measure${timestamp}`
        cqlLibraryName = `Validation${scenarioName}Library${timestamp}`

        if (scenario.model === SupportedModels.QDM) {
            CreateMeasurePage.CreateQDMMeasureWithBaseConfigurationFieldsAPI({
                ecqmTitle: measureName,
                cqlLibraryName,
                measureCql: scenario.measureCql,
                measureScoring: 'Proportion',
                patientBasis: 'false',
                mpStartDate: '2027-01-01',
                mpEndDate: '2027-12-31'
            })
            TestCasesPage.CreateQDMTestCaseAPI(
                'Validation display test case',
                'Validation display',
                'Model display coverage',
                scenario.testCaseJson
            )
        } else {
            CreateMeasurePage.CreateMeasureAPI(measureName, cqlLibraryName, scenario.model, {
                measureCql: scenario.measureCql,
                mpStartDate: '2027-01-01',
                mpEndDate: '2027-12-31'
            })
            MeasureGroupPage.CreateMeasureGroupAPI(
                scenario.measureType!,
                scenario.populationBasis!,
                scenario.scoring!,
                scenario.populations!
            )
            TestCasesPage.CreateTestCaseAPI(
                'Validation display test case',
                'Validation display',
                'Model display coverage',
                scenario.testCaseJson
            )
        }

        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        TestCasesPage.openTestCasesTab(TestCasesPage.testCaseListTable)
    }

    afterEach('Clean up measure', () => {
        Utilities.deleteMeasure(measureName, cqlLibraryName)
    })

    Object.entries(scenarios).forEach(([name, scenario]) => {
        it(`shows validation information only when supported for ${scenario.model}`, () => {
            createMeasureAndOpenTestCases(scenario, name)

            cy.get(TestCasesPage.testCaseListTable).within(() => {
                cy.get(validationStatus).should(scenario.validationVisible ? 'exist' : 'not.exist')
            })
            cy.get(TestCasesPage.testCaseListValidationPercTab).should(
                scenario.validationVisible ? 'exist' : 'not.exist'
            )
        })
    })
})
