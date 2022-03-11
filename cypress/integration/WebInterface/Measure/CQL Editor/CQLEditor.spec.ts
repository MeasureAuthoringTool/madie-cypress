import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"
import {EditMeasurePage } from "../../../../Shared/EditMeasurePage"
import {LandingPage} from "../../../../Shared/LandingPage"

let measureName = 'TestMeasure' + Date.now() + 1
let CqlLibraryName = 'TestLibrary' + Date.now() + 1
let measureScoring = MeasureGroupPage.measureScoringUnit


describe('Validate Measure Group', () => {

    before('Create Measure', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureScoring)

    })
    beforeEach('Login', () => {
        OktaLogin.Login()

    })
    afterEach('Logout', () => {
        OktaLogin.Logout()

    })

    it('Verify errors appear on CQL Editor page and in the CQL Editor object on save and on tab / page load', () => {

        //Click on Edit Measure
        MeasuresPage.clickEditforCreatedMeasure()

        //Click on the CQL Editor tab
        CQLEditorPage.clickCQLEditorTab()

        //type text in the CQL Editor that will cause error
        Utilities.readWriteFileData('cqlCQLEditor.txt', EditMeasurePage.cqlEditorTextBox)

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