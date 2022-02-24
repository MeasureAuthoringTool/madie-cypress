import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import {LandingPage} from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now() + 1
let CqlLibraryName = 'TestLibrary' + Date.now() + 1
let measureScoring = MeasureGroupPage.measureScoringUnit



describe('Validate Measure Group', () => {

    before('Create Measure', () => {

        OktaLogin.Login()

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasure(measureName, CqlLibraryName, measureScoring)

        OktaLogin.Logout()

    })
    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Login', () => {
        OktaLogin.Logout()

    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        cy.get(EditMeasurePage.cqlEditorTextBox).type('library TESTMEASURE0000000003 version \'0.0.000\'{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('using FHIR version \'4.0.1\'{enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('include FHIRHelpers version \'4.0.001\' called FHIRHelpers {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('include SupplementalDataElementsFHIR4 version \'2.0.000\' called SDE {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('include MATGlobalCommonFunctionsFHIR4 version \'6.1.000\' called Global {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('parameter "Measurement Period" Interval<DateTimeTest> {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('context Patient {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('define "SDE Ethnicity": {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('SDE."SDE Ethnicity" {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('define "SDE Payer": {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('SDE."SDE Payer" {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('define "SDE Race": {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('SDE."SDE Race" {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('define "SDE Sex": {enter}')
        cy.get(EditMeasurePage.cqlEditorTextBox).type('SDE."SDE Sex" {enter}')
        
        //save the value in the CQL Editor
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()

        //Validate message on page
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('contain.text', 'CQL saved successfully')

        //Validate error(s) in CQL Editor window
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).invoke('show').click({force:true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 41:52 | A named type is required in this context.")


        //Navigate away from the page
        cy.get(LandingPage.madieLogo).click()

        //Navigate back to the CQL Editor page
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //Validate error(s) in CQL Editor windows
        cy.get('#ace-editor-wrapper > div.ace_gutter > div').find(CQLEditorPage.errorInCQLEditorWindow).should('exist')
        cy.get('#ace-editor-wrapper > div.ace_gutter > div > ' + CQLEditorPage.errorInCQLEditorWindow).invoke('show').click({force:true})
        cy.get('#ace-editor-wrapper > div.ace_tooltip').invoke('show').should('contain.text', "ELM: 41:52 | A named type is required in this context.")

    })
})