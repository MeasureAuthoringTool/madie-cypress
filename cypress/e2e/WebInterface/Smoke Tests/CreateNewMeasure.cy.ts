import { OktaLogin } from "../../../Shared/OktaLogin"
import {CreateMeasurePage, SupportedModels} from "../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../Shared/EditMeasurePage"
import { Utilities } from "../../../Shared/Utilities"
import { Header } from "../../../Shared/Header"

let measureName = ''
let CqlLibraryName = ''

describe('Create New Measure', () => {

    beforeEach('Login', () => {
        OktaLogin.Login()
    })

    afterEach('Cleanup and Logout', () => {

        Utilities.waitForElementVisible(EditMeasurePage.editMeasureButtonActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureButtonActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.editMeasureDeleteActionBtn, 5000)
        cy.get(EditMeasurePage.editMeasureDeleteActionBtn).click()
        Utilities.waitForElementVisible(EditMeasurePage.deleteMeasureConfirmationButton, 5000)
        cy.get(EditMeasurePage.deleteMeasureConfirmationButton).click()
        Utilities.waitForElementVisible(EditMeasurePage.successMessage, 5000)
        cy.get(EditMeasurePage.successMessage).should('contain.text', "Measure successfully deleted")

        //Verify the deleted measure on My Measures page list
        cy.get(Header.measures).click()
        Utilities.waitForElementVisible(MeasuresPage.measureListTitles, 60000)
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        //Navigate to All Measures tab
        cy.get(MeasuresPage.allMeasuresTab).click()
        //Verify the deleted measure on All Measures page list
        cy.get(MeasuresPage.measureListTitles).should('not.contain', measureName)

        OktaLogin.Logout()
    })

    it('Create QI Core 4.1.1 Measure', () => {

        measureName = 'QICoreTestMeasure' + Date.now()
        CqlLibraryName = 'QICoreTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.qiCore4)
        cy.get(Header.mainMadiePageButton).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab / page
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library libraryName version \'0.0.000\'using QICore version \'4.1.1\'include CQMCommon version \'2.2.000\' called CQMCommoninclude FHIRHelpers version \'4.4.000\' called FHIRHelpersinclude QICoreCommon version \'2.1.000\' called QICoreCommoninclude SupplementalDataElements version \'3.5.000\' called SDEparameter "Measurement Period" Interval<DateTime>context Patientdefine "SDE Ethnicity":  SDE."SDE Ethnicity"define "SDE Payer":  SDE."SDE Payer"define "SDE Race":  SDE."SDE Race"define "SDE Sex":  SDE."SDE Sex"')

    })

    it('Create QDM Measure', () => {

        measureName = 'QDMTestMeasure' + Date.now()
        CqlLibraryName = 'QDMTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.QDM)
        cy.get(Header.mainMadiePageButton).click()
        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to CQL Editor tab / page
        cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        cy.get(EditMeasurePage.cqlEditorTab).click()

        cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library libraryName version \'0.0.000\'using QDM version \'5.6\'include MATGlobalCommonFunctionsQDM version \'8.0.000\' called Globalvalueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'valueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'valueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'valueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'parameter "Measurement Period" Interval<DateTime>context Patientdefine "SDE Ethnicity":  ["Patient Characteristic Ethnicity": "Ethnicity"]define "SDE Sex":  ["Patient Characteristic Sex": "ONC Administrative Sex"]define "SDE Payer":  ["Patient Characteristic Payer": "Payer Type"]  define "SDE Race":  ["Patient Characteristic Race": "Race"]')

    })

    it('Create QI Core 6.0.0 Measure', () => {

        measureName = 'QICoreTestMeasure' + Date.now()
        CqlLibraryName = 'QICoreTestLibrary' + Date.now()

        //Create New Measure
        CreateMeasurePage.CreateMeasure(measureName, CqlLibraryName, SupportedModels.qiCore6)

        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')
        //
        // //Navigate to CQL Editor tab / page
        // cy.get(EditMeasurePage.cqlEditorTab).should('be.visible')
        // cy.get(EditMeasurePage.cqlEditorTab).click()
        //
        // cy.get(EditMeasurePage.cqlEditorTextBox).should('contain.text', 'library libraryName version \'0.0.000\'using QICore version \'4.1.1\'include CQMCommon version \'2.2.000\' called CQMCommoninclude FHIRHelpers version \'4.4.000\' called FHIRHelpersinclude QICoreCommon version \'2.1.000\' called QICoreCommoninclude SupplementalDataElements version \'3.5.000\' called SDEparameter "Measurement Period" Interval<DateTime>context Patientdefine "SDE Ethnicity":  SDE."SDE Ethnicity"define "SDE Payer":  SDE."SDE Payer"define "SDE Race":  SDE."SDE Race"define "SDE Sex":  SDE."SDE Sex"')

    })
})
