import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Utilities } from "../../../Shared/Utilities"

const measureName = 'SaveCQL' + Date.now()
const CqlLibraryName = 'SaveCQLLib' + Date.now()

const measureCQL_valid = `library ${CqlLibraryName} version '0.0.000'\n\n` +
    'using FHIR version \'4.0.1\'\n\n' +
    'include FHIRHelpers version \'4.1.000\' called FHIRHelpers\n\n' +
    'valueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\n' +
    'parameter "Measurement Period" Interval<DateTime>\n\n' +
    'context Patient\n\n' +
    'define "ipp":\n' +
    '  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period" \n\n' +
    'define "denom":\n' +
    '    "ipp"\n\n' +
    'define "num":\n' +
    '    exists ["Encounter"] E where E.status ~ \'finished\'\n\n' +
    'define "numeratorExclusion":\n' +
    '    "num"'

describe('Save CQL on CQL Editor Page', () => {

    beforeEach('Login', () => {
        CreateMeasurePage.CreateMeasureAPI(measureName, CqlLibraryName, SupportedModels.qiCore6)
        OktaLogin.Login()
    })

    afterEach('Logout', () => {
        
        Utilities.deleteMeasure()
    })

    it('Create New Measure and Add CQL to the Measure', () => {

        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        CQLEditorPage.replaceMonacoCqlDocument(measureCQL_valid)
        CQLEditorPage.saveMonacoCql({ waitForDisabled: true })

    })
})
