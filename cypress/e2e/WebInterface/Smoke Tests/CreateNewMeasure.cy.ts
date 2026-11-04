import { OktaLogin } from "../../../Shared/OktaLogin"
import { CreateMeasurePage, SupportedModels } from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { MonacoEditor } from "../../../Shared/MonacoEditor"

let measureName = ''
let CqlLibraryName = ''

describe('Create New Measure', () => {

    beforeEach('Login', () => {
        OktaLogin.Login()

        Utilities.waitForElementVisible(MeasuresPage.allMeasuresTab, 11500)
    })

    afterEach('Cleanup and Logout', () => {

        Utilities.deleteMeasure()
    })

    it('Create QDM Measure', () => {

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'QDMTestLibrary' + Date.now()

        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.QDM)

        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab / page
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        MonacoEditor.assertRenderedText(
            EditMeasurePage.monacoCqlEditor,
            "using QDM version '5.6'",
            'parameter "Measurement Period" Interval<DateTime>',
            'define "SDE Ethnicity"',
            'define "SDE Race"'
        )
    })

    it('Create QI Core 6.0.0 Measure', () => {

        measureName = 'QICore6TestMeasure' + Date.now()
        CqlLibraryName = 'QICore6TestLibrary' + Date.now()

        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.qiCore6)

        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab / page
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        MonacoEditor.assertRenderedText(
            EditMeasurePage.monacoCqlEditor,
            `library ${CqlLibraryName} version '0.0.000'`,
            "using QICore version '6.0.0'",
            'parameter "Measurement Period" Interval<DateTime>',
            'define "SDE Ethnicity"',
            'define "SDE Sex"'
        )
    })
})
