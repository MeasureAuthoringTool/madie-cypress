import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { Header } from "../../../Shared/Header"
import { CQLEditorPage } from "../../../Shared/CQLEditorPage"
import { Utilities } from "../../../Shared/Utilities"

const measureName = 'SaveCQL' + Date.now()
const CqlLibraryName = 'SaveCQLLib' + Date.now()

const measureCQL_valid = 'library abcde version \'0.0.000\'\n\n' +
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

        // necessary evil of a static wait - editor needs to be "ready" for input otherwise navigation off this page breaks
        cy.wait(3500)
        cy.get(EditMeasurePage.cqlEditorTextBox).type(measureCQL_valid)

        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        CQLEditorPage.validateSuccessfulCQLUpdate()

        //Navigate to Measures page and verify the saved CQL
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 45000)

        MeasuresPage.actionCenter("edit")
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).should('not.be.empty')
        // checks for randomly chosen text from the typed-in CQL, that is not present on the default CQL
        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', '["Encounter": "Office Visit"]')
    })
})
