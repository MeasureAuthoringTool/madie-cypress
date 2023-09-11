import {TestCaseJson} from "../../../../Shared/TestCaseJson"
import {MeasureCQL} from "../../../../Shared/MeasureCQL"
import {CreateMeasurePage} from "../../../../Shared/CreateMeasurePage"
import {OktaLogin} from "../../../../Shared/OktaLogin"
import {MeasuresPage} from "../../../../Shared/MeasuresPage"
import {EditMeasurePage} from "../../../../Shared/EditMeasurePage"
import {MeasureGroupPage} from "../../../../Shared/MeasureGroupPage"
import {Utilities} from "../../../../Shared/Utilities"
import {TestCasesPage} from "../../../../Shared/TestCasesPage"

let measureName = 'TestMeasure' + Date.now()
let CqlLibraryName = 'TestLibrary' + Date.now()
let testCaseTitle = 'Title for Auto Test'
let testCaseDescription = 'DENOMFail' + Date.now()
let testCaseSeries = 'SBTestSeries'
let testCaseJson = TestCaseJson.TestCaseJson_missingMetaProfile
let measureCQL = MeasureCQL.ICFCleanTest_CQL

//Skipping until feature flag is removed
describe.skip('QI-Core Test Case Ethnicity', () => {

    beforeEach('Create Measure, Measure Group and Test Case', () => {

        //Create New Measure
        cy.setAccessTokenCookie()
        CreateMeasurePage.CreateQICoreMeasureAPI(measureName, CqlLibraryName, measureCQL)
        MeasureGroupPage.CreateProportionMeasureGroupAPI(false, null, null, null, null, 'Procedure')
        TestCasesPage.CreateTestCaseAPI(testCaseTitle, testCaseDescription, testCaseSeries, testCaseJson)
    })

    afterEach('Clean up and Logout', () => {
        OktaLogin.Logout()
        Utilities.deleteMeasure(measureName, CqlLibraryName)

    })

    it('Edit QI-Core Test Case Ethnicity', () => {

        OktaLogin.Login()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        //Edit Test Case Ethnicity
        cy.get('[id="ethnicityDetailed"]').click()
        cy.get('[id="ethnicityDetailed-option-0"]').click()
        cy.get(TestCasesPage.editTestCaseSaveButton).click()
        cy.get('[data-testid="demographics-ethnicity-detailed-input"]').should('contain.text', 'Mexican', 'Spaniard')

    })

    it('Non Measure owner unable to Edit Test case ethnicity', () => {

        OktaLogin.AltLogin()
        cy.get(MeasuresPage.allMeasuresTab).click()
        cy.reload()

        //Click on Edit Measure
        MeasuresPage.measureAction("edit")

        cy.get(EditMeasurePage.testCasesTab).click()
        TestCasesPage.clickEditforCreatedTestCase()

        cy.get('[id="ethnicityDetailed"]').should('be.disabled')

    })
})
