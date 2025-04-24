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
import { TestCaseJson } from "../../../../../Shared/TestCaseJson"

const now = Date.now()
const measureName = 'QiCoreManifestExpansion' + now
const CqlLibraryName = 'QiCoreManifestExpansionLib' + now
const measureCQLPFTests = MeasureCQL.CQL_Populations
const testCaseJson = TestCaseJson.TestCaseJson_Valid

describe('Validating QICore Expansion -> Manifest', () => {

    beforeEach('Create measure, login and update CQL, create group, and login', () => {

        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQLPFTests)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(null, false, 'Initial Population', '', '', 'Initial Population', '', 'Initial Population', 'boolean')
        TestCasesPage.CreateTestCaseAPI('passing test', 'abc', 'example', testCaseJson)

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

    it('Verify Madie users can successfully execute test cases against their chosen manifest version', () => {

        // set intercept for manifest expansion
        cy.intercept('PUT', '/api/terminology/value-sets/expansion/fhir').as('expansion')


        //navigate to the main measure list page
        cy.get(Header.mainMadiePageButton).click()

        //Click on Edit Measure
        MeasuresPage.actionCenter('edit')

        //Navigate to Test Cases page and add Test Case details
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        //navigate to the test case list Expansion page
        cy.get(TestCasesPage.qdmExpansionSubTab).click()

        // select manifest expansion
        cy.get(TestCasesPage.qdmExpansionRadioOptionGroup)
            .find('[type="radio"]')
            .last()
            .click()

        // choose ecqm-update-2022-0505
        cy.get(TestCasesPage.qdmManifestSelectDropDownBox).click()
        cy.get(TestCasesPage.qdmMantifestMayFailTestOption).click()

        // save selection
        cy.get(TestCasesPage.qdmManifestSaveBtn).click()
        cy.get(TestCasesPage.qdmManifestSuccess).should('contain.text', 'Expansion details Updated Successfully')

        // return to test case list
        cy.get(EditMeasurePage.testCasesTab).should('be.visible')
        cy.get(EditMeasurePage.testCasesTab).click()

        // intercept expansion API call & check for expected versions
        const expectedVersions = ['20170504', '20190315', '20240110', '20180310']
        cy.wait('@expansion').then(expansion => {
            expect(expansion.response.body).to.have.length(5)
            // no guarantee of return order, and this avoids a for loop
            expect(expansion.response.body[0].version).to.be.oneOf(expectedVersions)
            expect(expansion.response.body[1].version).to.be.oneOf(expectedVersions)
            expect(expansion.response.body[2].version).to.be.oneOf(expectedVersions)
            expect(expansion.response.body[3].version).to.be.oneOf(expectedVersions)
            expect(expansion.response.body[4].version).to.be.oneOf(expectedVersions)
        })

        // execute tests
        cy.get(TestCasesPage.executeTestCaseButton).should('be.visible')
        cy.get(TestCasesPage.executeTestCaseButton).click()
        Utilities.waitForElementEnabled(TestCasesPage.executeTestCaseButton, 14500)

        // check pass/fail
        cy.get(TestCasesPage.testCaseListPassingPercTab).should('have.text', '100% Passing (1/1)')
    })
})