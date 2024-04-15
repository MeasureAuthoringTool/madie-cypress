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
        cy.get(CQLEditorPage.codeSystemDropdown).click().wait(500)

        // type in and select option that appears
        cy.get(CQLEditorPage.codeSystemDropdown).type('ActCode')
        cy.get(CQLEditorPage.codeSystemDropdown).type('{downArrow}').wait(500)
        cy.get(CQLEditorPage.codeSystemDropdown).type('{enter}').wait(500)

        //Type a value in to Code Search text box
        cy.get(CQLEditorPage.codeText).type('2')
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemClearBtn, 30000)

        //click on search button
        Utilities.waitForElementEnabled(CQLEditorPage.codeSystemSearchBtn, 30000)
        cy.get(CQLEditorPage.codeSystemSearchBtn).click()

        //confirm search results appear on screen
        Utilities.waitForElementVisible(CQLEditorPage.codeSystemSearchResultsTbl, 30000)

        //click on the clear button
        cy.get(CQLEditorPage.codeSystemClearBtn).click()

        //confirm that all fields return to their state prior to when a code system was selected
        cy.get(CQLEditorPage.codeSystemVersionDropdown).should('not.contain.text')
        cy.get(CQLEditorPage.codeSystemVersionDropdown).should('not.be.enabled')
        cy.get(CQLEditorPage.codeText).should('not.contain.text')
        cy.get(CQLEditorPage.codeText).should('not.be.enabled')
        cy.get(CQLEditorPage.codeSystemDropdown).should('not.contain.text')
        Utilities.waitForElementToNotExist(CQLEditorPage.codeSystemSearchResultsTbl, 30000)


    })
})
