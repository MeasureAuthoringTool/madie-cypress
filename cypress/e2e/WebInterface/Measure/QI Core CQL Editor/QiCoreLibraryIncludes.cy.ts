import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {CQLEditorPage} from "../../../../Shared/CQLEditorPage"
import {Utilities} from "../../../../Shared/Utilities"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import { EditMeasurePage } from "../../../../Shared/EditMeasurePage"

let measureName = 'QiCoreTestMeasure' + Date.now()
let CqlLibraryName = 'QiCoreLibrary' + Date.now()
let measureCQL = MeasureCQL.ICFCleanTest_CQL

//Skipping until feature flag is removed
describe.skip('Qi-Core Library Includes fields', () => {

    beforeEach('Create Measure and Login', () => {

        //Create New Measure
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        OktaLogin.Login()
    })

    afterEach('Clean up and Logout', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Search for Qi-Core Included Libraries', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to CQL Editor page
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Search for FHIR Library
        cy.get(CQLEditorPage.librarySearchTextBox).type('qdm')
        cy.get(CQLEditorPage.librarySearchBtn).click()
        cy.get('.Results___StyledTd-sc-18pioce-0').should('contain.text', 'No Results were found')

        //Search for QDM Libraries
        cy.get(CQLEditorPage.librarySearchTextBox).clear().type('vte')
        cy.get(CQLEditorPage.librarySearchBtn).click().wait(1000)
        cy.get(CQLEditorPage.librarySearchTable).should('contain','nameversionownerActionVTE8.8.000YaHu1257VTE8.7.000YaHu1257VTE8.6.000YaHu1257VTE8.5.000YaHu1257VTE8.4.000YaHu1257')
    })

    it('Verify Included Libraries under Saved Libraries tab', () => {

        //Click on Edit Button
        MeasuresPage.measureAction("edit")

        //Navigate to CQL Editor page
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(CQLEditorPage.expandCQLBuilder).click()

        //Click on Includes tab
        cy.get(CQLEditorPage.includesTab).click()

        //Navigate to Saved Libraries tab
        cy.get(CQLEditorPage.savedLibrariesTab).click()
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', 'FHIRHelpers')//Alias
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', 'FHIRHelpers')//Name
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', '4.1.000')//Version
        cy.get(CQLEditorPage.savedLibrariesTable).should('contain.text', 'julietrubini')//Owner
    })
})
