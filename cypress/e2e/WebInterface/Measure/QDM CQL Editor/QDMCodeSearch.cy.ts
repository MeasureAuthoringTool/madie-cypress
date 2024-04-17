import { CreateMeasurePage } from "../../../../Shared/CreateMeasurePage"
import { OktaLogin } from "../../../../Shared/OktaLogin"
import { Utilities } from "../../../../Shared/Utilities"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import { MeasuresPage } from "../../../../Shared/MeasuresPage"
import { CQLEditorPage } from "../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../Shared/MeasureCQL"

let measureName = 'QDMTestMeasure' + Date.now()
let CqlLibraryName = 'QDMLibrary' + Date.now()
let measureCQL = MeasureCQL.qdmCQLNonPatienBasedTest

//Skipping until QDMCodeSearch feature flag is removed
describe.skip('QDM Code Search fields', () => {

    before('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQDMMeasureAPI(measureName, CqlLibraryName, measureCQL, false, false,
            '2023-01-01', '2024-01-01')

        OktaLogin.Login()
    })

    after('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for the Codes and apply it to Measure', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Save CQL
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).type('{moveToEnd}{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL updated successfully! ' +
            'Library Statement or Using Statement were incorrect. MADiE has overwritten them to ensure proper CQL.')

        //Click on Codes tab
        cy.get(CQLEditorPage.codesTab).click()

        //Navigate to Code sub tab
        cy.get(CQLEditorPage.codeSubTab).click()

        //Code system version and Code search fields should be disabled before selecting the code system
        cy.get(CQLEditorPage.codeSystemVersionDropdown).should('not.be.enabled')
        cy.get(CQLEditorPage.codeText).should('not.be.enabled')

        //Assert when the Code is Active in VSAC
        cy.get(CQLEditorPage.codeSystemDropdown).type('SNOMEDCT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('SNOMEDCT').click()
        cy.get(CQLEditorPage.codeText).type('258219007')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is active in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version258219007Stage 2 (qualifier value)SNOMEDCThttp://snomed.info/sct/731000124108/version/20230901')

        //Assert when the Code is not available in VSAC
        cy.get(CQLEditorPage.codeText).clear().type('123')
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        cy.get('[class="sc-dhKdcB bOvcnM"]').should('contain.text', 'No Results were found')

        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Assert when the Code is inactive in VSAC
        cy.get(CQLEditorPage.codeSystemDropdown).type('SNOMEDCT')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('SNOMEDCT').click()
        cy.get(CQLEditorPage.codeText).type('16298561000119108')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'This code is inactive in this code system version')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem Version16298561000119108Administration of tetanus, diphtheria, and acellular pertussis vaccine (procedure)SNOMEDCThttp://snomed.info/sct/731000124108/version/20230901')

        //Clear the code search values
        cy.get(CQLEditorPage.clearCodeBtn).click()

        //Assert when the Code is unavailable (not able to determine active/inactive)
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemOptionListBox).contains('ActCode').click()
        cy.get(CQLEditorPage.codeText).type('AMB')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)
        cy.get(CQLEditorPage.toolTip).trigger('mouseover')
        cy.get(CQLEditorPage.toolTipMsg).should('contain.text', 'Code status unavailable')
        cy.get(CQLEditorPage.codeSystemSearchResultsTbl).should('contain.text', 'CodeDescriptionCode SystemSystem VersionAMBambulatoryActCode9.0.0')
    })
})
