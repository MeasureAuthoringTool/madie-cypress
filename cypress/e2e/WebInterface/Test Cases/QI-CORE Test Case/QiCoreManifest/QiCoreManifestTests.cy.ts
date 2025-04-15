import { OktaLogin } from "../../../../../Shared/OktaLogin"
import { CreateMeasurePage } from "../../../../../Shared/CreateMeasurePage"
import { MeasuresPage } from "../../../../../Shared/MeasuresPage"
import { TestCasesPage } from "../../../../../Shared/TestCasesPage"
import { EditMeasurePage } from "../../../../../Shared/EditMeasurePage"
import { Utilities } from "../../../../../Shared/Utilities"
import { MeasureGroupPage } from "../../../../../Shared/MeasureGroupPage"
import { CQLEditorPage } from "../../../../../Shared/CQLEditorPage"
import { MeasureCQL } from "../../../../../Shared/MeasureCQL"
import { Header } from "../../../../../Shared/Header"

const now = Date.now()
let measureName = 'RunExecuteTCButtonValidations' + now
let CqlLibraryName = 'TestLibrary' + now
let measureCQLPFTests = MeasureCQL.CQL_Populations

// needs https://jira.cms.gov/browse/MAT-7901 to be completed, part of 2.2.2
// feature flag: QICoreManifestExpansion
describe.skip('Validating Expansion -> Manifest selections / navigation functionality', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        OktaLogin.Login()
        MeasuresPage.actionCenter('edit')
        cy.get(EditMeasurePage.cqlEditorTab).click()
        cy.get(EditMeasurePage.cqlEditorTextBox).scrollIntoView()
        cy.get(EditMeasurePage.cqlEditorTextBox).click().type('{enter}')
        cy.get(EditMeasurePage.cqlEditorSaveButton).click()
        //wait for alert / successful save message to appear
        Utilities.waitForElementVisible(CQLEditorPage.successfulCQLSaveNoErrors, 27700)
        cy.get(CQLEditorPage.successfulCQLSaveNoErrors).should('be.visible')
    })

    afterEach('Logout and Clean up Measures', () => {

        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)
    })
    it('Verify Expansion -> Manifest: Verify the general Qi Core Expansion sub-tab page and that the manifest drop-down list is not empty', () => {

        //navigate to the main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        //validating that manifest is, now, selected and make a change in the selection
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .then((radio) => {
                //check / select radio button for manifest
                cy.wrap(radio).eq(1).check({ force: true }).should('be.checked');
                cy.contains('[id="manifest-select-label"]', 'Manifest');

                cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
                cy.get(TestCasesPage.qdmMantifestMayFailTestOption).click()
                Utilities.waitForElementVisible('[id="mui-59"]', 50000)
                cy.get('[id="mui-59"]').should('not.be.empty')
            })


    })

})